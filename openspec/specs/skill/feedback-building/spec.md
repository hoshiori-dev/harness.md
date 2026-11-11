# feedback-building

## Purpose

Governs what an agent that loaded `feedback-building` observably does with the Feedback layer of a project's agent harness: the fast and full checks an agent runs, the shape of their output, the way the system under development is started, driven, and observed, the test practice that makes results trustworthy, the evidence a finished task carries, a review pass in a fresh context, and the list of what only a human can verify. The skill works in four modes: design and extract return the Feedback section of a `HARNESS.md` as prose, build realises a section in the project, and audit reports where project and section disagree. The skill ships to Claude Code, Codex, and Antigravity. Non-goals: hooks, CI jobs, and anything that blocks a commit or merge (the Gates layer); registering tools and MCP servers, installing browsers or runtimes, and credentials (the Environment layer); which commands run without asking (the Authority layer); what counts as done for a task (the Completion layer); and writing or fixing the application's own tests for a feature.

## Requirements

### Requirement: Triggering
The skill SHALL load, from its description alone, when a harness workflow hands over the Feedback layer or when the user asks to design, build, describe, or audit what a coding agent can run and observe to verify its own work, and SHALL NOT load for writing one test, fixing one failing check, or a neighbouring layer's concern.

#### Scenario: Agent claims completion without checking
- **WHEN** the user says "The agent keeps telling me it's done and then the page is broken. Give it a way to check its own work before it says so."
- **THEN** the skill loads

#### Scenario: Handover from a harness workflow
- **WHEN** a harness build workflow reaches the layer whose section is headed Feedback and looks for the skill that owns it
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

### Requirement: Mode decides whether files change
The agent SHALL write no file in design, extract, and audit modes, and in build mode SHALL write only what the Feedback section describes. Run without a workflow and without a section covering the work, it SHALL draft the section first and obtain one approval before writing.

#### Scenario: Extract leaves the tree untouched
- **WHEN** the skill is asked to describe the existing verification setup of a repository
- **THEN** the agent returns the section text and `git status` shows no change

#### Scenario: Direct request with no HARNESS.md
- **WHEN** the user asks for fast and full check commands in a repository with no `HARNESS.md`
- **THEN** the agent presents the complete Feedback section it would build from, with every default and its reason, asks for one approval, and writes nothing before it

### Requirement: The section is designed defaults first
In design mode the agent SHALL settle the command surface, a scoped test command, time budgets, output shape, how the system is run, how it is driven and observed, test practice, evidence, a review pass, a session-start check, and human verification, taking each observed fact as it is and otherwise applying one default selected by the project's Context and the kind of system, without interviewing the user decision by decision.

#### Scenario: Library
- **WHEN** the project is a library with a test suite
- **THEN** the returned section states that there is nothing to start because the tests are the system, and names the fast, full, and scoped commands with their durations

#### Scenario: Web interface with costly mistakes
- **WHEN** the project is a web application and the Context says a wrong change costs real work to undo
- **THEN** the returned section includes a start command with a readiness check and a stop command, a browser-driving tool with screenshots, and what the browser tooling cannot see listed for a human

#### Scenario: Throwaway project
- **WHEN** the Context says the project is discarded within weeks
- **THEN** the returned section has no review pass and says so with the reason

#### Scenario: Slow suite
- **WHEN** the full check is reported to take forty minutes
- **THEN** the returned section adds a middle tier that runs the tests of changed files or a fixed sample, and states each tier's duration

### Requirement: The section stands alone
A section returned in design or extract mode SHALL name the fast, full, and scoped commands as typed with their durations, what each prints on success and failure, how the system is started, checked, and stopped, each observation tool and its use, where fixtures and seed data live, how golden files are updated, what evidence a finished task carries, any review pass, and what is left to a human, in prose that uses no term defined only by the plugin.

#### Scenario: Reader without the plugin
- **WHEN** a reader who has never seen the plugin reads a returned section
- **THEN** they can run the fast check, start and stop the system, and say what they must verify by hand, without consulting any other document

#### Scenario: Nothing to run
- **WHEN** the project is a documentation repository with no checks
- **THEN** the section still exists, says that nothing can be run to verify a change, and gives the reason

#### Scenario: Command not run
- **WHEN** extract mode finds a `test-e2e` recipe that needs a service unavailable in the session
- **THEN** the section lists the recipe and marks it as not run in this session with the reason

### Requirement: Output is shaped by the tool, never parsed
Every check or test command the agent writes SHALL use the tool's own quiet flag or compact reporter, SHALL be non-interactive, and SHALL NOT be wrapped in an output parser or filter unless the user insists after hearing the cost once.

#### Scenario: Default test script watches
- **WHEN** the project's `test` script starts a watcher
- **THEN** the recipe the agent writes runs the suite once and exits

