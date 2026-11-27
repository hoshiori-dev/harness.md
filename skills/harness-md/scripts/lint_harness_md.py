#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pyyaml>=6.0"]
# ///
"""Validate HARNESS.md directories against the HARNESS.md format specification.

A HARNESS.md is a directory named after its `name`, with `SKILL.md` as its main
file. The validator checks the frontmatter of `SKILL.md` (the six keys, the
limits on `name`, `description`, and `compatibility`, the two halves of the type
marker, and that every `metadata` value is a string), its title and the order
and repetition of its recommended section headings, the relative links of
`SKILL.md` and of every Markdown file reached from it, and that a link reaches
every file of the directory. It checks nothing else: no section is required,
and prose, assets, and the directory's location are never judged.

Usage:
    uv run lint_harness_md.py [--json] [--strict] [PATH ...]

PATH is a directory or the path of its SKILL.md. With no PATH it checks the
current directory, which must hold a SKILL.md; --help prints this usage.
Exit codes: 0 no errors (and, with --strict, no warnings); 1 findings;
2 bad arguments.

Example:
    uv run lint_harness_md.py my-design
"""

from __future__ import annotations

import argparse
import json
import os
import posixpath
import re
import sys
from pathlib import Path
from urllib.parse import unquote

try:
    import yaml
except ModuleNotFoundError:
    sys.stderr.write(
        "lint_harness_md.py needs PyYAML. Run it with uv, which installs it:\n"
        "    uv run lint_harness_md.py my-design\n"
    )
    raise SystemExit(2) from None

SECTIONS = [  # the recommended second-level sections, in specification order
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
KEYS = ["name", "description", "license", "compatibility", "metadata", "allowed-tools"]

ERRORS = (
    "encoding-invalid",
    "main-file-missing",
    "frontmatter-missing",
    "frontmatter-invalid",
    "key-missing",
    "key-type",
    "key-duplicate",
    "name-format",
    "name-length",
    "name-directory",
    "description-length",
    "compatibility-length",
    "marker-prefix",
    "marker-type",
    "metadata-value",
)
WARNINGS = (
    "key-unknown",
    "key-allowed-tools",
    "link-missing",
    "file-unreachable",
    "title-missing",
    "title-multiple",
    "section-duplicate",
    "section-order",
)
SEVERITY = {**dict.fromkeys(ERRORS, "error"), **dict.fromkeys(WARNINGS, "warning")}

MAIN_FILE = "SKILL.md"
MARKER_PREFIX = "[HARNESS.md]"
MARKER_TYPE = "harness-design"
NAME_MAX = 64
DESCRIPTION_MAX = 1024
COMPATIBILITY_MAX = 500
MARKDOWN_SUFFIXES = (".md", ".markdown")

NAME_FORMAT = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
DELIMITER = re.compile(r"^---[ \t]*$")
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})")
H1 = re.compile(r"^ {0,3}#(?:[ \t].*)?$")
H2 = re.compile(r"^ {0,3}##(?!#)[ \t]+(.*)$")
CLOSING_HASHES = re.compile(r"[ \t]+#+[ \t]*$")
UNQUOTED_MARKER = re.compile(r"^description:[ \t]*\[HARNESS\.md\]")

# `](destination "title")`: the tail of an inline link or image.
INLINE_TAIL = re.compile(
    r"\]\(\s*(?:<([^<>\n]*)>|([^\s<>()]*(?:\([^\s<>()]*\)[^\s<>()]*)*))"
    r"(?:\s+(?:\"[^\"]*\"|'[^']*'|\([^()]*\)))?\s*\)"
)
# `[label]: destination`: a link reference definition (not a `[^note]:` footnote).
DEFINITION = re.compile(
    r"^ {0,3}\[(?!\^)(?:[^\]\\\n]|\\.)+\]:[ \t]*\n?[ \t]*(?:<([^<>\n]*)>|(\S+))",
    re.MULTILINE,
)
SCHEME = re.compile(r"^[A-Za-z][A-Za-z0-9+.-]*:")
ESCAPED = re.compile(r"\\([!-/:-@\[-`{-~])")

