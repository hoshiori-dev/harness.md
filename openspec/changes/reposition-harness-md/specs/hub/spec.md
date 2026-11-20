# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Sufficient on its own
An entry SHALL be sufficient, without this repository's plugin or any other
document, for a coding agent to design and build a harness from it once the
user has stated the project's goal. It states each decision with its reason
and the premise it rests on, and says what is deliberately not done.
Concrete realisations (file names, commands, tools, thresholds)
are given as examples of a decision, never in place of it.

#### Scenario: Agent without the plugin
- **WHEN** an agent with no skill installed is given an entry and the project's goal
- **THEN** it can propose and build a harness from the file alone, using no term the file does not explain

#### Scenario: Decision bound to one tool
- **WHEN** an entry says only "run tool X before every commit"
- **THEN** review sends it back to state what the check is for and when another tool would serve
