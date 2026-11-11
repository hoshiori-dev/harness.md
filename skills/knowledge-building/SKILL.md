---
name: knowledge-building
description: >-
  Owns the Knowledge layer of an agent harness (the AGENTS.md entrypoint,
  on-demand knowledge files, the routes between them); use when a harness
  workflow hands the layer over or an entrypoint is missing, bloated, ignored,
  or stale.
license: Apache-2.0
---

# Knowledge Building

The entrypoint is the one file every agent session reads, so it is the
discovery root: a knowledge file nothing routes to is invisible, and a line
only some tasks need is paid for by every task. Context files that restate
what the code shows do not raise task success and add about a fifth to its
cost; only non-standard, project-specific practice earns its lines. This
skill settles, as the Knowledge section of `HARNESS.md`, where each piece of
project knowledge lives, and builds the entrypoint, the knowledge files, and
the routes between them.

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

- **Without a handover**, infer the mode from the request. Before writing a
  file that no Knowledge section covers, run steps 1 and 2 for the missing
  part, get one approval, and, when the project keeps `HARNESS.md`, record
  the text there.
- **The four questions.** Every file other than the entrypoint has to
  answer: (1) when, and through what mechanism, does an agent realise it
  needs this file (a routing row naming a situation, a skill route, or
  nothing); (2) what does the agent gain by reading it; (3) how much
  unrelated content does it read on the way; (4) is the jump, one more tool
  call, cheaper than inlining. A file that fails one is inlined or dropped.
  Split by when content is needed, never by topic.
- **Code describes itself.** Directory layout lives in the file system,
  commands in the task runner, contracts in type signatures. Documents
  carry what code cannot state: why, and when to read what. A copied fact
  is a future contradiction; never write one.
- **Only what an agent cannot infer.** Leave out anything a capable agent
  reads off the repository or already does by habit. A request to
  "document everything" is answered with what passes this rule and a list
  of what was left to the code.
- **`HARNESS.md` is not task reading.** No routing row sends a task to it.
  The entrypoint may name it in one line as the design to open when the
  harness itself is checked or changed.
- **Removing an agent-facing file** needs the section to name it and the
  user's go-ahead when the build reaches it. Without both, the file stays
  and the removal goes on the pending decisions list.
- **Stay in the layer.** A project skill's steps go to the skill that
  writes project skills; the entrypoint's sync rules to the layer that owns
  Entropy; hooks, checks, and CI to the layer that owns Gates; permissions
  to the layer that owns Authority. Hand over by describing the layer,
  never by naming a skill. README, CONTRIBUTING, and SECURITY are never
  written here; a contradiction with one is reported as a suggestion.
- **Assigned parts.** Each Invariant becomes one line of the entrypoint's
  Always block, meaning unchanged, whether or not a check also enforces it.
  From Style, write only the conventions an agent has to read to follow:
  into Always when every task needs them, otherwise behind a routing row;
  what a formatter, linter, or type checker enforces is not written at all.
  From File Structure, create the knowledge and skills folders this layer
  owns, and write a directory map only where the names do not explain
  themselves.

## Workflow

### 1. Observe

Read, record, write nothing. Collect:

- entrypoints: `AGENTS.md`, `CLAUDE.md`, subdirectory copies of either,
  other clients' entry files; each one's line count (`wc -l`); for
  `CLAUDE.md`, every rule absent from `AGENTS.md` and whether it concerns
  Claude Code only;
- knowledge: `.agents/knowledge/` or any other agent docs folder
  (`docs/agents/`, `.github/instructions/`), each file's first line, and
  which entrypoint line reaches it;
- project skills: `.agents/skills/`, `.claude/skills/` (real directory or
  link, and its target), each skill's name and description;
- the task runner and its recipe names; the management-script directory;
- the clients in use (`.claude/`, `.codex/`, other client settings) and,
  for Claude Code, the oldest version the project must support;
- an architecture document and human docs (README, CONTRIBUTING);
- routes owed: knowledge files other layers wrote or announced that no
  entrypoint row reaches yet.

Classify each existing artifact as current, invisible (no route reaches
it), duplicated, contradicting the code, stale, or restating the code, with
the evidence.

Done when: every item is recorded as observed, absent, or "ask", and no
file in the project has changed.

### 2. Write the section

In **extract** mode describe what step 1 found, decision by decision in the
order below: the files, what each holds, how an agent reaches it, and each
classification. Mark intent you inferred as "(inferred)"; never tidy what
exists into a default.

In **design** mode settle every decision. Take each from the handover or
the repository where it is settled there; otherwise apply the default.

