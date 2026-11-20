# Hub

## Purpose
The rules an entry of the official hub follows. The hub is the directory
`hub/` of this repository: a growing collection of ready-to-use `HARNESS.md`
designs that the website lists, searches, displays, and offers for copying and
download. An entry is a reference design, of a complete harness or a stated
part of one, handed to a coding agent that may have no plugin installed, or
read by a person, while a project's own harness is designed. These are rules
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
An entry SHALL be sufficient within the scope it declares, without this
repository's plugin or any other document: once the user has stated the
project's goal, a coding agent can design and build what the entry covers,
a whole harness or the stated part. It states each decision with its reason
and the premise it rests on, and says what is deliberately not done.
Concrete realisations (file names, commands, tools, thresholds)
are given as examples of a decision, never in place of it.

#### Scenario: Agent without the plugin
- **WHEN** an agent with no skill installed is given an entry that covers a complete harness and the project's goal
- **THEN** it can propose and build a harness from the file alone, using no term the file does not explain

#### Scenario: Partial entry judged on its scope
- **WHEN** an entry declares that it covers only how changes are gated
- **THEN** it is sufficient when an agent can design and build the gates from it alone, and it is not sent back for saying nothing about the other parts of a harness

#### Scenario: Decision bound to one tool
- **WHEN** an entry says only "run tool X before every commit"
- **THEN** review sends it back to state what the check is for and when another tool would serve

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

### Requirement: Whole or partial designs
An entry SHALL describe either a complete harness or a stated part of one.
Its `description` and its introduction SHALL say which,
and a partial entry SHALL say what it leaves to the reader's own design.

#### Scenario: Entry covering one aspect
- **WHEN** a pull request adds an entry that describes only how a public repository guards its agent against text written by strangers
- **THEN** the entry is acceptable, provided its description and introduction say that it covers that aspect alone

#### Scenario: Partial entry that reads as complete
- **WHEN** an entry covers two layers and its description presents it as a harness for a kind of project
- **THEN** review sends it back to state what it covers

### Requirement: Used as a reference
An entry SHALL be usable from wherever it is read: handed to an agent
by URL or path, or opened by a person.
It SHALL NOT tell its reader to place it in a project root,
and SHALL NOT make keeping or deleting the file a step of using it.
Any note on use SHALL be short and SHALL leave the procedure
of designing and building to the reader.

#### Scenario: Entry read from its URL
- **WHEN** a user gives an agent an entry's URL and says what their project is for
- **THEN** the agent can use the entry without the file existing in the user's repository

#### Scenario: Entry that prescribes placement
- **WHEN** an entry says to save it as `HARNESS.md` in the repository root before anything else
- **THEN** review sends it back
