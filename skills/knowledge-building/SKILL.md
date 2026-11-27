---
name: knowledge-building
description: >-
  Owns the Knowledge layer of an agent harness (the AGENTS.md entrypoint,
  on-demand knowledge files, the routes between them); use when a harness
  entry hands the layer over or an entrypoint is missing, bloated, ignored,
  or stale.
license: Apache-2.0
---

# Knowledge Building

The entrypoint is the one file every agent session reads,
so it is the discovery root: a knowledge file nothing routes to is invisible,
and a line only some tasks need is paid for by every task.
Context files that restate what the code shows do not raise task success and add
about a fifth to its cost; only non-standard,
project-specific practice earns its lines.
This skill returns the decisions on where each piece of project knowledge lives,
and builds the entrypoint, the knowledge files, and the routes between them
from the decisions the user agreed to.

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

- **Without a handover**, infer the mode from the request.
  Before writing a file, run steps 1 and 2 for the part the request touches,
  show what the evidence settled, naming each move, ask the open decisions,
  and write only what the user accepted.
  When the project has an anchor document and the accepted change alters
  what it says about this layer, write the change there in the same work.
  Otherwise create no `HARNESS.md`.
- **The four questions.** Every file other than the entrypoint has to answer:
  (1) when, and through what mechanism,
  does an agent realise it needs this file (a routing row naming a situation,
  a skill route, or nothing); (2) what does the agent gain by reading it;
  (3) how much unrelated content does it read on the way;
  (4) is the jump, one more tool call, cheaper than inlining.
  A file that fails one is inlined or dropped.
  Split by when content is needed, never by topic.
- **Code describes itself.** Directory layout lives in the file system,
  commands in the task runner, contracts in type signatures.
  Documents carry what code cannot state: why, and when to read what.
  A copied fact is a future contradiction; never write one.
- **Only what an agent cannot infer.**
  Leave out anything a capable agent reads off the repository or already
  does by habit. A request to "document everything"
  is answered with what passes this rule and a list of what was left
  to the code.
- **`HARNESS.md` is not task reading.** No routing row sends a task to it.
  Only when the project adopted one as its anchor document
  does the entrypoint name it, in one line,
  as the design to open when the harness itself is checked or changed.
  Otherwise the entrypoint does not mention such a file,
  and this skill never creates one.
- **Removing an agent-facing file** needs an agreed decision that names it
  and the user's go-ahead for that file:
  carried by the handover, or asked for when the build reaches it.
  Without both, the file stays and the removal goes
  on the pending decisions list.
- **Stay in the layer.**
  A project skill's steps go to the skill that writes project skills;
  the entrypoint's sync rules to the layer that owns Entropy;
  hooks, checks, and CI to the layer that owns Gates;
  permissions to the layer that owns Authority.
  Hand over by describing the layer, never by naming a skill.
  README, CONTRIBUTING, and SECURITY are never written here;
  a contradiction with one is reported as a suggestion.
- **Assigned parts.**
  Each invariant the agreed decisions assign to this layer
  becomes one line of the entrypoint's Always block,
  meaning unchanged, whether or not a check also enforces it.
  Of the style conventions assigned,
  write only those an agent has to read to follow:
  into Always when every task needs them, otherwise behind a routing row;
  what a formatter, linter, or type checker enforces is not written at all.
  Of the file structure assigned,
  create the knowledge and skills folders this layer owns,
  and write a directory map only where the names do not explain themselves.

## Workflow

### 1. Observe

Read, record, write nothing. Collect:

- entrypoints: `AGENTS.md`, `CLAUDE.md`, subdirectory copies of either,
  other clients' entry files; each one's line count (`wc -l`);
  for `CLAUDE.md`, every rule absent from `AGENTS.md`
  and whether it concerns Claude Code only;
- knowledge: `.agents/knowledge/` or any other agent docs folder
  (`docs/agents/`, `.github/instructions/`), each file's first line,
  and which entrypoint line reaches it;
- project skills: `.agents/skills/`, `.claude/skills/` (real directory or link,
  and its target), each skill's name and description;
- the task runner and its recipe names; the management-script directory;
- the clients in use (`.claude/`, `.codex/`, other client settings) and,
  for Claude Code, the oldest version the project must support;
