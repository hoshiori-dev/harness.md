# Harness Architecture Skill

## Purpose

Governs what an agent that loaded `harness-architecture`, the methodology
manual, observably does when it answers a question about agent harnesses:
why a layer exists, where a rule or fact belongs, which source wins, how
much a layer should do for a given project, and how several agents share a
repository. The skill is model-invoked and ships to Claude Code, Codex,
and Antigravity.

Non-goals: creating, moving, splitting, or auditing harness files (the
user-invoked workflows and the layer builders); writing or validating a
`HARNESS.md`; application code; documentation for human readers.

## Requirements

### Requirement: Triggering
The skill SHALL load for questions about how an agent harness should be
shaped and why, and SHALL NOT load for requests to build or restructure
harness files, for application work, or for questions about the
`HARNESS.md` file format.

#### Scenario: Agents ignore the entrypoint
- **WHEN** the user asks "Why does Claude keep ignoring half of what's in our AGENTS.md?"
- **THEN** the skill loads

#### Scenario: Where a rule belongs
- **WHEN** the user asks "Should our release steps go in AGENTS.md, a doc, or a skill?"
- **THEN** the skill loads

#### Scenario: Whether a layer is needed
- **WHEN** the user asks "It's a two-week prototype. Do we really need CI and a sandbox for the agent?"
- **THEN** the skill loads

#### Scenario: Parallel agents
- **WHEN** the user asks "How should three agents work on this repo at the same time without stepping on each other?"
- **THEN** the skill loads

#### Scenario: Build request
- **WHEN** the user says "Split our AGENTS.md into knowledge files"
- **THEN** the skill does not load as the owner of the work; if loaded it hands off without creating files

#### Scenario: Application bug
- **WHEN** the user says "The login test is flaky, find out why"
- **THEN** the skill does not load

#### Scenario: File format question
- **WHEN** the user asks "Which frontmatter keys may a HARNESS.md have?"
- **THEN** the skill does not load

### Requirement: Outcomes
The agent SHALL answer from the method with the reason for each rule,
SHALL trace every trade-off to the project's Context and never to a
project label, SHALL give exactly one recommendation per decision, and
SHALL change no file.

#### Scenario: Placement of a commit rule
- **WHEN** asked whether the rule "never commit secrets" can live in a subdirectory entrypoint
- **THEN** the answer places it in the always-on block of the root entrypoint and as a secret-scan check, explains that a subdirectory file may never load, and creates no file

#### Scenario: Amount for a prototype
- **WHEN** asked what a prototype discarded within a quarter needs
- **THEN** the answer names the conditions it depends on, asks for the cost of a wrong change if unknown, and gives one default per affected layer instead of a setting for the whole project

#### Scenario: Two copies of a fact
- **WHEN** the test command appears with different flags in the entrypoint and a knowledge file
- **THEN** the answer names the task-runner recipe as the source, says both documents should name only the recipe, and edits neither

#### Scenario: Design and artifact disagree
- **WHEN** asked which is right when `HARNESS.md` and a permission file disagree about pushing
- **THEN** the answer says intent comes from `HARNESS.md` and facts from the code, so the artifact is fixed or the design is changed first

#### Scenario: Label offered as a reason
- **WHEN** the user says "it's only research code, so no checks"
- **THEN** the answer asks what a wrong change to the data pipeline costs before agreeing

#### Scenario: Evidence requested
- **WHEN** the user asks what the claim "long context files do not help" is based on
- **THEN** the answer cites only sources the skill carries and says so when it has none for a point

### Requirement: Hand-off instead of building
When a question turns into a request to create, change, or audit harness
files, the agent SHALL name the layer and the `HARNESS.md` section that
own the work and the kind of workflow to start, SHALL state that a design
is approved before files are written, and SHALL create nothing.

#### Scenario: Question becomes a build
- **WHEN** after a placement answer the user says "OK, set that up"
- **THEN** the agent names the owning layer and the workflow to invoke, and no file in the project changes

#### Scenario: Concurrency without the facts
- **WHEN** asked to design parallel work and the clients in use and the merge owner are unknown
- **THEN** the agent asks for both before recommending, and builds nothing
