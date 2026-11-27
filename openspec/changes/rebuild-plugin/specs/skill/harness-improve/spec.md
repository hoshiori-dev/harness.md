# Spec Delta

## Purpose

Governs what an agent that loaded `harness-improve` observably does when
it analyses a project's existing agent harness and improves it: what it
inventories, how it reports and classifies what it finds, how it settles
the work with the user, how it uses reference files and an anchor
document, and how it executes and closes. The skill is user-invoked and
ships to Claude Code, Codex, and Antigravity.

Non-goals: a repository with no harness yet (`harness-create`); a single
layer built on its own; application test or CI fixes; writing README,
CONTRIBUTING, or SECURITY.

## ADDED Requirements

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
- **WHEN** the user runs the skill by name followed by the path of a `HARNESS.md` from another team
- **THEN** the skill loads and treats that file as a reference

#### Scenario: Review request without invocation
- **WHEN** the user asks "what is wrong with our AGENTS.md?" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Failing check without invocation
- **WHEN** the user says "CI is red on the lint job, fix it" without invoking the skill
- **THEN** the skill does not load

#### Scenario: Trim request without invocation
- **WHEN** the user says "our AGENTS.md is too long, trim it" without invoking the skill
- **THEN** the skill does not load

### Requirement: Nothing to improve
When the project holds no harness artifact the agent SHALL say so, name
`harness-create` as the entry that builds one, and stop. When it holds
only generic CI or a stray entrypoint with a few rules it SHALL say that
`harness-create` fits better and ask which entry to run.

#### Scenario: No harness
- **WHEN** the repository has no entrypoint, knowledge files, project skills, client settings, hooks, or agent-facing checks
- **THEN** the agent reports that there is nothing to analyse, names `harness-create`, and writes nothing

### Requirement: Inventory and analysis change nothing
The agent SHALL inventory every harness artifact with how an agent finds
it, when it loads, what it must agree with, and what keeps it current;
SHALL run the project's own harness self-check when one exists; SHALL
follow the entrypoint's pointers as a new agent would; and SHALL obtain
each layer's findings from the installed skill that claims the layer.
No file SHALL change during this.

#### Scenario: Complaint is a lead
- **WHEN** the user complained about one stale command
- **THEN** the complaint is checked first, every other copy of the stale fact is searched for, and the whole harness is still analysed

#### Scenario: File nothing links to
- **WHEN** a client settings file is linked from nowhere
- **THEN** the agent checks how it loads before calling it unreachable

### Requirement: Findings are classified and reported first
The agent SHALL report every finding with a class (stale, duplicated,
contradictory, invisible, missing, excessive), a severity, its evidence
as files and lines or command output, the source of truth, and one
proposed disposition, grouped by layer, before any decision about the
work. It SHALL then offer to stop with the report.

#### Scenario: Report only
- **WHEN** the user asked for a review only, or chooses to stop after the report
- **THEN** the work ends with the report and no file has changed

#### Scenario: Two rules contradict
- **WHEN** the entrypoint and a knowledge file state different merge rules and both read as intent
- **THEN** the finding asks which is the source of truth, with the evidence and a recommendation, and the agent does not pick

#### Scenario: Constraint proposed for thinning
- **WHEN** a check has not failed in the available history
- **THEN** it is reported as excessive only with that evidence, and "nobody remembers why it exists" is not offered as evidence

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
- **WHEN** the root file's context names a platform and a team the repository does not show
- **THEN** that is a high-severity finding and the agent asks whether the file is the project's anchor document or a reference

#### Scenario: No anchor document
- **WHEN** the project has a harness and no `HARNESS.md`
- **THEN** the analysis completes and no finding reports the missing file

### Requirement: The work is settled in rounds
After the report the agent SHALL settle in rounds: each finding's
disposition; repair or rebuild; the kinds of work (hardening, thinning,
carrier or platform migration, re-layering) and what each preserves; what
to inherit from each reference; the new thickness of each layer the work
touches; then each touched layer's decisions from its builder. Untouched
layers SHALL be listed as unchanged and not asked about.

#### Scenario: Reference is a whole project
- **WHEN** the reference given is the address or path of a repository and not a file
- **THEN** the agent says that `harness-adopt` turns a project into a reference and asks whether to run that first; if the user declines, the project is read through the read-only reader and not in the main conversation, or under the same limits with the read recorded as degraded when no reader can be dispatched

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

#### Scenario: Deletion in the plan
- **WHEN** the approved plan deletes an old client-specific entrypoint
- **THEN** the deletion still asks for its own go-ahead when reached, or is queued as a pending decision while the rest proceeds

#### Scenario: Nothing pending
- **WHEN** every item is done
- **THEN** the report says explicitly that nothing is pending and still lists the verification commands

### Requirement: Outcomes
Given a project and an invocation, the agent SHALL leave a result a
reader can judge without seeing the skill.

#### Scenario: Stale harness repaired
- **WHEN** the skill runs in a repository whose entrypoint names a removed test command in three places, routes to a deleted knowledge file, and has 190 lines
- **THEN** the report lists the stale command with all three locations, the dangling route, and the length, each classified with evidence; after the rounds and an approved plan the entrypoint names the task-runner recipe, the route is fixed or removed, and each change traces to a finding; the result fails if a file changed before approval, if a finding lacks evidence, or if a README was edited

#### Scenario: Review only
- **WHEN** the skill runs with "change nothing" on a harness with a permission file that allows force pushes
- **THEN** the result is a report with that finding at high severity and its evidence line, and `git status` shows no change

#### Scenario: Prototype becomes a product
- **WHEN** the skill runs with "this is going to production next month" on a thin harness and the user confirms a higher cost of error
- **THEN** the rounds propose a higher thickness for the layers that cost drives, each confirmed by the user, existing conventions are kept, and the plan adds only what the new thicknesses require
