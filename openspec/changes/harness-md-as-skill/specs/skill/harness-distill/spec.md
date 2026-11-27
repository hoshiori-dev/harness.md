# Spec Delta

## ADDED Requirements

### Requirement: One main file, assets by plan
The agent SHALL write each document as one `SKILL.md` and SHALL move
sections into other files of its directory only when the user asks.
It MAY write an asset that meets the format's writing guidance for
assets, and SHALL write only assets its approved plan names.
An asset SHALL hold no secret, and an asset of a portable design falls
under the requirement "A portable design carries decisions, not this
project".

#### Scenario: No request to split
- **WHEN** the whole harness is described and the user said nothing about how the text is divided
- **THEN** the document's directory holds `SKILL.md` and no other Markdown file

#### Scenario: Sections in their own files on request
- **WHEN** the user asks for the text on gates and on authority in files of their own
- **THEN** the directory holds those two files beside `SKILL.md`, a link in `SKILL.md` reaches each, and the validator reports no unresolved link and no unreachable file

#### Scenario: Asset the plan names
- **WHEN** the user wants the project's commit-message check carried with a portable design and the approved plan names it
- **THEN** the directory holds a copy with the project's names replaced by neutral ones, `SKILL.md` links it, and the original in the project is unchanged

#### Scenario: Asset the plan does not name
- **WHEN** the approved plan names no asset and the harness has scripts that would illustrate a decision
- **THEN** the directory holds no asset, and the text names such a script only as an example of the decision

#### Scenario: Project information that cannot be avoided
- **WHEN** an asset the plan names only works with a path that differs by project
- **THEN** `SKILL.md` says what a reader replaces in that asset and how

## MODIFIED Requirements

### Requirement: Triggering
The skill SHALL load only when the user invokes it by name and SHALL NOT
load from a description match, however closely a request resembles its
work.

#### Scenario: Invoked by name with no argument
- **WHEN** the user runs the skill by name in a repository with an `AGENTS.md`, hooks, and CI
- **THEN** the skill loads and plans a description of the whole harness

#### Scenario: Invoked by name for one aspect
- **WHEN** the user runs the skill by name adding "only how we gate changes and what agents may do alone"
- **THEN** the skill loads and plans one document that covers those two aspects and says so

#### Scenario: Invoked by name asking for a shareable design
- **WHEN** the user runs the skill by name adding "something another team could start from"
- **THEN** the skill loads and plans a portable design

#### Scenario: Documentation request without invocation
- **WHEN** the user types "document how our agent setup works" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Format question without invocation
- **WHEN** the user asks "which sections does a HARNESS.md usually have?" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Review request without invocation
- **WHEN** the user asks "what is wrong with our AGENTS.md?" without invoking the skill
- **THEN** the skill does not load

### Requirement: Scope is settled before reading
The agent SHALL settle in rounds: whether the result covers the whole
harness or named parts; whether it is one document or several, what each
covers, and each one's name; whether it describes the harness as it is
or is a portable design; whether it is kept as the project's design;
which assets, if any, it carries; and where it is written. What the
invocation states SHALL be taken as decided and shown, not asked.

#### Scenario: Scope stated in the invocation
- **WHEN** the invocation asks for the Gates and Authority aspects as one portable document
- **THEN** the round shows those three points as decided and asks only what remains open

#### Scenario: Several files
- **WHEN** the user asks for one document per aspect of three aspects
- **THEN** three directories are written, each named after its document, and each one's description and introduction say what it covers and what it leaves out

### Requirement: Output location
The agent SHALL write each document as a directory `<location>/<name>/`
with `SKILL.md` as its main file and the format's type marker,
at the location settled under the catalog requirement
"Where a document is written", and SHALL report its full path.
For a document kept as the project's design it SHALL add the one
entrypoint line its approved plan lists,
and SHALL otherwise edit no existing file of the project.
It SHALL NOT replace a directory of that name without the user's decision.

#### Scenario: No path given
- **WHEN** the user names no output location and does not ask to keep the result as the project's design
- **THEN** the document's directory is written outside the repository's tracked tree in a temporary location, the client's own when the client offers one and the system's otherwise, and the closing message gives its complete path

