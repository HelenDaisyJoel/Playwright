"""
Mechanical rewrite: swap [C4101233, C4101234] style bracket groups in
playwright-automation/tests/*.spec.ts test titles for [RST-1234, RST-1235],
using the old_id -> jira_key mapping produced by create_xray_tests.py.

Dry run by default (prints a diff-style preview, touches no files).
Pass --write to apply the changes.

Idempotent: a bracket group that's already in RST-#### form won't match the
"C####" pattern this script looks for, so re-running after a --write is a
no-op.

Hard-fails (no files written) if any C#### id in the source files is missing
from the mapping -- silently dropping a case id would be worse than stopping
the whole run. Pass --allow-missing to instead print the missing ids as a
warning and proceed with a best-effort rewrite (bracket groups containing a
missing id are left untouched, exactly as printed) -- use this only when
you've confirmed the missing ids are known, out-of-scope gaps.

Usage:
    python scripts/xray_migration/rewrite_playwright_specs.py
    python scripts/xray_migration/rewrite_playwright_specs.py --write
    python scripts/xray_migration/rewrite_playwright_specs.py --write --allow-missing
"""
import argparse
import json
import re
import sys
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parents[2]
PLAYWRIGHT_TESTS_DIR = REPO_ROOT / "playwright-automation" / "tests"
DEFAULT_MAPPING = REPO_ROOT / "xray_case_mapping.json"

BRACKET_RE = re.compile(r"\[\s*C\d{4,}(?:\s*,\s*C\d{4,})*\s*\]")
ID_RE = re.compile(r"C\d{4,}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mapping", type=Path, default=DEFAULT_MAPPING)
    parser.add_argument("--write", action="store_true", help="Apply changes to disk")
    parser.add_argument(
        "--allow-missing", action="store_true",
        help="Warn (don't abort) on missing ids; leaves those bracket groups untouched",
    )
    args = parser.parse_args()

    if not args.mapping.exists():
        raise SystemExit(f"❌ No mapping file at {args.mapping}. Run create_xray_tests.py first.")
    mapping = json.loads(args.mapping.read_text(encoding="utf-8"))

    files = sorted(PLAYWRIGHT_TESTS_DIR.glob("*.spec.ts"))
    missing = []
    planned = {}

    for path in files:
        text = path.read_text(encoding="utf-8")
        replacements = []

        def _sub(m: re.Match) -> str:
            old_ids = ID_RE.findall(m.group(0))
            new_keys = []
            for old_id in old_ids:
                entry = mapping.get(old_id)
                if entry is None:
                    missing.append((path.name, old_id))
                    new_keys.append(None)
                else:
                    new_keys.append(entry["jira_key"])
            if any(k is None for k in new_keys):
                return m.group(0)
            replacements.append((old_ids, new_keys))
            return "[" + ", ".join(new_keys) + "]"

        new_text = BRACKET_RE.sub(_sub, text)
        if replacements:
            planned[path] = (new_text, replacements)

    if missing:
        label = "⚠️" if args.allow_missing else "❌"
        print(f"{label} {len(missing)} case id(s) have no entry in {args.mapping}:")
        for fname, old_id in missing:
            print(f"  - {fname}: {old_id}")
        if not args.allow_missing:
            raise SystemExit("Aborting -- no files modified. Re-run create_xray_tests.py to cover the missing ids, "
                              "or pass --allow-missing if these are known, out-of-scope gaps.")
        print("--allow-missing set: proceeding, these bracket groups will be left untouched.\n")

    total = sum(len(r) for _, r in planned.values())
    print(f"{total} bracket group(s) across {len(planned)} file(s) to rewrite")
    for path, (_, replacements) in planned.items():
        print(f"  {path.relative_to(REPO_ROOT)}: {len(replacements)} group(s)")

    if not args.write:
        print("\nDry run -- no files modified. Re-run with --write to apply.")
        return

    for path, (new_text, _) in planned.items():
        path.write_text(new_text, encoding="utf-8")

    print(f"\n✅ Rewrote {len(planned)} file(s).")


if __name__ == "__main__":
    main()
