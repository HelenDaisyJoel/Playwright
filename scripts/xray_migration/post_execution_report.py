"""
Post a Smoke Suite execution summary as a Jira comment on the new Test Plan.

Reads playwright-automation/test-results/results.json (Playwright's built-in
JSON reporter output, added to playwright.config.ts's reporter array) for
counts/durations/failures, and playwright-automation/.xray/{test-plan-key,
execution-key}.txt for the issue to comment on and the Test Execution to
reference.

Posting a comment is a plain Jira action (not a test-management concept), so
unlike every other script in this directory it needs real Jira REST v3
credentials -- JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN -- rather than
XRAY_CLIENT_ID/XRAY_CLIENT_SECRET. JIRA_BASE_URL defaults to the Jira Cloud
site confirmed live during this migration (nclholdings.atlassian.net).
This repo's .env files name these JIRA_SERVICE_ACCOUNT_EMAIL / XRAY_API_KEY
instead, so those are used as fallbacks when JIRA_EMAIL / JIRA_API_TOKEN
aren't set.

SAFETY:
  - Defaults to a dry run (prints the comment body, touches no network).
  - Real writes require BOTH --execute AND the env var
    XRAY_MIGRATION_CONFIRM=yes-create-real-issues set (same gate as the rest
    of this directory's scripts).

Usage:
    python scripts/xray_migration/post_execution_report.py
    XRAY_MIGRATION_CONFIRM=yes-create-real-issues \
      python scripts/xray_migration/post_execution_report.py --execute
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
PLAYWRIGHT_DIR = REPO_ROOT / "playwright-automation"
DEFAULT_RESULTS = PLAYWRIGHT_DIR / "test-results" / "results.json"
XRAY_DIR = PLAYWRIGHT_DIR / ".xray"
CONFIRM_VALUE = "yes-create-real-issues"
MAX_FAILURES_LISTED = 20
ERROR_SNIPPET_LEN = 300

for _env_path in (
    REPO_ROOT / ".env",
    REPO_ROOT / "pytest-automation" / ".env",
    REPO_ROOT / "playwright-automation" / ".env",
):
    load_dotenv(_env_path)

JIRA_BASE_URL = os.getenv("JIRA_BASE_URL", "https://nclholdings.atlassian.net")
JIRA_EMAIL = os.getenv("JIRA_EMAIL") or os.getenv("JIRA_SERVICE_ACCOUNT_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN") or os.getenv("XRAY_API_KEY")


def load_json(path: Path, label: str) -> dict:
    if not path.exists():
        raise SystemExit(f"❌ No {label} found at {path}.")
    return json.loads(path.read_text(encoding="utf-8"))


def load_key_file(path: Path, label: str) -> str:
    if not path.exists():
        raise SystemExit(f"❌ No {label} found at {path}. Run the earlier steps first.")
    return path.read_text(encoding="utf-8").strip()


def collect_specs(suites: list, out: list) -> None:
    for suite in suites:
        for spec in suite.get("specs", []):
            for test in spec.get("tests", []):
                results = test.get("results", [])
                last = results[-1] if results else {}
                errors = last.get("errors") or ([last["error"]] if last.get("error") else [])
                message = errors[0].get("message") if errors else None
                out.append({
                    "title": spec.get("title", ""),
                    "file": spec.get("file", ""),
                    "status": test.get("status", "unknown"),
                    "message": message,
                })
        collect_specs(suite.get("suites", []), out)


def clean_snippet(message: str) -> str:
    first_line = message.strip().splitlines()[0] if message.strip() else ""
    return first_line[:ERROR_SNIPPET_LEN]


def build_comment_lines(results: dict, test_plan_key: str, execution_key: str) -> list:
    stats = results.get("stats", {})
    passed = stats.get("expected", 0)
    failed = stats.get("unexpected", 0)
    flaky = stats.get("flaky", 0)
    skipped = stats.get("skipped", 0)
    total = passed + failed + flaky + skipped
    duration_s = round(stats.get("duration", 0) / 1000, 1)
    start_time = stats.get("startTime", "")

    specs: list = []
    collect_specs(results.get("suites", []), specs)
    failures = [s for s in specs if s["status"] == "unexpected"]

    lines = [
        "Smoke Suite execution report",
        f"Test Plan: {test_plan_key}",
        f"Test Execution: {execution_key}",
        f"Run started: {start_time}",
        f"Duration: {duration_s}s",
        "",
        f"Total: {total}  Passed: {passed}  Failed: {failed}  Flaky: {flaky}  Skipped: {skipped}",
    ]

    if failures:
        lines.append("")
        lines.append(f"Failed tests ({len(failures)}):")
        for f in failures[:MAX_FAILURES_LISTED]:
            snippet = clean_snippet(f["message"]) if f["message"] else "(no error message captured)"
            lines.append(f"  - {f['title']} -- {snippet}")
        if len(failures) > MAX_FAILURES_LISTED:
            lines.append(f"  ... and {len(failures) - MAX_FAILURES_LISTED} more")

    return lines


def build_adf_comment(lines: list) -> dict:
    content = []
    content.append({
        "type": "heading",
        "attrs": {"level": 3},
        "content": [{"type": "text", "text": lines[0]}],
    })
    for line in lines[1:]:
        if line == "":
            continue
        content.append({
            "type": "paragraph",
            "content": [{"type": "text", "text": line}],
        })
    return {"type": "doc", "version": 1, "content": content}


def post_comment(issue_key: str, adf_body: dict) -> None:
    if not JIRA_EMAIL or not JIRA_API_TOKEN:
        raise SystemExit("❌ JIRA_EMAIL and JIRA_API_TOKEN must be set to post a Jira comment")

    r = requests.post(
        f"{JIRA_BASE_URL}/rest/api/3/issue/{issue_key}/comment",
        auth=(JIRA_EMAIL, JIRA_API_TOKEN),
        headers={"Content-Type": "application/json"},
        data=json.dumps({"body": adf_body}),
        timeout=30,
    )
    if not r.ok:
        raise SystemExit(f"❌ Post comment failed ({r.status_code}): {r.text}")
    print(f"✅ Comment posted to {issue_key} (comment id {r.json().get('id')})")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--results", type=Path, default=DEFAULT_RESULTS)
    parser.add_argument("--test-plan-key", type=str, default=None)
    parser.add_argument("--execute", action="store_true", help="Actually post the comment to Jira")
    args = parser.parse_args()

    results = load_json(args.results, "Playwright JSON results")
    test_plan_key = args.test_plan_key or load_key_file(XRAY_DIR / "test-plan-key.txt", "test plan key file")
    execution_key = load_key_file(XRAY_DIR / "execution-key.txt", "execution key file")

    lines = build_comment_lines(results, test_plan_key, execution_key)
    print("\n".join(lines))

    if not args.execute:
        print("\nDRY RUN (no network calls made). Re-run with --execute to post for real.")
        return

    if os.getenv("XRAY_MIGRATION_CONFIRM") != CONFIRM_VALUE:
        raise SystemExit(
            "❌ Refusing to post a real Jira comment.\n"
            f"Set the env var XRAY_MIGRATION_CONFIRM={CONFIRM_VALUE} to confirm you intend to "
            f"permanently post this comment on {test_plan_key}."
        )

    adf_body = build_adf_comment(lines)
    post_comment(test_plan_key, adf_body)


if __name__ == "__main__":
    main()
