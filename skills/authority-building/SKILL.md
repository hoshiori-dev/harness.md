---
name: authority-building
description: >-
  Owns the Authority layer of an agent harness (what agents may do alone,
  what waits for a human, how work is committed, branched, merged, released);
  use when a harness workflow hands it over or agents need permission or
  platform rules.
license: Apache-2.0
compatibility: >-
  Scripts need Python 3.10+ (uv optional) and an authenticated gh or glab;
  recipe tests need just and pytest.
---

# Authority Building

The environment decides what an agent *can* do; Authority decides what it
*may* do alone. How it works with the repository and the hosting platform
is the same question, so the layer has a **policy half** (action classes,
permission lists, refusals, checkpoints, commits), built for every project,
and a **platform half** (branches, merging, releases, labels, forms, remote
settings), built only when the Context names GitHub or GitLab. With no
hosted remote, skip every platform item; the section says so.

Steps by mode: design and extract run 1, 2, 6; build runs 1, 3, 4, 6;
audit runs 1, 5, 6.

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

- **No section, no files.** Asked directly for files no Authority section
  covers, first draft the section (steps 1 and 2), get one approval, and
  record it in `HARNESS.md` when the project keeps it.
- **One key: reversibility.** An action is reversible and internal, or
  irreversible or outward. No third class.
- **Remote writes are deltas.** Show the current value and the exact
  command or payload, apply only after the user's go-ahead for that one
  delta, read it back, record it.
- **A declined proposal is a decision taken**, not a pending one: record
  the value kept, its owner, and the condition that reopens it.
- **Invariants about what an agent may do** arrive in the handover. Each
  joins the entrypoint core (step 3, item 4) and, where one can express
  it, a deny entry or a platform rule. Hand back each one nothing enforces.
- **Delivered automation** runs only base-ref code on fork events, with
  least permissions and every action or image pinned by digest.
- **Neighbours, by role.** Which tools exist and what they reach, sandbox
  mode, network, token scope: the layer that owns Environment. CI jobs,
  hooks, secret scanning: the layer that owns Gates; this layer only makes
  the platform require a job that already runs green. What a recorded
  approval such as a `spec:approved` label means, and the pre-authorisations
  a spec carries: the layer that owns Completion; this layer reserves the
  `spec:` label namespace, keeps the one label file and its sync, and
  leaves the `<!-- harness: spec-workflow -->` markers for that layer to
  fill.

Read a reference only on its condition:

| Read | When |
|---|---|
| [reversibility](references/reversibility.md) | when writing or checking action classes or the standing list |
| [framework-rules](references/framework-rules.md) | when writing or checking permission entries, client files, or attribution |
| [checkpoints](references/checkpoints.md) | when writing or checking checkpoint rules, recipes, or commit rules |
| [denial-handling](references/denial-handling.md) | when writing the refusal rule, or another response to a refusal is proposed |
| [pending-decisions](references/pending-decisions.md) | when the first item enters the list or its format goes into a file |
| [github](references/github.md) | when step 1 names GitHub |
| [gitlab](references/gitlab.md) | when step 1 names GitLab |
| [branching](references/branching.md) | when a hosted remote needs branching or release rules |
| [merge-method](references/merge-method.md) | when a hosted remote needs its merge rule |
| [necessity](references/necessity.md) | when settling platform entities, or the probe found surplus |
| [remote-state](references/remote-state.md) | when several agents work at once |
| [publish-gate](references/publish-gate.md) | when reworking the project skill's gate, or before publishing anything |

## Workflow

### 1. Observe

Read, record, write nothing.

Policy half: the Authority section and handed-over parts, when they exist;
the task runner and its recipes; test, lint, build, and format commands;
commit-title style and attribution trailers in the last 30 commits;
permission files (`.claude/settings*.json`, `.codex/config.toml`,
`.codex/rules/`); any authority or git-workflow document; security hooks;
the entrypoint; the clients in use; signs of parallel agents.

Platform half, only when `origin` or the Context names GitHub or GitLab: run
the read-only probe [scripts/check_platform.py](scripts/check_platform.py) as
`uv run <this skill's directory>/scripts/check_platform.py --path <target>`;
add `--repo`, `--platform`, or `--hostname` only when `origin` does not
answer them. Never redirect its output into the target. Read alongside: platform knowledge files, the settings register,
templates, forms, and every file the probe lists under `label_files`.

- Exit 2 (platform unknown): re-run with `--platform` and `--hostname` when
  the remote URL or the Context settles them; otherwise ask in step 2.
- Exit 1 (tool missing or logged out): quote the command its stderr names,
  install nothing, and continue from facts the user supplies; register rows
  are then marked unverified and every remote write becomes a pending human
  action with its exact command.
