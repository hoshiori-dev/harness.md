# Placement and Loading

Read before recommending a home for a rule, fact, or procedure,
or when the user wants to put a constraint in a subdirectory entrypoint, a hook,
or a skill. Ask first "when does the agent need this content?";
the home follows.

## Five ways content loads

| Content is needed | Home | Who decides it loads |
| --- | --- | --- |
| On every task | The always-on block at the top of the root entrypoint | Nobody; it is resident |
| By task type | A knowledge file named in the entrypoint's routing table, or a critical project skill the entrypoint names by situation | The agent, from the routing table |
| By location | A subdirectory entrypoint or path-matched rules (client-dependent) | The client, when the agent touches that location |
| By action | An event-triggered hook around a class of tool call (client-dependent) | The client, when the event fires |
| As a recognisable side procedure | A description-matched skill | The client, by description similarity |

The first two work in every client.
The last three load without the agent having to realise it needs the content,
with the limits below.

## Homes that are not documents

Prefer the strongest cheap mechanism.
A rule a machine can enforce does not belong in prose.

| Content | Home |
| --- | --- |
| A rule a formatter, linter, or type checker can enforce | That tool's configuration (a gate), never an entrypoint line |
| A constraint the code can express | A type, a schema, an assertion |
| A fact the code already states (layout, command flags, an interface) | Nowhere else; point at the code or the task-runner recipe |
| A local "why we did this" | A comment beside the code |
| A long command with argument assembly or output filtering | A task-runner recipe or script that prints a summary |

## Placement by content

- A rule whose violation costs the same whatever the task (secret handling,
  commit discipline, the validation command):
  the always-on block of the root entrypoint.
  Not a subdirectory file (it may not load),
  not a knowledge file (it loads only when routed),
  not a skill (matching is probabilistic).
- Information or architecture needed for one class of task:
  a knowledge file with a routing line that says when to read it.
- A recurring, non-obvious procedure that is fragile, ordered, or branching:
  a project skill; when a miss causes harm,
  the entrypoint routes to it by situation ("when about to do X, use Y").
- Something needed only when editing one directory,
  in a team on one client confirmed to load it:
  a subdirectory entrypoint, supplementary only.
- A sync rule ("when X changes, update Y"):
  a line in the root entrypoint that names its trigger;
  a hook or a sync skill only when the project has many such rules.
- The design of the harness itself (why a layer is the way it is):
  the project's `HARNESS.md`, which no ordinary task loads.
- An entrypoint or a draft of one: apply the lines above to each block,
  then report the resulting line count against the budget (about 100 lines;
  about 200 when it is the whole harness of a small project).
  Always-on rules are never squeezed out to meet it.

Before any split into a new file, four questions:
how does the agent know it needs the file; what does it gain;
how much irrelevant content rides along;
is the extra read cheaper than inlining?

## Client caveats

Location and action loading depend on the client,
and clients disagree on when a subdirectory file loads and on what wins
when several apply.
A project may rely on those modes only when the team uses one client confirmed
to support them; mixed or undecided teams use them for local,
supplementary information only.

Recorded behaviour as of November 2026;
check each client's current documentation before relying on it:

- Claude Code loads `CLAUDE.md` from the working directory and its ancestors
  at start-up, reads `AGENTS.md` natively when no `CLAUDE.md` exists
  (since v2.1.277), loads a subdirectory's file
  when the agent reads or writes under it,
  and supports path-matched rules under `.claude/rules/`.
- Codex loads `AGENTS.md` from the repository root down to the working directory
  and concatenates them; it does not load files below the working directory.
- Gemini CLI loads a directory's `GEMINI.md` and its ancestors
  when a tool touches that directory.
- Cursor applies a nested `AGENTS.md` when working in that directory or below,
  merged with parents, the more specific winning.
- GitHub Copilot documents only "nearest `AGENTS.md` wins",
  with no statement about parents.
- The `agents.md` convention itself fixes only "nearest to the edited file wins"
  and defines no loading moment.

When the repository does not show which clients the team uses,
ask before recommending location or action loading.

## The defensive rule for subdirectory files

Never waived, in any client:
a subdirectory entrypoint carries no rule
that must take effect and never contradicts the root.
The file may never load, and which file overrides which differs between clients.
Safety rules and commit discipline live only in the root entrypoint.

## Hooks

A hook that blocks a class of operation is a gate;
one that injects "remember to update X" after an operation is a reminder.
A hook is not the default home of a sync rule.

## Description matching is probabilistic

Good enough for an optional helper skill.
For a critical procedure (a release, a compliance review before commit),
a miss equals not having the skill, so the entrypoint names it by situation.
The test: if the honest answer to "how does the agent know it needs this?"
is "we hope the description matches", and a miss causes harm,
route it explicitly.
