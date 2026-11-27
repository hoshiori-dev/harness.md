---
name: authority-building
description: >-
  Owns the Authority layer of an agent harness (what agents may do alone,
  what waits for a human, how work is committed, branched, merged, released);
  use when a harness entry hands the layer over or agents need permission or
  platform rules.
license: Apache-2.0
compatibility: >-
  Scripts need Python 3.10+ (uv optional) and an authenticated gh or glab;
  recipe tests need just and pytest.
---

# Authority Building

The environment decides what an agent *can* do;
Authority decides what it *may* do alone.
How it works with the repository and the hosting platform is the same question,
so the layer has a **policy half** (action classes, permission lists, refusals,
checkpoints, commits), decided for every project,
and a **platform half** (branches, merging, releases, labels, forms,
remote settings), decided only when the project's conditions
or the `origin` remote name GitHub or GitLab.
With no hosted remote, skip every platform item
and say so in one sentence in what is handed back.

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

- **Asked directly, decide before files.** With no entry running,
  run steps 1 and 2 for what was asked and show, with the decisions,
  the files step 4 would write. Ask for a deletion's go-ahead yourself.
  Never create a `HARNESS.md`.
- **One key: reversibility.** An action is reversible and internal, or
  irreversible or outward. No third class.
- **Remote writes are deltas.** Show the current value and the exact
  command or payload, apply only after the user's go-ahead for that one
  delta, read it back, record it.
- **A declined proposal is a decision taken**, not a pending one: record
  the value kept, its owner, and the condition that reopens it.
- **Invariants about what an agent may do** arrive among the agreed
  decisions. Each joins the entrypoint core (step 4, item 4) and,
  where one can express it, a deny entry or a platform rule.
  Hand back each one nothing enforces.
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
| [reversibility](references/reversibility.md) | when settling, describing, or checking action classes or the standing list |
| [framework-rules](references/framework-rules.md) | when settling, writing, or checking permission entries, client files, or attribution |
| [checkpoints](references/checkpoints.md) | when settling, writing, or checking checkpoint rules, recipes, or commit rules |
| [denial-handling](references/denial-handling.md) | when writing the refusal rule, or another response to a refusal is proposed |
| [pending-decisions](references/pending-decisions.md) | when the first item enters the list or its format goes into a file |
| [platform-decisions](references/platform-decisions.md) | when step 1 names GitHub or GitLab and step 2, 3, or 6 runs |
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

From the handover, beside what every handover carries:
the parts of each reference the user chose to inherit,
and the anchor document's text for the layer when the project adopted one.

Policy half: the task runner and its recipes; test, lint, build,
and format commands;
commit-title style and attribution trailers in the last 30 commits;
permission files (`.claude/settings*.json`, `.codex/config.toml`,
`.codex/rules/`); any authority or git-workflow document; security hooks;
the entrypoint; the clients in use; signs of parallel agents.

Platform half, only when `origin` or the project's conditions
name GitHub or GitLab:
run the read-only probe [scripts/check_platform.py](scripts/check_platform.py)
as `uv run <this skill's directory>/scripts/check_platform.py --path <target>`;
add `--repo`, `--platform`,
or `--hostname` only when `origin` does not answer them.
Never redirect its output into the target. Read alongside:
platform knowledge files, the settings register, templates, forms,
and every file the probe lists under `label_files`.

- Exit 2 (platform unknown):
  re-run with `--platform` and `--hostname`
  when the remote URL or the project's conditions settle them;
  otherwise the platform is an open decision in step 2.
- Exit 1 (tool missing or logged out):
  quote the command its stderr names, install nothing,
  and continue from facts the user or the handover supplies;
  register rows are then marked unverified
  and every remote write becomes a pending human action with its exact command.
- Owner type, plan or tier, and visibility are three facts;
  an `unknown` one is an open decision, never inferred.

Plan only: return each file by path with one line on its shape,
and propose no remote change.

Done when: every item is observed, absent, or open;
the probe ran or its failure is recorded; no file changed.

### 2. Decide

Read [references/decisions.md](references/decisions.md) when running step 2 (decide mode) or auditing without an anchor document:
it holds this layer's thickness table and eleven policy decisions.
Read [platform-decisions](references/platform-decisions.md) when step 1 names GitHub or GitLab, and return its rows too.

Recommend one thickness with the conditions that selected it.
A thickness the handover settled is taken as it is.
At light, return only action classes, standing pre-authorisation, refusals,
and attribution, as entrypoint sentences. At medium, return every decision,
with no permission lists, checkpoint rules without recipes,
and each protection as a convention with a named owner.

Return each row in one of three forms:

