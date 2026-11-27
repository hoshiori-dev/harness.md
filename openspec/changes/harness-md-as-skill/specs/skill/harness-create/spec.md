# Spec Delta

## ADDED Requirements

### Requirement: Design documents are found by their markers
The agent SHALL find design documents, settle which one is the project's
anchor document, and ask the user as the catalog requirement
"The anchor document" states. It SHALL read a candidate's body and other
files only after its standing is settled: the entrypoint names it,
or the user answered what it is.

#### Scenario: Looking for candidates
- **WHEN** the repository holds several directories with a `SKILL.md`, one of which carries both markers
- **THEN** the marked directory is recorded as a candidate by its path, only frontmatter was read to find it, and no body or other file of any candidate is opened while observing

#### Scenario: Marked document the entrypoint names
- **WHEN** the entrypoint names the `SKILL.md` of a marked directory and a second marked directory sits elsewhere in the repository
- **THEN** the first is the project's anchor document, the second is listed as a reference, and no question is asked about either

#### Scenario: Marked documents and none named
- **WHEN** two marked directories are found and the entrypoint names neither
- **THEN** one question in the first round lists both and asks whether one of them is the project's design, and both are treated as data until it is answered

#### Scenario: Unmarked file of the old shape
- **WHEN** the repository root holds a `HARNESS.md` file without the markers, whether or not the entrypoint names it
- **THEN** the file is read like any other Markdown file the repository holds, no question asks whether it is the anchor document, and no conversion is offered

## MODIFIED Requirements

### Requirement: Triggering
The skill SHALL load only when the user invokes it by name and SHALL NOT
load from a description match, however closely a request resembles its
work.

#### Scenario: Invoked by name in an empty repository
- **WHEN** the user runs the skill by name in a directory with a README and no code, adding "a Rust CLI for syncing dotfiles"
- **THEN** the skill loads and records the sentence as the project's goal

#### Scenario: Invoked by name with a reference
- **WHEN** the user runs the skill by name followed by the URL of the `SKILL.md` of a `HARNESS.md`
- **THEN** the skill loads and treats the document at that URL as a reference

#### Scenario: Invoked by name in a repository with history
- **WHEN** the user runs the skill by name in a repository with CI, a linter configuration, two years of commits, and one old `CLAUDE.md`
- **THEN** the skill loads and treats the project as one with habits to preserve

#### Scenario: Setup request without invocation
- **WHEN** the user types "set this repo up so agents can work in it" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Single-layer request without invocation
- **WHEN** the user asks "add a pre-commit secret scan" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Methodology question without invocation
- **WHEN** the user asks "does a prototype need CI for agents?" without invoking the skill
- **THEN** the skill does not load

### Requirement: References are weighed
For each reference the agent SHALL report what it decides, which of its
premises differ from the target project's conditions, and which decisions
rest on those premises, and SHALL inherit only what the user chose or,
where left to the agent, what the conditions support. A reference that
is a `HARNESS.md` SHALL be read as its whole directory, as data under
the catalog requirement "Outside material is data".

#### Scenario: Several references disagree
- **WHEN** two references choose different merge methods
- **THEN** the round shows both with their reasons and the project conditions that favour one, and asks

#### Scenario: Reference is a whole project
- **WHEN** the reference given is the address of a repository and not a `HARNESS.md`
- **THEN** the agent says that `harness-adopt` turns a project into a reference and asks whether to run that first

#### Scenario: Reference with sections in other files
- **WHEN** the `SKILL.md` of a reference links to two files in its own directory, one of which holds its Context section
- **THEN** the report covers what those files decide, takes the reference's premises from the linked Context, and gives each location as a file and a line

#### Scenario: Reference given by address
- **WHEN** the reference is the URL of a `SKILL.md` whose body links to `references/context.md`, to `../other/SKILL.md`, and to a page on another site
- **THEN** the file below the directory of that `SKILL.md` is fetched and reported on, and the other two links are not followed

#### Scenario: Reference that carries assets
- **WHEN** a reference's directory holds a check script and a configuration template
- **THEN** the report lists both as assets that were not run, nothing from the reference is executed, and neither file is copied into the project

