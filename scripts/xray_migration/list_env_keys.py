"""
Read-only helper: print which env var NAMES (never values) are defined across
the repo's .env files, so a missing-credential error can be diagnosed without
ever printing a secret. Mirrors the same .env search order as every other
script in this directory.

Usage:
    python scripts/xray_migration/list_env_keys.py
"""
import sys
from pathlib import Path

from dotenv import dotenv_values

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parents[2]

for env_path in (
    REPO_ROOT / ".env",
    REPO_ROOT / "pytest-automation" / ".env",
    REPO_ROOT / "playwright-automation" / ".env",
):
    print(f"{env_path} exists={env_path.exists()}")
    if env_path.exists():
        for key in dotenv_values(env_path).keys():
            print(f"  - {key}")
