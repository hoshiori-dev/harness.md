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

### Requirement: Design intent apart from implementation
A `HARNESS.md` SHALL record the design of an agent harness
(decisions, premises, reasons, and expected mechanisms)
apart from the artifacts that implement it.
The specification SHALL define the document format only:
it SHALL NOT prescribe the components of a harness or any technology choice,
and it is no substitute for a method of harness design.

#### Scenario: Reader looks for required components
- **WHEN** the specification is searched for the mechanisms a harness must have
- **THEN** it names none; it defines the file's structure, metadata, recommended headings, and validation rules

### Requirement: Which source prevails for an anchor document
When a `HARNESS.md` is kept as an anchor document,
design intent SHALL be taken from the file,
and the state of the system (what a command does, whether a path exists,
which checks run) SHALL be taken from the code and the actual configuration.

#### Scenario: Artifact disagrees with the design
- **WHEN** a harness artifact contradicts the project's anchor `HARNESS.md`
- **THEN** the design has drifted: either the artifact is repaired or the file is formally revised

#### Scenario: Design statement taken as fact
- **WHEN** the file says a gate runs before every commit
- **THEN** no person or agent treats that as in effect without checking the repository

### Requirement: Two uses
The format SHALL support use as a template (expanded into a harness and then
optionally deleted) and as an anchor document (kept in the repository and
changed rarely), and SHALL favour neither.

#### Scenario: Template use
- **WHEN** a team places an existing `HARNESS.md` in a project root and gives a coding agent the project's background and stack
- **THEN** the agent turns the design into artifacts for that repository, and the file may be deleted once the harness works

#### Scenario: Anchor use
- **WHEN** a team keeps the file in the repository root for the long term
- **THEN** it stays stable like a charter and does not change with everyday feature work

### Requirement: Not resident context
A `HARNESS.md` SHALL NOT be an agent entrypoint and SHALL NOT be loaded for
ordinary tasks; it is opened when a harness is built or rebuilt, checked for
drift, or deliberately improved.
The format SHALL place no limit on the length of the file or of a section.

#### Scenario: Long file
- **WHEN** a `HARNESS.md` is several thousand lines long
- **THEN** a validator reports nothing about its length

### Requirement: Understandable without the specification
A reader with no tool, no skill, and no knowledge of the specification SHALL
be able to understand a conforming file.
The format SHALL define only the file's outer structure,
five top-level metadata fields, and the rules for recognising headings,
and SHALL express the design in prose.

#### Scenario: No value needs a lookup
- **WHEN** a conforming file is read by someone who has never seen the specification
- **THEN** no key, code, or enumerated value in it requires the specification to interpret

### Requirement: Implementation-neutral and portable
A `HARNESS.md` SHALL record the mechanisms and behavioural boundaries a design
aims for, not the configuration syntax of one agent client,
so that another agent can implement an equivalent design
on a different toolchain or host.

#### Scenario: File names a specific client
- **WHEN** a file mentions a particular client, model, or scripting tool
- **THEN** it explains the role that item plays in the design and why, so the design can be rebuilt elsewhere

### Requirement: File layout
A `HARNESS.md` SHALL be UTF-8 text consisting of YAML frontmatter, which
starts on the first line with a line containing only `---` and ends at the
next such line, followed by a Markdown body. A project's file SHALL be named
`HARNESS.md` and live in the repository root; a reusable design is the same
kind of file.

#### Scenario: Frontmatter not on the first line
- **WHEN** the first line of the file is not `---`
- **THEN** a validator reports that the frontmatter is missing

#### Scenario: Frontmatter never closed
- **WHEN** the opening `---` has no matching closing line
- **THEN** a validator reports that the frontmatter is invalid and nothing about the body

### Requirement: Encoding and harmless variations
A validator SHALL accept a UTF-8 byte order mark at the start of the file,
spaces and tabs at the end of a delimiter line, and CRLF line endings.
It SHALL report a file that is not valid UTF-8 as an error
and check nothing else in it.

#### Scenario: Byte order mark and CRLF line endings
- **WHEN** a file starts with a UTF-8 byte order mark or uses CRLF line endings
- **THEN** it is validated exactly as the same file without them

#### Scenario: Whitespace after a delimiter
- **WHEN** a delimiter line is `---` followed by spaces
- **THEN** it is still read as a delimiter

#### Scenario: File in another encoding
- **WHEN** a file is saved as Latin-1 and contains a non-ASCII character
- **THEN** a validator reports one error saying the file is not UTF-8 and nothing else

### Requirement: Conformance
A file SHALL conform to the format when a validator reports no error for it;
warnings SHALL NOT affect conformance.

#### Scenario: File with warnings only
- **WHEN** a file's recommended sections are out of order and nothing else is wrong
- **THEN** the file conforms to the format

#### Scenario: Empty section
- **WHEN** a section's heading is present with no prose under it
- **THEN** the file conforms, because a validator never reads prose, although the section fails its reader

### Requirement: Conformance is not adequacy
Passing validation SHALL mean only that the file meets the syntax, metadata,
and heading rules. Whether the design is complete, suits the project,
or can be built from SHALL be left to engineering review by people or agents.

#### Scenario: Thin but conforming design
- **WHEN** a file passes validation and describes no way for the agent to check its work
- **THEN** the gap is a finding of a design review, not of the validator
