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

REQUIRED = lint_harness_md.REQUIRED_SECTIONS


def document(
    frontmatter: str = "name: demo\ndescription: A demo.\n", sections=None
) -> str:
    body = "".join(f"## {name}\n\nText.\n\n" for name in (sections or REQUIRED))
    return f"---\n{frontmatter}---\n\n# Demo\n\n{body}"


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


def test_missing_required_section_and_optional_absence():
    without_gates = [name for name in REQUIRED if name != "Gates"]
    assert codes(document(sections=without_gates)) == ["section-missing"]


def test_order_is_a_warning_and_duplicate_an_error():
    swapped = ["Context", "Overview", *REQUIRED[2:]]
    assert codes(document(sections=swapped)) == ["section-order"]
    assert codes(document(sections=[*REQUIRED, "Gates"])) == ["section-duplicate"]


def test_headings_inside_fences_and_other_levels_do_not_count():
    text = document(sections=[n for n in REQUIRED if n != "Authority"])
    text += "```\n## Authority\n```\n\n### Authority\n"
    assert codes(text) == ["section-missing"]


def test_name_and_description_limits_are_warnings():
    found = lint_harness_md.lint(
        document(f"name: Bad_Name\ndescription: {'d' * 1025}\n")
    )
    assert {(f["severity"], f["code"]) for f in found} == {
        ("warning", "name-format"),
        ("warning", "description-length"),
    }


def test_version_rules():
    assert codes(document("name: demo\ndescription: A demo.\nversion: alpha\n")) == []
    assert codes(document("name: demo\ndescription: A demo.\nversion: beta\n")) == [
        "version-unknown"
    ]
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
    assert report["errors"] == 8
    assert report["files"][0]["findings"][0]["code"] == "frontmatter-missing"


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
