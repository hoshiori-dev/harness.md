---
name: entropy-building
description: >-
  Owns the Entropy layer of an agent harness: designs, builds, extracts, or
  audits what keeps the harness true to the code (sync rules, a self-check,
  periodic reclamation); use when a harness workflow hands the layer over.
license: Apache-2.0
compatibility: The self-check asset needs Python 3.10+; run it with uv or plain python3.
---

# Entropy Building

A stale harness is worse than none:
an agent without one reads the code, while an agent with a wrong one trusts it,
fails, or loops. This skill handles the Entropy section
of a project's `HARNESS.md`: it writes the section,
describes what a project already does,
builds the mechanisms that keep the harness true to the code
and to its own design, or reports where they have slipped.

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

<!-- shared:design-is-not-approval -->
An approved design authorises the files it describes and nothing else.
Publishing anything outside the repository, changing a remote setting,
deleting work, and widening what agents may do on their own are each a
separate, explicit decision by the user, taken when that step is reached.
<!-- /shared:design-is-not-approval -->

<!-- shared:pending-decisions -->
When a step is blocked on a decision only the user can make, continue with
every step that does not depend on it and add the blocked item to a pending
decisions list. Each item states: what is blocked and why; the options; the
recommended option and its reason; which finished work each option would
change. Present the list once, at the end or when nothing else can proceed,
never one question at a time.
<!-- /shared:pending-decisions -->

<!-- shared:management-code-ownership -->
A script, hook, check, CI step, or task-runner recipe written into the target
project is the project's own management code: written for its role in the
language the project agreed to, readable first, failing with a message that
names what to fix, with no fallback that hides an unexpected error, and never
calling a script inside a skill directory. Tell the user that later fixes to
this plugin do not reach the delivered copy.
<!-- /shared:management-code-ownership -->

<!-- shared:deposited-files-stand-alone -->
Deposited files stand alone. Nothing written into the target project names
this plugin, any of its skills or agents, or a path inside a skill
directory, and no term only this plugin defines is used there without being
defined. `HARNESS.md` and its section names may be named: the file is the
project's own.
<!-- /shared:deposited-files-stand-alone -->

- **Entropy is optional.**
  A `HARNESS.md` that has no Entropy section and covers the subject nowhere else
  (not in the introduction, another section,
  or a custom heading) has omitted the layer. In build mode report "Entropy:
  omitted by the design", write nothing except removing a reserved,
  empty keep-in-sync heading and its marker from the entrypoint,
  and go to step 6. In audit mode report the same,
  plus one finding when step 1 shows the project nevertheless runs a harness
  check or a sync rule the design does not describe.
- **Run without a workflow.** Infer the mode from the request.
  Before writing a file no Entropy section covers,
  draft the section (or the change to it) by steps 1 and 2, get one approval,
  and write it into `HARNESS.md` when the project keeps that file; then build.
- **The design document is either an anchor or gone.**
  A project keeps `HARNESS.md` as its long-lived design,
  or used it once as a template and deleted it. The section says which.
  Everything this skill does about the file itself applies only to the first
  case. Read [references/design-document.md](references/design-document.md) when the project keeps the file or the section does not say.
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

- The handover, or `HARNESS.md` when there is none: Context, the Entropy
  section, and the paths the File Structure section requires. Whether
  `HARNESS.md` exists in the project root.
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

### 2. Write the section

Design mode drafts what the project should do;
extract mode describes what step 1 found and decides nothing.
Both return prose for the `## Entropy` section and write no file.

**Design.** Settle every decision below with its default.
Take the Context facts from the handover and ask none of them again.

