---
name: feedback-building
description: >-
  Feedback layer builder: Owns the Feedback layer, the commands and tools
  a coding agent runs and observes to verify its own work; use when a
  harness entry hands the layer over or agents call work done unchecked.
license: Apache-2.0
---

# Feedback Building

An agent stops when the work looks done.
With nothing to run that says whether it is done, "looks done" is all it has,
and a person becomes the test suite.
This skill decides, describes, builds,
or audits the Feedback layer of a project's agent harness:
one fast and one full check behind a single task-runner entry,
output an agent can act on, a way to start, drive,
and observe the system under development, tests an agent can trust,
a review pass by a reader that did not write the change,
and a plain list of what only a human can verify.

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

Run directly, with no entry handing over: run steps 1 and 2 first
when the request asks for a file and no agreed decision covers it;
the decisions and the files you show are the plan the user accepts.
Never create a `HARNESS.md`.

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

- **Feedback and Gates.**
  Feedback is what an agent can run and observe to verify its own work;
  Gates is what blocks a defect whether or not the agent looked.
  One command is usually both:
  Feedback owns that the agent can run it and read its output;
  Gates owns that the hook and CI run it and that it blocks.
- **Recipes are shared.**
  This layer owns the two aggregate recipes (a fast one and a full one),
  the test recipes, and the recipes that start, seed, and smoke-test the system.
  The recipe of each single check (formatter, lint, typecheck, secret scan,
  structure) belongs to the layer that owns Gates,
  which adds it to the aggregates' dependencies.
  An aggregate built here depends on every check recipe that already exists.
- **Quiet, never parsed.** Shape output with the tool's own flags and reporters.
  Never add an output parser, filter, or `| grep` wrapper around a check;
  a tool with no quiet mode keeps its native output, recorded in one sentence.
- **Only what runs here.** A deposited file names no command, tool,
  or address that was not run in this session,
  and a description marks what was not run.
  Never write a command from memory of how such projects usually work.
- **Advisory, never blocking.**
  Nothing this layer builds stops a commit or a merge.
  A check that must block is described in the hand back for the layer
  that owns Gates.
- **Handoffs by role.** Registering a tool or MCP server,
  installing a browser or a runtime,
  and credentials go to the layer that owns Environment;
  which commands run without asking to the layer that owns Authority;
  hooks, CI jobs, and the rule against weakening checks to the layer
  that owns Gates; what counts as done for a task to the layer
  that owns Completion. Describe the work; never name a skill.
  When the handover gives the owning layer as omitted,
  say in the hand back that the item has no owner.

## Workflow

### 1. Observe

Read, record, write nothing. Collect:

- from a handover: the goal and non-goals, the project's conditions,
  every layer's thickness, this layer's agreed decisions,
  the plan's files for it, and the parts of each reference the user chose;
- whether the project has an anchor document,
  and then its text for this layer and its rules about tests;
- what kind of system this is: library, command-line tool, service or API,
  web interface, mobile or desktop application, data pipeline,
  infrastructure code;
- the task runner and its recipes; the test runner, how one test file is run,
  and whether the default test command watches or prompts;
- how long the checks take, from CI history or the user;
  time a command only when it is known to be short;
- how the system is started today (a recipe, a `dev` script, a compose file),
  on which port, and what it needs (database, environment variables, seed data);
- what an agent can observe: log files and their location, a local database,
  a health endpoint, traces or metrics,
  a browser or device driving tool registered with the client;
- fixtures, seed scripts, golden or snapshot files and how they are updated;
- a reviewer subagent, a review command,
  or a self-check step in the knowledge files;
  whether the client supports subagents;
- knowledge files that already say how to verify work.

Done when: every item is recorded as observed, absent, or "ask",
and no file in the project has changed.

### 2. Decide

Read [references/decisions.md](references/decisions.md) when running step 2 (decide mode) or auditing without an anchor document:
it holds this layer's thickness table and all eleven decisions.

Recommend one thickness with the conditions that selected it
(using a settled handover thickness when present).
Return every decision row: one removed by thickness is settled as "not built at this thickness".
Otherwise a row is **settled**, with its evidence,
when the repository or the handover settles it (an observed fact
is taken as it is) or the evidence makes one option clearly better;
else it is **open**: its options, the recommended one first, the reason,
and the decisions it depends on.
Handed over by an entry, ask the user nothing.

**Rules about tests in the handover.**
Sentences about how fine-grained tests are, what they may depend on,
and how they are run (from the anchor document's Style,
or from a reference the user chose) become test practice decisions.
A sentence a tool could enforce (a coverage floor,
a lint rule on tests) is returned in the hand back for the layer
that owns Gates.

Word every settled decision so a reader without this skill
can act on it. Together they name: the fast, full,
and scoped commands exactly as typed and how long each takes;
what each prints on success and on failure;
how the system is started, checked for readiness, and stopped,
with ports and required services;
each observation tool and what it is used to verify;
where fixtures and seed data live and how they are reset;
how golden files are updated; what evidence a finished task carries;
whether a review pass exists, who runs it, and what it is asked;
and what is left to a human, with the reason.
A missing tool or runtime is a question for the layer
that owns Environment, never a decision here.

