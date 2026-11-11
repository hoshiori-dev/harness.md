# Harness Audit Skill

## Purpose

Governs what an agent that loaded `harness-audit` observably does when it
diagnoses a project's harness: the three passes (format, drift, fitness),
how it treats reported symptoms, what a finding contains, and what it
proposes. The audit changes nothing. The skill is user-invoked and ships
to Claude Code, Codex, and Antigravity.

Non-goals: repairing anything; revising the design (the design workflow);
bringing artifacts back to the design (the build workflow); writing the
design of a harness that has none (the extract workflow); application test
or CI failures unrelated to the harness.

## Requirements

### Requirement: Triggering
The skill SHALL load only when the user invokes it by name and SHALL NOT
load from a description match, however closely a request resembles its
work.

#### Scenario: Invoked by name with a design and a harness
- **WHEN** the user runs the skill by name in a repository with `HARNESS.md` and built harness files
- **THEN** the skill loads and runs all three passes

#### Scenario: Invoked by name with a symptom
- **WHEN** the user runs the skill by name followed by "agents keep running the old test command"
- **THEN** the skill loads, records the sentence verbatim, and still runs the full audit

#### Scenario: Invoked by name without a HARNESS.md
- **WHEN** the user runs the skill by name in a repository with an `AGENTS.md` and hooks but no `HARNESS.md`
- **THEN** the skill loads and audits the harness against the usual practice for its Context

#### Scenario: Review request without invocation
- **WHEN** the user types "can you check whether our agent setup is any good?" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Single failing check without invocation
- **WHEN** the user says "the pre-commit hook fails on my change, fix it" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Methodology question without invocation
- **WHEN** the user asks "why do agents ignore a long AGENTS.md?" without invoking the skill
- **THEN** the skill does not load

### Requirement: The audit changes nothing
The agent SHALL create, edit, or delete no file and SHALL make no remote
change during the audit. Asked to fix something on the way, it SHALL
finish the report and name the workflow that makes the change.

#### Scenario: Fix requested mid-audit
- **WHEN** the user says "just fix that stale path while you are there"
- **THEN** the agent leaves the file unchanged, records the fix in the finding, and names the workflow that applies it

#### Scenario: End of the audit
- **WHEN** the report is delivered
- **THEN** `git status` shows no change caused by the audit

#### Scenario: Nothing to audit
- **WHEN** the repository has neither `HARNESS.md` nor any harness artifact
- **THEN** the agent reports that there is nothing to audit, names the design workflow, and invents no finding

### Requirement: Format pass
When a `HARNESS.md` exists the agent SHALL validate it and report every
error and warning as a finding, and SHALL report a Context that describes
another project as a high-severity finding.

#### Scenario: Undefined frontmatter key
- **WHEN** the frontmatter carries a top-level `status` key
- **THEN** the report holds a finding for it with the fix "move it under `metadata` or remove it"

#### Scenario: Foreign Context
- **WHEN** Context names GitLab and a five-person team while the remote is on GitHub and the history shows one author
- **THEN** the report holds a high-severity finding that Context does not describe this project

### Requirement: Drift pass
The agent SHALL compare each layer's section with the artifacts through
the installed skill that claims the layer, in audit mode, and SHALL state
for every finding which side to change: the artifact when it departs from
intent, the design when it names a fact the code states differently.

#### Scenario: Artifact departs from intent
- **WHEN** Authority says agents never push and a permission file allows `git push`
- **THEN** the finding is contradictory, cites the permission file line and the sentence, and says to change the artifact

#### Scenario: Design names a stale fact
- **WHEN** Feedback names `just test-fast` and the task runner defines only `just test`
- **THEN** the finding is stale and says to amend the design

#### Scenario: Artifact the design does not mention
- **WHEN** a working project skill exists that no section mentions
- **THEN** the finding is unrecorded and offers recording it in the design or removing it

#### Scenario: No design to compare with
- **WHEN** there is no `HARNESS.md`
- **THEN** each required layer is compared with the usual practice for the project's Context and each finding is marked "no design to compare with"

#### Scenario: No builder installed for a layer
- **WHEN** no installed skill claims the Entropy layer
- **THEN** the agent compares that section with the artifacts itself and the report names the gap

### Requirement: Fitness pass
The agent SHALL judge, per layer, whether the design fits the project's
Context today, SHALL check whether Context itself is still true, and SHALL
require evidence that what a constraint caught no longer occurs before
calling it excessive.

#### Scenario: Context moved
- **WHEN** Context says "discarded within a quarter" and the history spans two years with a deploy pipeline
- **THEN** the report holds a finding against Context and marks the decisions that cited it as in question

#### Scenario: Too little for unattended agents
- **WHEN** agents run unattended overnight and a permission entry allows publishing
- **THEN** Authority is judged too little, with the Context sentence and the entry as evidence

#### Scenario: Suspected dead constraint without evidence
- **WHEN** a custom check looks unused and nothing shows what it caught has stopped occurring
- **THEN** the finding is low severity and phrased as a question for the user, not a removal

### Requirement: Symptoms are traced to a layer
For each symptom the user reported, the agent SHALL locate it, name the
layer that could have stopped it most cheaply, link the findings that
explain it, and propose the change to the design; an unexplained symptom
SHALL be reported as such with what was checked.

#### Scenario: Convention keeps being missed
- **WHEN** the symptom is "agents keep forgetting to format" and the rule is a sentence in an over-long entrypoint
- **THEN** the proposal is a formatting check in Gates, not a stronger sentence

#### Scenario: Permission prompts pile up
- **WHEN** the symptom is frequent permission prompts and the permission file holds several ask entries
- **THEN** the cause is placed in Authority (and Environment when nothing isolates the agent) with the entries as evidence

#### Scenario: Symptom not found
- **WHEN** nothing in the files explains a reported symptom
- **THEN** the report says it is unexplained and lists what was checked

### Requirement: Report and next step
The report SHALL give every finding a severity (high, medium, low), a
class, evidence as `path:line` or command output, the design sentence or
"no design to compare with", and the fix with its side; it SHALL record the
user's dispositions and propose exactly one next step.

#### Scenario: Only artifacts are wrong
- **WHEN** every finding says to change an artifact
- **THEN** the next step is the build workflow bringing the harness back to the design

#### Scenario: Design must change
- **WHEN** at least one finding amends the design
- **THEN** the next step is a design revision followed by a build

#### Scenario: User keeps a flagged constraint
- **WHEN** the user says a check proposed for removal still catches regressions
- **THEN** the finding records the disposition and reason, and the next step leaves the check alone

#### Scenario: No design exists
- **WHEN** the audit ran without a `HARNESS.md`
- **THEN** the next step is the extract workflow, then the design workflow