1. **Entrypoint.** `AGENTS.md` is the only rule-bearing file. No
   subdirectory entry files: clients disagree on when they load one.
2. **`CLAUDE.md`.** None. Claude Code reads `AGENTS.md` by itself from
   v2.1.277 on when no `CLAUDE.md` exists, and a second file is a second
   copy. Keep or add a `CLAUDE.md` whose first line is `@AGENTS.md` only
   when the project must support an older Claude Code, or already has
   content meant for Claude Code alone; that content stays below the
   import, and every rule for all agents moves to `AGENTS.md`.
3. **Shape.** A project one person maintains for a short time gets a
   single-file harness: `AGENTS.md` alone, about 200 lines, no knowledge
   folder. Every other project gets an entrypoint of about 100 lines, never
   over 120, with knowledge files behind routing rows. The longer the
   project lives and the more people rely on its conventions, the more
   situations justify a file; none is created without a current need.
4. **Folders.** A knowledge or skills folder that exists is reused.
   Otherwise `.agents/knowledge/` and `.agents/skills/`, with
   `.claude/skills` a relative link to `.agents/skills` when Claude Code
   shares the repository with another client, so no skill exists twice; a
   real `.claude/skills` directory when Claude Code is the only client.
5. **A carrier for every piece of content**: each existing entrypoint line,
   knowledge file, and project skill, each Invariant and assigned Style
   convention, each rule or procedure the user named.
   - **Always block**: breaking the rule harms whatever the task is
     (secrets, commit and publish limits, language, the check to run before
     handing work back).
   - **Routing row and knowledge file**: one kind of task needs it. The
     section names the file, its "Read this when" situation, and what it
     holds.
   - **Nothing**: the code states it (leaf directories, the recipe list,
     signatures).
   - **Type, signature, or code comment**: read [references/inline-vs-document.md](references/inline-vs-document.md) when a candidate is a constraint, an invariant of one function, or a workaround.
   - **Project skill**: read [references/project-skill-warrant.md](references/project-skill-warrant.md) when a candidate is a procedure, when the user asks for a skill, or when an existing skill needs a routing row.
   - **Script**: read [references/scripts.md](references/scripts.md) when an operation takes more than two lines, assembles arguments, or filters output.
   - **Outside documentation**: a routing row naming the URL and the
     situation, only when the maintained truth lives there; tell the layer
     that owns Environment the host has to be reachable.
6. **Existing files that fail.** Per file: route an invisible one, merge a
   duplicate into the current copy, drop what restates or contradicts the
   code. Each move and each removal is named in the section.
7. **`HARNESS.md` line.** When the project keeps the file, one Always line
   names it as the design to open when the harness is checked or changed.

Read [references/entrypoint.md](references/entrypoint.md) when sorting rules between Always and routing rows, when the entrypoint would exceed its budget, or when a `CLAUDE.md` or a subdirectory entry file is involved.

Read [references/knowledge-files.md](references/knowledge-files.md) when the project already has agent docs anywhere, or when deciding what a knowledge file may hold.

Write the section so the layer can be built from it alone, in plain prose:
the entrypoint file and its line budget; every Always rule in its final
wording, or the statement that they are the Invariants one line each; every
knowledge file by path with its "Read this when" situation and what it
holds; every project skill by the procedure it carries and whether a row
routes to it; the folders; the `CLAUDE.md` decision with its reason; each
move and removal of an existing file; and what is deliberately left
undocumented (the directory tree, the recipe list) with the reason.

Done when: every candidate from step 1 and the handover has a carrier, each
default applied is listed with its reason, and nothing was written to the
project.

### 3. Build

Write only what the section describes; resolve every `# CONFIGURE:` line of
an asset and remove its comment.

1. `AGENTS.md`, reworked line by line from [assets/agents-md.md](assets/agents-md.md) when the entrypoint is created or restructured, in this order: purpose, Always (ending with the directory map when the section keeps one), When To Read What, Validation. Validation rows name recipes read from the task runner, never raw commands. When the design has an Entropy section, end with `## Keep In Sync` holding only the marker `<!-- harness: keep-in-sync -->`; the layer that owns Entropy fills it. Otherwise write no such section.
2. `CLAUDE.md` as the section decides: absent (an existing one is removed
   under the removal rule above, after its rules have landed in
   `AGENTS.md`), or first line `@AGENTS.md` from [assets/claude-md.md](assets/claude-md.md) when the section keeps one, followed only by the Claude-only content it lists.
