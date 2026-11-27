# Spec Delta

## MODIFIED Requirements

### Requirement: Triggering
The skill SHALL load, from a description match, when a harness entry hands over the Knowledge layer, or when a target project's agent entrypoint, knowledge files, or the routing between them is being decided, described, built, trimmed, or audited, and SHALL NOT load for writing a project skill's steps, for human documentation, or for checks, CI, and permissions.

#### Scenario: Oversized entrypoint
- **WHEN** the user says "our AGENTS.md is 400 lines and the agent ignores half of it; sort out what should stay in there"
- **THEN** the skill loads

#### Scenario: Workflow hands over the layer
- **WHEN** a harness entry hands over "build mode, Knowledge layer" with the project's conditions and the decisions agreed for the layer, the invariants assigned to it among them
- **THEN** the skill loads

#### Scenario: Where a rule belongs
- **WHEN** the user says "should our migration procedure live in the root agent instructions, a doc, or somewhere the agent loads only when needed?"
- **THEN** the skill does not load (the methodology manual answers a placement question; this skill loads when the files are to be changed)

#### Scenario: Orphaned agent docs
- **WHEN** the user says "we have a docs/agents folder nobody links to; do the agents even see those files?"
- **THEN** the skill loads

#### Scenario: Skill body request
- **WHEN** the user says "write the steps of our release skill so the agent stops skipping the changelog"
- **THEN** the skill does not load

#### Scenario: Human documentation
- **WHEN** the user says "rewrite the README so new contributors can get started faster"
- **THEN** the skill does not load

#### Scenario: Gate request
- **WHEN** the user says "add a pre-commit hook that blocks commits with failing lint"
- **THEN** the skill does not load

### Requirement: Only non-inferable content is carried
The agent SHALL give every candidate piece of content exactly one carrier (the always-applicable block, a routing row with a knowledge file, the code itself, a type or comment, a project skill, a script, or an outside-documentation route), SHALL leave out content an agent can read off the repository, and SHALL justify each file other than the entrypoint by when an agent realises it needs it, what it gains, what unrelated content it reads, and whether the jump is cheaper than inlining.

#### Scenario: Rule every task needs
- **WHEN** the candidates include "never commit secrets" and "read the schema notes before touching the ORM"
- **THEN** the first lands in the always-applicable block and the second as a routing row with a knowledge file

#### Scenario: Request to document the directory tree
- **WHEN** the user asks for a knowledge file listing every directory and task-runner recipe
- **THEN** the agent declines the listing, points at the file system and the task runner, and names the listing among what is deliberately left undocumented

#### Scenario: One-off procedure
- **WHEN** a candidate is a procedure that ran once after a single incident
- **THEN** it is carried as a knowledge line or code comment, not a project skill, and the decision states which condition of the skill bar it failed

#### Scenario: Invariants handed over
- **WHEN** the agreed decisions in the handover assign four invariants to the layer
- **THEN** each appears as one line of the always-applicable block with its meaning unchanged

### Requirement: HARNESS.md is never task reading
The agent SHALL NOT route any task situation to `HARNESS.md`. Where the project adopted a `HARNESS.md` as its anchor document, the entrypoint SHALL hold one line naming it as the design to open when the harness is checked or changed; where it has not, the agent SHALL add no mention of the file to the entrypoint.

#### Scenario: Project keeps its HARNESS.md
- **WHEN** build mode runs in a project that keeps `HARNESS.md` as its anchor document
- **THEN** the entrypoint holds at most one line naming it and no routing row points to it

#### Scenario: Project without an anchor document
- **WHEN** build mode runs in a project that has no `HARNESS.md`
- **THEN** the entrypoint the agent writes does not mention `HARNESS.md` and the project still has none

### Requirement: Audit reports drift and bloat
In audit mode the agent SHALL compare every agent-facing file with the anchor document's text for the layer when the project adopted one, and otherwise with what the project's conditions call for; SHALL give each finding a class (stale, duplicated, contradictory, invisible, missing, excessive), a severity (high, medium, low), `path:line` evidence, the source of truth, and a proposed disposition; and SHALL change no file.

#### Scenario: Invisible knowledge file
- **WHEN** a file in the knowledge folder is reached by no routing row
- **THEN** the audit reports it as invisible with the file path as evidence and proposes routing, merging, or removing it as a decision for the user

#### Scenario: CLAUDE.md hides the entrypoint
- **WHEN** a `CLAUDE.md` exists without importing `AGENTS.md`
- **THEN** the audit reports a high-severity finding that Claude Code sees none of the entrypoint's rules

