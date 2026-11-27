# Spec Delta

## ADDED Requirements

### Requirement: A kind of Agent Skill
A `HARNESS.md` SHALL be an Agent Skill that also follows this format:
a directory named after its `name`, whose main file is `SKILL.md`.
The directory as a whole SHALL be the unit:
the body may rely on other files in it, and sections may live in them.
The specification SHALL state each Agent Skills rule it relies on
and credit its source, so that an author needs one specification.

#### Scenario: Checked as an ordinary skill
- **WHEN** a conforming document is checked against the Agent Skills rules on the directory, the main file, and the frontmatter
- **THEN** it meets every one of them

#### Scenario: Section in another file
- **WHEN** a document's `SKILL.md` links to a file in the same directory that holds its section on gates
- **THEN** the document conforms, and that file is part of the document

#### Scenario: Author looks for a skill rule
- **WHEN** an author searches the specification for the limit on the length of `description`
- **THEN** the limit is stated there with its source, and the Agent Skills specification does not have to be opened

#### Scenario: Skill without the type marker
- **WHEN** a directory is a valid Agent Skill and its `SKILL.md` lacks the type marker
- **THEN** it is not a `HARNESS.md`

### Requirement: Assets
A `HARNESS.md` SHALL be allowed to carry assets, scripts included,
beside its prose.
The specification SHALL give writing guidance for them:
an asset is about the topic of the document,
independent of one project's content, and stable over time;
where project information cannot be avoided,
`SKILL.md` says what to replace and how.
A validator SHALL check none of this guidance.

#### Scenario: Script beside the prose
- **WHEN** a document carries a script that its `SKILL.md` links to and explains
- **THEN** the document conforms

#### Scenario: Asset that holds project information
- **WHEN** a template in a document contains one project's paths and `SKILL.md` does not say what to replace
- **THEN** a validator reports nothing about it; the gap is a finding of a review

#### Scenario: Document without assets
- **WHEN** a document consists of `SKILL.md` alone
- **THEN** it conforms, and nothing in the format treats it as incomplete

### Requirement: Description guidance
After the type marker, the specification SHALL guide an author
to write a `description` that says what the design is, whom it suits,
and when it is worth opening.
It SHALL NOT ask for the behaviour-first description
that is usual for a skill.
A validator SHALL check none of this guidance;
the rules a validator applies to `description`
are those of `format/frontmatter`.

#### Scenario: Description read alone
- **WHEN** a reader sees only the description of a document written to the guidance
- **THEN** the reader can tell what the design is, whom it suits, and when to open it, without opening the body

#### Scenario: Description that ignores the guidance
- **WHEN** a description starts with the type marker, is within the length limit, and says nothing about whom the design suits
- **THEN** a validator reports nothing about it

### Requirement: Assets are reference copies
An asset of a `HARNESS.md` SHALL be a reference copy in every document,
a project's anchor document included:
it is never the implementation of a project's harness,
and it SHALL NOT be run in place.
A project that wants what an asset does gets its own copy,
adapted to the project, by a decision of the project.

#### Scenario: Asset of a reference
- **WHEN** a reference document carries a script the project could use
- **THEN** the script is not run from the document's directory; the project gets its own copy only by a decision of the project, adapted to it

#### Scenario: Asset of the anchor document
- **WHEN** a project's anchor document carries a script
- **THEN** no command, hook, or check of the project calls the script inside the document's directory

## MODIFIED Requirements

### Requirement: Design intent apart from implementation
A `HARNESS.md` SHALL record the design of an agent harness
(decisions, premises, reasons, and expected mechanisms)
apart from the artifacts that implement it.
The specification SHALL define the document format only:
it SHALL NOT prescribe the components of a harness or any technology choice,
and it is no substitute for a method of harness design.

#### Scenario: Reader looks for required components
- **WHEN** the specification is searched for the mechanisms a harness must have
- **THEN** it names none; it defines the document's layout, metadata, recommended headings, and validation rules, and gives writing guidance

