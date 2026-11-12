# Format Changes

Read before changing the `HARNESS.md` format, the prose specification,
a validator, or a fixture.

The format lives in three forms that must say the same thing.
Only the prose is shown to outside readers;
the OpenSpec specs are where a change is proposed and approved.

| Form | Path | Role |
|---|---|---|
| Structured specs | `openspec/specs/format/document/spec.md`, `openspec/specs/format/frontmatter/spec.md`, `openspec/specs/format/sections/spec.md`; the validator's findings in `openspec/specs/cli/lint/spec.md` | where a change starts; reviewed at `spec:approved` |
| Prose specification | `spec/spec.md` (authoritative), `spec/spec.zh.md` (mirror) | the only source outside readers are pointed to; written from the structured specs |
| Executable | `scripts/lib/harness_md.ts` (this repository's checks), `skills/harness-md/scripts/lint_harness_md.py` (shipped to users), `spec/fixtures/` with `spec/fixtures/expected.json` | what a validator actually reports |

Nothing checks the structured specs against the prose mechanically;
the reviewer does. The two validators are kept equal by the fixtures.

## What counts as a format change

Anything that alters what a conforming file is or what a validator reports:
a key, a recommended section, the order, a heading or title rule,
a finding or its severity.
It needs an OpenSpec change (`.agents/knowledge/spec-workflow.md`).
A reworded sentence of the prose that changes no rule is spec-less,
but still updates the mirror and the skill's copy in the same change.

## One change edits all of these

1. The delta specs under `openspec/specs/format/`
   (and `cli/lint` when a finding changes), in the OpenSpec change.
   The proposal states whether existing conforming files stay conforming.
2. `spec/spec.md`, then `spec/spec.zh.md` section for section;
   prose for people, so draft and review it with the `human-writing` skill.
3. `skills/harness-md/references/specification.md`: copy `spec/spec.md` over it;
   the two are byte-identical.
4. `skills/harness-md/SKILL.md` (the key and section tables),
   `skills/harness-md/references/writing.md`,
   and `skills/harness-md/assets/HARNESS.skeleton.md`
   when a key or section changes;
   its spec under `openspec/specs/skill/harness-md/` when its behaviour changes.
5. Both validators, changed together:
   constants (`SECTIONS`, `KEYS`), rules, finding codes,
   and messages. The specification is versioned with Semantic Versioning
   in its "Version:" line; a file's own `version` key is a free string.
6. `spec/fixtures/`: one case per new or changed rule,
   with its codes in `spec/fixtures/expected.json`.
   A fixture is a skeleton with placeholder text, never a worked design.
   An expectation changes only because the rule changed,
   never to make an implementation pass.
7. Every `hub/` entry and the root `HARNESS.md`,
   when the change makes them non-conforming.
8. The layer list in `scripts/lib/layers.ts`
   and `.agents/knowledge/plugin-architecture.md` when a layer section is added,
   renamed, or removed; that is also a skill catalog change.

## Verify

`just fixtures-check` (both validators against the fixtures),
`just skills-check` (the specification copy),
`just harness-md-lint` (the root file and the hub), `just hub-check`,
`just harness-check` (the mirror's heading structure), then `just check`.

## Rules that bind every format change

- The specification defines the file's outer structure, five metadata keys,
  and the rules for recognising headings. No body section is required.
  Its guidance on expressing a design (section 6) adds no validation rule.
  No design values in frontmatter, and no filled-in example file.
- A reader with no tool and no knowledge of the specification
  must still understand a conforming file;
  reject a key or value that needs a lookup.
- First-party tools never read `metadata`.
  The hub check reads it because the hub defines `tags` and `based-on`
  (`.agents/knowledge/hub.md`).
