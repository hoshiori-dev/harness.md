"""Tests for lint_harness_md.py. Run: uv run --with pytest --with pyyaml pytest -q

Every case is a directory built under tmp_path. `CODES` is the full list of
finding codes; a code without a case in `CASES` fails the run.
"""

from __future__ import annotations

import importlib.util
import json
from dataclasses import dataclass
from pathlib import Path

import pytest

HERE = Path(__file__).parent
SPEC = importlib.util.spec_from_file_location(
    "lint_harness_md", HERE / "lint_harness_md.py"
)
assert SPEC and SPEC.loader
lint_harness_md = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(lint_harness_md)

ERRORS = [
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
]
WARNINGS = [
    "key-unknown",
    "key-allowed-tools",
    "link-missing",
    "file-unreachable",
    "title-missing",
    "title-multiple",
    "section-duplicate",
    "section-order",
]
CODES = [*ERRORS, *WARNINGS]

MAIN = "SKILL.md"
CORE = ["Context", "Environment", "Knowledge", "Feedback", "Gates", "Authority"]
TITLE = "# Demo\n\nAn introduction.\n\n"
DESCRIPTION = '"[HARNESS.md] A demo."'
METADATA = "metadata:\n  type: harness-design\n"
LATIN1 = "café [next](b.md)\n".encode("latin-1")


def front(
    name: str | None = "demo",
    description: str | None = DESCRIPTION,
    metadata: str = METADATA,
    extra: str = "",
) -> str:
    """Frontmatter lines: name on line 2, description on 3, metadata from 4."""
    text = "" if name is None else f"name: {name}\n"
    text += "" if description is None else f"description: {description}\n"
    return text + metadata + extra


def sections(*names: str) -> str:
    return TITLE + "".join(f"## {name}\n\nText.\n\n" for name in names)


def document(frontmatter: str | None = None, body: str | None = None) -> str:
    frontmatter = front() if frontmatter is None else frontmatter
    return f"---\n{frontmatter}---\n\n{sections(*CORE) if body is None else body}"


def build(tmp_path: Path, files: dict[str, str | bytes], name: str = "demo") -> Path:
    directory = tmp_path / name
    for relative, content in files.items():
        path = directory / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(content, bytes):
            path.write_bytes(content)
        else:
            path.write_text(content, encoding="utf-8", newline="")
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def found(directory: Path) -> list[tuple[str, str]]:
    return sorted(
        (item["code"], item["file"])
        for item in lint_harness_md.lint_directory(directory)
    )


@dataclass
class Case:
    id: str
    files: dict[str, str | bytes]
    expected: list[tuple[str, str]]
    name: str = "demo"


def main_only(case_id: str, text: str | bytes, *codes: str, name: str = "demo") -> Case:
    return Case(case_id, {MAIN: text}, [(code, MAIN) for code in codes], name)


def linking(body: str) -> str:
    return document(body=TITLE + body)


