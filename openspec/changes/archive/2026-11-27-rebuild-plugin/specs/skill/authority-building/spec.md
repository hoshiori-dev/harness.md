# Spec Delta

## MODIFIED Requirements

### Requirement: Triggering
The skill SHALL load when a harness entry hands over the Authority layer
and when a user asks for a project's rules about what coding agents may do
without asking or about how agent work flows through its repository and
hosting platform. It SHALL NOT load for a one-off command question, for
sandbox or token design, for writing CI jobs, or for a single platform
operation.

#### Scenario: Workflow hands the layer over
- **WHEN** a harness entry hands over "build mode, Authority layer" with the project's conditions and the decisions agreed for the layer: action classes, permission lists, checkpoint rules, squash-only merging, tag-triggered releases
- **THEN** the skill loads

#### Scenario: Prompt fatigue
- **WHEN** the user says "Agents keep asking me to approve every shell command in this repo. Set up allow and deny lists so they only stop for things that matter."
- **THEN** the skill loads

#### Scenario: Rules after an incident
- **WHEN** the user says "An agent force-pushed over a teammate's branch yesterday. Write the project rules for what agents may do on their own so it does not happen again."
- **THEN** the skill loads

#### Scenario: Platform workflow for agents
- **WHEN** the user says "Set up this GitHub repo's labels, issue forms, branch rules, and the procedure agents follow from picking up an issue to getting it merged."
- **THEN** the skill loads

#### Scenario: Command question near miss
- **WHEN** the user says "What does git push --force-with-lease do differently from --force?"
- **THEN** the skill does not load

#### Scenario: Sandbox near miss
- **WHEN** the user says "Which token scopes and network egress should the agent container be allowed?"
- **THEN** the skill does not load

#### Scenario: CI job near miss
- **WHEN** the user says "Write a GitHub Actions job that runs our linter and tests on every pull request."
- **THEN** the skill does not load

#### Scenario: Single operation near miss
- **WHEN** the user says "Add the type:bug label to issue 42 and assign it to me."
- **THEN** the skill does not load

### Requirement: Outcomes
A decide handover SHALL end in a recommended thickness and Authority
decisions an entry can settle with the user without the skill,
and a build handover SHALL end in files and remote state that match the
agreed decisions, with every outward step taken only on the user's go-ahead
for that step.

#### Scenario: Design for a hosted solo project
- **WHEN** the skill is handed a decide task for a GitHub repository with a `justfile`, Conventional Commits in history, one maintainer who reviews between tasks, and Claude Code and Codex as clients
- **THEN** it returns, without writing a file and without asking the user anything, a recommended thickness with its reasons and decisions that cover the two action classes with the project's own commands as examples, the standing pre-authorisations, the refusal rule, the allow entries derived from the observed recipes one per recipe, the fixed deny list entry by entry, no ask entries, the checkpoint recipes by name, the commit convention, no AI attribution, GitHub Flow, squash-only merging, that the agent stops at a draft pull request and a human marks ready and merges, what protects the default branch, tag-triggered releases, the platform entities kept and those deliberately absent, and who owns remote settings, each with its reason and each either settled with the evidence that settles it or open with its options, the recommended one first

#### Scenario: Build from an approved section
- **WHEN** the skill is handed a build task with the agreed Authority decisions and the plan's files for that project
- **THEN** the project holds a policy file, a strict-JSON `.claude/settings.json` and Codex files with exactly the agreed entries, the four checkpoint recipes in the task runner, the entrypoint core with a route to the policy, the platform files, and a settings register; the recipes were exercised only in a temporary clone that no longer exists; no delivered file contains an unresolved placeholder or names the plugin; no file outside the plan's list was written; and each remote change was shown as a delta and applied only after the user approved that delta, or is listed as declined or pending with its exact command

#### Scenario: First grant in a project that left the rest to the agent
- **WHEN** a build task carries agreed allow entries for a project that has no permission file, and the user left the remaining decisions to the agent
- **THEN** the agent lists every command that would stop being asked about and writes the entries only after the user's go-ahead on that list

#### Scenario: Audit of a drifted project
- **WHEN** the skill is handed an audit task and the project's `.claude/settings.json` holds `Bash(just *)` in its allow list and an `ask` array while the project's adopted anchor document states one entry per recipe and no ask entries
- **THEN** it changes nothing and reports each disagreement as a finding with a class (stale, duplicated, contradictory, invisible, missing, or excessive), a severity of high, medium, or low, the file and line as evidence, the anchor document's sentence as the source of truth, and a proposed disposition: fix the artifact or amend the document

