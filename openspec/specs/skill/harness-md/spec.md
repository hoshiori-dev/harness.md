# harness-md Skill

## Purpose
The format skill: it reads, writes, revises, and validates a `HARNESS.md`. It
carries a byte-identical copy of the specification (`spec/spec.md`), the
standard a section is written to, a skeleton to start a file from, and the
validator script. It ships to Claude Code, Codex, and Antigravity. Non-goals:
building the harness a file describes, designing a harness from scratch
through a conversation (the design workflow does that and uses this skill's
standard), judging whether a design is good, and comparing two files.

## Requirements

### Requirement: Triggering
The skill SHALL load when a `HARNESS.md` is the file at hand or about to be
created, or when the question is about the format, a section's content, or a
validator finding. It SHALL NOT load for work on entrypoints, knowledge files,
or the harness itself.

#### Scenario: File to be checked
- **WHEN** the user says "I downloaded a HARNESS.md from a hub, can you check it's well-formed before I use it?"
- **THEN** the skill loads

#### Scenario: Question about placement
- **WHEN** the user asks "in HARNESS.md, do the MCP servers we give the agent go under Environment or Authority?"
- **THEN** the skill loads

#### Scenario: Validator finding
- **WHEN** the user pastes `HARNESS.md:4: error[key-unknown]` and asks what to do
- **THEN** the skill loads

#### Scenario: Entrypoint work
- **WHEN** the user asks "our AGENTS.md is 300 lines, help me trim it"
- **THEN** the skill does not load

#### Scenario: Building from a file
- **WHEN** the user says "here is a HARNESS.md, set the project up accordingly"
- **THEN** the skill does not load as the main procedure; it says that the entry which gives a project its harness takes the file as a reference

#### Scenario: Another design format
- **WHEN** the user asks for help writing a DESIGN.md for a website's visual design
- **THEN** the skill does not load

### Requirement: Outcomes
Given a writing or revising task, the skill SHALL produce a file that passes
the validator and whose sections can be built from without another document.
Given a validation task, it SHALL run the validator, explain each finding, and
fix errors. It SHALL NOT present a validator pass as a review of the design.

#### Scenario: Repairing a malformed file
- **WHEN** the skill is given a file with `tags:` at the top level, a `## 背景` heading, no first-level heading, and no Feedback section
- **THEN** the result moves `tags` under `metadata`, restores the `## Context` heading while keeping the Chinese prose, adds a title, asks whether the file is meant to describe the whole harness before adding a Feedback section, and the validator exits 0 with no warning

#### Scenario: Writing one section
- **WHEN** the user asks for a Gates section for a described project
- **THEN** the section names each check, its tool, and where it runs, gives its time budget or lists the budget under Open Questions when the request gave none, gives reasons, and says what is deliberately not gated

#### Scenario: uv is not available
- **WHEN** the validator script cannot run because `uv` is missing
- **THEN** the skill checks the format rules by reading and says plainly that the validator did not run

#### Scenario: Metadata is left alone
- **WHEN** the skill revises a file whose `metadata` holds keys it does not know
- **THEN** `metadata` is unchanged in the result

### Requirement: The carried specification is the specification
The copy of the specification inside the skill SHALL be byte-identical to
`spec/spec.md`.

#### Scenario: Specification changes without the copy
- **WHEN** `spec/spec.md` is edited and the skill's copy is not
- **THEN** `just skills-check` fails naming both files

### Requirement: A file's use is not assumed
The skill SHALL NOT assume that a `HARNESS.md` belongs in a project root
or governs the project it is found in. It SHALL treat a file as the
project's anchor document only when the user says so or the project's
entrypoint names it, and SHALL treat any other file as a summary or a
reference.

#### Scenario: Asked where to save a new file
- **WHEN** the user asks the skill to write a `HARNESS.md` summarising their gates and names no location
- **THEN** the skill does not write it to the repository root by default; it asks, or uses a temporary location and reports the path

#### Scenario: Downloaded file in a working directory
- **WHEN** the user asks whether their permission file "violates" a `HARNESS.md` they downloaded yesterday
- **THEN** the skill says the file is a reference with no authority over the project unless the project adopted it, and compares the two as designs