Done when: a thickness is recommended or taken from the handover,
every row of the list is settled with evidence or open with its options,
and no file has changed.

### 3. Describe

Describe only what step 1 observed, as prose fit for a `HARNESS.md`,
naming everything the list at the end of step 2 names.
Intent the files do not state is marked as inferred,
and a command that exists but was not run in this session
is marked as not run, with the reason.
Never replace an observed practice with a recommendation of step 2,
and never fill a gap: what the project lacks is stated as absent.

Done when: every item step 1 recorded as observed is in the description,
and no file has changed.

### 4. Build

Build only what the agreed decisions say, in the files the plan lists.
A point no decision covers takes step 2's recommendation
and is reported as an assumption.
A fact that makes a decision impossible to build as agreed
is reported as a deviation, never worked around by weakening a check.
For a handover that asks for the plan only, write nothing and return
each file this step would create, change, or delete,
by path with one line on its shape.

**Recipes.** Rework [assets/feedback-recipes.just](assets/feedback-recipes.just)
line by line into the project's task runner (translate it for another runner):
the agreed fast and full aggregates, test recipes, and system recipes.
Every recipe is non-interactive:
no watch mode, no pager, no prompt.
Keep an existing recipe's name when it already does the job.

**Observation tools.** For each tool the decisions name,
confirm it is present and write the one example command
that verifies something real in this project.
A tool that is missing is not installed here:
list it in the hand back for the layer that owns Environment.

**Review pass.** Read [references/review-pass.md](references/review-pass.md) when the decisions include a review pass, and build what it describes.

**Light Feedback.** Name the fast and full commands in the entrypoint
with one sentence on what a human verifies. Use the planned entrypoint
and its budget, or hand back the lines for the Knowledge layer to place.
Then go to Verify.

**Knowledge file.**
Rework [assets/knowledge-verification.md](assets/knowledge-verification.md)
into the project's knowledge directory.
The fast, full, and scoped commands, one line each, and the file's route,
with the load condition "before calling a task done, when a check fails,
or when the running system must be inspected",
go into the entrypoint only when it exists, the plan lists it,
and it stays within its budget;
otherwise hand them back as a route owed (the situation, the file,
and the three command lines).

Done when: every command the decisions name exists as a recipe,
every observation tool has an example command or a hand back entry,
the commands and the route are in the entrypoint or handed back as owed,
and no file outside the plan's list was written.

### 5. Verify

- Run the fast check on the clean tree:
  record exit code, duration against the budget,
  and the number of lines printed.
  Over budget, record the measured time as a deviation
  for the user to decide; remove no check to meet the budget.
- When a scoped test was built, run it on one existing test file.
  Then add a temporary test that fails on purpose, run the scoped test on it,
  confirm the output names the file and the assertion and stays bounded,
  and delete it.
- Run the full check when its agreed duration
  is under 15 minutes or the user agreed; otherwise say it was not run.
- When system recipes were built, start the system, wait for readiness,
  run the smoke test, stop it,
  and confirm no process or port is left behind.
  A process or port left behind is a failed verification:
  fix the recipe and run this item again before handing back.
- Run each observation tool's example command once.
- A red result on existing code is a finding,
  not a reason to change a test or a threshold.

Done when: every item has a recorded result or a stated reason it was not run,
and `git status` shows no temporary file.

### 6. Audit

Compare the project with the anchor document's text for this layer
when the project adopted one;
otherwise with what its conditions call for by step 2,
and mark every finding "no recorded design to compare with".
Read [references/audit-findings.md](references/audit-findings.md) when classifying findings or choosing their dispositions in audit mode.

Done when: every command and tool the project or its anchor document names
was run or inspected, and no file has changed.

### 7. Hand back

- **decide**: the recommended thickness with its reasons;
  every decision of step 2, settled with its evidence
  or open with its options, reason, and what it depends on;
  the rules about tests passed on to the layer that owns Gates;
  the questions for other layers. Nothing asked of the user.
- **describe**: the description; what is marked inferred and why;
  what was not run and why.
- **build**: every file written or changed with its role and its result
  from step 5; assumptions made where no decision covered a point;
  deviations a fact forced, each with the decision it departs from,
  worded so the entry can put it to the user;
  tools the layer that owns Environment must provide; findings on existing code;
  routes owed; the pending decisions list.
  For the plan only: the files and nothing written.
- **audit**: the findings table and nothing else changed.

No hand back names a skill.

## Gotchas

- A default `test` script often starts a watcher (`vitest`, `jest --watch`,
  `cargo watch`); an agent that runs it waits forever.
  The recipe passes the run-once flag.
- A unit test or a `curl` passing does not show that a feature works end to end;
  when the change is user-visible,
  the evidence is the feature driven as a user would drive it.
- Browser automation cannot see everything:
  native dialogs and some rendering faults stay invisible.
  They belong in the human verification list,
  not in a claim that the page was checked.
- A reviewer told to find problems always finds some.
  Its prompt names what to check and says to skip style,
  and its findings are weighed, not obeyed.
- A fixed sample of a slow suite must be the same sample
  on every run of one agent, or a regression looks like noise.
- "Thick" never means blocking here:
  a check that must stop a commit is the Gates layer's, at any thickness.
