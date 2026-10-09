"""
Read-only helper: print the FULL Jira field set for one or more Xray Test
issues (key, summary, description, labels) via getTests GraphQL, so we can
check whether a legacy TestRail case ID is recorded anywhere (description
text, labels, etc.) that would let us join old RST-2### tests to the
xray_case_mapping.json inventory programmatically instead of by fuzzy title
matching. Makes no writes.

Usage:
    python scripts/xray_migration/inspect_test_full.py RST-2305 RST-2356 RST-2412
"""
import argparse
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parents[2]

for _env_path in (
    REPO_ROOT / ".env",
    REPO_ROOT / "pytest-automation" / ".env",
    REPO_ROOT / "playwright-automation" / ".env",
):
    load_dotenv(_env_path)

XRAY_BASE_URL = os.getenv("XRAY_BASE_URL", "https://xray.cloud.getxray.app/api/v2")
CLIENT_ID = os.getenv("XRAY_CLIENT_ID")
CLIENT_SECRET = os.getenv("XRAY_CLIENT_SECRET")

GET_TESTS_QUERY = """
query($jql: String!) {
  getTests(jql: $jql, limit: 50) {
    total
    results {
      issueId
      jira(fields: ["key", "summary", "description", "labels", "created", "updated"])
      testType { name }
    }
  }
}
"""


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
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("keys", nargs="+", help="One or more RST-#### keys")
    args = parser.parse_args()

    jql = f"key in ({','.join(args.keys)})"
    token = authenticate()
    r = requests.post(
        f"{XRAY_BASE_URL}/graphql",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        data=json.dumps({"query": GET_TESTS_QUERY, "variables": {"jql": jql}}),
        timeout=30,
    )
    if not r.ok:
        raise SystemExit(f"getTests failed ({r.status_code}): {r.text}")
    body = r.json()
    if body.get("errors"):
        raise SystemExit(f"GraphQL errors: {body['errors']}")

    results = body["data"]["getTests"]["results"]
    for t in results:
        fields = t["jira"]
        print("=" * 60)
        print(json.dumps(fields, indent=2, ensure_ascii=False))
        print(f"testType: {t.get('testType', {}).get('name')}")


if __name__ == "__main__":
    main()