| # | Decision | Default, and the Context that selects it |
|---|---|---|
| 1 | Does the section exist | Omit it when the project will be thrown away within about a quarter and nobody but its author relies on its conventions: stale harness text then costs less than the machinery against it. Otherwise write it. |
| 2 | Which side wins a disagreement | The code and the task runner win over the document that describes them; in a mirror pair the source side wins. The opposite ruling for one pair is the user's to record. |
| 3 | What an agent does when it finds drift | One person and no release in sight: one sentence, "fix it in the same change or record it where the next agent finds it, never only in the conversation". Otherwise three dispositions with their criteria: fix in the same change, the pending decisions list, a tracked issue. Read [references/correction-report.md](references/correction-report.md) when writing them or naming the drift label. |
| 4 | How each copy is kept in step | A Keep In Sync table in the entrypoint: one row per concern, at most about ten. A concern that is frequent, branchy, or spans several artifacts gets a sync project skill instead. Read [references/sync-table.md](references/sync-table.md) when choosing or writing rows, and [references/sync-skill.md](references/sync-skill.md) when a concern gets a skill. |
| 5 | The harness self-check | On when the project is maintained past one release or anyone besides its author relies on its conventions: a script among the project's own management scripts, a task-runner recipe, part of the aggregate check, and a CI job. The required CI gate depends on it when a wrong change is costly or agents work unattended. Its second tier (project skill frontmatter, entrypoint line budget) is on when the project has project skills. Off otherwise, and the section says so. Read [references/check-harness-config.md](references/check-harness-config.md) when deciding where it lives and in which language. |
| 6 | The design document | Kept as the anchor: the self-check requires every path the File Structure section lists and the file itself to exist, validates its format when the project holds its own validator, and reclamation re-reads it against the harness. Used once as a template and deleted: the section says so and none of this applies. |
| 7 | Periodic reclamation | On when the project is maintained for years or its harness is heavy: a dated routine anchored to a team event (a release, a retro), monthly for a fast-moving project and quarterly otherwise. Off for anything shorter-lived; the section then names what would add it. Read [references/reclamation.md](references/reclamation.md) when writing it. |
| 8 | Session logs and canary tasks | Not part of the section unless the user asks. Read [references/observation.md](references/observation.md) when they do. |

