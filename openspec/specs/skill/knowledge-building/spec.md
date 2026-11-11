# knowledge-building Specification

## Purpose

Governs what an agent that loaded `knowledge-building` observably does with the Knowledge layer of a target project's harness: the `AGENTS.md` entrypoint, the knowledge files agents read on demand, the folders that hold knowledge and project skills, and the routes between them. The skill works in four modes (design, extract, build, audit) around the Knowledge section of the project's `HARNESS.md`. It ships to Claude Code, Codex, and Antigravity. Non-goals: writing a project skill's own steps (handed to the skill that writes project skills), the entrypoint's sync rules (the Entropy layer), hooks, checks, and CI (the Gates layer), permission lists (the Authority layer), README, CONTRIBUTING, SECURITY, and other human documentation, and routing tasks to `HARNESS.md`.

## Requirements

### Requirement: Triggering
The skill SHALL load, from a description match, when a harness workflow hands over the Knowledge layer, or when a target project's agent entrypoint, knowledge files, or the routing between them is being designed, described, built, trimmed, or audited, and SHALL NOT load for writing a project skill's steps, for human documentation, or for checks, CI, and permissions.

#### Scenario: Oversized entrypoint
- **WHEN** the user says "our AGENTS.md is 400 lines and the agent ignores half of it; sort out what should stay in there"
- **THEN** the skill loads

#### Scenario: Workflow hands over the layer
- **WHEN** a harness build workflow hands over "build mode, Knowledge layer" with the project's Context, the Knowledge section, and the Invariants
- **THEN** the skill loads

#### Scenario: Where a rule belongs
- **WHEN** the user says "should our migration procedure live in the root agent instructions, a doc, or somewhere the agent loads only when needed?"
- **THEN** the skill loads

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

### Requirement: Modes bound what is written
The agent SHALL work in the mode the handover names, or the mode it infers from a direct request, and SHALL create, change, move, or remove files in the target project only in build mode and only as the approved section describes. Removing an existing agent-facing file SHALL additionally wait for the user's explicit go-ahead when the build reaches that step.

#### Scenario: Design mode
- **WHEN** a workflow hands over the Knowledge layer in design mode
- **THEN** the agent returns the section as prose with the defaults applied and no file in the project has changed

#### Scenario: Direct request without a covering section
- **WHEN** the user asks directly to split the entrypoint and `HARNESS.md` has no sentence covering the split
- **THEN** the agent drafts the section text naming each move, obtains one approval, records it in `HARNESS.md` when the project keeps that file, and only then writes files

#### Scenario: Deletion not named in the section
- **WHEN** build mode finds an unrouted agent doc the section does not mention
- **THEN** the agent leaves the file in place and reports it as a deviation

#### Scenario: Removal named in the section
- **WHEN** the section names the removal of an old `CLAUDE.md` and the build reaches that step
- **THEN** the agent moves its rules first, asks for the go-ahead for the removal, and leaves the file in place with the removal on the pending decisions list when no go-ahead is given

### Requirement: Design settles every decision with a default
In design mode the agent SHALL settle the entrypoint file, the `CLAUDE.md` decision, the harness shape and budget, the folders, and a carrier for every candidate piece of content, each with one default and its reason, asking in a single round only for what the repository cannot show, and SHALL present the complete section for one approval.

#### Scenario: Claude Code on a current version
- **WHEN** the project's clients include Claude Code at v2.1.277 or newer and no `CLAUDE.md` exists
- **THEN** the section states that no `CLAUDE.md` is created because Claude Code reads `AGENTS.md` by itself when none exists

#### Scenario: Existing CLAUDE.md with shared rules
- **WHEN** an existing `CLAUDE.md` holds rules that apply to every agent and nothing specific to Claude Code
- **THEN** the section moves each rule into `AGENTS.md` and names the removal of `CLAUDE.md`

#### Scenario: Older Claude Code must be supported
- **WHEN** the Context says some contributors run a Claude Code older than v2.1.277
- **THEN** the section keeps a `CLAUDE.md` whose whole content is the import of `AGENTS.md`

#### Scenario: Short-lived single-maintainer project
- **WHEN** the Context describes a prototype one person maintains for a few weeks
- **THEN** the section chooses a single-file harness with no knowledge folder and states the budget of about 200 lines

### Requirement: Only non-inferable content is carried
The agent SHALL give every candidate piece of content exactly one carrier (the always-applicable block, a routing row with a knowledge file, the code itself, a type or comment, a project skill, a script, or an outside-documentation route), SHALL leave out content an agent can read off the repository, and SHALL justify each file other than the entrypoint by when an agent realises it needs it, what it gains, what unrelated content it reads, and whether the jump is cheaper than inlining.

#### Scenario: Rule every task needs
- **WHEN** the candidates include "never commit secrets" and "read the schema notes before touching the ORM"
- **THEN** the first lands in the always-applicable block and the second as a routing row with a knowledge file

#### Scenario: Request to document the directory tree
- **WHEN** the user asks for a knowledge file listing every directory and task-runner recipe
- **THEN** the section declines the listing, points at the file system and the task runner, and says so under what is deliberately left undocumented

#### Scenario: One-off procedure
- **WHEN** a candidate is a procedure that ran once after a single incident
- **THEN** it is carried as a knowledge line or code comment, not a project skill, and the section states which condition of the skill bar it failed

