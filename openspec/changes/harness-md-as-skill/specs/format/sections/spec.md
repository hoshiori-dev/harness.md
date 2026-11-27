# Spec Delta

## ADDED Requirements

### Requirement: Sections in other files
The content of a section, recommended or not,
MAY live in another file of the directory, linked from `SKILL.md`.
Such a file is part of the design with the same standing as the body.
A reader who needs a recommended section SHALL follow the links of `SKILL.md`
to the file that holds it and read it as that section,
and SHALL NOT treat the section as left out
because `SKILL.md` lacks its text or its heading.
A validator SHALL NOT report where a section lives.

#### Scenario: Heading kept with a link
- **WHEN** `SKILL.md` has `## Gates` followed by one sentence that links `gates.md`
- **THEN** a reader who needs the gates opens `gates.md` and reads it as the Gates section, and a validator reports nothing about the section

#### Scenario: Section without a heading in the main file
- **WHEN** `SKILL.md` has no `## Gates` heading and its introduction links `gates.md` as the description of the gates
- **THEN** a reader reads `gates.md` as part of the design and does not conclude that the design has no gates

#### Scenario: Link that does not resolve
- **WHEN** `SKILL.md` links `gates.md` for its gates and the directory has no such file
- **THEN** a reader treats the gates as not stated, under "Omissions are read with care", and does not guess them; the link itself is reported under the "Warnings" requirement of `cli/lint`

## MODIFIED Requirements

### Requirement: Free-form body with no required section
The body of `SKILL.md` SHALL be free-form Markdown.
Together with the other files of the directory
it holds the whole harness design.
The format SHALL NOT require any section, in the body or in another file,
and a validator SHALL NOT report a recommended section that is left out.

#### Scenario: No recommended section at all
- **WHEN** a body has a title, an introduction, and only custom headings
- **THEN** a validator reports nothing about its sections

#### Scenario: Some recommended sections left out
- **WHEN** a body has `## Context` and `## Authority` and no other recommended section
- **THEN** a validator reports nothing, and the document conforms

#### Scenario: Body that only points to other files
- **WHEN** a body has a title, an introduction, and links to three other files of the directory that hold the design
- **THEN** a validator reports nothing about its sections

### Requirement: Title and introduction
One first-level ATX heading at the start of the body of `SKILL.md`
is recommended as the title.
A validator SHALL report a warning when that body has no first-level ATX heading,
and one warning for the document when it has more than one.
Headings in other files of the directory SHALL NOT be counted.
The title SHALL NOT be compared with `name`.
An introduction between the title and the first second-level heading
is recommended and SHALL NOT be checked.

#### Scenario: No first-level heading
- **WHEN** the body starts with `## Context` and has no first-level ATX heading
- **THEN** a validator reports a warning and no error

#### Scenario: Three first-level headings
- **WHEN** the body has three first-level ATX headings
- **THEN** a validator reports one warning for the document, not one for each heading

#### Scenario: Title differs from the name, and no introduction
- **WHEN** the title's text is not the frontmatter `name` and no paragraph follows it
- **THEN** a validator reports nothing

#### Scenario: First-level headings in other files
- **WHEN** `SKILL.md` has one first-level heading and two linked files each start with their own, or `SKILL.md` has none and a linked file has one
- **THEN** a validator reports nothing in the first case and the missing-title warning in the second

### Requirement: Recommended sections and their order
The format SHALL recommend thirteen second-level headings in this order:
Context, Invariants, Style, File Structure, Environment, Knowledge, Feedback,
Gates, Authority, Completion, Entropy, Open Questions, References.
A validator SHALL warn when the recommended sections `SKILL.md` uses
are not in this relative order,
and SHALL NOT compare headings across files.
Headings outside the vocabulary SHALL be allowed anywhere
and SHALL NOT be reported.

#### Scenario: Extra section between recommended ones
- **WHEN** a file has `## How to use this file` before `## Context`
- **THEN** a validator reports nothing about it

#### Scenario: Recommended sections out of order
- **WHEN** `## Authority` appears before `## Environment` in `SKILL.md`
- **THEN** a validator reports a warning and no error

#### Scenario: Heading outside the vocabulary
- **WHEN** a file has a `## Overview` heading
- **THEN** it is an ordinary custom heading and takes no part in the order or repetition checks

#### Scenario: Order inside another file
- **WHEN** a linked file of the directory has `## Authority` before `## Environment`, and `SKILL.md` has its own recommended sections in order
- **THEN** a validator reports nothing about order

### Requirement: Recognising a recommended section
A validator SHALL recognise a recommended section only in `SKILL.md`,
as a second-level ATX heading
whose text, after surrounding whitespace and a closing `#` sequence are removed,
is exactly the English name, letter case included.
Up to three spaces of indentation SHALL be accepted.
A heading at another level, in another spelling, case, or language,
written in Setext style, inside a fenced code block,
or in another file of the directory
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

#### Scenario: Heading in another file
- **WHEN** `gates.md`, linked from `SKILL.md`, has a `## Gates` heading
- **THEN** a validator treats that heading as ordinary content

### Requirement: Repetition is a warning
A recommended section that appears more than once in `SKILL.md`
SHALL be reported as a warning,
once for each repeated name,
and SHALL NOT make the document non-conforming.
The same heading in another file of the directory SHALL NOT count
as a repetition.

#### Scenario: Section written three times
- **WHEN** `SKILL.md` has three `## Gates` headings
- **THEN** a validator reports one warning naming Gates, and the document conforms

#### Scenario: Same heading in two files
- **WHEN** `SKILL.md` has one `## Gates` heading and a linked `gates.md` has another
- **THEN** a validator reports no repetition

### Requirement: Omissions are read with care
A reader SHALL understand the design from the prose that is present,
in `SKILL.md` and in the other files of the directory.
The absence of a recommended section SHALL NOT be read
as a mechanism being disabled,
and an action the document does not mention SHALL NOT be read as authorised.

#### Scenario: No Gates heading
- **WHEN** a document has no `## Gates` section
- **THEN** a reader does not conclude that the project forbids gates; the intent may be stated elsewhere in the body or in another file of the directory

#### Scenario: High-risk action not mentioned
- **WHEN** no file of a document says anything about pushing to the remote main branch
- **THEN** an agent does not treat the push as authorised; it takes the conservative course or asks a human
