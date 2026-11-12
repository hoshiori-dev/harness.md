"""Tests for lint_harness_md.py. Run: uv run --with pytest --with pyyaml pytest -q"""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

import pytest

HERE = Path(__file__).parent
SPEC = importlib.util.spec_from_file_location(
    "lint_harness_md", HERE / "lint_harness_md.py"
)
assert SPEC and SPEC.loader
lint_harness_md = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(lint_harness_md)

CORE = ["Context", "Environment", "Knowledge", "Feedback", "Gates", "Authority"]
TITLE = "# Demo\n\nAn introduction.\n\n"


def document(
    frontmatter: str = "name: demo\ndescription: A demo.\n",
    sections=None,
    title: str = TITLE,
) -> str:
    names = CORE if sections is None else sections
    body = "".join(f"## {name}\n\nText.\n\n" for name in names)
    return f"---\n{frontmatter}---\n\n{title}{body}"


def kinds(text: str) -> list[tuple[str, str]]:
    return [(f["severity"], f["code"]) for f in lint_harness_md.lint(text)]


def codes(text: str) -> list[str]:
    return sorted(item["code"] for item in lint_harness_md.lint(text))


def test_minimal_file_is_clean():
    assert codes(document()) == []


def test_byte_order_mark_and_crlf_change_nothing():
    assert codes("\ufeff" + document().replace("\n", "\r\n")) == []


def test_unknown_top_level_key_is_an_error():
    found = lint_harness_md.lint(
        document("name: demo\ndescription: A demo.\ntags: [a]\n")
    )
    assert [(f["severity"], f["code"], f["line"]) for f in found] == [
        ("error", "key-unknown", 4)
    ]


def test_metadata_is_never_inspected():
    frontmatter = "name: demo\ndescription: A demo.\nmetadata:\n  name: 1\n  name: 2\n  x: [1, {y: z}]\n"
    assert codes(document(frontmatter)) == []


def test_no_section_is_required_and_overview_is_an_ordinary_heading():
    assert codes(document(sections=[])) == []
    assert codes(document(sections=["Gates"])) == []
    assert codes(document(sections=["Overview", "Context", "Overview"])) == []
    assert "Overview" not in lint_harness_md.SECTIONS
    assert len(lint_harness_md.SECTIONS) == 13


def test_order_and_repetition_are_warnings_reported_once_per_name():
    swapped = ["Environment", "Context", *CORE[2:]]
    assert kinds(document(sections=swapped)) == [("warning", "section-order")]
    assert kinds(document(sections=[*CORE, "Gates", "Gates"])) == [
        ("warning", "section-duplicate")
    ]


def test_headings_inside_fences_and_other_levels_do_not_count():
    text = document() + "```\n## Gates\n# Another title\n```\n\n### Gates\n"
    assert codes(text) == []


def test_missing_or_repeated_first_level_heading_is_a_warning():
    assert kinds(document(title="")) == [("warning", "title-missing")]
    assert kinds(document() + "# Second\n\n# Third\n") == [
        ("warning", "title-multiple")
    ]
    assert codes(document(title="Demo\n====\n\n")) == ["title-missing"]
    assert codes(document(title="   # Demo #\n\n")) == []


def test_unclosed_frontmatter_is_the_only_finding():
    assert codes("---\nname: demo\ndescription: A demo.\n\n# Demo\n") == [
        "frontmatter-invalid"
    ]


def test_name_and_description_limits_are_warnings():
    found = lint_harness_md.lint(
        document(f"name: Bad_Name\ndescription: {'d' * 1025}\n")
    )
    assert {(f["severity"], f["code"]) for f in found} == {
        ("warning", "name-format"),
        ("warning", "description-length"),
    }


def test_version_is_any_string():
    for value in ("1.0.0", "alpha", "2026-11", '"3"'):
        text = document(f"name: demo\ndescription: A demo.\nversion: {value}\n")
        assert codes(text) == []
    assert codes(document("name: demo\ndescription: A demo.\nversion: 1.0\n")) == [
        "key-type"
    ]


def test_cli_exit_codes_and_json(tmp_path, capsys):
    good = tmp_path / "HARNESS.md"
    good.write_text(document(), encoding="utf-8")
    warned = tmp_path / "warned.md"
    warned.write_text(
        document("name: Bad_Name\ndescription: A demo.\n"), encoding="utf-8"
    )
    bad = tmp_path / "bad.md"
    bad.write_text("no frontmatter\n", encoding="utf-8")

    assert lint_harness_md.main([str(good)]) == 0
    assert lint_harness_md.main([str(warned)]) == 0
    assert lint_harness_md.main(["--strict", str(warned)]) == 1
    assert lint_harness_md.main([str(bad)]) == 1
    assert lint_harness_md.main([str(tmp_path / "absent.md")]) == 2
    assert lint_harness_md.main(["--no-such-flag"]) == 2
    capsys.readouterr()

    assert lint_harness_md.main(["--json", str(bad)]) == 1
    report = json.loads(capsys.readouterr().out)
    assert report["errors"] == 1
    assert report["warnings"] == 1
    assert report["files"][0]["findings"][0]["code"] == "frontmatter-missing"


def test_file_that_is_not_utf8_gets_one_error(tmp_path, capsys):
    found = lint_harness_md.lint_bytes(b"---\nname: \xff\n---\n")
    assert [f["code"] for f in found] == ["encoding-invalid"]
    bad = tmp_path / "latin1.md"
    bad.write_bytes("---\nname: caf\u00e9\n---\n".encode("latin-1"))
    assert lint_harness_md.main([str(bad)]) == 1
    assert "error[encoding-invalid]" in capsys.readouterr().out


def test_help_exits_zero(capsys):
    assert lint_harness_md.main(["--help"]) == 0
    assert "example:" in capsys.readouterr().out


def test_fixture_runner_reports_mismatches(tmp_path):
    (tmp_path / "ok.md").write_text(document(), encoding="utf-8")
    (tmp_path / "expected.json").write_text(json.dumps({"ok.md": [], "gone.md": []}))
    assert lint_harness_md.run_fixtures(tmp_path) == [
        "gone.md: listed in expected.json but the file is missing"
    ]


@pytest.mark.skipif(
    not (HERE.parents[2] / "spec" / "fixtures" / "expected.json").is_file(),
    reason="the shared fixtures live in the source repository, not in an installed skill",
)
def test_shared_fixtures_match():
    assert lint_harness_md.run_fixtures(HERE.parents[2] / "spec" / "fixtures") == []
