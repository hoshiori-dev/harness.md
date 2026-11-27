# Spec Delta

## Purpose

Governs what an agent that loaded `harness-distill` observably does when
it writes all or part of the current project's agent harness as one or
several `HARNESS.md` files: a description of the harness as it is, or a
portable design with the project's specifics removed. It covers scope,
what it reads, how it marks inference, where it writes, and when it
writes into the root. The skill is user-invoked and ships to Claude Code,
Codex, and Antigravity.

Non-goals: changing or judging the harness (`harness-improve`); building
one (`harness-create`); reading a project other than the current one
(`harness-adopt`); publishing the result anywhere.

## ADDED Requirements

### Requirement: Triggering
The skill SHALL load only when the user invokes it by name and SHALL NOT
load from a description match, however closely a request resembles its
work.

#### Scenario: Invoked by name with no argument
- **WHEN** the user runs the skill by name in a repository with an `AGENTS.md`, hooks, and CI
- **THEN** the skill loads and plans a description of the whole harness

#### Scenario: Invoked by name for one aspect
- **WHEN** the user runs the skill by name adding "only how we gate changes and what agents may do alone"
- **THEN** the skill loads and plans a file that covers those two aspects and says so

#### Scenario: Invoked by name asking for a shareable design
- **WHEN** the user runs the skill by name adding "something another team could start from"
- **THEN** the skill loads and plans a portable design

#### Scenario: Documentation request without invocation
- **WHEN** the user types "document how our agent setup works" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Format question without invocation
- **WHEN** the user asks "which sections does a HARNESS.md usually have?" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Review request without invocation
- **WHEN** the user asks "what is wrong with our AGENTS.md?" without invoking the skill
- **THEN** the skill does not load

### Requirement: Scope is settled before reading
The agent SHALL settle in rounds: whether the result covers the whole
harness or named parts; whether it is one file or several and what each
covers; whether it describes the harness as it is or is a portable
design; and where it is written. What the invocation states SHALL be
taken as decided and shown, not asked.

#### Scenario: Scope stated in the invocation
- **WHEN** the invocation asks for the Gates and Authority aspects as one portable file
- **THEN** the round shows those three points as decided and asks only what remains open

#### Scenario: Several files
- **WHEN** the user asks for one file per aspect of three aspects
- **THEN** three files are written, and each one's description and introduction say what it covers and what it leaves out

### Requirement: Output location
The agent SHALL write to the path the user names. With no path it SHALL
write to a temporary file, in the client's own temporary location when
the client offers one and the system's otherwise, and SHALL report the
full path. It SHALL write `HARNESS.md` into the project root only when
the user asked for an anchor document, after showing the draft and
receiving approval, and SHALL NOT overwrite a file there without the
user's decision on that file.

#### Scenario: No path given
- **WHEN** the user names no output location
- **THEN** the file is written outside the repository's tracked tree in a temporary location, and the closing message gives its complete path

#### Scenario: Anchor document requested
- **WHEN** the user says the result is to be the project's anchor document
- **THEN** the draft is shown, written to the root after approval, validated, and the agent says that the entrypoint has to name the file for it to count as adopted, without editing the entrypoint

#### Scenario: Root file already present
- **WHEN** the root already holds a `HARNESS.md` and the user asked for an anchor document
- **THEN** the agent shows how the new draft differs and asks whether to replace it, write beside it, or stop

### Requirement: A write inside the project waits for a go-ahead
The agent SHALL write a file inside the project only after the user's
go-ahead on the files listed by path, including when the remaining
decisions were left to the agent, and SHALL replace an existing file at
a named path only by the user's decision on that file.

#### Scenario: Named path inside the project
- **WHEN** the user named `docs/HARNESS.md` as the path, left the remaining decisions to the agent, and no file exists there
- **THEN** the agent lists the file by path as new and writes it only after the user's go-ahead