### Requirement: Permission lists carry no ask entries and no outward allow
The skill SHALL propose allow entries only for observed test, lint, build,
format, and read-only commands, one entry per task-runner recipe, SHALL
state the fixed deny list of unrecoverable actions, and SHALL write no ask
entry and no allow entry for a push, publication, release, tracker write,
or deletion unless the user kept it after one challenge, in which case the
choice is recorded as a decision with the user's reason.

#### Scenario: Force push requested in the allow list
- **WHEN** the user asks to add `git push --force` to the allow list so agents can fix their own branches
- **THEN** it is said once that a force push rewrites pushed history that the remote keeps and that pushed history is reverted, not rewritten, and the entry stays on the deny list unless the user repeats the request, in which case the decision is recorded with the user's reason

#### Scenario: Ask entry requested
- **WHEN** the user asks to put every tool of an MCP server under ask
- **THEN** the agent proposes allowing the server's read-only tools and classifying its outward tools by reversibility, and adds an ask entry only if the user states a reason no allow or deny entry can serve

#### Scenario: Runner wildcard in an existing file
- **WHEN** an existing permission file allows the whole task runner and one of its recipes pushes
- **THEN** the agent reports that the wildcard also allows the pushing recipe and proposes one entry per non-outward recipe

### Requirement: The platform half follows the hosting platform
The skill SHALL build platform files and propose remote changes only when
the project's conditions or the repository's remote name GitHub or GitLab,
and SHALL treat every remote change as a separate delta that is shown with
its current value and exact command, applied only after the user's go-ahead
for that delta, read back, and recorded in a settings register.

#### Scenario: No hosted remote
- **WHEN** the project has no remote, or a remote that is neither GitHub nor GitLab
- **THEN** the decisions returned say in one sentence that there is no hosted platform and cover only the policy half, and the build creates no labels, forms, templates, platform knowledge file, or settings register and proposes no remote change

#### Scenario: Design approved, remote untouched
- **WHEN** the user approved a plan whose agreed decisions include squash-only merging and the build reaches the merge-method setting
- **THEN** the agent shows the current merge methods and the exact command, and changes the setting only after the user approves that delta

#### Scenario: Probe cannot authenticate
- **WHEN** the platform CLI is missing or not logged in
- **THEN** the agent quotes the login or install command, installs nothing, continues from facts the user supplies, marks the settings register unverified, and lists every remote write as a pending human action with its exact command

#### Scenario: Protection the plan cannot enforce
- **WHEN** the repository is private on a plan that cannot enforce branch rules
- **THEN** the decision and the register record default-branch protection as a convention with a named owner and the condition that would make it enforceable, and the agent says so before proposing it

### Requirement: Invariants and neighbouring layers
The skill SHALL turn each agreed invariant about what an agent may do
into a sentence of the entrypoint's always-on rules and, where a command
pattern, a path, or a platform rule can express it, into that mechanism,
and SHALL hand back every such invariant that ended with no mechanical
enforcement.
It SHALL leave to their own layers the sandbox and token boundary, the CI
jobs and hooks, and the meaning of specification approval, describing each
by role and never naming another skill.

#### Scenario: Invariant with a mechanism
- **WHEN** the agreed decisions in the handover include the invariant "agents never push to the default branch"
- **THEN** the build writes the sentence into the entrypoint's always-on block, makes the push recipe refuse on the default branch, proposes default-branch protection as a remote delta, and reports which of the three are in force

#### Scenario: Entrypoint missing or at its budget
- **WHEN** a build deposits the policy file and the project has no entrypoint, or the entrypoint would exceed its budget with the additions
- **THEN** the agent writes no entrypoint line and hands back each routing row as a route owed, naming the situation and the file, and each always-on sentence as a rule owed

#### Scenario: Specification approval label
- **WHEN** the agreed decisions reserve the `spec:` label namespace and the project has a specification workflow
- **THEN** the build keeps one label file and its sync, leaves the insertion markers in the request template, the project skill, and the platform knowledge file unfilled, and hands back that the layer owning Completion fills them

#### Scenario: Stale Codex approval value
- **WHEN** an audited project's `.codex/config.toml` sets `approval_policy = "untrusted"`
- **THEN** the agent reports it as a finding, stating that Codex no longer accepts the value and that per-command prompting is written as prompt rules

## REMOVED Requirements

### Requirement: Mode discipline

**Reason**: The modes design and extract are replaced by decide and
describe, the handover no longer carries a section of a root `HARNESS.md`,
and a direct request no longer drafts a section for a single approval.

**Migration**: See "Only build mode writes",
"The handover is not asked again",
"Decide returns the layer's decisions", "Describe states what exists",
"Build realises the agreed decisions and nothing else",
and "Audit compares with the anchor document or the conditions".