STR_TAG = "tag:yaml.org,2002:str"
NULL_TAG = "tag:yaml.org,2002:null"


def finding(code: str, message: str, line: int, file: str = MAIN_FILE) -> dict:
    """One finding; `file` is relative to the validated directory."""
    return {
        "severity": SEVERITY[code],
        "code": code,
        "message": message,
        "file": file,
        "line": line,
    }


def normalise(text: str) -> list[str]:
    text = text.removeprefix("\ufeff")
    return text.replace("\r\n", "\n").replace("\r", "\n").split("\n")


def is_string(node: yaml.Node | None) -> bool:
    return isinstance(node, yaml.ScalarNode) and node.tag == STR_TAG


def check_metadata(node: yaml.Node | None, line: int, findings: list[dict]) -> None:
    """Check that `metadata` maps to strings and states the type marker."""
    how = (
        f"add `type: {MARKER_TYPE}` on an indented line below `metadata:` "
        "in the frontmatter"
    )
    if node is None:
        findings.append(
            finding("marker-type", f"the frontmatter has no `metadata.type`; {how}", 1)
        )
        return
    if not isinstance(node, yaml.MappingNode):
        findings.append(
            finding(
                "metadata-value",
                "`metadata` must be a mapping whose values are strings; "
                f"write its keys on indented lines below `metadata:`, `type: {MARKER_TYPE}` among them",
                line,
            )
        )
        return
    type_node: yaml.Node | None = None
    for key_node, value_node in node.value:
        key = str(key_node.value) if isinstance(key_node, yaml.ScalarNode) else "(key)"
        if key == "type":
            type_node = value_node
        if is_string(value_node):
            continue
        fix = (
            "quote the value"
            if isinstance(value_node, yaml.ScalarNode)
            else "write it as one string, for example a comma-separated list"
        )
        findings.append(
            finding(
                "metadata-value",
                f"`metadata.{key}` must be a string; {fix}",
                key_node.start_mark.line + 2,
            )
        )
    if type_node is None:
        findings.append(
            finding("marker-type", f"`metadata` has no `type`; {how}", line)
        )
    elif not (is_string(type_node) and type_node.value == MARKER_TYPE):
        findings.append(
            finding(
                "marker-type",
                f"`metadata.type` must be exactly `{MARKER_TYPE}`; "
                f"change the line to `type: {MARKER_TYPE}`",
                type_node.start_mark.line + 2,
            )
        )