3. Each knowledge file, reworked from [assets/knowledge-file.md](assets/knowledge-file.md) when the section names it: the first line is "Read this when …" naming the same situation as its routing row; one concern; facts first.
4. A routing row for every route owed, worded as the owing layer gave it.
5. The skills folder the section names. For the shared layout:
   `mkdir -p .agents/skills .claude`, an empty tracked
   `.agents/skills/.gitkeep` when the folder holds no skill, then
   `ln -s ../.agents/skills .claude/skills`. A real `.claude/skills` moves
   with `git mv` only where the section says so; when both folders hold
   skills, stop and add the merge to the pending decisions list.
6. For each procedure the section makes a project skill: the handoff
   definition from `references/project-skill-warrant.md`, passed to the
   skill that writes project skills, by role. Never write a skill body.
   Add its routing row only once its name is known; until then record the
   row as a follow-up.
7. Scripts and recipes the section names, under `references/scripts.md`.

Budget: count with `wc -l`. Over budget through routable content: move the
longest one-situation block behind a row the section already allows, or
report the overrun as a deviation. Over budget through Always rules alone:
keep every rule and report it; never drop a rule for budget.

Done when: every file the section describes exists or is on the pending
decisions list, and no file outside the section was touched.

### 4. Verify

Record the output of each check:

- `wc -l AGENTS.md` is within the budget the section states.
- Every routing row names a path that exists; every knowledge file's first
  line names the same situation as a row; no knowledge file is unrouted.
- Every Invariant in the handover is one Always line.
- A search for `{{` and `# CONFIGURE:` over the written files finds nothing.
- Every Validation recipe exists in the task runner's list.
- `CLAUDE.md` matches the decision: absent, or first line `@AGENTS.md` and
  no rule that `AGENTS.md` also states.
- Where the link was built, `test -L .claude/skills && test -d
  .claude/skills` succeeds and `readlink .claude/skills` prints
  `../.agents/skills`.
- No row routes a task to `HARNESS.md`.

Reading the files back as an agent that never saw this build is the
workflow's job, in a clean context. Without a handover, say that the layer
still awaits that read-back and list the files; never re-read them here as
a substitute.

Done when: every check is recorded as passed or failed and fixed.

### 5. Audit

Compare the section, sentence by sentence, with what step 1 observed. With
no section in the handover, compare with the defaults of step 2 for the
project's Context and mark each finding "no design to compare with".
Report as findings:

- an Invariant or Always rule of the section missing from the entrypoint;
  a `CLAUDE.md` that exists without importing `AGENTS.md` or states rules
  that differ from it: **high**;
- a knowledge file no route reaches; a row whose file is missing; a command
  or path in the entrypoint that the task runner or tree does not have; one
  fact stated in two files: **medium**;
- an entrypoint over budget; an Always rule that only some tasks need;
  content that restates what the code shows; a row routing a task to
  `HARNESS.md`; a subdirectory entry file carrying safety, commit, or
  publishing rules: **medium**;
- a knowledge file the section names that differs only in wording; a
  first line that does not match its row word for word: **low**.

For each finding recommend one side: fix the artifact when the section
still states what the project wants; amend the design when the project's
practice is the better answer or the section never decided.

Done when: every sentence of the section and every agent-facing file is
matched to evidence or to a finding, and no file has changed.

### 6. Hand back

- **design, extract**: the section text ready to paste; the defaults
  applied with their reasons (design) or the inferences and classifications
  made (extract); the questions no default can answer.
- **build**: every file created, changed, moved, or removed, each with its
  "Read this when" situation, the row that reaches it, and its verification
  result; the entrypoint's line count against its budget; deviations, each
  with the sentence to reconcile in `HARNESS.md`; skill handoffs made, by
  role; the sync position left for the layer that owns Entropy; the pending
  decisions list; the ownership notice for delivered scripts.
- **audit**: one row per finding: severity, evidence as `path:line`, the
  sentence of the section, and "fix the artifact" or "amend the design"
  with the change.

Done when: every item for the mode is in the hand back and it names no
skill.

## Gotchas

- Once a `CLAUDE.md` exists, Claude Code stops reading `AGENTS.md` by
  itself. A `CLAUDE.md` without the `@AGENTS.md` line hides every rule of
  the entrypoint from that client.
- Git stores `.claude/skills` as a link; a Windows checkout without
  `core.symlinks` gets a text file instead. Ask in the one round when the
  repository shows Windows contributors.
- Count lines with `wc -l` on the written file: blank lines, table rows,
  and code fences count toward the budget.
