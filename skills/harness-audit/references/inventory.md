# Inventory and Finding Classes

Read before inventorying the first artifact, and again when classifying
findings. The inventory reads and records; nothing changes.

## Where to look

- Entrypoints: `AGENTS.md`, `CLAUDE.md` (an `@AGENTS.md` import or a copy),
  `GEMINI.md`, `.github/copilot-instructions.md`, and every subdirectory
  entrypoint.
- Knowledge: `.agents/knowledge/`, `docs/` files an entrypoint names,
  `ARCHITECTURE.md`; `CONTRIBUTING.md` only as a source of facts.
- Project skills: `.agents/skills/`, `.claude/skills/` (a real directory or
  links), `.codex/skills/`, and rule directories such as `.claude/rules/`.
- Client configuration: `.claude/settings*.json`, `.codex/config.toml`,
  `.codex/rules/`, `.gemini/`, registered tools and MCP servers, and the
  hook scripts these name.
- Feedback: test, run, and watch commands in the task runner; a scoped
  test command; dev-server scripts; where logs go.
- Gates: `.pre-commit-config.yaml` or another hook manager, CI workflows
  (`.github/workflows/`, `.gitlab-ci.yml`), the task-runner file.
- Completion: `openspec/`, `.specify/` or `specs/`, per-change `SPEC.md`
  and `PLAN.md`, a written definition of done.
- Environment: `.devcontainer/`, container files, the variables the task
  runner exports for agents.
- Entropy: a harness self-check, a "keep in sync" section, a sync or
  clean-up skill, mirror checks.
- Platform: issue and request templates, label definitions, release
  configuration, CODEOWNERS.
- History: the last 30 commit titles, to tell the convention in use from
  an abandoned one. History is used for nothing else.

## Four facts per artifact

One row per artifact; write `none` where a fact is missing.

| Fact | Question | `none` usually means |
| --- | --- | --- |
| Found by | Which entrypoint line, route, or location makes an agent find it? | invisible |
| Loads when | Always, on a stated condition, by location, by event, or by description? | invisible or orphaned |
| Source of truth | Which file or tool must it agree with? | drifted, or it restates code |
| Kept current by | Which sync rule, check, or routine? | it will drift next |

## Classes

Each finding has exactly one class.

| Class | Meaning | Usual fix |
| --- | --- | --- |
| stale | names a path, command, interface, or structure that no longer exists | update it from the source of truth; when the stale text is in `HARNESS.md`, amend the design |
| duplicated | one fact in two places, still agreeing | keep the copy at the source, replace the other with a pointer |
| contradictory | one fact or rule in two places, disagreeing; includes an artifact that contradicts the design, and a spec that contradicts the code | intent: the design decides and the artifact changes, or the design is amended first; fact: the code decides |
| invisible | nothing reaches it, or its trigger can no longer fire | add the route, or remove it; never leave it |
| missing | the design calls for it, or the Context does, and nothing exists | build it; when the design is silent and the Context calls for it, amend the design first |
| unrecorded | an artifact that works and that no sentence of the design mentions | record it in the design, or remove it; the user chooses |
| excessive | a rule, check, skill, route, or gate that guards against something no longer present, or does more than the design says | thin or remove it, on evidence |

Contradictions come first in any repair: nothing is built on top of two
sources that disagree.

Evidence an excessive finding needs: the constraint (file and line), what
it was there to catch (its comment, its commit message, a linked issue),
and why that no longer occurs (the module or API is gone, the migration
finished, the last failure is far outside recent history, a stronger check
covers it).

## Always checked

- A check, hook, or recipe that calls a script inside a skill directory.
  The binding is the finding; the fix gives the project its own copy.
- The entrypoint against its budget: the one the Knowledge section states,
  else about 100 lines and at most 120.
- A client-specific entrypoint that copies the shared one instead of
  importing it, or that holds rules the shared one lacks.
- A document that restates what the code states (a directory listing, a
  command's flags).
- A subdirectory entrypoint that carries a rule that must always hold, or
  that contradicts the root.
- A sync rule that names only one direction.
- A knowledge file with no stated load condition.
- A "ask" permission entry with no recorded reason, and a permission entry
  that allows an irreversible or outward action.
- A custom check whose failure message does not say how to fix what it
  found.
- A built file that tells agents to read `HARNESS.md` on ordinary tasks.

## Proposed fixes

Update (needed but wrong), reconnect (correct but unreachable), move
(loaded more often than it applies: put it behind a narrower route), merge
(two files always read together), split (part always needed, the rest
conditional; prefer merging), thin (valid but heavier than needed), remove
(obsolete, duplicated, or its cause is gone), record (works but is not in
the design), leave (accurate, reachable, proportionate). Ask before
proposing the removal of anything that looks maintained.
