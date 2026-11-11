# completion-building Specification

## Purpose

Governs what an agent that loaded `completion-building` observably does with the Completion layer of a target project's harness: how the project agrees a goal before work starts and decides a task is done (the specification tool, how long a spec lives, the two approvals and how they are recorded, what every spec answers, the checks run while working, and where handoff notes go). The skill works in four modes (design, extract, build, audit) around the optional Completion section of the project's `HARNESS.md`. It ships to Claude Code, Codex, and Antigravity. Non-goals: writing one specification; deciding whether a project practises spec-driven development; initialising, installing, or running a specification tool or its automation (the skill for that tool); check and test recipes (the Feedback and Gates layers); labels, request templates, and merge rules (the Authority layer); the harness self-check (the Entropy layer).

## Requirements

### Requirement: Triggering
The skill SHALL load, from a description match, when a harness workflow hands over the Completion layer or when a project's way of agreeing goals and judging work done is being designed, described, built, or audited, and SHALL NOT load for writing one spec, for the question whether to adopt spec-driven development, for a spec tool's own commands, or for product checks.

#### Scenario: Workflow hands over the layer for design
- **WHEN** a workflow says "Completion layer, design mode: the project is a library maintained for years by three committers on GitHub; return the section"
- **THEN** the skill loads

#### Scenario: Definition of done requested
- **WHEN** the user says "agents keep stopping at 'tests pass' or never stop; settle how this repo agrees a goal before work and what counts as done, and put it where agents will read it"
- **THEN** the skill loads

#### Scenario: Audit against the design
- **WHEN** the user says "check whether how we approve specs still matches what the Completion section of our HARNESS.md says"
- **THEN** the skill loads

#### Scenario: Extraction of an existing setup
- **WHEN** a workflow says "extract mode: describe how this repository aligns on a goal and decides a task is finished, as the Completion section"
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

### Requirement: Behavior: The mode decides what is written
The agent SHALL work in the mode the handover names or the request implies. In design and extract mode it SHALL return the text of the Completion section and write no file; in audit mode it SHALL return findings and write no file; only in build mode SHALL it change files in the project.

#### Scenario: Design mode
- **WHEN** a workflow hands over the layer in design mode
- **THEN** the agent returns the section text, the defaults it applied, and the questions no default answers, and `git status` in the project shows no change

#### Scenario: Audit mode
- **WHEN** a workflow hands over the layer in audit mode
- **THEN** the agent returns findings, each with a severity of high, medium, or low, evidence as a path and line, the sentence of the section concerned, and whether to fix the artifact or amend the design, and no file changes

### Requirement: Behavior: An absent section means the layer is omitted
When the project's `HARNESS.md` has no Completion section, the agent in build or audit mode SHALL report that the design omits the layer and SHALL write nothing. In audit mode it SHALL add one finding when the project nevertheless runs a specification tool or keeps a specification contract.

#### Scenario: Build with no section
- **WHEN** build mode runs on a design without a Completion section
- **THEN** the agent reports "omitted by the design", creates no contract, adds no entrypoint line, and hands back

#### Scenario: Audit with no section but a tool in use
- **WHEN** audit mode runs on a design without a Completion section and the repository holds `openspec/` with active changes
- **THEN** the agent reports the layer as omitted and one finding that the design does not describe the tool in use, with amending the design as the suggested fix

### Requirement: Behavior: Inventory before anything else
In every mode the agent SHALL first run the bundled read-only inventory script against the project, or perform the same inventory by hand when no Python runtime exists and record that, and SHALL read the entrypoint and knowledge files for sentences that state behaviour or restate approval rules. It SHALL ask the user for nothing the handover or the inventory settles.

#### Scenario: Tool already present
- **WHEN** the inventory finds `.specify/` with numbered feature directories
- **THEN** the section names Spec-Kit as the tool in use and no question about the tool is asked

#### Scenario: Context carried by the handover
- **WHEN** the handover states the maintenance horizon, the team, and that agents run unattended at night
- **THEN** the agent derives its defaults from those facts and asks none of them again

#### Scenario: No Python runtime
- **WHEN** neither `uv` nor `python3` exists in the environment
- **THEN** the agent inspects the same places by reading the tree and its hand back records "inventory by hand"

### Requirement: Behavior: Design applies one default per decision
In design mode the agent SHALL settle every decision of the layer with one default selected by the project's Context and state the selecting fact: whether the section exists, how long a spec lives, the tool, the two approvals and their owners, how approval is recorded, which changes carry no spec, what every spec answers, the checks while working, and the handoff location. It SHALL NOT interview the user decision by decision.

#### Scenario: Long-lived team library with existing code
- **WHEN** Context says the library is maintained for years by several committers and the repository holds code and no spec tool
- **THEN** the section says specs stay the living description, names OpenSpec with "existing code" as the reason, and records approval on the pull request with a label and a merge-blocking check

#### Scenario: Solo maintainer with a small repository
- **WHEN** Context says one maintainer reviews every task in the conversation and the repository is small
- **THEN** the section names per-change `SPEC.md`/`PLAN.md` with plan mode for one-file changes and approval given in the conversation

#### Scenario: Disposable prototype
- **WHEN** Context says the project will be thrown away within a quarter, one person attends every task, and a wrong change is cheap
- **THEN** the agent recommends omitting the section and says that plan mode aligns the goal and the Feedback and Gates checks define done

