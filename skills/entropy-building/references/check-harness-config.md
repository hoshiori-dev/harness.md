# Self-Check Configuration

Read when deciding where the harness self-check lives and in which
language, and when configuring, porting, or wiring it.

The check exits 2 on an input it cannot use instead of skipping it, because
a skipped check looks like a passed one; a port keeps that.

## Settings from observation

Set every `# CONFIGURE:` line of [the script](../assets/check_harness.py)
from what the observation found and the section says.

| Setting | From |
|---|---|
| `ENTRYPOINT` | the entrypoint file (`AGENTS.md`) |
| `KNOWLEDGE_DIRS` | each knowledge directory (`.agents/knowledge`) |
| `EXTRA_DOCS` | other harness documents (`CLAUDE.md`, `ARCHITECTURE.md`); never `HARNESS.md` |
| `TASK_RUNNER`, `RUNNER_FILE` | `"just"` + `justfile`, `"make"` + `Makefile`, `"npm"` + `package.json`; `None` without a runner |
| `MIRROR_PAIRS` | each confirmed pair, source side first (the finding tells the agent to correct the second file), with the heading lines of the sections that must match in each file; `[]` compares the whole files |
| `IGNORE_PATHS` | only mentions the user confirms are deliberately not repository paths (gitignored, generated) |
| `TIER2`, `ENTRYPOINT_BUDGET`, `SKILL_DIRS` | `True` when the section turns the second tier on; the budget the Knowledge section sets; the project skill directories |
| `REQUIRED_PATHS`, `DESIGN_DOC`, `DESIGN_VALIDATOR` | only when the project keeps `HARNESS.md`: see `design-document.md` |

Tier 1 checks links and backticked paths in the entrypoint, knowledge
files, and extra documents; backticked task-runner mentions
(`` `just test` ``) against the runner's recipe list; that every knowledge
file is referenced from the entrypoint; the mirror pairs; the required
paths; and the design document. Tier 2 checks project skill frontmatter
(name equals directory, description present and at most 1024 characters)
and the entrypoint's line budget; while it is off, stderr says so.

## Language and placement

Put the script where the project's management scripts live (`scripts/`).
The Python is a reference implementation. Default: keep it when the
project's management language is Python or the project has none; write a
port when the project manages itself in another language, because the team
must read and maintain its own checks. Take the language from the Style or
Environment section when one names it. A port (TypeScript on Node or Deno,
for example) keeps the same settings, rule ids, messages, JSON shape, and
exit codes. A port lists recipes from `just --summary` (not `just --list`,
which adds comments and groups), from `make -pRrq` minus the entries under
`# Not a target:`, or from the `scripts` keys of `package.json`. The Python
copy needs only `python3`; introduce uv as a project dependency only when
the design names it.

## Wiring

1. Add one recipe (`harness-check: python3 scripts/check_harness.py`, or
   the runner's equivalent).
2. Add that recipe to the aggregate `check` recipe (or the runner's
   equivalent), so the full check runs it with every other check.
3. Fill the `# harness:` slot left in the CI workflow with a job that runs
   the recipe, shaped like the jobs beside it, and delete the slot comment.
4. Where the section says the gate depends on the self-check, add that job
   to the gate's dependencies (`needs` on GitHub, the gate's job list on
   GitLab), so the required gate fails when the self-check fails.

When the workflow has no slot, add the job beside the other check jobs and
report that the slot was missing. When the project has no CI checks
workflow, add the job to the pending decisions list as a need for the layer
that owns Gates. Run the recipe once and put its output in the hand back.

## A check script that already exists

Report what it checks. Default: extend it with the checks it lacks when it
is in the project's management language and the team maintains it; replace
it only when the section says so. Never run two self-checks side by side.
