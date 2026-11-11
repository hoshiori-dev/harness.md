# gates-building

## Purpose

Governs what an agent that loaded `gates-building` observably does with the Gates layer of a project's agent harness: the deterministic checks (formatter, secret scan, lint, typecheck, tests, structure checks) that run in a commit hook and in CI on GitHub or GitLab, the summary gate, and the rule against weakening checks. The skill works in four modes: design and extract return the Gates section of a `HARNESS.md` as prose, build realises a section in the project, and audit reports where project and section disagree. The skill ships to Claude Code, Codex, and Antigravity. Non-goals: the commands an agent runs to verify its own work, test recipes, and review steps (the Feedback layer); which commands an agent may run, and required-check registration, branch protection, labels, and templates on the platform (the Authority layer); the harness self-check (the Entropy layer); installing tools into the agent environment (the Environment layer); and fixing an ordinary failing test or lint error in application code.

## Requirements

### Requirement: Triggering
The skill SHALL load, from its description alone, when a harness workflow hands over the Gates layer or when the user asks to design, build, describe, or audit the deterministic checks that keep a broken or secret change off a branch, and SHALL NOT load for a single failing check, a deployment pipeline, or a neighbouring layer's concern.

#### Scenario: Commit hook and CI gates for an agent-worked repository
- **WHEN** the user says "Agents will be committing to this repo. Set up the pre-commit hook and CI checks so nothing broken or secret can land on main."
- **THEN** the skill loads

#### Scenario: Handover from a harness workflow
- **WHEN** a harness build workflow reaches the layer whose section is headed Gates and looks for the skill that owns it
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

### Requirement: Mode decides whether files change
The agent SHALL write no file in design, extract, and audit modes, and in build mode SHALL write only what the Gates section describes. Run without a workflow and without a section covering the work, it SHALL draft the section first and obtain one approval before writing.

#### Scenario: Audit leaves the tree untouched
- **WHEN** the skill is handed the Gates section in audit mode
- **THEN** the agent returns findings and `git status` shows no change

#### Scenario: Direct request with no HARNESS.md
- **WHEN** the user asks for a commit hook and CI checks in a repository with no `HARNESS.md`
- **THEN** the agent presents the complete Gates section it would build from, with every default and its reason, asks for one approval, and writes nothing before it

#### Scenario: Section silent on a detail
- **WHEN** the section names a commit hook but no time budget
- **THEN** the agent builds with a 10-second budget and reports that number as an assumption in the hand back

### Requirement: The section is designed defaults first
In design mode the agent SHALL settle the check set, the tool for each role, the task runner, the hook framework, the hook budget, where each check runs, the CI platform, the summary gate, structure checks, the script language, an agent-turn hook, and the rule on changing a check, taking each observed fact as it is and otherwise applying one default selected by the project's Context, without interviewing the user decision by decision.

#### Scenario: Short-lived prototype
- **WHEN** the Context says the project will be discarded within a quarter and a wrong change is cheap
- **THEN** the returned section gates on a formatter and a secret scan only and states that lint, typecheck, and tests are deliberately not gated and why

#### Scenario: Costly project with unattended agents
- **WHEN** the Context says a wrong change reaches customers and agents run unattended on GitHub
- **THEN** the returned section adds lint, typecheck, tests, a summary gate named as the one required check, and lists registering that check as a setting a human applies

#### Scenario: Existing tool in another role
- **WHEN** the repository configures `ruff` only as a linter and has no formatter
- **THEN** the section keeps `ruff` as the linter, names a formatter by default, and reports the formatter as an assumption rather than as observed

#### Scenario: Unsupported host
- **WHEN** the Context names a Bitbucket or Gitea host
- **THEN** the section covers the hook and recipes and lists the CI jobs as an open question

### Requirement: The section stands alone
A section returned in design or extract mode SHALL name each check with its tool and exact command, where each runs, the hook budget, the platform and any summary gate by job name, each structure rule with what to do instead, the rule on weakening checks, the settings a human applies on the platform, and what is deliberately not gated, in prose that uses no term defined only by the plugin.

#### Scenario: Reader without the plugin
- **WHEN** a reader who has never seen the plugin reads a returned section
- **THEN** they can list the commands the hook runs and the CI jobs to create without consulting any other document

#### Scenario: Extract marks inference
- **WHEN** extract mode finds a hook without tests and no document says why
- **THEN** the section states the fact and marks any stated reason as inferred

#### Scenario: Check that never blocks
- **WHEN** extract mode finds a CI lint job carrying `continue-on-error: true`
- **THEN** the section describes that job as not blocking

### Requirement: Assigned Invariants and Style are sorted
For every sentence of Invariants or Style handed over, the agent SHALL name the tool rule or structure check that enforces it, or return it as not enforceable deterministically, and SHALL NOT drop one silently.

#### Scenario: Enforceable and unenforceable sentences
- **WHEN** the handover carries "domain code never imports from infrastructure" and "public functions are named for what the caller gets"
- **THEN** the first becomes a structure check with a stated alternative and the second is returned in the hand back for the layers that own Knowledge or Feedback

#### Scenario: Rule without an alternative
- **WHEN** a structural rule is handed over and neither the design nor the project says what to do instead
- **THEN** design mode lists it as an open question, and build mode does not write the check and adds a pending decision

