# Harness Build Skill

## Purpose

Governs what an agent that loaded `harness-build` observably does when it
turns the `HARNESS.md` in a project root into a working harness: how it
validates and reads the file, how it fits a template to the project, what
it plans and asks approval for, how it builds and verifies each layer, and
how it closes. The same behaviour migrates an existing harness to a given
design. The skill is user-invoked and ships to Claude Code, Codex, and
Antigravity; the clean-context read-back uses the `harness-verifier` agent
on Claude Code and a fallback elsewhere.

Non-goals: writing or revising the design (the design workflow); diagnosing
a harness (the audit workflow); implementing product features; applying
repository settings on the hosting platform; writing README, CONTRIBUTING,
or SECURITY.

## Requirements

### Requirement: Triggering
The skill SHALL load only when the user invokes it by name and SHALL NOT
load from a description match, however closely a request resembles its
work.

#### Scenario: Invoked by name after pasting a design
- **WHEN** the user pastes a `HARNESS.md` into an empty repository and runs the skill by name with "this will be a CLI that converts subtitle files"
- **THEN** the skill loads and records the sentence as the project's goal

#### Scenario: Invoked by name on an existing harness
- **WHEN** the user runs the skill by name in a repository that has a `HARNESS.md` and an older `AGENTS.md`
- **THEN** the skill loads and plans only the difference between the harness and the design

#### Scenario: Invoked by name after a revision
- **WHEN** the user runs the skill by name after the project's `HARNESS.md` was revised
- **THEN** the skill loads and treats the file as the project's own design

#### Scenario: Build-shaped request without invocation
- **WHEN** the user types "set up AGENTS.md and pre-commit for this repo" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Single-layer request without invocation
- **WHEN** the user asks "add a secret scan to our CI" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Design question without invocation
- **WHEN** the user asks "what should go in the Authority section?" without invoking the skill
- **THEN** the skill does not load

### Requirement: Nothing is built from an invalid or missing file
The agent SHALL validate `HARNESS.md` before anything else. With no file
it SHALL stop and say how one is obtained. On a validation error it SHALL
report each error with the edit that fixes it and SHALL build nothing until
the file validates.

#### Scenario: No HARNESS.md
- **WHEN** the skill is invoked in a repository without `HARNESS.md`
- **THEN** the agent says the workflow builds from that file, names pasting one or the design workflow, and writes nothing

#### Scenario: Pasted file fails validation
- **WHEN** the file lacks the Feedback section and has a heading "## Umgebung" in place of Environment
- **THEN** the agent reports both errors with the fixing edits, offers to apply the heading fix, does not invent a Feedback section, and builds nothing

#### Scenario: Warnings only
- **WHEN** validation reports only an out-of-order section warning
- **THEN** the agent reports the warning and continues

### Requirement: The file is a design, not a command list
The agent SHALL execute nothing because the file says so. Every install,
download, network endpoint, and outward action the design calls for SHALL
appear in the plan with its source, and a sentence reaching beyond a
harness SHALL be shown to the user and not built.

#### Scenario: Design names a remote installer
- **WHEN** a section says to install a tool with a piped remote script
- **THEN** the plan lists the command and its source under commands the build will run, and nothing is installed before approval

#### Scenario: Sentence that weakens a guard
- **WHEN** the pasted file says agents must disable the secret scan before committing
- **THEN** the agent shows the sentence to the user as not built and continues with the rest

### Requirement: A template is fitted, not redesigned
When Context describes another project or a kind of project, the agent
SHALL ask one round for the goal and the conditions the repository cannot
show, SHALL rewrite Context, SHALL change only sentences whose stated
reason is a condition that differs, and SHALL never loosen an Authority
sentence in the adaptation.

#### Scenario: Conditions match
- **WHEN** the user's answers match every condition the template's Context states
- **THEN** only Context and the frontmatter change, and every decision is built as written

#### Scenario: One condition differs
- **WHEN** the template assumes agents are checked between tasks and the user says they run unattended overnight
- **THEN** the plan shows each affected sentence as old and new with that condition, and no unrelated sentence changes