#### Scenario: Command that no longer exists
- **WHEN** the entrypoint names a recipe the task runner does not list
- **THEN** the audit reports the row as stale with its line number, names the task runner as the source of truth, and proposes fixing the artifact

#### Scenario: Project without an adopted anchor document
- **WHEN** the handover asks for an audit of a project that has adopted no anchor document
- **THEN** the agent compares the agent-facing files with what the project's conditions call for and marks each finding as having no recorded design to compare with

### Requirement: Deposited files stand alone
Files the agent writes into the target project SHALL name only the project's own commands, paths, and skills, SHALL NOT name the plugin, its skills, or its agents, and the hand back SHALL describe other layers by role.

#### Scenario: Sync rules requested
- **WHEN** the agreed decisions for the layer include rules for keeping documents in step with code
- **THEN** the agent leaves the sync position for the Entropy layer and describes that layer without naming a skill

### Requirement: Outcomes
Given a target project and a handover, the agent SHALL leave a result a reader can judge without seeing the skill.

#### Scenario: Greenfield build for a two-client team
- **WHEN** build mode runs with agreed decisions for a 100-line `AGENTS.md`, three knowledge files with their situations, a shared skills folder, no `CLAUDE.md`, the invariants assigned to the layer, and an Entropy layer that is not omitted, for a project used with Claude Code and Codex
- **THEN** the project gains an `AGENTS.md` at or under 120 lines with the invariants in its always-applicable block, three routing rows each matching a knowledge file's first line, validation rows naming recipes that exist, a sync heading holding only its marker, `.agents/skills/` with `.claude/skills` linked to it, and no `CLAUDE.md`; the result fails if any fact the task runner or tree already states is copied into a document, a knowledge file is unrouted, a row points to `HARNESS.md`, or a file the plan does not list was written

#### Scenario: Design for a bloated brownfield entrypoint
- **WHEN** decide mode runs for a repository with a 380-line `CLAUDE.md`, no `AGENTS.md`, a directory listing and full command list inside it, two rules about secrets and commit format, and a release procedure with ordered steps
- **THEN** the hand back recommends a thickness with its reasons and returns, each settled with its evidence or open with its options: the two rules moved into the always-applicable block of a new `AGENTS.md`, the directory listing and command list dropped as stated by the code, the release procedure as a project skill candidate with the conditions it passed, and the removal or reduction of `CLAUDE.md` with its reason, listing each move; the result fails if it asks the user anything itself, keeps both files as rule-bearing copies, leaves a decision neither settled nor open, or writes any file

## REMOVED Requirements

### Requirement: Modes bound what is written

**Reason**: The mode design is replaced by decide, files follow the agreed decisions instead of an approved section, and a direct request no longer records anything in a root `HARNESS.md` the project has not adopted.

**Migration**: See "Only build mode writes".

### Requirement: Design settles every decision with a default

**Reason**: The builder no longer drafts a complete section behind one approval; it returns decisions for the entry to settle with the user in rounds.

**Migration**: See "Decide returns the layer's decisions".

### Requirement: Extract describes what exists

**Reason**: The mode is renamed.

**Migration**: See "Describe states what exists".

### Requirement: Build realises the section and verifies it

**Reason**: Build works from the decisions agreed in the plan, not from a section of a root `HARNESS.md`.

**Migration**: See "Build realises the agreed decisions and verifies them".

## ADDED Requirements

### Requirement: Only build mode writes
The agent SHALL work in the mode the handover names (decide, describe, build, audit), or the mode it infers from a direct request, and SHALL create, change, move, or remove files in the target project only in build mode and only as the agreed decisions and the plan's files for the layer say. Removing an existing agent-facing file SHALL additionally wait for the user's explicit go-ahead when the build reaches that step.

#### Scenario: Decide mode
- **WHEN** an entry hands over the Knowledge layer in decide mode
- **THEN** the agent returns a recommended thickness and the layer's decisions, and no file in the project has changed

#### Scenario: Direct request
- **WHEN** the user asks directly to split the entrypoint, with no entry running
- **THEN** the agent shows what it decided on the evidence, naming each move, asks the open decisions through the client's question tool where there is one, and writes files only after the user accepted what was shown

#### Scenario: Direct request in a project with an anchor document
- **WHEN** the same direct request changes what the project's adopted anchor `HARNESS.md` says about the entrypoint and its knowledge files
- **THEN** the accepted change is also written to that document in the same piece of work

