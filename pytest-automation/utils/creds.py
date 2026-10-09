import os
from dotenv import load_dotenv
load_dotenv()

def get_selected_creds(brand: str, role: str):
    if not brand or not role:
        raise RuntimeError("❌ BRAND and ROLE must be provided")

    brand = brand.upper().strip()
    role_u = role.upper().strip()

    username = os.getenv(f"OKTA_USERNAME_{brand}_{role_u}")
    password = os.getenv(f"OKTA_PASSWORD_{brand}_{role_u}")
    sq = os.getenv(f"OKTA_SQ_{brand}_{role_u}") or ""

    if not username or not password:
        raise RuntimeError(
            f"❌ Missing username/password for BRAND={brand}, ROLE={role.lower()}.\n"
            f"Expected:\n"
            f"  OKTA_USERNAME_{brand}_{role_u}\n"
            f"  OKTA_PASSWORD_{brand}_{role_u}\n"
        )

    return {"username": username, "password": password, "sq": sq}