#### Scenario: Invariants handed over
- **WHEN** the handover carries four Invariants
- **THEN** each appears as one line of the always-applicable block with its meaning unchanged

### Requirement: HARNESS.md is never task reading
The agent SHALL NOT route any task situation to `HARNESS.md`; the entrypoint MAY name it in one line as the design to open when the harness is checked or changed.

#### Scenario: Project keeps its HARNESS.md
- **WHEN** build mode runs in a project that keeps `HARNESS.md` as its anchor document
- **THEN** the entrypoint holds at most one line naming it and no routing row points to it

### Requirement: Extract describes what exists
In extract mode the agent SHALL describe the entrypoint, knowledge files, skills, and routes the project has today, classifying each artifact (current, invisible, duplicated, contradicting the code, stale, restating the code) with evidence, and SHALL NOT present a default as the project's practice.

#### Scenario: CLAUDE.md with its own rules
- **WHEN** the project has an `AGENTS.md` and a `CLAUDE.md` that states different commit rules
- **THEN** the extracted section reports both files, the contradiction, and that Claude Code sees only the `CLAUDE.md` rules

### Requirement: Build realises the section and verifies it
In build mode the agent SHALL write the entrypoint within its stated budget without dropping an always-applicable rule, SHALL give every knowledge file a first line naming the same situation as its routing row, SHALL add a routing row for every route other layers are owed, SHALL hand each project skill to the skill that writes project skills by role without writing its body, and SHALL record the result of each verification check.

#### Scenario: Budget exceeded by routable content
- **WHEN** the written entrypoint reaches 135 lines and twenty of them describe a one-situation procedure the section allows behind a row
- **THEN** the procedure moves behind its routing row and the entrypoint lands at or under 120 lines

#### Scenario: Budget exceeded by always rules
- **WHEN** the always-applicable rules alone exceed the budget
- **THEN** every rule is kept and the overrun is reported as a deviation

#### Scenario: Route owed by another layer
- **WHEN** the handover lists an environment knowledge file whose route is owed
- **THEN** the entrypoint gains a row with the situation worded as that layer gave it

#### Scenario: Entropy omitted
- **WHEN** the design has no Entropy section
- **THEN** the entrypoint has no sync section and no sync marker

#### Scenario: Read-back
- **WHEN** the skill was invoked directly and finishes a build
- **THEN** the hand back states that the files still await a read-back in a clean context and lists them, and the agent does not re-read them as a substitute

### Requirement: Audit reports drift and bloat
In audit mode the agent SHALL match every sentence of the section and every agent-facing file to evidence or a finding, each with severity, `path:line` evidence, the sentence of the section, and a recommendation to fix the artifact or amend the design, and SHALL change no file.

#### Scenario: Invisible knowledge file
- **WHEN** a file in the knowledge folder is reached by no routing row
- **THEN** the audit reports it with the file path as evidence and recommends routing, merging, or removing it through the design

#### Scenario: CLAUDE.md hides the entrypoint
- **WHEN** a `CLAUDE.md` exists without importing `AGENTS.md`
- **THEN** the audit reports a high-severity finding that Claude Code sees none of the entrypoint's rules

#### Scenario: Command that no longer exists
- **WHEN** the entrypoint names a recipe the task runner does not list
- **THEN** the audit reports the row with its line number and recommends fixing the artifact

### Requirement: Deposited files stand alone
Files the agent writes into the target project SHALL name only the project's own commands, paths, and skills, SHALL NOT name the plugin, its skills, or its agents, and the hand back SHALL describe other layers by role.

#### Scenario: Sync rules requested
- **WHEN** the section's content includes rules for keeping documents in step with code
- **THEN** the agent leaves the sync position for the Entropy layer and describes that layer without naming a skill

### Requirement: Outcomes
Given a target project and a handover, the agent SHALL leave a result a reader can judge without seeing the skill.

#### Scenario: Greenfield build for a two-client team
- **WHEN** build mode runs with a section describing a 100-line `AGENTS.md`, three knowledge files with their situations, a shared skills folder, no `CLAUDE.md`, and an Entropy section in the design, for a project used with Claude Code and Codex
- **THEN** the project gains an `AGENTS.md` at or under 120 lines with the Invariants in its always-applicable block, three routing rows each matching a knowledge file's first line, validation rows naming recipes that exist, a sync heading holding only its marker, `.agents/skills/` with `.claude/skills` linked to it, and no `CLAUDE.md`; the result fails if any fact the task runner or tree already states is copied into a document, a knowledge file is unrouted, or a row points to `HARNESS.md`

#### Scenario: Design for a bloated brownfield entrypoint
- **WHEN** design mode runs for a repository with a 380-line `CLAUDE.md`, no `AGENTS.md`, a directory listing and full command list inside it, two rules about secrets and commit format, and a release procedure with ordered steps
- **THEN** the returned section moves the two rules into the always-applicable block of a new `AGENTS.md`, drops the directory listing and command list as stated by the code, makes the release procedure a project skill candidate with the conditions it passed, names the removal or reduction of `CLAUDE.md` with its reason, and lists each move so one approval covers the design; the result fails if it asks decision by decision, keeps both files as rule-bearing copies, or writes any file
