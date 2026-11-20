# Inventory

Read before recording the first artifact,
and again when completing a finding a builder returned without all its parts.
The inventory reads and records; nothing changes.

## Where to look

- Entrypoints: `AGENTS.md`, `CLAUDE.md` (an `@AGENTS.md` import or a copy),
  `GEMINI.md`, `.github/copilot-instructions.md`,
  and every subdirectory entrypoint.
- Knowledge: `.agents/knowledge/`, `docs/` files an entrypoint names,
  `ARCHITECTURE.md`; README, CONTRIBUTING, and SECURITY
  only as sources of facts.
- Project skills: `.agents/skills/`,
  `.claude/skills/` (a real directory or links), `.codex/skills/`,
  and rule directories such as `.claude/rules/`.
- Client configuration: `.claude/settings*.json`, `.codex/config.toml`,
  `.codex/rules/`, `.gemini/`, registered tools and MCP servers,
  and the hook scripts these name.
- Environment: `.devcontainer/`, container files,
  the variables the task runner exports for agents.
- Feedback: test, run, and watch commands in the task runner;
  a scoped test command; dev-server scripts; where logs go.
- Gates: `.pre-commit-config.yaml` or another hook manager,
  CI workflows (`.github/workflows/`, `.gitlab-ci.yml`),
  the task-runner file (`justfile`, `Makefile`, `package.json` scripts).
- Authority: permission and policy files, a written list of what agents
  may do without asking; issue and request templates, label definitions,
  release configuration, CODEOWNERS, notes on the branch model.
- Completion: `openspec/`, `.specify/` or `specs/`,
  per-change `SPEC.md` and `PLAN.md`, a written definition of done.
- Entropy: a harness self-check, a "keep in sync" section,
  a sync or clean-up skill, mirror checks.
- A `HARNESS.md`, in the root or anywhere else.
- History: the last 30 commit titles,
  to tell the convention in use from an abandoned one,
  and the dates a check last failed when thinning is in question.
  History is used for nothing else.

## Four facts per artifact

One row per artifact; write `none` where a fact is missing.

| Fact | Question | `none` usually means |
| --- | --- | --- |
| Found by | Which entrypoint line, route, or location makes an agent find it? | invisible |
| Loads when | Always, on a stated condition, by location, by event, or by description? | invisible |
| Must agree with | Which file or tool is its source of truth? | stale, or it restates code |
| Kept current by | Which sync rule, check, or routine? | it will drift next |

Client settings, hooks, and subdirectory entrypoints load by location:
"found by: location" is a fact, not `none`.

## The self-check

A harness self-check is a script or task-runner recipe of the project
that checks the harness files themselves (links, recipes, budgets, mirrors).
Find it in the task runner and in CI. Run it only when it writes nothing;
quote its output above the findings found by hand,
and do not repeat what it already reports.
When the project has none, record that; whether one is missing
is the Entropy layer's verdict in the fitness reference.

## Always checked

- A check, hook, or recipe that calls a script inside a skill directory.
  The binding is the finding; the fix gives the project its own copy.
- The entrypoint's length against the budget the project states,
  else about 100 lines and at most 120.
- A client-specific entrypoint that copies the shared one
  instead of importing it, or that holds rules the shared one lacks.
- A document that restates what the code states
  (a directory listing, a command's flags).
- A subdirectory entrypoint that carries a rule that must always hold,
  or that contradicts the root.
- A sync rule that names only one direction.
- A knowledge file with no stated load condition.
- An "ask" permission entry with no recorded reason,
  and a permission entry that allows an irreversible or outward action
  (a force push, a publish, a deletion on the remote): severity high.
- A custom check whose failure message does not say
  how to fix what it found.
- A built file that tells agents to read a `HARNESS.md` on ordinary tasks.
- One stale fact found once: search the whole repository
  for every other copy and list every location in the same finding.

## Applying the classes

Each finding has exactly one class.

| Class | How to confirm it | Usual disposition |
| --- | --- | --- |
| stale | the path does not exist, the command is not in the task runner or manifest, the interface changed | update from the source of truth |
| duplicated | both copies agree today and nothing holds them equal | keep the copy at the source, replace the other with a pointer |
| contradictory | two statements of intent disagree; or a specification contradicts the code | intent: the user says which is the source of truth; fact: the code decides. Always first in the plan |
| invisible | no route reaches it and it does not load by location; or its trigger can no longer fire | reconnect or remove; never leave |
| missing | the project's conditions or the anchor document call for it, and nothing exists | build it |
| excessive | the constraint, what it was there to catch, and the evidence that this no longer occurs are all named | thin or remove |

Evidence an excessive finding needs:
the constraint (file and line);
what it was there to catch (its comment, its commit message, a linked issue);
why that no longer occurs (the module or API is gone, the migration finished,
the check has not failed in the available history, a stronger check covers it).
Without all three it is not a finding but a question for the user.

## Dispositions

update (needed but wrong); reconnect (correct but unreachable);
move (loaded more often than it applies: put it behind a narrower route);
merge (two files always read together);
split (part always needed, the rest conditional; prefer merging);
thin (valid but heavier than needed);
remove (obsolete, duplicated, or its cause is gone);
leave (accurate, reachable, proportionate).
Ask before proposing the removal of anything that looks maintained.
