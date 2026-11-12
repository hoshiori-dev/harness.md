---
name: completion-building
description: >-
  Owns the Completion layer of an agent harness: designs, builds, extracts,
  or audits how a project agrees a goal before work starts and when a task
  counts as done; use when a harness workflow hands the layer over.
license: Apache-2.0
compatibility: The inventory script needs Python 3.10+; run it with uv or plain python3.
---

# Completion Building

An agent without an agreed goal anchors on the first code it writes,
and an agent without a checkable finish either stops at "the tests ran"
or never stops. This skill handles the Completion section
of a project's `HARNESS.md`: it writes the section,
describes what a project already does,
turns the section into a specification contract in the project's own words,
or reports where the two disagree.
Running the specification tool itself belongs to the skill for that tool.

## Rules on every step

<!-- shared:layer-modes -->
This skill works in one of four modes, named by the workflow that hands over
or inferred from the request. **design**: return this layer's section of
`HARNESS.md` as prose; write nothing. **extract**: describe what the project
does today as this layer's section; write nothing. **build**: realise the
section in the project. **audit**: report where the project and the section
disagree; change nothing. A handover carries the project's Context, this
layer's section, and the parts of Invariants, Style, and File Structure
assigned to this layer; never ask again for what it carries. A build
handover that asks for the plan only stops after step 1 and returns the
files step 3 would create, change, or delete.
<!-- /shared:layer-modes -->

| Mode | Steps |
|---|---|
| design | 1, 2, 6 |
| extract | 1, 2, 6 |
| build | 1, 3, 4, 6 |
| audit | 1, 5, 6 |

<!-- shared:design-is-the-source -->
`HARNESS.md` in the project root is the design this work serves: design
intent comes from it, facts come from the code. Build what its sections say
and re-decide nothing they decide. Where a section is silent on a point the
work needs, apply the default this skill states and report it as an
assumption. When a fact in the code makes a sentence of the design
impossible to build, stop that item, report the conflict, and build the
rest.
<!-- /shared:design-is-the-source -->

<!-- shared:defaults-first -->
Defaults first. Settle from the repository everything it can show (tools in
use, directories, commands, history). Ask the user, once and in one round,
only for context the repository cannot show. Then draft the complete design
with one stated default for every decision, each with its reason, and
present it for a single approval. Never interview decision by decision. A
default the user changes binds every later step; challenge a change once
when the evidence contradicts it.
<!-- /shared:defaults-first -->

<!-- shared:nothing-lands-before-agreement -->
Nothing lands before agreement. Create or change no file in the target
project until the user has approved the design that covers it; an inspection
step reads and reports, it never writes.
<!-- /shared:nothing-lands-before-agreement -->

<!-- shared:pending-decisions -->
When a step is blocked on a decision only the user can make, continue with
every step that does not depend on it and add the blocked item to a pending
decisions list. Each item states: what is blocked and why; the options; the
recommended option and its reason; which finished work each option would
change. Present the list once, at the end or when nothing else can proceed,
never one question at a time.
<!-- /shared:pending-decisions -->

<!-- shared:deposited-files-stand-alone -->
Deposited files stand alone. Nothing written into the target project names
this plugin, any of its skills or agents, or a path inside a skill
directory, and no term only this plugin defines is used there without being
defined. `HARNESS.md` and its section names may be named: the file is the
project's own.
<!-- /shared:deposited-files-stand-alone -->

- **Completion is optional.**
  A `HARNESS.md` that has no Completion section
  and covers the subject nowhere else (not in the introduction, another section,
  or a custom heading) has omitted the layer. In build mode report "Completion:
  omitted by the design", write nothing, and go to step 6.
  In audit mode do the same,
  plus one finding when step 1 shows the project nevertheless runs
  a specification tool or keeps a specification contract:
  the design omits what the project does.
- **Run without a workflow.** Infer the mode from the request.
  Before writing a file no Completion section covers,
  draft the section (or the change to it) by steps 1 and 2, get one approval,
  and write it into `HARNESS.md` when the project keeps that file; then build.
- **Never touch the tool.** Do not initialise, install, configure,
  or run the specification tool, and print no install command.
  Adoption, layout, commands,
  and automation belong to the skill for that tool (step 3.7).
- **Words that stay in this skill.**
  "Carrier" (the tool or document form that holds an approved goal), "level",
  "first gate", "second gate",
  and the bare noun "request" never appear in the section
  or in a deposited file. Write the tool's name, "the spec and its design",
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
and whether a `HARNESS.md` exists. Exit 1 means a path was unreadable:
record it and read that path by hand.
With neither `uv` nor `python3`, check the same places yourself (`openspec/`,
`.specify/`, `specs/NNN-*/`, `.kiro/`, root `SPEC.md` and `PLAN.md`,
issue and request templates,
every markdown file mentioning acceptance criteria) and record "inventory
by hand".

