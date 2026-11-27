# Spec Delta

## MODIFIED Requirements

### Requirement: Triggering
The skill SHALL load, from its description alone, when a harness entry hands over the Gates layer or when the user asks to decide, build, describe, or audit the deterministic checks that keep a broken or secret change off a branch, and SHALL NOT load for a single failing check, a deployment pipeline, or a neighbouring layer's concern.

#### Scenario: Commit hook and CI gates for an agent-worked repository
- **WHEN** the user says "Agents will be committing to this repo. Set up the pre-commit hook and CI checks so nothing broken or secret can land on main."
- **THEN** the skill loads

#### Scenario: Handover from a harness workflow
- **WHEN** a harness entry reaches the Gates layer, with the project's conditions and the decisions agreed for the layer, and looks for the skill that owns it
- **THEN** the skill loads

#### Scenario: Summary gate passes on a skipped job
- **WHEN** the user says "Our CI gate went green although the test job was skipped. Find out what else in our checks can pass without running."
- **THEN** the skill loads

#### Scenario: Structure rule with routing
- **WHEN** the user says "Add a check that blocks imports from `app/` into `infra/` and tells whoever hits it what to do instead."
- **THEN** the skill loads

#### Scenario: Single failing test near-miss
- **WHEN** the user says "The pre-commit hook fails on `tests/test_parser.py`, fix the test."
- **THEN** the skill does not load

#### Scenario: Deployment pipeline near-miss
- **WHEN** the user says "Write a CI workflow that builds the Docker image and deploys it to staging on every tag."
- **THEN** the skill does not load

#### Scenario: Agent verification loop near-miss
- **WHEN** the user says "The agent keeps saying it's done without running anything. Give it a quick command to check its work and a way to look at the running app."
- **THEN** the skill does not load

#### Scenario: Permission list near-miss
- **WHEN** the user says "Decide which git commands the agent may run without asking and which are denied outright."
- **THEN** the skill does not load

### Requirement: Assigned Invariants and Style are sorted
For every agreed decision assigned to the layer that states an invariant or a style rule, the agent SHALL name the tool rule or structure check that enforces it, or return it as not enforceable deterministically, and SHALL NOT drop one silently.

#### Scenario: Enforceable and unenforceable sentences
- **WHEN** the handover carries "domain code never imports from infrastructure" and "public functions are named for what the caller gets"
- **THEN** the first becomes a structure check with a stated alternative and the second is returned in the hand back for the layers that own Knowledge or Feedback

#### Scenario: Rule without an alternative
- **WHEN** a structural rule is handed over and neither the handover nor the project says what to do instead
- **THEN** decide mode returns it as an open decision, and build mode does not write the check and hands it back as a pending decision

### Requirement: Built gates are quiet, routed, and unable to pass silently
In build mode every check SHALL run through a task-runner recipe with its tool's own quiet flags and no output parser; the hook SHALL always hold the formatter and the secret scan; every custom check's failure SHALL name the location, the rule and where it is written, and the alternative, and SHALL treat unreadable input as an error; and a summary gate SHALL fail on a failed, cancelled, or skipped job.

#### Scenario: Tests over the hook budget
- **WHEN** the test suite takes minutes and the agreed hook budget is 10 seconds
- **THEN** the tests run in CI and in the full recipe, not in the hook, and the hand back says which checks left the hook and why

#### Scenario: Request for a log filter
- **WHEN** the user asks for a script that greps the test log down to the failures
- **THEN** the agent explains once that it is a second system to maintain, offers the tool's quiet flags or a scoped command, and writes a filter only if the user still wants it, recording the trade-off in the knowledge file

#### Scenario: Secret scanner cannot be installed
- **WHEN** the agreed secret scanner cannot be installed in the environment
- **THEN** the scan is the first item of the pending decisions list with alternatives, and any hook delivered without it is reported as incomplete

#### Scenario: Existing code fails a new check
- **WHEN** a newly configured lint rule fails on existing files
- **THEN** the failure is reported as a finding and neither the rule nor the application code is changed

### Requirement: Cross-layer markers are kept
A delivered CI file SHALL keep a commented `# harness:` slot among its jobs for the harness self-check, and the project SHALL hold exactly one copy of the sentence stating how an agent may change soft read-only check configuration.

#### Scenario: Self-check slot
- **WHEN** build mode delivers a checks workflow and the agreed decisions do not mention a harness self-check
- **THEN** the workflow still contains the commented `# harness:` slot and the hand back names the file holding it

#### Scenario: Sentence already stated elsewhere
- **WHEN** an environment knowledge file already states that check configuration is never weakened to make a check pass
- **THEN** the checks knowledge file links to it, lists only the configuration files this layer adds, and does not repeat the sentence