def check_frontmatter(
    lines: list[str], directory_name: str, findings: list[dict]
) -> int | None:
    """Check the frontmatter; return the index of the first body line.

    Returns None when the frontmatter is never closed, so there is no body.
    """
    if not lines or not DELIMITER.match(lines[0]):
        findings.append(
            finding(
                "frontmatter-missing",
                "the file has no frontmatter; start it with a line containing only `---`, "
                "the keys `name`, `description`, and `metadata`, and a closing `---` line",
                1,
            )
        )
        return 0
    end = next((i for i in range(1, len(lines)) if DELIMITER.match(lines[i])), -1)
    if end == -1:
        findings.append(
            finding(
                "frontmatter-invalid",
                "the frontmatter is never closed; add a line containing only `---` after the last key",
                1,
            )
        )
        return None
    unquoted = next(
        (i + 1 for i in range(1, end) if UNQUOTED_MARKER.match(lines[i])), None
    )
    quote_it = (
        "`description` starts with `[HARNESS.md]` without quotes, which YAML reads as a list; "
        'quote the value (`description: "[HARNESS.md] ..."`) or use a block scalar '
        "(`description: >-` with the text on indented lines below)"
    )
    source = "\n".join(lines[1:end])
    try:
        node = yaml.compose(source, Loader=yaml.SafeLoader)
    except yaml.YAMLError as error:
        mark = getattr(error, "problem_mark", None)
        problem = getattr(error, "problem", None) or str(error).splitlines()[0]
        if unquoted is not None:
            message, line = f"the frontmatter is not valid YAML: {quote_it}", unquoted
        else:
            message = (
                f"the frontmatter is not valid YAML: {problem}; "
                "correct that line, quoting a value that holds `:`, `#`, or brackets"
            )
            line = (mark.line + 2) if mark else 1
        findings.append(finding("frontmatter-invalid", message, line))
        return end + 1
    if not isinstance(node, yaml.MappingNode):
        findings.append(
            finding(
                "frontmatter-invalid",
                "the frontmatter must be a YAML mapping of keys to values, such as `name: my-design`",
                1,
            )
        )
        return end + 1

    present: dict[str, tuple[int, yaml.Node]] = {}
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
                    "key-duplicate",
                    f"the key `{key}` appears more than once; keep one",
                    line,
                )
            )
            continue
        seen.add(key)
        if key == "version":
            findings.append(
                finding(
                    "key-unknown",
                    "`version` is not a top-level key of the format; "
                    "state the version as `metadata.version`, a string on an indented line below `metadata:`",
                    line,
                )
            )
        elif key not in KEYS:
            findings.append(
                finding(
                    "key-unknown",
                    f"`{key}` is not a key the format defines ({', '.join(KEYS)}); "
                    "move it under `metadata`",
                    line,
                )
            )
        else:
            present[key] = (line, value_node)

    strings: dict[str, str] = {}
    for key in ("name", "description"):
        line, value_node = present.get(key, (1, None))
        empty = (
            value_node is None
            or (isinstance(value_node, yaml.ScalarNode) and value_node.tag == NULL_TAG)
            or (is_string(value_node) and value_node.value.strip() == "")
        )
        if empty:
            findings.append(
                finding(
                    "key-missing",
                    f"the frontmatter needs a non-empty `{key}`; add the key with a string value",
                    line,
                )
            )
        elif not is_string(value_node):
            fix = (
                quote_it
                if key == "description" and unquoted is not None
                else f"`{key}` must be a string; quote the value"
            )
            findings.append(finding("key-type", fix, line))
        else:
            strings[key] = value_node.value
    for key in ("license", "compatibility", "allowed-tools"):
        if key not in present:
            continue
        line, value_node = present[key]
        if is_string(value_node):
            strings[key] = value_node.value
        else:
            findings.append(
                finding(
                    "key-type",
                    f"`{key}` must be a string; quote the value or remove the key",
                    line,
                )
            )
    if "allowed-tools" in strings:
        findings.append(
            finding(
                "key-allowed-tools",
                "`allowed-tools` grants tools to whoever loads the document, "
                "which a design document does not need; remove the key",
                present["allowed-tools"][0],
            )
        )

    name = strings.get("name")
    if name is not None:
        line = present["name"][0]
        if len(name) > NAME_MAX:
            findings.append(
                finding(
                    "name-length",
                    f"`name` is {len(name)} characters; shorten it to at most {NAME_MAX}",
                    line,
                )
            )
        if not NAME_FORMAT.match(name):
            findings.append(
                finding(
                    "name-format",
                    "`name` must use only lowercase letters, digits, and single hyphens, "
                    "and not start or end with a hyphen; rename it, and the directory with it",
                    line,
                )
            )
        if name != directory_name:
            findings.append(
                finding(
                    "name-directory",
                    f"`name` is `{name}` and the directory is `{directory_name}`; "
                    "rename the directory or change `name` so that the two are equal",
                    line,
                )
            )
    description = strings.get("description")
    if description is not None:
        line = present["description"][0]
        if len(description) > DESCRIPTION_MAX:
            findings.append(
                finding(
                    "description-length",
                    f"`description` is {len(description)} characters; "
                    f"shorten it to at most {DESCRIPTION_MAX}",
                    line,
                )
            )
        if not description.startswith(MARKER_PREFIX):
            findings.append(
                finding(
                    "marker-prefix",
                    f"`description` must start with the exact text `{MARKER_PREFIX}`; "
                    "put it before the first word and keep the value quoted or in a block scalar",
                    line,
                )
            )
    compatibility = strings.get("compatibility")
    if compatibility is not None and not 0 < len(compatibility) <= COMPATIBILITY_MAX:
        findings.append(
            finding(
                "compatibility-length",
                f"`compatibility` is {len(compatibility)} characters; "
                f"keep it between 1 and {COMPATIBILITY_MAX}, or remove the key",
                present["compatibility"][0],
            )
        )
    metadata_line, metadata_node = present.get("metadata", (1, None))
    check_metadata(metadata_node, metadata_line, findings)
    return end + 1


