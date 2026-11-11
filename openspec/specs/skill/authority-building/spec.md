# Authority Building Skill

## Purpose

Governs what an agent that loaded `authority-building` observably does for
the Authority layer of a project's harness: what agents may do alone, what
waits for a human, and how work is committed, branched, merged, and
released. The skill works from the Authority section of the project's
`HARNESS.md` in four modes (design, extract, build, audit) and covers two
halves: the policy half (action classes, permission lists, refusals,
checkpoints, commits) for every project, and the platform half (branching,
merge method, releases, labels, forms, request templates, remote settings)
only for a project hosted on GitHub or GitLab. It ships to Claude Code,
Codex, and Antigravity; it generates permission files for Claude Code and
Codex only, and hands other clients' entries back for a human to enter.

Non-goals: which tools exist, what they can reach, sandbox mode, network
access, and token scope (the Environment layer); CI jobs, hooks, and secret
scanning (the Gates layer); what a recorded specification approval means
and the per-task pre-authorisations a specification carries (the Completion
layer); the entrypoint's budget (the Knowledge layer); answering a one-off
git or platform question; operating a single issue, request, label, or
release.

## Requirements

### Requirement: Triggering
The skill SHALL load when a harness workflow hands over the Authority layer
and when a user asks for a project's rules about what coding agents may do
without asking or about how agent work flows through its repository and
hosting platform. It SHALL NOT load for a one-off command question, for
sandbox or token design, for writing CI jobs, or for a single platform
operation.

#### Scenario: Workflow hands the layer over
- **WHEN** a harness build hands over "build the Authority section: action classes, permission lists, checkpoint rules, squash-only merging, tag-triggered releases"
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
A design handover SHALL end in an Authority section a reader without the
plugin can build from, and a build handover SHALL end in files and remote
state that match the section, with every outward step taken only on the
user's go-ahead for that step.

#### Scenario: Design for a hosted solo project
- **WHEN** the skill is handed a design task for a GitHub repository with a `justfile`, Conventional Commits in history, one maintainer who reviews between tasks, and Claude Code and Codex as clients
- **THEN** it returns, without writing a file, section prose that states the two action classes with the project's own commands as examples, the standing pre-authorisations, the refusal rule, the allow entries derived from the observed recipes one per recipe, the fixed deny list entry by entry, no ask entries, the checkpoint recipes by name, the commit convention, no AI attribution, GitHub Flow, squash-only merging, that the agent stops at a draft pull request and a human marks ready and merges, what protects the default branch, tag-triggered releases, the platform entities kept and those deliberately absent, and who owns remote settings, each with its reason, together with the list of defaults applied and any question no default could answer

#### Scenario: Build from an approved section
- **WHEN** the skill is handed a build task with an approved Authority section for that project
- **THEN** the project holds a policy file, a strict-JSON `.claude/settings.json` and Codex files with exactly the section's entries, the four checkpoint recipes in the task runner, the entrypoint core with a route to the policy, the platform files, and a settings register; the recipes were exercised only in a temporary clone that no longer exists; no delivered file contains an unresolved placeholder or names the plugin; and each remote change was shown as a delta and applied only after the user approved that delta, or is listed as declined or pending with its exact command

#### Scenario: Audit of a drifted project
- **WHEN** the skill is handed an audit task and the project's `.claude/settings.json` holds `Bash(just *)` in its allow list and an `ask` array while the section states one entry per recipe and no ask entries
- **THEN** it changes nothing and reports each disagreement as a finding with a severity of high, medium, or low, the file and line as evidence, the sentence of the section, and whether to fix the artifact or amend the design

### Requirement: Mode discipline
The skill SHALL write no file in design, extract, and audit modes, SHALL
take from the handover the Context, the section, and the assigned parts of
Invariants, Style, and File Structure without asking for them again, and
SHALL ask the user in a single round only for what the repository and the
remote cannot show.

#### Scenario: Extract keeps what exists
- **WHEN** the skill is handed an extract task for a project whose permission file allows `git push` and whose history shows merge commits
- **THEN** the returned section describes the allowed push and the merge commits as the project's practice, marks any intent it inferred as inferred, lists both as practices that contradict the defaults, and no file in the project has changed

#### Scenario: Direct request with no section
- **WHEN** a user without a `HARNESS.md` asks the agent to write allow and deny lists for the repository
- **THEN** the agent drafts the Authority section for the project first, presents it for one approval, and writes the permission files only after that approval