- Owner type, plan or tier, and visibility are three facts; an `unknown`
  one is asked, never inferred.

Done when: every item is observed, absent, or "ask"; the probe ran or its
failure is recorded; no file changed.

### 2. Write the section

**extract**: describe what the project does today for every row below, mark
inferred intent "(inferred)", and keep practices that contradict the
defaults, listing them in step 6.

**design**: ask, in one round, only what step 1 could not show: who reviews
and merges, who owns remote settings, whether several agents write at once,
whether outsiders open requests from forks, how unattended agents run. Then
settle every row: the default, unless Context or evidence selects the
variant.

| Decision | Default, and why | Variant, and what selects it |
|---|---|---|
| Action classes | Two classes by reversibility, with this project's commands as examples, so a reader can sort a new action | Also name every irreversible action when a wrong change is costly or agents run unattended |
| Standing pre-authorisation | The outward actions agents take on every task; all others are named per task or queued | None on a public repository or where publication is costly |
| Refusals | Move the work or queue a pending decision; never retry by another route; a failed check is a defect, not a refusal | — |
| Permission lists | Allow observed test, lint, build, format, and read-only commands, one entry per recipe; deny the fixed list of unrecoverable actions; no ask entries, which train rubber-stamping. Files for Claude Code and Codex; other clients by hand | Per-command approval, or no client files, as the user's recorded decision |
| Codex approval mode | `on-request`: asks only to leave the sandbox | `never` when agents run unattended |
| Written policy | A policy file with its core in the entrypoint: a readable policy turns a refusal into a decision. Agents never edit it, the permission files, or security hooks | Entrypoint sentences and permission entries only, for a throwaway project |
| Checkpoints | Commits, never stashes; one task, one commit; drafts squashed per task; `checkpoint`, `squash-task`, `rollback`, `push-one` recipes, because a denied hard reset needs a safe rollback | — |
| Commit convention | The one history shows; else Conventional Commits, whose type makes squash messages mechanical | Plain 50/72 titles |
| Attribution | None in commits or requests; client settings that add it are turned off | The exact trailer a project that requires disclosure names |
| Concurrency | One agent at a time | Parallel on evidence: branch ownership, one coordinator for platform writes, each write pre-authorised |
| Step-by-step approval | Not in use | During bootstrap or specification with the user present, or where per-line accountability is required; state what ends it |
| Branching | GitHub Flow, `<n>-<slug>` branches deleted on merge: one base, nothing to pick wrong | Environment or release branches, or an existing git-flow, on evidence |
| Merge method | Squash only; the request title follows the commit convention | A recorded rule that picks one method per change |
| Ready and merge | The agent stops at a draft request and reports; a human marks ready and merges | An agent marks ready on green checks where agents run unattended and mistakes are cheap; merging stays human |
| Default-branch protection | Changes only through requests; no force push, no deletion | A convention with a named owner where the plan or tier cannot enforce it |
| Required check | One aggregating gate job, required only after a green run on the default branch | None while no such job exists |
| Platform entities | `type:` and `area:` labels, the reserved `spec:` namespace, bug, feature, and task forms, one request template; boards, milestones, `priority:` and `status:` labels absent on purpose | An entity that passes the deletion test |
| Labels | One committed label file, synced by a workflow or CI job; no pruning without an approved delete list | A named person runs the sync |
| Releases | A human pushes a `vX.Y.Z` tag and one workflow or job publishes; agents never push tags | "No releases"; a release bot only as a recorded decision |
| Remote settings | Each has an owner and a row in a settings register; none changes without a go-ahead for that delta | — |
| Issue-to-merge procedure | One project skill from taking an issue to merging, with a publish gate before every outward write | — |

Challenge each of these once, with its reason, then record the user's
choice and reason in the section: per-command approval; an ask entry; an
allowed push or force push; an AI co-author trailer; a board, milestone, or
`priority:` label; git-flow for a new project; a release bot. Decline, and
do not record, "let the agent fix the rule that blocked it".

Write prose a reader without this skill can build from, each item with its
reason. It states: the two classes with examples and the standing list;
the refusal rule; the pending decisions fields; each client's allow and deny
entries, or the rule that derives them from the task runner; the checkpoint
rules and recipe names; the commit convention and attribution rule;
concurrency; and, with a hosted remote, branch naming and base, merge
method, who marks ready and who merges, what protects the default branch
and who enforces it, the release trigger and who may pull it, the entities
kept and those deliberately absent, the label file path, and who owns
remote settings.

Done when: every row has text in the section or a sentence that it does
not apply, each challenged choice carries the user's reason, and no file
changed.

### 3. Build

Create only what the section, or the File Structure part handed over,
covers. Rework each asset line by line: every `# CONFIGURE:` line resolved,
guidance and inapplicable sections deleted.

