# Spec Delta

## ADDED Requirements

### Requirement: Type marker
Every `HARNESS.md` SHALL carry a type marker in two halves, both required:
its `description` SHALL start with the exact text `[HARNESS.md]`,
and `metadata.type` SHALL be the string `harness-design`.
A validator SHALL report an error for each half that is missing,
naming that half.
The text after the prefix is the author's own wording of what the design is for,
and a validator SHALL NOT report anything about its wording.

#### Scenario: Both halves present
- **WHEN** `description` is `"[HARNESS.md] Harness design of a payments service"` and `metadata.type` is `harness-design`
- **THEN** a validator reports nothing about the marker

#### Scenario: Prefix absent
- **WHEN** `metadata.type` is `harness-design` and `description` starts with other text, with `[harness.md]`, or has the marker later in the sentence
- **THEN** a validator reports an error about the description prefix and none about `metadata.type`

#### Scenario: Type absent or different
- **WHEN** `description` starts with `[HARNESS.md]` and `metadata` is absent, has no `type`, or has a `type` of `Harness-Design` or `skill`
- **THEN** a validator reports an error about `metadata.type` and none about the description prefix

#### Scenario: Neither half present
- **WHEN** an ordinary Agent Skill with neither half is given to a validator
- **THEN** the validator reports two errors, one for each half

#### Scenario: Prefix written without quotes
- **WHEN** the line reads `description: [HARNESS.md] A design`, which YAML does not read as a string
- **THEN** a validator reports an error, and the document does not conform

#### Scenario: Description that is not behaviour-first
- **WHEN** the text after the prefix describes the project and names no situation in which to load the document
- **THEN** a validator reports nothing

### Requirement: Allowed tools draws a warning
A validator SHALL report a warning, and SHALL NOT report an error,
when `allowed-tools` is present as a string, whatever its value.

#### Scenario: Key present
- **WHEN** the frontmatter states `allowed-tools: Read Grep`
- **THEN** a validator reports a warning naming the key, and the document conforms

#### Scenario: Key absent
- **WHEN** the frontmatter has no `allowed-tools`
- **THEN** a validator reports nothing about it

## MODIFIED Requirements

### Requirement: Defined keys
The frontmatter of `SKILL.md` SHALL be a YAML mapping
whose top-level keys are drawn from
`name`, `description`, `license`, `compatibility`, `metadata`,
and `allowed-tools`. `name` and `description` SHALL be present as non-empty
strings; `license`, `compatibility`, and `allowed-tools`, when present,
SHALL be strings.

#### Scenario: Required key absent or empty
- **WHEN** `name` or `description` is absent, null, an empty string, or a string of only whitespace
- **THEN** a validator reports an error naming the key

#### Scenario: Value of the wrong type
- **WHEN** `name`, `description`, `license`, `compatibility`, or `allowed-tools` holds a number, a list, or a mapping
- **THEN** a validator reports an error naming the key

#### Scenario: Frontmatter is not a mapping
- **WHEN** the frontmatter is empty, a list, a scalar, or not parseable as YAML
- **THEN** a validator reports that the frontmatter is invalid

### Requirement: Unknown and repeated keys
A top-level key the format does not define SHALL be a warning,
and SHALL NOT make the document non-conforming.
A top-level key that appears more than once SHALL be an error.

#### Scenario: Undefined top-level key
- **WHEN** the frontmatter contains `tags:` or `status:` at the top level
- **THEN** a validator reports a warning for that key, suggests `metadata`, and reports no error

#### Scenario: Repeated top-level key
- **WHEN** `name` appears twice at the top level
- **THEN** a validator reports an error for the repeated key

#### Scenario: Version at the top level
- **WHEN** the frontmatter contains `version:` at the top level
- **THEN** a validator reports a warning for the key and points to `metadata.version`

### Requirement: Metadata values are strings
`metadata`, when present, SHALL be a mapping whose every value is a string.
A validator SHALL report an error when `metadata` is not a mapping
or when a value in it is not a string.
Apart from `type` and `version`,
a key inside `metadata` belongs to whoever put it there:
a validator of the format SHALL NOT interpret or compare its value
and SHALL NOT report the key as unknown or repeated.

#### Scenario: Arbitrary metadata
- **WHEN** `metadata` holds string values under keys the format does not define, under a key written twice, or under keys named like the top-level ones
- **THEN** a validator reports nothing about them

#### Scenario: Value that is not a string
- **WHEN** a key inside `metadata` holds a list, a mapping, a number, a boolean, or null
- **THEN** a validator reports an error naming that key

#### Scenario: Metadata that is not a mapping
- **WHEN** `metadata` is a string or a list
- **THEN** a validator reports an error naming `metadata`

### Requirement: Name, description, and compatibility limits are errors
A validator SHALL report an error when `name` is longer than 64 characters,
when `name` is not made of lowercase letters, digits, and single hyphens
with no hyphen at either end,
when `name` is not the name of the directory that holds `SKILL.md`,
when `description` is longer than 1024 characters,
or when `compatibility` is longer than 500 characters,
counting Unicode code points.
The format SHALL NOT require `name` to equal the title of the body.

#### Scenario: Name outside the character rules
- **WHEN** `name` is `My_Design` or `my--design`
- **THEN** a validator reports an error

#### Scenario: Name differs from the directory
- **WHEN** the `SKILL.md` in a directory called `my-design` has the `name` `team-harness`
- **THEN** a validator reports an error naming both

#### Scenario: Name over the length
- **WHEN** `name` has 65 characters, all of them allowed ones
- **THEN** a validator reports an error

#### Scenario: Description at and over the limit
- **WHEN** one `description` has 1024 characters, the marker prefix included, and another has 1025
- **THEN** a validator reports nothing for the first and an error for the second

#### Scenario: Compatibility over the limit
- **WHEN** `compatibility` has 501 characters
- **THEN** a validator reports an error

#### Scenario: Characters outside ASCII
- **WHEN** a `description` of 600 Chinese characters takes more than 1024 bytes
- **THEN** a validator reports nothing about its length

### Requirement: Version is a free string
The version of a design SHALL be stated at `metadata.version`
and, when present, SHALL be a string like every `metadata` value.
Its form and meaning belong to the author.
A validator SHALL NOT interpret it, compare it,
or report anything about the wording of its value. The
specification itself is versioned with Semantic Versioning, currently `1.0.0`.

#### Scenario: Any wording
- **WHEN** `metadata` states `version: alpha`, `version: 2026-11`, or `version: "3"`
- **THEN** a validator reports nothing

#### Scenario: Version that is not a string
- **WHEN** `metadata` states `version: 1.0`, which YAML reads as a number
- **THEN** a validator reports an error naming the key

## RENAMED Requirements

- FROM: `### Requirement: Metadata is opaque`
- TO: `### Requirement: Metadata values are strings`

- FROM: `### Requirement: Name and description limits are warnings`
- TO: `### Requirement: Name, description, and compatibility limits are errors`
