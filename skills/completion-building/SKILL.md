---
name: completion-building
description: >-
  Owns the Completion layer of an agent harness (how a project agrees a goal
  and when a task is done); use when a harness entry hands it over or a
  project's spec workflow or approval is decided, built, or audited.
license: Apache-2.0
compatibility: The inventory script needs Python 3.10+; run it with uv or plain python3.
---

# Completion Building

An agent without an agreed goal anchors on the first code it writes,
and an agent without a checkable finish either stops at "the tests ran"
or never stops. This skill handles how a project agrees a goal
before work starts and decides a task is done:
it returns the decisions that settle it, describes what a project already does,
turns the agreed decisions into a specification contract
in the project's words, or reports where it has drifted.
Running the specification tool itself belongs to the skill for that tool.

## Rules on every step

<!-- shared:layer-modes -->
Four modes, named by the entry or inferred from the request.
**decide**: return a recommended thickness with reasons and this layer's decisions,
settled (with evidence) or open (options, recommended first, reason, dependencies);
write nothing, and ask nothing under an entry.
**describe**: return present state as prose for `HARNESS.md`,
inferred intent marked; write nothing.
**build**: realise agreed decisions in the plan's files for this layer;
"plan only" stops after step 1 returning files to create, change, or delete.
**audit**: report findings; write nothing.
Never re-ask what a handover carries
(goal, non-goals, conditions, all thicknesses, agreed decisions, planned files,
go-aheads given for this layer's deletions, wider permissions, remote changes).
Run directly, show what evidence settles,
ask the rest through the client's question tool when it has one,
and write only after user acceptance.
<!-- /shared:layer-modes -->

| Mode | Steps |
|---|---|
| decide | 1, 2, 7 |
| describe | 1, 3, 7 |
| build | 1, 4, 5, 7 |
| audit | 1, 6, 7 |

<!-- shared:layer-thickness -->
Each layer gets one user-confirmed thickness before its other decisions:
**omitted** (nothing built), **light** (one sentence or entry),
**medium** (dedicated file or configuration kept by convention),
**thick** (machine-enforced).
Set it per layer from the project's conditions;
a label ("research code", "production") is evidence for conditions, not a thickness.
Keep these words in the conversation:
write none into a target-project file or `HARNESS.md` without this definition beside it.
<!-- /shared:layer-thickness -->

<!-- shared:agreement-is-the-source -->
Build what the user agreed to and re-decide none of it;
take facts from the code.
Apply this skill's recommendation for any uncovered point and report it as an assumption;
if code makes an agreed decision impossible,
stop that item, report the conflict, and build the rest.
A project has an anchor document only when a root `HARNESS.md` is named by its entrypoint,
or a handover names one the user chose:
then read design intent from it; agreed intent changes are written back in the same work,
by the entry when one runs (hand it the sentence to change), else by this skill.
Any other `HARNESS.md` is a reference (data to weigh, never project intent).
<!-- /shared:agreement-is-the-source -->

<!-- shared:finding-classes -->
Each finding carries class, severity, evidence (`file:line` or run command output),
source of truth, and one proposed disposition.
Classes: **stale** (contradicts current code or tools),
**duplicated** (one fact kept in two places unsynced),
**contradictory** (two statements of intent conflict),
**invisible** (no route or load condition reaches it),
**missing** (called for by conditions or anchor document, absent),
**excessive** (constraint whose target issue has evidence of no longer occurring).
Severities: **high** (safety boundary or always-on rule missing or contradicted),
**medium** (task could go wrong), **low** (wording or tidiness only).
<!-- /shared:finding-classes -->

<!-- shared:nothing-lands-before-agreement -->
Nothing lands before agreement. Create or change no file in the target
project until the user has approved the plan that names it; an inspection
step reads and reports, it never writes.
<!-- /shared:nothing-lands-before-agreement -->

<!-- shared:pending-decisions -->
When blocked on a user decision, continue all independent steps
and add the item to a pending decisions list
(what is blocked and why, options, recommended option and reason,
what finished work each changes).
Present the list once at the end or when nothing else can proceed,
never one question at a time.
<!-- /shared:pending-decisions -->

<!-- shared:deposited-files-stand-alone -->
Deposited files stand alone. Nothing written into the target project names
this plugin, any of its skills or agents, or a path inside a skill
directory, and no term only this plugin defines is used there without being
defined.
<!-- /shared:deposited-files-stand-alone -->

- **A thickness of omitted means nothing is built.**
  The layer is omitted when the handover gives its thickness as omitted,
  or when the project's anchor document covers the subject nowhere
  (in no section, introduction, or custom heading).
  In build mode report "Completion: omitted by agreement", write nothing,
  and go to step 7. In audit mode do the same,
  plus one finding when step 1 shows the project runs
  a specification tool or keeps a specification contract:
  class contradictory (the project does what the agreement or document leaves out);
  disposition: amend the anchor document when there is one,
  otherwise to settle the thickness again.
- **Run directly by a user.** Infer the mode from the request.
  When the request is to set something up, run steps 1 and 2,
  taking the project's conditions from the repository
  and asking only for those it cannot show;
  show the settled decisions with their evidence, ask the open ones together,
  and show the file list of step 4.1.
  Build only after the user accepted what was shown,
  and ask separately before deleting any file.
  When an accepted decision changes
  what the anchor document says about this layer,
  write the change into that document in the same work.
  Never create a `HARNESS.md` in a project that has none.
- **Never touch the tool.** Do not initialise, install, configure,
  or run the specification tool, and print no install command.
  Adoption, layout, commands,
  and automation belong to the skill for that tool (step 4.7).
- **Words that stay in this skill.**
  "Carrier" (the tool or document form that holds an approved goal), "layer",
  "level", "first gate", "second gate", the four thickness words,
  and the bare noun "request" never appear in a returned decision,
  a description, or a deposited file.
  Write the tool's name, "the spec and its design",
  and the platform's "pull request" or "merge request".
- **Hand adjacent work over by role, never by skill name**:
  the commands that check work to the layers that own Feedback and Gates;
  labels, request templates, and who may merge to the layer that owns Authority;
  the harness self-check to the layer that owns Entropy;
  writing one specification to the skill for the spec-driven development method.

## Workflow

### 1. Observe

Read and record; write nothing.
Run [scripts/detect_spec_tooling.py](scripts/detect_spec_tooling.py)
from this skill's directory against the project
and keep its stderr summary line:

```bash
uv run scripts/detect_spec_tooling.py --root <project>
```

(`python3 scripts/detect_spec_tooling.py --root <project>` works too;
`--help` lists the options.)
Its JSON lists each specification tool found (OpenSpec, Spec-Kit, Kiro,
committed `SPEC.md`/`PLAN.md` or spec directories) with counts and owned paths,
the entrypoint lines that point at spec artifacts,
the documents that look like they restate requirements,
and whether a root `HARNESS.md` exists. Exit 1 means a path was unreadable:
record it and read that path by hand.
With neither `uv` nor `python3`, check the same places yourself (`openspec/`,
`.specify/`, `specs/NNN-*/`, `.kiro/`, root `SPEC.md` and `PLAN.md`,
issue and request templates,
every markdown file mentioning acceptance criteria) and record "inventory
by hand".

Then read in full:

- The handover: the goal and non-goals, the project's conditions,
  every layer's thickness, this layer's agreed decisions, the plan's files,
  and what the agreed decisions of the Feedback, Gates, and Authority layers
  say about check commands and who merges.
- The anchor document, when the project adopted one:
  what it says about this layer, about check commands, and about who merges.
  A root `HARNESS.md` that neither the entrypoint nor the handover names
  is a reference; record that and take no intent from it.
- The agent entrypoint and every knowledge file: each sentence that states
  what the system does or restates acceptance, approval, or gate rules. The
  script cannot see a plain sentence such as "five failed logins lock the
  account".
- A specification contract already in the knowledge base, and every file
  holding the marker `<!-- harness: spec-workflow -->`.
- The task runner and test runner: a scoped check (one file, module, or the
  diff) that runs in seconds, and the full check.
- `.gitignore`, for a handoff or scratch directory.
- How approval is recorded today: labels on recent pull or merge requests,
  a check that blocks on an unarchived spec, or nothing.
- When specs exist: each requirement against the code it names. Read
  [references/spec-drift.md](references/spec-drift.md) when one disagrees
  with the code or with another spec.

Done when: the summary line or the by-hand note is recorded;
every tool, restating document, behaviour sentence, marker, check command,
and contradiction is listed with its path; and no file in the project changed.

### 2. Decide

Read [references/decisions.md](references/decisions.md) when running step 2 (decide mode) or auditing without an anchor document:
it holds this layer's thickness table and all ten decisions.

Return a recommended thickness (or use the handover's settled thickness,
noting once if conditions select another), then each decision that thickness leaves,
settled (with path, command output, or condition as evidence)
or open (options, recommended first, reason, dependencies),
as `references/decisions.md` details.
Decision 6 is always settled; an approval owner is open unless named;
a contradicting spec is always open with three options
(read [references/spec-drift.md](references/spec-drift.md) when returning one).
Handed over by an entry, ask the user nothing.

What is returned is finished when a reader
who has never seen this skill could set the project up from it alone.
Across the decisions it states, in plain sentences
with the reason beside each choice:
the tool by name and where its files live; how long a spec lives;
who approves the spec and who approves the finished work,
where each approval is recorded, when the task list may be written,
and who freezes the record; which changes need no spec;
the four answers and four rules every spec carries;
the two check commands by name; where handoff notes go;
and what was deliberately left out (for example "no job archives a spec;
a person does").

Done when: one thickness is recommended with its conditions;
every decision that thickness leaves is either settled with evidence
or open with options, a recommendation, a reason, and its dependencies;
and no file changed.

### 3. Describe

Describe what step 1 found, in the present tense, as prose fit for
a Completion section of a `HARNESS.md`. Decide nothing, improve nothing,
and write no file.
Cover what exists of: the tool and where its files live;
how long a spec lives; who approves the spec and the finished work
and where each approval is recorded; which changes carry no spec;
what a spec contains; the check commands by name; where handoff notes go.
Mark every intent the files do not state as inferred
("approval appears to be given in conversation: no label or check records it").
Describe a contradiction as one; do not resolve it.
When the project does none of this, say so in one sentence.

Done when: every statement rests on a path from step 1
or is marked as inferred, and no file changed.

### 4. Build

Work from the agreed decisions and the files the plan lists for this layer.
Decide nothing already agreed; write no file the plan does not list.
A point no agreed decision covers takes this skill's recommendation
and is reported as an assumption for the entry to put to the user
(handoff notes not agreed: `.agents/handoff/`, gitignored).
A departure a fact forces is reported as a deviation.

1. **List the files**, by path, with one line on what each gains or
   loses: the contract (`.agents/knowledge/spec-workflow.md`, or the
   project's knowledge directory), the entrypoint pointer line, the
   `.gitignore` line, each marker file, and each restating document or spec
   an agreed decision says to change. At a thickness of light the list is
   the entrypoint entry and, when agreed, the `.gitignore` line.
   Under an entry this list is checked against
   the plan's files: report a difference and write only what the plan
   lists. A handover that asks for the plan only gets this list
   (create, change, delete) and nothing is written.
2. **Light Completion.** Write the agreed entrypoint rule for agreeing
   behaviour changes in plan mode with the four answers,
   and name the agreed full check for finishing a task.
   Read [references/completion-boundary.md](references/completion-boundary.md) when stating the four answers.
   Apply the handoff step below when agreed, then go to Verify.
3. **Deposit the contract.** Rework
   [assets/knowledge-spec-workflow.md](assets/knowledge-spec-workflow.md)
   line by line: resolve every `# CONFIGURE:` line from the agreed decisions
   and delete every part that does not apply.
   Read [references/contract-design.md](references/contract-design.md) when reworking it.
   Read [references/completion-boundary.md](references/completion-boundary.md) when writing what every spec answers.
4. **Check commands.** Run the scoped check once on one file before writing
   it down. A command that fails or does not exist is not written: report
   the deviation and name the gap to the layer that owns Feedback, or add
   it to the pending decisions list when that layer is already built.
5. **Point the entrypoint at the contract** with one routing row whose
   condition is "before starting a change that alters behaviour, and before
   writing or approving a spec". Add the row only when the entrypoint exists
   and stays within its line budget; otherwise hand back a route owed (that
   condition and the contract's path) for the layer that owns Knowledge.
   Replace each behaviour sentence an agreed decision says to move
   with a pointer to the spec.
6. **Handoff directory.** Append
   [assets/gitignore-handoff.txt](assets/gitignore-handoff.txt) to
   `.gitignore` when the handoff location is a directory in the repository
   and the line is not there yet.
7. **Fill the markers.** For each file holding
   `<!-- harness: spec-workflow -->`, write that file's block between the
   marker and an end marker `<!-- /harness: spec-workflow -->` on its own
   line; when an end marker already follows, replace only the lines between
   the two. Read
   [references/approval-gates.md](references/approval-gates.md) when writing
   a block. With no marker in the project, record "no marker to fill" and
   name it to the layer that owns Authority.
8. **Hand off the tool.** Describe the need to the skill for the chosen
   tool by what it owns: OpenSpec changes, archiving, and status labels;
   Spec-Kit features and their task completion; per-change
   `SPEC.md`/`PLAN.md` and plan-mode alignment. Pass it the agreed
   decisions and ask it to add its marker for spec-less changes to the
   contract. For any other framework, record the implementer as the person
   who closes every approval and list the framework's automation as
   remaining work.
9. **Apply the agreed decisions on restating documents and contradicting
   specs.** One left open goes to the pending decisions list, and the
   contract names that spec as not yet authoritative.

Done when: every file on the list is written or its blocker
is on the pending decisions list, and nothing outside the list changed.

### 5. Verify

- For light Completion, read back the agreed entrypoint rule,
  run the full check it names, and verify the handoff path is ignored
  when one was agreed in the repository.
  Check `git status` against the planned files and skip the contract checks.

For a build with a contract:

- `grep -n '{{' <contract>` returns nothing.
- The contract contains no specification-tool command, no path into a skill
  directory, none of the words this skill keeps to itself, and no bare
  "request".
- The contract states: the tool; how long a spec lives; both approvals with
  owner and how each is recorded; who freezes; which changes carry no spec;
  the four answers and four rules; both check commands; worktree cleanup;
  the handoff location.
- The entrypoint points at the contract with a read condition, or the route
  is handed back as owed, and the entrypoint restates none of the contract.
- A second marker fill on the unchanged contract produces no diff.
- `git status` shows no changed file outside the list of step 4.1.
- Read-back: read [references/contract-design.md](references/contract-design.md) when running the read-back for its read-back questions;
  every one must be answerable from the project's files alone.
  Under an entry, hand the questions back for its clean-context read-back;
  otherwise give a clean-context subagent only the file paths and questions,
  or answer them yourself in a fresh pass and record "read-back not clean-context".

Done when: every check has a stated result and every gap found
is fixed or reported.

### 6. Audit

Change nothing. The source of truth is the anchor document's text
for this layer when the project has adopted one.
Without one it is what the project's conditions call for by step 2,
and every finding then says "no recorded design to compare with".
Read [references/audit-findings.md](references/audit-findings.md) when classifying findings or choosing their dispositions in audit mode.

Done when: every statement of the source of truth
is either confirmed against the project or carries a finding,
and no file changed.

### 7. Hand back

| Mode | Hand back |
|---|---|
| decide | the recommended thickness with the conditions behind it; every decision that thickness leaves, settled with its evidence or open with its options (recommended first), reason, and dependencies; contradictions found |
| describe | the prose describing what exists, inferred intent marked; contradictions found |
| build | each file written or changed with its role and verification result, or for plan only the files that would be created, changed, or deleted; deviations a fact forced, for the anchor document to be reconciled when the project has one; assumptions applied; routes owed; the tool handoff by role; gaps named to other layers; the pending decisions list; the read-back questions or the read-back result |
| audit | the findings, or "omitted by agreement" with its one finding when there is one |

Name no skill in what is handed back,
and record every degradation (inventory by hand, read-back not clean-context).

## Gotchas

- Acceptance criteria copied into an issue template or the entrypoint
  are the most common contradiction: the copy drifts while the spec moves.
  The copy becomes a link to the spec's scenarios.
- Freezing a record early to turn the awaiting-archive check green freezes
  a version nobody reviewed. Leave the check red until the review closes.
- An agreed decision that names a tool the repository does not hold yet
  is not a conflict with the code: adopting the tool is the handoff in step 4.7.
- The inventory script never lists a root `HARNESS.md` as a restating document,
  however many requirement words it holds, and reports only that the file
  exists: whether it is the project's anchor document depends on the
  entrypoint or the handover naming it.