#### Scenario: Sentence stated nowhere
- **WHEN** no knowledge file states the rule
- **THEN** the checks knowledge file states it, lists the check configuration files it covers and the hard read-only secret-scan files, and the hand back names that file as the sentence's source

### Requirement: Audit reports disagreements with evidence
In audit mode the agent SHALL compare the project with the anchor document's text for the layer when the project adopted one, and otherwise with what the project's conditions call for; SHALL report each disagreement and each check that cannot fail; and SHALL give each finding a class, a severity of `high`, `medium`, or `low`, evidence as a path and line or a command and its output, the source of truth, and a proposed disposition.

#### Scenario: No section to compare with
- **WHEN** audit mode runs on a repository with a CI workflow that has adopted no anchor document
- **THEN** the project is compared with what its conditions call for and every finding is marked as having no recorded design to compare with

#### Scenario: Advisory job outside the gate
- **WHEN** a GitLab job outside the gate's job list is allowed to fail and the anchor document names it as the advisory harness self-check
- **THEN** no finding reports it as a check that cannot fail

#### Scenario: Check outside the section
- **WHEN** the project adopted an anchor document and CI runs a typecheck job that the document's text for the layer does not mention
- **THEN** a finding names the job, cites the workflow line, and proposes amending the document as its disposition

#### Scenario: Design thinner than its Context
- **WHEN** the project's conditions say agents run unattended and the anchor document's text for the layer has no summary gate
- **THEN** a finding states the gap and proposes amending the document

#### Scenario: Missing secret scan
- **WHEN** the commit hook has no secret scan although the anchor document, or without one the project's conditions, call for one
- **THEN** the finding's class is missing and its severity is `high`

#### Scenario: Finding fields
- **WHEN** audit mode returns any finding
- **THEN** it carries one class out of stale, duplicated, contradictory, invisible, missing, and excessive, one severity, its evidence, what was taken as the source of truth, and a proposed disposition

### Requirement: Outcomes
Given a repository and a handover, the agent SHALL leave results an independent reader can judge without opening the skill.

#### Scenario: Build on a Python GitHub repository
- **WHEN** build mode receives agreed decisions naming ruff, pyright, pytest, betterleaks, `just`, a 10-second hook budget, and one CI job per check with no summary gate, with the files the plan lists for the layer
- **THEN** the repository gains a hook configuration running the formatter, the secret scan, lint, and typecheck; recipes for each check added to the fast and full aggregates; a checks workflow with one job per check and a secret-scan job, actions pinned by commit SHA; a knowledge file stating where each check runs and that checks are never weakened; one route in the agent entrypoint's routing table; and a hand back listing each file with its verification result and the platform settings left for a human; no delivered file names the plugin or a path inside it, and no file the plan does not list was written

#### Scenario: Design for a TypeScript monorepo with many contributors
- **WHEN** decide mode receives conditions of several contributors, a long maintenance horizon, and GitLab hosting, and an invariant forbidding imports from `app/` into `infra/`
- **THEN** the hand back recommends a thickness with its reasons and returns, each as settled with its evidence or as open with the recommended option first and its reason: the formatter, linter, type checker, test command, secret scanner, a structure check for the import rule with its alternative, a GitLab pipeline with a summary gate, the hook budget, and the project setting "pipelines must succeed" as a human action; the result fails if it asks the user anything or changes a file

#### Scenario: Audit of a hook that grew slow
- **WHEN** audit mode finds a commit hook that runs the full test suite for several minutes in a project whose adopted anchor document states a 10-second budget
- **THEN** the findings include the measured or reported time, the document's sentence as the source of truth, a class and a severity, and the proposed disposition of moving the tests to CI and a scoped recipe, and no file is changed

## REMOVED Requirements

### Requirement: Mode decides whether files change

**Reason**: The modes design and extract are replaced by decide and describe, build no longer works from a section of a root `HARNESS.md`, and a direct request no longer drafts such a section for one approval.

**Migration**: See "Only build mode writes".

### Requirement: The section is designed defaults first

**Reason**: The builder no longer drafts a complete section with one default per decision; it returns decisions for the entry to settle with the user in rounds.

**Migration**: See "Decide returns the layer's decisions".

### Requirement: The section stands alone

**Reason**: Design and extract no longer return a section of a `HARNESS.md`; decide returns decisions and describe returns prose.

**Migration**: See "What is returned stands alone" and "Describe states what exists".

## ADDED Requirements

### Requirement: Only build mode writes
The agent SHALL write no file in decide, describe, and audit modes, and in build mode SHALL write only the files the plan lists for the layer, from the agreed decisions, reporting each departure a fact forced as a deviation for the entry to put to the user. Run directly by a user, it SHALL show what it decided on the evidence, ask the open decisions, and write only after the user accepted what it showed.

