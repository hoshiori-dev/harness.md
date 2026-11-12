# HARNESS.md Frontmatter

## Purpose
The identity fields a `HARNESS.md` carries in its YAML frontmatter and how a
validator treats them. The frontmatter holds identity only: no status, no
project context, no per-layer keys. Non-goals: defining what `metadata`
contains (each platform defines its own, for example the hub's `tags` and
`based-on`).

## Requirements

### Requirement: Defined keys
The frontmatter SHALL be a YAML mapping whose top-level keys are drawn from
`name`, `description`, `version`, `license`, and `metadata`. `name` and
`description` SHALL be present as non-empty strings; `version` and `license`,
when present, SHALL be strings.

#### Scenario: Required key absent or empty
- **WHEN** `name` or `description` is absent, null, an empty string, or a string of only whitespace
- **THEN** a validator reports an error naming the key

#### Scenario: Value of the wrong type
- **WHEN** `name`, `description`, `version`, or `license` holds a number, a list, or a mapping
- **THEN** a validator reports an error naming the key

#### Scenario: Frontmatter is not a mapping
- **WHEN** the frontmatter is empty, a list, a scalar, or not parseable as YAML
- **THEN** a validator reports that the frontmatter is invalid

### Requirement: Unknown and repeated keys
A top-level key the format does not define SHALL be an error, and a top-level
key that appears more than once SHALL be an error.

#### Scenario: Undefined top-level key
- **WHEN** the frontmatter contains `tags:` or `status:` at the top level
- **THEN** a validator reports an error for that key and suggests `metadata`

#### Scenario: Repeated top-level key
- **WHEN** `name` appears twice at the top level
- **THEN** a validator reports an error for the repeated key

### Requirement: Metadata is opaque
`metadata` SHALL accept any YAML structure, and a validator of the format
SHALL NOT read, validate, or compare anything inside it.

#### Scenario: Arbitrary metadata
- **WHEN** `metadata` holds nested mappings, lists, repeated keys, or keys named like the defined ones
- **THEN** a validator reports nothing about it

### Requirement: Name and description limits are warnings
A validator SHALL warn, and SHALL NOT report an error, when `name` is longer
than 64 characters, when `name` is not made of lowercase letters, digits, and
single hyphens with no hyphen at either end, or when `description` is longer
than 1024 characters, counting Unicode code points. The format SHALL NOT require `name` to equal the name of
the containing directory or the title of the body.

#### Scenario: Name outside the character rules
- **WHEN** `name` is `My_Design` or `my--design`
- **THEN** a validator reports a warning and no error

#### Scenario: Name differs from the directory
- **WHEN** a project's root `HARNESS.md` has a `name` unrelated to the directory it is in
- **THEN** a validator reports nothing

### Requirement: Version is a free string
`version`, when present, SHALL be a string. Its form and meaning belong to
the author, for example the version of the design itself. A validator SHALL
NOT interpret it, compare it, or report anything about its value. The
specification itself is versioned with Semantic Versioning, currently `1.0.0`.

#### Scenario: Any wording
- **WHEN** a file states `version: alpha`, `version: 2026-11`, or `version: "3"`
- **THEN** a validator reports nothing

#### Scenario: Version that is not a string
- **WHEN** a file states `version: 1.0`, which YAML reads as a number
- **THEN** a validator reports an error naming the key
