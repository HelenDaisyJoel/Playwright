"""
Mechanical rewrite: swap @pytest.mark.testrail_case(N) for
@pytest.mark.xray_test_case("RST-XXXX") across pytest-automation/e2e_tests,
using the old_id -> jira_key mapping produced by create_xray_tests.py.

Dry run by default (prints a diff-style preview, touches no files).
Pass --write to apply the changes.

Hard-fails (no files written) if any testrail_case id in the source files is
missing from the mapping -- silently dropping a case id would be worse than
stopping the whole run.

Usage:
    python scripts/xray_migration/rewrite_pytest_markers.py
    python scripts/xray_migration/rewrite_pytest_markers.py --write
"""
import argparse
import json
import re
import sys
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parents[2]
PYTEST_TESTS_DIR = REPO_ROOT / "pytest-automation" / "e2e_tests"
DEFAULT_MAPPING = REPO_ROOT / "xray_case_mapping.json"

MARKER_RE = re.compile(r"@pytest\.mark\.testrail_case\(\s*(\d+)\s*\)")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mapping", type=Path, default=DEFAULT_MAPPING)
    parser.add_argument("--write", action="store_true", help="Apply changes to disk")
    args = parser.parse_args()

    if not args.mapping.exists():
        raise SystemExit(f"❌ No mapping file at {args.mapping}. Run create_xray_tests.py first.")
    mapping = json.loads(args.mapping.read_text(encoding="utf-8"))

    files = sorted(f for f in PYTEST_TESTS_DIR.glob("*.py") if f.name != "__init__.py")
    missing = []
    planned = {}

    for path in files:
        text = path.read_text(encoding="utf-8")
        replacements = []

        def _sub(m: re.Match) -> str:
            old_id = m.group(1)
            entry = mapping.get(old_id)
            if entry is None:
                missing.append((path.name, old_id))
                return m.group(0)
            replacements.append((old_id, entry["jira_key"]))
            return f'@pytest.mark.xray_test_case("{entry["jira_key"]}")'

        new_text = MARKER_RE.sub(_sub, text)
        if replacements:
            planned[path] = (new_text, replacements)

    if missing:
        print(f"❌ {len(missing)} testrail_case id(s) have no entry in {args.mapping}:")
        for fname, old_id in missing:
            print(f"  - {fname}: {old_id}")
        raise SystemExit("Aborting -- no files modified. Re-run create_xray_tests.py to cover the missing ids.")

    total = sum(len(r) for _, r in planned.values())
    print(f"{total} marker(s) across {len(planned)} file(s) to rewrite")
    for path, (_, replacements) in planned.items():
        print(f"  {path.relative_to(REPO_ROOT)}: {len(replacements)} marker(s)")

    if not args.write:
        print("\nDry run -- no files modified. Re-run with --write to apply.")
        return

    for path, (new_text, _) in planned.items():
        path.write_text(new_text, encoding="utf-8")

    print(f"\n✅ Rewrote {len(planned)} file(s).")


if __name__ == "__main__":
    main()
