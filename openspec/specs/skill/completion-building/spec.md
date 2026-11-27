# completion-building Specification

## Purpose

Governs what an agent that loaded `completion-building` observably does with the Completion layer of a target project's harness: how the project agrees a goal before work starts and decides a task is done (the specification tool, how long a spec lives, the two approvals and how they are recorded, what every spec answers, the checks run while working, and where handoff notes go). The skill works in four modes (design, extract, build, audit) around the optional Completion section of the project's `HARNESS.md`. It ships to Claude Code, Codex, and Antigravity. Non-goals: writing one specification; deciding whether a project practises spec-driven development; initialising, installing, or running a specification tool or its automation (the skill for that tool); check and test recipes (the Feedback and Gates layers); labels, request templates, and merge rules (the Authority layer); the harness self-check (the Entropy layer).

## Requirements

### Requirement: Triggering
The skill SHALL load, from a description match, when a harness entry hands over the Completion layer or when a project's way of agreeing goals and judging work done is being decided, described, built, or audited, and SHALL NOT load for writing one spec, for the question whether to adopt spec-driven development, for a spec tool's own commands, or for product checks.

#### Scenario: Workflow hands over the layer for design
- **WHEN** a harness entry says "Completion layer, decide mode: the project is a library maintained for years by three committers on GitHub; return the thickness you recommend and the layer's decisions"
- **THEN** the skill loads

#### Scenario: Definition of done requested
- **WHEN** the user says "agents keep stopping at 'tests pass' or never stop; settle how this repo agrees a goal before work and what counts as done, and put it where agents will read it"
- **THEN** the skill loads

#### Scenario: Audit against the design
- **WHEN** the user says "check whether how we approve specs still matches what the Completion section of our HARNESS.md says"
- **THEN** the skill loads

#### Scenario: Extraction of an existing setup
- **WHEN** a harness entry says "describe mode: describe how this repository aligns on a goal and decides a task is finished, as prose fit for a HARNESS.md"
- **THEN** the skill loads

#### Scenario: Writing one specification
- **WHEN** the user says "write the spec for the export endpoint before we implement it"
- **THEN** the skill does not load

#### Scenario: Adoption question
- **WHEN** the user says "is spec-driven development worth it for a two-week prototype?"
- **THEN** the skill does not load

#### Scenario: Tool command request
- **WHEN** the user says "archive the finished OpenSpec change and add the spec status labels to the repository"
- **THEN** the skill does not load

#### Scenario: Product check request
- **WHEN** the user says "add a type check to CI so broken TypeScript stops landing"
- **THEN** the skill does not load

### Requirement: Behavior: Inventory before anything else
In every mode the agent SHALL first run the bundled read-only inventory script against the project, or perform the same inventory by hand when no Python runtime exists and record that, and SHALL read the entrypoint and knowledge files for sentences that state behaviour or restate approval rules. It SHALL ask the user for nothing the handover or the inventory settles.

#### Scenario: Tool already present
- **WHEN** the inventory finds `.specify/` with numbered feature directories
- **THEN** the tool is returned as settled, Spec-Kit, with the directory as its evidence, and no question about the tool is asked

#### Scenario: Context carried by the handover
- **WHEN** the handover's conditions state the maintenance horizon, the team, and that agents run unattended at night
- **THEN** the agent derives its recommendations from those facts and asks none of them again

#### Scenario: No Python runtime
- **WHEN** neither `uv` nor `python3` exists in the environment
- **THEN** the agent inspects the same places by reading the tree and its hand back records "inventory by hand"

### Requirement: Outcomes
Given a project and a handover, the agent SHALL leave every decision traceable to an agreed decision, the project's conditions, or an observed fact, and SHALL leave the project able to answer from its own files how a goal is agreed and when work is done.