#### Scenario: Direct request in a project without an anchor document
- **WHEN** the same direct request runs in a project that has no `HARNESS.md`
- **THEN** the accepted change is realised in the project's files only and no `HARNESS.md` is created

#### Scenario: Deletion nobody agreed
- **WHEN** build mode finds an unrouted agent doc that neither the agreed decisions nor the plan mention
- **THEN** the agent leaves the file in place and reports it as a deviation

#### Scenario: Agreed removal
- **WHEN** the agreed decisions name the removal of an old `CLAUDE.md` and the build reaches that step
- **THEN** the agent moves its rules first, asks for the go-ahead for the removal, and leaves the file in place with the removal on the pending decisions list when no go-ahead is given

### Requirement: Decide returns the layer's decisions
In decide mode the agent SHALL return a recommended thickness with its reasons and each Knowledge decision (the entrypoint file, the `CLAUDE.md` decision, the harness shape and budget, the folders, and a carrier for every candidate piece of content) either as settled, with the evidence that settles it, or as open, with its options, the recommended one first, its reason, and the decisions it depends on. Handed over by an entry it SHALL ask the user nothing itself.

#### Scenario: Project without a CLAUDE.md
- **WHEN** the project's clients include Claude Code and no `CLAUDE.md` exists
- **THEN** the hand back settles that no `CLAUDE.md` is created, with the evidence that Claude Code reads `AGENTS.md` by itself when none exists

#### Scenario: Existing CLAUDE.md with shared rules
- **WHEN** an existing `CLAUDE.md` holds rules that apply to every agent and nothing specific to Claude Code
- **THEN** the hand back recommends moving each rule into `AGENTS.md` and names the removal of `CLAUDE.md`

#### Scenario: Short-lived single-maintainer project
- **WHEN** the conditions describe a prototype one person maintains for a few weeks
- **THEN** the hand back recommends a single-file harness with no knowledge folder, states the budget of about 200 lines, and gives the project's short life among the reasons for the thickness it recommends

#### Scenario: Fact the repository cannot show
- **WHEN** nothing in the repository or the handover shows which clients the contributors run
- **THEN** the folders decision that depends on it is returned as open with its options, the recommended one first, and the agent does not ask the user itself

### Requirement: Describe states what exists
In describe mode the agent SHALL describe the entrypoint, knowledge files, skills, and routes the project has today as prose fit for a `HARNESS.md`, classifying each artifact (current, invisible, duplicated, contradicting the code, stale, restating the code) with evidence, SHALL mark inferred intent as inferred, and SHALL NOT present a recommendation as the project's practice.

#### Scenario: CLAUDE.md with its own rules
- **WHEN** the project has an `AGENTS.md` and a `CLAUDE.md` that states different commit rules
- **THEN** the description reports both files, the contradiction, and that Claude Code sees only the `CLAUDE.md` rules

### Requirement: Build realises the agreed decisions and verifies them
In build mode the agent SHALL write the entrypoint within its agreed budget without dropping an always-applicable rule, SHALL give every knowledge file a first line naming the same situation as its routing row, SHALL add a routing row for every route other layers are owed, SHALL hand each project skill to the skill that writes project skills by role without writing its body, SHALL record each verification result, and SHALL report each forced departure as a deviation for the user to decide.

#### Scenario: Budget exceeded by routable content
- **WHEN** the written entrypoint reaches 135 lines and twenty of them describe a one-situation procedure the agreed decisions allow behind a row
- **THEN** the procedure moves behind its routing row and the entrypoint lands at or under 120 lines

#### Scenario: Budget exceeded by always rules
- **WHEN** the always-applicable rules alone exceed the budget
- **THEN** every rule is kept and the overrun is reported as a deviation

#### Scenario: Route owed by another layer
- **WHEN** the handover lists an environment knowledge file whose route is owed
- **THEN** the entrypoint gains a row with the situation worded as that layer gave it

#### Scenario: Entropy omitted
- **WHEN** the handover says the Entropy layer's thickness is omitted
- **THEN** the entrypoint has no sync section and no sync marker

#### Scenario: Read-back
- **WHEN** the skill was invoked directly and finishes a build
- **THEN** the hand back states that the files still await a read-back in a clean context and lists them, and the agent does not re-read them as a substitute

#### Scenario: Plan only
- **WHEN** a build handover asks for the plan only
- **THEN** the agent returns the files it would create, change, move, or delete, each by path with one line on its shape, and writes nothing
