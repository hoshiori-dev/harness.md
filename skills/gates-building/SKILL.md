---
name: gates-building
description: >-
  Gates layer builder: Owns the Gates layer of an agent harness, the
  deterministic checks in hooks and CI that block a broken or secret change;
  use when a harness entry hands the layer over or such checks are decided,
  built, or audited.
license: Apache-2.0
compatibility: Scripts need Python 3.10+; uv optional.
---

# Gates Building

Defects are kept off the default branch by hooks and CI, not by instructions.
This skill decides, describes, builds,
or audits the Gates layer of a project's agent harness:
the formatter, secret scan, lint, typecheck, tests,
and structure checks that run in a seconds-fast commit hook and in CI on GitHub
or GitLab, the single summary gate a pull request depends on,
and the rule that no check is weakened to make a change pass.
A failing gate is context injected into the agent:
it must arrive as errors and a route, not as a log.

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

Run directly, with no entry handing over, infer the mode from the request.
A request to set up or change gates runs steps 1 and 2,
shows the settled decisions and asks the open ones, then,
once the user accepted what was shown, runs steps 4, 5, and 7.
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

- **Gates and Feedback.**
  Feedback is what an agent can run and observe to verify its own work;
  Gates is what blocks a defect whether or not the agent looked.
  One command is usually both:
  Feedback owns that the agent can run it and read its output;
  Gates owns that the hook and CI run it and that it blocks.
- **Recipes are shared.** Hooks, CI jobs,
  and agents call the same task-runner recipes.
  The two aggregate recipes
  (a fast one and a full one) and the test recipes belong to the layer
  that owns Feedback;
  this layer adds the recipe of every check it introduces to their dependencies,
  and creates the aggregates only when they do not exist yet.
- **Quiet, never parsed.**
  Every check runs with its tool's own quiet or compact flags.
  Never add an output parser, filter, or wrapper;
  a tool with no quiet mode keeps its native output, recorded in one sentence.
- **Never weaken, never repair the product.**
  A check that fails on existing code is a finding in the hand back.
  Do not loosen the check, and do not fix application code unless the user asks.
- **Only deterministic checks are gates.**
  A rule no tool or script can decide (business-logic consistency,
  a privacy review) is returned in the hand back for the layer
  that owns Feedback, as a review step.
- **What is returned stands alone.**
  The decisions of step 2 and the prose of step 3 are written
  so that a reader without this skill can list the hook's commands
  and the CI jobs to create. They name:
  each check with its tool and exact command;
  where each runs (hook, CI job by name, recipe); the hook budget in seconds;
  the platform and whether a summary gate exists, with its job name;
  each structure rule with what to do instead;
  the rule on weakening checks and which files are hard read-only;
  the settings a human must apply on the platform (the required check by name,
  branch protection, push protection);
  and what is deliberately not gated, with the reason.
- **Handoffs by role.** Which commands an agent may run,
  required-check registration, branch protection, labels,
  and templates go to the layer that owns Authority;
  the harness self-check to the layer that owns Entropy;
  installing a tool into the agent environment to the layer
  that owns Environment. Describe the work; never name a skill.

## Workflow

### 1. Observe

Read, record, write nothing. Collect:

- what the handover carries: the goal and non-goals,
  the project's conditions, every layer's thickness,
  the decisions agreed for this layer, the files the plan lists for it,
  and every invariant or style rule assigned to this layer;
- whether the project adopted an anchor document
  (a root `HARNESS.md` that the entrypoint or the handover names) and,
  when it did, that document's text about gates.
  Run directly, when the root holds the file and no entrypoint names it,
  or an entrypoint names one that is missing,
  ask the user whether the file is the project's anchor document;
- languages and package managers; the task runner and its recipes;
- every tool that runs today and the role it runs in:
  hooks (`.pre-commit-config.yaml`, `.husky/`, `lefthook.yml`, `.git/hooks/`),
  recipes, scripts, CI files;
  and tool configuration with no runner (a `[tool.ruff.lint]` table,
  `eslint.config.*`, `tsconfig.json`);