Then read in full:

- The handover, or `HARNESS.md` when there is none: Context, the Completion
  section, and what the Feedback, Gates, and Authority sections say about
  check commands and who merges.
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

### 2. Write the section

Design mode drafts what the project should do;
extract mode describes what step 1 found and decides nothing.
Both return prose for the `## Completion` section and write no file.

**Design.** Settle every decision below with its default.
The Context column names what selects it;
take those facts from the handover and ask none of them again.

| # | Decision | Default, and the Context that selects it |
|---|---|---|
| 1 | Does the section exist | Omit it when the project will be thrown away within about a quarter, one person is in the conversation for every task, and a wrong change is cheap: the client's plan mode aligns the goal and the Feedback and Gates checks define done. Otherwise write it. |
| 2 | How long a spec lives | Maintained past one release: specs stay the living description of the system and every change updates them. Otherwise a spec builds one change and is archived with it. |
| 3 | The specification tool | First match wins. A tool already in use: keep it. One maintainer and a small repository: a `SPEC.md`/`PLAN.md` committed with each change, plan mode for a one-file change. Existing code: OpenSpec. An application built from zero feature by feature: Spec-Kit. Anything else: OpenSpec. |
| 4 | The two approvals | Always two, never one per step: the spec (and its design when one is warranted) before any task list is written; the finished work before the record is frozen. Each has a named owner, a role or a person. |
| 5 | How approval is recorded | In the conversation when one committer or a pair reviews there and agents never work alone. On the pull or merge request (a label a person adds, removed when the spec changes, and a check that blocks the merge until the record is frozen) when there are several committers, outside contributors, or agents working with no one in the conversation. |
| 6 | Changes that carry no spec | Changes to the project's own harness, tooling, checks, workflows, and documents. |
| 7 | What every spec answers | Fixed: four answers and four rules. Read [references/completion-boundary.md](references/completion-boundary.md) when writing them. |
| 8 | Checks while working | The scoped check after every edit and the full check at the end of every task, both taken from the Feedback and Gates sections or found in step 1. Never invent a command; a missing scoped check is named to the layer that owns Feedback. |
| 9 | Exploration and progress | Exploratory worktrees and branches are removed when their evaluation ends; progress lives in the tool's task list, with no separate diary. |
| 10 | Handoff notes | `.agents/handoff/`, gitignored, because such notes carry logs and credentials more often than code does. The alternative is the system temporary directory. |
| 11 | Requirements written elsewhere, and specs that contradict the code | Each restating document becomes a pointer to the spec. For each contradicting spec the user decides which side is right: put it in the questions, never in the defaults. |

Read [references/carrier-choice.md](references/carrier-choice.md) when the tool in use does not fit the project's shape or is none of the three.
Read [references/approval-gates.md](references/approval-gates.md) when writing decisions 4 and 5 or when the user wants a job
that approves or archives.