#### Scenario: File already at the named path
- **WHEN** the user named `docs/HARNESS.md` as the path and a file already exists there
- **THEN** the agent shows how the draft differs and asks whether to replace it, write beside it, or stop, and the existing file is unchanged until the user answers

### Requirement: The description states what exists
The agent SHALL describe the harness as it is, including its defects,
SHALL NOT repair or improve anything in the description, and SHALL obtain
each covered layer's text from the installed skill that claims the layer.
Every sentence of a layer's text SHALL trace to an artifact it found.

#### Scenario: Stale command in the entrypoint
- **WHEN** the entrypoint names a test command the task runner does not define
- **THEN** the description records both facts and lists the contradiction among the open questions, without choosing a corrected command

#### Scenario: Covered layer with nothing found
- **WHEN** the whole harness is described and no permission file, policy, or platform configuration is found
- **THEN** the text on authority says nothing was found and what was looked for, worded as an observation and not as the project's decision

#### Scenario: No builder installed for a layer
- **WHEN** no installed skill claims the Knowledge layer
- **THEN** the agent writes that part from its own inventory and reports the gap

### Requirement: Inference is marked
The agent SHALL distinguish stated intent from inference: a reason the
repository states is cited with its location, a reason the agent supplies
is marked as inferred with its evidence, and a decision with no visible
reason says the reason is not recorded. Conditions the repository cannot
show SHALL be asked in a round, not guessed.

#### Scenario: Reason found in a commit message
- **WHEN** a commit message explains why the full test suite was moved out of the pre-commit hook
- **THEN** the text on gates gives that reason and where it was found

#### Scenario: Reason not visible
- **WHEN** a deny list forbids a command and nothing says why
- **THEN** the rule is recorded with "reason not recorded" or with an inference marked as inferred

### Requirement: A portable design carries decisions, not this project
A portable design SHALL state each decision with its reason and the
premise it rests on, SHALL restate the project's facts as the kind of
project the design suits, SHALL give file names, commands, and tools as
examples of a decision, SHALL contain no project, person, or host name
and no secret, and SHALL leave no sentence marked as inferred: an
inference is confirmed by the user, restated as a premise, or left out.

#### Scenario: Project-specific path
- **WHEN** the harness keeps its knowledge files under a directory named after the product
- **THEN** the portable design says agents read task-specific documents from one directory the entrypoint routes to, and gives a neutral path as an example

#### Scenario: Defect in the source harness
- **WHEN** the described harness contains a contradiction
- **THEN** the portable design does not carry it, and the closing message lists what was left out

#### Scenario: Secret in a harness file
- **WHEN** a client settings file contains a token
- **THEN** no output contains the value; the description says a credential is present in that file

### Requirement: Validated and presented
The agent SHALL validate each file with the format validator, or by
reading the format rules when the validator cannot run and saying so,
fix every error, and close by stating for each file its path, what it
covers, what is inferred, and what was not found. It SHALL commit nothing
unless asked.

#### Scenario: Validator unavailable
- **WHEN** the validator script cannot run
- **THEN** the agent checks the format by reading and says plainly that the validator did not run

### Requirement: Outcomes
Given a project and an invocation, the agent SHALL leave a result a
reader can judge without seeing the skill.

#### Scenario: Whole harness, as it is
- **WHEN** the skill runs with no argument in a repository with an entrypoint, three knowledge files, a pre-commit configuration, CI, and a client permission file, and the user accepts the shown defaults
- **THEN** one file exists in a temporary location, passes validation, covers context and each layer with something found or an explicit "nothing found", marks every inference, lists the contradictions it met, and `git status` in the repository shows no change; the result fails if a `HARNESS.md` appears in the root, if a defect was silently corrected, or if the path is not reported in full

#### Scenario: One aspect, portable
- **WHEN** the skill runs with "only our permission and push rules, as something others can reuse"
- **THEN** one file covers that aspect alone, its description and introduction say so, every decision has a reason and a premise, no repository, person, or host name appears, and the closing message lists the project specifics that were generalised
