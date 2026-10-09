"""
One-time static analysis: scan both test suites for existing TestRail case
IDs and the brand/role labels they run under, then emit a deduped inventory
that create_xray_tests.py can turn into real Jira/Xray Test issues.

Makes ZERO network calls. Safe to run repeatedly.

Usage:
    python scripts/xray_migration/build_case_inventory.py
    python scripts/xray_migration/build_case_inventory.py --output custom.json
"""
import argparse
import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
PLAYWRIGHT_TESTS_DIR = REPO_ROOT / "playwright-automation" / "tests"
PYTEST_TESTS_DIR = REPO_ROOT / "pytest-automation" / "e2e_tests"
DEFAULT_OUTPUT = REPO_ROOT / "xray_migration_inventory.json"

BRAND_ROLE_TAG_RE = re.compile(r"@(NCL|OCEANIA|REGENT)-(admin|manager|analyst)", re.IGNORECASE)
BRAND_ROLE_MARK_RE = re.compile(r"\b(NCL|OCEANIA|REGENT)_(admin|manager|analyst)\b", re.IGNORECASE)
CASE_ID_RE = re.compile(r"C(\d{4,})")


def find_matching_brace(text: str, open_index: int) -> int:
    """Return the index of the '{' at open_index's matching '}', skipping
    string/template literals and comments so nested braces don't confuse it."""
    depth = 0
    i = open_index
    n = len(text)
    in_str = None
    while i < n:
        c = text[i]
        if in_str:
            if c == "\\":
                i += 2
                continue
            if c == in_str:
                in_str = None
            i += 1
            continue
        if c in ("'", '"', "`"):
            in_str = c
            i += 1
            continue
        if c == "/" and i + 1 < n and text[i + 1] == "/":
            j = text.find("\n", i)
            i = j if j != -1 else n
            continue
        if c == "/" and i + 1 < n and text[i + 1] == "*":
            j = text.find("*/", i + 2)
            i = j + 2 if j != -1 else n
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


def clean_summary(title: str) -> str:
    cleaned = CASE_ID_RE.sub("", title)
    cleaned = re.sub(r"@\S+", "", cleaned)
    cleaned = re.sub(r"[\[\],]+", " ", cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def scan_playwright(path: Path, inventory: dict, warnings: list) -> None:
    text = path.read_text(encoding="utf-8")
    describe_re = re.compile(r"test\.describe\(\s*(['\"`])(.*?)\1\s*,\s*\([^)]*\)\s*=>\s*\{", re.DOTALL)

    for d_match in describe_re.finditer(text):
        describe_title = d_match.group(2)
        open_brace = d_match.end() - 1
        close_brace = find_matching_brace(text, open_brace)
        if close_brace == -1:
            warnings.append(f"{path}: unmatched brace for describe '{describe_title[:60]}'")
            continue

        body = text[open_brace + 1: close_brace]
        labels = {f"{b.upper()}_{r.lower()}" for b, r in BRAND_ROLE_TAG_RE.findall(describe_title)}
        if not labels:
            continue

        test_re = re.compile(r"\btest\(\s*(['\"`])(.*?)\1", re.DOTALL)
        for t_match in test_re.finditer(body):
            title = t_match.group(2)
            case_ids = CASE_ID_RE.findall(title)
            if not case_ids:
                continue
            summary = clean_summary(title)
            line_no = text.count("\n", 0, d_match.start()) + 1
            for cid in case_ids:
                entry = inventory.setdefault(cid, {
                    "old_id": f"C{cid}",
                    "labels": set(),
                    "summary": summary,
                    "sources": [],
                })
                entry["labels"] |= labels
                source = f"{path.relative_to(REPO_ROOT)}:{line_no}"
                if source not in entry["sources"]:
                    entry["sources"].append(source)


def scan_pytest(path: Path, inventory: dict, warnings: list) -> None:
    text = path.read_text(encoding="utf-8")
    class_re = re.compile(r"((?:@pytest\.mark\.\w+\s*\n)+)class\s+(\w+)\s*[:\(]")

    class_starts = [(m.start(2), m.group(1), m.group(2)) for m in class_re.finditer(text)]
    if not class_starts:
        return

    for idx, (pos, decorators, class_name) in enumerate(class_starts):
        end = class_starts[idx + 1][0] if idx + 1 < len(class_starts) else len(text)
        body = text[pos:end]
        labels = {f"{b.upper()}_{r.lower()}" for b, r in BRAND_ROLE_MARK_RE.findall(decorators)}
        if not labels:
            warnings.append(f"{path}: class {class_name} has no brand/role marker")
            continue

        case_re = re.compile(r"@pytest\.mark\.testrail_case\(\s*(\d+)\s*\)\s*\n(?:\s*@[^\n]+\n)*\s*def\s+(\w+)")
        for c_match in case_re.finditer(body):
            cid = c_match.group(1)
            method_name = c_match.group(2)
            line_no = text.count("\n", 0, pos + c_match.start()) + 1
            entry = inventory.setdefault(cid, {
                "old_id": cid,
                "labels": set(),
                "summary": method_name.replace("test_", "").replace("_", " ").strip(),
                "sources": [],
            })
            entry["labels"] |= labels
            source = f"{path.relative_to(REPO_ROOT)}:{line_no}"
            if source not in entry["sources"]:
                entry["sources"].append(source)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    inventory: dict = {}
    warnings: list = []

    pw_files = sorted(PLAYWRIGHT_TESTS_DIR.glob("*.spec.ts"))
    py_files = sorted(f for f in PYTEST_TESTS_DIR.glob("*.py") if f.name != "__init__.py")

    for f in pw_files:
        scan_playwright(f, inventory, warnings)
    for f in py_files:
        scan_pytest(f, inventory, warnings)

    result = []
    for cid, entry in sorted(inventory.items(), key=lambda kv: kv[0]):
        result.append({
            "old_id": entry["old_id"],
            "labels": sorted(entry["labels"]),
            "summary": entry["summary"],
            "sources": entry["sources"],
        })

    args.output.write_text(json.dumps(result, indent=2), encoding="utf-8")

    print(f"Scanned {len(pw_files)} playwright spec files, {len(py_files)} pytest files")
    print(f"Found {len(result)} unique case IDs -> {args.output}")
    if warnings:
        print(f"\n{len(warnings)} warning(s):")
        for w in warnings:
            print(f"  - {w}")


if __name__ == "__main__":
    main()