- client-side agent hooks that run a check
  (for example a hook on the end of an agent's turn);
- the hosting platform from `git remote -v` (GitHub, GitLab, other, none);
- runtimes present for custom checks (`python3`, `uv`, `node`, `deno`);
- knowledge files that already state where checks run or that checks
  may not be weakened;
- how long the test suite takes, from CI history or the user.
  Never run a hook or a formatter here: they rewrite files.

A build handover that asks for the plan only ends here:
return each file step 4 would create, change, or delete,
by path with one line on its shape, and write nothing.

Done when: every item is recorded as observed, absent, or "ask",
and no file in the project has changed.

### 2. Decide

Read [references/decisions.md](references/decisions.md) when running step 2 (decide mode) or auditing without an anchor document:
it holds this layer's thickness table and all thirteen decisions.

Recommend one thickness with the conditions that selected it.
A thickness the handover already settled is taken as it is;
when the conditions call for more or less, say so once in the hand back.
A project that gates nothing still gets every decision returned,
saying what is not gated and why.

Return each decision settled (with observed tool, remote, or handover evidence)
or open (options, recommended first, reason, dependencies),
as `references/decisions.md` details:
a tool not yet running in a role is recommended, never observed;
a structure rule lacking an alternative and CI jobs outside GitHub/GitLab are open.
Handed over by an entry, ask the user nothing.

**Assigned invariants and style rules.** Sort every one handed over:
a formatter option, lint rule,
or type-checker setting can enforce it (name the rule);
a structure check can (name the rule and its alternative);
or nothing deterministic can
(return it in the hand back for the layers that own Knowledge or Feedback).
Never drop one silently.

Done when: the thickness has one recommendation with its conditions,
every row of the table is settled with evidence
or open with a recommendation first,
every assigned rule is sorted, and no file has changed.

### 3. Describe

Describe only what step 1 observed, as prose fit for a `HARNESS.md`,
naming what the rule "What is returned stands alone" lists.
Improve nothing: an observed practice is never replaced by a recommendation.
Intent the files do not state ("the hook has no tests,
probably for speed") is marked as inferred.
A check that exists but never blocks (`|| true`, `continue-on-error`,
`allow_failure`) is written as not blocking.
A project that gates nothing still gets the prose, saying so.

Done when: every check step 1 found is in the prose
with where it runs and whether it blocks,
every reason not found in a file is marked inferred,
and no file has changed.

### 4. Build

Build only what the agreed decisions say, in the files the plan lists.
A detail they leave open takes step 2's recommendation
and is reported as an assumption (no budget named: 10 seconds).
A file the work needs that the plan does not list is not written:
report it as a deviation.
A fact that forces a departure from an agreed decision
is reported as a deviation for the entry to put to the user.

**Hook.** Rework [assets/pre-commit-config.yaml](assets/pre-commit-config.yaml)
line by line for the agreed tools (translate it for another hook framework).
The hook always holds the formatter and the secret scan;
other checks enter only where they fit the budget.
An existing hook is changed only as the agreed decisions say.

**Recipes.** One recipe per check, each running its tool with quiet flags,
added to the aggregates' dependencies (see [references/tools.md](references/tools.md) when writing check recipes).
When the agreed check set holds tests and no test recipe exists,
write `test` with the runner's own compact reporter;
confirm the flag in `--help`.

**CI.** Read [references/github.md](references/github.md) when writing GitHub workflows,
or [references/gitlab.md](references/gitlab.md) when writing a GitLab pipeline.
One job per check, each running its recipe, plus the secret-scan job;
the summary gate only when one was agreed.
Always keep the asset's commented `# harness:` slot among the jobs:
the layer that owns Entropy puts the harness self-check job there
and, when the agreed decisions make the gate depend on it,
into the gate's dependencies. Registering a required check,
branch protection, and push protection are settings on the platform:
list them in the hand back by exact job name and never change them.

**Custom checks.** Read
[references/error-routing.md](references/error-routing.md) when writing or porting a structure check, hook, or lint rule.
Follow its failure message contract, error-not-pass rules, and exit codes (0 pass, 1 finding or error, 2 bad arguments), with `--help` and non-interactive execution.
A structure rule with no stated alternative gets no check:
add it to the pending decisions list.

**Agent-turn hook**, when one was agreed:
read [references/agent-turn-hook.md](references/agent-turn-hook.md) when registering it. Clients without such a hook get nothing.

**Knowledge file.**
Rework [assets/knowledge-checks.md](assets/knowledge-checks.md)
into the project's knowledge directory:
where each check runs, the budget, the rule on changing a check,
the hard read-only files, custom checks, and tools without a quiet mode.
Its route, with the load condition "before changing a check, a hook,
or a CI file, or when a check fails",
goes into the entrypoint's routing table only when the entrypoint exists
and stays within its budget;
otherwise hand it back as a route owed (the situation and the file).
The asset's soft read-only sentence
(how an agent may change a check's configuration) exists once in the project:
when another knowledge file already states it, delete it from this file,
link there, and list under the link only the configuration files this layer
adds; otherwise keep it and name this file in the hand back as its source.

**Anchor document.** When the project adopted one
and an agreed decision changes what it says about gates,
write the change into it in the same piece of work when run directly;
under an entry, hand back the sentence to reconcile there.
Otherwise write no `HARNESS.md`.

Done when: every agreed check has a recipe,
a CI job when the platform is supported,
and a hook entry or a stated reason it is not in the hook;
the full recipe depends on every check recipe;
and no file outside the plan's list was written.

### 5. Verify

- Run each check recipe in its check-only form and record exit code and
  line count; a failure on existing code is a finding, not a reason to
  loosen the check.
- Run the hook on the delivered files only (`pre-commit run --files
  <files>`) and time it against the budget.
- Run each custom check once on the clean tree (exit 0, nothing on stderr)
  and once on a temporary violating copy (exit 1 with the routing
  message); delete the copy.
- Validate each CI file with the platform's linter when available, and
  confirm every job the gate depends on exists in the file.
- Run the full test suite only when its agreed or observed duration is under
  15 minutes or the user agreed; otherwise run one test file and say so.

**A gate counts as built only once it was seen to reject a violation
of the kind it exists for.**
A hook that never runs and a job that checks nothing both look green.
Where it is cheap, show each gate failing once with a harmless violation:

- formatter, lint, typecheck: a temporary file that breaks one rule,
  passed to the recipe's check-only command;
- secret scan: a temporary file holding an obviously fake credential
  of a kind the scanner detects, never a real one;
- the hook: `pre-commit run --files <the temporary file>`,
  confirming the hook ran and exited non-zero;
- a custom check: the violating copy above.

Delete every temporary file and confirm `git status` shows none of them.
Never commit or push a violation to see CI fail:
a CI job or summary gate with no observed failing run
is reported as not verified.
Report every gate not shown to fail as not verified, with the reason.

Done when: every item has a recorded result,
every gate is recorded as shown to fail or as not verified,
and each red result is in the hand back as a finding or a pending decision.

### 6. Audit

Compare the project with the anchor document's text about gates
when the project adopted one;
otherwise with what step 2 recommends for the project's conditions,
marking every finding as having no recorded design to compare with.
Report each disagreement once.

Read [references/audit.md](references/audit.md) when running this step:
it lists what to look for and how each finding is classed and disposed.

Done when: every check the source of truth names and every check found
in the project appears in a finding or is confirmed consistent,
and no file has changed.

### 7. Hand back

- **decide**: the recommended thickness with its reasons;
  every decision of step 2, settled with its evidence
  or open with its options, recommended first, its reason,
  and what it depends on;
  the settings a human applies on the platform, by exact name;
  what is deliberately not gated and why;
  the assigned invariants and style rules this layer cannot enforce.
- **describe**: the prose, with inferred intent marked.
- **build**: every file written or changed with its role and its result
  from step 5; each gate as shown to fail or not verified;
  assumptions made where the agreed decisions were silent;
  deviations a fact forced, worded so the entry can put them to the user;
  findings on existing code; routes owed; the pending decisions list;
  the platform settings a human or the layer owning Authority must apply,
  by exact name (on GitHub with a gate: `checks / gate`);
  the CI file holding the `# harness:` slot;
  which file states the soft read-only sentence;
  which checks left the hook and why;
  and that the project owns the delivered checks.
  For a plan-only handover: the list of files from step 1, nothing else.
- **audit**: the findings table and nothing else changed.

No hand back names a skill.

## Gotchas

- `pre-commit run --all-files` runs the formatter over the whole tree
  and rewrites files nobody agreed to; verify with `--files`.
- A formatter in the hook rewrites staged files and fails the commit;
  the agent re-stages and commits again.
  That is the design, not a failure to route around with `--no-verify`.
- When the agreed secret scanner cannot be installed,
  the scan becomes the first pending decision with the alternatives;
  a hook delivered without a scan is reported as incomplete, never as done.
