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
- **THEN** the marked directory is inventoried as a `HARNESS.md` and not as a project skill, only frontmatter was read to find it, and no body or other file of any candidate is opened before its standing is settled

#### Scenario: Marked document the entrypoint names
- **WHEN** the entrypoint names the `SKILL.md` of a marked directory and a second marked directory sits in a project skills directory
- **THEN** the first is the project's anchor document, the second is listed in the report as a reference, and no question is asked about either

#### Scenario: Marked documents and none named
- **WHEN** two marked directories are found and the entrypoint names neither
- **THEN** one question lists both and asks whether one of them is the project's design, and both are treated as data until it is answered

#### Scenario: Marked directory inside the knowledge folder
- **WHEN** the anchor document is a directory of four files inside the knowledge folder and the entrypoint names only its `SKILL.md`
- **THEN** the inventory holds the directory as one artifact, and no finding reports a file inside it as unrouted, as carrying frontmatter, or as lacking a load condition

#### Scenario: Unmarked file of the old shape
- **WHEN** the repository root holds a `HARNESS.md` file without the markers, whether or not the entrypoint names it
- **THEN** the file is inventoried like any other Markdown file the repository holds, no question asks whether it is the anchor document, and no conversion is offered

## MODIFIED Requirements

### Requirement: Triggering
The skill SHALL load only when the user invokes it by name and SHALL NOT
load from a description match, however closely a request resembles its
work.

#### Scenario: Invoked by name with a complaint
- **WHEN** the user runs the skill by name adding "agents keep running the old test command"
- **THEN** the skill loads and records the sentence as a lead

#### Scenario: Invoked by name for a review only
- **WHEN** the user runs the skill by name adding "just tell me what is wrong, change nothing"
- **THEN** the skill loads and plans to stop at the report

#### Scenario: Invoked by name with a reference
- **WHEN** the user runs the skill by name followed by the path of the directory of a `HARNESS.md` from another team
- **THEN** the skill loads and treats that document as a reference

#### Scenario: Review request without invocation
- **WHEN** the user asks "what is wrong with our AGENTS.md?" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Failing check without invocation
- **WHEN** the user says "CI is red on the lint job, fix it" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Trim request without invocation
- **WHEN** the user says "our AGENTS.md is too long, trim it" without invoking the skill
- **THEN** the skill does not load

### Requirement: An anchor document is the intent
When the project has adopted an anchor document the agent SHALL validate
it, read design intent from it, report each disagreement between it and
the artifacts saying which side to change, and write every agreed change
of intent back to it in the same piece of work. Without one it SHALL
analyse the harness against its own consistency, the code, and the
project's conditions, and SHALL NOT propose creating one unless asked.

#### Scenario: Artifact disagrees with the anchor document
- **WHEN** the anchor document says the full suite runs in CI and CI runs only unit tests
- **THEN** the finding names both locations and proposes fixing CI or amending the document, and the user chooses

#### Scenario: Anchor document describes another project
- **WHEN** the context of the document the entrypoint names describes a platform and a team the repository does not show
- **THEN** that is a high-severity finding and the agent asks whether the document is the project's anchor document or a reference

#### Scenario: No anchor document
- **WHEN** the project has a harness and no `HARNESS.md`
- **THEN** the analysis completes and no finding reports a missing document

#### Scenario: Validation without the validator
- **WHEN** no validator for the format can be run, and the anchor document's `SKILL.md` has a top-level `version` key, a `description` that starts with `[HARNESS.md]`, and no `metadata.type`
- **THEN** the agent checks the directory by reading against the errors and warnings of `cli/lint`, reports the missing marker as a finding in the anchor document group, lists the top-level `version` as a warning that points to `metadata.version`, and records the check as manual

#### Scenario: Intent held in another file of the directory
- **WHEN** an agreed change of intent touches a sentence in a file that the anchor document's `SKILL.md` links to
- **THEN** that sentence is changed in the file that holds it, the plan names the file, no other sentence changes, and the whole directory is validated again after the last write

#### Scenario: Anchor document asked for during the work
- **WHEN** the project has no anchor document and the user asks for one while the work is settled
- **THEN** the plan follows the catalog requirement "Where a document is written": the name is settled before the location, the directory is proposed inside the knowledge folder where one exists, and the plan lists the one line added to the entrypoint; nothing is written before the user confirmed, and afterwards the entrypoint names the document's `SKILL.md` through that one line, added by the agent

