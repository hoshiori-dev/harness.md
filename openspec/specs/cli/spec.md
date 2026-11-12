# CLI Catalog

## Purpose
Rules shared by every command-line tool this repository provides for the
format. Each tool has its own spec at `openspec/specs/cli/<name>/spec.md`.
Tools are not published as packages: the copy users run ships inside a skill
as a Python script, and the repository's own CI runs a TypeScript
implementation from `scripts/`. Non-goals: a diff or comparison tool, a
formatter, a published package.

## Requirements

### Requirement: Two implementations, one behaviour
A tool that ships to users SHALL be a Python script with PEP 723 inline
metadata, run with `uv`, inside the skill that uses it; the repository's own
checks SHALL use a TypeScript implementation under `scripts/`. Both SHALL
produce the same finding codes for every case under `spec/fixtures/`.

#### Scenario: Implementations diverge
- **WHEN** one implementation reports a different set of codes for a fixture than `spec/fixtures/expected.json` lists
- **THEN** `just fixtures-check` fails naming the fixture, the expected codes, and the codes reported

### Requirement: Script conduct
Every tool SHALL run without prompting, offer `--help` with a usage example,
write findings to stdout and diagnostics to stderr, offer JSON output, and
exit 0 on success, 1 on findings, and 2 on bad arguments.

#### Scenario: Path that is not a file
- **WHEN** a tool is given a path that does not exist
- **THEN** it prints what is wrong on stderr and exits 2