#### Scenario: Document that carries a script
- **WHEN** a document carries a script for one of the mechanisms it describes
- **THEN** the specification neither requires that script nor says what it must do, and the design is still recorded in the prose

### Requirement: Which source prevails for an anchor document
When a project has explicitly adopted a `HARNESS.md` as its anchor document,
design intent SHALL be taken from the document,
and the state of the system (what a command does, whether a path exists,
which checks run) SHALL be taken from the code and the actual configuration.

#### Scenario: Artifact disagrees with the design
- **WHEN** a harness artifact contradicts the project's anchor `HARNESS.md`
- **THEN** the design has drifted: either the artifact is repaired or the document is formally revised

#### Scenario: Design statement taken as fact
- **WHEN** the document says a gate runs before every commit
- **THEN** no person or agent treats that as in effect without checking the repository

#### Scenario: Asset taken as the state of the system
- **WHEN** the anchor document carries a script and the project runs a different one for the same purpose
- **THEN** what the project does is read from the project's own script, never from the asset

### Requirement: Not resident context
A `HARNESS.md` SHALL NOT be an agent entrypoint,
and nothing SHALL route an ordinary task to it;
its body is opened only to design, check, or change a harness.
In a skills directory a client lists its description,
which is the user's choice and not a matter of conformance.
The format SHALL place no limit on the length of the document,
of a file in it, or of a section.

#### Scenario: Long file
- **WHEN** the `SKILL.md` of a `HARNESS.md` is several thousand lines long
- **THEN** a validator reports nothing about its length

#### Scenario: Entrypoint names the anchor document
- **WHEN** a project's entrypoint names its anchor document
- **THEN** the mention sends no ordinary task to the document: an agent opens it only to design, check, or change the harness

#### Scenario: Document in a skills directory
- **WHEN** a user places a document where a client lists skills
- **THEN** the document still conforms, the client shows its description like any skill's, and a validator reports nothing about the location

### Requirement: Understandable without the specification
A reader with no tool, no skill, and no knowledge of the specification SHALL
be able to understand a conforming document.
The format SHALL define only the document's outer structure,
six top-level metadata keys, a type marker,
and the rules for recognising headings,
and SHALL express the design in prose.
The specification SHALL explain the type marker once.

#### Scenario: No value needs a lookup
- **WHEN** a conforming document is read by someone who has never seen the specification
- **THEN** no key, code, or enumerated value in it requires the specification to interpret; the two values of the type marker are plain words that say what kind of document it is

### Requirement: File layout
A `HARNESS.md` SHALL be a directory whose main file, `SKILL.md`,
is UTF-8 text consisting of YAML frontmatter, which starts on the first line
with a line containing only `---` and ends at the next such line,
followed by a Markdown body.
The format SHALL prescribe no location for a document.
An anchor document SHALL be a document that carries the type marker
and that the project's entrypoint names, wherever it sits.

#### Scenario: Frontmatter not on the first line
- **WHEN** the first line of `SKILL.md` is not `---`
- **THEN** a validator reports that the frontmatter is missing

#### Scenario: Frontmatter never closed
- **WHEN** the opening `---` has no matching closing line
- **THEN** a validator reports that the frontmatter is invalid and nothing about the body

#### Scenario: File under another name
- **WHEN** a directory holds the design in a file named `HARNESS.md` and has no `SKILL.md`
- **THEN** a validator reports that the main file is missing

#### Scenario: Document in a temporary directory
- **WHEN** a summary is saved as a document directory outside any repository
- **THEN** a validator checks it exactly as it would the same directory inside a project

#### Scenario: Marked document the entrypoint names
- **WHEN** a project's entrypoint names a document that carries the type marker
- **THEN** that document is the project's anchor document, in whichever directory it sits

#### Scenario: Marked document nothing names
- **WHEN** a document that carries the type marker sits in a project's repository and the entrypoint does not name it
- **THEN** it is not the project's anchor document

