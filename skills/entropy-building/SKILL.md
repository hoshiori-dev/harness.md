---
name: entropy-building
description: >-
  Owns the Entropy layer of an agent harness: decides, describes, builds, or
  audits what keeps the harness true to the code (sync rules, a self-check,
  reclamation); use when a harness entry hands the layer over or a harness
  drifts.
license: Apache-2.0
compatibility: The self-check asset needs Python 3.10+; run it with uv or plain python3.
---

# Entropy Building

A stale harness is worse than none:
an agent without one reads the code, while an agent with a wrong one trusts it,
fails, or loops. This skill handles the Entropy layer of a project's harness:
it returns the layer's decisions, describes what a project already does,
builds the mechanisms that keep the harness true to the code, or reports
where they have slipped.

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
A project has an anchor document only when a root `HARNESS.md` is named by its entrypoint:
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

<!-- shared:plan-is-not-approval -->
An approved plan authorises only the files it names.
Publishing outside the repository, changing a remote setting, deleting work,
and widening agent autonomy each require an explicit user decision when reached,
even if remaining decisions were left to you.
<!-- /shared:plan-is-not-approval -->

<!-- shared:pending-decisions -->
When blocked on a user decision, continue all independent steps
and add the item to a pending decisions list
(what is blocked and why, options, recommended option and reason,
what finished work each changes).
Present the list once at the end or when nothing else can proceed,
never one question at a time.
<!-- /shared:pending-decisions -->

<!-- shared:management-code-ownership -->
Any script, hook, check, CI step, or task-runner recipe written into the target project
is its own management code: written in its agreed language, readable first,
failing with what to fix, with no fallback hiding unexpected errors,
and never calling a script in a skill directory.
Tell the user that later fixes to this plugin do not reach the delivered copy.
<!-- /shared:management-code-ownership -->

<!-- shared:deposited-files-stand-alone -->
Deposited files stand alone. Nothing written into the target project names
this plugin, any of its skills or agents, or a path inside a skill
directory, and no term only this plugin defines is used there without being
defined.
<!-- /shared:deposited-files-stand-alone -->

- **An omitted layer builds nothing.**
  When the agreed thickness is omitted, build mode reports
  "Entropy: omitted by agreement", writes nothing
  except removing a reserved, empty keep-in-sync heading and its marker
  from the entrypoint, and goes to step 7.
  Audit mode, when the agreed thickness or the anchor document omits the layer
  (no Entropy section, and the subject covered nowhere else in the document),
  reports the same, plus one finding when step 1 shows
  the project nevertheless runs a harness check or a sync rule:
  class contradictory, the mechanism as evidence,
  the agreement or the anchor document as the source of truth.
- **Run directly, with no entry.** Do steps 1 and 2 before writing any file,
  and ask for the go-ahead for a deletion yourself.
  A project without an anchor document ends the work without a `HARNESS.md`.
- **A design document exists for this layer
  only where the project adopted an anchor document.**
  Without one, configure, deposit, and audit nothing about a design document,
  and return no decision about one. A `HARNESS.md` in the root
  that the entrypoint does not name is not an anchor document:
  report it and treat the project as having none.
  In the deposited shapes every mention of `HARNESS.md`
  sits on a line, paragraph, row, or list item whose `# CONFIGURE:` comment
  says to delete it without an anchor document: delete each one then.
  Read [references/design-document.md](references/design-document.md) when the project adopted an anchor document.
- **No self-editing harness.**
  Repeated agent failures yield a reported pattern and a recommendation,
  never an automatic edit to knowledge.
- **Hand adjacent work over by role, never by skill name**:
  product lint, tests, and CI jobs to the layer that owns Gates;
  the entrypoint's structure and line budget to the layer that owns Knowledge;
  labels and other remote entities, and the pending decisions format,
  to the layer that owns Authority; writing, linting,
  and testing a project skill to the skill that writes project skills.

## Workflow

### 1. Observe

Read and record; write nothing.

- The handover: the project's conditions, every layer's thickness,
  this layer's agreed decisions with the list of required paths,
  and the plan's files.
- Whether the project has an anchor document, and then its text for this
  layer: the Entropy section, or wherever else it covers the subject.
- The entrypoint: its line count, and its keep-in-sync section (reserved by
  the marker `<!-- harness: keep-in-sync -->`, populated, or absent).
- Existing mechanisms: a populated sync table, sync project skills, a
  reclamation section or skill with its `Last run:` date, a harness check
  script, a drift label or drift file.
- The task runner, its recipe file, and how it lists recipes; the aggregate
  check recipe.
- The knowledge directories, other harness documents, project skill
  directories, and where management scripts live and in which language.
