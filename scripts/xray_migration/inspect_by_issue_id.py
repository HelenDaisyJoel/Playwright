"""
Read-only helper: look up an Xray Test Plan or Test Execution by its numeric
Jira issueId (as seen in a Jira URL, e.g. ...&testPlanId=632124) rather than
its RST-#### key, and print its key/summary plus every associated test's key.
Makes no writes.

Usage:
    python scripts/xray_migration/inspect_by_issue_id.py --plan 632124
    python scripts/xray_migration/inspect_by_issue_id.py --execution 632125
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

GET_TEST_PLANS_BY_ID = """
query($issueIds: [String]) {
  getTestPlans(issueIds: $issueIds, limit: 1) {
    total
    results {
      issueId
      jira(fields: ["key", "summary", "issuetype", "status"])
      tests(limit: 100) {
        total
        results { jira(fields: ["key", "summary"]) }
      }
    }
  }
}
"""

GET_TEST_EXECUTIONS_BY_ID = """
query($issueIds: [String]) {
  getTestExecutions(issueIds: $issueIds, limit: 1) {
    total
    results {
      issueId
      jira(fields: ["key", "summary", "issuetype", "status"])
      tests(limit: 100) {
        total
        results {
          jira(fields: ["key", "summary"])
          status { name }
        }
      }
      testPlans(limit: 5) {
        results { jira(fields: ["key"]) }
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


def graphql(token: str, query: str, variables: dict) -> dict:
    r = requests.post(
        f"{XRAY_BASE_URL}/graphql",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        data=json.dumps({"query": query, "variables": variables}),
        timeout=30,
    )
    if not r.ok:
        raise SystemExit(f"❌ GraphQL call failed ({r.status_code}): {r.text}")
    body = r.json()
    if body.get("errors"):
        raise SystemExit(f"❌ GraphQL errors: {body['errors']}")
    return body["data"]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--plan", type=str, help="Numeric Jira issueId of a Test Plan")
    parser.add_argument("--execution", type=str, help="Numeric Jira issueId of a Test Execution")
    args = parser.parse_args()

    if not args.plan and not args.execution:
        raise SystemExit("❌ Pass --plan and/or --execution with a numeric issueId")

    token = authenticate()

    if args.plan:
        data = graphql(token, GET_TEST_PLANS_BY_ID, {"issueIds": [args.plan]})["getTestPlans"]
        if not data["results"]:
            print(f"❌ No Test Plan found for issueId {args.plan}")
        else:
            tp = data["results"][0]
            fields = tp["jira"]
            tests = tp["tests"]
            print(f"=== Test Plan issueId {args.plan} ===")
            print(f"key: {fields.get('key')}  summary: {fields.get('summary')}  status: {fields.get('status')}")
            print(f"associated tests: {tests['total']}")
            for t in tests["results"]:
                print(f"  - {t['jira'].get('key')}: {t['jira'].get('summary')}")

    if args.execution:
        data = graphql(token, GET_TEST_EXECUTIONS_BY_ID, {"issueIds": [args.execution]})["getTestExecutions"]
        if not data["results"]:
            print(f"❌ No Test Execution found for issueId {args.execution}")
        else:
            te = data["results"][0]
            fields = te["jira"]
            tests = te["tests"]
            plans = te["testPlans"]["results"]
            print(f"\n=== Test Execution issueId {args.execution} ===")
            print(f"key: {fields.get('key')}  summary: {fields.get('summary')}  status: {fields.get('status')}")
            print(f"linked test plan(s): {[p['jira'].get('key') for p in plans]}")
            print(f"associated tests: {tests['total']}")
            for t in tests["results"]:
                status = t.get("status", {}).get("name")
                print(f"  - {t['jira'].get('key')}: {t['jira'].get('summary')} [{status}]")


if __name__ == "__main__":
    main()