- an architecture document and human docs (README, CONTRIBUTING);
- a `HARNESS.md` in the root, and whether an entrypoint names it;
- routes owed: knowledge files other layers wrote or announced
  that no entrypoint row reaches yet.

Classify each existing artifact as current, invisible (no route reaches it),
duplicated, contradicting the code, stale, or restating the code,
with the evidence.

Done when: every item is recorded as observed, absent, or unknown,
and no file in the project has changed.

### 2. Decide

Read [references/decisions.md](references/decisions.md) when running step 2 (decide mode) or auditing without an anchor document:
it holds this layer's thickness table and all seven decisions.

Recommend one thickness with the conditions that selected it
(using a settled handover thickness when present and returning only its decisions).
Then return each decision as **settled**, with its evidence,
when the repository or the handover settles it
or the evidence makes one option clearly better;
otherwise as **open**, with its options (the recommendation first),
the reason, and the decisions it depends on.
A fact the repository cannot show (which Claude Code versions the
contributors run) makes its decision open.
Handed over by an entry, ask the user nothing.

State the decisions so the layer can be built from them alone:
the entrypoint file and its line budget;
every Always rule in its final wording,
or the statement that they are the assigned invariants one line each;
every knowledge file by path with its "Read this when" situation
and what it holds; every project skill by the procedure it carries,
the conditions of the bar it passed, and whether a row routes to it;
the folders; the `CLAUDE.md` decision with its reason;
each move and removal of an existing file;
and what is deliberately left undocumented (the directory tree,
the recipe list) with the reason.

Done when: the recommended thickness has its reasons,
every candidate from step 1 and the handover has one carrier,
every decision is settled with evidence or open with options,
and nothing was written to the project.

### 3. Describe

Describe what step 1 found, as prose fit for a `HARNESS.md`,
in the order of the decisions of step 2:
the files, what each holds, how an agent reaches it,
and each classification with its evidence.
Report a contradiction between two files as found,
with which client sees which file.
Mark intent you inferred as "(inferred)".
Improve nothing: never tidy what exists into a recommendation of step 2,
and never present a recommendation as the project's practice.

Done when: every artifact from step 1 is described and classified,
and nothing was written to the project.

### 4. Build

Work from the agreed decisions and the files the plan lists for this layer.
A handover that asks for the plan only gets, after step 1,
every file this step would create, change, move, or delete,
each by path with one line on its shape; write nothing.
Otherwise write only those files; resolve every `# CONFIGURE:`
line of an asset and remove its comment.
A file step 1 found that neither the decisions nor the plan mention
(an unrouted agent doc) stays in place and is reported as a deviation.

1. `AGENTS.md`, reworked line by line from [assets/agents-md.md](assets/agents-md.md) when the entrypoint is created or restructured, in this order: purpose, Always (ending with the directory map when the decisions keep one), When To Read What, Validation. Validation rows name recipes read from the task runner, never raw commands. Only when the handover says the Entropy layer's thickness is not omitted, end with `## Keep In Sync` holding only the marker `<!-- harness: keep-in-sync -->`; the layer that owns Entropy fills it. Otherwise write no such section and no marker; a sync section the project already has is left as it is.
2. The `HARNESS.md` line of the Always block only when the decisions
   say the project adopted an anchor document; otherwise delete it.
   While the file does not exist yet, leave the line out
   and hand it back as a route owed;
   when it comes back, write this Always line, not a routing row.
3. `CLAUDE.md` as decided: absent (an existing one is removed
   under the removal rule above, after its rules have landed in
   `AGENTS.md`), or first line `@AGENTS.md` from [assets/claude-md.md](assets/claude-md.md) when the decisions keep one, followed only by the Claude-only content they list.
4. Each knowledge file, reworked from [assets/knowledge-file.md](assets/knowledge-file.md) when the decisions name it: the first line is "Read this when …" naming the same situation as its routing row; one concern; facts first. Never copy raw task-runner recipe bodies or self-evident directory trees into a knowledge file; name only the recipe or non-obvious rule.
5. A routing row for every route owed, worded as the owing layer gave it.
6. The skills folder the decisions name. For the shared layout:
   `mkdir -p .agents/skills .claude`, an empty tracked
   `.agents/skills/.gitkeep` when the folder holds no skill, then
   `ln -s ../.agents/skills .claude/skills`. A real `.claude/skills` moves
   with `git mv` only where the decisions say so; when both folders hold
   skills, stop and add the merge to the pending decisions list.
