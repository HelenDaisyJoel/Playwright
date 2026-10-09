"""
Rewrite every [RST-####] bracket in Playwright specs and every
@pytest.mark.xray_test_case("RST-####") marker in Pytest tests so that the
final numbers match the ALREADY-migrated legacy RST-2### Xray keys, instead
of the RST-3### keys this project's own migration created.

Why re-derive from HEAD instead of editing the current working tree in
place: the working tree currently mixes three states per file --
(a) untouched old [C####] tests this session never reached,
(b) [RST-3####] tests from the earlier C####->RST-3### migration pass, and
(c) a smaller set of @smoke tests already best-effort (and, per the exact
join built by build_rst3_to_rst2_mapping.py, sometimes WRONGLY) guessed at
[RST-2####] in an earlier pass this session.
Recomputing every bracket from HEAD's original [C####] markers through the
single authoritative chain:

    C####  -->(xray_case_mapping.json, bare-normalized)-->  RST-3###
    RST-3# -->(rst3_to_rst2_mapping.json "renumber")-->      RST-2###

sidesteps all three inconsistent states and guarantees every test ends up
with the correct final key, including the ones already (mis)edited earlier
this session.

Matches lines positionally: for each file, HEAD content and current working
tree content must have the same line count (true here -- only bracket / marker
text changed, no lines added or removed). For every HEAD line containing an
old-style ID, the corresponding line in the current file has its ID(s)
replaced with the resolved RST-2### value(s), regardless of what is
currently on that line.

Dry-run by default (prints a unified-diff-style summary, writes nothing).
Pass --write to apply changes in place.

Usage:
    python scripts/xray_migration/apply_rst2_renumber.py            # dry run
    python scripts/xray_migration/apply_rst2_renumber.py --write    # apply
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parents[2]
SCRIPT_DIR = Path(__file__).resolve().parent

CASE_MAPPING_PATH = REPO_ROOT / "xray_case_mapping.json"
RENUMBER_PATH = SCRIPT_DIR / "rst3_to_rst2_mapping.json"

PLAYWRIGHT_TESTS_DIR = REPO_ROOT / "playwright-automation" / "tests"
PYTEST_TESTS_DIR = REPO_ROOT / "pytest-automation" / "e2e_tests"

# Matches [C1234567, C1234568] style brackets (old TestRail brackets).
# C prefix and 4+ digits are mandatory so we never mistake array indices
# like cells[0], cells[1] for TestRail ID brackets.
CID_BRACKET_RE = re.compile(r"\[\s*C\d{4,}(?:\s*,\s*C\d{4,})*\s*\]")
CID_RE = re.compile(r"C(\d{4,})")
RST_BRACKET_RE = re.compile(r"\[\s*RST-\d+(?:\s*,\s*RST-\d+)*\s*\]")

# Matches @pytest.mark.testrail_case(1234567) or xray_test_case("RST-3123")
PYTEST_TESTRAIL_RE = re.compile(r'@pytest\.mark\.testrail_case\(\s*(\d+)\s*\)')
PYTEST_XRAY_RE = re.compile(r'@pytest\.mark\.xray_test_case\(\s*"RST-(\d+)"\s*\)')


def normalize_id(raw: str) -> str:
    return re.sub(r"^C", "", raw, flags=re.IGNORECASE)


def git_show_head(path: Path) -> str:
    rel = path.relative_to(REPO_ROOT).as_posix()
    result = subprocess.run(
        ["git", "show", f"HEAD:{rel}"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if result.returncode != 0:
        raise RuntimeError(f"git show HEAD:{rel} failed: {result.stderr}")
    return result.stdout


def build_bare_to_rst2(case_mapping: dict, renumber: dict) -> dict:
    bare_to_rst3 = {}
    for raw_id, entry in case_mapping.items():
        bare = normalize_id(raw_id)
        rst3_key = entry.get("jira_key")
        if rst3_key:
            bare_to_rst3[bare] = rst3_key

    bare_to_rst2 = {}
    unresolved = []
    for bare, rst3_key in bare_to_rst3.items():
        rst2_key = renumber.get(rst3_key)
        if rst2_key:
            bare_to_rst2[bare] = rst2_key
        else:
            unresolved.append((bare, rst3_key))
    return bare_to_rst2, unresolved


def process_playwright_file(path: Path, bare_to_rst2: dict, not_migrated: list, write: bool) -> int:
    file_label = str(path.relative_to(REPO_ROOT))
    head_content = git_show_head(path)
    cur_content = path.read_text(encoding="utf-8")

    # HEAD: ordered list of (old_ids, head_line_no) for every C#### bracket.
    head_brackets = []
    for i, line in enumerate(head_content.splitlines(), start=1):
        m = CID_BRACKET_RE.search(line)
        if m:
            head_brackets.append((CID_RE.findall(m.group(0)), i))

    if not head_brackets:
        return 0

    # Current file: ordered list of every bracket that looks like an ID
    # bracket (old C#### form, or already-rewritten RST-#### form), matched
    # positionally against HEAD's ordered list -- this is robust even when
    # unrelated line insertions/deletions shifted line numbers, since bracket
    # occurrences appear in the same top-to-bottom order in both versions.
    cur_lines = cur_content.splitlines(keepends=True)
    cur_bracket_positions = []
    for i, line in enumerate(cur_lines):
        m = CID_BRACKET_RE.search(line) or RST_BRACKET_RE.search(line)
        if m:
            cur_bracket_positions.append((i, m.start(), m.end()))

    if len(head_brackets) != len(cur_bracket_positions):
        raise RuntimeError(
            f"{path}: bracket count mismatch HEAD={len(head_brackets)} current={len(cur_bracket_positions)} -- refusing to blind-patch"
        )

    changed = 0
    for (old_ids, head_line_no), (cur_line_idx, start, end) in zip(head_brackets, cur_bracket_positions):
        new_keys = []
        any_unresolved = False
        for old_id in old_ids:
            rst2 = bare_to_rst2.get(old_id)
            if rst2:
                new_keys.append(rst2)
            else:
                any_unresolved = True
                new_keys.append(f"C{old_id}")
        if any_unresolved:
            not_migrated.append((file_label, head_line_no, old_ids))
            continue  # leave this bracket untouched -- never migrated to Xray at all
        new_bracket = f"[{', '.join(new_keys)}]"
        line = cur_lines[cur_line_idx]
        new_line = line[:start] + new_bracket + line[end:]
        if new_line != line:
            changed += 1
            cur_lines[cur_line_idx] = new_line

    if changed and write:
        path.write_text("".join(cur_lines), encoding="utf-8")
    return changed


def process_pytest_file(path: Path, bare_to_rst2: dict, not_migrated: list, write: bool) -> int:
    file_label = str(path.relative_to(REPO_ROOT))
    head_content = git_show_head(path)
    cur_content = path.read_text(encoding="utf-8")

    head_lines = head_content.splitlines(keepends=True)
    cur_lines = cur_content.splitlines(keepends=True)

    if len(head_lines) != len(cur_lines):
        raise RuntimeError(f"{path}: line count mismatch HEAD={len(head_lines)} current={len(cur_lines)} -- refusing to blind-patch")

    changed = 0
    out_lines = []
    for i, (head_line, cur_line) in enumerate(zip(head_lines, cur_lines), start=1):
        m = PYTEST_TESTRAIL_RE.search(head_line)
        if m:
            old_id = m.group(1)
            rst2 = bare_to_rst2.get(old_id)
            if not rst2:
                not_migrated.append((file_label, i, [old_id]))
                out_lines.append(cur_line)
                continue
            cur_m = PYTEST_XRAY_RE.search(cur_line) or re.search(r'@pytest\.mark\.xray_test_case\(\s*"[^"]*"\s*\)', cur_line)
            if not cur_m:
                raise RuntimeError(f"{file_label}:{i} -- HEAD has testrail_case marker but current file has none to replace")
            new_marker = f'@pytest.mark.xray_test_case("{rst2}")'
            new_line = cur_line[: cur_m.start()] + new_marker + cur_line[cur_m.end() :]
            if new_line != cur_line:
                changed += 1
            out_lines.append(new_line)
        else:
            out_lines.append(cur_line)

    if changed and write:
        path.write_text("".join(out_lines), encoding="utf-8")
    return changed


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="Apply changes in place (default: dry run)")
    args = parser.parse_args()

    case_mapping = json.loads(CASE_MAPPING_PATH.read_text(encoding="utf-8"))
    renumber_data = json.loads(RENUMBER_PATH.read_text(encoding="utf-8"))
    bare_to_rst2, unresolved_case_mapping = build_bare_to_rst2(case_mapping, renumber_data["renumber"])

    print(f"bare TestRail ID -> RST-2### resolved entries: {len(bare_to_rst2)}")
    if unresolved_case_mapping:
        print(f"WARNING: {len(unresolved_case_mapping)} case_mapping entries have no renumber target (RST-3 key not in renumber map):")
        for bare, rst3 in unresolved_case_mapping[:20]:
            print(f"  C{bare} -> {rst3} -> ???")

    not_migrated = []
    total_changed = 0

    pw_files = sorted(p for p in PLAYWRIGHT_TESTS_DIR.glob("*.spec.ts"))
    for f in pw_files:
        try:
            changed = process_playwright_file(f, bare_to_rst2, not_migrated, args.write)
        except RuntimeError as e:
            print(f"ERROR: {e}")
            continue
        if changed:
            print(f"  {'WROTE' if args.write else 'would change'} {changed} bracket(s) in {f.relative_to(REPO_ROOT)}")
            total_changed += changed

    py_files = sorted(p for p in PYTEST_TESTS_DIR.glob("*.py"))
    for f in py_files:
        try:
            changed = process_pytest_file(f, bare_to_rst2, not_migrated, args.write)
        except RuntimeError as e:
            print(f"ERROR: {e}")
            continue
        if changed:
            print(f"  {'WROTE' if args.write else 'would change'} {changed} marker(s) in {f.relative_to(REPO_ROOT)}")
            total_changed += changed

    print(f"\nTotal brackets/markers {'changed' if args.write else 'to change'}: {total_changed}")

    if not_migrated:
        print(f"\nNOT MIGRATED TO XRAY AT ALL (no entry in xray_case_mapping.json -- left untouched, needs Step 1 migration first): {len(not_migrated)}")
        for file_label, line_no, old_ids in not_migrated:
            print(f"  {file_label}:{line_no} -- {', '.join('C' + i for i in old_ids)}")
    else:
        print("\nEvery old ID found was already migrated to Xray (present in xray_case_mapping.json).")

    if not args.write:
        print("\nDry run only. Re-run with --write to apply.")


if __name__ == "__main__":
    main()