def outside_fences(lines: list[str], start: int) -> list[str]:
    """Return the lines with everything before `start` and every fenced code
    block blanked, so that line numbers stay the same."""
    kept = [""] * len(lines)
    fence: tuple[str, int] | None = None
    for index in range(start, len(lines)):
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
        kept[index] = line
    return kept


def find_headings(prose: list[str]) -> tuple[list[tuple[str, int]], list[int]]:
    """Return the recommended sections found as (name, 1-based line), in file
    order, and the lines of the first-level headings."""
    found: list[tuple[str, int]] = []
    titles: list[int] = []
    for index, line in enumerate(prose):
        if H1.match(line):
            titles.append(index + 1)
            continue
        heading = H2.match(line)
        if not heading:
            continue
        text = CLOSING_HASHES.sub("", heading.group(1)).strip()
        if text in SECTIONS:
            found.append((text, index + 1))
    return found, titles


def without_code_spans(text: str) -> str:
    """Blank every code span; a span does not cross a blank line."""
    out = list(text)
    size = len(text)
    index = 0
    while index < size:
        if text[index] == "\\":
            index += 2
            continue
        if text[index] != "`":
            index += 1
            continue
        opened = index
        while index < size and text[index] == "`":
            index += 1
        run = index - opened
        cursor = index
        closing = -1
        while cursor < size and not text.startswith("\n\n", cursor):
            if text[cursor] != "`":
                cursor += 1
                continue
            begun = cursor
            while cursor < size and text[cursor] == "`":
                cursor += 1
            if cursor - begun == run:
                closing = begun
                break
        if closing == -1:
            continue
        for position in range(opened, closing + run):
            if out[position] != "\n":
                out[position] = " "
        index = closing + run
    return "".join(out)


def opening_bracket(text: str, closing: int) -> int:
    """Return the index of the `[` that the `]` at `closing` closes, or -1."""
    depth = 0
    for position in range(closing, -1, -1):
        char = text[position]
        if char == "\n" and position > 0 and text[position - 1] == "\n":
            return -1
        if char not in "[]" or (position > 0 and text[position - 1] == "\\"):
            continue
        depth += 1 if char == "]" else -1
        if depth == 0:
            return position
    return -1


LIST_ITEM = re.compile(r"^ {0,3}(?:[-*+]|\d{1,9}[.)])(?: |$)")
HTML_COMMENT = re.compile(r"<!--.*?-->", re.DOTALL)


def without_indented_code(prose: list[str]) -> list[str]:
    """Blank every indented code block: lines indented four columns or more
    that follow a blank line, outside a list, where such lines continue an
    item instead."""
    out: list[str] = []
    in_list = False
    in_code = False
    previous_blank = True
    for line in prose:
        blank = not line.strip()
        indented = not blank and (line.startswith("    ") or line.startswith("\t"))
        if blank:
            out.append(line)
        elif indented and not in_list and (in_code or previous_blank):
            in_code = True
            out.append("")
        else:
            in_code = False
            if not indented:
                in_list = bool(LIST_ITEM.match(line))
            out.append(line)
        previous_blank = blank
    return out


def without_html_comments(text: str) -> str:
    """Blank every HTML comment, keeping the line breaks."""
    return HTML_COMMENT.sub(lambda m: re.sub(r"[^\n]", " ", m.group(0)), text)


def find_links(prose: list[str]) -> list[tuple[str, int]]:
    """Return (destination, 1-based line) for every inline link, image, and
    link reference definition outside code spans, indented code blocks, and
    HTML comments, in file order."""
    prose = without_indented_code(prose)
    text = without_code_spans(
        without_html_comments("\n".join(line.rstrip() for line in prose))
    )
    links: list[tuple[int, str]] = []
    for match in INLINE_TAIL.finditer(text):
        escaped = match.start() > 0 and text[match.start() - 1] == "\\"
        opened = -1 if escaped else opening_bracket(text, match.start())
        if opened != -1:
            links.append((opened, match.group(1) or match.group(2) or ""))
    links.extend(
        (match.start(), match.group(1) or match.group(2) or "")
        for match in DEFINITION.finditer(text)
    )
    return [
        (destination, text.count("\n", 0, position) + 1)
        for position, destination in sorted(links)
    ]


