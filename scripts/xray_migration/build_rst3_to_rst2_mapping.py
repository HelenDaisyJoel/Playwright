"""
Join xray_case_mapping.json (TestRail ID -> our new RST-3### key, built during
this project's own migration) against legacy_key_map.json (TestRail ID ->
pre-existing legacy RST-2### key, built by build_legacy_key_map.py from the
live Xray Test Repository) to produce the exact RST-3### -> RST-2### renumber
mapping requested by the user.

Any current RST-3### key with no legacy counterpart (its TestRail ID was
never migrated before this project's work) is flagged separately -- these
keep their RST-3### number since there is nothing to rename them to.

Writes scripts/xray_migration/rst3_to_rst2_mapping.json:
    {
      "renumber": { "RST-3391": "RST-2xxx", ... },
      "no_legacy_match": ["RST-3xxx", ...],
      "testrail_id_used_by_multiple_rst3_keys": { "4101221": ["RST-3001","RST-3002"], ... }
    }

Read-only / local-file-only -- makes no Jira or Xray writes.

Usage:
    python scripts/xray_migration/build_rst3_to_rst2_mapping.py
"""
import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPT_DIR = Path(__file__).resolve().parent

CASE_MAPPING_PATH = REPO_ROOT / "xray_case_mapping.json"
LEGACY_MAP_PATH = SCRIPT_DIR / "legacy_key_map.json"
OUT_PATH = SCRIPT_DIR / "rst3_to_rst2_mapping.json"


def normalize_id(raw: str) -> str:
    return re.sub(r"^C", "", raw, flags=re.IGNORECASE)


def main() -> None:
    case_mapping = json.loads(CASE_MAPPING_PATH.read_text(encoding="utf-8"))
    legacy_map = json.loads(LEGACY_MAP_PATH.read_text(encoding="utf-8"))

    # testrail_id (bare numeric) -> [RST-3### key, ...]
    testrail_to_rst3 = {}
    for raw_id, entry in case_mapping.items():
        bare = normalize_id(raw_id)
        rst3_key = entry.get("jira_key")
        if rst3_key:
            testrail_to_rst3.setdefault(bare, []).append(rst3_key)

    dupes = {k: v for k, v in testrail_to_rst3.items() if len(v) > 1}

    renumber = {}
    no_legacy_match = []
    for bare_id, rst3_keys in testrail_to_rst3.items():
        legacy_keys = legacy_map.get(bare_id)
        for rst3_key in rst3_keys:
            if legacy_keys:
                # normally exactly one; if multiple, take the first and note it
                renumber[rst3_key] = legacy_keys[0]
            else:
                no_legacy_match.append(rst3_key)

    out = {
        "renumber": dict(sorted(renumber.items())),
        "no_legacy_match": sorted(no_legacy_match),
        "testrail_id_used_by_multiple_rst3_keys": dupes,
    }
    OUT_PATH.write_text(json.dumps(out, indent=2, sort_keys=False), encoding="utf-8")

    print(f"xray_case_mapping.json entries: {len(case_mapping)}")
    print(f"legacy_key_map.json TestRail IDs (with legacy RST-2### key): {len(legacy_map)}")
    print(f"RST-3### keys with an exact legacy match -> will be renumbered: {len(renumber)}")
    print(f"RST-3### keys with NO legacy match -> flagged, kept as-is: {len(no_legacy_match)}")
    print(f"TestRail IDs claimed by multiple RST-3### keys (needs review): {len(dupes)}")
    for k, v in list(dupes.items())[:20]:
        print(f"  {k} -> {v}")
    print(f"\nWrote {OUT_PATH}")


if __name__ == "__main__":
    main()