#### Scenario: Audit leaves the tree untouched
- **WHEN** an entry hands over the Gates layer in audit mode
- **THEN** the agent returns findings and `git status` shows no change

#### Scenario: Decide leaves the tree untouched
- **WHEN** an entry hands over the Gates layer in decide mode
- **THEN** the agent returns a recommended thickness and the layer's decisions, and `git status` shows no change

#### Scenario: Direct request with no HARNESS.md
- **WHEN** the user asks for a commit hook and CI checks in a repository with no `HARNESS.md`, with no entry running
- **THEN** the agent shows what it decided on the evidence, with each recommendation and its reason, asks the open decisions through the client's question tool where there is one, writes nothing before the user accepted what was shown, and creates no `HARNESS.md`

#### Scenario: Direct request in a project with an anchor document
- **WHEN** the same direct request changes what the project's adopted anchor `HARNESS.md` says about its gates
- **THEN** the accepted change is also written to that document in the same piece of work

#### Scenario: Detail the agreed decisions leave open
- **WHEN** the agreed decisions name a commit hook but no time budget
- **THEN** the agent builds with a 10-second budget and reports that number as an assumption in the hand back

#### Scenario: Plan only
- **WHEN** a build handover asks for the plan only
- **THEN** the agent returns the files it would create, change, or delete, each by path with one line on its shape, and writes nothing

### Requirement: Decide returns the layer's decisions
In decide mode the agent SHALL return a recommended thickness with its reasons and each Gates decision (check set, tool per role, task runner, hook framework, hook budget, where each check runs, CI platform, summary gate, structure checks, script language, agent-turn hook, rule on changing a check) as settled, with its evidence, or as open, with options, the recommended one first, its reason, and what it depends on. Handed over by an entry it SHALL ask the user nothing itself.

#### Scenario: Short-lived prototype
- **WHEN** the conditions say the project will be discarded within a quarter and a wrong change is cheap
- **THEN** the hand back recommends gating on a formatter and a secret scan only and states that lint, typecheck, and tests are deliberately not gated and why

#### Scenario: Costly project with unattended agents
- **WHEN** the conditions say a wrong change reaches customers and agents run unattended on GitHub
- **THEN** the hand back recommends adding lint, typecheck, tests, and a summary gate named as the one required check, and lists registering that check as a setting a human applies

#### Scenario: Existing tool in another role
- **WHEN** the repository configures `ruff` only as a linter and has no formatter
- **THEN** the hand back settles `ruff` as the linter on that evidence and returns the formatter as a recommendation, never as observed

#### Scenario: Unsupported host
- **WHEN** the conditions name a Bitbucket or Gitea host
- **THEN** the hand back covers the hook and recipes and returns the CI jobs as an open decision

### Requirement: What is returned stands alone
The decisions returned in decide mode and the prose returned in describe mode SHALL name each check with its tool and exact command, where each runs, the hook budget, the platform and any summary gate by job name, each structure rule with what to do instead, the rule on weakening checks, the settings a human applies on the platform, and what is deliberately not gated, using no term defined only by the plugin.

#### Scenario: Reader without the plugin
- **WHEN** a reader who has never seen the plugin reads what decide or describe mode returned
- **THEN** they can list the commands the hook runs and the CI jobs to create without consulting any other document

### Requirement: Describe states what exists
In describe mode the agent SHALL describe the gates the project has today as prose fit for a `HARNESS.md`, SHALL mark inferred intent as inferred, and SHALL NOT replace an observed practice with a recommendation or describe a check that cannot fail as blocking.

#### Scenario: Unexplained practice
- **WHEN** describe mode finds a hook without tests and no document says why
- **THEN** the description states the fact and marks any stated reason as inferred

#### Scenario: Check that never blocks
- **WHEN** describe mode finds a CI lint job carrying `continue-on-error: true`
- **THEN** the description describes that job as not blocking

### Requirement: Built gates are verified against a violation
In build mode the agent SHALL verify each cheap local gate against a temporary harmless violation, delete every temporary file afterward, never commit or push a violation to test CI, and report every gate in the hand back as shown to fail or as not verified with the reason.

#### Scenario: Local formatter and secret-scan gates
- **WHEN** build mode installs a pre-commit hook running a formatter and a secret scanner
- **THEN** the agent runs each against a temporary file carrying one formatting violation or an obviously fake credential, confirms a non-zero exit, deletes the temporary files so `git status` is clean, and reports those gates as shown to fail

#### Scenario: CI job with no observed failing run
- **WHEN** build mode writes a GitHub Actions checks workflow and summary gate
- **THEN** the agent commits or pushes no violation to trigger CI and reports the CI jobs and summary gate in the hand back as not verified with the reason
