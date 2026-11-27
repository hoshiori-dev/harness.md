# Spec Delta

## ADDED Requirements

### Requirement: Links stay inside the entry
No file of an entry SHALL link by relative path to a target outside the
entry's own directory. Links SHALL be found within the bounds of the
`cli/lint` requirement "Links and reachability".
A link with a scheme is not covered by this rule.

#### Scenario: Link to a file of the repository
- **WHEN** an entry's `SKILL.md` links to `../../spec/spec.md`
- **THEN** `just hub-check` fails naming the file, the line, and the target, although the format validator reports nothing about that link

#### Scenario: Link to another entry
- **WHEN** a Markdown file of an entry, reached from its `SKILL.md`, links to `../production-engineering/SKILL.md`
- **THEN** `just hub-check` fails naming the file that holds the link

#### Scenario: Link to a web address
- **WHEN** an entry links to `https://example.com/guide`
- **THEN** `just hub-check` reports nothing about the link

### Requirement: Assets are judged in review
A file an entry carries beside its prose SHALL follow the writing guidance
of the `format/document` requirement "Assets".
A script MAY be in any language. `just hub-check` SHALL
apply no rule to an asset's content or language; a maintainer's review judges
both.

#### Scenario: Script in a language other than Python
- **WHEN** a pull request adds an entry that carries a shell script, and a link in the entry reaches it
- **THEN** `just hub-check` passes, and review judges the script against that guidance

#### Scenario: Asset tied to one project
- **WHEN** an entry carries a configuration file that holds one project's paths and the entry's `SKILL.md` does not say what to replace
- **THEN** review sends it back, and `just hub-check` reports nothing about it

## MODIFIED Requirements

### Requirement: Entry layout
An entry SHALL be a directory `hub/<name>/` that is a `HARNESS.md`:
its main file is `SKILL.md`, and it MAY hold other files beside it.
The format owns the rule that `<name>` equals the frontmatter `name`;
the hub adds none of its own. The hub root SHALL contain only
entry directories, `README.md`, and `README.zh.md`.

#### Scenario: Directory and name differ
- **WHEN** `hub/solo-library/SKILL.md` declares `name: solo-lib`
- **THEN** `just hub-check` fails with the format validator's finding on the name, naming the file and both names

#### Scenario: Directory without a main file
- **WHEN** `hub/solo-library/` holds `HARNESS.md` and no `SKILL.md`
- **THEN** `just hub-check` fails with the format validator's finding that the main file is missing

#### Scenario: Stray file in the hub root
- **WHEN** `hub/notes.md` exists beside the entry directories and the two README files
- **THEN** `just hub-check` fails naming the file

### Requirement: Entry is clean under the format
An entry SHALL produce no error or warning from the format validator
and SHALL state `license`.

#### Scenario: Entry with a warning
- **WHEN** an entry's recommended sections are out of the specification's order, or its `SKILL.md` has no first-level heading
- **THEN** `just hub-check` fails, although the same document would pass as a project's own `HARNESS.md`

#### Scenario: File no link reaches
- **WHEN** an entry's directory holds a script that no link in the entry reaches
- **THEN** `just hub-check` fails with the format validator's warning naming the script

### Requirement: Hub metadata
An entry SHALL carry `metadata.tags`: a string of one or more distinct tags
separated by commas, each made of lowercase letters and digits joined by
single hyphens. An entry MAY carry `metadata.based-on`: a string of one or
more http(s) URLs separated by commas, naming the designs or sources it was
derived from. Each value SHALL be split at commas and each item trimmed;
an empty item SHALL be an error. The hub SHALL define no other metadata key.

#### Scenario: Entry without tags
- **WHEN** an entry has no `metadata.tags`
- **THEN** `just hub-check` fails and says the hub's search and filters are built from it

#### Scenario: Provenance that is not a URL
- **WHEN** `metadata.based-on` is `my earlier project`
- **THEN** `just hub-check` fails naming the value

#### Scenario: Several tags in one string
- **WHEN** `metadata.tags` is `open-source, library ,solo`
- **THEN** `just hub-check` passes and the hub reads the three tags `open-source`, `library`, and `solo`

#### Scenario: Empty item
- **WHEN** `metadata.tags` is `open-source,,library` or ends with a comma
- **THEN** `just hub-check` fails naming the key and saying that an item is empty