- The CI workflow: a `# harness:` slot left for the self-check job, the
  gate's dependencies, and any step that calls a script inside a skill
  directory (a defect: report it with a project-owned copy as the fix).
- The issue tracker and its label namespaces; the project's age, release
  rhythm, and team rituals.
- **The copies.** List every fact the harness states in more than one
  place: commands with their flags, directory layouts, versions, rules
  repeated across the entrypoint, knowledge files, skills, and public docs.
  For each: the places, the single source it should have (the code or the
  task-runner recipe first, then the one document that owns the topic), and
  the reference that would replace each copy. List every copy that cannot
  become a reference (a translation, a file a tool needs in two places) as
  a mirror pair with the sections that must match and its source side (the
  original language wins).

Done when: every item is recorded as observed or absent with its path,
the copies and mirror pairs are listed, and no file in the project changed.

### 2. Decide

Read [references/decisions.md](references/decisions.md) when running step 2 (decide mode) or auditing without an anchor document:
it holds this layer's thickness table and all eight decisions.

Recommend one thickness with the conditions that selected it.
With the thickness omitted, return no decisions.
Return each decision in one of two states:

- **settled**, with its evidence, when the repository or the handover
  settles it or the evidence makes one option clearly better
  ("self-check on: two maintainers, second release tagged");
- **open** otherwise, with its options (the recommendation first),
  the reason, and the decisions it depends on. Usual open points:
  a mirror pair's source side the repository does not show,
  the drift label's name, the reclamation event when the team has several
  rituals, the gate when the cost of a wrong change is unclear.

State beside each choice what was deliberately left out and why
("no canary tasks: the harness is small enough to re-read").
Handed over by an entry, ask the user nothing: the entry asks.

Done when: a thickness is recommended with its conditions;
every decision that applies is settled with evidence or open with options;
and no decision concerns a design document
unless the project adopted an anchor document.

### 3. Describe

Describe what step 1 found as prose fit for a `HARNESS.md`,
in the present tense. Improve nothing and recommend nothing.
State, with the reason beside each where a file gives one:
which side wins a disagreement and each mirror pair with its source side;
what an agent does on finding drift and where the trace goes;
each concern kept in step, by what (a table row or a named project skill),
in both directions; what the self-check verifies, where the script lives,
the recipe that runs it, where CI runs it, and whether the gate depends on it;
the reclamation event, cadence, and form;
and the copies nothing keeps in step.
Mark every reason or intent the files do not state as inferred.
Write plain sentences a reader without this skill can act on,
and none of the four thickness words.

Done when: every mechanism step 1 found is described with what it covers,
and every unstated intent is marked as inferred.

### 4. Build

1. **List the files** the agreed decisions require, by path, with what each
   gains or loses: the keep-in-sync section of the entrypoint, each sync or
   reclamation project skill to request, the self-check script, its recipe,
   the CI job, the reclamation routine. Asked for the plan only,
   return this list and stop. Under an entry, write only the files
   the plan lists: a file a decision needs that the plan does not list,
   or a decision a fact makes impossible (hooking into an aggregate check
   recipe that does not exist), is not improvised;
   report it as a deviation with the fact behind it.
   Run directly, present the list with the decisions.
2. **Fill the keep-in-sync section.** Replace the marker
   `<!-- harness: keep-in-sync -->` in the entrypoint with the content and
   keep the heading; never create a second sync section. With no reserved
   heading, add one at the end of the entrypoint within its line budget and
   report that it had not been reserved; when the entrypoint does not exist
   or the section would break its budget, write nothing there and hand the
   content back for the layer that owns Knowledge. For the one-sentence form write
   that sentence with the project's own paths and nothing else. Otherwise
   rework [assets/keep-in-sync-section.md](assets/keep-in-sync-section.md)
   line by line: the dispositions, the ruling rule, the standing reverse
   rule, and one row per concern the table owns. A concern a sync skill
   owns gets no row.
3. **Hand over the project skills.** For each concern the decisions give to
   a sync skill, and for a reclamation agreed as a skill,
   describe the need to the skill that writes project skills and attach the
   raw shape reworked with the settled facts:
   [assets/sync-skill.md](assets/sync-skill.md) or
   [assets/reclamation-skill.md](assets/reclamation-skill.md). Do not
   finish, lint, or test that skill yourself.
