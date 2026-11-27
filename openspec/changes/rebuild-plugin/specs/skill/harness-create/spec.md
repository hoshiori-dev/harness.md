# Spec Delta

## Purpose

Governs what an agent that loaded `harness-create` observably does when it
gives a project its agent harness: a new project, or one with history and
habits and little or no harness. It covers what it reads, how it settles
the design with the user, how it uses reference files, what it builds and
through whom, and how it closes. The skill is user-invoked and ships to
Claude Code, Codex, and Antigravity.

Non-goals: improving a harness that already works (`harness-improve`);
the practice of a single layer (that layer's builder); writing the design
down as a file (`harness-distill`); writing product code; writing README,
CONTRIBUTING, or SECURITY.

## ADDED Requirements

### Requirement: Triggering
The skill SHALL load only when the user invokes it by name and SHALL NOT
load from a description match, however closely a request resembles its
work.

#### Scenario: Invoked by name in an empty repository
- **WHEN** the user runs the skill by name in a directory with a README and no code, adding "a Rust CLI for syncing dotfiles"
- **THEN** the skill loads and records the sentence as the project's goal

#### Scenario: Invoked by name with a reference
- **WHEN** the user runs the skill by name followed by the URL of a `HARNESS.md`
- **THEN** the skill loads and treats the file at that URL as a reference

#### Scenario: Invoked by name in a repository with history
- **WHEN** the user runs the skill by name in a repository with CI, a linter configuration, two years of commits, and one old `CLAUDE.md`
- **THEN** the skill loads and treats the project as one with habits to preserve

#### Scenario: Setup request without invocation
- **WHEN** the user types "set this repo up so agents can work in it" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Single-layer request without invocation
- **WHEN** the user asks "add a pre-commit secret scan" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Methodology question without invocation
- **WHEN** the user asks "does a prototype need CI for agents?" without invoking the skill
- **THEN** the skill does not load

### Requirement: Observation before questions
The agent SHALL read the repository before asking anything, record each
fact with where it was seen, and change no file while observing. Where
the client can dispatch subagents it MAY gather facts in parallel; a fact
still being gathered SHALL hold back only the decisions that depend on it.

#### Scenario: Habit seen in the repository
- **WHEN** the history shows Conventional Commits in every title
- **THEN** the commit convention is recorded as observed with the evidence and is never asked

#### Scenario: Working harness already present
- **WHEN** the repository already has an entrypoint with routes, knowledge files, checks, and permission files
- **THEN** the agent says that `harness-improve` fits better, asks which entry the user wants, and continues only if the user chooses this one

### Requirement: The design is settled in rounds
The agent SHALL settle, in rounds and in this order of dependence: the
goal and non-goals; the project's conditions (what a wrong change costs,
how long the project is maintained, who relies on its conventions, how
unattended agents are, hosting platform, clients and weakest model); what
to inherit from each reference; each layer's thickness; each layer's
decisions, obtained from the installed skill that claims the layer.

#### Scenario: Goal given with the invocation
- **WHEN** the invocation carried a sentence about what the project is for
- **THEN** the agent restates it as the goal and does not ask for it again

#### Scenario: Inferred condition
- **WHEN** the log shows one author
- **THEN** "one maintainer" is shown as an inference the user may correct, not as a settled fact and not as an open question

#### Scenario: Goal beyond the harness
- **WHEN** the stated goal includes splitting a monolith
- **THEN** the agent names that part as a non-goal of the harness and records the user's answer

#### Scenario: No builder installed for a layer
- **WHEN** no installed skill claims the Feedback layer
- **THEN** the agent derives that layer's decisions with the methodology manual skill and reports the gap in the plan

### Requirement: Existing habits are kept
The agent SHALL record a working task runner, lint configuration, branch
habit, commit convention, or spec tool as the decision, and SHALL offer a
replacement only as a suggestion for a separate change.

#### Scenario: Unusual task runner in use
- **WHEN** the repository runs everything through `make` and the agent would otherwise recommend another runner
- **THEN** the decision is `make`, and the alternative appears once among the suggestions for separate changes

