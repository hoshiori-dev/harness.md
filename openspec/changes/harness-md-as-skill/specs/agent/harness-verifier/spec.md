# Spec Delta

## ADDED Requirements

### Requirement: Recognising the design document
The agent SHALL recognise a design document by both halves of the type
marker the format defines, reading only the frontmatter of a `SKILL.md` that the
entrypoint or a listed file names, or that the knowledge directory listing
shows. It SHALL NOT open the body or any other file of a design
document's directory unless that path is listed. A file named `HARNESS.md`
that carries no markers SHALL be treated as ordinary Markdown.

#### Scenario: Marked document named by the entrypoint
- **WHEN** the entrypoint names `.agents/knowledge/project-harness/SKILL.md` and that file's frontmatter carries both markers
- **THEN** the agent treats the directory as the project's design document, having read nothing of it beyond the frontmatter

#### Scenario: One marker only
- **WHEN** a `SKILL.md` has a description that starts with `[HARNESS.md]` and no `metadata.type`
- **THEN** the agent does not treat it as a design document, and the file is held to the checks of any file where it sits

#### Scenario: Unmarked file of the old shape
- **WHEN** the project root holds a `HARNESS.md` without the markers and the entrypoint says "read HARNESS.md before any task"
- **THEN** the report raises no gap about routing to a design document, and the file is read back as any file the entrypoint routes to

### Requirement: A design document in the knowledge directory is one unit
The agent SHALL treat a design document's directory inside the knowledge
directory as one unit, reachable when an entrypoint route or a project
skill names its `SKILL.md`. For a file inside it the agent SHALL NOT raise
an unreachable gap, a missing load condition gap, or an unfilled
placeholder gap for a placeholder in one of its assets. A directory that
nothing names SHALL draw one unreachable gap for the directory as a whole.

#### Scenario: Directory with references and assets
- **WHEN** the knowledge directory listing shows `project-harness/SKILL.md`, `project-harness/references/decisions.md`, and `project-harness/assets/check.py`, and the entrypoint has one line naming the `SKILL.md` for harness checks and changes
- **THEN** the report contains no unreachable gap and no `no load condition` gap for any of the three files

#### Scenario: Placeholder in an asset
- **WHEN** a listed path is an asset of the design document that contains `{{PROJECT_NAME}}`
- **THEN** the report raises no unfilled placeholder gap for it

#### Scenario: Directory that nothing names
- **WHEN** the knowledge directory holds a marked directory with four files, and no entrypoint route and no project skill names its `SKILL.md`
- **THEN** the report contains one unreachable gap naming the directory, whose `Fix:` is to name its `SKILL.md` in the entrypoint for checking or changing the harness or to remove the directory, and no gap per file

#### Scenario: Knowledge file beside the directory
- **WHEN** the knowledge directory holds a named design document directory and, beside it, a knowledge file reachable from no route
- **THEN** the report contains an unreachable gap for the knowledge file

## MODIFIED Requirements

### Requirement: Dispatch input
The agent SHALL work from a list of target-project paths with optional
intent lines, and SHALL open only the listed files, the files they point
to, the entrypoint and its import file, the task-runner file they name,
a names-only listing of the knowledge directory, and the frontmatter of a
`SKILL.md` found through these. It SHALL ignore any claim in the
dispatching text about what the files contain.

#### Scenario: Dispatched after a build
- **WHEN** an entry hands over every file it created, each with an intent line quoting the agreed decision the file realises
- **THEN** the agent returns one report covering every listed file, in a context that holds none of the build conversation

#### Scenario: Dispatched without intent lines
- **WHEN** three paths arrive with no intent lines
- **THEN** the agent derives each file's purpose from its own content and the route that reaches it

#### Scenario: Listed file does not exist
- **WHEN** one listed path is missing
- **THEN** the report contains `<path>: listed for verification but not found. Fix: create it or remove it from the list` and the other files are still read

#### Scenario: HARNESS.md not listed
- **WHEN** the entrypoint names the project's design document and no file of its directory is among the listed paths
- **THEN** the agent reads the frontmatter of its `SKILL.md` and nothing else of the directory, and relies on the intent lines for the decisions

### Requirement: Design sentences and the design document
For each intent line that quotes an agreed decision the agent SHALL
report a gap when the file does not do what the decision says, judging
only what the quoted text states. It SHALL report a gap when an
agent-facing file routes ordinary tasks to a design document.

#### Scenario: File does not realise its sentence
- **WHEN** an intent line quotes the decision "a secret scan runs before every commit" for a pre-commit configuration with no secret-scan hook
- **THEN** the report contains a gap naming the file and the decision, with a `Fix:` that changes the file or has the decision revisited first

#### Scenario: Entrypoint sends every task to the design
- **WHEN** the entrypoint's always-on rules say "read `.agents/knowledge/project-harness/SKILL.md` before any task" and that file carries both markers
- **THEN** the report contains a gap that names the entrypoint and the document's path, whose `Fix:` is to name the document only for checking or changing the harness

#### Scenario: Design named for harness changes only
- **WHEN** the entrypoint has one line naming the design document's `SKILL.md` for harness checks and changes
- **THEN** no gap is raised for it
