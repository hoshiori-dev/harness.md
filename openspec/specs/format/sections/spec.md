# HARNESS.md Sections

## Purpose
The section skeleton of a `HARNESS.md` body: which sections the format
defines, which are required, their order, what question each answers, and how
a validator recognises them. The prose under a heading is free and is never
validated. Non-goals: prescribing the content, length, or language of a
section; limiting additional sections; writing guidance.

## Requirements

### Requirement: Defined sections and their order
The format SHALL define fourteen sections in this order: Overview, Context,
Invariants, Style, File Structure, Environment, Knowledge, Feedback, Gates,
Authority, Completion, Entropy, Open Questions, References. Sections the
format does not define SHALL be allowed anywhere in the body and SHALL NOT be
reported.

#### Scenario: Extra section between defined ones
- **WHEN** a file has `## How to use this file` between Overview and Context
- **THEN** a validator reports nothing about it

#### Scenario: Defined sections out of order
- **WHEN** Knowledge appears before Environment
- **THEN** a validator reports a warning and no error

### Requirement: Required sections
Overview, Context, Environment, Knowledge, Feedback, Gates, and Authority
SHALL be present. Invariants, Style, File Structure, Completion, Entropy, Open
Questions, and References are optional, and the absence of an optional section
SHALL mean that the item is omitted from the design.

#### Scenario: Required section missing
- **WHEN** a file has no Feedback section
- **THEN** a validator reports an error naming Feedback

#### Scenario: Optional section absent
- **WHEN** a file has no Entropy section
- **THEN** a validator reports nothing

#### Scenario: A layer the project does nothing in
- **WHEN** a project decides to have no checks before commits or in CI
- **THEN** the Gates section is still present and states that decision and its reason

### Requirement: Recognising a section
A defined section SHALL be a second-level ATX heading whose text is exactly
the English name. A heading in other words, in another letter case, at another
level, or inside a fenced code block SHALL NOT be recognised as that section.
The body's prose MAY be in any language and the first-level heading is free.

#### Scenario: Translated heading
- **WHEN** a file written in Chinese uses `## 概述` in place of `## Overview`
- **THEN** a validator reports Overview as missing

#### Scenario: Heading inside a code fence
- **WHEN** `## Gates` appears only inside a fenced code block
- **THEN** it is not counted as the Gates section

#### Scenario: Closing hashes
- **WHEN** a heading is written `## Overview ##`
- **THEN** it is recognised as the Overview section

### Requirement: No repeated defined section
A defined section SHALL appear at most once.

#### Scenario: Section written twice
- **WHEN** a file has two `## Authority` headings
- **THEN** a validator reports an error at the second

### Requirement: Questions of the framing sections
The sections before the layers SHALL each answer one question: Overview, who
the harness serves, what it achieves, what it does not police, and what stays
with a human; Context, the given conditions the design must fit; Invariants,
the cross-layer rules every task follows; Style, the shape the code itself
takes so agents can work in it; File Structure, the directory layout the
design requires.

#### Scenario: Hosting platform
- **WHEN** a project is hosted on GitHub
- **THEN** that fact is stated under Context as a given condition, together with the clients and models the harness targets

#### Scenario: Formatting rules
- **WHEN** a design wants a formatter's defaults applied
- **THEN** Style names the tool and the concrete rules stay in the tool's configuration

### Requirement: Questions of the layer sections
The seven layer sections SHALL each answer one question. Environment: where
the agent runs, the tools it holds, and what it can reach. Knowledge: how it
learns the project and what it reads when. Feedback: what it can run and
observe to verify its own work. Gates: which deterministic checks stop
defects. Authority: what it may do directly and what needs a human.
Completion: how the goal is agreed and what counts as done. Entropy: how the
harness stays consistent with the code.

#### Scenario: Tools
- **WHEN** a design gives agents an MCP server and a platform CLI
- **THEN** which tools exist and what they can reach is described under Environment, and which actions they may be used for under Authority

#### Scenario: Version-control workflow
- **WHEN** a design settles how agents commit, branch, merge, and release
- **THEN** it is described under Authority, not in a section of its own

### Requirement: Questions of the closing sections
Open Questions SHALL hold what is undecided, and References SHALL list the
outside material the design drew on. Material an agent reads while working
SHALL be described under Knowledge, not References.

#### Scenario: Material the agent reads versus material the author used
- **WHEN** a source is something an agent should consult while working
- **THEN** it is described under Knowledge; a source that only informed the design is listed under References

### Requirement: No writing guidance in the format
The format SHALL define the sections and their questions only; guidance on
writing a section well enough to build from SHALL live in tools and skills,
not in the specification, and the specification SHALL contain no filled-in
example file.

#### Scenario: Reader looks for an example
- **WHEN** the prose specification is read end to end
- **THEN** it contains no worked example of a complete `HARNESS.md`
