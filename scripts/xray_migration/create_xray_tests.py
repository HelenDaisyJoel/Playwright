"""
One-time migration: create a real Xray "Test" issue in Jira project RST for
each case in xray_migration_inventory.json, and record the old-id -> new
Jira key mapping.

SAFETY:
  - Defaults to a dry run (prints what would be created, touches no network).
  - Real writes require BOTH --execute AND the env var
    XRAY_MIGRATION_CONFIRM=yes-create-real-issues set.
  - Resumable: anything already present in the mapping file is skipped, so a
    crash mid-run only risks the single in-flight call, never prior progress.
  - Use --limit N for a small smoke batch before running the full set.

Usage:
    python scripts/xray_migration/create_xray_tests.py                 # dry run, all
    python scripts/xray_migration/create_xray_tests.py --execute --limit 5
    XRAY_MIGRATION_CONFIRM=yes-create-real-issues \
      python scripts/xray_migration/create_xray_tests.py --execute --limit 5
"""
import argparse
import json
import os
import sys
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INVENTORY = REPO_ROOT / "xray_migration_inventory.json"
DEFAULT_MAPPING = REPO_ROOT / "xray_case_mapping.json"
CONFIRM_VALUE = "yes-create-real-issues"

# Credentials may live in a root .env, or in either suite's own .env --
# load whichever exist, first match wins for any given key.
for _env_path in (
    REPO_ROOT / ".env",
    REPO_ROOT / "pytest-automation" / ".env",
    REPO_ROOT / "playwright-automation" / ".env",
):
    load_dotenv(_env_path)

XRAY_BASE_URL = os.getenv("XRAY_BASE_URL", "https://xray.cloud.getxray.app/api/v2")
JIRA_PROJECT_KEY = os.getenv("JIRA_PROJECT_KEY")
CLIENT_ID = os.getenv("XRAY_CLIENT_ID")
CLIENT_SECRET = os.getenv("XRAY_CLIENT_SECRET")

CREATE_TEST_MUTATION = """
mutation($projectKey: String!, $summary: String!, $labels: [String]) {
  createTest(
    testType: { name: "Generic" }
    jira: {
      fields: { project: { key: $projectKey }, summary: $summary, labels: $labels }
    }
  ) {
    test {
      issueId
      jira(fields: ["key"])
    }
    warnings
  }
}
"""


def load_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def save_mapping(path: Path, mapping: dict) -> None:
    path.write_text(json.dumps(mapping, indent=2, sort_keys=True), encoding="utf-8")


def authenticate() -> str:
    if not CLIENT_ID or not CLIENT_SECRET:
        raise RuntimeError("❌ XRAY_CLIENT_ID and XRAY_CLIENT_SECRET must be set")
    r = requests.post(
        f"{XRAY_BASE_URL}/authenticate",
        json={"client_id": CLIENT_ID, "client_secret": CLIENT_SECRET},
        timeout=30,
    )
    if not r.ok:
        raise RuntimeError(f"❌ Xray authenticate failed ({r.status_code}): {r.text}")
    token = r.json()
    if not isinstance(token, str):
        raise RuntimeError("❌ Unexpected Xray authenticate response format")
    return token


def create_test(token: str, summary: str, labels: list) -> str:
    r = requests.post(
        f"{XRAY_BASE_URL}/graphql",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        data=json.dumps({
            "query": CREATE_TEST_MUTATION,
            "variables": {"projectKey": JIRA_PROJECT_KEY, "summary": summary, "labels": labels},
        }),
        timeout=30,
    )
    if not r.ok:
        raise RuntimeError(f"HTTP {r.status_code}: {r.text}")

    body = r.json()
    if body.get("errors"):
        raise RuntimeError(f"GraphQL errors: {body['errors']}")

    test = body["data"]["createTest"]["test"]
    key = test["jira"]["key"]
    warnings = body["data"]["createTest"].get("warnings") or []
    if warnings:
        print(f"  ⚠️ {key}: {warnings}")
    return key


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--inventory", type=Path, default=DEFAULT_INVENTORY)
    parser.add_argument("--mapping", type=Path, default=DEFAULT_MAPPING)
    parser.add_argument("--execute", action="store_true", help="Actually create issues in Jira")
    parser.add_argument("--limit", type=int, default=None, help="Only process the first N un-mapped cases")
    parser.add_argument("--sleep", type=float, default=0.3, help="Seconds to wait between API calls")
    args = parser.parse_args()

    inventory = load_json(args.inventory, [])
    if not inventory:
        raise SystemExit(f"❌ No inventory found at {args.inventory}. Run build_case_inventory.py first.")

    mapping = load_json(args.mapping, {})

    pending = [c for c in inventory if c["old_id"] not in mapping]
    print(f"Inventory: {len(inventory)} total, {len(mapping)} already mapped, {len(pending)} pending")

    if args.limit is not None:
        pending = pending[:args.limit]
        print(f"--limit {args.limit}: processing {len(pending)} case(s) this run")

    if not pending:
        print("Nothing to do.")
        return

    if not args.execute:
        print("\nDRY RUN (no network calls made). Preview of what would be created:\n")
        for c in pending:
            print(f"  {c['old_id']:<12} labels={c['labels']} summary={c['summary']!r}")
        print(f"\n{len(pending)} issue(s) would be created. Re-run with --execute to create them for real.")
        return

    if os.getenv("XRAY_MIGRATION_CONFIRM") != CONFIRM_VALUE:
        raise SystemExit(
            "❌ Refusing to create real Jira issues.\n"
            f"Set the env var XRAY_MIGRATION_CONFIRM={CONFIRM_VALUE} to confirm you intend to "
            f"permanently create {len(pending)} Test issue(s) in project {JIRA_PROJECT_KEY}."
        )

    if not JIRA_PROJECT_KEY:
        raise SystemExit("❌ JIRA_PROJECT_KEY must be set")

    token = authenticate()
    created, failed = 0, []

    for c in pending:
        try:
            key = create_test(token, c["summary"], c["labels"])
            mapping[c["old_id"]] = {"jira_key": key, "labels": c["labels"], "summary": c["summary"]}
            save_mapping(args.mapping, mapping)
            created += 1
            print(f"  ✅ {c['old_id']} -> {key}")
        except Exception as exc:
            failed.append((c["old_id"], str(exc)))
            print(f"  ❌ {c['old_id']}: {exc}")
        time.sleep(args.sleep)

    print(f"\nDone. Created {created}, failed {len(failed)}, mapping saved to {args.mapping}")
    if failed:
        print("Failed IDs (re-run the script to retry — already-mapped IDs are skipped):")
        for old_id, err in failed:
            print(f"  - {old_id}: {err}")


if __name__ == "__main__":
    main()
