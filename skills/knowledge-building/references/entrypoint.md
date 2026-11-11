# The Entrypoint

Read when sorting rules between Always and routing rows, when `AGENTS.md`
would exceed its budget, when a `CLAUDE.md` or a subdirectory entry file is
involved, or when the user asks why a line is or is not in the entrypoint.

## Order

1. **Title and purpose**: the project name and one or two sentences.
2. **Always**: rules whose breach harms whatever the task is. They are few,
   and they come first because attention decays with position. The section
   ends with the directory map when the design keeps one: the long-lived
   top-level directories, one line each. A map that changes when a file is
   added is too detailed; leave the map out when the names explain
   themselves or an architecture document carries it, and route to that
   document instead.
3. **When To Read What**: one row per situation, naming the file (and the
   section, when only part applies) or the skill to load.
4. **Validation**: one row per check, naming the recipe.
5. **Keep In Sync**: only when the design has an Entropy section; then the
   heading and the marker `<!-- harness: keep-in-sync -->`, nothing else.
   The layer that owns Entropy fills it.

## The task-type test

Ask of each rule: does breaking it cause harm whatever the task is? Yes →
Always. Only on some tasks → a routing row.

| Rule | Class | Why |
|---|---|---|
| Run the formatter before committing | Always | every task can end in a commit |
| Never commit secrets | Always | any edit can leak one |
| Read the schema notes before touching the ORM | Routing row | only ORM work needs it |
| Release steps and rollback | Routing row to a skill or file | only release tasks |

Invariants handed over from the design pass this test by definition: each
is one Always line. When an Invariant plainly concerns one kind of task,
keep the line and report the mismatch as a question for the design.

## Routing rows

- The condition is a situation or task the agent can recognise from its
  own work ("Changing a database migration", "A fixture fails to load"),
  never a topic heading.
- The row and the knowledge file's first line name the same situation.
- The table also declares where each kind of fact lives; organise it by
  source of truth, so two rows never point at two copies of one fact.

## Validation rows

Name the recipe (`just test`), read from the task runner; never paste the
raw command the recipe runs. When no task runner is agreed, name the plain
command and report the missing recipe to the layer that owns Gates.

## Why the budget

About 100 lines, never over 120, with a knowledge folder; about 200 for a
single-file harness. Always rules never leave for budget: content behind a
pointer loads only when the pointer's condition fires, and an Always rule
has no condition. The budget exists to force the inline-or-route choice for
every other paragraph (question 4 of the four questions).

## Readability

People review the entrypoint to confirm what agents will do. Write plain
sentences; never compress with private abbreviations or symbols.

## CLAUDE.md

Claude Code reads `AGENTS.md` by itself from v2.1.277 on, but only when the
directory has no `CLAUDE.md`. So:

| Situation | Result |
|---|---|
| No `CLAUDE.md`, every supported Claude Code is v2.1.277 or newer | create none |
| The project must support an older Claude Code | `CLAUDE.md` whose whole content is `@AGENTS.md` |
| An existing `CLAUDE.md` holds only rules for all agents | move each rule to Always or a routing row by the task-type test; then remove the file, once the section names the removal and the user gives the go-ahead at that step |
| An existing `CLAUDE.md` holds content for Claude Code alone | first line `@AGENTS.md`, then only that content; everything else moves to `AGENTS.md` |

Claude Code expands the `@AGENTS.md` import, so both files read as one
source. Never copy a rule into both files.

## Subdirectory entry files

The default is none: clients disagree on whether and when they load a
subdirectory file and which file wins, so a rule placed there may never
load. When the design names one (`packages/api/AGENTS.md`), write it with
local orientation only (what the directory holds, its local commands by
recipe name), open it with "The root `AGENTS.md` governs; this file adds
local orientation only.", and put no safety, commit, or publishing rule in
it and nothing that contradicts the root.

## Restructuring an oversized entrypoint

1. Number every line block and classify it: Always, routing row plus file,
   inline, stated by the code (drop), stale (drop), duplicate (keep the
   current copy).
2. Write the classification into the section, with the four answers for
   each new file, so one approval covers it.
3. Move content only as the approved section says; each moved block leaves
   a routing row in the same change.
4. When content moves into an existing architecture document, the row
   names the file and the target heading exactly, in inline code
   (`ARCHITECTURE.md`, section `## Data Flow`), so an agent finds it with
   `grep -n '^## Data Flow'`. Renaming that heading breaks the row; say so
   in the hand back for the layer that owns Entropy.