7. For each procedure the decisions make a project skill: the handoff
   definition from `references/project-skill-warrant.md`, passed to the
   skill that writes project skills, by role. Never write a skill body.
   Add its routing row only once its name is known; until then record the
   row as a follow-up.
8. Scripts and recipes the decisions name, under `references/scripts.md`.

Budget: count with `wc -l`. Over budget through routable content:
move the longest one-situation block behind a row the decisions allow,
or report the overrun as a deviation. Over budget through Always rules alone:
keep every rule and report it; never drop a rule for budget.

A departure a fact forced (a recipe that does not exist,
a folder already in use) is reported as a deviation
with the decision it departs from, for the user to decide.

Done when: every file the plan lists exists
or is on the pending decisions list,
and no file outside the plan was touched.

### 5. Verify

Record the output of each check:

- `wc -l AGENTS.md` is within the agreed budget.
- Every routing row names a path that exists; every knowledge file's first
  line names the same situation as a row; no knowledge file is unrouted.
- Every invariant assigned in the handover is one Always line.
- A search for `{{` and `# CONFIGURE:` over the written files finds nothing.
- Every Validation recipe exists in the task runner's list.
- `CLAUDE.md` matches the decision: absent, or first line `@AGENTS.md` and
  no rule that `AGENTS.md` also states.
- Where the link was built, `test -L .claude/skills && test -d
  .claude/skills` succeeds and `readlink .claude/skills` prints
  `../.agents/skills`.
- No row routes a task to `HARNESS.md`. Without an anchor document,
  `grep -n 'HARNESS.md' AGENTS.md` prints nothing
  and the build created no `HARNESS.md`.
- The keep-in-sync marker is present exactly when the handover says
  the Entropy layer is not omitted.

Reading the files back as an agent that never saw this build
is the entry's job, in a clean context.
Without a handover, say that the layer still awaits
that read-back and list the files; never re-read them here as a substitute.

Done when: every check is recorded as passed or failed and fixed.

### 6. Audit

Compare what step 1 observed with the anchor document's text for this layer
when the project adopted one.
Otherwise compare with what the recommendations of step 2
call for under the project's conditions,
and mark each finding "no recorded design to compare with".
Read [references/audit-findings.md](references/audit-findings.md) when classifying findings or choosing their dispositions.

Done when: every agent-facing file, and every sentence of the anchor
document's text for this layer when there is one,
is matched to evidence or to a finding, and no file has changed.

### 7. Hand back

- **decide**: the recommended thickness with its reasons;
  every decision of step 2, settled with its evidence or open
  with its options (recommended first), reason, and dependencies;
  each move and removal of an existing file;
  what is deliberately left undocumented.
- **describe**: the prose, ready to paste;
  the inferences and classifications made, each with its evidence.
- **build**, plan only: the files by path, each with one line on its shape.
- **build**: every file created, changed, moved, or removed,
  each with its "Read this when" situation, the row that reaches it,
  and its verification result; the entrypoint's line count against its budget;
  assumptions made where no decision covered a point;
  deviations, each with the agreed decision it departs from and,
  when the project has an anchor document, the sentence to reconcile there;
  skill handoffs made, by role;
  the sync position left for the layer that owns Entropy;
  the pending decisions list; the ownership notice for delivered scripts;
  without a handover, the files that await a read-back in a clean context.
- **audit**: one row per finding: class, severity, evidence as `path:line`,
  source of truth, proposed disposition.

Done when: every item for the mode is in the hand back and it names no skill.

## Gotchas

- Once a `CLAUDE.md` exists, Claude Code stops reading `AGENTS.md` by itself.
  A `CLAUDE.md` without the `@AGENTS.md` line hides every rule of the entrypoint
  from that client.
- Git stores `.claude/skills` as a link;
  a Windows checkout without `core.symlinks` gets a text file instead.
  Return the folders decision as open
  when the repository shows Windows contributors.
- Count lines with `wc -l` on the written file:
  blank lines, table rows, and code fences count toward the budget.
- A `HARNESS.md` in the root is an anchor document
  only when the entrypoint or the handover names it.
  Any other one is a reference: never route to it, name it, or build from it.
