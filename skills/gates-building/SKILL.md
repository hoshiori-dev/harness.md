---
name: gates-building
description: >-
  Gates layer builder: Owns the Gates layer of a HARNESS.md, the
  deterministic checks in hooks and CI that block a defect whether or not
  the agent looked; use when a harness workflow hands this layer over or a
  broken or secret change landed.
license: Apache-2.0
compatibility: Scripts need Python 3.10+; uv optional.
---

# Gates Building

Defects are kept off the default branch by hooks and CI, not by
instructions. This skill designs, builds, extracts, or audits the Gates
layer of a project's agent harness: the formatter, secret scan, lint,
typecheck, tests, and structure checks that run in a seconds-fast commit
hook and in CI on GitHub or GitLab, the single summary gate a pull request
depends on, and the rule that no check is weakened to make a change pass. A
failing gate is context injected into the agent: it must arrive as errors
and a route, not as a log.

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

- **Gates and Feedback.** Feedback is what an agent can run and observe to
  verify its own work; Gates is what blocks a defect whether or not the
  agent looked. One command is usually both: Feedback owns that the agent
  can run it and read its output; Gates owns that the hook and CI run it
  and that it blocks.
- **Recipes are shared.** Hooks, CI jobs, and agents call the same
  task-runner recipes. The two aggregate recipes (a fast one and a full
  one) and the test recipes belong to the layer that owns Feedback; this
  layer adds the recipe of every check it introduces to their dependencies,
  and creates the aggregates only when they do not exist yet.
- **Quiet, never parsed.** Every check runs with its tool's own quiet or
  compact flags. Never add an output parser, filter, or wrapper; a tool
  with no quiet mode keeps its native output, recorded in one sentence.
- **Never weaken, never repair the product.** A check that fails on
  existing code is a finding in the hand back. Do not loosen the check, and
  do not fix application code unless the user asks.
- **Only deterministic checks are gates.** A rule no tool or script can
  decide (business-logic consistency, a privacy review) is returned in the
  hand back for the layer that owns Feedback, as a review step.
- **Handoffs by role.** Which commands an agent may run, required-check
  registration, branch protection, labels, and templates go to the layer
  that owns Authority; the harness self-check to the layer that owns
  Entropy; installing a tool into the agent environment to the layer that
  owns Environment. Describe the work; never name a skill.

## Workflow

### 1. Observe

Read, record, write nothing. Collect:

- the Gates section, the Context, and the assigned parts of Invariants and
  Style, when a `HARNESS.md` or a handover provides them;
- languages and package managers; the task runner and its recipes;
- every tool that runs today and the role it runs in: hooks
  (`.pre-commit-config.yaml`, `.husky/`, `lefthook.yml`, `.git/hooks/`),
  recipes, scripts, CI files; and tool configuration with no runner (a
  `[tool.ruff.lint]` table, `eslint.config.*`, `tsconfig.json`);
