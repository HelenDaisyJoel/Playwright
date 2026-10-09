"""
Read-only diagnostic: verify JIRA_BASE_URL + Jira REST v3 Basic Auth
credentials work, by calling GET /rest/api/3/myself. Never prints the
credential values themselves -- only JIRA_BASE_URL (not a secret) and the
resulting HTTP status / response body, which for /myself contains no secret.

Usage:
    python scripts/xray_migration/check_jira_rest_auth.py
"""
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parents[1].parent

for env_path in (
    REPO_ROOT / ".env",
    REPO_ROOT / "pytest-automation" / ".env",
    REPO_ROOT / "playwright-automation" / ".env",
):
    load_dotenv(env_path)

JIRA_BASE_URL = os.getenv("JIRA_BASE_URL", "https://nclholdings.atlassian.net")
JIRA_EMAIL = os.getenv("JIRA_EMAIL") or os.getenv("JIRA_SERVICE_ACCOUNT_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN") or os.getenv("XRAY_API_KEY")

print(f"JIRA_BASE_URL: {JIRA_BASE_URL}")
print(f"Email var set: {bool(JIRA_EMAIL)}")
print(f"Token var set: {bool(JIRA_API_TOKEN)}")

if not JIRA_EMAIL or not JIRA_API_TOKEN:
    raise SystemExit("❌ Missing email or token env var")

r = requests.get(
    f"{JIRA_BASE_URL}/rest/api/3/myself",
    auth=(JIRA_EMAIL, JIRA_API_TOKEN),
    headers={"Accept": "application/json"},
    timeout=30,
)
print(f"Status: {r.status_code}")
print(f"Body: {r.text[:500]}")
