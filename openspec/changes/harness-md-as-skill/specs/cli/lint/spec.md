# Spec Delta

## ADDED Requirements

### Requirement: Links and reachability
The validator SHALL read links from `SKILL.md` and from every Markdown file
reached from it, counting inline links and images and ignoring text in code
spans and fenced blocks. A file is reached when a link read this way targets
it. A link with a scheme, an absolute path, or a target outside the directory
SHALL NOT be checked, and a fragment SHALL be ignored.
Files and directories whose name starts with a dot SHALL NOT be checked.

#### Scenario: File reached through another file
- **WHEN** `SKILL.md` links to `references/gates.md`, which links to `../scripts/check.py`, and both exist
- **THEN** the validator reports `file-unreachable` for neither

#### Scenario: File linked only from an unreached file
- **WHEN** `notes.md` links to `draft.md` and no file reached from `SKILL.md` links to `notes.md`
- **THEN** the validator reports `file-unreachable` for both

#### Scenario: Link inside a fenced block
- **WHEN** the only mention of `missing.md` in the directory is a link written inside a fenced code block
- **THEN** the validator reports nothing about it

#### Scenario: Link that leaves the directory
- **WHEN** `SKILL.md` links to `../other/README.md`, to `/etc/hosts`, and to `https://example.com/a.md`
- **THEN** the validator reports nothing about any of the three, whether or not the targets exist

#### Scenario: Link with a fragment
- **WHEN** `SKILL.md` links to `references/gates.md#no-such-heading` and `references/gates.md` exists
- **THEN** the validator reports no `link-missing`, and `references/gates.md` counts as reached

#### Scenario: Reference-style link
- **WHEN** `SKILL.md` has `[the gates][g]` and the definition `[g]: references/gates.md`, and the file exists
- **THEN** `references/gates.md` counts as reached, and a definition whose target does not exist is reported as `link-missing` on its own line

#### Scenario: Link to a directory
- **WHEN** `SKILL.md` links to `scripts/` and to no file under it
- **THEN** the validator reports no `link-missing` for the link and `file-unreachable` for each file under `scripts/`

#### Scenario: Name starting with a dot
- **WHEN** the directory holds `.gitkeep` and `.cache/data.json`, and no link targets them
- **THEN** the validator reports nothing about them

### Requirement: Arguments, exit status, and options
The validator SHALL take as arguments directories or paths of a `SKILL.md`,
each standing for its directory, and treat any other path as a bad argument.
It SHALL exit 0 when no error was found, 1 when an error was found,
and 2 on bad arguments. `--strict` SHALL make warnings exit 1 as well;
`--json` SHALL print the findings as JSON, one object for each validated
directory, each finding carrying a `file` relative to that directory
beside its line.

#### Scenario: Strict mode
- **WHEN** the validator runs with `--strict` on a directory that has one warning and no error
- **THEN** it exits 1

#### Scenario: Conforming directory
- **WHEN** the validator is given the directory `my-design`, whose `SKILL.md` states `name: my-design`, a `description` starting with `[HARNESS.md]`, and `metadata.type: harness-design`, has one title, and links to every other file in the directory
- **THEN** it prints no finding and exits 0, with and without `--strict`

#### Scenario: Path of the main file
- **WHEN** the validator is given `my-design/SKILL.md`
- **THEN** it reports the same findings and exits with the same status as when given `my-design`

#### Scenario: Path that is neither a directory nor a main file
- **WHEN** the validator is given an existing file `my-design/HARNESS.md` or `my-design/references/gates.md`
- **THEN** it prints what is wrong on stderr, validates nothing, and exits 2

#### Scenario: JSON finding in a file other than the main file
- **WHEN** the validator runs with `--json` on `my-design`, whose `references/gates.md` has a link that does not resolve
- **THEN** the object for `my-design` holds a finding whose `file` is `references/gates.md`, with its line and the code `link-missing`

