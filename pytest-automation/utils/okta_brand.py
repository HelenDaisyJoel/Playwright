# utils/okta_brand.py
import json
import os
from pathlib import Path
from typing import Optional
import requests

from utils.env_resolver import get_brand_role


def _auth_dir() -> Path:
    base = Path(__file__).resolve().parent.parent
    return base / ".auth"


def _default_auth_path() -> Path:
    explicit = os.environ.get("AUTH_STATE_PATH")
    if explicit:
        return Path(explicit)

    br = get_brand_role()
    return _auth_dir() / f"auth_{br.label}.json"


def load_playwright_storage_state(path: Optional[os.PathLike] = None) -> dict:
    path = Path(path or _default_auth_path())

    if not path.exists():
        from utils.okta_login import login_and_save_storage_state
        path = login_and_save_storage_state(path)

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def session_from_storage_state(state_path: Optional[os.PathLike] = None) -> requests.Session:
    state = load_playwright_storage_state(state_path)
    cookies_list = state.get("cookies") or []
    session = requests.Session()
    session.verify = False

    try:
        from urllib3.exceptions import InsecureRequestWarning
        import urllib3
        urllib3.disable_warnings(InsecureRequestWarning)
    except Exception:
        pass

    for c in cookies_list:
        name = c.get("name")
        value = c.get("value")
        domain = c.get("domain") or ""
        path = c.get("path") or "/"
        if not name or value is None:
            continue
        session.cookies.set(
            name=name,
            value=value,
            domain=domain or None,
            path=path,
            secure=c.get("secure", False),
        )
    return session


_cached_session: Optional[requests.Session] = None


def get_authenticated_session(state_path: Optional[os.PathLike] = None) -> requests.Session:
    global _cached_session
    if _cached_session is not None:
        return _cached_session
    _cached_session = session_from_storage_state(state_path=state_path)
    return _cached_session