#### Scenario: Anchor document requested
- **WHEN** the user says the result is to be the project's design and the project has a knowledge folder
- **THEN** the draft is shown, the plan lists the document's directory inside that folder and the one line for the entrypoint, and after approval the directory is written and validated and the agent adds that line and edits no other file of the project

#### Scenario: Directory of that name already present
- **WHEN** the confirmed location already holds a directory named after the document
- **THEN** the agent shows how the new draft differs and asks whether to replace the directory, write under another name, or stop, and the directory is unchanged until the user answers

#### Scenario: Root file already present
- **WHEN** the root holds an unmarked `HARNESS.md` file of the old shape and the user wants the result as the project's design
- **THEN** that file is left unchanged and is not offered for replacement or conversion, and the document is written as the approved plan lists it

#### Scenario: Entrypoint already names a document
- **WHEN** the user wants the result as the project's design and the entrypoint already names a marked document
- **THEN** the agent shows how the draft differs from that document and asks whether to replace it, write the result as a reference with no entrypoint line, or stop

### Requirement: A write inside the project waits for a go-ahead
The agent SHALL write or edit a file inside the project only after the
user's go-ahead on the files listed by path, including when the remaining
decisions were left to the agent, and SHALL replace an existing file or
directory at a named path only by the user's decision on it.

#### Scenario: Named path inside the project
- **WHEN** the user named `docs/` as the location of a document named `gates-design`, left the remaining decisions to the agent, and nothing exists at `docs/gates-design/`
- **THEN** the agent lists `docs/gates-design/SKILL.md` by path as new and writes it only after the user's go-ahead

#### Scenario: File already at the named path
- **WHEN** the user named `docs/` as the location of a document named `gates-design` and `docs/gates-design/SKILL.md` already exists
- **THEN** the agent shows how the draft differs and asks whether to replace the directory, write under another name, or stop, and the existing files are unchanged until the user answers

### Requirement: Validated and presented
The agent SHALL validate each document's directory with the format
validator, or by reading the format rules when the validator cannot run
and saying so, fix every error, and close by stating for each document
its path, the files in it, what it covers, what is inferred, and what
was not found. It SHALL commit nothing unless asked.

#### Scenario: Validator unavailable
- **WHEN** the validator script cannot run
- **THEN** the agent checks the format by reading and says plainly that the validator did not run

#### Scenario: Error in the written directory
- **WHEN** the validator reports that the document's `name` differs from its directory name
- **THEN** the agent corrects the document, runs the validator again, and closes only when it reports no error

### Requirement: Outcomes
Given a project and an invocation, the agent SHALL leave a result a
reader can judge without seeing the skill.

#### Scenario: Whole harness, as it is
- **WHEN** the skill runs with no argument in a repository with an entrypoint, three knowledge files, a pre-commit configuration, CI, and a client permission file, and the user accepts the shown defaults
- **THEN** one directory named after the document exists in a temporary location with `SKILL.md` as its only file, passes validation, covers context and each layer with something found or an explicit "nothing found", marks every inference, lists the contradictions it met, and `git status` in the repository shows no change; the result fails if a document's directory appears inside the project, if a defect was silently corrected, or if the path is not reported in full

#### Scenario: One aspect, portable
- **WHEN** the skill runs with "only our permission and push rules, as something others can reuse"
- **THEN** one document covers that aspect alone, its description and introduction say so, every decision has a reason and a premise, no repository, person, or host name appears, and the closing message lists the project specifics that were generalised

#### Scenario: Kept as the project's design
- **WHEN** the skill runs with "and keep it as our design document" in a repository whose `AGENTS.md` routes to a knowledge folder, and the user approves the plan as proposed
- **THEN** a directory named after the document exists inside the knowledge folder and passes validation, `AGENTS.md` names its `SKILL.md` in one added line, and `git status` shows that directory and that line and nothing else; the result fails if anything was written before the approval, if a skills directory was proposed, or if any other file of the project changed
