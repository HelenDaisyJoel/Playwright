"""
Read-only helper: print an Xray Test Plan issue's summary/description/status
and how many Tests are associated with it, via Xray's getTestPlans GraphQL
query. Makes no writes.

Usage:
    python scripts/xray_migration/inspect_test_plan.py RST-3126
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

GET_TEST_PLANS_QUERY = """
query($jql: String!) {
  getTestPlans(jql: $jql, limit: 1) {
    total
    results {
      issueId
      jira(fields: ["key", "summary", "issuetype", "status", "description", "labels"])
      tests(limit: 100) {
        total
        results {
          jira(fields: ["key"])
        }
      }
    }
  }
}
"""


def authenticate() -> str:
    if not CLIENT_ID or not CLIENT_SECRET:
        raise SystemExit("❌ XRAY_CLIENT_ID and XRAY_CLIENT_SECRET must be set")
    r = requests.post(
        f"{XRAY_BASE_URL}/authenticate",
        json={"client_id": CLIENT_ID, "client_secret": CLIENT_SECRET},
        timeout=30,
    )
    if not r.ok:
        raise SystemExit(f"❌ Xray authenticate failed ({r.status_code}): {r.text}")
    token = r.json()
    if not isinstance(token, str):
        raise SystemExit("❌ Unexpected Xray authenticate response format")
    return token


def main() -> None:
    parser = argparse.ArgumentParser(description="Usage: python inspect_test_plan.py <ISSUE-KEY>")
    parser.add_argument("key")
    parser.add_argument("--full", action="store_true", help="Print all associated test keys, not just the first 20")
    args = parser.parse_args()
    key = args.key

    token = authenticate()
    r = requests.post(
        f"{XRAY_BASE_URL}/graphql",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        data=json.dumps({"query": GET_TEST_PLANS_QUERY, "variables": {"jql": f"key = {key}"}}),
        timeout=30,
    )
    if not r.ok:
        raise SystemExit(f"❌ getTestPlans failed ({r.status_code}): {r.text}")

    body = r.json()
    if body.get("errors"):
        raise SystemExit(f"❌ GraphQL errors: {body['errors']}")

    results = body["data"]["getTestPlans"]["results"]
    if not results:
        raise SystemExit(f"❌ No Test Plan found for {key} (wrong key, or it's not a Test Plan issue type)")

    tp = results[0]
    fields = tp["jira"]
    tests = tp["tests"]
    print(f"issueId:    {tp['issueId']}")
    print(f"key:        {fields.get('key')}")
    print(f"issuetype:  {fields.get('issuetype')}")
    print(f"status:     {fields.get('status')}")
    print(f"summary:    {fields.get('summary')}")
    print(f"labels:     {fields.get('labels')}")
    print(f"description:\n{fields.get('description')}")
    print(f"\nassociated tests: {tests['total']}")
    shown = tests["results"] if args.full else tests["results"][:20]
    for t in shown:
        print(f"  - {t['jira'].get('key')}")
    if not args.full and tests["total"] > 20:
        print(f"  ... and {tests['total'] - 20} more (use --full to see all)")


if __name__ == "__main__":
    main()