#### Scenario: Build on a team library hosted on GitHub
- **WHEN** build mode runs with agreed decisions naming OpenSpec, living specs, approval recorded by `spec:approved`, and `just test-file` and `just check` as the two checks
- **THEN** the project gains a specification-workflow knowledge file stating those facts, an entrypoint line pointing at it with a read condition, `.agents/handoff/` in `.gitignore`, and filled marker blocks where markers existed; no tool is installed; no file the plan does not list was written; and a clean-context reader given only the project files answers who approves, when tasks are written, who freezes the record, and whether a CI change needs a spec

#### Scenario: Design for a solo script collection
- **WHEN** decide mode runs for a single maintainer with a small repository and no spec tool
- **THEN** the hand back recommends a thickness with its reasons and returns per-change documents and plan mode, approval in the conversation, and the five headings every per-change document carries, each settled or recommended with the condition or fact behind it; the result fails if it asks the user anything the handover or the repository shows, leaves a decision of the layer neither settled nor open, or changes a file

#### Scenario: Audit of a drifted setup
- **WHEN** audit mode runs on a project whose adopted anchor document says Spec-Kit with conversational approval while the repository holds specs contradicting the code and an issue template restating acceptance criteria
- **THEN** the findings list each contradiction with both sources and the restating template, each with a class, a severity, evidence, the source of truth, and a proposed disposition, and no file changed

### Requirement: Script: detect_spec_tooling.py
The bundled script SHALL be a read-only inventory of a checkout: `--root <dir>` (default `.`), `--max-candidates <n>` (default 40), `--full`, and `--help` with an example. Stdout SHALL be one JSON object listing the spec tools found, whether a `HARNESS.md` exists, entrypoint lines pointing at spec artifacts, and requirement-restating documents outside tool directories and skill trees; a summary goes to stderr; exit codes are 0, 1 (partial or failed inspection), and 2 (bad arguments).

#### Scenario: Repository with OpenSpec
- **WHEN** the script runs with `--root` on a checkout holding `openspec/specs` and `openspec/changes`
- **THEN** stdout JSON lists a tool entry for OpenSpec with its spec and change counts and owned paths, and the exit code is 0

#### Scenario: Design document present
- **WHEN** the checkout holds a root `HARNESS.md` full of requirement words
- **THEN** the JSON reports it as the design document and does not list it among the requirement-restating candidates

#### Scenario: Bad root
- **WHEN** `--root` names a path that is not a directory
- **THEN** stderr says what is wrong and how to fix it, nothing is written to stdout, and the exit code is 2

#### Scenario: Unreadable subdirectory
- **WHEN** a directory under `--root` cannot be read
- **THEN** stderr names that path, any JSON on stdout is marked partial, and the exit code is 1

#### Scenario: Repeated run
- **WHEN** the script runs twice on an unchanged checkout
- **THEN** both outputs are identical and the checkout holds no new file

### Requirement: Behavior: Only build mode writes
The agent SHALL work in the mode the handover names (decide, describe, build, audit) or the request implies. In decide mode it SHALL return a recommended thickness and the layer's decisions, in describe mode a description of what exists, and in audit mode findings; in these three it SHALL write no file. Only in build mode SHALL it change files in the project.

#### Scenario: Decide mode
- **WHEN** an entry hands over the layer in decide mode
- **THEN** the agent returns a recommended thickness with its reasons and the layer's decisions, each settled or open, and `git status` in the project shows no change

#### Scenario: Describe mode
- **WHEN** an entry hands over the layer in describe mode
- **THEN** the agent returns prose fit for a `HARNESS.md` that describes how the project agrees goals and judges work done today, and no file changes

#### Scenario: Audit mode
- **WHEN** an entry hands over the layer in audit mode
- **THEN** the agent returns findings, each with a class, a severity of high, medium, or low, evidence as a path and line, the source of truth, and a proposed disposition, and no file changes

#### Scenario: Direct request
- **WHEN** the user asks directly to settle how the repository agrees a goal and what counts as done, with no entry running
- **THEN** the agent shows what it decided on the evidence, asks the open decisions through the client's question tool where there is one, and writes files only after the user accepted what was shown

