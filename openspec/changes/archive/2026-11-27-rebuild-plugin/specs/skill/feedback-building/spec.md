# Spec Delta

## MODIFIED Requirements

### Requirement: Triggering
The skill SHALL load, from its description alone, when a harness entry hands over the Feedback layer or when the user asks to decide, build, describe, or audit what a coding agent can run and observe to verify its own work, and SHALL NOT load for writing one test, fixing one failing check, or a neighbouring layer's concern.

#### Scenario: Agent claims completion without checking
- **WHEN** the user says "The agent keeps telling me it's done and then the page is broken. Give it a way to check its own work before it says so."
- **THEN** the skill loads

#### Scenario: Handover from a harness workflow
- **WHEN** a harness entry reaches the Feedback layer, holding the project's conditions and the decisions agreed for the layer, and looks for the skill that owns it
- **THEN** the skill loads

#### Scenario: Running system cannot be inspected
- **WHEN** the user says "Set things up so the coding agent can start our API locally, hit it, and read the logs without me doing it for it."
- **THEN** the skill loads

#### Scenario: Check output floods the context
- **WHEN** the user says "Every test run dumps thousands of lines into the agent's context. Work out what the agent should run after each change and how quiet it should be."
- **THEN** the skill loads

#### Scenario: Single test near-miss
- **WHEN** the user says "Write a unit test for `parse_duration` covering negative values."
- **THEN** the skill does not load

#### Scenario: Blocking gate near-miss
- **WHEN** the user says "Make CI fail the pull request when lint or tests fail, and add a secret scan to the commit hook."
- **THEN** the skill does not load

#### Scenario: Tool registration near-miss
- **WHEN** the user says "Register a browser MCP server for the agent and decide which domains it may reach."
- **THEN** the skill does not load

#### Scenario: Human code review near-miss
- **WHEN** the user says "Review my pull request and tell me what's wrong with it."
- **THEN** the skill does not load

### Requirement: Nothing built here blocks
The agent SHALL NOT add a hook, a CI job, or any mechanism that stops a commit or a merge; a check that must block SHALL be described in the hand back for the layer that owns Gates. A reviewer it sets up SHALL be read-only and SHALL be asked to skip style.

#### Scenario: Style sentence a tool could enforce
- **WHEN** the agreed decisions handed over for the layer include the style rule "coverage never drops below 80%"
- **THEN** the sentence is returned in the hand back for the layer that owns Gates and no coverage gate is built

#### Scenario: Client without subagents
- **WHEN** the agreed decisions include a review pass and the client cannot dispatch subagents
- **THEN** the agent delivers the self-check step only and records the missing reviewer in the knowledge file

#### Scenario: Missing observation tool
- **WHEN** the agreed decisions rely on a browser-driving tool that is not registered with the client
- **THEN** the agent does not install it and lists it in the hand back for the layer that owns Environment

### Requirement: Built commands are verified by running them
In build mode the agent SHALL run the fast check and the scoped test, SHALL confirm that a deliberately failing temporary test produces bounded output naming the file and assertion and then remove it, SHALL start, smoke-test, and stop the system when the agreed decisions include one, and SHALL state for each command either its recorded result or why it was not run.

#### Scenario: Fast check over budget
- **WHEN** the fast check takes 40 seconds against an agreed 10-second budget
- **THEN** the hand back records the measured time as a deviation for the entry to put to the user and does not weaken any check to meet the budget

#### Scenario: Start command leaves a process
- **WHEN** the stop recipe returns but the port is still in use
- **THEN** the verification is recorded as failed and the recipe is fixed before the hand back

#### Scenario: Long full check
- **WHEN** the agreed decisions state the full check takes an hour and the user has not agreed to run it
- **THEN** the agent does not run it and says so in the hand back

### Requirement: Audit reports disagreements with evidence
In audit mode the agent SHALL compare the project with the anchor document's text for the layer when the project adopted one, and otherwise with what the project's conditions call for, and SHALL give each finding a class, a severity of `high`, `medium`, or `low`, evidence as a path and line or a command and its output, the source of truth, and a proposed disposition.

