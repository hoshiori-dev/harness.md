# Harness Verifier Agent

## Purpose

Governs what the `harness-verifier` agent observably does when a workflow
dispatches it to read back harness files just built or changed in a target
project: a clean-context, read-only reader that reports what an agent
would load and owe from each file, where the harness contradicts itself,
and whether each file does what the design sentence it was built from
says. It ships to Claude Code only, because Codex plugins carry no agents
component and Antigravity loads plugin agents only from the plugin root
(`.agents/knowledge/compatibility-watch.md`); in those clients the
workflows fall back to a clean-context subagent or a recorded self-read.

Non-goals: editing or fixing files; reading the plugin's own files or
comparing a harness with them; reading the project's `HARNESS.md` when it
is not a listed path; replacing the project's own deterministic harness
check; judging whether the design is right.

## Requirements

### Requirement: Dispatch input
The agent SHALL work from a list of target-project paths with optional
intent lines, and SHALL open only the listed files, the files they point
to, the entrypoint and its import file, the task-runner file they name,
and a names-only listing of the knowledge directory. It SHALL ignore any
claim in the dispatching text about what the files contain.

#### Scenario: Dispatched after a build
- **WHEN** a build hands over every file it created, each with an intent line quoting a sentence of the project's `HARNESS.md`
- **THEN** the agent returns one report covering every listed file, in a context that holds none of the build conversation

#### Scenario: Dispatched without intent lines
- **WHEN** three paths arrive with no intent lines
- **THEN** the agent derives each file's purpose from its own content and the route that reaches it

#### Scenario: Listed file does not exist
- **WHEN** one listed path is missing
- **THEN** the report contains `<path>: listed for verification but not found. Fix: create it or remove it from the list` and the other files are still read

#### Scenario: HARNESS.md not listed
- **WHEN** the project has a `HARNESS.md` and it is not among the listed paths
- **THEN** the agent does not open it and relies on the intent lines for the design sentences

### Requirement: Refusals
The agent SHALL refuse a request to write, fix, or edit a file, and a
request to open or compare against the plugin's own files, by stating the
refusal as the first line of its report and then performing the full
read-back.

#### Scenario: Asked to fix what it finds
- **WHEN** the dispatching text says "verify these files and fix whatever you find"
- **THEN** the first report line states that it reads only, every gap carries a `Fix:` action, and no file changes

#### Scenario: Asked to compare with plugin templates
- **WHEN** the dispatching text asks for a comparison with the plugin's templates
- **THEN** the first report line states that it does not read the plugin's files, and it opens no path outside the target project

### Requirement: Per-file facts
For every listed agent-facing file the agent SHALL report its load
condition, the obligations it places on an agent, its named source of
truth, and whether every pointer resolves. A machine-consumed file
(task runner, CI, pre-commit, client settings, scripts) SHALL receive only
the pointer, placeholder, budget, and design-sentence checks.

#### Scenario: Knowledge file with a stated condition
- **WHEN** a knowledge file opens with "Read this when preparing a release" and the entrypoint routes to it under that condition
- **THEN** the report quotes the condition, lists the obligations, and names the file as the source for the release steps

#### Scenario: Machine-consumed file listed
- **WHEN** a `justfile` and a CI workflow are listed
- **THEN** the report raises no `no load condition` gap for either

#### Scenario: No client-specific import file
- **WHEN** the project has `AGENTS.md` and no `CLAUDE.md`
- **THEN** the absence of `CLAUDE.md` is not reported as a gap

### Requirement: Gaps in the harness's own consistency
The agent SHALL report as gaps: a knowledge or skill file with no load
condition; two files stating one fact with different values; a path, link,
import, or task-runner recipe that does not resolve; an entrypoint over its
budget; an unreachable knowledge file; an unfilled placeholder; an
undefined project term; and a sync rule stating one direction only.

#### Scenario: Recipe named but absent
- **WHEN** the entrypoint tells agents to run `just check` and the `justfile` defines no `check` recipe
- **THEN** the report contains a gap naming the entrypoint and the missing recipe with a `Fix:`

#### Scenario: Two files disagree
- **WHEN** the entrypoint says the test command is `just test` and a knowledge file says `npm test`
- **THEN** the report contains one gap naming both files and both values, whose `Fix:` asks the user which governs, and the agent does not pick a winner

#### Scenario: Entrypoint over budget
- **WHEN** the entrypoint has 134 lines and no intent line or project file states another budget
- **THEN** the report contains a gap against the 120-line ceiling

#### Scenario: Budget recorded in an intent line
- **WHEN** an intent line says "entrypoint budget: 200" and the entrypoint has 150 lines
- **THEN** no budget gap is raised

#### Scenario: Orphaned knowledge file
- **WHEN** a file in the knowledge directory is reachable from no entrypoint route and named by no project skill
- **THEN** the report contains an unreachable gap for it

### Requirement: Design sentences and the design document
For each intent line that quotes a `HARNESS.md` sentence the agent SHALL
report a gap when the file does not do what the sentence says, judging only
what the sentence states. It SHALL report a gap when an agent-facing file
routes ordinary tasks to `HARNESS.md`.

#### Scenario: File does not realise its sentence
- **WHEN** an intent line quotes `Gates: "a secret scan runs before every commit"` for a pre-commit configuration with no secret-scan hook
- **THEN** the report contains a gap naming the file, the section, and the sentence, with a `Fix:` that changes the file or has the design amended first

#### Scenario: Entrypoint sends every task to the design
- **WHEN** the entrypoint's always-on rules say "read HARNESS.md before any task"
- **THEN** the report contains a gap whose `Fix:` is to name the file only for checking or changing the harness

#### Scenario: Design named for harness changes only
- **WHEN** the entrypoint has one line naming `HARNESS.md` for harness checks and changes
- **THEN** no gap is raised for it

### Requirement: Report format and verdict
The report SHALL contain, in order: the refusal line when one applies,
per-file facts, notes, one gap line per distinct defect in the form
`<file>: <gap>. Fix: <action>`, and a last line `PASS` or `FAIL (<n>)`
where `<n>` is the number of gap lines. Notes SHALL NOT change the verdict.

#### Scenario: Clean harness
- **WHEN** no check raises a gap
- **THEN** the last line is `PASS`

#### Scenario: Same defect found by two checks
- **WHEN** a copied client-specific entrypoint is detected by both the budget and the conflicting-facts checks
- **THEN** the report holds one gap line for it and the count reflects one

#### Scenario: Intent line contradicts the file
- **WHEN** an intent line says a file is "the knowledge file for releases" and the file holds deployment credentials guidance only
- **THEN** the report describes what the file holds and raises the gap instead of repeating the intent
