"""
Read-only helper: page through every Xray "Test" issue in the RST project and
extract the "TestRail ID: C####" line embedded in each Test's description
(this is how the legacy, already-migrated tests record their origin -- our
own create_xray_tests.py does NOT set a description, so this field is a
reliable signal of "already migrated before this project's work started").

Writes scripts/xray_migration/legacy_key_map.json:
    { "<testrail-id-no-C-prefix>": ["RST-2305", ...], ... }

A TestRail ID normally maps to exactly one legacy key, but the list form
guards against any actual duplicates in the existing Test Repository.

Makes no writes to Jira/Xray -- this only reads and writes a local JSON file.

Usage:
    python scripts/xray_migration/build_legacy_key_map.py
"""
import json
import os
import re
import sys
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parents[2]
OUT_PATH = Path(__file__).resolve().parent / "legacy_key_map.json"
RAW_OUT_PATH = Path(__file__).resolve().parent / "legacy_tests_raw.json"

for _env_path in (
    REPO_ROOT / ".env",
    REPO_ROOT / "pytest-automation" / ".env",
    REPO_ROOT / "playwright-automation" / ".env",
):
    load_dotenv(_env_path)

XRAY_BASE_URL = os.getenv("XRAY_BASE_URL", "https://xray.cloud.getxray.app/api/v2")
JIRA_PROJECT_KEY = os.getenv("JIRA_PROJECT_KEY", "RST")
CLIENT_ID = os.getenv("XRAY_CLIENT_ID")
CLIENT_SECRET = os.getenv("XRAY_CLIENT_SECRET")

GET_TESTS_QUERY = """
query($jql: String!, $limit: Int!, $start: Int!) {
  getTests(jql: $jql, limit: $limit, start: $start) {
    total
    results {
      issueId
      jira(fields: ["key", "summary", "description", "labels"])
    }
  }
}
"""

TESTRAIL_ID_RE = re.compile(r"TestRail ID:\*?\s*C?(\d+)", re.IGNORECASE)


def authenticate() -> str:
    if not CLIENT_ID or not CLIENT_SECRET:
        raise SystemExit("XRAY_CLIENT_ID and XRAY_CLIENT_SECRET must be set")
    r = requests.post(
        f"{XRAY_BASE_URL}/authenticate",
        json={"client_id": CLIENT_ID, "client_secret": CLIENT_SECRET},
        timeout=30,
    )
    if not r.ok:
        raise SystemExit(f"Xray authenticate failed ({r.status_code}): {r.text}")
    token = r.json()
    if not isinstance(token, str):
        raise SystemExit("Unexpected Xray authenticate response format")
    return token


def main() -> None:
    token = authenticate()
    jql = f"project = {JIRA_PROJECT_KEY}"
    start = 0
    limit = 100
    all_results = []

    while True:
        r = requests.post(
            f"{XRAY_BASE_URL}/graphql",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            data=json.dumps({"query": GET_TESTS_QUERY, "variables": {"jql": jql, "limit": limit, "start": start}}),
            timeout=30,
        )
        if not r.ok:
            raise SystemExit(f"getTests failed ({r.status_code}): {r.text}")
        body = r.json()
        if body.get("errors"):
            raise SystemExit(f"GraphQL errors: {body['errors']}")

        page = body["data"]["getTests"]
        total = page["total"]
        results = page["results"]
        all_results.extend(results)
        print(f"  fetched {len(all_results)}/{total}")

        if len(all_results) >= total or not results:
            break
        start += limit
        time.sleep(0.2)

    legacy_map = {}
    unmatched_keys = []
    for t in all_results:
        fields = t["jira"]
        key = fields.get("key")
        desc = fields.get("description") or ""
        m = TESTRAIL_ID_RE.search(desc)
        if m:
            testrail_id = m.group(1)
            legacy_map.setdefault(testrail_id, []).append(key)
        else:
            unmatched_keys.append(key)

    OUT_PATH.write_text(json.dumps(legacy_map, indent=2, sort_keys=True), encoding="utf-8")
    RAW_OUT_PATH.write_text(
        json.dumps([t["jira"] for t in all_results], indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    dupes = {k: v for k, v in legacy_map.items() if len(v) > 1}
    print(f"\nTotal Test issues in {JIRA_PROJECT_KEY}: {len(all_results)}")
    print(f"With a TestRail ID in description: {len(legacy_map)} unique TestRail IDs ({sum(len(v) for v in legacy_map.values())} keys)")
    print(f"Without a TestRail ID (no legacy provenance, e.g. our own RST-3### creations): {len(unmatched_keys)}")
    print(f"TestRail IDs mapping to MULTIPLE keys (possible existing duplicates): {len(dupes)}")
    for k, v in list(dupes.items())[:20]:
        print(f"  C{k} -> {v}")
    print(f"\nWrote {OUT_PATH}")
    print(f"Wrote {RAW_OUT_PATH} (raw dump of every Test's key/summary/description/labels)")


if __name__ == "__main__":
    main()