CASES = [
    # --- conforming documents and things never reported
    main_only("minimal", document()),
    main_only("main-file-alone-without-sections", document(body=TITLE)),
    main_only(
        "custom-headings-only", document(body=TITLE + "## How to use\n\n## Notes\n")
    ),
    main_only(
        "overview-is-ordinary",
        document(body=sections("Overview", "Context", "Overview")),
    ),
    main_only(
        "translated-and-lowercase-headings",
        document(body=TITLE + "## 背景\n\n## gates\n\n## context\n"),
    ),
    main_only("byte-order-mark-and-crlf", "﻿" + document().replace("\n", "\r\n")),
    main_only(
        "delimiter-with-trailing-spaces", document().replace("---\n", "--- \t\n")
    ),
    main_only(
        "closing-hashes-and-indentation",
        document(body=TITLE + "   ## Context ##\n\n## Gates\n"),
    ),
    main_only("title-with-closing-hashes", document(body="   # Demo #\n\n")),
    main_only(
        "headings-in-fences-and-at-other-levels",
        document()
        + "```\n## Gates\n# Another title\n```\n\n~~~~\n## Context\n~~~\n# x\n~~~~\n\n### Gates\n",
    ),
    main_only(
        "all-six-keys-as-strings",
        document(front(extra="license: Apache-2.0\ncompatibility: Needs git.\n")),
    ),
    main_only(
        "metadata-keys-the-format-does-not-define",
        document(
            front(
                metadata="metadata:\n  type: harness-design\n  version: alpha\n  tags: a, b\n"
                "  owner: x\n  owner: y\n  name: other\n"
            )
        ),
    ),
    main_only(
        "metadata-version-any-wording",
        document(front(metadata='metadata:\n  type: harness-design\n  version: "3"\n')),
    ),
    main_only(
        "description-in-a-block-scalar",
        document(front(description=">-\n  [HARNESS.md] A demo\n  on two lines.")),
    ),
    main_only(
        "description-at-the-limit",
        document(front(description='"[HARNESS.md] ' + "d" * 1011 + '"')),
    ),
    main_only(
        "description-of-600-chinese-characters",
        document(front(description='"[HARNESS.md] ' + "设" * 600 + '"')),
    ),
    main_only(
        "compatibility-at-the-limit",
        document(front(extra=f"compatibility: {'c' * 500}\n")),
    ),
    # --- frontmatter
    main_only(
        "only-a-paragraph",
        "Just a paragraph of text.\n",
        "frontmatter-missing",
        "title-missing",
    ),
    main_only(
        "frontmatter-not-on-the-first-line",
        "\n" + document(),
        "frontmatter-missing",
    ),
    main_only(
        "frontmatter-never-closed",
        "---\nname: demo\ndescription: A demo.\n\n# Demo\n\n[x](missing.md)\n",
        "frontmatter-invalid",
    ),
    main_only("frontmatter-empty", document(""), "frontmatter-invalid"),
    main_only(
        "frontmatter-is-a-list",
        document("- name\n- description\n"),
        "frontmatter-invalid",
    ),
    main_only(
        "frontmatter-is-a-scalar", document("just text\n"), "frontmatter-invalid"
    ),
    main_only(
        "frontmatter-bad-yaml",
        document("name: demo\ndescription: 'open\n"),
        "frontmatter-invalid",
    ),
    main_only(
        "marker-prefix-without-quotes",
        document(front(description="[HARNESS.md] A design")),
        "frontmatter-invalid",
    ),
    main_only(
        "marker-prefix-alone-without-quotes",
        document(front(description="[HARNESS.md]")),
        "key-type",
    ),
    # --- required keys
    main_only("description-absent", document(front(description=None)), "key-missing"),
    main_only("name-absent", document(front(name=None)), "key-missing"),
    main_only(
        "name-and-description-absent",
        document(front(name=None, description=None)),
        "key-missing",
        "key-missing",
    ),
    main_only("description-empty", document(front(description='""')), "key-missing"),
    main_only(
        "description-whitespace", document(front(description='"   "')), "key-missing"
    ),
    main_only("name-null", document(front(name="")), "key-missing"),
    main_only("name-number", document(front(name="42")), "key-type"),
    main_only("name-list", document(front(name="[demo]")), "key-type"),
    main_only("description-mapping", document(front(description="{a: b}")), "key-type"),
    main_only("license-number", document(front(extra="license: 2\n")), "key-type"),
    main_only(
        "compatibility-list",
        document(front(extra="compatibility: [git]\n")),
        "key-type",
    ),
    main_only(
        "allowed-tools-list",
        document(front(extra="allowed-tools: [Read]\n")),
        "key-type",
    ),
    main_only("key-twice", document(front(extra="name: demo\n")), "key-duplicate"),
    # --- unknown keys and allowed-tools
    main_only("unknown-key", document(front(extra="tags: a, b\n")), "key-unknown"),
    main_only(
        "top-level-version", document(front(extra='version: "1.0"\n')), "key-unknown"
    ),
    main_only(
        "top-level-version-number",
        document(front(extra="version: 1.0\n")),
        "key-unknown",
    ),
    main_only(
        "allowed-tools",
        document(front(extra="allowed-tools: Read\n")),
        "key-allowed-tools",
    ),
    # --- limits on name, description, compatibility
    main_only(
        "name-with-underscore",
        document(front(name="my_design")),
        "name-format",
        name="my_design",
    ),
    main_only(
        "name-with-capitals",
        document(front(name="My_Design")),
        "name-format",
        name="My_Design",
    ),
    main_only(
        "name-with-double-hyphen",
        document(front(name="my--design")),
        "name-format",
        name="my--design",
    ),
    main_only(
        "name-ending-in-hyphen",
        document(front(name="demo-")),
        "name-format",
        name="demo-",
    ),
    main_only(
        "name-of-65-characters",
        document(front(name="a" * 65)),
        "name-length",
        name="a" * 65,
    ),
    main_only("name-of-64-characters", document(front(name="a" * 64)), name="a" * 64),
    main_only(
        "name-differs-from-directory",
        document(front(name="my-design")),
        "name-directory",
        name="team-harness",
    ),
    main_only(
        "description-over-the-limit",
        document(front(description='"[HARNESS.md] ' + "d" * 1012 + '"')),
        "description-length",
    ),
    main_only(
        "compatibility-over-the-limit",
        document(front(extra=f"compatibility: {'c' * 501}\n")),
        "compatibility-length",
    ),
    main_only(
        "compatibility-empty",
        document(front(extra='compatibility: ""\n')),
        "compatibility-length",
    ),
    # --- type marker
    main_only(
        "description-without-the-marker",
        document(front(description="A harness design for small libraries.")),
        "marker-prefix",
    ),
    main_only(
        "marker-in-lower-case",
        document(front(description='"[harness.md] A demo."')),
        "marker-prefix",
    ),
    main_only(
        "marker-later-in-the-sentence",
        document(front(description='"A demo. [HARNESS.md]"')),
        "marker-prefix",
    ),
    main_only("metadata-absent", document(front(metadata="")), "marker-type"),
    main_only(
        "metadata-without-type",
        document(front(metadata="metadata:\n  tags: a\n")),
        "marker-type",
    ),
    main_only(
        "type-skill",
        document(front(metadata="metadata:\n  type: skill\n")),
        "marker-type",
    ),
    main_only(
        "type-in-other-case",
        document(front(metadata="metadata:\n  type: Harness-Design\n")),
        "marker-type",
    ),
    main_only(
        "ordinary-skill-with-neither-half",
        document(front(description="Does things. Use when asked.", metadata="")),
        "marker-prefix",
        "marker-type",
    ),
    # --- metadata values
    main_only(
        "metadata-not-a-mapping",
        document(front(metadata="metadata: harness-design\n")),
        "metadata-value",
    ),
    main_only(
        "metadata-a-list", document(front(metadata="metadata: [a]\n")), "metadata-value"
    ),
    main_only(
        "metadata-null", document(front(metadata="metadata:\n")), "metadata-value"
    ),
    main_only(
        "metadata-values-of-other-types",
        document(
            front(
                metadata="metadata:\n  type: harness-design\n  tags: [a, b]\n  owner: {team: x}\n"
                "  version: 1.0\n  draft: true\n  note:\n"
            )
        ),
        *["metadata-value"] * 5,
    ),
    # --- title and sections, read from the main file only
    main_only("no-title", document(body="## Context\n\nText.\n"), "title-missing"),
    main_only("empty-body", document(body=""), "title-missing"),
    main_only("setext-title", document(body="Demo\n====\n\nText.\n"), "title-missing"),
    main_only(
        "title-without-space", document(body="#Demo\n\nText.\n"), "title-missing"
    ),
    main_only(
        "title-only-in-a-fence", document(body="```\n# Demo\n```\n"), "title-missing"
    ),
    main_only("three-titles", document() + "# Second\n\n# Third\n", "title-multiple"),
    main_only(
        "section-three-times",
        document(body=sections("Gates", "Gates", "Gates")),
        "section-duplicate",
    ),
    main_only(
        "two-sections-repeated",
        document(body=sections("Context", "Gates", "Context", "Gates")),
        "section-duplicate",
        "section-duplicate",
    ),
    main_only(
        "sections-out-of-order",
        document(body=sections("Authority", "Environment")),
        "section-order",
    ),
    main_only(
        "indented-section-out-of-order",
        document(body=TITLE + "## Gates\n\n   ## Context\n"),
        "section-order",
    ),
    main_only(
        "last-section-out-of-order",
        document(body=sections(*CORE, "Invariants")),
        "section-order",
    ),
    Case(
        "headings-in-a-linked-file",
        {
            MAIN: linking("## Gates\n\nSee [the gates](gates.md).\n"),
            "gates.md": "# One\n\n# Two\n\n## Gates\n\n## Authority\n\n## Environment\n\n## Gates\n",
        },
        [],
    ),
    Case(
        "title-only-in-a-linked-file",
        {
            MAIN: document(body="See [the design](design.md).\n"),
            "design.md": "# Design\n",
        },
        [("title-missing", MAIN)],
    ),
    # --- the directory
    Case("no-main-file", {"README.md": "# Readme\n"}, [("main-file-missing", MAIN)]),
    Case(
        "design-under-another-name",
        {"HARNESS.md": document(), "notes.md": "[x](missing.md)\n"},
        [("main-file-missing", MAIN)],
    ),
    Case(
        "main-file-in-another-encoding",
        {MAIN: document().encode() + LATIN1, "b.md": "text\n", "loose.txt": "x"},
        [("encoding-invalid", MAIN)],
    ),
    Case(
        "linked-file-in-another-encoding",
        {
            MAIN: linking("[a](a.md) and [c](c.md)\n"),
            "a.md": LATIN1,
            "b.md": "text\n",
            "c.md": "[gone](gone.md)\n",
        },
        [
            ("encoding-invalid", "a.md"),
            ("file-unreachable", "b.md"),
            ("link-missing", "c.md"),
        ],
    ),
    # --- links and reachability
    Case(
        "file-reached-through-another-file",
        {
            MAIN: linking("See [the gates](references/gates.md).\n"),
            "references/gates.md": "Run [the check](../scripts/check.py).\n",
            "scripts/check.py": "print('ok')\n",
        },
        [],
    ),
    Case(
        "file-linked-only-from-an-unreached-file",
        {
            MAIN: document(),
            "notes.md": "See [the draft](draft.md).\n",
            "draft.md": "text\n",
        },
        [("file-unreachable", "draft.md"), ("file-unreachable", "notes.md")],
    ),
    Case(
        "file-no-link-reaches",
        {MAIN: document(), "scripts/check.py": "print('ok')\n"},
        [("file-unreachable", "scripts/check.py")],
    ),
    main_only(
        "link-that-does-not-resolve",
        linking("See [the gates](references/gates.md).\n"),
        "link-missing",
    ),
    main_only(
        "image-that-does-not-resolve",
        linking("![a diagram](assets/flow.png)\n"),
        "link-missing",
    ),
    Case(
        "image-and-link-with-a-title",
        {
            MAIN: linking(
                '![flow](assets/flow.png "The flow") and [a](<my notes.md> "t") and [b](two%20words.md)\n'
            ),
            "assets/flow.png": b"\x89PNG",
            "my notes.md": "text\n",
            "two words.md": "text\n",
        },
        [],
    ),
    Case(
        "image-inside-a-link",
        {
            MAIN: linking("[![flow](flow.png)](gates.md)\n"),
            "flow.png": b"\x89PNG",
            "gates.md": "text\n",
        },
        [],
    ),
    main_only(
        "links-in-indented-code-and-html-comments",
        linking(
            "Text.\n\n    [a](missing.md)\n\n<!--\n[b](gone.md)\n-->\n\n"
            '<a href="absent.md">x</a>\n'
        ),
    ),
    main_only(
        "indented-line-in-a-list-item-is-text",
        linking("- item\n\n    [a](missing.md)\n"),
        "link-missing",
    ),
    Case(
        "markdown-suffix-is-a-markdown-file",
        {
            MAIN: linking("[a](a.markdown)\n"),
            "a.markdown": "[b](b.md)\n",
            "b.md": "x\n",
        },
        [],
    ),
    main_only(
        "links-in-fenced-blocks-and-code-spans",
        linking(
            "```markdown\n[a](missing.md)\n```\n\n~~~\n[m]: missing.md\n~~~\n\n"
            "Write `[b](missing.md)` or ``[c](missing.md) ` ``, and \\[d\\](missing.md).\n"
        ),
    ),
    main_only(
        "links-that-leave-the-directory",
        linking(
            "[a](../other/README.md) [b](/etc/hosts) [c](https://example.com/a.md)\n"
            "[d](mailto:a@example.com) [e](#gates) [f](references/../../up.md) <https://example.com>\n"
        ),
    ),
    Case(
        "link-with-a-fragment",
        {
            MAIN: linking("See [the gates](references/gates.md#no-such-heading).\n"),
            "references/gates.md": "text\n",
        },
        [],
    ),
    Case(
        "reference-style-link",
        {
            MAIN: linking(
                "See [the gates][g] and [the rest][r].[^1]\n\n[g]: references/gates.md\n[r]: <rest.md> 'Rest'\n\n[^1]: A note.\n"
            ),
            "references/gates.md": "text\n",
            "rest.md": "text\n",
        },
        [],
    ),
    main_only(
        "reference-definition-that-does-not-resolve",
        linking("See [the gates][g].\n\n[g]: references/gates.md\n"),
        "link-missing",
    ),
    Case(
        "link-to-a-directory",
        {
            MAIN: linking("The scripts are in [scripts/](scripts/) and [here](.).\n"),
            "scripts/check.py": "x\n",
            "scripts/lib/util.py": "x\n",
        },
        [
            ("file-unreachable", "scripts/check.py"),
            ("file-unreachable", "scripts/lib/util.py"),
        ],
    ),
    Case(
        "names-starting-with-a-dot",
        {
            MAIN: document(),
            ".gitkeep": "",
            ".cache/data.json": "{}",
            "assets/.DS_Store": "x",
        },
        [],
    ),
    Case(
        "links-between-files-in-a-circle",
        {
            MAIN: linking("[a](a.md)\n"),
            "a.md": "[b](sub/b.md) [main](SKILL.md)\n",
            "sub/b.md": "[a](../a.md) [gone](gone.md)\n",
        },
        [("link-missing", "sub/b.md")],
    ),
    Case(
        "section-repeated-across-files",
        {MAIN: linking("## Gates\n\n[more](gates.md)\n"), "gates.md": "## Gates\n"},
        [],
    ),
]