1. **Policy file**, when the section calls for one: rework
   [assets/knowledge-authority.md](assets/knowledge-authority.md) into the knowledge directory, with the
   project's commands as examples.
2. **Permission files**: rework [assets/claude-settings.jsonc](assets/claude-settings.jsonc) into
   strict JSON, and [assets/codex-config.toml](assets/codex-config.toml) plus
   [assets/codex-authority.rules](assets/codex-authority.rules), holding exactly the section's entries.
   An existing file loses an entry only where the section says so.
3. **Checkpoint recipes**: rework [assets/checkpoint-recipes.just](assets/checkpoint-recipes.just) into
   the project's task runner. Exercise them only in a temporary clone
   (`git clone --quiet <target> <tmpdir>`, the target's recipe file run
   against it): `push-one` on the base branch and on a branch holding a
   draft, both refusing; `checkpoint` twice; `squash-task`; `rollback`.
   Never run a path that pushes; remove the clone. Deliver
   [assets/checkpoint_recipes_test.py](assets/checkpoint_recipes_test.py) only with `just` recipes.
4. **Entrypoint**: add the core to its always-on block: act alone only on
   reversible, internal work; an outward action needs pre-authorisation or
   goes to the pending decisions list; never retry a refused action by
   another route; loosening the policy, a permission list, or a hook is
   proposed, never done. Add each Invariant handed over, and a routing
   row per knowledge file this layer deposits (the policy: "before any
   outward action, and when an action is refused"). With no entrypoint, or
   one that would exceed its budget, write none of it and hand each back
   as a route owed (the situation and the file) or a rule owed.
5. **Platform files**, hosted remote only: every asset in the Files table
   of the platform reference, at the path it names, plus
   [assets/sync_labels.py](assets/sync_labels.py) and [assets/run_log_digest.py](assets/run_log_digest.py) with their
   tests in the project's scripts path; remove the other platform's code
   and run the tests there. The request template, the project skill's
   Finish step, and the knowledge file each keep
   `<!-- harness: spec-workflow -->` exactly once.
6. **Remote deltas**, one at a time: labels (forms rely on them), merge
   methods, branch protection, then a required check. Declined: record it
   and go on. Unreachable or rights missing: a pending human action with
   its command.

Done when: every file the section covers exists; every delta is applied
with its readback, declined and recorded, or pending with its command;
nothing outside the section was written.

### 4. Verify

- Each permission file parses; Codex rules pass
  `codex execpolicy check --rules <file> -- <a denied command>`.
- No allow entry matches a command or recipe that pushes, publishes,
  releases, or writes to a tracker, wildcards included; no ask entry exists
  that the section does not record.
- Every recipe ran in the clone; the clone is gone; the target's status,
  branches, and stashes are unchanged.
- `grep -rnE '\{\{[A-Z_]+\}\}'` over the delivered files prints nothing;
  delivered tests pass; no delivered file names a skill directory.
- Every sentence of the section maps to a line in a delivered file, a
  register row, or a deviation for step 6.

Done when: every check passes or its failure is in the hand-back.

### 5. Audit

Compare the section with the project and the remote, read-only. With no
Authority section, compare with the step 2 defaults for the Context and
mark each finding "no design to compare with". Report: an
ask entry or runner wildcard; an allowed push or force push; a missing
deny entry; stash-as-checkpoint or no rollback recipe; attribution in
recent commits against the rule; the policy, permission files, and
entrypoint core disagreeing; a register row whose readback differs from
the remote; merge methods, protection, or labels differing from the
section; a required check naming a job that does not exist; entities
outside the section; anything the project does that the section omits.

Severity: `high` when a safety boundary or always-on rule is missing or
contradicted (an unrecoverable or outward action can happen without a
decision); `medium` when design and project disagree so a task could go
wrong; `low` for wording or tidiness. Each finding gives evidence
(`path:line`, or a readback command and output), the section's sentence,
and whether to fix the artifact or amend the design.

Done when: every row of step 2 is checked and nothing changed.

### 6. Hand back

- **design, extract**: the section as prose; each default applied
  with the Context that selected it; questions no default can answer; in
  extract, the practices that contradict the defaults.
- **build**: files (path, role, verification); deltas with readbacks,
  declines, and pending human actions with commands; deviations for
  `HARNESS.md`; the pending decisions list; routes and rules owed; by-hand
  entries for clients without a generated file; Invariants nothing
  enforces; the markers left for the layer that owns Completion; that the
  project owns the delivered scripts, recipes, and automation.
- **audit**: the findings table.

Name no skill in a hand-back.

## Gotchas

- Claude Code matches command text: `git -C . push` escapes a
  `Bash(git push *)` deny. Add the spellings history shows, no more.
- Codex no longer accepts `approval_policy = "untrusted"`: a finding.
