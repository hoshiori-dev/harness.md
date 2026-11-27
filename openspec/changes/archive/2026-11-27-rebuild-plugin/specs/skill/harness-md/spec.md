# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

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