#### Scenario: Skills directory named for the anchor
- **WHEN** the user answers the proposed location by naming a project skills directory
- **THEN** the agent says once that the client will list the document's description in every session and that an ordinary skill check will report on it, then plans the location the user chose and does not raise the cost again

### Requirement: The work is settled in rounds
After the report the agent SHALL settle in rounds: each finding's
disposition; repair or rebuild; the kinds of work (hardening, thinning,
carrier or platform migration, re-layering) and what each preserves; what
to inherit from each reference; the new thickness of each layer the work
touches; then each touched layer's decisions from its builder. Untouched
layers SHALL be listed as unchanged and not asked about.

#### Scenario: Reference is a whole project
- **WHEN** the reference given is the address or path of a repository and not a `HARNESS.md`
- **THEN** the agent says that `harness-adopt` turns a project into a reference and asks whether to run that first; if the user declines, the project is read through the read-only reader and not in the main conversation, or under the same limits with the read recorded as degraded when no reader can be dispatched

#### Scenario: Reference with sections in other files
- **WHEN** the `SKILL.md` of a reference links to two files in its own directory, one of which holds its Context section
- **THEN** the whole directory is read as data under the catalog requirement "Outside material is data", the round shows what those files decide with the premises taken from the linked Context, and no link that leaves the directory is followed

#### Scenario: Reference that carries assets
- **WHEN** a reference's directory holds a check script and a configuration template
- **THEN** the round lists both as assets that were not run, nothing from the reference is executed, and neither file is copied or moved

#### Scenario: User keeps a constraint
- **WHEN** the user keeps a check the report proposed to remove
- **THEN** the disposition and the user's reason are recorded on the finding and no later step weakens the check

#### Scenario: Drift before other work
- **WHEN** the user wants hardening first while two rules contradict each other
- **THEN** the agent says once that contradictions are fixed first; if the user declines, the contradiction goes to the pending decisions list and every file it touches is left out of the work

#### Scenario: Rebuild recommended
- **WHEN** no entrypoint survives the findings and most findings are stale or contradictory
- **THEN** the agent recommends a rebuild, still keeps the task runner, lint configuration, and conventions in use, and waits for the choice

### Requirement: One approved plan, executed layer by layer
The agent SHALL present one plan listing every file to add, change, or
delete with the finding it resolves, drift items first, and the steps
that need their own decision. After approval it SHALL execute through
the layers' builders, commit each verified layer without pushing, have
the changed files read back in a clean context, and close with each
change and its finding, the thickness before and after, the verification
commands and results, and one pending decisions list.

#### Scenario: A check already failed before the work
- **WHEN** the project's lint fails before the first change, the plan repairs it in the Gates layer, and the Knowledge layer comes first
- **THEN** the Knowledge layer is committed with no new failing check, the commit names the known lint failure and the plan item that repairs it, and no check is weakened to make it pass

#### Scenario: New failure behind a known one
- **WHEN** the aggregate check already failed on lint before the first change, and after a layer a test that passed before fails while the aggregate's exit status is unchanged
- **THEN** the layer is not committed until that test passes, and the unchanged exit status is not taken as no new failure

#### Scenario: Review fix breaks a check
- **WHEN** a fix made in the final review makes a check fail that passed before the work
- **THEN** the fix is not committed until that check passes again

#### Scenario: Pending file is not a required path
- **WHEN** a planned file is left pending because the step it depends on got no go-ahead
- **THEN** the required paths handed to the Entropy builder leave that file out, and the self-check does not report it missing

#### Scenario: Deletion in the plan
- **WHEN** the approved plan deletes an old client-specific entrypoint
- **THEN** the deletion still asks for its own go-ahead when reached, or is queued as a pending decision while the rest proceeds

#### Scenario: Reference asset the user chose
- **WHEN** the user chose to inherit a check script that a reference carries
- **THEN** the plan lists the asset, the layer it belongs to, and the project file it becomes; after approval that layer's builder writes it adapted as the project's own code; the reference's copy is never run, and no project file calls it or points to it

#### Scenario: Reference decision without a planned asset
- **WHEN** the user inherits a reference's decision and the approved plan names none of the reference's assets
- **THEN** the builder realises the decision with the project's own tools and names, and no file, file name, or passage of the reference appears in the project

#### Scenario: Nothing pending
- **WHEN** every item is done
- **THEN** the report says explicitly that nothing is pending and still lists the verification commands