@pytest.mark.parametrize("case", CASES, ids=[case.id for case in CASES])
def test_case(case: Case, tmp_path):
    assert found(build(tmp_path, case.files, case.name)) == sorted(case.expected)


def test_case_ids_are_unique():
    ids = [case.id for case in CASES]
    assert len(ids) == len(set(ids))


def test_every_finding_code_has_a_case():
    covered = {code for case in CASES for code, _ in case.expected}
    assert [code for code in CODES if code not in covered] == [], (
        "finding codes without a test case"
    )
    assert sorted(lint_harness_md.SEVERITY) == sorted(CODES), (
        "the script and this list of finding codes differ"
    )


def test_severity_of_every_code():
    assert sorted(lint_harness_md.ERRORS) == sorted(ERRORS)
    assert sorted(lint_harness_md.WARNINGS) == sorted(WARNINGS)
    assert {lint_harness_md.SEVERITY[code] for code in ERRORS} == {"error"}
    assert {lint_harness_md.SEVERITY[code] for code in WARNINGS} == {"warning"}


def test_six_keys_and_thirteen_sections():
    assert lint_harness_md.KEYS == [
        "name",
        "description",
        "license",
        "compatibility",
        "metadata",
        "allowed-tools",
    ]
    assert len(lint_harness_md.SECTIONS) == 13
    assert "Overview" not in lint_harness_md.SECTIONS


