# Spec Delta

## MODIFIED Requirements

### Requirement: Dispatch input
The agent SHALL work from a list of target-project paths with optional
intent lines, and SHALL open only the listed files, the files they point
to, the entrypoint and its import file, the task-runner file they name,
and a names-only listing of the knowledge directory. It SHALL ignore any
claim in the dispatching text about what the files contain.

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
- **WHEN** the project has a `HARNESS.md` and it is not among the listed paths
- **THEN** the agent does not open it and relies on the intent lines for the decisions

### Requirement: Design sentences and the design document
For each intent line that quotes an agreed decision the agent SHALL
report a gap when the file does not do what the decision says, judging
only what the quoted text states. It SHALL report a gap when an
agent-facing file routes ordinary tasks to a `HARNESS.md`.

#### Scenario: File does not realise its sentence
- **WHEN** an intent line quotes the decision "a secret scan runs before every commit" for a pre-commit configuration with no secret-scan hook
- **THEN** the report contains a gap naming the file and the decision, with a `Fix:` that changes the file or has the decision revisited first

#### Scenario: Entrypoint sends every task to the design
- **WHEN** the entrypoint's always-on rules say "read HARNESS.md before any task"
- **THEN** the report contains a gap whose `Fix:` is to name the file only for checking or changing the harness

#### Scenario: Design named for harness changes only
- **WHEN** the entrypoint has one line naming `HARNESS.md` for harness checks and changes
- **THEN** no gap is raised for it