4. **Deposit the self-check.**
   Read [references/check-harness-config.md](references/check-harness-config.md) when writing it.
   Copy
   [assets/check_harness.py](assets/check_harness.py), or write the port the
   decisions name, where the project's management scripts live, and set
   every `# CONFIGURE:` line from step 1. `REQUIRED_PATHS` takes exactly
   the list of required paths the handover carries,
   with or without an anchor document, and nothing parsed out of prose;
   with no list, leave it empty and report the gap.
   The design document settings stay `None` without an anchor document.
   Add the recipe, add it to the aggregate check recipe,
   and fill the CI slot, wired as the reference says:
   blocking where the decisions make the gate depend on the self-check,
   advisory otherwise.
5. **Install reclamation.** Rework
   [assets/reclamation-section.md](assets/reclamation-section.md) into the
   knowledge file the decisions name. Add its row to the entrypoint's
   routing table when the entrypoint stays within its line budget;
   otherwise hand back a route owed (the anchor event and the file) for the
   layer that owns Knowledge. Then run the routine once as its first sweep: report every finding with its
   disposition and evidence, apply nothing the user has not approved, and
   set `Last run:` to that day's absolute date.
6. **Remote items.** Create no label and change no remote setting: report
   the drift label as an item for the layer that owns Authority or for the
   user.

Skip every numbered item the agreed decisions do not call for.

Done when: every file on the list is written or its blocker
is on the pending decisions list, and nothing outside the list changed.

### 5. Verify

- Run the self-check recipe once and keep its output verbatim.
  For each finding of that first run,
  the fix is to the harness content or to a setting,
  decided per finding by the user (under an entry:
  handed back as pending decisions).
  Never edit the check's logic to make it pass.
  A required path the handover says is written after this layer
  (a new anchor document) is reported as expected, not as a failure:
  the entry writes the file and runs the recipe again.
- The marker no longer appears in the entrypoint,
  the entrypoint has exactly one sync section,
  and the entrypoint is within its line budget.
- With the three-disposition form:
  the section names all three with their criteria,
  says a conversation-only report does not count,
  and every table row has all three cells.
- The CI job runs the recipe.
  With blocking wiring, the aggregate check recipe runs the self-check
  and the gate depends on the job.
  With advisory wiring, a failing self-check fails neither the gate
  nor a job or hook a merge requires:
  the aggregate recipe runs it unless such a job or hook runs the aggregate,
  and then leaving it out is reported as a deviation.
- The script and the CI job call nothing inside a skill directory.
- Every deposited mechanism is reachable from the entrypoint,
  or its route is handed back as owed.
- The reclamation routine carries the hunt list, the thinning signal,
  the anchor event, the cadence, and `Last run:`
  with the date of the first sweep.
- Without an anchor document: no deposited file names `HARNESS.md`,
  and the script's design document settings are `None`.
- No deposited file carries one of the four thickness words.

Done when: every check that applies has a stated result,
and every failure is fixed or reported, never silently repaired.

### 6. Audit

Change nothing. The baseline is the anchor document's text for the layer,
sentence by sentence, when the project adopted one;
otherwise what the project's conditions call for by step 2,
and every finding then says "no recorded design to compare with".
When a self-check exists, run it and include its findings.
Read [references/audit-findings.md](references/audit-findings.md) when auditing, before judging:
it lists what counts as a finding, its class, and its source of truth.

Done when: every sentence of the anchor document's text for the layer,
or every decision of step 2 that the conditions select,
is confirmed against the project or carries a finding, and no file changed.

### 7. Hand back

| Mode | Hand back |
|---|---|
| decide | the recommended thickness with the conditions behind it; each decision, settled with its evidence or open with its options, reason, and dependencies; what was left out and what would add it |
| describe | the prose describing what exists, inferred intent marked; the copies nothing keeps in step |
| build | each file written or changed with its role and verification result, or for the plan only each file it would create, change, or delete with one line on its shape; the self-check's first output; deviations a fact forced, each with that fact, for the entry to put to the user; assumptions; routes owed; requests handed to other skills by role; remote items; the pending decisions list |
| audit | the findings, each with class, severity, evidence, source of truth, and proposed disposition; or "omitted by agreement" |

Name no skill in what is handed back,
and say that the project owns every deposited copy.

## Gotchas

- A mirror pair of translations never matches word for word:
  the check compares what a translation keeps (link targets, code spans,
  code blocks, table row counts) inside the configured sections,
  so name sections whose code and links really are shared.
- The check counts a knowledge file
  as reachable only when the entrypoint names it.
  A two-hop layout (entrypoint,
  then an index file) yields a finding per file behind the index;
  report it to the layer that owns Knowledge instead of weakening the check.
- An anchor `HARNESS.md` is not a harness document for the link and path
  checks: it may name paths that are required but not built yet,
  and paths it rules out.
  Keep it out of the documents the check scans;
  the required-path list covers it.