def resolve_link(destination: str, file: str) -> str | None:
    """Return the path a link in `file` targets, relative to the directory,
    or None when the link is not checked: a scheme, an absolute path, a bare
    fragment, or a target outside the directory."""
    destination = ESCAPED.sub(r"\1", destination)
    if SCHEME.match(destination) or destination.startswith(("/", "\\")):
        return None
    path = unquote(destination.split("#", 1)[0])
    if not path:
        return None
    target = posixpath.normpath(posixpath.join(posixpath.dirname(file), path))
    if target == ".." or target.startswith("../"):
        return None
    return target


def lint_main_file(
    text: str, directory_name: str
) -> tuple[list[dict], list[str] | None]:
    """Return the findings of a `SKILL.md` and its prose lines: the body with
    fenced blocks blanked, or None when the frontmatter is never closed."""
    findings: list[dict] = []
    lines = normalise(text)
    body_start = check_frontmatter(lines, directory_name, findings)
    if body_start is None:
        # An unclosed frontmatter leaves no body to look at; say nothing about it.
        return findings, None
    prose = outside_fences(lines, body_start)
    sections, titles = find_headings(prose)

    if not titles:
        findings.append(
            finding(
                "title-missing",
                "the body has no first-level heading; start it with a `# Title` line, "
                "followed by an introduction",
                min(body_start + 1, len(lines)),
            )
        )
    elif len(titles) > 1:
        findings.append(
            finding(
                "title-multiple",
                f"the body has {len(titles)} first-level headings (the first on line "
                f"{titles[0]}); keep one as the title of the document",
                titles[1],
            )
        )

    first_line: dict[str, int] = {}
    repeated: set[str] = set()
    for name, line in sections:
        if name not in first_line:
            first_line[name] = line
        elif name not in repeated:
            # Once for each repeated name, however often it repeats.
            repeated.add(name)
            findings.append(
                finding(
                    "section-duplicate",
                    f"the recommended section `{name}` appears more than once "
                    f"(first on line {first_line[name]}); merge them",
                    line,
                )
            )
    latest: tuple[str, int] | None = None
    for name, line in first_line.items():
        rank = SECTIONS.index(name)
        if latest is not None and rank < latest[1]:
            findings.append(
                finding(
                    "section-order",
                    f"`{name}` comes after `{latest[0]}`; the recommended order puts it before; "
                    "move the section",
                    line,
                )
            )
        else:
            latest = (name, rank)
    return findings, prose


def listed_files(directory: Path) -> list[str]:
    """Every file below the directory, as sorted relative paths, leaving out
    the main file and every name that starts with a dot."""
    found: list[str] = []
    for root, folders, files in os.walk(directory):
        folders[:] = [name for name in folders if not name.startswith(".")]
        found.extend(
            (Path(root) / name).relative_to(directory).as_posix()
            for name in files
            if not name.startswith(".")
        )
    return sorted(path for path in found if path != MAIN_FILE)


