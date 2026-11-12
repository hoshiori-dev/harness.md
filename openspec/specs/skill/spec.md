# Skill Catalog

## Purpose
Rules shared by every skill this plugin ships under `skills/`. Skills are the
portable component of Agent Plugins v1.0.0 and load unchanged in Claude Code,
Codex, Antigravity, and any other conforming client. Every skill serves one
document, a project's `HARNESS.md`: the format skill reads, writes, and
validates it; four user-invoked workflows design, build, extract, and audit;
seven layer builders hold the practice of one layer each; a manual explains
the methodology; the daily skills work inside a finished harness. Each shipped
skill has its own spec at `openspec/specs/skill/<name>/spec.md`, whose
scenarios are its behavioural test cases. Non-goals of the catalog: hosting an
MCP server, depending on any other skill library, shipping scripts that need a
runtime other than Python, or carrying the methodology as one document.

## Requirements

### Requirement: Skill package layout
Each skill SHALL be a directory `skills/<name>/` holding `SKILL.md` with YAML
frontmatter whose `name` equals `<name>` and whose `description` says what the
skill does and when to use it, following the agentskills.io specification.
Supporting material SHALL live in `references/`, `scripts/`, or `assets/`
inside the skill directory and be linked from `SKILL.md` by relative path.

#### Scenario: Valid skill is discovered by every client
- **WHEN** a client scans `skills/` one level deep
- **THEN** every directory containing `SKILL.md` is offered as a skill named by its frontmatter

#### Scenario: Frontmatter name mismatch is rejected before release
- **WHEN** `skills/<name>/SKILL.md` declares a different `name`
- **THEN** `just validate` fails naming the file and the expected name

### Requirement: Plugin skills do not shadow project skills
A skill name under `skills/` SHALL NOT also exist under `.agents/skills/`,
because Codex and Antigravity load both directories in this workspace.

#### Scenario: Duplicate name is reported
- **WHEN** `skills/<name>/` and `.agents/skills/<name>/` both exist
- **THEN** `just validate` fails and names both directories

### Requirement: Client-independent instructions
A skill SHALL describe its procedure in client-neutral terms and SHALL place
client-specific steps in a reference file organised by client, so the same
`SKILL.md` serves every client.

#### Scenario: Skill read in a client it does not name
- **WHEN** an Agent Plugins client other than Claude Code, Codex, or Antigravity loads the skill
- **THEN** the `SKILL.md` body contains no step that only one named client can perform

### Requirement: Self-containment
A skill SHALL link only to files inside its own directory, SHALL name no other
skill library or install command, and SHALL refer to another skill of this
plugin by its role, not its name. A paragraph shared between skills SHALL be a
shared block whose text equals the canon in
`.agents/knowledge/shared-blocks.md`.

#### Scenario: Link leaves the skill directory
- **WHEN** a `SKILL.md` or reference links to a path outside `skills/<name>/`
- **THEN** `just skills-check` fails naming the file and the link

#### Scenario: Shared block drifts from the canon
- **WHEN** a `<!-- shared:<id> -->` block in a skill differs from the canon text
- **THEN** `just skills-check` fails naming the skill and the id

### Requirement: Description budget
Skill descriptions share one budget because a client lists them all in a
bounded space. A layer builder's description SHALL be at most 240 characters,
a workflow's at most 400, any other skill's at most 700, and all descriptions
together at most 8,000.

#### Scenario: Description over its limit
- **WHEN** a layer builder's description is 260 characters long
- **THEN** `just skills-check` fails naming the skill, its length, and the limit

#### Scenario: Total over budget
- **WHEN** every description is within its own limit but their sum exceeds 8,000 characters
- **THEN** `just skills-check` fails and prints each skill's length

### Requirement: Workflows are user-invoked
The four workflow skills (`harness-design`, `harness-build`, `harness-extract`,
`harness-audit`) SHALL carry `disable-model-invocation: true`, and every other
skill SHALL NOT.

#### Scenario: Workflow without the invocation switch
- **WHEN** `skills/harness-build/SKILL.md` lacks `disable-model-invocation: true`
- **THEN** `just skills-check` fails naming the file

### Requirement: One builder per layer
For each of the seven layers (Environment, Knowledge, Feedback, Gates,
Authority, Completion, Entropy) exactly one skill, named `<layer>-building` in
lowercase, SHALL state `Owns the <Layer> layer` in its description, and no
other skill SHALL contain the phrase. Workflows SHALL find builders by that
phrase and name none.

#### Scenario: Builder without its layer
- **WHEN** a `-building` skill other than `project-skill-building` lacks the phrase or names an unknown layer
- **THEN** `just skills-check` fails naming the skill and the known layers

#### Scenario: Layer without a builder
- **WHEN** no skill claims the Feedback layer
- **THEN** `just skills-check` fails naming the layer

### Requirement: Builders share four modes and six steps
A layer builder SHALL work in four modes (design, extract, build, audit) and
its `SKILL.md` SHALL carry the six workflow steps Observe, Write the section,
Build, Verify, Audit, and Hand back, in that order, so that a workflow can
address any builder the same way. Only build mode SHALL write files.

#### Scenario: Builder asked to audit
- **WHEN** a workflow hands a layer to its builder in audit mode
- **THEN** the builder reports findings with evidence and changes no file

#### Scenario: Step heading missing
- **WHEN** a builder's `SKILL.md` lacks the `### 5. Audit` heading
- **THEN** `just skills-check` fails naming the skill and the heading

### Requirement: Deposits stand alone
Nothing a skill writes into a target project SHALL name this plugin, its
skills or agent, or a path inside a skill directory. `HARNESS.md` and its
section names MAY be named.

#### Scenario: Reviewing a built harness
- **WHEN** the files a workflow deposited in a target project are searched for the plugin's name and skill names
- **THEN** nothing is found

### Requirement: Delivered scripts are tested Python
Every script under a skill's `scripts/` or `assets/` SHALL be Python with
PEP 723 inline metadata requiring Python 3.10 or later, SHALL run under uv,
SHALL offer `--help`, and SHALL have a sibling `<name>_test.py` run by
`just test`.

#### Scenario: Script asset without a test
- **WHEN** `skills/<name>/assets/tool.py` exists without `tool_test.py`
- **THEN** `just skills-check` fails naming the missing test

#### Scenario: Placeholder outside a configure line
- **WHEN** an asset contains `{{NAME}}` on a line without `# CONFIGURE:`
- **THEN** `just skills-check` fails naming the file and line

### Requirement: Documented in both READMEs
Every shipped skill SHALL appear in the skill table of `README.md` and of
`README.zh.md`.

#### Scenario: Skill missing from one README
- **WHEN** `skills/<name>/` exists but one README's skill table lacks it
- **THEN** `just harness-check` fails naming the README and the skill