### Requirement: Built gates are quiet, routed, and unable to pass silently
In build mode every check SHALL run through a task-runner recipe with its tool's own quiet flags and no output parser; the hook SHALL always hold the formatter and the secret scan; every custom check's failure SHALL name the location, the rule and where it is written, and the alternative, and SHALL treat unreadable input as an error; and a summary gate SHALL fail on a failed, cancelled, or skipped job.

#### Scenario: Tests over the hook budget
- **WHEN** the test suite takes minutes and the section's hook budget is 10 seconds
- **THEN** the tests run in CI and in the full recipe, not in the hook, and the hand back says which checks left the hook and why

#### Scenario: Request for a log filter
- **WHEN** the user asks for a script that greps the test log down to the failures
- **THEN** the agent explains once that it is a second system to maintain, offers the tool's quiet flags or a scoped command, and writes a filter only if the user still wants it, recording the trade-off in the knowledge file

#### Scenario: Secret scanner cannot be installed
- **WHEN** the section's secret scanner cannot be installed in the environment
- **THEN** the scan is the first item of the pending decisions list with alternatives, and any hook delivered without it is reported as incomplete

#### Scenario: Existing code fails a new check
- **WHEN** a newly configured lint rule fails on existing files
- **THEN** the failure is reported as a finding and neither the rule nor the application code is changed

### Requirement: Cross-layer markers are kept
A delivered CI file SHALL keep a commented `# harness:` slot among its jobs for the harness self-check, and the project SHALL hold exactly one copy of the sentence stating how an agent may change soft read-only check configuration.

#### Scenario: Self-check slot
- **WHEN** build mode delivers a checks workflow and the Gates section does not mention a harness self-check
- **THEN** the workflow still contains the commented `# harness:` slot and the hand back names the file holding it

#### Scenario: Sentence already stated elsewhere
- **WHEN** an environment knowledge file already states that check configuration is never weakened to make a check pass
- **THEN** the checks knowledge file links to it, lists only the configuration files this layer adds, and does not repeat the sentence

#### Scenario: Sentence stated nowhere
- **WHEN** no knowledge file states the rule
- **THEN** the checks knowledge file states it, lists the check configuration files it covers and the hard read-only secret-scan files, and the hand back names that file as the sentence's source

### Requirement: Platform settings stay with a human
The agent SHALL NOT register a required check, change branch protection, or enable push protection; it SHALL list each such setting by exact name in the hand back.

#### Scenario: Summary gate built
- **WHEN** the build delivers a workflow with a summary gate on GitHub
- **THEN** the hand back names `checks / gate` as the check to register as required and states that a human or the layer owning Authority applies it

### Requirement: Audit reports disagreements with evidence
In audit mode the agent SHALL report each disagreement between the section and the project, and each check that cannot fail, with a severity of `high`, `medium`, or `low`, evidence as a path and line or a command and its output, the sentence of the section it contradicts, and whether to fix the artifact or amend the design.

#### Scenario: No section to compare with
- **WHEN** audit mode runs on a repository with a CI workflow but no `HARNESS.md`
- **THEN** the project is compared with the defaults for its Context and every finding is marked "no design to compare with"

#### Scenario: Check outside the section
- **WHEN** CI runs a typecheck job the section does not mention
- **THEN** a finding names the job, cites the workflow line, and offers amending the design as the remedy

#### Scenario: Design thinner than its Context
- **WHEN** the Context says agents run unattended and the section has no summary gate
- **THEN** a finding states the gap and proposes amending the design

#### Scenario: Missing secret scan
- **WHEN** the commit hook has no secret scan although the section requires one
- **THEN** the finding's severity is `high`

### Requirement: Routes are added or owed
The agent SHALL add the route to its knowledge file to the entrypoint's routing table only when the entrypoint exists and stays within its budget, and otherwise SHALL hand the route back as owed, naming the situation and the file.

#### Scenario: No entrypoint yet
- **WHEN** build mode deposits the checks knowledge file in a repository with no agent entrypoint
- **THEN** no entrypoint is created and the hand back lists a route owed with the load condition and the file path

### Requirement: Outcomes
Given a repository and a Gates section, the agent SHALL leave results an independent reader can judge against the section without opening the skill.

#### Scenario: Build on a Python GitHub repository
- **WHEN** build mode receives a section naming ruff, pyright, pytest, betterleaks, `just`, a 10-second hook budget, and one CI job per check with no summary gate
- **THEN** the repository gains a hook configuration running the formatter, the secret scan, lint, and typecheck; recipes for each check added to the fast and full aggregates; a checks workflow with one job per check and a secret-scan job, actions pinned by commit SHA; a knowledge file stating where each check runs and that checks are never weakened; one route in the agent entrypoint's routing table; and a hand back listing each file with its verification result and the platform settings left for a human; no delivered file names the plugin or a path inside it

#### Scenario: Design for a TypeScript monorepo with many contributors
- **WHEN** design mode receives a Context of several contributors, a long maintenance horizon, GitLab hosting, and an Invariants sentence forbidding imports from `app/` into `infra/`
- **THEN** the returned section names the formatter, linter, type checker, test command, secret scanner, a structure check for the import rule with its alternative, a GitLab pipeline with a summary gate, the hook budget, and the project setting "pipelines must succeed" as a human action, together with the defaults applied and their reasons

#### Scenario: Audit of a hook that grew slow
- **WHEN** audit mode finds a commit hook that runs the full test suite for several minutes against a section stating a 10-second budget
- **THEN** the findings include the measured or reported time, the section sentence, and the remedy of moving the tests to CI and a scoped recipe, and no file is changed