def run(capsys, *args: str) -> tuple[int, str, str]:
    status = lint_harness_md.main([str(arg) for arg in args])
    captured = capsys.readouterr()
    return status, captured.out, captured.err


def test_conforming_directory_exits_zero_with_and_without_strict(tmp_path, capsys):
    directory = build(
        tmp_path,
        {
            MAIN: document(front(name="my-design"), TITLE + "[gates](gates.md)\n"),
            "gates.md": "x\n",
        },
        "my-design",
    )
    assert run(capsys, directory)[:2] == (0, "")
    assert run(capsys, "--strict", directory)[:2] == (0, "")


def test_path_of_the_main_file_stands_for_its_directory(tmp_path, capsys):
    directory = build(
        tmp_path,
        {MAIN: document(front(name="other", extra="tags: a\n")), "loose.txt": "x"},
    )
    assert run(capsys, directory / MAIN)[:2] == run(capsys, directory)[:2]
    status, out, _ = run(capsys, directory / MAIN)
    assert status == 1
    assert "error[name-directory]" in out and "warning[file-unreachable]" in out


@pytest.mark.parametrize(
    "other", ["HARNESS.md", "references/gates.md", "absent", "absent/SKILL.md"]
)
def test_path_that_is_neither_a_directory_nor_a_main_file(tmp_path, capsys, other):
    directory = build(
        tmp_path,
        {
            MAIN: "no frontmatter\n",
            "HARNESS.md": document(),
            "references/gates.md": "x\n",
        },
    )
    status, out, err = run(capsys, directory, directory / other)
    assert status == 2
    assert out == ""
    assert other in err and "SKILL.md" in err


