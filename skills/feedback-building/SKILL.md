---
name: feedback-building
description: >-
  Feedback layer builder: Owns the Feedback layer of a HARNESS.md, the
  commands and tools a coding agent runs and observes to verify its own
  work; use when a harness workflow hands this layer over or agents call
  work done unchecked.
license: Apache-2.0
---

# Feedback Building

An agent stops when the work looks done. With nothing to run that says
whether it is done, "looks done" is all it has, and a person becomes the
test suite. This skill designs, builds, extracts, or audits the Feedback
layer of a project's agent harness: one fast and one full check behind a
single task-runner entry, output an agent can act on, a way to start,
drive, and observe the system under development, tests an agent can trust,
a review pass by a reader that did not write the change, and a plain list
of what only a human can verify.

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

Steps per mode: design and extract run 1, 2, 6; build runs 1, 3, 4, 6;
audit runs 1, 5, 6. Run directly, with no workflow handing over, infer the
mode from the request; before writing a file that no `HARNESS.md` section
covers, draft the section or the change to it (step 2), get one approval,
and record it in `HARNESS.md` when the project keeps that file.

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

- **Feedback and Gates.** Feedback is what an agent can run and observe to
  verify its own work; Gates is what blocks a defect whether or not the
  agent looked. One command is usually both: Feedback owns that the agent
  can run it and read its output; Gates owns that the hook and CI run it
  and that it blocks.
- **Recipes are shared.** This layer owns the two aggregate recipes (a
  fast one and a full one), the test recipes, and the recipes that start,
  seed, and smoke-test the system. The recipe of each single check
  (formatter, lint, typecheck, secret scan, structure) belongs to the
  layer that owns Gates, which adds it to the aggregates' dependencies. An
  aggregate built here depends on every check recipe that already exists.
- **Quiet, never parsed.** Shape output with the tool's own flags and
  reporters. Never add an output parser, filter, or `| grep` wrapper around
  a check; a tool with no quiet mode keeps its native output, recorded in
  one sentence.
- **Only what runs here.** A deposited file names no command, tool, or
  address that was not run in this session, and an extracted section marks
  what was not run. Never write a command from memory of how such projects
  usually work.
- **Advisory, never blocking.** Nothing this layer builds stops a commit or
  a merge. A check that must block is described in the hand back for the
  layer that owns Gates.
- **Handoffs by role.** Registering a tool or MCP server, installing a
  browser or a runtime, and credentials go to the layer that owns
  Environment; which commands run without asking to the layer that owns
  Authority; hooks, CI jobs, and the rule against weakening checks to the
  layer that owns Gates; what counts as done for a task to the layer that
  owns Completion. Describe the work; never name a skill.

## Workflow

### 1. Observe

Read, record, write nothing. Collect:

- the Feedback section, the Context, and the assigned parts of Style, when
  a `HARNESS.md` or a handover provides them;
- what kind of system this is: library, command-line tool, service or API,
  web interface, mobile or desktop application, data pipeline,
  infrastructure code;
- the task runner and its recipes; the test runner, how one test file is
  run, and whether the default test command watches or prompts;
- how long the checks take, from CI history or the user; time a command
  only when it is known to be short;
- how the system is started today (a recipe, a `dev` script, a compose
  file), on which port, and what it needs (database, environment
  variables, seed data);
- what an agent can observe: log files and their location, a local
  database, a health endpoint, traces or metrics, a browser or device
  driving tool registered with the client;
- fixtures, seed scripts, golden or snapshot files and how they are
  updated;
- a reviewer subagent, a review command, or a self-check step in the
  knowledge files; whether the client supports subagents;
- knowledge files that already say how to verify work.

Done when: every item is recorded as observed, absent, or "ask", and no
file in the project has changed.

### 2. Write the section

**Extract** describes only what step 1 observed, in the same shape as
below; intent the files do not state is marked as inferred, and a command
that exists but was not run in this session is marked as not run.

