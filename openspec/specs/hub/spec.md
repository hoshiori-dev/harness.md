# Hub

## Purpose
The rules an entry of the official hub follows. The hub is the directory
`hub/` of this repository: a growing collection of ready-to-use `HARNESS.md`
designs that the website lists, searches, displays, and offers for copying and
download. An entry is meant to be pasted into a project root and expanded into
a harness by a coding agent that may have no plugin installed. These are rules
of the hub, not of the format: the format leaves `metadata` undefined, and the
hub defines what it keeps there. Non-goals: hosting designs outside this
repository, ranking entries, versioning an entry separately from the
repository.

## Requirements

### Requirement: Entry layout
An entry SHALL be a directory `hub/<name>/` containing `HARNESS.md`, where
`<name>` equals the file's frontmatter `name`. The hub root SHALL contain only
entry directories, `README.md`, and `README.zh.md`.

#### Scenario: Directory and name differ
- **WHEN** `hub/solo-library/HARNESS.md` declares `name: solo-lib`
- **THEN** `just hub-check` fails naming the file and both names

### Requirement: Entry is clean under the format
An entry SHALL produce no error or warning from the format validator
and SHALL state `license`.

#### Scenario: Entry with a warning
- **WHEN** an entry's recommended sections are out of the specification's order, or it has no first-level heading
- **THEN** `just hub-check` fails, although the same file would pass as a project's own `HARNESS.md`

### Requirement: Hub metadata
An entry SHALL carry `metadata.tags`, a non-empty list of distinct tags made of
lowercase letters and digits joined by single hyphens. An entry MAY carry
`metadata.based-on`, a non-empty list of http(s) URLs naming the designs or
sources it was derived from. The hub SHALL define no other metadata key.

#### Scenario: Entry without tags
- **WHEN** an entry has no `metadata.tags`
- **THEN** `just hub-check` fails and says the hub's search and filters are built from it

#### Scenario: Provenance that is not a URL
- **WHEN** `metadata.based-on` lists `my earlier project`
- **THEN** `just hub-check` fails naming the value

### Requirement: Sufficient on its own
An entry SHALL be sufficient, without this repository's plugin or any other
document, for a coding agent to build the harness it describes once the user
has stated the project's goal: it names the files, commands, checks, and
permissions to create, gives the reason for each decision, and says what is
deliberately not done.

#### Scenario: Agent without the plugin
- **WHEN** an agent with no skill installed is given an entry in a project root and the project's goal
- **THEN** it can propose and build a harness from the file alone, using no term the file does not explain

### Requirement: Generic and in English
An entry SHALL be written in English, its Context SHALL describe the kind of
project the design assumes, and it SHALL name no private project and contain
no secret.

#### Scenario: Entry derived from a real project
- **WHEN** a contributor generalises their own project's design into an entry
- **THEN** project names, internal hostnames, and people are removed, and Context describes the kind of project instead of that project

### Requirement: Entries change by pull request
An entry SHALL be added or changed by an ordinary pull request, without an
OpenSpec change, that passes `just hub-check` and is reviewed by a maintainer
for the substance of the design.

#### Scenario: New entry proposed by a contributor
- **WHEN** a pull request adds `hub/<name>/HARNESS.md`
- **THEN** CI runs the hub check, and the entry is merged only after a maintainer's review