#### Scenario: Spec contradicts code during design
- **WHEN** the inventory finds a spec requiring behaviour the code no longer has
- **THEN** the agent hands back the contradiction as a question with the three options and one recommendation, and puts no ruling on it into the defaults

### Requirement: Behavior: The section stands on its own
The section the agent returns SHALL be plain prose that a reader without this plugin could set the project up from: it names the tool and where its files live, who approves the spec and the finished work and where each approval is recorded, when the task list may be written, who freezes the record, the four answers and four rules every spec carries, and the check commands by name, with the reason beside each choice and none of the skill's own terms.

#### Scenario: Clean-context reader
- **WHEN** a reader who has never seen the skill reads only the returned section and is asked what a new spec must contain and who approves it
- **THEN** the reader names the four answers, the four rules with the failure-path rule as one scenario per spec, and both approval owners

#### Scenario: Extract marks inference
- **WHEN** extract mode finds no label, check, or written rule showing how specs are approved
- **THEN** the section says approval appears to be given in conversation and marks that as inferred

### Requirement: Behavior: Build deposits the contract the section describes
In build mode the agent SHALL deposit a specification-workflow knowledge file that states what the section decided in the project's own words, SHALL point the entrypoint at it with a read condition, SHALL add the handoff directory to `.gitignore` when the section names one in the repository, and SHALL fill every existing `<!-- harness: spec-workflow -->` marker block. It SHALL decide nothing the section already decides.

#### Scenario: Section silent on the handoff location
- **WHEN** the section does not say where handoff notes go
- **THEN** the agent uses `.agents/handoff/`, gitignores it, and reports that default as an assumption

#### Scenario: Marker filled twice
- **WHEN** build mode runs a second time on an unchanged section and contract
- **THEN** the marker files show no diff

#### Scenario: Entrypoint missing or at its budget
- **WHEN** the project has no entrypoint yet, or one more routing row would break its line budget
- **THEN** the agent deposits the contract, leaves the entrypoint unchanged, and hands back a route owed naming the read condition and the contract's path

#### Scenario: Check command that does not run
- **WHEN** the scoped check the section names fails when run once on one file
- **THEN** the contract does not record it and the gap is handed back for the layer that owns Feedback or as a pending decision

#### Scenario: Vocabulary leak
- **WHEN** the deposited contract is checked after writing
- **THEN** it contains no spec-tool command, no path inside a skill directory, no unresolved placeholder, and no term only the plugin defines

### Requirement: Behavior: The tool itself is handed off
The agent SHALL NOT initialise, install, configure, or run the specification tool and SHALL print no install command. It SHALL hand adoption, layout, and automation to the skill for the chosen tool, described by what that skill owns. For a framework that is none of OpenSpec, Spec-Kit, or per-change documents it SHALL record the implementer as the person who closes every approval and list the automation as remaining work.

#### Scenario: OpenSpec named by the section
- **WHEN** the section names OpenSpec and the repository has no `openspec/` directory
- **THEN** the agent deposits the contract, runs no initialiser, and its hand back describes the handoff by role with no command

#### Scenario: Unsupported framework kept
- **WHEN** the project keeps Kiro specs
- **THEN** the contract names the implementer as closing every approval, and the hand back lists the framework's automation as remaining work and hands off nothing

### Requirement: Behavior: Audit compares the section with the project
In audit mode the agent SHALL compare each sentence of the section with the contract, the tool's files, the marker blocks, the check commands, and recent requests, and SHALL also report documents that restate requirements, specs that contradict the code, and a section too thick or too thin for the Context. For a spec that contradicts the code it SHALL state both readings and leave the ruling to the user.

#### Scenario: Recorded approval designed, none in place
- **WHEN** the section says approval is recorded by a label and the repository has no such label, workflow, or check
- **THEN** a finding cites the sentence and the missing artifacts and suggests fixing the artifacts

#### Scenario: Requirements restated in the entrypoint
- **WHEN** `AGENTS.md` lists acceptance criteria that also live in a spec
- **THEN** a finding cites the lines and suggests replacing them with a pointer to the spec

### Requirement: Outcomes
Given a project and a handover, the agent SHALL leave every decision traceable to the section, the Context, or an observed fact, and SHALL leave the project able to answer from its own files how a goal is agreed and when work is done.

#### Scenario: Build on a team library hosted on GitHub
- **WHEN** build mode runs with a section naming OpenSpec, living specs, approval recorded by `spec:approved`, and `just test-file` and `just check` as the two checks
- **THEN** the project gains a specification-workflow knowledge file stating those facts, an entrypoint line pointing at it with a read condition, `.agents/handoff/` in `.gitignore`, and filled marker blocks where markers existed; no tool is installed; and a clean-context reader given only the project files answers who approves, when tasks are written, who freezes the record, and whether a CI change needs a spec

#### Scenario: Design for a solo script collection
- **WHEN** design mode runs for a single maintainer with a small repository and no spec tool
- **THEN** the returned section names per-change documents and plan mode, approval in the conversation, the five headings every per-change document carries, and each applied default with the Context fact behind it, and no file in the project changed

#### Scenario: Audit of a drifted setup
- **WHEN** audit mode runs on a project whose section says Spec-Kit with conversational approval while the repository holds specs contradicting the code and an issue template restating acceptance criteria
- **THEN** the findings list each contradiction with both sources, the restating template, and for each whether to fix the artifact or amend the design, and no file changed

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
