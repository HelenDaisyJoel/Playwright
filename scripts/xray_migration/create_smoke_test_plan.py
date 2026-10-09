"""
Create a new Xray Test Plan issue covering the Playwright @smoke suite, and
associate the scope's primary_keys (scripts/xray_migration/smoke_test_plan_scope.json)
with it in the same call, via Xray's own createTestPlan GraphQL mutation.

primary_keys holds one Xray Test key per physical @smoke test (its title's
FIRST bracketed key) -- this matches the reference plan RST-3125's shape
(one Test Plan association per line item). It intentionally does NOT include
every key in every test's bracket (that full set is unique_keys, used instead
for the Test Execution created by global-setup.ts, since xray-reporter.ts
reports a result to every key in the bracket, not just the first). The 42
Playwright @smoke tests currently resolve to 37 distinct primary keys because
5 of them are the exact same manual case re-run under a second describe block
for a different role -- this is the existing suite's structure and is left
untouched; the Test Plan simply reflects it as-is.

Uses only XRAY_CLIENT_ID / XRAY_CLIENT_SECRET (same creds as every other script
in this directory) -- no separate Jira REST credentials needed, since Xray's
GraphQL schema can create arbitrary Jira issue types (not just "Test") through
createTestPlan's `jira: JSON!` argument, structured per the Jira REST v3
issue-create spec.

SAFETY:
  - Defaults to a dry run (prints what would be created, touches no network).
  - Real writes require BOTH --execute AND the env var
    XRAY_MIGRATION_CONFIRM=yes-create-real-issues set (same gate as
    create_xray_tests.py).
  - Saves the new Test Plan key to playwright-automation/.xray/test-plan-key.txt
    for the Step 6 (run suite) and Step 7 (post report) scripts.

Usage:
    python scripts/xray_migration/create_smoke_test_plan.py
    XRAY_MIGRATION_CONFIRM=yes-create-real-issues \
      python scripts/xray_migration/create_smoke_test_plan.py --execute
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
DEFAULT_SCOPE = Path(__file__).resolve().parent / "smoke_test_plan_scope.json"
XRAY_DIR = REPO_ROOT / "playwright-automation" / ".xray"
CONFIRM_VALUE = "yes-create-real-issues"
MAX_TESTS_PER_CALL = 100  # Xray's documented bulk-association batch limit

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

SUMMARY = "QA1 - GUI - Smoke Suite Test Plan"
DESCRIPTION_TEXT = (
    "Test Plan for the Playwright @smoke suite. Tracks execution results for "
    "the smoke-tagged tests across playwright-automation/tests/*.spec.ts."
)

GET_TESTS_QUERY = """
query($jql: String!, $limit: Int!, $start: Int!) {
  getTests(jql: $jql, limit: $limit, start: $start) {
    total
    start
    results {
      issueId
      jira(fields: ["key"])
    }
  }
}
"""

CREATE_TEST_PLAN_MUTATION = """
mutation($jira: JSON!, $testIssueIds: [String]) {
  createTestPlan(jira: $jira, testIssueIds: $testIssueIds) {
    testPlan {
      issueId
      jira(fields: ["key"])
    }
    warnings
  }
}
"""

ADD_TESTS_TO_TEST_PLAN_MUTATION = """
mutation($issueId: String!, $testIssueIds: [String]!) {
  addTestsToTestPlan(issueId: $issueId, testIssueIds: $testIssueIds) {
    addedTests
    warning
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


def resolve_issue_ids(token: str, keys: list) -> list:
    jql = f"project = {JIRA_PROJECT_KEY} AND key in ({', '.join(keys)})"
    issue_ids, limit, start = [], 100, 0
    while True:
        data = graphql(token, GET_TESTS_QUERY, {"jql": jql, "limit": limit, "start": start})["getTests"]
        issue_ids.extend(item["issueId"] for item in data["results"])
        start += limit
        if start >= data.get("total", 0) or not data["results"]:
            break
    return issue_ids


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--scope", type=Path, default=DEFAULT_SCOPE)
    parser.add_argument("--execute", action="store_true", help="Actually create the Test Plan in Jira")
    args = parser.parse_args()

    if not args.scope.exists():
        raise SystemExit(f"❌ No scope file at {args.scope}. Run build_smoke_test_plan_scope.py first.")
    scope = json.loads(args.scope.read_text(encoding="utf-8"))
    if "primary_keys" not in scope:
        raise SystemExit(
            f"❌ {args.scope} has no primary_keys field. Re-run build_smoke_test_plan_scope.py to regenerate it."
        )
    keys = scope["primary_keys"]

    print(f"Summary:            {SUMMARY}")
    print(f"Project:            {JIRA_PROJECT_KEY}")
    print(f"Issue type:         Test Plan")
    print(f"Smoke tests:        {scope['total_tests']}")
    print(f"Primary test keys:  {len(keys)} (one per physical @smoke test; duplicates across role-scoped re-runs of the same case naturally collapse)")

    if not args.execute:
        print("\nDRY RUN (no network calls made). Re-run with --execute to create for real.")
        return

    if os.getenv("XRAY_MIGRATION_CONFIRM") != CONFIRM_VALUE:
        raise SystemExit(
            "❌ Refusing to create a real Jira issue.\n"
            f"Set the env var XRAY_MIGRATION_CONFIRM={CONFIRM_VALUE} to confirm you intend to "
            f"permanently create a Test Plan issue in project {JIRA_PROJECT_KEY} and link {len(keys)} test(s) to it."
        )

    token = authenticate()

    print(f"\nResolving issueId(s) for {len(keys)} test key(s)...")
    issue_ids = resolve_issue_ids(token, keys)
    print(f"Resolved {len(issue_ids)}/{len(keys)} test issueId(s)")
    if len(issue_ids) != len(keys):
        print("⚠️ Some keys did not resolve to a Test issue -- check for typos or wrong issue type.")

    first_batch, remaining = issue_ids[:MAX_TESTS_PER_CALL], issue_ids[MAX_TESTS_PER_CALL:]

    jira_fields = {
        "fields": {
            "project": {"key": JIRA_PROJECT_KEY},
            "summary": SUMMARY,
            "description": DESCRIPTION_TEXT,
        }
    }
    result = graphql(
        token,
        CREATE_TEST_PLAN_MUTATION,
        {"jira": jira_fields, "testIssueIds": first_batch},
    )["createTestPlan"]

    for w in result.get("warnings") or []:
        print(f"  ⚠️ {w}")

    plan = result["testPlan"]
    plan_key = plan["jira"]["key"]
    plan_issue_id = plan["issueId"]
    print(f"✅ Created Test Plan: {plan_key} (with {len(first_batch)} test(s) associated)")

    for i in range(0, len(remaining), MAX_TESTS_PER_CALL):
        chunk = remaining[i:i + MAX_TESTS_PER_CALL]
        add_result = graphql(
            token,
            ADD_TESTS_TO_TEST_PLAN_MUTATION,
            {"issueId": plan_issue_id, "testIssueIds": chunk},
        )["addTestsToTestPlan"]
        if add_result.get("warning"):
            print(f"  ⚠️ {add_result['warning']}")
        print(f"  ✅ Associated {len(chunk)} more test(s)")

    XRAY_DIR.mkdir(parents=True, exist_ok=True)
    (XRAY_DIR / "test-plan-key.txt").write_text(plan_key, encoding="utf-8")
    print(f"\n✅ Done. Test Plan {plan_key} created with {len(issue_ids)} test(s) associated.")
    print(f"Saved to {XRAY_DIR / 'test-plan-key.txt'}")


if __name__ == "__main__":
    main()
