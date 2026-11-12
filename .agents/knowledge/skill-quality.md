# Skill Quality

Read before writing or editing anything under `skills/*`:
a `SKILL.md`, a reference, an asset, or a script.
`just skills-check` enforces the mechanical rules below;
the rest is judgement this file makes explicit.
Which skills exist and how they hand work to each other
is in `.agents/knowledge/plugin-architecture.md`.

A skill earns its place in two ways:
it supplies context the agent does not have (this methodology,
non-obvious procedures,
exact formats) and it restricts output so the same process runs every time.
Write every rule for the least capable model the plugin supports
(the current Sonnet, Terra, and Flash tiers), not for the model at hand:
a stronger model tolerates a restriction it does not need;
a weaker one breaks without it.

## Scope

- One skill covers one coherent unit of work.
  Too narrow and it collides with its neighbours;
  too broad and it triggers unreliably.
- **Workflow skills** (`harness-design`, `harness-build`, `harness-extract`,
  `harness-audit`) are user-invoked: `disable-model-invocation: true`,
  self-contained procedures.
  Every other skill is model-invoked and reached by its description.
- A **layer builder** states `Owns the <Layer> layer` once in its description,
  with a name from `scripts/lib/layers.ts`.
  Workflows route by that phrase and name no builder.
- A skill is self-contained: no link leaves its directory,
  and no other skill library or install command is named.
  Repeated paragraphs are shared blocks (`.agents/knowledge/shared-blocks.md`).
  A skill refers to another skill of this plugin by role
  ("the skill that owns the Gates layer", "the methodology manual skill"),
  never by name. Two exceptions: workflows dispatch `harness-verifier` by name,
  and a workflow that tells the user which workflow to run next gives its name,
  because the user has to type it.
- A skill may name `HARNESS.md` and its section names freely.
  It may not assume the reader has `spec/spec.md`:
  what a skill needs from the format it states itself.

## Frontmatter

- `name` equals the directory name: lowercase, digits, single hyphens,
  at most 64 characters.
- `description`: third person, opens on the skill's leading word,
  gives most of its length to triggers ("Use when …"),
  names the neighbours it is not for ("Not for …") when confusion is likely,
  restates nothing from the body. Limits:
  a layer builder 240 characters, a workflow 400, any other 700;
  all descriptions together 8,000.
- `license: Apache-2.0`. `compatibility` only when the skill ships scripts.

## Body

- Order: `# Title`, one purpose paragraph, `## Rules on every step`,
  `## Workflow` with numbered steps, `## Gotchas`. A step ends with
  `Done when:` only where the boundary is checkable and changes how the step
  is executed or judged.
- A layer builder's workflow steps are fixed: `### 1. Observe`,
  `### 2. Write the section`, `### 3. Build`, `### 4. Verify`,
  `### 5. Audit`, `### 6. Hand back`.
- Every pointer to a reference states its load condition: "Read
  `references/x.md` when …", never "see references/".
- Inline what every branch needs; disclose into `references/` what only some
  branches reach. Co-locate a concept's definition, rules, and caveats.
- Give one default per decision, with the context that selects it and the
  reason. A skill that leaves two equal options makes agents choose
  inconsistently.
- Assets are raw starting shapes the agent reworks line by line; the
  how-to-use text belongs in `SKILL.md` or a reference, not in the asset.
  Placeholders `{{NAME}}` are allowed only on lines marked `# CONFIGURE:`.
- Under about 500 lines and 5000 tokens; longer means a split is overdue.

## Scripts and script assets

Delivered to other machines, so written in Python with PEP 723 inline metadata:
shebang `#!/usr/bin/env -S uv run --script`,
a `# /// script` block with `requires-python = ">=3.10"` and the dependencies,
standard library preferred. Every script:
no interactive prompt, `--help` with a usage example,
data on stdout (JSON available) and diagnostics on stderr,
exit codes 0 / 1 / 2 (success / finding or error / bad arguments), idempotent,
errors that say what is wrong and how to fix it,
output above about 10,000 characters summarised by default with `--full`
or `--output`. Every script and script asset has a sibling `<name>_test.py` run
by `just test`; `ruff` (`just lint`)
applies, with `BLE001` and `S110` as errors: no bare `except`, no silent `pass`.

## Pruning

Three passes over anything written or touched, description included:
deduplicate (one source of truth per meaning),
relevance (delete what no longer bears on the skill),
no-op hunt (delete every sentence that would not change behaviour
on the weakest supported model). Delete sentences whole;
do not rewrite them softer.

## Behavioural tests

Every skill's OpenSpec spec (`openspec/specs/skill/<name>/spec.md`)
carries its test cases as scenarios:
at least three prompts that should load it and three near misses
that should not, and at least two outcome tasks with a result a reader
can judge without seeing the skill.
They run by hand through clean-context subagents
on the least capable model tier available, never in CI;
the pull request records the results. Trigger prompts never name the skill.

## Diagnosing a misbehaving skill

Start from the symptom:
never triggers or fires on the wrong task → the description;
stops a step early or works shallowly → missing or weak `Done when:`;
never opens a reference → its pointer has no condition;
hard to edit or self-contradicting → duplication;
long but every line looks legitimate → sprawl, prune.
Apply the smallest general fix, then prune and re-run `just skills-check`.
