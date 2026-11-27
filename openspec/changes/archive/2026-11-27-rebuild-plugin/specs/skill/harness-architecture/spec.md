# Spec Delta

## MODIFIED Requirements

### Requirement: Hand-off instead of building
When a question turns into a request to create, change, or audit harness
files, the agent SHALL name the layer that owns the work and the kind of
entry to start, SHALL state that decisions are agreed and a plan approved
before files are written, and SHALL create nothing.

#### Scenario: Question becomes a build
- **WHEN** after a placement answer the user says "OK, set that up"
- **THEN** the agent names the owning layer and the entry to invoke, and no file in the project changes

#### Scenario: Concurrency without the facts
- **WHEN** asked to design parallel work and the clients in use and the merge owner are unknown
- **THEN** the agent asks for both before recommending, and builds nothing

### Requirement: Outcomes
The agent SHALL answer from the method with the reason for each rule,
SHALL trace every trade-off to the project's Context and never to a
project label, SHALL give exactly one recommendation per decision, and
SHALL change no file.

#### Scenario: Placement of a commit rule
- **WHEN** asked whether the rule "never commit secrets" can live in a subdirectory entrypoint
- **THEN** the answer places it in the always-on block of the root entrypoint and as a secret-scan check, explains that a subdirectory file may never load, and creates no file

#### Scenario: Amount for a prototype
- **WHEN** asked what a prototype discarded within a quarter needs
- **THEN** the answer names the conditions it depends on, asks for the cost of a wrong change if unknown, and gives one default per affected layer instead of a setting for the whole project

#### Scenario: Two copies of a fact
- **WHEN** the test command appears with different flags in the entrypoint and a knowledge file
- **THEN** the answer names the task-runner recipe as the source, says both documents should name only the recipe, and edits neither

#### Scenario: Design and artifact disagree
- **WHEN** asked which is right when the project's anchor `HARNESS.md` and a permission file disagree about pushing
- **THEN** the answer says intent comes from the anchor document and facts from the code, so the artifact is fixed or the document is changed first

#### Scenario: Label offered as a reason
- **WHEN** the user says "it's only research code, so no checks"
- **THEN** the answer asks what a wrong change to the data pipeline costs before agreeing

#### Scenario: Evidence requested
- **WHEN** the user asks what the claim "long context files do not help" is based on
- **THEN** the answer cites only sources the skill carries and says so when it has none for a point

## ADDED Requirements

### Requirement: Where design intent lives
The agent SHALL answer that a project's design intent lives in a
`HARNESS.md` only where the project adopted one as its anchor document,
and otherwise in the harness artifacts and the decisions behind them;
that facts always come from the code; and that a `HARNESS.md` from
elsewhere is a reference with no authority over the project.

#### Scenario: Reference disagrees with an artifact
- **WHEN** asked whether a permission file is "wrong" because a downloaded `HARNESS.md` forbids what it allows
- **THEN** the answer says the downloaded file has no authority over the project and treats the difference as a design choice to weigh

#### Scenario: Project without a design file
- **WHEN** asked "we have no HARNESS.md, is our harness incomplete?"
- **THEN** the answer says no, explains what the file is for, and does not recommend creating one unless the user wants a record to keep or share