def test_unknown_option_exits_two(capsys):
    assert run(capsys, "--no-such-flag")[0] == 2
    assert run(capsys, "--fixtures", "x")[0] == 2


def test_no_argument_checks_the_current_directory_when_it_holds_a_main_file(
    tmp_path, capsys, monkeypatch
):
    monkeypatch.chdir(build(tmp_path, {MAIN: document(front(extra="tags: a\n"))}))
    status, out, _ = run(capsys)
    assert status == 0
    assert out.startswith("SKILL.md:6: warning[key-unknown]:")
    monkeypatch.chdir(build(tmp_path, {"README.md": "x\n"}, "empty"))
    status, out, err = run(capsys)
    assert (status, out) == (2, "")
    assert "SKILL.md" in err


def test_help_exits_zero_with_a_usage_example(capsys):
    status, out, _ = run(capsys, "--help")
    assert status == 0
    assert "example: uv run lint_harness_md.py my-design" in out
    assert "--fixtures" not in out


def test_strict_makes_a_warning_exit_one(tmp_path, capsys):
    directory = build(tmp_path, {MAIN: document(front(extra='version: "1.0"\n'))})
    status, out, _ = run(capsys, directory)
    assert status == 0
    assert out.count("\n") == 1
    assert "warning[key-unknown]" in out and "metadata.version" in out
    assert run(capsys, "--strict", directory)[0] == 1