## ADDED Requirements

### Requirement: Only build mode writes
The agent SHALL work in the mode the handover names (decide, describe,
build, audit), or the mode it infers from a direct request, and SHALL
create or change files in the target project only in build mode.
In the other modes the project SHALL be unchanged when the agent hands back.

#### Scenario: Decide mode
- **WHEN** an entry hands over the Authority layer in decide mode
- **THEN** the agent returns a recommended thickness and the layer's decisions, and no file in the project has changed

#### Scenario: Audit mode
- **WHEN** an entry asks for an audit of the layer
- **THEN** the agent returns findings only and no file in the project has changed

#### Scenario: Direct request
- **WHEN** a user whose project has no `HARNESS.md` asks the agent directly, with no entry running, to write allow and deny lists for the repository
- **THEN** the agent shows what it decided on the evidence, asks the open decisions through the client's question tool where there is one, writes the permission files only after the user accepted what was shown, and the project still has no `HARNESS.md`

#### Scenario: Direct request in a project with an anchor document
- **WHEN** the same direct request changes what the project's adopted anchor `HARNESS.md` says about permission lists
- **THEN** the accepted change is also written to that document in the same piece of work

### Requirement: The handover is not asked again
The agent SHALL take the goal and non-goals, the project's conditions,
the layer's thickness and agreed decisions, and the files the plan lists
for the layer from the handover, and SHALL NOT ask the user for anything
the handover, the repository, or the remote settles.

#### Scenario: Condition supplied
- **WHEN** the handover states that one maintainer reviews and merges between tasks
- **THEN** the agent does not ask who reviews and who merges

#### Scenario: Observable fact
- **WHEN** the repository's `origin` remote points at GitHub
- **THEN** the agent reads the platform from the remote and does not ask the user which platform hosts the project

### Requirement: Decide returns the layer's decisions
In decide mode the agent SHALL return a recommended thickness with its
reasons and each Authority decision, of the policy half and, for a hosted
project, of the platform half, either as settled, with the evidence that
settles it, or as open, with its options, the recommended one first,
its reason, and the decisions it depends on.
Handed over by an entry it SHALL ask the user nothing itself.

#### Scenario: Decision the history settles
- **WHEN** the last commits of the repository carry Conventional Commits titles and no attribution trailer
- **THEN** the hand back returns the commit convention as settled, with the history as its evidence, and asks nothing about it

#### Scenario: Decision the repository and the remote cannot show
- **WHEN** neither the handover, the repository, nor the remote shows who owns the remote settings
- **THEN** the hand back returns the owner as an open decision with its options, the recommended one first with its reason, and the agent has asked the user nothing

### Requirement: Describe states what exists
In describe mode the agent SHALL describe what the project does today
for the Authority layer as prose fit for a `HARNESS.md`,
SHALL mark inferred intent as inferred, and SHALL NOT replace an observed
practice with a recommendation.

#### Scenario: Practices that contradict the recommendations
- **WHEN** the skill is handed a describe task for a project whose permission file allows `git push` and whose history shows merge commits
- **THEN** the returned prose describes the allowed push and the merge commits as the project's practice, marks any intent it inferred as inferred, lists both as practices that contradict what the skill would recommend, and no file in the project has changed

### Requirement: Build realises the agreed decisions and nothing else
In build mode the agent SHALL write only the files the plan lists for the
layer, holding what the agreed decisions state; SHALL verify each written
artifact and report any check it could not run as not verified;
and SHALL report every departure a fact forced as a deviation for the
entry to put to the user.

#### Scenario: Plan only
- **WHEN** a build handover asks for the plan only
- **THEN** the agent returns the files it would create, change, or delete, each by path with one line on its shape, and writes nothing and proposes no remote change

#### Scenario: Agreed decision a fact contradicts
- **WHEN** the agreed decisions require one aggregating check on the default branch and no such job has run green there
- **THEN** the agent proposes no required-check delta, builds the rest, and reports the departure as a deviation for the entry to put to the user

### Requirement: Audit compares with the anchor document or the conditions
In audit mode the agent SHALL compare the project and its remote with the
anchor document's text for the layer when the project adopted one,
and otherwise with what the project's conditions call for;
SHALL give each finding a class, a severity, evidence, the source of truth,
and a proposed disposition; and SHALL change nothing.

#### Scenario: No anchor document
- **WHEN** the skill is handed an audit task for a project that has adopted no anchor document
- **THEN** it compares the project with what its conditions call for, marks each finding as having no recorded design to compare with, grades each as high, medium, or low, and changes nothing
