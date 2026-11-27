# Spec Delta

## ADDED Requirements

### Requirement: How a design document is loaded
Asked how a `HARNESS.md` is loaded, the agent SHALL answer as the catalog
requirement "How a document is loaded" states. Asked about a skills
directory as its place, it SHALL say what that place costs,
SHALL leave the choice to the user,
and SHALL NOT recommend a skills directory or move a file.

#### Scenario: Whether agents read it on every task
- **WHEN** the user asks "Will the agent read our HARNESS.md before each task, like AGENTS.md?"
- **THEN** the answer says it is not an entrypoint, that no routing row leads an ordinary task to it, and that its body is opened only when the harness is designed, checked, or changed

#### Scenario: Document in a skills directory
- **WHEN** the user asks whether to move the project's design document into `.claude/skills/` so that agents find it
- **THEN** the answer says the client would then list its description in every session and that checks for ordinary skills would report on it, leaves the choice to the user, recommends no skills directory, and moves no file

## MODIFIED Requirements

### Requirement: Triggering
The skill SHALL load for questions about how an agent harness should be
shaped and why, and SHALL NOT load for requests to build or restructure
harness files, for application work, or for questions about the
`HARNESS.md` format.

#### Scenario: Agents ignore the entrypoint
- **WHEN** the user asks "Why does Claude keep ignoring half of what's in our AGENTS.md?"
- **THEN** the skill loads

#### Scenario: Where a rule belongs
- **WHEN** the user asks "Should our release steps go in AGENTS.md, a doc, or a skill?"
- **THEN** the skill loads

#### Scenario: Whether a layer is needed
- **WHEN** the user asks "It's a two-week prototype. Do we really need CI and a sandbox for the agent?"
- **THEN** the skill loads

#### Scenario: Parallel agents
- **WHEN** the user asks "How should three agents work on this repo at the same time without stepping on each other?"
- **THEN** the skill loads

#### Scenario: Build request
- **WHEN** the user says "Split our AGENTS.md into knowledge files"
- **THEN** the skill does not load as the owner of the work; if loaded it hands off without creating files

#### Scenario: Application bug
- **WHEN** the user says "The login test is flaky, find out why"
- **THEN** the skill does not load

#### Scenario: File format question
- **WHEN** the user asks "Which frontmatter keys may a HARNESS.md have?"
- **THEN** the skill does not load

### Requirement: Where design intent lives
The agent SHALL answer that a project's design intent lives in a
`HARNESS.md` only where the project adopted one as its anchor document,
and otherwise in the harness artifacts and the decisions behind them;
that facts always come from the code; that a `HARNESS.md` from
elsewhere is a reference with no authority over the project,
wherever it is placed; and that the files a `HARNESS.md` carries
are reference copies that are never run in place.

#### Scenario: Reference disagrees with an artifact
- **WHEN** asked whether a permission file is "wrong" because a downloaded `HARNESS.md` forbids what it allows
- **THEN** the answer says the downloaded document has no authority over the project and treats the difference as a design choice to weigh

#### Scenario: Project without a design file
- **WHEN** asked "we have no HARNESS.md, is our harness incomplete?"
- **THEN** the answer says no, explains what the document is for, and does not recommend creating one unless the user wants a record to keep or share

#### Scenario: Reference placed inside the project
- **WHEN** asked whether a downloaded `HARNESS.md` now binds the project because someone copied it into the project's skills directory and the client lists it
- **THEN** the answer says its place gives it no authority, that it stays a design to weigh until the project adopts it as its anchor document, and changes no file

#### Scenario: Script inside a design document
- **WHEN** asked whether CI may call a check script that sits inside the directory of the project's own anchor document
- **THEN** the answer says the script is a reference copy, that the project runs its own adapted copy kept among its management code, and creates nothing

#### Scenario: Unmarked file of the old shape
- **WHEN** asked whether a single root file named `HARNESS.md` that carries no type marker is the project's design
- **THEN** the answer says the file is ordinary Markdown with no standing as an anchor document, and neither converts it nor recommends converting it
