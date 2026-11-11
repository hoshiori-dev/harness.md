# HARNESS.md Document

## Purpose
What a `HARNESS.md` file is, how it is used, and how it is laid out as a
file. Together with `format/frontmatter` and `format/sections` this is the
structured statement of the format; the prose specification in
`spec/spec.md` is written from these three specs and is the only source
outside readers are pointed to. Non-goals: describing how to build a
harness, giving writing guidance, defining any tool other than a validator
of the format.

## Requirements

### Requirement: Role as the design's source of truth
A `HARNESS.md` SHALL be the source of truth for a project's agent harness
design. Design intent SHALL be taken from the file and facts (what a command
does, whether a path exists) from the code.

#### Scenario: Artifact disagrees with the design
- **WHEN** a harness artifact contradicts a sentence of the project's anchor `HARNESS.md`
- **THEN** either the artifact is fixed or the file is changed first; the artifact is never treated as the newer truth silently

### Requirement: Two uses
The format SHALL support use as a template (expanded into a harness and then
optionally deleted) and as an anchor document (kept in the repository and
changed rarely), and SHALL favour neither.

#### Scenario: Template use
- **WHEN** a user places an existing `HARNESS.md` in a project root and states the project's goal to a coding agent
- **THEN** the file is sufficient for the agent to build the harness without any other document, and the file may be deleted afterwards

#### Scenario: Adopting a file from elsewhere as the anchor
- **WHEN** a file written for another project is kept as a project's anchor document
- **THEN** its Context section is rewritten for the project first and sections that depended on the old Context are reconsidered

### Requirement: Not resident context
A `HARNESS.md` SHALL NOT be an agent entrypoint and SHALL NOT be loaded for
ordinary tasks; it is opened when a harness is built, checked for drift, or
improved. The format SHALL place no limit on the file's length.

#### Scenario: Long file
- **WHEN** a `HARNESS.md` is several thousand lines long
- **THEN** a validator reports nothing about its length

### Requirement: Understandable without the specification
A reader with no tool, no skill, and no knowledge of the specification SHALL
be able to understand a conforming file. The format SHALL define only
identity fields and a section skeleton, and SHALL express the design in prose.

#### Scenario: No value needs a lookup
- **WHEN** a conforming file is read by someone who has never seen the specification
- **THEN** no key, code, or enumerated value in it requires the specification to interpret

### Requirement: File layout
A `HARNESS.md` SHALL be UTF-8 text consisting of YAML frontmatter, which
starts on the first line with a line containing only `---` and ends at the
next such line, followed by a Markdown body. A project's file SHALL be named
`HARNESS.md` and live in the repository root; a reusable design is the same
kind of file.

#### Scenario: Frontmatter not on the first line
- **WHEN** the first line of the file is not `---`
- **THEN** a validator reports that the frontmatter is missing

#### Scenario: Byte order mark and CRLF line endings
- **WHEN** a file starts with a UTF-8 byte order mark or uses CRLF line endings
- **THEN** it is validated exactly as the same file without them

### Requirement: Conformance
A file SHALL conform to the format when a validator reports no error for it;
warnings and notes SHALL NOT affect conformance.

#### Scenario: File with warnings only
- **WHEN** a file's sections are out of order and nothing else is wrong
- **THEN** the file conforms to the format

#### Scenario: Empty required section
- **WHEN** a required section's heading is present with no prose under it
- **THEN** the file conforms, because a validator never reads prose, although the section fails its reader