- client-side agent hooks that run a check (for example a hook on the end
  of an agent's turn);
- the hosting platform from `git remote -v` (GitHub, GitLab, other, none);
- runtimes present for custom checks (`python3`, `uv`, `node`, `deno`);
- knowledge files that already state where checks run or that checks may
  not be weakened;
- how long the test suite takes, from CI history or the user. Never run a
  hook or a formatter here: they rewrite files.

Done when: every item is recorded as observed, absent, or "ask", and no
file in the project has changed.

### 2. Write the section

**Extract** describes only what step 1 observed, in the same shape as
below; intent the files do not state ("the hook has no tests, probably for
speed") is marked as inferred, and a check that exists but never blocks
(`|| true`, `continue-on-error`) is written as not blocking.

**Design** settles every decision in this list. Take an observed fact as
it is; otherwise apply the default the project's Context selects.

| Decision | Default, and what selects it |
|---|---|
| Check set | A project that will be thrown away or where a wrong change is cheap: formatter and secret scan only. A wrong change costs real work to undo, the project outlives one release cycle, or more than one person relies on it: add lint, typecheck, and tests. A wrong change reaches production, customers, or money, or agents run unattended: add structure checks and a summary gate. |
| Secret scan | Always, in the hook and in CI, while any agent commits. A squash keeps what a draft commit contained, so every commit is scanned. |
| Tool per role | The tool already running in that role. Otherwise the ecosystem's most widely used tool, because agents know it best. Read [references/tools.md](references/tools.md) when naming a tool or writing any check command. |
| Task runner | The one in use; otherwise `just`, as the one command surface for hooks, CI, and agents. |
| Hook framework | The one in use; otherwise `pre-commit`. |
| Hook budget | 10 seconds on a typical commit: short enough that nobody is tempted to skip it. Read [references/hook-budget.md](references/hook-budget.md) when setting the budget, placing a check, or when an existing hook is slower than the budget. |
| Where each check runs | Formatter and secret scan in the hook, always; every other check in the hook only when it fits the budget; every check in CI and in the full recipe. |
| CI platform | The platform Context names: GitHub or GitLab, never both. Any other host: hook and recipes only, with the CI jobs as an open question. |
| Summary gate | One job that fails unless every check job succeeded, and the only check proposed as required. Default on when the default branch is protected, more than one person merges, or agents run unattended; otherwise off. |
| Structure checks | None, unless Invariants or Style states a rule a script can decide (import direction, file placement, size limits). Each needs a stated alternative before it becomes a check. |
| Script language | The language the project already scripts in; otherwise the idiom of its main language; otherwise Python with the standard library. Never a language the user says they cannot read. |
| Agent-turn hook | None. When agents run unattended on a client that can run a script at the end of a turn, run the fast recipe there so a turn cannot end on a red check. |
| Changing a rule | Never weakened to pass. The secret-scan hook and CI job are hard read-only: no agent changes them. Every other check configuration is soft read-only: an agent changes it only in a way that keeps the rule, or through a proposal the user accepts. |

**Assigned parts of Invariants and Style.** Sort every sentence handed
over: a formatter option, lint rule, or type-checker setting can enforce it
(name the rule); a structure check can (name the rule and its alternative);
or nothing deterministic can (return it in the hand back for the layers
that own Knowledge or Feedback). Never drop one silently.

The section is written in plain prose a reader without this skill can
build from. It names: each check with its tool and exact command; where
each runs (hook, CI job by name, recipe); the hook budget in seconds; the
platform and whether a summary gate exists, with its job name; each
structure rule with what to do instead; the rule on weakening checks and
which files are hard read-only; the settings a human must apply on the
platform (the required check by name, branch protection, push protection);
and what is deliberately not gated, with the reason. A project that gates
nothing still gets the section, saying so and why.

Done when: every row of the table has an observed fact, an applied default
with its reason, or an open question, and every assigned sentence is
sorted.

### 3. Build

Build only what the section says; a missing detail takes the table's
default and is reported as an assumption.

**Hook.** Rework [assets/pre-commit-config.yaml](assets/pre-commit-config.yaml) line by line for the
section's tools (translate it for another hook framework). The hook always
holds the formatter and the secret scan; other checks enter only where
they fit the budget. An existing hook is changed only as the section says.

**Recipes.** One recipe per check, each running its tool with quiet flags,
added to the aggregates' dependencies. With `just`:

```just
# What the hook runs, over the whole tree.
check-fast: fmt-check secrets lint typecheck
# The task-end check: everything CI runs.
check: check-fast test boundaries
fmt-check:
    ruff format --check --quiet
secrets:
    betterleaks dir . --no-banner --redact
lint:
    ruff check --output-format concise --quiet
typecheck:
    pyright
boundaries:
    python3 scripts/check_boundaries.py
```

When the section gates on tests and no test recipe exists, write `test`
with the runner's own compact reporter; confirm the flag in `--help`.

**CI.** Read [references/github.md](references/github.md) when writing GitHub workflows, or
[references/gitlab.md](references/gitlab.md) when writing a GitLab pipeline. One job per check,
each running its recipe, plus the secret-scan job; the summary gate only
when the section has one. Always keep the asset's commented `# harness:`
slot among the jobs: the layer that owns Entropy puts the harness
self-check job there and into the gate's dependencies.
Registering a required check, branch protection, and push protection are
settings on the platform: list them in the hand back by exact job name and
never change them.

**Custom checks.** Read [references/error-routing.md](references/error-routing.md) when writing or
porting a structure check, hook, or lint rule. Its failure names the file
and line, what is wrong, the rule and where it is written, and what to do
instead; an input it cannot read is an error naming that input, never a
pass. A delivered script runs non-interactively, offers `--help`, puts data
on stdout and diagnostics on stderr, and exits 0 on pass, 1 on a finding or
error, 2 on bad arguments.

**Agent-turn hook**, when the section has one: read
[references/agent-turn-hook.md](references/agent-turn-hook.md) when registering it. Clients without
such a hook get nothing.

**Knowledge file.** Rework [assets/knowledge-checks.md](assets/knowledge-checks.md) into the
project's knowledge directory: where each check runs, the budget, the rule
on changing a check, the hard read-only files, custom checks, and tools
without a quiet mode. Its route, with the load condition "before changing
a check, a hook, or a CI file, or when a check fails", goes into the
entrypoint's routing table only when the entrypoint exists and stays
within its budget; otherwise hand it back as a route owed (the situation
and the file). The asset's soft read-only sentence (how an agent may
change a check's configuration) exists once in the project: when another
knowledge file already states it, delete it from this file, link there,
and list under the link only the configuration files this layer adds;
otherwise keep it and name this file in the hand back as its source.

Done when: every check the section names has a recipe, a CI job when the
platform is supported, and a hook entry or a stated reason it is not in
the hook; and the full recipe depends on every check recipe.

### 4. Verify

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
- Run the full test suite only when the section's stated duration is under
  15 minutes or the user agreed; otherwise run one test file and say so.

Done when: every item has a recorded result, and each red result is in the
hand back as a finding or a pending decision.

### 5. Audit

Compare the section with the project and report each disagreement once.
With no Gates section, compare the project with step 2's defaults for its
Context and mark every finding "no design to compare with".

- a check the section names with no hook entry, recipe, or CI job, and a
  check that runs but the section does not name;
- a check that cannot fail: `|| true`, `continue-on-error`,
  `allow_failure`, a skipped job the gate counts as success, a `paths:`
  filter on the workflow carrying the gate;
- a hook slower than the budget, or one without the secret scan;
- a custom check whose message lacks the rule or the alternative, or that
  passes on unreadable input;
- CI jobs that run commands differing from the recipes; unpinned actions
  or images; a workflow triggered by `pull_request_target`;
- check output that arrives as a full log although the tool has a quiet
  mode;
- a configuration change that weakened a rule (`git log -p` on the check
  configuration: a deleted rule, a widened exclusion with no reason);
- a design gap: the Context says a wrong change is costly or agents run
  unattended, and the section gates less than the table's default for it.

Each finding carries a severity, the evidence as `path:line` or a command
and its output, the sentence of the section it contradicts, and one of two
remedies: fix the artifact, or amend the design. Severity is `high` when a
safety boundary or an always-on rule is missing or contradicted (no secret
scan, a gate that cannot fail, a weakened rule), `medium` when the design
and the project disagree so that a task could go wrong, `low` for wording
or tidiness only.

Done when: every check in the section and every check found in the project
appears in a finding or is confirmed consistent, and no file has changed.

### 6. Hand back

- **design, extract**: the section text ready to paste; the defaults
  applied, each with its reason; the questions no default can answer; the
  assigned Invariants and Style sentences this layer cannot enforce.
- **build**: every file written or changed with its role and its result
  from step 4; assumptions made where the section was silent; deviations
  the code forced, worded so `HARNESS.md` can be corrected; findings on
  existing code; routes owed; the pending decisions list; the platform
  settings a human must apply, by exact name; the CI file holding the
  `# harness:` slot; which file states the soft read-only sentence; and
  that the project owns the delivered checks.
- **audit**: the findings table and nothing else changed.

No hand back names a skill.

## Gotchas

- `pre-commit run --all-files` runs the formatter over the whole tree and
  rewrites files nobody agreed to; verify with `--files`.
- A formatter in the hook rewrites staged files and fails the commit; the
  agent re-stages and commits again. That is the design, not a failure to
  route around with `--no-verify`.
- When the section's secret scanner cannot be installed, the scan becomes
  the first pending decision with the alternatives; a hook delivered
  without a scan is reported as incomplete, never as done.