def lint_directory(directory: Path) -> list[dict]:
    """Return every finding for one HARNESS.md directory: those of `SKILL.md`
    first, then those of the other files in path order, each by line."""
    main = directory / MAIN_FILE
    if not main.is_file():
        return [
            finding(
                "main-file-missing",
                f"the directory has no `{MAIN_FILE}`; a HARNESS.md is a directory whose main file "
                f"has that name: add it, or rename the file that holds the design to `{MAIN_FILE}`",
                1,
            )
        ]
    try:
        text = main.read_bytes().decode("utf-8")
    except UnicodeDecodeError:
        return [
            finding(
                "encoding-invalid",
                "the file is not valid UTF-8 text; save it as UTF-8",
                1,
            )
        ]
    findings, prose = lint_main_file(text, directory.resolve().name)
    if prose is None:
        # Without a body no link can be read, so reachability is unknown.
        return findings

    others: list[dict] = []
    reached = {MAIN_FILE}
    queue: list[tuple[str, list[str]]] = [(MAIN_FILE, prose)]
    while queue:
        file, lines = queue.pop()
        for destination, line in find_links(lines):
            target = resolve_link(destination, file)
            if target is None:
                continue
            path = directory / target
            if path.is_dir():
                continue  # a link to a directory resolves and reaches no file
            if not path.is_file():
                (findings if file == MAIN_FILE else others).append(
                    finding(
                        "link-missing",
                        f"the link to `{destination}` leads to no file in the directory; "
                        "correct the path, add the file, or remove the link",
                        line,
                        file,
                    )
                )
                continue
            if target in reached:
                continue
            reached.add(target)
            if not target.lower().endswith(MARKDOWN_SUFFIXES):
                continue
            if any(part.startswith(".") for part in target.split("/")):
                continue  # a dot name is not checked: its links are not read
            try:
                linked = path.read_bytes().decode("utf-8")
            except UnicodeDecodeError:
                others.append(
                    finding(
                        "encoding-invalid",
                        "the file is not valid UTF-8 text, so its links were not read; save it as UTF-8",
                        1,
                        target,
                    )
                )
                continue
            queue.append((target, outside_fences(normalise(linked), 0)))
    others.extend(
        finding(
            "file-unreachable",
            f"no link leads to this file from `{MAIN_FILE}` or from a Markdown file reached from it; "
            "link it where it is used, or remove it",
            1,
            file,
        )
        for file in listed_files(directory)
        if file not in reached
    )
    findings.sort(key=lambda item: item["line"])
    others.sort(key=lambda item: (item["file"], item["line"]))
    return findings + others


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="lint_harness_md.py",
        description="Validate HARNESS.md directories against the format specification.",
        epilog="example: uv run lint_harness_md.py my-design",
    )
    parser.add_argument(
        "paths",
        nargs="*",
        metavar="PATH",
        help="a HARNESS.md directory or the path of its SKILL.md "
        "(default: the current directory, when it holds a SKILL.md)",
    )
    parser.add_argument(
        "--json", action="store_true", help="print findings as JSON on stdout"
    )
    parser.add_argument("--strict", action="store_true", help="exit 1 on warnings too")
    try:
        args = parser.parse_args(argv)
    except SystemExit as stop:
        return 0 if stop.code == 0 else 2

    if not args.paths and not Path(MAIN_FILE).is_file():
        print(
            f"no path given and the current directory holds no {MAIN_FILE}; "
            "pass a HARNESS.md directory, for example: uv run lint_harness_md.py my-design",
            file=sys.stderr,
        )
        return 2
    directories: list[Path] = []
    for path in [Path(p) for p in args.paths] or [Path()]:
        if path.is_dir():
            directories.append(path)
        elif path.is_file() and path.name == MAIN_FILE:
            directories.append(path.parent)
        else:
            what = (
                f"is a file that is not named {MAIN_FILE}"
                if path.is_file()
                else "does not exist"
            )
            print(
                f"{path}: {what}; "
                f"pass a HARNESS.md directory or the path of its {MAIN_FILE}",
                file=sys.stderr,
            )
            return 2

    results = []
    for directory in directories:
        try:
            findings = lint_directory(directory)
        except OSError as error:
            print(
                f"{directory}: cannot be read ({error}); check the permissions and run again",
                file=sys.stderr,
            )
            return 2
        results.append({"path": str(directory), "findings": findings})

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
                # A finding about the directory as a whole carries its path.
                path = (
                    Path(result["path"])
                    if item["code"] == "main-file-missing"
                    else Path(result["path"]) / item["file"]
                )
                print(
                    f"{path}:{item['line']}: "
                    f"{item['severity']}[{item['code']}]: {item['message']}"
                )
    print(
        f"{len(results)} document(s): {errors} error(s), {warnings} warning(s)",
        file=sys.stderr,
    )
    return 1 if errors or (args.strict and warnings) else 0


if __name__ == "__main__":
    sys.exit(main())