#### Scenario: No argument in this repository
- **WHEN** `just harness-md-lint` runs with no path
- **THEN** it validates `.agents/knowledge/project-harness` and every directory directly under `hub/`

## MODIFIED Requirements

### Requirement: Findings
The validator SHALL report each finding with a severity (`error` or `warning`),
a stable code, a message that says what is wrong and how to fix
it, and the file and line it concerns, printed as
`path:line: severity[code]: message`, where `path` is the path of that file.
A finding about a file as a whole SHALL carry line 1;
a finding about the directory as a whole SHALL carry the directory's path
and line 1.

#### Scenario: Unknown top-level key
- **WHEN** the `SKILL.md` of the directory `<dir>` has `tags: a, b` in its frontmatter on line 4
- **THEN** the validator prints one line starting `<dir>/SKILL.md:4: warning[key-unknown]:` whose message names `tags` and `metadata`

#### Scenario: Findings in several files
- **WHEN** `SKILL.md` and two files reached from it each have a finding
- **THEN** the findings of `SKILL.md` are printed first, then those of the other files in path order, each file's findings ordered by line

#### Scenario: Finding in a file other than the main file
- **WHEN** `<dir>/references/gates.md`, reached from `SKILL.md`, links on line 7 to `missing.md`, which is not in `<dir>/references/`
- **THEN** the validator prints one line starting `<dir>/references/gates.md:7: warning[link-missing]:`

### Requirement: Errors
The validator SHALL report as errors: `encoding-invalid`, `main-file-missing`,
`frontmatter-missing`, `frontmatter-invalid`, `key-missing`, `key-type`,
`key-duplicate`, `name-format`, `name-length`, `name-directory`,
`description-length`, `compatibility-length`, `marker-prefix`, `marker-type`,
and `metadata-value`, as defined by the `format/document` and
`format/frontmatter` specs. Nothing about the body is an error.

#### Scenario: File with no frontmatter and no headings
- **WHEN** a directory's `SKILL.md` contains only a paragraph of text
- **THEN** the validator reports the error `frontmatter-missing` and the warning `title-missing`, and nothing about sections

#### Scenario: Several problems in one file
- **WHEN** a `SKILL.md` lacks `description`, has an undefined key, and repeats a recommended section
- **THEN** every problem is reported in one run, ordered by line

#### Scenario: Directory without a main file
- **WHEN** the validator is given a directory that holds `README.md` and no `SKILL.md`
- **THEN** it reports the error `main-file-missing` and nothing else about that directory

#### Scenario: Description without the marker
- **WHEN** a `description` is `A harness design for small libraries.`
- **THEN** the validator reports the error `marker-prefix`

#### Scenario: Description absent
- **WHEN** the frontmatter has no `description`
- **THEN** the validator reports `key-missing` for it and no `marker-prefix`

#### Scenario: Type marker absent or different
- **WHEN** the frontmatter has no `metadata`, a `metadata` without `type`, or `metadata.type: skill`
- **THEN** the validator reports the error `marker-type`

#### Scenario: Name differs from the directory
- **WHEN** the `SKILL.md` in the directory `team-harness` states `name: my-design`
- **THEN** the validator reports the error `name-directory`, naming both

#### Scenario: Name outside the character rules
- **WHEN** a `name` is `my_design`
- **THEN** the validator reports the error `name-format` and exits 1

#### Scenario: Metadata value that is not a string
- **WHEN** a key in `metadata` holds a list, a nested mapping, or `1.0` without quotes, which YAML reads as a number
- **THEN** the validator reports the error `metadata-value` for that key

#### Scenario: Metadata that is not a mapping
- **WHEN** the frontmatter states `metadata: harness-design`
- **THEN** the validator reports the error `metadata-value` and no `marker-type`

#### Scenario: Marker prefix written without quotes
- **WHEN** a line reads `description: [HARNESS.md] A design`, which YAML reads as a malformed list
- **THEN** the validator reports the error `frontmatter-invalid`, and its message says to quote the value or use a block scalar