### Requirement: References are weighed
For each reference the agent SHALL report what it decides, which of its
premises differ from the target project's conditions, and which decisions
rest on those premises, and SHALL inherit only what the user chose or,
where left to the agent, what the conditions support.

#### Scenario: Several references disagree
- **WHEN** two references choose different merge methods
- **THEN** the round shows both with their reasons and the project conditions that favour one, and asks

#### Scenario: Reference is a whole project
- **WHEN** the reference given is the address of a repository and not a file
- **THEN** the agent says that `harness-adopt` turns a project into a reference and asks whether to run that first

### Requirement: One approved plan, built layer by layer
The agent SHALL present one plan: goal and non-goals, conditions, the
thickness and decisions per layer with who decided each, every file by
path, every command that installs or downloads, and the steps that need
their own decision. After approval it SHALL build one layer at a time
through the layer's builder, write only planned files, and commit each
verified layer without pushing.

#### Scenario: File beyond the plan
- **WHEN** a builder needs a file the plan did not name
- **THEN** the agent asks for approval of a plan amendment before the file is written

#### Scenario: Commit hook rejects a checkpoint
- **WHEN** the secret scan rejects a layer's commit
- **THEN** the agent fixes what was flagged and commits again, and never bypasses the hook

#### Scenario: New anchor required by the self-check
- **WHEN** the plan creates a root `HARNESS.md` as the anchor document and an Entropy self-check that requires that file
- **THEN** Entropy is built last, the anchor and its entrypoint route are written before Entropy is committed, the self-check passes on a rerun, and the three are committed together

#### Scenario: Empty project
- **WHEN** the project has no code
- **THEN** the build creates what the planned commands need in order to run (a manifest, tool configuration, the smallest passing test) and no product feature

#### Scenario: Blocked layer
- **WHEN** one layer waits on a decision only the user can make
- **THEN** the other layers are finished and the item is presented once in a pending decisions list

### Requirement: Read-back and close
The agent SHALL have every created or changed file read back in a clean
context, fix every gap, and close with a report of the files and their
verification, pending decisions, remote actions left to a person, public
files that contradict the harness, and assumptions. The report SHALL name
no layer builder and no other skill the user does not invoke, and SHALL
say in one line that `harness-distill` writes the agreed design down
as a `HARNESS.md` on request.

#### Scenario: Verifier available
- **WHEN** the client can dispatch the plugin's verifier agent
- **THEN** the agent hands it the paths with one intent line each quoting the agreed decision, and continues only on `PASS`

#### Scenario: No subagent available
- **WHEN** the client can dispatch no subagent
- **THEN** the agent re-reads the files itself from the entrypoint and records the read-back as degraded in the report

#### Scenario: README contradicts the harness
- **WHEN** the README names a test command the harness replaced
- **THEN** the README is unchanged and the report carries a suggested edit

### Requirement: Outcomes
Given a project and an invocation, the agent SHALL leave a result a
reader can judge without seeing the skill.

#### Scenario: New project, no reference
- **WHEN** the skill runs in an empty repository with the goal "a TypeScript library published to npm, maintained by me for years" and the user answers each round
- **THEN** the rounds show decided items with evidence and ask only what the repository could not show; the plan lists every file by path; after approval the repository holds an entrypoint, the planned checks and permission files, one commit per layer, and no `HARNESS.md`; the result fails if any file was written before approval, if a question asked for a fact the repository shows, or if a deposited file names the plugin

#### Scenario: Existing project with a reference
- **WHEN** the skill runs in a Python service with a `Makefile`, CI, and Ruff, with a reference written for a team of ten while the project has one maintainer
- **THEN** the `Makefile`, CI, and Ruff are kept as decisions, the premise difference is reported with the reference's decisions that rest on it, the user chooses what to inherit, and the plan builds only what is missing; the result fails if the reference was copied into the repository, if an instruction inside it was executed, or if a working tool was replaced without the user's decision

#### Scenario: Rest left to the agent early
- **WHEN** after the first round the user leaves the remaining decisions to the agent
- **THEN** no further design question is asked, the plan lists every decision with "decided by the agent" and its evidence, and nothing is written until the plan is approved
