# utils/okta_login.py
import os
from pathlib import Path

from utils.env_resolver import get_brand_role, get_env_by_prefix


def _get_credentials():
    """
    Resolve username/password/sq from env using BRAND & ROLE as provided on command line.
    Tries multiple suffix casings automatically.
    """
    br = get_brand_role()
    username = get_env_by_prefix("OKTA_USERNAME", br.brand, br.role)
    password = get_env_by_prefix("OKTA_PASSWORD", br.brand, br.role)
    sq = get_env_by_prefix("OKTA_SQ", br.brand, br.role) or ""

    if not username or not password:
        raise ValueError(
            f"❌ Missing Okta creds for BRAND={br.brand}, ROLE={br.role}.\n"
            f"Set one of these patterns (any casing is fine):\n"
            f"  OKTA_USERNAME_{br.brand}_{br.role}\n"
            f"  OKTA_PASSWORD_{br.brand}_{br.role}\n"
            f"(or uppercase variants like OKTA_USERNAME_{br.brand.upper()}_{br.role.upper()})"
        )

    return username, password, sq


def _auth_dir() -> Path:
    base = Path(__file__).resolve().parent.parent
    return base / ".auth"


def _auth_file_path() -> Path:
    br = get_brand_role()
    _auth_dir().mkdir(parents=True, exist_ok=True)
    return _auth_dir() / f"auth_{br.label}.json"


def login_and_save_storage_state(path: Path = None) -> Path:
    from playwright.sync_api import sync_playwright

    path = path or _auth_file_path()
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)

    username, password, sq = _get_credentials()
    base_url = os.environ.get("BASE_URL", "")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(ignore_https_errors=True)
        context.set_default_timeout(120_000)
        context.set_default_navigation_timeout(180_000)
        page = context.new_page()

        page.goto("https://nclh.okta.com/")
        page.fill("#input28", username)
        page.fill("#input36", password)
        page.click('[data-type="save"]')

        try:
            page.fill("#input70", sq)
            page.click('[data-type="save"]')
        except Exception:
            pass

        page.wait_for_url("**/app/**", timeout=180_000)

        if base_url:
            page.goto(base_url.rstrip("/") + "/dashboard")

        context.storage_state(path=str(path))
        browser.close()

    return path