**Design** settles every decision in this list. Take an observed fact as
it is; otherwise apply the default the project's Context selects.

| Decision | Default, and what selects it |
|---|---|
| Command surface | Two entries in the project's task runner (`just` when there is none): a fast check an agent runs after every small change and a full check it runs before calling a task done. Always, whatever the Context. |
| Scoped test | One command that runs one test file or directory. Always, once tests exist. |
| Time budgets | Fast check 10 seconds; full check the measured duration, stated. A full check over 15 minutes also gets a middle tier (the tests of the files changed since the base branch, or a fixed sample), because an agent cannot tell that an hour has passed. |
| Output | Nothing but a summary line on success; on failure only the failures, bounded, with the full log in a file whose path is printed. Read [references/output.md](references/output.md) when writing any check or test command or its flags. |
| Running the system | A library: none, the tests are the system. Anything else: one non-interactive command that starts it, a readiness check, and a stop command. Read [references/running-the-system.md](references/running-the-system.md) when the project is not a library. |
| Driving and observing | A web interface gets a browser-driving tool and screenshots when a wrong change costs real work to undo or agents run unattended; otherwise it is optional. A service gets a smoke request and bounded log reading. Same reference as above. |
| Test practice | A bug fix starts with a test or script that fails for the reported reason. Tests are deterministic: no network, no wall clock, seeded randomness. Read [references/test-practice.md](references/test-practice.md) when the section covers test granularity, fixtures, seed data, or golden files. |
| Evidence | An agent reports the command it ran and the tail of its output, or the screenshot path. When agents run unattended or a wrong change is costly, the evidence goes into the pull or merge request text. |
| Review pass | None for a throwaway project. A read-only reviewer in a fresh context before a pull or merge request when a wrong change is costly or agents run unattended and the client supports subagents. Read [references/review-pass.md](references/review-pass.md) when the section has a review pass or a check no tool can decide. |
| Session-start check | Off. When agents run unattended across sessions, the fast check and the smoke test run before new work starts, so a broken baseline is found first. |
| Human verification | Always stated: what an agent cannot verify here (visual judgement, real devices, production behaviour, paid third-party calls) and that it reports each as unverified with the manual steps. |

**Assigned parts of Style.** Sentences about how fine-grained tests are,
what they may depend on, and how they are run become the test practice
part of the section and, in build mode, the test recipes and the knowledge
file. A sentence a tool could enforce (a coverage floor, a lint rule on
tests) is returned in the hand back for the layer that owns Gates.

The section is written in plain prose a reader without this skill can
build from. It names: the fast, full, and scoped commands exactly as typed
and how long each takes; what each prints on success and on failure; how
the system is started, checked for readiness, and stopped, with ports and
required services; each observation tool and what it is used to verify;
where fixtures and seed data live and how they are reset; how golden files
are updated; what evidence a finished task carries; whether a review pass
exists, who runs it, and what it is asked; and what is left to a human,
with the reason. A project with nothing to run still gets the section,
saying so and why.

Done when: every row of the table has an observed fact, an applied default
with its reason, or an open question.

### 3. Build

Build only what the section says; a missing detail takes the table's
default and is reported as an assumption.

**Recipes.** Rework [assets/feedback-recipes.just](assets/feedback-recipes.just) line by line into the
project's task runner (translate it for another runner): the fast and full
aggregates, the test recipes, and the recipes that start, check, stop,
seed, and smoke-test the system. Every recipe is non-interactive: no watch
mode, no pager, no prompt. Keep an existing recipe's name when it already
does the job.

**Observation tools.** For each tool the section names, confirm it is
present and write the one example command that verifies something real in
this project. A tool that is missing is not installed here: list it in the
hand back for the layer that owns Environment.

**Review pass.** Read [references/review-pass.md](references/review-pass.md) when the section has a review pass, and build what it describes.