- **Settled**, with its evidence (a file and line, a command's output,
  or the handover's sentence), when the repository, the remote,
  or the handover settles it, or the evidence makes one option clearly better:
  the commit convention from the last 30 commits,
  the platform from `origin`, the allow entries from the observed recipes.
- **Open** otherwise: the options, the recommended one first, its reason,
  and the decisions it depends on.
  Always open when nothing observed or handed over shows it:
  who reviews and merges, who owns remote settings,
  whether several agents write at once,
  whether outsiders open requests from forks, how unattended agents run.
- **Does not apply**, in one sentence.

Dependencies to name: every platform row depends on the hosting platform;
permission lists and the Codex approval mode on the clients in use;
the standing list and the ready rule on who reviews
and on how unattended agents run;
the required check on a gate job that runs green.
Handed over by an entry, ask the user nothing.

When the request or the handover asks for one of these,
give its reason against it once: per-command approval; an ask entry;
an allowed push or force push; an AI co-author trailer;
a board, milestone, or `priority:` label; git-flow for a new project;
a release bot. Handed over by an entry, return it as an open decision,
the recommendation first and the reason beside it, for the entry to put once.
A choice the user kept after that is a decision with the user's reason.
Decline, and do not record, "let the agent fix the rule that blocked it".

Done when: one thickness is recommended with its reasons;
every row is settled with evidence, open with options,
or does not apply; no file changed.

### 3. Describe

Describe what the project does today for every row of step 2 and,
with a hosted remote, of the platform decisions:
prose fit for the Authority section of a `HARNESS.md`,
which a reader without this skill can build from.
Name the project's own commands, entries, recipes, branch pattern,
label file path, and owners, not the row's wording.
Mark inferred intent "(inferred)". Improve nothing:
a practice that contradicts a recommendation is described as the practice
and listed in step 7.

Done when: every row has prose or a sentence that the project
has nothing for it, and no file changed.

### 4. Build

Write only the files the plan lists for this layer,
holding what the agreed decisions state.
A file the decisions need that the plan does not list is not written:
report it as a deviation.
Rework each asset line by line: every `# CONFIGURE:`
line resolved, guidance and inapplicable sections deleted.

1. **Policy file**, when the agreed decisions call for one: rework
   [assets/knowledge-authority.md](assets/knowledge-authority.md) into the knowledge directory, with the
   project's commands as examples.
   A choice the user kept against a recommendation
   goes into its deviations section with the user's reason.
2. **Permission files**: rework [assets/claude-settings.jsonc](assets/claude-settings.jsonc) into
   strict JSON, and [assets/codex-config.toml](assets/codex-config.toml) plus
   [assets/codex-authority.rules](assets/codex-authority.rules), holding exactly the agreed entries.
   Apply a change that widens agent autonomy only after a separate go-ahead
   for that operation. When run directly, ask for it here.
   An existing file loses an entry only where an agreed decision says so.
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
   proposed, never done. Add each agreed invariant, and a routing
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
   its command. An agreed required check with no green run of that job
   on the default branch: propose no delta and report a deviation.

Done when: every file the plan lists exists;
every delta is applied with its readback, declined and recorded,
or pending with its command; nothing outside the plan's list was written.

### 5. Verify

- Each permission file parses;
  Codex rules pass
  `codex execpolicy check --rules <file> -- <a denied command>`.
- No allow entry matches a command or recipe that pushes, publishes, releases,
  or writes to a tracker, wildcards included;
  no ask entry exists that no agreed decision records.
- Every recipe ran in the clone; the clone is gone;
  the target's status, branches, and stashes are unchanged.
- `grep -rnE '\{\{[A-Z_]+\}\}'` over the delivered files prints nothing;
  delivered tests pass; no delivered file names a skill directory.
- Every agreed decision maps to a line in a delivered file,
  a register row, or a deviation for step 7.

Done when: every check passed, or is in the hand-back as failed
or as not verified because it could not run.

### 6. Audit

Compare the project and the remote, read-only,
with the anchor document's text for this layer when the project adopted one.
With no anchor document,
compare with what the project's conditions call for
(the step 2 recommendations those conditions select)
and mark each finding "no recorded design to compare with".
Read [references/audit-findings.md](references/audit-findings.md) when classifying findings or choosing their dispositions in audit mode.

Done when: every row of step 2, and with a hosted remote
of the platform decisions, is checked and nothing changed.

### 7. Hand back

- **decide**: the recommended thickness with its reasons;
  every decision as settled with its evidence,
  open with its options, reason, and dependencies, or not applicable;
  with no hosted remote, one sentence saying so.
- **describe**: the prose; what is marked inferred;
  the practices that contradict the recommendations.
- **build**: files (path, role, verification);
  deltas with readbacks, declines, and pending human actions with commands;
  deviations a fact forced, for the user to decide;
  recommendations applied as assumptions; the pending decisions list;
  routes and rules owed; by-hand entries for clients without a generated file;
  invariants nothing enforces;
  the markers left for the layer that owns Completion;
  that the project owns the delivered scripts, recipes, and automation.
- **audit**: the findings table.

Name no skill in a hand-back.

## Gotchas

- Claude Code matches command text:
  `git -C . push` escapes a `Bash(git push *)` deny.
  Add the spellings history shows, no more.
- Codex no longer accepts `approval_policy = "untrusted"`: a finding;
  per-command prompting is written as prompt rules.