#### Scenario: Audit with no section
- **WHEN** the skill is handed an audit task for a project that has no Authority section
- **THEN** it compares the project with the defaults it would apply for the project's Context, marks each finding "no design to compare with", grades each as high, medium, or low, and changes nothing

### Requirement: Permission lists carry no ask entries and no outward allow
The skill SHALL propose allow entries only for observed test, lint, build,
format, and read-only commands, one entry per task-runner recipe, SHALL
state the fixed deny list of unrecoverable actions, and SHALL write no ask
entry and no allow entry for a push, publication, release, tracker write,
or deletion unless the user kept it after one challenge, in which case the
section records the choice with the user's reason.

#### Scenario: Force push requested in the allow list
- **WHEN** the user asks to add `git push --force` to the allow list so agents can fix their own branches
- **THEN** the agent says once that a force push rewrites pushed history that the remote keeps and that pushed history is reverted, not rewritten, and it leaves the entry on the deny list unless the user repeats the request, in which case the section records the user's decision and reason

#### Scenario: Ask entry requested
- **WHEN** the user asks to put every tool of an MCP server under ask
- **THEN** the agent proposes allowing the server's read-only tools and classifying its outward tools by reversibility, and adds an ask entry only if the user states a reason no allow or deny entry can serve

#### Scenario: Runner wildcard in an existing file
- **WHEN** an existing permission file allows the whole task runner and one of its recipes pushes
- **THEN** the agent reports that the wildcard also allows the pushing recipe and proposes one entry per non-outward recipe

### Requirement: The platform half follows the hosting platform
The skill SHALL build platform files and propose remote changes only when
the Context or the repository's remote names GitHub or GitLab, and SHALL
treat every remote change as a separate delta that is shown with its
current value and exact command, applied only after the user's go-ahead for
that delta, read back, and recorded in a settings register.

#### Scenario: No hosted remote
- **WHEN** the project has no remote, or a remote that is neither GitHub nor GitLab
- **THEN** the section says in one sentence that there is no hosted platform and states only the policy half, and the build creates no labels, forms, templates, platform knowledge file, or settings register and proposes no remote change

#### Scenario: Design approved, remote untouched
- **WHEN** the user approves a section that states squash-only merging and the build reaches the merge-method setting
- **THEN** the agent shows the current merge methods and the exact command, and changes the setting only after the user approves that delta

#### Scenario: Probe cannot authenticate
- **WHEN** the platform CLI is missing or not logged in
- **THEN** the agent quotes the login or install command, installs nothing, continues from facts the user supplies, marks the settings register unverified, and lists every remote write as a pending human action with its exact command

#### Scenario: Protection the plan cannot enforce
- **WHEN** the repository is private on a plan that cannot enforce branch rules
- **THEN** the section and the register record default-branch protection as a convention with a named owner and the condition that would make it enforceable, and the agent says so before proposing it

### Requirement: Invariants and neighbouring layers
The skill SHALL turn each Invariant about what an agent may do into a
sentence of the entrypoint's always-on rules and, where a command pattern,
a path, or a platform rule can express it, into that mechanism, and SHALL
hand back every such Invariant that ended with no mechanical enforcement.
It SHALL leave to their own layers the sandbox and token boundary, the CI
jobs and hooks, and the meaning of specification approval, describing each
by role and never naming another skill.

#### Scenario: Invariant with a mechanism
- **WHEN** the handover carries the Invariant "agents never push to the default branch"
- **THEN** the build writes the sentence into the entrypoint's always-on block, makes the push recipe refuse on the default branch, proposes default-branch protection as a remote delta, and reports which of the three are in force

#### Scenario: Entrypoint missing or at its budget
- **WHEN** a build deposits the policy file and the project has no entrypoint, or the entrypoint would exceed its budget with the additions
- **THEN** the agent writes no entrypoint line and hands back each routing row as a route owed, naming the situation and the file, and each always-on sentence as a rule owed

#### Scenario: Specification approval label
- **WHEN** the section reserves the `spec:` label namespace and the project has a specification workflow
- **THEN** the build keeps one label file and its sync, leaves the insertion markers in the request template, the project skill, and the platform knowledge file unfilled, and hands back that the layer owning Completion fills them

#### Scenario: Stale Codex approval value
- **WHEN** an audited project's `.codex/config.toml` sets `approval_policy = "untrusted"`
- **THEN** the agent reports it as a finding, stating that Codex no longer accepts the value and that per-command prompting is written as prompt rules
