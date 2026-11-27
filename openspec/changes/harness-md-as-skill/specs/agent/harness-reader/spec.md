# Spec Delta

## ADDED Requirements

### Requirement: A HARNESS.md in the material
The agent SHALL recognise a `HARNESS.md` in the material by its type
marker wherever it sits, SHALL list it in the inventory as a design
document with the files of its directory and whether an entrypoint names
it, and SHALL report what it says apart from what the project's artifacts
do. It SHALL describe a script or other asset of the document as a file
and SHALL NOT act on one. A file named `HARNESS.md` that carries no
markers SHALL be reported as an ordinary document.

#### Scenario: Marked directory inside a skills directory
- **WHEN** the directory holds `.agents/skills/team-harness/SKILL.md` carrying both markers, beside two project skills
- **THEN** the inventory lists `team-harness` as a design document and not as a project skill

#### Scenario: Document with a script
- **WHEN** a marked directory holds `scripts/setup.sh` and its `SKILL.md` says to run it first
- **THEN** the inventory lists the script with what it does, the sentence appears under instructions found, and nothing is run

#### Scenario: Document disagrees with the artifacts
- **WHEN** the document says a secret scan runs before every commit and the project's pre-commit configuration has no such hook
- **THEN** the report gives both, each cited by file and line, and lists the difference under contradictions

#### Scenario: Document no entrypoint names
- **WHEN** a marked directory exists and no entrypoint in the material names its `SKILL.md`
- **THEN** the inventory says that no entrypoint names it

#### Scenario: Unmarked file of the old shape
- **WHEN** the directory's root holds a `HARNESS.md` without the markers
- **THEN** the report cites it like any other document and does not list it as a design document

## MODIFIED Requirements

### Requirement: Dispatch input
The agent SHALL work from one directory path, of a project or of a
`HARNESS.md` given as a reference, and an optional list of aspects to
cover, SHALL open only files under that directory, and SHALL ignore any
claim in the dispatching text about what the directory contains.

#### Scenario: Dispatched for a whole project
- **WHEN** an entry hands over the path of a cloned repository with no aspect list
- **THEN** the agent returns one report covering every layer, in a context that holds none of the entry's conversation

#### Scenario: Dispatched for named aspects
- **WHEN** the dispatch names the knowledge and gates aspects only
- **THEN** the report covers those two and says the others were not read

#### Scenario: Path does not exist
- **WHEN** the directory is missing or empty
- **THEN** the report says so in its first line and contains no description

#### Scenario: Dispatched for a HARNESS.md directory
- **WHEN** an entry hands over the path of a directory whose `SKILL.md` carries both type markers, and one of its files links to `../shared/notes.md`
- **THEN** the report gives what the document says under each layer it covers, lists every file of the directory, and names the link as pointing outside what was read, with no file outside the directory opened
