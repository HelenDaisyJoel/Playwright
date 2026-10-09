"""
Attach the Playwright HTML report for a Smoke Suite run as a file attachment
on a Jira issue (typically the Xray Test Execution created for that run).

Zips playwright-automation/html-report/run-* (the most recent run directory,
or one passed via --report-dir) and uploads it to
POST /rest/api/3/issue/{issue_key}/attachments.

Uses the same Jira REST v3 credentials as post_execution_report.py --
JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, falling back to this repo's
JIRA_SERVICE_ACCOUNT_EMAIL / XRAY_API_KEY when the former aren't set.

SAFETY:
  - Defaults to a dry run (prints what would be uploaded, touches no network).
  - Real uploads require BOTH --execute AND the env var
    XRAY_MIGRATION_CONFIRM=yes-create-real-issues set (same gate as the rest
    of this directory's scripts).

Usage:
    python scripts/xray_migration/attach_execution_report.py --issue-key RST-3690
    XRAY_MIGRATION_CONFIRM=yes-create-real-issues \
      python scripts/xray_migration/attach_execution_report.py --issue-key RST-3690 --execute
"""
import argparse
import os
import shutil
import sys
import tempfile
from pathlib import Path

import requests
from dotenv import load_dotenv

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parents[2]
PLAYWRIGHT_DIR = REPO_ROOT / "playwright-automation"
DEFAULT_REPORT_ROOT = PLAYWRIGHT_DIR / "html-report"
XRAY_DIR = PLAYWRIGHT_DIR / ".xray"
CONFIRM_VALUE = "yes-create-real-issues"

for _env_path in (
    REPO_ROOT / ".env",
    REPO_ROOT / "pytest-automation" / ".env",
    REPO_ROOT / "playwright-automation" / ".env",
):
    load_dotenv(_env_path)

JIRA_BASE_URL = os.getenv("JIRA_BASE_URL", "https://nclholdings.atlassian.net")
JIRA_EMAIL = os.getenv("JIRA_EMAIL") or os.getenv("JIRA_SERVICE_ACCOUNT_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN") or os.getenv("XRAY_API_KEY")


def load_key_file(path: Path, label: str) -> str:
    if not path.exists():
        raise SystemExit(f"❌ No {label} found at {path}. Run the earlier steps first.")
    return path.read_text(encoding="utf-8").strip()


def find_latest_report_dir(report_root: Path) -> Path:
    if not report_root.exists():
        raise SystemExit(f"❌ No report directory found at {report_root}.")
    run_dirs = sorted(
        (p for p in report_root.iterdir() if p.is_dir() and p.name.startswith("run-")),
        key=lambda p: p.name,
    )
    if not run_dirs:
        raise SystemExit(f"❌ No run-* report directories found under {report_root}.")
    return run_dirs[-1]


def build_zip(report_dir: Path, issue_key: str) -> Path:
    tmp_dir = Path(tempfile.mkdtemp(prefix="smoke-report-"))
    zip_base = tmp_dir / f"smoke-report-{issue_key}-{report_dir.name}"
    zip_path = Path(shutil.make_archive(str(zip_base), "zip", root_dir=report_dir))
    return zip_path


def upload_attachment(issue_key: str, zip_path: Path) -> None:
    if not JIRA_EMAIL or not JIRA_API_TOKEN:
        raise SystemExit("❌ JIRA_EMAIL and JIRA_API_TOKEN must be set to attach a file to Jira")

    with zip_path.open("rb") as f:
        r = requests.post(
            f"{JIRA_BASE_URL}/rest/api/3/issue/{issue_key}/attachments",
            auth=(JIRA_EMAIL, JIRA_API_TOKEN),
            headers={"X-Atlassian-Token": "no-check"},
            files={"file": (zip_path.name, f, "application/zip")},
            timeout=60,
        )
    if not r.ok:
        raise SystemExit(f"❌ Attach failed ({r.status_code}): {r.text}")
    body = r.json()
    names = [item.get("filename") for item in body] if isinstance(body, list) else [body.get("filename")]
    print(f"✅ Attached {names} to {issue_key}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--issue-key", type=str, default=None, help="Jira issue to attach the report to")
    parser.add_argument("--report-dir", type=Path, default=None, help="Specific html-report/run-* directory to zip")
    parser.add_argument("--execute", action="store_true", help="Actually upload the attachment to Jira")
    args = parser.parse_args()

    issue_key = args.issue_key or load_key_file(XRAY_DIR / "execution-key.txt", "execution key file")
    report_dir = args.report_dir or find_latest_report_dir(DEFAULT_REPORT_ROOT)
    if not report_dir.exists():
        raise SystemExit(f"❌ Report directory does not exist: {report_dir}")

    zip_path = build_zip(report_dir, issue_key)
    size_kb = zip_path.stat().st_size / 1024

    print(f"Issue key:    {issue_key}")
    print(f"Report dir:   {report_dir}")
    print(f"Zip file:     {zip_path} ({size_kb:.1f} KB)")

    if not args.execute:
        print("\nDRY RUN (no network calls made). Re-run with --execute to upload for real.")
        return

    if os.getenv("XRAY_MIGRATION_CONFIRM") != CONFIRM_VALUE:
        raise SystemExit(
            "❌ Refusing to upload a real Jira attachment.\n"
            f"Set the env var XRAY_MIGRATION_CONFIRM={CONFIRM_VALUE} to confirm you intend to "
            f"permanently attach this report to {issue_key}."
        )

    upload_attachment(issue_key, zip_path)


if __name__ == "__main__":
    main()