#### Scenario: Tool without a quiet mode
- **WHEN** a check tool offers no compact output
- **THEN** the agent keeps its native output, records that in one sentence in the knowledge file, and offers a scoped command

### Requirement: Nothing built here blocks
The agent SHALL NOT add a hook, a CI job, or any mechanism that stops a commit or a merge; a check that must block SHALL be described in the hand back for the layer that owns Gates. A reviewer it sets up SHALL be read-only and SHALL be asked to skip style.

#### Scenario: Style sentence a tool could enforce
- **WHEN** the handed-over Style says "coverage never drops below 80%"
- **THEN** the sentence is returned in the hand back for the layer that owns Gates and no coverage gate is built

#### Scenario: Client without subagents
- **WHEN** the section has a review pass and the client cannot dispatch subagents
- **THEN** the agent delivers the self-check step only and records the missing reviewer in the knowledge file

#### Scenario: Missing observation tool
- **WHEN** the section relies on a browser-driving tool that is not registered with the client
- **THEN** the agent does not install it and lists it in the hand back for the layer that owns Environment

### Requirement: Built commands are verified by running them
In build mode the agent SHALL run the fast check and the scoped test, SHALL confirm that a deliberately failing temporary test produces bounded output naming the file and assertion and then remove it, SHALL start, smoke-test, and stop the system when the section has one, and SHALL state for each command either its recorded result or why it was not run.

#### Scenario: Fast check over budget
- **WHEN** the fast check takes 40 seconds against a 10-second budget
- **THEN** the hand back records the measured time as a deviation and does not weaken any check to meet the budget

#### Scenario: Start command leaves a process
- **WHEN** the stop recipe returns but the port is still in use
- **THEN** the verification is recorded as failed and the recipe is fixed before the hand back

#### Scenario: Long full check
- **WHEN** the section states the full check takes an hour and the user has not agreed to run it
- **THEN** the agent does not run it and says so in the hand back

### Requirement: Audit reports disagreements with evidence
In audit mode the agent SHALL report each disagreement between the section and the project with a severity of `high`, `medium`, or `low`, evidence as a path and line or a command and its output, the sentence of the section it contradicts, and whether to fix the artifact or amend the design.

#### Scenario: No section to compare with
- **WHEN** audit mode runs on a repository with a test suite but no `HARNESS.md`
- **THEN** the project is compared with the defaults for its Context and every finding is marked "no design to compare with"

#### Scenario: Documented command is gone
- **WHEN** the knowledge file tells agents to run `just test-fast` and no such recipe exists
- **THEN** a finding cites the knowledge file line and the recipe list and proposes fixing the artifact

#### Scenario: Design thinner than its Context
- **WHEN** the Context says agents run unattended on a web application and the section gives no way to look at a page
- **THEN** a finding states that the agent cannot tell a working page from a broken one and proposes amending the design

#### Scenario: Reviewer that can write
- **WHEN** the project's reviewer subagent is configured with tools that edit files
- **THEN** the finding's severity is `high`

### Requirement: Routes are added or owed
The agent SHALL put the fast, full, and scoped commands and the route to its knowledge file into the entrypoint only when the entrypoint exists and stays within its budget, and otherwise SHALL hand them back as a route owed, naming the situation, the file, and the command lines.

#### Scenario: No entrypoint yet
- **WHEN** build mode deposits the verification knowledge file in a repository with no agent entrypoint
- **THEN** no entrypoint is created and the hand back lists a route owed with the load condition, the file path, and the three command lines

### Requirement: Outcomes
Given a repository and a Feedback section, the agent SHALL leave results an independent reader can judge against the section without opening the skill.

#### Scenario: Build for a Python API
- **WHEN** build mode receives a section naming `just check-fast` at 10 seconds, `just check`, a scoped pytest command, a start recipe on port 8000 with a health probe, a smoke request, and evidence in the pull request text
- **THEN** the repository gains those recipes, each non-interactive and quiet on success; a knowledge file stating the commands, their durations, how to start, inspect, and stop the service, and what a human verifies; the three commands and one route in the agent entrypoint's routing table; and a hand back recording the measured duration of the fast check, the output of a deliberately failing test, and a clean stop; no hook or CI file is added and no delivered file names the plugin

#### Scenario: Design for a mobile application
- **WHEN** design mode receives a mobile application whose environment has no simulator and a Context of moderate cost and attended agents
- **THEN** the returned section names the fast, full, and scoped commands, states that the running application cannot be driven by the agent here, lists what a human verifies with the manual steps, and reports the missing simulator as a question for the Environment layer

#### Scenario: Audit of flaky tests
- **WHEN** audit mode finds tests that call an external API and fail on a second run
- **THEN** the findings name the tests, show both runs, cite the section's sentence on deterministic tests, and propose fixing the artifact; no file is changed