#### Scenario: Direct request in a project with an anchor document
- **WHEN** the same direct request changes what the project's adopted anchor `HARNESS.md` says about agreeing goals and judging work done
- **THEN** the accepted change is also written to that document in the same piece of work

#### Scenario: Direct request in a project without an anchor document
- **WHEN** the same direct request runs in a repository with no `HARNESS.md`
- **THEN** the work completes and the repository still has no `HARNESS.md`

### Requirement: Behavior: An omitted layer is not built
When the layer's agreed thickness is omitted, or the project's adopted anchor document covers the subject nowhere, the agent in build or audit mode SHALL report the layer as omitted and SHALL write nothing. In audit mode it SHALL add one finding when the project nevertheless runs a specification tool or keeps a specification contract.

#### Scenario: Build with the layer omitted
- **WHEN** build mode runs with a handover that gives the layer's thickness as omitted
- **THEN** the agent reports the layer as omitted by agreement, creates no contract, adds no entrypoint line, and hands back

#### Scenario: Audit with the layer omitted but a tool in use
- **WHEN** audit mode runs on a project whose adopted anchor document says nothing about agreeing goals or judging work done, and the repository holds `openspec/` with active changes
- **THEN** the agent reports the layer as omitted and one finding that the document does not describe the tool in use, with amending the document as the proposed disposition

### Requirement: Behavior: Decide returns the layer's decisions
In decide mode the agent SHALL return a recommended thickness with its reasons and each decision of the layer (how long a spec lives, the tool, the two approvals and their owners, how approval is recorded, which changes carry no spec, what every spec answers, the checks while working, the handoff location) as settled, with its evidence, or as open, with options, the recommended first, its reason, and what it depends on. Handed over by an entry it SHALL ask the user nothing.

#### Scenario: Long-lived team library with existing code
- **WHEN** the conditions say the library is maintained for years by several committers and the repository holds code and no spec tool
- **THEN** the hand back returns, each settled or as the recommended option with its reason, that specs stay the living description, OpenSpec with "existing code" as the reason, and approval recorded on the pull request with a label and a merge-blocking check

#### Scenario: Solo maintainer with a small repository
- **WHEN** the conditions say one maintainer reviews every task in the conversation and the repository is small
- **THEN** the hand back returns, each settled or as the recommended option with its reason, per-change `SPEC.md`/`PLAN.md` with plan mode for one-file changes and approval given in the conversation

#### Scenario: Disposable prototype
- **WHEN** the conditions say the project will be thrown away within a quarter, one person attends every task, and a wrong change is cheap
- **THEN** the agent recommends the thickness omitted and says that plan mode aligns the goal and the Feedback and Gates checks define done

#### Scenario: Spec contradicts code during decide
- **WHEN** the inventory finds a spec requiring behaviour the code no longer has
- **THEN** the hand back returns the contradiction as an open decision with the three options and one recommendation, and no settled decision rules on it

#### Scenario: Handed over by an entry
- **WHEN** an entry hands over the layer in decide mode and the repository does not show who approves finished work
- **THEN** the approval owner is returned as an open decision with its options, and the agent puts no question to the user

### Requirement: Behavior: The result stands on its own
The decisions the agent returns, and any description it writes, SHALL be plain enough that a reader without this plugin could set the project up from them: the tool and where its files live, who approves the spec and the finished work and where each approval is recorded, when the task list may be written, who freezes the record, the four answers and four rules every spec carries, and the check commands by name, with the reason beside each choice and none of the skill's own terms.

#### Scenario: Clean-context reader
- **WHEN** a reader who has never seen the skill reads only the returned decisions and is asked what a new spec must contain and who approves it
- **THEN** the reader names the four answers, the four rules with the failure-path rule as one scenario per spec, and both approval owners

#### Scenario: Describe marks inference
- **WHEN** describe mode finds no label, check, or written rule showing how specs are approved
- **THEN** the description says approval appears to be given in conversation and marks that as inferred

