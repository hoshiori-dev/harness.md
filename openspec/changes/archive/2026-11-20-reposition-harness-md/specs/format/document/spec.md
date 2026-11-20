# Spec Delta

## REMOVED Requirements

### Requirement: Two uses

**Reason**: The format no longer describes template and anchor document
as its two uses. A template placed in a project root was one way of using
a design as a reference, and the root is not where a reference has to be.

**Migration**: See "Uses of a file". A file used as a template before
is a file used as a reference; nothing in such a file changes.

## ADDED Requirements

### Requirement: Uses of a file
The format SHALL support four uses and favour none in its syntax:
a summary of all or part of a harness design, written to be handed on;
a reference brought in from outside while a harness is designed;
an abstraction of a harness to imitate, carrying its design
without its implementation; and an anchor document a project keeps.
A project SHALL NOT be expected to keep a `HARNESS.md` of its own.

#### Scenario: Summary of part of a harness
- **WHEN** an author writes a file that describes only how one project gates its changes
- **THEN** the file conforms, and its description and introduction say what it covers

#### Scenario: Several references
- **WHEN** a team designing a harness reads three files obtained from elsewhere
- **THEN** each is weighed against the team's own project, and none has to be placed in that project's repository

#### Scenario: Design to imitate
- **WHEN** a team wants a harness like another project's
- **THEN** that project's design is first written as a file, and the team builds from the file's decisions and reasons instead of copying the other project's configuration

#### Scenario: Project without a file
- **WHEN** a project has a working harness and no `HARNESS.md`
- **THEN** nothing in the format treats the project as incomplete

### Requirement: Authority of a file that is not the anchor
A `HARNESS.md` that a project has not adopted as its anchor document
SHALL have no authority over that project.
Its statements are material to weigh against the project's own conditions,
never instructions to carry out and never a record of the project's intent.

#### Scenario: Reference disagrees with the project
- **WHEN** a reference file calls for a gate the project does not have
- **THEN** that is not drift; whether to adopt the gate is a design decision for the project

## MODIFIED Requirements

### Requirement: Which source prevails for an anchor document
When a project has explicitly adopted a `HARNESS.md` as its anchor document,
design intent SHALL be taken from the file,
and the state of the system (what a command does, whether a path exists,
which checks run) SHALL be taken from the code and the actual configuration.

#### Scenario: Artifact disagrees with the design
- **WHEN** a harness artifact contradicts the project's anchor `HARNESS.md`
- **THEN** the design has drifted: either the artifact is repaired or the file is formally revised

#### Scenario: Design statement taken as fact
- **WHEN** the file says a gate runs before every commit
- **THEN** no person or agent treats that as in effect without checking the repository

### Requirement: Not resident context
A `HARNESS.md` SHALL NOT be an agent entrypoint and SHALL NOT be loaded for
ordinary tasks; it is opened when a harness is designed or built
with the file as a reference, when the file itself is written or revised,
and, for an anchor document, when the harness is checked for drift
or deliberately improved.
The format SHALL place no limit on the length of the file or of a section.

#### Scenario: Long file
- **WHEN** a `HARNESS.md` is several thousand lines long
- **THEN** a validator reports nothing about its length

### Requirement: File layout
A `HARNESS.md` SHALL be UTF-8 text consisting of YAML frontmatter, which
starts on the first line with a line containing only `---` and ends at the
next such line, followed by a Markdown body. An anchor document SHALL be named
`HARNESS.md` and live in the repository root. The format SHALL prescribe
neither a name nor a location for any other file.

#### Scenario: Frontmatter not on the first line
- **WHEN** the first line of the file is not `---`
- **THEN** a validator reports that the frontmatter is missing

#### Scenario: Frontmatter never closed
- **WHEN** the opening `---` has no matching closing line
- **THEN** a validator reports that the frontmatter is invalid and nothing about the body

#### Scenario: File under another name
- **WHEN** a summary is saved as `gates-design.md` in a temporary directory
- **THEN** a validator checks it exactly as it would a file named `HARNESS.md`