def test_error_exits_one(tmp_path, capsys):
    directory = build(tmp_path, {MAIN: document(front(name="my_design"))}, "my_design")
    status, out, _ = run(capsys, directory)
    assert status == 1
    assert f"{directory / MAIN}:2: error[name-format]:" in out


def test_unknown_key_line_names_the_key_and_metadata(tmp_path, capsys):
    text = (
        "---\nname: demo\ndescription: '[HARNESS.md] A demo.'\ntags: a, b\n"
        + METADATA
        + "---\n\n"
        + TITLE
    )
    directory = build(tmp_path, {MAIN: text})
    status, out, _ = run(capsys, directory)
    assert status == 0
    assert out.startswith(f"{directory}/SKILL.md:4: warning[key-unknown]:")
    assert "`tags`" in out and "`metadata`" in out


def test_section_repeated_three_times_prints_one_line(tmp_path, capsys):
    directory = build(
        tmp_path, {MAIN: document(body=sections("Gates", "Gates", "Gates"))}
    )
    status, out, _ = run(capsys, directory)
    assert status == 0
    assert out.count("warning[section-duplicate]") == 1
    assert "`Gates`" in out


def test_finding_in_a_file_other_than_the_main_file(tmp_path, capsys):
    directory = build(
        tmp_path,
        {
            MAIN: linking("[gates](references/gates.md)\n"),
            "references/gates.md": "# Gates\n\n\n\n\n\nSee [the rest](missing.md).\n",
        },
    )
    status, out, _ = run(capsys, directory)
    assert status == 0
    assert out.startswith(f"{directory}/references/gates.md:7: warning[link-missing]:")

    status, out, _ = run(capsys, "--json", directory)
    report = json.loads(out)
    assert (report["errors"], report["warnings"]) == (0, 1)
    assert len(report["files"]) == 1
    assert report["files"][0]["path"] == str(directory)
    (item,) = report["files"][0]["findings"]
    assert (item["file"], item["line"], item["code"], item["severity"]) == (
        "references/gates.md",
        7,
        "link-missing",
        "warning",
    )


def test_json_has_one_object_for_each_directory(tmp_path, capsys):
    good = build(tmp_path, {MAIN: document()})
    bad = build(tmp_path, {"README.md": "x\n"}, "bad")
    status, out, _ = run(capsys, "--json", good, bad)
    report = json.loads(out)
    assert status == 1
    assert [entry["path"] for entry in report["files"]] == [str(good), str(bad)]
    assert report["files"][0]["findings"] == []
    (item,) = report["files"][1]["findings"]
    assert (item["code"], item["file"], item["line"]) == ("main-file-missing", MAIN, 1)