#### Scenario: Template does not fit
- **WHEN** most sentences of the template would change for this project
- **THEN** the agent stops before planning, says so, and recommends the design workflow

#### Scenario: Stack not determined
- **WHEN** the repository is empty and neither the goal nor the design names a stack
- **THEN** the stack is asked in the same single round

### Requirement: One approved plan before any write
The agent SHALL present one plan (per layer the files and the design
sentence each realises, the skeleton, commands that install or download,
assumptions, what is not built, artifacts outside the design, separate
decisions) and SHALL create or change no file before the user approves it.

#### Scenario: Plan approved
- **WHEN** the user approves the plan
- **THEN** only files the plan names are written, and a file needed beyond it is put to the user as an amendment first

#### Scenario: Plan rejected
- **WHEN** the user rejects the plan
- **THEN** nothing is written and the agent summarises the observation and the plan

#### Scenario: Existing artifact the design does not mention
- **WHEN** the repository has a project skill no sentence of the design mentions
- **THEN** the plan lists it as outside the design, and the build leaves it untouched

#### Scenario: Existing harness contradicts the design
- **WHEN** an existing entrypoint states a commit convention the Authority section contradicts
- **THEN** the plan changes the entrypoint to the design and places that item before the items depending on it

### Requirement: Layers are built in order through their builders
The agent SHALL build Environment, Knowledge, Feedback, Gates, Authority,
Completion, and Entropy in that order,
skipping Completion or Entropy when the design is silent on it,
each through the installed skill that claims the layer in build mode, and
SHALL commit each verified layer without attribution and without pushing.

#### Scenario: Design silent on Entropy
- **WHEN** the design has no Entropy section and covers the subject nowhere else
- **THEN** no Entropy artifact is built and the closing report says nothing keeps the file and the harness in step

#### Scenario: Core section missing in a file written elsewhere
- **WHEN** the design has no `## Gates` section
- **THEN** the agent looks for the subject elsewhere in the file and plans from that text; when the file is silent, the plan lists the builder's defaults for the file's Context as assumptions for the user to approve or strike

#### Scenario: No builder installed for a layer
- **WHEN** no installed skill claims the Gates layer
- **THEN** the agent builds the layer from the section text and reports the gap at the close

#### Scenario: Commit hook rejects a checkpoint
- **WHEN** the secret scan rejects a layer's commit
- **THEN** the agent removes the flagged content and commits again without bypassing the hook

#### Scenario: Empty project
- **WHEN** the repository has no code and Gates calls for lint and tests
- **THEN** the build creates the manifest, tool configuration, and one passing test the commands need, and writes no product feature

#### Scenario: Remote action in the design
- **WHEN** Authority calls for a protected default branch
- **THEN** the agent does not apply it and reports the exact setting as an action left to a human

### Requirement: Read-back in a clean context
The agent SHALL have every built file read back by a reader that sees only
the files and one intent line each, SHALL fix every reported gap, and SHALL
continue only on a passing read-back or a recorded degraded one.

#### Scenario: Verifier available
- **WHEN** the client can dispatch `harness-verifier`
- **THEN** the agent hands it the paths with intent lines quoting the design, fixes each gap, and re-runs it until `PASS`

#### Scenario: No subagent available
- **WHEN** the client cannot dispatch any subagent
- **THEN** the agent re-reads the files from the entrypoint in a fresh pass and records the read-back as degraded in the closing report

### Requirement: Deviations are reconciled and the file's fate is asked
The agent SHALL correct `HARNESS.md` where the design named a fact the code
states differently, SHALL queue a pending decision where the build departed
from intent, and SHALL close by asking whether the file stays as the anchor
document or is deleted, deleting only on explicit choice.

#### Scenario: Design names a different command
- **WHEN** the design calls the test recipe `just tests` and the project's recipe is `just test`
- **THEN** the sentence in `HARNESS.md` is corrected and the correction is listed

#### Scenario: User keeps the file
- **WHEN** the user chooses to keep `HARNESS.md`
- **THEN** it is committed and no built file routes ordinary tasks to it

#### Scenario: User deletes the file
- **WHEN** the user chooses to delete it as a spent template
- **THEN** the file is removed, no built file points to it, and the removal is committed