#### Scenario: No section to compare with
- **WHEN** audit mode runs on a repository with a test suite that has adopted no anchor document
- **THEN** the project is compared with what its conditions call for and every finding is marked as having no recorded design to compare with

#### Scenario: Documented command is gone
- **WHEN** the knowledge file tells agents to run `just test-fast` and no such recipe exists
- **THEN** a finding of class stale cites the knowledge file line and the recipe list, names the recipe list as the source of truth, and proposes fixing the knowledge file

#### Scenario: Design thinner than its Context
- **WHEN** the project's adopted anchor `HARNESS.md` says in its Context that agents run unattended on a web application and its text for the layer gives no way to look at a page
- **THEN** a finding of class missing states that the agent cannot tell a working page from a broken one and proposes amending the document's design

#### Scenario: Reviewer that can write
- **WHEN** the project's reviewer subagent is configured with tools that edit files
- **THEN** the finding's severity is `high`

### Requirement: Outcomes
Given a repository and a handover, the agent SHALL leave results an independent reader can judge against the handover without opening the skill.

#### Scenario: Build for a Python API
- **WHEN** build mode receives agreed decisions naming `just check-fast` at 10 seconds, `just check`, a scoped pytest command, a start recipe on port 8000 with a health probe, a smoke request, and evidence in the pull request text, with a plan listing the task-runner file, a verification knowledge file, and the agent entrypoint
- **THEN** the repository gains those recipes, each non-interactive and quiet on success; a knowledge file stating the commands, their durations, how to start, inspect, and stop the service, and what a human verifies; the three commands and one route in the agent entrypoint's routing table; and a hand back recording the measured duration of the fast check, the output of a deliberately failing test, and a clean stop; no hook or CI file is added, no file outside the plan's list is written, and no delivered file names the plugin

#### Scenario: Design for a mobile application
- **WHEN** decide mode receives from an entry a mobile application whose environment has no simulator, with conditions of moderate cost and attended agents
- **THEN** the hand back recommends a thickness with its reasons, returns the fast, full, and scoped commands as decisions with the evidence for each, states that the running application cannot be driven by the agent here, lists what a human verifies with the manual steps, and reports the missing simulator as a question for the Environment layer; the result fails if it asks the user anything itself, leaves a decision of the layer neither settled nor open, or changes a file

#### Scenario: Audit of flaky tests
- **WHEN** audit mode finds tests that call an external API and fail on a second run
- **THEN** the findings name the tests, show both runs, give a class and a severity, name as the source of truth the anchor document's sentence on deterministic tests when the project adopted one and otherwise the deterministic tests its conditions call for, and propose fixing the tests; no file is changed

## REMOVED Requirements

### Requirement: Mode decides whether files change

**Reason**: The modes design and extract are replaced by decide and describe, build works from the agreed decisions and the plan's files instead of a section, and a direct request no longer drafts a section of a root `HARNESS.md` for one approval.

**Migration**: See "Only build mode writes".

### Requirement: The section is designed defaults first

**Reason**: The builder no longer drafts a complete section behind one approval; it returns decisions for the entry to settle with the user in rounds. The defaults survive as what it settles on evidence or recommends.

**Migration**: See "Decide returns the layer's decisions".

### Requirement: The section stands alone

**Reason**: Decide mode returns decisions and describe mode returns a description; neither returns the Feedback section of a root `HARNESS.md`.

**Migration**: See "Returned decisions and descriptions stand alone".

## ADDED Requirements

### Requirement: Only build mode writes
The agent SHALL work in the mode the handover names (decide, describe, build, audit), or the mode it infers from a direct request, and SHALL write no file in decide, describe, and audit modes. In build mode it SHALL write only the files the plan lists for the layer, as the agreed decisions require. Run with no entry, it SHALL show what it decided on the evidence, ask the open decisions, and write only after the user accepted what was shown.

#### Scenario: Describe leaves the tree untouched
- **WHEN** the skill is asked to describe the existing verification setup of a repository
- **THEN** the agent returns the description and `git status` shows no change

