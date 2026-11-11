#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6.0"]
# ///
"""Validate HARNESS.md files against the HARNESS.md format specification.

Checks the frontmatter keys and the section skeleton, and nothing else: the
prose of a section and anything inside `metadata` are never judged.

Usage:
    uv run lint_harness_md.py [--json] [--strict] [PATH ...]
    uv run lint_harness_md.py --fixtures DIR

With no PATH it checks ./HARNESS.md; --help prints this usage. Exit codes: 0 no errors (and, with
--strict, no warnings); 1 findings; 2 bad arguments.

Example:
    uv run lint_harness_md.py HARNESS.md
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import yaml

VERSIONS = ["alpha"]  # oldest first; the last is the version this script supports
CURRENT_VERSION = VERSIONS[-1]

SECTIONS = [
    "Overview",
    "Context",
    "Invariants",
    "Style",
    "File Structure",
    "Environment",
    "Knowledge",
    "Feedback",
    "Gates",
    "Authority",
    "Completion",
    "Entropy",
    "Open Questions",
    "References",
]
REQUIRED_SECTIONS = [
    "Overview",
    "Context",
    "Environment",
    "Knowledge",
    "Feedback",
    "Gates",
    "Authority",
]
KEYS = ["name", "description", "version", "license", "metadata"]

NAME_MAX = 64
DESCRIPTION_MAX = 1024
NAME_FORMAT = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
DELIMITER = re.compile(r"^---[ \t]*$")
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})")
H2 = re.compile(r"^ {0,3}##(?!#)[ \t]+(.*)$")
CLOSING_HASHES = re.compile(r"[ \t]+#+[ \t]*$")

STR_TAG = "tag:yaml.org,2002:str"
NULL_TAG = "tag:yaml.org,2002:null"


def finding(severity: str, code: str, message: str, line: int) -> dict:
    return {"severity": severity, "code": code, "message": message, "line": line}


def normalise(text: str) -> list[str]:
    text = text.removeprefix("﻿")
    return text.replace("\r\n", "\n").replace("\r", "\n").split("\n")


def check_frontmatter(lines: list[str], findings: list[dict]) -> int:
    """Check the frontmatter; return the index of the first body line."""
    if not lines or not DELIMITER.match(lines[0]):
        findings.append(
            finding(
                "error",
                "frontmatter-missing",
                "the file has no frontmatter; start it with a line containing only `---`, "
                "the keys `name` and `description`, and a closing `---` line",
                1,
            )
        )
        return 0
    end = next((i for i in range(1, len(lines)) if DELIMITER.match(lines[i])), -1)
    if end == -1:
        findings.append(
            finding(
                "error",
                "frontmatter-invalid",
                "the frontmatter is never closed; add a line containing only `---` after the last key",
                1,
            )
        )
        return len(lines)
    source = "\n".join(lines[1:end])
    try:
        node = yaml.compose(source, Loader=yaml.SafeLoader)
    except yaml.YAMLError as error:
        mark = getattr(error, "problem_mark", None)
        problem = getattr(error, "problem", None) or str(error).splitlines()[0]
        findings.append(
            finding(
                "error",
                "frontmatter-invalid",
                f"the frontmatter is not valid YAML: {problem}",
                (mark.line + 2) if mark else 1,
            )
        )
        return end + 1
    if not isinstance(node, yaml.MappingNode):
        findings.append(
            finding(
                "error",
                "frontmatter-invalid",
                "the frontmatter must be a YAML mapping of keys to values, such as `name: my-design`",
                1,
            )
        )
        return end + 1

    # key -> (line, string value or None, kind) where kind is "str", "null", or "other"
    present: dict[str, tuple[int, str | None, str]] = {}
    seen: set[str] = set()
    for key_node, value_node in node.value:
        key = (
            str(key_node.value)
            if isinstance(key_node, yaml.ScalarNode)
            else str(key_node.tag)
        )
        line = key_node.start_mark.line + 2
        if key in seen:
            findings.append(
                finding(
                    "error",
                    "key-duplicate",
                    f"the key `{key}` appears more than once; keep one",
                    line,
                )
            )
            continue
        seen.add(key)
        if key not in KEYS:
            findings.append(
                finding(
                    "error",
                    "key-unknown",
                    f"`{key}` is not a key the format defines ({', '.join(KEYS)}); "
                    "move it under `metadata`",
                    line,
                )
            )
            continue
        if isinstance(value_node, yaml.ScalarNode) and value_node.tag == STR_TAG:
            present[key] = (line, value_node.value, "str")
        elif isinstance(value_node, yaml.ScalarNode) and value_node.tag == NULL_TAG:
            present[key] = (line, None, "null")
        else:
            present[key] = (line, None, "other")

    strings: dict[str, str] = {}
    for key in ("name", "description"):
        line, value, kind = present.get(key, (1, None, "null"))
        if kind == "other":
            findings.append(
                finding(
                    "error",
                    "key-type",
                    f"`{key}` must be a string; quote the value",
                    line,
                )
            )
        elif value is None or value.strip() == "":
            findings.append(
                finding(
                    "error",
                    "key-missing",
                    f"the frontmatter needs a non-empty `{key}`",
                    line,
                )
            )
        else:
            strings[key] = value
    for key in ("version", "license"):
        if key not in present:
            continue
        line, value, kind = present[key]
        if kind != "str" or value is None:
            findings.append(
                finding(
                    "error",
                    "key-type",
                    f"`{key}` must be a string; quote the value or remove the key",
                    line,
                )
            )
        else:
            strings[key] = value

    name = strings.get("name")
    if name is not None:
        line = present["name"][0]
        if len(name) > NAME_MAX:
            findings.append(
                finding(
                    "warning",
                    "name-length",
                    f"`name` is {len(name)} characters; keep it within {NAME_MAX}",
                    line,
                )
            )
        if not NAME_FORMAT.match(name):
            findings.append(
                finding(
                    "warning",
                    "name-format",
                    "`name` should use only lowercase letters, digits, and single hyphens, "
                    "and not start or end with a hyphen",
                    line,
                )
            )
    description = strings.get("description")
    if description is not None and len(description) > DESCRIPTION_MAX:
        findings.append(
            finding(
                "warning",
                "description-length",
                f"`description` is {len(description)} characters; keep it within {DESCRIPTION_MAX}",
                present["description"][0],
            )
        )
    version = strings.get("version")
    if version is not None:
        line = present["version"][0]
        if version not in VERSIONS:
            findings.append(
                finding(
                    "warning",
                    "version-unknown",
                    f"`version: {version}` is not a version this validator knows "
                    f"({', '.join(VERSIONS)}); the file was checked against `{CURRENT_VERSION}`",
                    line,
                )
            )
        elif VERSIONS.index(version) < len(VERSIONS) - 1:
            findings.append(
                finding(
                    "note",
                    "version-older",
                    f"the file is written for `{version}`; the current version is `{CURRENT_VERSION}`",
                    line,
                )
            )
    return end + 1


def find_sections(lines: list[str], body_start: int) -> list[tuple[str, int]]:
    """Return the defined sections found as (name, 1-based line), in file order."""
    found: list[tuple[str, int]] = []
    fence: tuple[str, int] | None = None
    for index in range(body_start, len(lines)):
        line = lines[index]
        fence_match = FENCE.match(line)
        if fence is not None:
            marker = fence_match.group(1) if fence_match else None
            if (
                marker is not None
                and marker[0] == fence[0]
                and len(marker) >= fence[1]
                and line.strip() == marker
            ):
                fence = None
            continue
        if fence_match:
            fence = (fence_match.group(1)[0], len(fence_match.group(1)))
            continue
        heading = H2.match(line)
        if not heading:
            continue
        text = CLOSING_HASHES.sub("", heading.group(1)).strip()
        if text in SECTIONS:
            found.append((text, index + 1))
    return found


def lint(text: str) -> list[dict]:
    """Return every finding for one HARNESS.md, ordered by line."""
    findings: list[dict] = []
    lines = normalise(text)
    body_start = check_frontmatter(lines, findings)
    sections = find_sections(lines, body_start)

    first_line: dict[str, int] = {}
    for name, line in sections:
        if name in first_line:
            findings.append(
                finding(
                    "error",
                    "section-duplicate",
                    f"the section `{name}` appears more than once "
                    f"(first on line {first_line[name]}); merge them",
                    line,
                )
            )
        else:
            first_line[name] = line
    for name in REQUIRED_SECTIONS:
        if name not in first_line:
            findings.append(
                finding(
                    "error",
                    "section-missing",
                    f"the required section `## {name}` is missing; a layer the project does "
                    "nothing in still needs its section, saying so and why",
                    1,
                )
            )
    latest: tuple[str, int] | None = None
    for name, line in first_line.items():
        rank = SECTIONS.index(name)
        if latest is not None and rank < latest[1]:
            findings.append(
                finding(
                    "warning",
                    "section-order",
                    f"`{name}` comes after `{latest[0]}`; the specification puts it before",
                    line,
                )
            )
        else:
            latest = (name, rank)

    findings.sort(key=lambda item: item["line"])
    return findings


def run_fixtures(directory: Path) -> list[str]:
    """Compare each fixture's finding codes with expected.json; return the mismatches."""
    expected: dict[str, list[str]] = json.loads(
        (directory / "expected.json").read_text("utf-8")
    )
    problems: list[str] = []
    seen: set[str] = set()
    for file in sorted(directory.rglob("*.md")):
        key = file.relative_to(directory).as_posix()
        seen.add(key)
        if key not in expected:
            problems.append(f"{key}: no entry in expected.json")
            continue
        got = sorted(item["code"] for item in lint(file.read_bytes().decode("utf-8")))
        wanted = sorted(expected[key])
        if got != wanted:
            problems.append(
                f"{key}: expected [{', '.join(wanted)}], got [{', '.join(got)}]"
            )
    problems.extend(
        f"{key}: listed in expected.json but the file is missing"
        for key in expected
        if key not in seen
    )
    return problems


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="lint_harness_md.py",
        description="Validate HARNESS.md files against the format specification.",
        epilog="example: uv run lint_harness_md.py HARNESS.md",
    )
    parser.add_argument(
        "paths", nargs="*", help="files to check (default: ./HARNESS.md)"
    )
    parser.add_argument(
        "--json", action="store_true", help="print findings as JSON on stdout"
    )
    parser.add_argument("--strict", action="store_true", help="exit 1 on warnings too")
    parser.add_argument(
        "--fixtures",
        metavar="DIR",
        help="run every *.md under DIR and compare the finding codes with DIR/expected.json",
    )
    try:
        args = parser.parse_args(argv)
    except SystemExit as stop:
        return 0 if stop.code == 0 else 2

    if args.fixtures:
        directory = Path(args.fixtures)
        if not (directory / "expected.json").is_file():
            print(f"{directory}/expected.json not found", file=sys.stderr)
            return 2
        problems = run_fixtures(directory)
        for problem in problems:
            print(problem)
        print(
            "fixtures: every case matches"
            if not problems
            else f"fixtures: {len(problems)} mismatch(es)",
            file=sys.stderr,
        )
        return 0 if not problems else 1

    paths = [Path(p) for p in args.paths] or [Path("HARNESS.md")]
    results = []
    for path in paths:
        if not path.is_file():
            print(
                f"{path}: not a file; pass the path of a HARNESS.md to check",
                file=sys.stderr,
            )
            return 2
        try:
            text = path.read_bytes().decode("utf-8")
        except UnicodeDecodeError:
            print(f"{path}: not UTF-8 text; save the file as UTF-8", file=sys.stderr)
            return 2
        results.append({"path": str(path), "findings": lint(text)})

    def count(severity: str) -> int:
        return sum(
            1 for r in results for f in r["findings"] if f["severity"] == severity
        )

    errors, warnings = count("error"), count("warning")
    if args.json:
        print(
            json.dumps(
                {"files": results, "errors": errors, "warnings": warnings}, indent=2
            )
        )
    else:
        for result in results:
            for item in result["findings"]:
                print(
                    f"{result['path']}:{item['line']}: "
                    f"{item['severity']}[{item['code']}]: {item['message']}"
                )
    print(
        f"{len(results)} file(s): {errors} error(s), {warnings} warning(s)",
        file=sys.stderr,
    )
    return 1 if errors or (args.strict and warnings) else 0


if __name__ == "__main__":
    sys.exit(main())