The section is finished when a reader
who has never seen this skill could build the mechanisms from it alone.
It states, in plain sentences with the reason beside each choice:
which side wins a disagreement and each mirror pair with its source side;
what an agent does on finding drift and where the trace goes;
each concern kept in step, by what (a table row or a named project skill),
in both directions; what the self-check verifies, where the script lives,
the recipe that runs it, where CI runs it, and whether the gate depends on it;
whether `HARNESS.md` is kept and what holds it and the harness together;
the reclamation event, cadence, and form;
and what was deliberately left out ("no canary tasks:
the harness is small enough to re-read").

**Extract.** Write the same section in the present tense from what step 1 found:
the mechanisms that exist, what each covers,
and the copies nothing keeps in step.
Mark every intent the files do not state as inferred.

Done when: the section text is complete;
every default applied is listed with the Context fact that selected it;
and each open point (a mirror pair's source side the repository does not show,
a drift label name) is a question for the user or, in extract mode,
marked as inferred.

### 3. Build

1. **List the files** the section requires, by path, with what each gains or
   loses: the keep-in-sync section of the entrypoint, each sync or
   reclamation project skill to request, the self-check script, its recipe,
   the CI job, the reclamation routine. Under a workflow this list is part
   of the approved design; in a run without one, present it with the
   section.
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
3. **Hand over the project skills.** For each concern the section gives to
   a sync skill, and for a reclamation the section wants as a skill,
   describe the need to the skill that writes project skills and attach the
   raw shape reworked with the settled facts:
   [assets/sync-skill.md](assets/sync-skill.md) or
   [assets/reclamation-skill.md](assets/reclamation-skill.md). Do not
   finish, lint, or test that skill yourself.
4. **Deposit the self-check.**
   Read [references/check-harness-config.md](references/check-harness-config.md) when writing it.
   Copy
   [assets/check_harness.py](assets/check_harness.py), or write the port the
   section names, where the project's management scripts live, and set
   every `# CONFIGURE:` line from step 1. `REQUIRED_PATHS` takes the paths
   the handover registered from the File Structure section, and nothing
   parsed out of prose. Add the recipe, add it to the aggregate check
   recipe, and fill the CI slot.
5. **Install reclamation.** Rework
   [assets/reclamation-section.md](assets/reclamation-section.md) into the
   knowledge file the section names. Add its row to the entrypoint's
   routing table when the entrypoint stays within its line budget;
   otherwise hand back a route owed (the anchor event and the file) for the
   layer that owns Knowledge. Then run the routine once as its first sweep: report every finding with its
   disposition and evidence, apply nothing the user has not approved, and
   set `Last run:` to that day's absolute date.
6. **Remote items.** Create no label and change no remote setting: report
   the drift label as an item for the layer that owns Authority or for the
   user.

Skip every numbered item the section does not call for.

Done when: every file on the list is written or its blocker
is on the pending decisions list, and nothing outside the list changed.

### 4. Verify

- Run the self-check recipe once and keep its output verbatim.
  For each finding of that first run,
  the fix is to the harness content or to a setting,
  decided per finding by the user (under a workflow:
  handed back as pending decisions).
  Never edit the check's logic to make it pass.
- The marker no longer appears in the entrypoint,
  the entrypoint has exactly one sync section,
  and the entrypoint is within its line budget.
- With the three-disposition form:
  the section names all three with their criteria,
  says a conversation-only report does not count,
  and every table row has all three cells.
- The aggregate check recipe runs the self-check; the CI job runs the recipe;
  the gate depends on it where the section says so.
- The script and the CI job call nothing inside a skill directory.
- Every deposited mechanism is reachable from the entrypoint,
  or its route is handed back as owed.
- The reclamation routine carries the hunt list, the thinning signal,
  the anchor event, the cadence, and `Last run:`
  with the date of the first sweep.

Done when: every check that applies has a stated result,
and every failure is fixed or reported, never silently repaired.

### 5. Audit

Compare the section with the project sentence by sentence; change nothing.
When a self-check exists, run it and include its findings.
Report a finding when:

- a mechanism the section describes is missing,
  is not wired where the section says (recipe, aggregate check, CI, gate),
  or no longer runs;
- a mechanism exists that the section does not describe;
- a table row or sync skill names a document, recipe,
  or path that no longer exists, or two mechanisms own one concern;
- a fact is stated in two places and nothing keeps the copies in step;
- the reclamation's `Last run:` is older than its cadence, or "never";
- a CI step or script calls a file inside a skill directory;
- the project keeps `HARNESS.md` and a path its File Structure section requires
  is missing, or the self-check's required paths and that section disagree;
  or the section says the file was deleted and it is still there;
- the section is too thick or too thin for the Context:
  a monthly sweep and a gated self-check on a project nobody else relies on,
  or no self-check on a harness several people and unattended agents depend on.

Each finding carries a severity, the evidence as `path:line`,
the sentence of the section it concerns,
and whether to fix the artifact or amend the design.
Severity is `high` when a safety boundary or an always-on rule
is missing or contradicted,
`medium` when the design and the project disagree so that a task could go wrong,
and `low` for wording or tidiness only.
When the project keeps `HARNESS.md` and the two disagree on intent,
the default is to fix the artifact;
amending the design is the fix only when the code shows the design sentence
can no longer be built.

Done when: every sentence of the section
is either confirmed against the project or carries a finding,
and no file changed.

### 6. Hand back

| Mode | Hand back |
|---|---|
| design | the `## Entropy` section text, or the recommendation to omit it with the reason; the defaults applied, each with the Context fact that selected it; the questions no default can answer |
| extract | the section text describing what exists, inferred intent marked; copies nothing keeps in step |
| build | each file written or changed with its role and verification result; the self-check's first output; deviations where the code forced a departure from the section, for `HARNESS.md` to be reconciled; routes owed; requests handed to other skills by role; remote items; the pending decisions list |
| audit | the findings table, or "omitted by the design" |

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
- `HARNESS.md` is not a harness document for the link and path checks:
  it may name paths that are required but not built yet, and paths it rules out.
  Keep it out of the documents the check scans;
  the required-path list covers it.