#### Scenario: Tag repeated after trimming
- **WHEN** `metadata.tags` is `library, library`
- **THEN** `just hub-check` fails naming the repeated tag

#### Scenario: URL that contains a comma
- **WHEN** `metadata.based-on` holds one URL whose path contains a comma
- **THEN** the value is split at that comma, and `just hub-check` fails naming the item that is not a URL

#### Scenario: Tags written as a list
- **WHEN** `metadata.tags` is a YAML list
- **THEN** `just hub-check` fails with the format validator's finding that a `metadata` value is not a string

### Requirement: Sufficient on its own
An entry, taken as its whole directory, SHALL be sufficient within the scope
it declares, without this repository's plugin or any document outside the
directory: once the user has stated the project's goal, a coding agent can
design and build what the entry covers. It SHALL state each decision with its
reason and premise, and what is deliberately not done. Concrete realisations
(file names, commands, tools, thresholds) SHALL be examples of a decision,
never in place of it.

#### Scenario: Agent without the plugin
- **WHEN** an agent with no skill installed is given an entry that covers a complete harness and the project's goal
- **THEN** it can propose and build a harness from the entry's files alone, using no term they do not explain

#### Scenario: Partial entry judged on its scope
- **WHEN** an entry declares that it covers only how changes are gated
- **THEN** it is sufficient when an agent can design and build the gates from it alone, and it is not sent back for saying nothing about the other parts of a harness

#### Scenario: Decision bound to one tool
- **WHEN** an entry says only "run tool X before every commit"
- **THEN** review sends it back to state what the check is for and when another tool would serve

#### Scenario: Section kept in another file
- **WHEN** an entry's `SKILL.md` links to a file of the entry that holds one of its sections
- **THEN** review judges sufficiency over `SKILL.md` and that file together, and does not send the entry back because `SKILL.md` alone is incomplete

### Requirement: Generic and in English
An entry SHALL be written in English in every file, its Context SHALL
describe the kind of project the design assumes, and no file of it SHALL name
a private project or contain a secret.

#### Scenario: Entry derived from a real project
- **WHEN** a contributor generalises their own project's design into an entry
- **THEN** project names, internal hostnames, and people are removed, and Context describes the kind of project instead of that project

#### Scenario: Asset taken from a real project
- **WHEN** an entry carries a script copied from the contributor's project that still holds an internal hostname
- **THEN** review sends it back, although the entry's `SKILL.md` names no project

### Requirement: Entries change by pull request
An entry SHALL be added or changed by an ordinary pull request, without an
OpenSpec change, that passes `just hub-check` and is reviewed by a maintainer
for the substance of the design.

#### Scenario: New entry proposed by a contributor
- **WHEN** a pull request adds `hub/<name>/SKILL.md`, with or without other files beside it
- **THEN** CI runs the hub check, and the entry is merged only after a maintainer's review

### Requirement: Whole or partial designs
An entry SHALL describe either a complete harness or a stated part of one.
Its `description` and the introduction of its `SKILL.md` SHALL say which,
and a partial entry SHALL say what it leaves to the reader's own design.

#### Scenario: Entry covering one aspect
- **WHEN** a pull request adds an entry that describes only how a public repository guards its agent against text written by strangers
- **THEN** the entry is acceptable, provided its description and introduction say that it covers that aspect alone

#### Scenario: Partial entry that reads as complete
- **WHEN** an entry covers two layers and its description presents it as a harness for a kind of project
- **THEN** review sends it back to state what it covers

### Requirement: Used as a reference
An entry SHALL be usable from the address of its `SKILL.md`, handed to an
agent by URL or path or opened by a person, with its other files reachable
from there by relative links. It SHALL NOT tell its reader where to place it,
and SHALL NOT make keeping or deleting it a step of using it.
Any note on use SHALL be short and SHALL leave the procedure
of designing and building to the reader.

#### Scenario: Entry read from its URL
- **WHEN** a user gives an agent the URL of an entry's `SKILL.md` and says what their project is for
- **THEN** the agent can use the entry, following its relative links to the other files, without any file of it existing in the user's repository

#### Scenario: Entry that prescribes placement
- **WHEN** an entry says to save it into the project's skills directory, or any other named place, before anything else
- **THEN** review sends it back
