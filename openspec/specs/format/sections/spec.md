# HARNESS.md Sections

## Purpose
The Markdown body of a `HARNESS.md`: its title and introduction,
the thirteen recommended second-level headings and their order,
and how a validator recognises them.
The body is free-form: no section is required, and prose is never validated.
Non-goals: prescribing the content, length, or language of a section;
limiting additional sections; judging whether a design is adequate.

## Requirements

### Requirement: Free-form body with no required section
The body SHALL be free-form Markdown that holds the whole harness design.
The format SHALL NOT require any body section,
and a validator SHALL NOT report a recommended section that is left out.

#### Scenario: No recommended section at all
- **WHEN** a body has a title, an introduction, and only custom headings
- **THEN** a validator reports nothing about its sections

#### Scenario: Some recommended sections left out
- **WHEN** a body has `## Context` and `## Authority` and no other recommended section
- **THEN** a validator reports nothing, and the file conforms

### Requirement: Title and introduction
One first-level ATX heading at the start of the body is recommended
as the title.
A validator SHALL report a warning when the body has no first-level ATX heading,
and one warning for the file when it has more than one.
The title SHALL NOT be compared with `name`.
An introduction between the title and the first second-level heading
is recommended and SHALL NOT be checked.

#### Scenario: No first-level heading
- **WHEN** the body starts with `## Context` and has no first-level ATX heading
- **THEN** a validator reports a warning and no error

#### Scenario: Three first-level headings
- **WHEN** the body has three first-level ATX headings
- **THEN** a validator reports one warning for the file, not one for each heading

#### Scenario: Title differs from the name, and no introduction
- **WHEN** the title's text is not the frontmatter `name` and no paragraph follows it
- **THEN** a validator reports nothing

### Requirement: Recommended sections and their order
The format SHALL recommend thirteen second-level headings in this order:
Context, Invariants, Style, File Structure, Environment, Knowledge, Feedback,
Gates, Authority, Completion, Entropy, Open Questions, References.
A validator SHALL warn when the recommended sections a file uses
are not in this relative order.
Headings outside the vocabulary SHALL be allowed anywhere
and SHALL NOT be reported.

#### Scenario: Extra section between recommended ones
- **WHEN** a file has `## How to use this file` before `## Context`
- **THEN** a validator reports nothing about it

#### Scenario: Recommended sections out of order
- **WHEN** `## Authority` appears before `## Environment`
- **THEN** a validator reports a warning and no error

#### Scenario: Heading outside the vocabulary
- **WHEN** a file has a `## Overview` heading
- **THEN** it is an ordinary custom heading and takes no part in the order or repetition checks

### Requirement: Recognising a recommended section
A recommended section SHALL be recognised only as a second-level ATX heading
whose text, after surrounding whitespace and a closing `#` sequence are removed,
is exactly the English name, letter case included.
Up to three spaces of indentation SHALL be accepted.
A heading at another level, in another spelling, case, or language,
written in Setext style, or inside a fenced code block
SHALL be ordinary content.

#### Scenario: Translated heading
- **WHEN** a file written in Chinese uses `## 背景` in place of `## Context`
- **THEN** a validator treats it as a custom heading and reports nothing

#### Scenario: Heading inside a code fence
- **WHEN** `## Gates` appears a second time, inside a fenced code block
- **THEN** it is not counted, and no repetition is reported

#### Scenario: Closing hashes and indentation
- **WHEN** a heading is written `   ## Context ##`
- **THEN** it is recognised as the Context section

### Requirement: Repetition is a warning
A recommended section that appears more than once SHALL be reported
as a warning,
once for each repeated name, and SHALL NOT make the file non-conforming.

#### Scenario: Section written three times
- **WHEN** a file has three `## Gates` headings
- **THEN** a validator reports one warning naming Gates, and the file conforms

### Requirement: Hints for the sections about the project
The specification SHALL give each recommended heading a hint of what it usually
covers, and the hints SHALL NOT be requirements on content.
Context: the facts and conditions that shape the design.
Invariants: constraints that hold across every task.
Style: the code structure and engineering style preferred.
File Structure: the layout the design expects.

#### Scenario: Target layout
- **WHEN** File Structure names a path that does not exist yet
- **THEN** that is the layout the design expects, and the file system says what exists

### Requirement: Hints for the sections about mechanisms
The hints for the remaining headings SHALL be:
Environment, where the agent runs, its tools, and its reach;
Knowledge, what it consults and when; Feedback, how it checks its changes;
Gates, the deterministic checks that stop defects;
Authority, what it may do alone and what needs a human;
Completion, how a goal is agreed and when work is done;
Entropy, how drift is found and repaired;
Open Questions, what is undecided; References, the sources of the design.

#### Scenario: Tools
- **WHEN** a design gives agents an MCP server and a platform CLI
- **THEN** which tools exist and what they reach is usually described under Environment, and when they may be used under Authority

#### Scenario: Material the agent reads versus material the author used
- **WHEN** a source is something an agent consults while working
- **THEN** it is usually described under Knowledge; a source that only informed the design is listed under References

### Requirement: Omissions are read with care
A reader SHALL understand the design from the prose that is present.
The absence of a recommended section SHALL NOT be read
as a mechanism being disabled,
and an action the file does not mention SHALL NOT be read as authorised.

#### Scenario: No Gates heading
- **WHEN** a file has no `## Gates` section
- **THEN** a reader does not conclude that the project forbids gates; the intent may be stated elsewhere in the body

#### Scenario: High-risk action not mentioned
- **WHEN** a file says nothing about pushing to the remote main branch
- **THEN** an agent does not treat the push as authorised; it takes the conservative course or asks a human

### Requirement: Guidance adds no rule, and no filled-in example
The specification MAY give guidance on expressing a design in prose,
such as stating decision, reason, premise, and mechanism,
and separating design intent from incidental implementation.
That guidance SHALL NOT add a validation rule or a required field,
and the specification SHALL contain no filled-in example file.

#### Scenario: Reader looks for an example
- **WHEN** the prose specification is read end to end
- **THEN** it contains no worked example of a complete `HARNESS.md`