The section is finished when a reader
who has never seen this skill could set the project up from it alone.
It states, in plain sentences with the reason beside each choice:
the tool by name and where its files live; how long a spec lives;
who approves the spec and who approves the finished work,
where each approval is recorded, when the task list may be written,
and who freezes the record; which changes need no spec;
the four answers and four rules every spec carries;
the two check commands by name; where handoff notes go;
and what was deliberately left out (for example "no job archives a spec;
a person does").

**Extract.** Write the same section in the present tense from what step 1 found.
Mark every intent the files do not state as inferred
("approval appears to be given in conversation: no label or check records it").
Describe a contradiction as one; do not resolve it.

Done when: the section text is complete;
every default applied is listed with the Context fact that selected it;
and each open point is either a question for the user or, in extract mode,
marked as inferred.

### 3. Build

1. **List the files** the section requires, by path, with what each gains or
   loses: the contract (`.agents/knowledge/spec-workflow.md`, or the
   project's knowledge directory), the entrypoint pointer line, the
   `.gitignore` line, each marker file, and each restating document or spec
   the section says to change. Under a workflow this list is part of the
   approved design; in a run without one, present it with the section.
2. **Deposit the contract.** Rework
   [assets/knowledge-spec-workflow.md](assets/knowledge-spec-workflow.md)
   line by line: resolve every `# CONFIGURE:` line from the section and
   delete every part that does not apply.
   Read [references/contract-design.md](references/contract-design.md) when reworking it.
   Read [references/completion-boundary.md](references/completion-boundary.md) when writing what every spec answers.
3. **Check commands.** Run the scoped check once on one file before writing
   it down. A command that fails or does not exist is not written: name the
   gap to the layer that owns Feedback, or add it to the pending decisions
   list when that layer is already built.
4. **Point the entrypoint at the contract** with one routing row whose
   condition is "before starting a change that alters behaviour, and before
   writing or approving a spec". Add the row only when the entrypoint exists
   and stays within its line budget; otherwise hand back a route owed (that
   condition and the contract's path) for the layer that owns Knowledge.
   Replace each behaviour sentence the section says to move with a pointer
   to the spec.
5. **Handoff directory.** Append
   [assets/gitignore-handoff.txt](assets/gitignore-handoff.txt) to
   `.gitignore` when the section names a directory in the repository and
   the line is not there yet.
6. **Fill the markers.** For each file holding
   `<!-- harness: spec-workflow -->`, write that file's block between the
   marker and an end marker `<!-- /harness: spec-workflow -->` on its own
   line; when an end marker already follows, replace only the lines between
   the two. Read
   [references/approval-gates.md](references/approval-gates.md) when writing
   a block. With no marker in the project, record "no marker to fill" and
   name it to the layer that owns Authority.
7. **Hand off the tool.** Describe the need to the skill for the chosen
   tool by what it owns: OpenSpec changes, archiving, and status labels;
   Spec-Kit features and their task completion; per-change
   `SPEC.md`/`PLAN.md` and plan-mode alignment. Pass it the section's
   decisions and ask it to add its marker for spec-less changes to the
   contract. For any other framework, record the implementer as the person
   who closes every approval and list the framework's automation as
   remaining work.
8. **Apply the decisions on restating documents and contradicting specs**
   that the section records; a decision the section leaves open goes to the
   pending decisions list and the contract names that spec as not yet
   authoritative.

Done when: every file on the list is written or its blocker
is on the pending decisions list, and nothing outside the list changed.

### 4. Verify

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
- Read-back: these questions must be answerable from the project's files
  alone. Where does a new spec go? What must it contain? Who approves the
  spec, who approves the finished work, and where is each recorded? When
  may the task list be written? Who freezes the record, and what does a
  later commit mean? Does a change to CI need a spec? Which check runs
  after every edit? Under a workflow, hand the questions back for its
  clean-context read-back. Without one, give a clean-context subagent only
  the file paths and the questions; when none can be dispatched, answer
  them yourself in a fresh pass and record "read-back not clean-context".

Done when: every check has a stated result and every gap found
is fixed or reported.

### 5. Audit

Compare the section with the project sentence by sentence; change nothing.
Report a finding when:

- the section names a tool, a spec lifetime, an approval owner,
  or a way of recording approval that the contract, the tool's files,
  or recent pull or merge requests contradict;
- the contract is missing, unreachable from the entrypoint,
  or states something the section does not;
- a marker block disagrees with the contract;
- a check command the section or contract names does not exist or fails;
- a document outside the specs restates requirements or acceptance;
- a spec contradicts the code or another spec
  (read [references/spec-drift.md](references/spec-drift.md) when reporting one);
- the handoff location is not gitignored, or handoff notes are committed;
- the section is too thick or too thin for the Context:
  recorded approval for one person who reviews in conversation,
  or conversational approval where agents work unattended.

Each finding carries a severity, the evidence as `path:line`,
the sentence of the section it concerns,
and whether to fix the artifact or amend the design.
Severity is `high` when a safety boundary or an always-on rule
is missing or contradicted,
`medium` when the design and the project disagree so that a task could go wrong,
and `low` for wording or tidiness only.
Which side of a spec-versus-code contradiction is right is the user's call:
state both readings.

Done when: every sentence of the section
is either confirmed against the project or carries a finding,
and no file changed.

### 6. Hand back

| Mode | Hand back |
|---|---|
| design | the `## Completion` section text, or the recommendation to omit it with the reason; the defaults applied, each with the Context fact that selected it; the questions no default can answer |
| extract | the section text describing what exists, inferred intent marked; contradictions found |
| build | each file written or changed with its role and verification result; deviations where the code forced a departure from the section, for `HARNESS.md` to be reconciled; routes owed; the tool handoff by role; gaps named to other layers; the pending decisions list; the read-back questions or the read-back result |
| audit | the findings table, or "omitted by the design" |

Name no skill in what is handed back,
and record every degradation (inventory by hand, read-back not clean-context).

## Gotchas

- Acceptance criteria copied into an issue template or the entrypoint
  are the most common contradiction: the copy drifts while the spec moves.
  The copy becomes a link to the spec's scenarios.
- Freezing a record early to turn the awaiting-archive check green freezes
  a version nobody reviewed. Leave the check red until the review closes.
- A section that names a tool the repository does not hold yet
  is not a conflict with the code: adopting the tool is the handoff in step 3.7.
- The inventory script never lists `HARNESS.md` as a restating document,
  however many requirement words it holds:
  it is the design, not a copy of the specs.
