# lint

## Purpose
The validator of the `HARNESS.md` format: it checks one or more files against
the frontmatter and section rules and reports findings. It ships to users as
`skills/harness-md/scripts/lint_harness_md.py` and runs in this repository as
`scripts/lint_harness_md.ts` (`just harness-md-lint`). Its conformance cases
are the files under `spec/fixtures/` with the codes each must produce in
`spec/fixtures/expected.json`. Non-goals: judging the prose of a section,
reading `metadata`, comparing two files, checking a harness against its
design.

## Requirements

### Requirement: Findings
The validator SHALL report each finding with a severity (`error`, `warning`,
or `note`), a stable code, a message that says what is wrong and how to fix
it, and the line it concerns, printed as `path:line: severity[code]: message`.

#### Scenario: Unknown top-level key
- **WHEN** a file's frontmatter has `tags: [a]` on line 4
- **THEN** the validator prints one line starting `<path>:4: error[key-unknown]:` whose message names `tags` and `metadata`

### Requirement: Errors
The validator SHALL report as errors: `frontmatter-missing`,
`frontmatter-invalid`, `key-missing`, `key-type`, `key-unknown`,
`key-duplicate`, `section-missing`, and `section-duplicate`, as defined by the
`format/frontmatter` and `format/sections` specs.

#### Scenario: File with no frontmatter and no sections
- **WHEN** a file contains only a paragraph of text
- **THEN** the validator reports `frontmatter-missing` once and `section-missing` once for each of the seven required sections

#### Scenario: Several problems in one file
- **WHEN** a file lacks `description`, has an undefined key, and repeats a section
- **THEN** every problem is reported in one run, ordered by line

### Requirement: Warnings and notes
The validator SHALL report as warnings `section-order`, `name-length`,
`name-format`, `description-length`, and `version-unknown`, and as a note
`version-older`.

#### Scenario: Warnings only
- **WHEN** a file's only problem is a `name` containing an underscore
- **THEN** the validator prints the warning and exits 0

### Requirement: Things never reported
The validator SHALL report nothing about the contents of `metadata`, about
sections the format does not define, about the prose of any section, or about
the file's length.

#### Scenario: Section that says the project does nothing
- **WHEN** a required section consists of one sentence saying the layer is not used and why
- **THEN** the validator reports nothing about it

### Requirement: Exit status and options
The validator SHALL exit 0 when no error was found, 1 when an error was found,
and 2 on bad arguments. `--strict` SHALL make warnings exit 1 as well;
`--json` SHALL print the findings as JSON; `--fixtures <dir>` SHALL run every
Markdown file under the directory and compare the codes with
`<dir>/expected.json`.

#### Scenario: Strict mode
- **WHEN** the validator runs with `--strict` on a file that has one warning and no error
- **THEN** it exits 1

#### Scenario: Fixture without an expectation
- **WHEN** a Markdown file under the fixtures directory has no entry in `expected.json`
- **THEN** the fixtures run fails naming that file
