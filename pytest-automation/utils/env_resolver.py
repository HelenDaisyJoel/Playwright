import os
from dataclasses import dataclass
from typing import Optional, List

@dataclass(frozen=True)
class BrandRole:
    brand: str
    role: str

    @property
    def label(self) -> str:
        return f"{self.brand}_{self.role}"


def get_brand_role() -> BrandRole:
    """
    Reads BRAND and ROLE from environment (so command line works):
      BRAND=REGENT ROLE=manager pytest ...
    """
    brand = os.environ.get("BRAND")
    role = os.environ.get("ROLE")
    if not brand or not role:
        raise ValueError("❌ BRAND and ROLE must be set (e.g. BRAND=REGENT ROLE=manager)")
    return BrandRole(brand=brand.strip(), role=role.strip())


def _suffix_candidates(brand: str, role: str) -> List[str]:
    """
    Try a few common casings to avoid mismatches:
      REGENT_manager
      REGENT_MANAGER
      regent_manager
      REGENT_manager, etc.
    """
    b = brand.strip()
    r = role.strip()
    return [
        f"{b}_{r}",
        f"{b.upper()}_{r}",
        f"{b}_{r.upper()}",
        f"{b.upper()}_{r.upper()}",
        f"{b.lower()}_{r.lower()}",
    ]


def get_env_by_prefix(prefix: str, brand: str, role: str) -> Optional[str]:
    """
    prefix examples:
      OKTA_USERNAME
      OKTA_PASSWORD
      OKTA_SQ
    Returns the first matching env var value among candidate suffixes.
    """
    for suffix in _suffix_candidates(brand, role):
        key = f"{prefix}_{suffix}"
        val = os.environ.get(key)
        if val:
            return val
    return None
