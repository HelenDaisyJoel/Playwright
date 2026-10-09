"""
Pure static analysis (no network calls): scan playwright-automation/tests/*.spec.ts
for every test in the @smoke suite and the real Xray RST-#### keys attached to it,
then emit the key sets a new Xray Test Plan / Test Execution should be scoped to.

@smoke is resolved at both the test() level and the enclosing test.describe()/
test.describe.serial() level -- a test is in-scope if either it or its enclosing
describe block carries @smoke. test.describe.skip() blocks are never scanned
(their tests never execute, so they can never be smoke-relevant regardless of
tags), mirroring the reason vdd_channel.spec.ts / vdd_occupancy.spec.ts were
confirmed out of scope during the Xray migration.

Each of the 42 @smoke Playwright tests is one physical automated test, but its
title's [RST-####, ...] bracket may list several legacy TestRail case keys that
were consolidated into that one automation (e.g. one test covering several
related assertions). Two key sets are emitted for that reason:

  - primary_keys: exactly one key per physical test (its bracket's FIRST key)
    -- this is what a Test Plan should be scoped to, so the Test Plan's test
    count matches the physical @smoke test count (42), the same shape as the
    reference plan RST-3125 (42 tests in, 42 tests associated).
  - unique_keys: every key touched by every test, deduplicated (89) -- this is
    what a Test Execution should be scoped to, since xray-reporter.ts reports
    a PASSED/FAILED result to every key in a test's bracket when it finishes,
    not just the first.

Requires spec titles to already carry real RST-#### keys (run
rewrite_playwright_specs.py first) -- any remaining [C####] bracket on an
in-scope smoke test is treated as a data error and reported as a warning,
not silently dropped.

Makes ZERO network calls. Safe to run repeatedly.

Usage:
    python scripts/xray_migration/build_smoke_test_plan_scope.py
    python scripts/xray_migration/build_smoke_test_plan_scope.py --output custom.json
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
DEFAULT_OUTPUT = Path(__file__).resolve().parent / "smoke_test_plan_scope.json"

DESCRIBE_RE = re.compile(
    r"test\.describe(\.(serial|skip))?\(\s*(['\"`])(.*?)\3\s*,\s*\([^)]*\)\s*=>\s*\{",
    re.DOTALL,
)
TEST_RE = re.compile(r"\btest\(\s*(['\"`])(.*?)\1", re.DOTALL)
SMOKE_TAG_RE = re.compile(r"@smoke\b")
RST_KEY_RE = re.compile(r"RST-\d+")
OLD_ID_RE = re.compile(r"\bC\d{4,}\b")


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


def scan_file(path: Path, tests: list, warnings: list) -> None:
    text = path.read_text(encoding="utf-8")

    for d_match in DESCRIBE_RE.finditer(text):
        variant = d_match.group(2)
        if variant == "skip":
            continue

        describe_title = d_match.group(4)
        open_brace = d_match.end() - 1
        close_brace = find_matching_brace(text, open_brace)
        if close_brace == -1:
            warnings.append(f"{path.name}: unmatched brace for describe '{describe_title[:60]}'")
            continue

        body = text[open_brace + 1: close_brace]
        describe_smoke = bool(SMOKE_TAG_RE.search(describe_title))

        for t_match in TEST_RE.finditer(body):
            title = t_match.group(2)
            test_smoke = bool(SMOKE_TAG_RE.search(title))
            if not (describe_smoke or test_smoke):
                continue

            abs_start = open_brace + 1 + t_match.start()
            line_no = text.count("\n", 0, abs_start) + 1

            keys = RST_KEY_RE.findall(title)
            old_ids = OLD_ID_RE.findall(title)
            if old_ids:
                warnings.append(
                    f"{path.name}:{line_no}: smoke test still has un-rewritten id(s) {old_ids} "
                    f"-- run rewrite_playwright_specs.py"
                )
            if not keys:
                warnings.append(f"{path.name}:{line_no}: smoke test has no [RST-####] key -- '{title[:80]}'")
                continue

            tests.append({
                "file": path.relative_to(REPO_ROOT).as_posix(),
                "line": line_no,
                "title": title,
                "keys": keys,
            })


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    files = sorted(PLAYWRIGHT_TESTS_DIR.glob("*.spec.ts"))
    tests: list = []
    warnings: list = []

    for f in files:
        scan_file(f, tests, warnings)

    tests.sort(key=lambda t: (t["file"], t["line"]))

    unique_keys = sorted({k for t in tests for k in t["keys"]}, key=lambda k: int(k.split("-")[1]))

    primary_keys = []
    seen_primary = set()
    for t in tests:
        primary = t["keys"][0]
        t["primary_key"] = primary
        if primary in seen_primary:
            warnings.append(
                f"{t['file']}:{t['line']}: primary key {primary} is already the primary key of another "
                f"smoke test -- Test Plan association count will be less than the physical test count"
            )
            continue
        seen_primary.add(primary)
        primary_keys.append(primary)

    result = {
        "total_tests": len(tests),
        "total_primary_keys": len(primary_keys),
        "total_unique_keys": len(unique_keys),
        "primary_keys": primary_keys,
        "unique_keys": unique_keys,
        "tests": tests,
    }
    args.output.write_text(json.dumps(result, indent=2), encoding="utf-8")

    print(f"Scanned {len(files)} playwright spec files")
    print(
        f"Found {len(tests)} @smoke test(s) -> {len(primary_keys)} primary key(s) "
        f"(Test Plan scope), {len(unique_keys)} unique key(s) total (Test Execution scope)"
    )
    print(f"Written to {args.output}")
    if warnings:
        print(f"\n{len(warnings)} warning(s):")
        for w in warnings:
            print(f"  - {w}")


if __name__ == "__main__":
    main()
