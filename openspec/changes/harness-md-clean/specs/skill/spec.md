# Spec Delta

## ADDED Requirements

### Requirement: Tools
A tool is a user-invoked skill that settles no decision about a harness
and hands nothing to a builder. The requirements "Entries decide in
rounds", "Thickness per layer", and "Plan approval before any write"
SHALL NOT bind a tool. A tool's own spec SHALL state what the tool shows
and what the user confirms before it changes a file.

#### Scenario: Reading a tool's spec
- **WHEN** the spec of a skill of the class tool is read
- **THEN** it holds a requirement that says what is shown and confirmed before any file changes, with a scenario in which nothing is confirmed and nothing changes

#### Scenario: Tool asked for a harness decision
- **WHEN** a tool is running and the user asks it whether the project needs stricter gates
- **THEN** it says that the question belongs to an entry and continues only with its own job

## MODIFIED Requirements

### Requirement: Description budget
Skill descriptions share one budget because a client lists them all in a
bounded space. A layer builder's description SHALL be at most 240 characters,
a workflow's at most 400, a tool's at most 400, any other skill's at most
700, and all descriptions together at most 8,000.

#### Scenario: Description over its limit
- **WHEN** a layer builder's description is 260 characters long
- **THEN** `just skills-check` fails naming the skill, its length, and the limit

#### Scenario: Total over budget
- **WHEN** every description is within its own limit but their sum exceeds 8,000 characters
- **THEN** `just skills-check` fails and prints each skill's length

#### Scenario: Tool over its limit
- **WHEN** a tool's description is 420 characters long
- **THEN** `just skills-check` fails naming the skill as a tool, its length, and the limit

### Requirement: Workflows are user-invoked
The four entry skills (`harness-create`, `harness-improve`,
`harness-distill`, `harness-adopt`) and every tool SHALL carry
`disable-model-invocation: true`, and every other skill SHALL NOT.

#### Scenario: Workflow without the invocation switch
- **WHEN** `skills/harness-create/SKILL.md` lacks `disable-model-invocation: true`
- **THEN** `just skills-check` fails naming the file

#### Scenario: Tool without the invocation switch
- **WHEN** the `SKILL.md` of a tool lacks `disable-model-invocation: true`
- **THEN** `just skills-check` fails naming the file