#### Scenario: Named file without the marker
- **WHEN** a project's entrypoint names a Markdown file called `HARNESS.md` in the repository root that carries no type marker
- **THEN** the file is ordinary Markdown: neither a `HARNESS.md` nor an anchor document

### Requirement: Encoding and harmless variations
A validator SHALL accept a UTF-8 byte order mark at the start of `SKILL.md`,
spaces and tabs at the end of a delimiter line, and CRLF line endings.
It SHALL report a `SKILL.md` that is not valid UTF-8 as an error
and check nothing else in that file.

#### Scenario: Byte order mark and CRLF line endings
- **WHEN** a `SKILL.md` starts with a UTF-8 byte order mark or uses CRLF line endings
- **THEN** it is validated exactly as the same file without them

#### Scenario: Whitespace after a delimiter
- **WHEN** a delimiter line is `---` followed by spaces
- **THEN** it is still read as a delimiter

#### Scenario: File in another encoding
- **WHEN** a `SKILL.md` is saved as Latin-1 and contains a non-ASCII character
- **THEN** a validator reports one error saying the file is not UTF-8 and nothing else about that file

### Requirement: Conformance
A document SHALL conform to the format
when a validator reports no error for it;
warnings SHALL NOT affect conformance.

#### Scenario: File with warnings only
- **WHEN** the recommended sections in a document's `SKILL.md` are out of order and nothing else is wrong
- **THEN** the document conforms to the format

#### Scenario: Empty section
- **WHEN** a section's heading is present with no prose under it
- **THEN** the document conforms, because a validator never reads prose, although the section fails its reader

### Requirement: Conformance is not adequacy
Passing validation SHALL mean only that the document meets the layout,
syntax, metadata, and heading rules.
Whether the design is complete, suits the project, or can be built from,
and whether an asset works or follows the writing guidance,
SHALL be left to engineering review by people or agents.

#### Scenario: Thin but conforming design
- **WHEN** a document passes validation and describes no way for the agent to check its work
- **THEN** the gap is a finding of a design review, not of the validator

#### Scenario: Asset that does not work
- **WHEN** a document passes validation and a script it carries fails when run
- **THEN** the failure is a finding of a review, not of the validator

### Requirement: Uses of a file
The format SHALL support four uses and favour none in its syntax:
a summary of all or part of a harness design, written to be handed on;
a reference brought in from outside while a harness is designed;
an abstraction of a harness to imitate, carrying its design
without its implementation; and an anchor document a project keeps.
A project SHALL NOT be expected to keep a `HARNESS.md` of its own.

#### Scenario: Summary of part of a harness
- **WHEN** an author writes a document that describes only how one project gates its changes
- **THEN** the document conforms, and its description and introduction say what it covers

#### Scenario: Several references
- **WHEN** a team designing a harness reads three documents obtained from elsewhere
- **THEN** each is weighed against the team's own project, and none has to be placed in that project's repository

#### Scenario: Design to imitate
- **WHEN** a team wants a harness like another project's
- **THEN** that project's design is first written as a document, and the team builds from the document's decisions and reasons instead of copying the other project's configuration

#### Scenario: Project without a file
- **WHEN** a project has a working harness and no `HARNESS.md`
- **THEN** nothing in the format treats the project as incomplete

### Requirement: Authority of a file that is not the anchor
A `HARNESS.md` that is not a project's anchor document
SHALL have no authority over that project,
wherever it sits, the project's own repository included.
Its statements are material to weigh against the project's own conditions,
never instructions to carry out and never a record of the project's intent.

#### Scenario: Reference disagrees with the project
- **WHEN** a reference document calls for a gate the project does not have
- **THEN** that is not drift; whether to adopt the gate is a design decision for the project

#### Scenario: Reference placed inside the project
- **WHEN** a document obtained from elsewhere is copied into a project's knowledge folder and the entrypoint does not name it
- **THEN** it has the standing it had outside the repository: a design to weigh