#### Scenario: Empty compatibility
- **WHEN** the frontmatter states `compatibility: ""`
- **THEN** the validator reports the error `compatibility-length`

#### Scenario: Main file in another encoding
- **WHEN** `SKILL.md` is not valid UTF-8
- **THEN** the validator reports `encoding-invalid` for it and nothing else about the directory

#### Scenario: Linked file in another encoding
- **WHEN** a Markdown file reached from `SKILL.md` is not valid UTF-8
- **THEN** the validator reports `encoding-invalid` for that file, reads no link from it, and checks the rest of the directory

#### Scenario: Description over the limit
- **WHEN** a `description` is 1025 characters long
- **THEN** the validator reports the error `description-length`

#### Scenario: Compatibility over the limit
- **WHEN** a `compatibility` is 501 characters long
- **THEN** the validator reports the error `compatibility-length`

### Requirement: Warnings
The validator SHALL report as warnings `key-unknown`, `key-allowed-tools`,
`link-missing`, `file-unreachable`, `title-missing`, `title-multiple`,
`section-duplicate`, and `section-order`.
The title and section warnings SHALL be read from `SKILL.md` only.
`title-multiple` SHALL be reported once for a document,
and `section-duplicate` once for each repeated name.

#### Scenario: Section repeated three times
- **WHEN** a `SKILL.md` has three `## Gates` headings
- **THEN** the validator prints one `warning[section-duplicate]` line and exits 0

#### Scenario: Warnings only
- **WHEN** a document's only problem is a top-level `version: "1.0"`
- **THEN** the validator prints a `key-unknown` warning whose message points to `metadata.version`, and exits 0

#### Scenario: Allowed tools present
- **WHEN** the frontmatter states `allowed-tools: Read`
- **THEN** the validator reports the warning `key-allowed-tools` and no `key-unknown`

#### Scenario: Link that does not resolve
- **WHEN** `SKILL.md` links to `references/gates.md` and the directory has no such file
- **THEN** the validator reports the warning `link-missing` on the line of the link

#### Scenario: File no link reaches
- **WHEN** the directory holds `scripts/check.py` and no link read by the validator targets it
- **THEN** the validator reports the warning `file-unreachable` for `scripts/check.py`

#### Scenario: Section repeated across files
- **WHEN** `SKILL.md` and a file it links to each have one `## Gates` heading
- **THEN** the validator reports no `section-duplicate`

### Requirement: Things never reported
The validator SHALL report nothing about the contents of `metadata` beyond
`type` and the rule that every value is a string,
about a recommended section that is left out, about headings outside the
recommended vocabulary or in a file other than `SKILL.md`,
about the wording of the title or the introduction,
about the prose of any section, about the length of any file,
or about where the directory sits.

#### Scenario: File without any recommended section
- **WHEN** a `SKILL.md` has valid frontmatter, a title, and only custom headings
- **THEN** the validator reports nothing

#### Scenario: Heading outside the vocabulary
- **WHEN** a `SKILL.md` has a `## Overview` heading
- **THEN** the validator reports nothing about it

#### Scenario: Metadata keys the format does not define
- **WHEN** `metadata` holds `version: alpha`, `tags: a, b`, and a key written twice, beside `type: harness-design`
- **THEN** the validator reports nothing about `metadata`

#### Scenario: Headings in a linked file
- **WHEN** a file reached from `SKILL.md` has two level-one headings and the recommended sections out of order
- **THEN** the validator reports nothing about that file's headings

## REMOVED Requirements

### Requirement: Exit status and options
**Reason**: Its `--fixtures` option and the scenario "Fixture without an expectation" have no subject once the conformance fixtures are removed, and a modified requirement cannot drop a scenario.
**Migration**: The requirement "Arguments, exit status, and options" replaces it: exit statuses and `--strict` are unchanged, arguments are directories or `SKILL.md` paths, and each implementation's unit tests take the place of the fixtures run.