**Knowledge file.** Rework [assets/knowledge-verification.md](assets/knowledge-verification.md) into the
project's knowledge directory. The fast, full, and scoped commands, one
line each, and the file's route, with the load condition "before calling
a task done, when a check fails, or when the running system must be
inspected", go into the entrypoint only when it exists and stays within
its budget; otherwise hand them back as a route owed (the situation, the
file, and the three command lines).

Done when: every command the section names exists as a recipe, every
observation tool has an example command or a hand back entry, and the
commands and the route are in the entrypoint or handed back as owed.

### 4. Verify

- Run the fast check on the clean tree: record exit code, duration against
  the budget, and the number of lines printed.
- Run the scoped test on one existing test file. Then add a temporary test
  that fails on purpose, run the scoped test on it, confirm the output
  names the file and the assertion and stays bounded, and delete it.
- Run the full check when the section's stated duration is under 15
  minutes or the user agreed; otherwise say it was not run.
- Start the system, wait for readiness, run the smoke test, stop it, and
  confirm no process or port is left behind.
- Run each observation tool's example command once.
- A red result on existing code is a finding, not a reason to change a
  test or a threshold.

Done when: every item has a recorded result or a stated reason it was not
run, and `git status` shows no temporary file.

### 5. Audit

Compare the section with the project and report each disagreement once.
With no Feedback section, compare the project with step 2's defaults for
its Context and mark every finding "no design to compare with".

- a command the section or a knowledge file names that does not exist,
  fails to start, or was renamed;
- a fast check over its budget, or a full check with no stated duration;
- a check that prints a full log on success, or more on failure than an
  agent can read, although the tool has a quiet mode;
- no way to run one test file; a test command that watches or prompts;
- a start command that never returns control, has no readiness check, or
  leaves processes behind;
- an observation tool the section relies on that the client does not have;
- tests that reach the network, depend on the clock, or fail on a second
  run; golden files regenerated by the ordinary test command;
- a reviewer that can write files, or a review step with no fixed place;
- no statement of what a human must verify;
- a design gap: the Context says a wrong change is costly or agents run
  unattended, and the section gives the agent less to observe than the
  table's default for it (a web interface nobody can look at, a service
  with no smoke test).

Each finding carries a severity, the evidence as `path:line` or a command
and its output, the sentence of the section it contradicts, and one of two
remedies: fix the artifact, or amend the design. Severity is `high` when a
safety boundary or an always-on rule is missing or contradicted (a start
or seed command that reaches production, a reviewer that can write),
`medium` when the design and the project disagree so that a task could go
wrong (a command that does not exist, nothing to observe), `low` for
wording or tidiness only.

Done when: every command and tool in the section was run or inspected, and
no file has changed.

### 6. Hand back

- **design, extract**: the section text ready to paste; the defaults
  applied, each with its reason; the questions no default can answer; the
  Style sentences passed on to the layer that owns Gates.
- **build**: every file written or changed with its role and its result
  from step 4; assumptions made where the section was silent; deviations
  the code forced, worded so `HARNESS.md` can be corrected; tools the
  layer that owns Environment must provide; findings on existing code;
  routes owed; the pending decisions list.
- **audit**: the findings table and nothing else changed.

No hand back names a skill.

## Gotchas

- A default `test` script often starts a watcher (`vitest`, `jest --watch`,
  `cargo watch`); an agent that runs it waits forever. The recipe passes
  the run-once flag.
- A unit test or a `curl` passing does not show that a feature works
  end to end; when the change is user-visible, the evidence is the feature
  driven as a user would drive it.
- Browser automation cannot see everything: native dialogs and some
  rendering faults stay invisible. They belong in the human verification
  list, not in a claim that the page was checked.
- A reviewer told to find problems always finds some. Its prompt names
  what to check and says to skip style, and its findings are weighed, not
  obeyed.
- A fixed sample of a slow suite must be the same sample on every run of
  one agent, or a regression looks like noise.
