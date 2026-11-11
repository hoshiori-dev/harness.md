---
name: plugin-development
description: >-
  Adds, changes, or removes a skill or the agent shipped by the harness-md
  plugin, end to end: OpenSpec change with behavioural test scenarios,
  implementation to the skill quality bar and the plugin's contract, client
  file generation, checks, behavioural tests through subagents, and
  per-client verification. Use when asked to add or modify what the plugin
  ships, when the catalog or skills check fails, or when a client stops
  loading a component. Not for the HARNESS.md format or its validator
  (read the format-changes knowledge file), hub entries, or GitHub issue and
  pull-request mechanics.
---

# Plugin development

Every shipped entry lives in exactly one catalog (`skill` or `agent`) and is
described by exactly one spec; `just validate` enforces the pairing. Work
spec first, and treat the spec's scenarios as the entry's behavioural tests.

## Rules on every step

- Read `.agents/knowledge/plugin-architecture.md` before deciding what to
  add: every skill produces, reads, or builds from a project's `HARNESS.md`,
  and a new skill has to fit one of the kinds there (format, workflow,
  manual, layer builder, daily).
- Read `.agents/knowledge/skill-quality.md` before writing any file under
  `skills/`.
- A skill is self-contained: it links to nothing outside its directory,
  names other shipped skills by role only (`harness-verifier` is the one
  name allowed), and deposits nothing in a target project that names the
  plugin.
- Fix findings at their source; never edit a generated file or relax a
  check.

## Workflow

1. **Define.** Write down the task the skill covers (one coherent unit of
   work), its kind, its triggers including indirect phrasings, what the
   agent lacks without it, and its invocation mode (user-invoked only for
   the four workflows). If a bare agent already does the task well, stop:
   the skill adds nothing. A new layer is a format change first
   (`.agents/knowledge/format-changes.md`); a new builder without a new
   layer cannot exist, because each layer has exactly one.
2. **Budget.** Descriptions share 8,000 characters: a layer builder at most
   240, a workflow at most 400, any other skill at most 700.
   `just skills-check` prints every length and the total; when the total
   would pass the budget, cut another description in the same change.
3. **Spec, tests first.** Read `.agents/knowledge/spec-workflow.md`. Run the
   `openspec-propose` skill with the capability path `skill/<name>` or
   `agent/<name>`. The delta spec carries the behavioural test cases as
   scenarios: at least three prompts that should load the skill and three
   near misses that should not, and at least two outcome tasks with a
   result a reader can judge without the skill. State which clients the
   entry ships to. Stop until the pull request carries `spec:approved`.
4. **Implement by kind** (read `.agents/knowledge/client-matrix.md`):
   - *any skill*: `skills/<name>/SKILL.md` in the body order of
     `skill-quality.md`; shared paragraphs copied byte for byte from
     `.agents/knowledge/shared-blocks.md`; scripts and script assets in
     Python with PEP 723 metadata and a `_test.py` each.
   - *layer builder*: one sentence of description containing
     `Owns the <Layer> layer` with a name from `scripts/lib/layers.ts`; the
     four modes (design, extract, build, audit); the six fixed steps
     (Observe, Write the section, Build, Verify, Audit, Hand back); a
     default with its reason for every decision in step 2; the shared
     conventions of `plugin-architecture.md` (severity scale, routes owed,
     audit with no section).
   - *workflow*: `disable-model-invocation: true` and an
     `agents/openai.yaml` with `policy.allow_implicit_invocation: false`;
     it finds builders by the ownership phrase and names none.
   - *format skill* (`skills/harness-md/`): its
     `references/specification.md` is a byte-identical copy of
     `spec/spec.md`; change it only by copying, in a format change.
   - *agent*: `com.anthropic.claude-code/agents/<name>.md` only (Codex and
     Antigravity plugins carry no agents; `just validate` rejects an
     `agents/` directory under their namespaces); read-only tools unless
     the spec justifies writes.
5. **Prune.** Three passes over everything written: deduplicate, drop what
   no longer bears on the skill, delete every sentence that would not
   change behaviour on the weakest supported model.
6. **Generate and check.** `just gen` after any change to `plugin.json` or
   the agents directory; `just skills-check`; `just check`.
7. **Behavioural tests.** Run the spec's trigger prompts and outcome tasks
   through clean-context subagents on the least capable model tier
   available; trigger prompts never name the skill. Record pass or fail per
   scenario in the pull request's Verification section; record the
   degradation when no subagent is available and the prompts ran in a fresh
   session instead.
8. **Verify in clients.** `just clients-validate`, then load the entry by
   hand in at least one client (`claude --plugin-dir .`, the Codex
   marketplace, `agy plugin install .` then
   `agy plugin uninstall harness-md`). Record anything that contradicts the
   matrix, in the matrix's verification log.
9. **Finish.** Update the skill tables of `README.md` and `README.zh.md`
   and the plugin pages of the site in both languages;
   `openspec-apply-change` tracks tasks; archive per `spec-workflow.md`; the
   pull request follows the `github-project-workflow` skill.

## Removing or renaming an entry

Delete the implementation and the spec in one change (a delta spec with
`## REMOVED Requirements`; a rename is a removal plus an addition), remove
or rename the README rows and the site's mentions, run `just gen` and
`just check`. Removing a layer builder leaves a layer without an owner,
which `just skills-check` rejects: a layer goes only through a format
change.

## Gotchas

- `claude plugin validate` fails on an unknown top-level key in
  `.claude-plugin/plugin.json`; that file is generated, so fix
  `scripts/gen.ts`.
- A skill name must not also exist under `.agents/skills/`; Codex and
  Antigravity load both directories here.
- A shared block edited in one skill fails `just skills-check` until the
  canon and every other user change too. A new block is added to the canon
  first and must be used by at least one skill.
- A reference or asset nothing in `SKILL.md` points to fails the check;
  every pointer states when to read the file.
- OpenSpec strict validation fails a requirement whose text exceeds 500
  characters; move cases into scenarios.