def test_directory_without_a_main_file_carries_the_directory_path(tmp_path, capsys):
    directory = build(tmp_path, {"README.md": "# Readme\n", "HARNESS.md": document()})
    status, out, _ = run(capsys, directory)
    assert status == 1
    assert out.startswith(f"{directory}:1: error[main-file-missing]:")
    assert out.count("\n") == 1


def test_findings_are_ordered_main_file_first_then_by_path_then_by_line(tmp_path):
    directory = build(
        tmp_path,
        {
            MAIN: document(
                front(extra="tags: a\n"),
                TITLE + "[z](a/z.md) [b](b.md)\n\n[gone](gone.md)\n",
            ),
            "a/z.md": "text\n\n[gone](gone.md)\n[also](also.md)\n",
            "b.md": "[gone](gone.md)\n",
            "c.txt": "x",
        },
    )
    assert [
        (item["file"], item["line"], item["code"])
        for item in lint_harness_md.lint_directory(directory)
    ] == [
        (MAIN, 6, "key-unknown"),
        (MAIN, 15, "link-missing"),
        ("a/z.md", 3, "link-missing"),
        ("a/z.md", 4, "link-missing"),
        ("b.md", 1, "link-missing"),
        ("c.txt", 1, "file-unreachable"),
    ]


def test_several_problems_are_reported_in_one_run_ordered_by_line(tmp_path):
    text = document(
        front(description=None, extra="status: draft\n"), sections("Gates", "Gates")
    )
    directory = build(tmp_path, {MAIN: text})
    items = lint_harness_md.lint_directory(directory)
    assert sorted(item["code"] for item in items) == [
        "key-missing",
        "key-unknown",
        "section-duplicate",
    ]
    assert [item["line"] for item in items] == sorted(item["line"] for item in items)


def test_link_line_is_the_line_where_the_link_starts(tmp_path):
    body = TITLE + "Text.\n[a link over\ntwo lines](gone.md)\n\n[g]: also-gone.md\n"
    directory = build(tmp_path, {MAIN: document(body=body)})
    assert [
        (item["code"], item["line"])
        for item in lint_harness_md.lint_directory(directory)
    ] == [("link-missing", 13), ("link-missing", 16)]


def test_messages_say_how_to_fix(tmp_path):
    def messages(text: str, name: str = "demo") -> dict[str, str]:
        directory = build(tmp_path, {MAIN: text}, name)
        return {
            item["code"]: item["message"]
            for item in lint_harness_md.lint_directory(directory)
        }

    unquoted = messages(document(front(description="[HARNESS.md] A design")))
    assert "quote the value" in unquoted["frontmatter-invalid"]
    assert "block scalar" in unquoted["frontmatter-invalid"]

    alone = messages(document(front(description="[HARNESS.md]")))
    assert (
        "quote the value" in alone["key-type"] and "block scalar" in alone["key-type"]
    )

    version = messages(document(front(extra="version: 1.0\n")))
    assert "metadata.version" in version["key-unknown"]

    both = messages(document(front(name="my-design")), "team-harness")
    assert "`my-design`" in both["name-directory"]
    assert "`team-harness`" in both["name-directory"]

    halves = messages(document(front(description="Plain.", metadata="")))
    assert "`description`" in halves["marker-prefix"]
    assert "[HARNESS.md]" in halves["marker-prefix"]
    assert "metadata.type" in halves["marker-type"]
    assert "harness-design" in halves["marker-type"]

    value = messages(
        document(front(metadata="metadata:\n  type: harness-design\n  version: 1.0\n"))
    )
    assert "`metadata.version`" in value["metadata-value"]

    tools = messages(document(front(extra="allowed-tools: Read Grep\n")))
    assert "`allowed-tools`" in tools["key-allowed-tools"]


def test_every_finding_has_the_five_fields(tmp_path):
    for index, case in enumerate(CASES):
        directory = build(tmp_path / str(index), case.files, case.name)
        for item in lint_harness_md.lint_directory(directory):
            assert item["message"].strip() == item["message"] != ""
            assert set(item) == {"severity", "code", "message", "file", "line"}
            assert item["severity"] == lint_harness_md.SEVERITY[item["code"]]
            assert item["line"] >= 1