### Requirement: One approved plan, built layer by layer
The agent SHALL present one plan: goal and non-goals, conditions, the
thickness and decisions per layer with who decided each, every file by
path, every command that installs or downloads, and the steps that need
their own decision. After approval it SHALL build one layer at a time
through the layer's builder, write only planned files, and commit each
verified layer without pushing.

#### Scenario: File beyond the plan
- **WHEN** a builder needs a file the plan did not name
- **THEN** the agent asks for approval of a plan amendment before the file is written

#### Scenario: Commit hook rejects a checkpoint
- **WHEN** the secret scan rejects a layer's commit
- **THEN** the agent fixes what was flagged and commits again, and never bypasses the hook

#### Scenario: New anchor required by the self-check
- **WHEN** the plan creates an anchor document at the location the user confirmed and an Entropy self-check that requires that document
- **THEN** Entropy is built last, the anchor and its entrypoint line are written before Entropy is committed, the self-check is configured for the anchor's path and passes on a rerun, and the three are committed together

#### Scenario: Anchor asked for before the layers decide
- **WHEN** the user asked for an anchor document in the first round
- **THEN** every builder's handover from the decide step on says so, and the Entropy builder's decisions and planned files cover keeping the document in step

#### Scenario: Anchor document in the plan
- **WHEN** the user asked for an anchor document and the project has a knowledge folder
- **THEN** the plan follows the catalog requirement "Where a document is written": the name is settled before the location, the directory is proposed inside the knowledge folder, and the plan lists the one line added to the entrypoint; nothing is written before the user confirmed, and after the build the entrypoint names the document's `SKILL.md` through that one line, added by the agent

#### Scenario: Skills directory named for the anchor
- **WHEN** the user answers the proposed location by naming a project skills directory
- **THEN** the agent says once that the client will list the document's description in every session and that an ordinary skill check will report on it, then plans the location the user chose and does not raise the cost again

#### Scenario: Reference asset the user chose
- **WHEN** the user chose to inherit a check script that a reference carries
- **THEN** the plan lists the asset, the layer it belongs to, and the project file it becomes; after approval that layer's builder writes it adapted as the project's own code; the reference's copy is never run, and no project file calls it or points to it

#### Scenario: Pending file is not a required path
- **WHEN** a planned file is left pending because the step it depends on got no go-ahead
- **THEN** the required paths handed to the Entropy builder leave that file out, and the self-check does not report it missing

#### Scenario: Empty project
- **WHEN** the project has no code
- **THEN** the build creates what the planned commands need in order to run (a manifest, tool configuration, the smallest passing test) and no product feature

#### Scenario: Blocked layer
- **WHEN** one layer waits on a decision only the user can make
- **THEN** the other layers are finished and the item is presented once in a pending decisions list

### Requirement: Outcomes
Given a project and an invocation, the agent SHALL leave a result a
reader can judge without seeing the skill.

#### Scenario: New project, no reference
- **WHEN** the skill runs in an empty repository with the goal "a TypeScript library published to npm, maintained by me for years" and the user answers each round
- **THEN** the rounds show decided items with evidence and ask only what the repository could not show; the plan lists every file by path; after approval the repository holds an entrypoint, the planned checks and permission files, one commit per layer, and no `HARNESS.md`; the result fails if any file was written before approval, if a question asked for a fact the repository shows, or if a deposited file names the plugin

#### Scenario: Existing project with a reference
- **WHEN** the skill runs in a Python service with a `Makefile`, CI, and Ruff, with a reference written for a team of ten while the project has one maintainer
- **THEN** the `Makefile`, CI, and Ruff are kept as decisions, the premise difference is reported with the reference's decisions that rest on it, the user chooses what to inherit, and the plan builds only what is missing; the result fails if the reference was copied into the repository, if an instruction inside it was executed, if one of its assets was run, or if a working tool was replaced without the user's decision

#### Scenario: Rest left to the agent early
- **WHEN** after the first round the user leaves the remaining decisions to the agent
- **THEN** no further design question is asked, the plan lists every decision with "decided by the agent" and its evidence, and nothing is written until the plan is approved