#### Scenario: Audit leaves the tree untouched
- **WHEN** an entry asks for an audit of the layer
- **THEN** the agent returns findings only and `git status` shows no change

#### Scenario: Direct request in a project without an anchor document
- **WHEN** the user asks directly for fast and full check commands in a repository with no `HARNESS.md`, with no entry running
- **THEN** the agent shows each decision it settled with its evidence, asks the open decisions through the client's question tool where there is one, writes nothing before the user accepted what was shown, and creates no `HARNESS.md`

#### Scenario: Direct request in a project with an anchor document
- **WHEN** the same direct request changes what the project's adopted anchor `HARNESS.md` says about verification
- **THEN** the accepted change is also written to that document in the same piece of work

#### Scenario: Plan only
- **WHEN** a build handover asks for the plan only
- **THEN** the agent returns the files it would create, change, or delete, each by path with one line on its shape, and writes nothing

### Requirement: Decide returns the layer's decisions
In decide mode the agent SHALL return a recommended thickness with its reasons and each Feedback decision either as settled, with the observed fact or other evidence that settles it, or as open, with its options, the recommended one first, its reason, and the decisions it depends on. The recommendation SHALL follow the project's conditions and the kind of system. Handed over by an entry the agent SHALL ask the user nothing itself.

#### Scenario: Decisions covered
- **WHEN** decide mode hands back for a project where the layer is not recommended as omitted
- **THEN** the command surface, a scoped test command, time budgets, output shape, how the system is run, how it is driven and observed, test practice, evidence, a review pass, a session-start check, and human verification each appear as settled or as open

#### Scenario: Library
- **WHEN** the project is a library with a test suite
- **THEN** the hand back settles that there is nothing to start because the tests are the system, and names the fast, full, and scoped commands with their durations

#### Scenario: Web interface with costly mistakes
- **WHEN** the project is a web application and the conditions say a wrong change costs real work to undo
- **THEN** the hand back recommends a start command with a readiness check and a stop command, a browser-driving tool with screenshots, and what the browser tooling cannot see listed for a human

#### Scenario: Throwaway project
- **WHEN** the conditions say the project is discarded within weeks
- **THEN** the hand back recommends no review pass and says so with the reason

#### Scenario: Slow suite
- **WHEN** the full check is reported to take forty minutes
- **THEN** the hand back recommends a middle tier that runs the tests of changed files or a fixed sample, and states each tier's duration

#### Scenario: Decision the evidence does not settle
- **WHEN** an entry hands over decide mode and nothing in the repository or the conditions makes one option for a decision clearly better
- **THEN** the decision is returned as open with its options, the recommended one first with its reason, and the agent asks the user nothing

### Requirement: Returned decisions and descriptions stand alone
What the agent returns in decide or describe mode SHALL name the fast, full, and scoped commands as typed with their durations, what each prints on success and failure, how the system is started, checked, and stopped, each observation tool and its use, where fixtures and seed data live, how golden files are updated, what evidence a finished task carries, any review pass, and what is left to a human, in prose that uses no term defined only by the plugin.

#### Scenario: Reader without the plugin
- **WHEN** a reader who has never seen the plugin reads a returned description, or the settled decisions of a hand back
- **THEN** they can run the fast check, start and stop the system, and say what they must verify by hand, without consulting any other document

#### Scenario: Nothing to run
- **WHEN** the project is a documentation repository with no checks
- **THEN** the hand back still covers the layer, says that nothing can be run to verify a change, and gives the reason

#### Scenario: Command not run
- **WHEN** describe mode finds a `test-e2e` recipe that needs a service unavailable in the session
- **THEN** the description lists the recipe and marks it as not run in this session with the reason

### Requirement: Describe states what exists
In describe mode the agent SHALL describe the verification the project has today as prose fit for a `HARNESS.md`, SHALL mark inferred intent as inferred, and SHALL NOT replace an observed practice with a recommendation.

#### Scenario: Intent not recorded
- **WHEN** describe mode finds a reviewer subagent and no document says why the project has one
- **THEN** the description states that the reviewer exists and marks its purpose as inferred