### Requirement: Behavior: Build deposits the contract the agreed decisions describe
In build mode the agent SHALL write only what the plan lists for the layer: a specification-workflow knowledge file stating the agreed decisions in the project's own words, an entrypoint pointer to it with a read condition, the handoff directory in `.gitignore` when one is agreed inside the repository, and every existing `<!-- harness: spec-workflow -->` marker block. It SHALL decide nothing already agreed and SHALL report each departure a fact forced as a deviation.

#### Scenario: Handoff location not agreed
- **WHEN** the agreed decisions do not say where handoff notes go
- **THEN** the agent uses `.agents/handoff/`, gitignores it, and reports that default as an assumption for the entry to put to the user

#### Scenario: Marker filled twice
- **WHEN** build mode runs a second time on unchanged decisions and an unchanged contract
- **THEN** the marker files show no diff

#### Scenario: Entrypoint missing or at its budget
- **WHEN** the project has no entrypoint yet, or one more routing row would break its line budget
- **THEN** the agent deposits the contract, leaves the entrypoint unchanged, and hands back a route owed naming the read condition and the contract's path

#### Scenario: Check command that does not run
- **WHEN** the scoped check the agreed decisions name fails when run once on one file
- **THEN** the contract does not record it and the gap is handed back as a deviation, for the layer that owns Feedback or as a pending decision

#### Scenario: Vocabulary leak
- **WHEN** the deposited contract is checked after writing
- **THEN** it contains no spec-tool command, no path inside a skill directory, no unresolved placeholder, and no term only the plugin defines

#### Scenario: Plan only
- **WHEN** a build handover asks for the plan only
- **THEN** the agent returns the files it would create, change, or delete, each by path with one line on its shape, and writes nothing

### Requirement: Behavior: The specification tool is handed off
The agent SHALL NOT initialise, install, configure, or run the specification tool and SHALL print no install command. It SHALL hand adoption, layout, and automation to the skill for the chosen tool, described by what that skill owns. For a framework that is none of OpenSpec, Spec-Kit, or per-change documents it SHALL record the implementer as the person who closes every approval and list the automation as remaining work.

#### Scenario: OpenSpec agreed as the tool
- **WHEN** the agreed decisions name OpenSpec and the repository has no `openspec/` directory
- **THEN** the agent deposits the contract, runs no initialiser, and its hand back describes the handoff by role with no command

#### Scenario: Unsupported framework kept
- **WHEN** the project keeps Kiro specs
- **THEN** the contract names the implementer as closing every approval, and the hand back lists the framework's automation as remaining work and hands off nothing

### Requirement: Behavior: Audit compares the project with its source of truth
In audit mode the agent SHALL compare the contract, the tool's files, the marker blocks, the check commands, and recent requests with the adopted anchor document's text for the layer, or without one with what the project's conditions call for. It SHALL also report documents that restate requirements, specs that contradict the code, and a layer too thick or too thin for the conditions. For a spec that contradicts the code it SHALL state both readings and leave the ruling to the user.

#### Scenario: Recorded approval designed, none in place
- **WHEN** the adopted anchor document says approval is recorded by a label and the repository has no such label, workflow, or check
- **THEN** a finding of class missing cites the sentence as the source of truth and the missing artifacts as evidence, and proposes fixing the artifacts

#### Scenario: Requirements restated in the entrypoint
- **WHEN** `AGENTS.md` lists acceptance criteria that also live in a spec
- **THEN** a finding of class duplicated cites the lines, names the spec as the source of truth, and proposes replacing the lines with a pointer to the spec

#### Scenario: No anchor document to compare with
- **WHEN** the handover asks for an audit of a project that has adopted no anchor document
- **THEN** the agent compares the project with what its conditions call for and marks each finding as having no recorded design to compare with

#### Scenario: Spec contradicting the code
- **WHEN** a spec requires behaviour the code no longer has
- **THEN** a finding of class contradictory states both readings, names no source of truth, and leaves the ruling to the user
