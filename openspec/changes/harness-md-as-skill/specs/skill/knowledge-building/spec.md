# Spec Delta

## ADDED Requirements

### Requirement: A design document in the knowledge folder is one unit
In every mode the agent SHALL treat a type-marked `HARNESS.md` inside the knowledge folder as one unit that the entrypoint's line naming its `SKILL.md` reaches. It SHALL NOT hold a file inside it to a rule for knowledge files (a routing row, a first line naming a situation, no frontmatter, a load condition), SHALL NOT report such a file as invisible, and SHALL leave what is inside to the format's validator.

#### Scenario: Audit of a folder holding the anchor document
- **WHEN** audit mode runs and the knowledge folder holds the anchor document's directory with its `SKILL.md`, a second Markdown file, and a script, while the entrypoint names only the `SKILL.md`
- **THEN** no finding reports a file of that directory as invisible, unrouted, or carrying frontmatter

#### Scenario: Build beside the anchor document
- **WHEN** build mode writes routing rows for a knowledge folder that holds the anchor document's directory
- **THEN** no row points to the directory or to a file inside it, and no file inside it gains a first line or loses its frontmatter

#### Scenario: Second marked document in the folder
- **WHEN** audit mode finds a second type-marked directory in the knowledge folder while the entrypoint names another as the anchor document
- **THEN** the audit lists the second directory as a reference, reports the directory once, as one unit, as invisible because the entrypoint does not name its `SKILL.md`, reports no file inside it separately, and does not ask whether it is the project's design

## MODIFIED Requirements

### Requirement: HARNESS.md is never task reading
The agent SHALL NOT route any task situation to a `HARNESS.md`. Where the project adopted one as its anchor document, the entrypoint SHALL hold one line naming its `SKILL.md` as the design to open when the harness is checked or changed; where it has not, the agent SHALL add no mention of a design document to the entrypoint.

#### Scenario: Project keeps its HARNESS.md
- **WHEN** build mode runs in a project that keeps a `HARNESS.md` as its anchor document
- **THEN** the entrypoint holds at most one line naming its `SKILL.md` and no routing row points to the document's directory or to a file inside it

#### Scenario: Project without an anchor document
- **WHEN** build mode runs in a project that has no anchor document
- **THEN** the entrypoint the agent writes names no type-marked design document and the project still has no anchor document

#### Scenario: Marked document the handover does not name
- **WHEN** build mode finds a type-marked directory that the handover does not name as the anchor document
- **THEN** the agent adds no line and no routing row for it, leaves it in place, and treats the question of what it is as the catalog requirement "The anchor document" says

### Requirement: Audit reports drift and bloat
In audit mode the agent SHALL compare every agent-facing file with the anchor document's text for the layer when the project adopted one, and otherwise with what the project's conditions call for; SHALL give each finding a class (stale, duplicated, contradictory, invisible, missing, excessive), a severity (high, medium, low), `path:line` evidence, the source of truth, and a proposed disposition; and SHALL change no file.

#### Scenario: Invisible knowledge file
- **WHEN** a file in the knowledge folder, outside any type-marked design document, is reached by no routing row
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

### Requirement: Outcomes
Given a target project and a handover, the agent SHALL leave a result a reader can judge without seeing the skill.

#### Scenario: Greenfield build for a two-client team
- **WHEN** build mode runs with agreed decisions for a 100-line `AGENTS.md`, three knowledge files with their situations, a shared skills folder, no `CLAUDE.md`, the invariants assigned to the layer, and an Entropy layer that is not omitted, for a project used with Claude Code and Codex
- **THEN** the project gains an `AGENTS.md` at or under 120 lines with the invariants in its always-applicable block, three routing rows each matching a knowledge file's first line, validation rows naming recipes that exist, a sync heading holding only its marker, `.agents/skills/` with `.claude/skills` linked to it, and no `CLAUDE.md`; the result fails if any fact the task runner or tree already states is copied into a document, a knowledge file is unrouted, a row points to a design document, or a file the plan does not list was written

#### Scenario: Design for a bloated brownfield entrypoint
- **WHEN** decide mode runs for a repository with a 380-line `CLAUDE.md`, no `AGENTS.md`, a directory listing and full command list inside it, two rules about secrets and commit format, and a release procedure with ordered steps
- **THEN** the hand back recommends a thickness with its reasons and returns, each settled with its evidence or open with its options: the two rules moved into the always-applicable block of a new `AGENTS.md`, the directory listing and command list dropped as stated by the code, the release procedure as a project skill candidate with the conditions it passed, and the removal or reduction of `CLAUDE.md` with its reason, listing each move; the result fails if it asks the user anything itself, keeps both files as rule-bearing copies, leaves a decision neither settled nor open, or writes any file
