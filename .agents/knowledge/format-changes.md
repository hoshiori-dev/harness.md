# Format Changes

Read before changing the `HARNESS.md` format, the prose specification,
or a validator.

The format lives in three forms that must say the same thing.
Only the prose is shown to outside readers;
the OpenSpec specs are where a change is proposed and approved.

| Form | Path | Role |
|---|---|---|
| Structured specs | `openspec/specs/format/document/spec.md`, `openspec/specs/format/frontmatter/spec.md`, `openspec/specs/format/sections/spec.md`; the validator's findings in `openspec/specs/cli/lint/spec.md` | where a change starts; reviewed at `spec:approved` |
| Prose specification | `spec/spec.md` (authoritative), `spec/spec.zh.md` (mirror) | the only source outside readers are pointed to; written from the structured specs |
| Executable | `scripts/lib/harness_md.ts` (this repository's checks), `skills/harness-md/scripts/lint_harness_md.py` (shipped to users), each with its own unit tests | what a validator actually reports |

Nothing checks the structured specs against the prose mechanically;
the reviewer does. The two validators implement the same specification
and no check compares one with the other:
each has unit tests with a case for every finding code of `cli/lint`,
and review keeps them equal.

## What counts as a format change

Anything that alters what a conforming document is
or what a validator reports:
the layout of the directory and its main file `SKILL.md`, a key,
the type marker (the `[HARNESS.md]` prefix of `description`
and `metadata.type`), a rule on `name` or a length limit,
a rule taken over from the Agent Skills specification,
a recommended section, the order, a heading or title rule,
the rules on links and files inside the directory,
a finding or its severity.
It needs an OpenSpec change (`.agents/knowledge/spec-workflow.md`).
A reworded sentence of the prose that changes no rule is spec-less,
but still updates the mirror and the skill's copy in the same change.

## One change edits all of these

1. The delta specs under `openspec/specs/format/`
   (and `cli/lint` when a finding changes), in the OpenSpec change.
   The proposal states whether existing conforming documents stay conforming.
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
   in its "Version:" line;
   a document's own `metadata.version` is a free string.
6. The unit tests of both validators (`scripts/lib/harness_md_test.ts`,
   `skills/harness-md/scripts/lint_harness_md_test.py`):
   one case per new or changed rule, built in a temporary directory.
   Each suite has a test that fails when a finding code of `cli/lint`
   has no case. A case holds placeholder text, never a worked design.
   An expectation changes only because the rule changed,
   never to make an implementation pass.
7. Every `hub/` entry and `.agents/knowledge/project-harness/`,
   when the change makes them non-conforming.
8. The layer list in `scripts/lib/layers.ts`
   and `.agents/knowledge/plugin-architecture.md` when a layer section is added,
   renamed, or removed; that is also a skill catalog change.

## Verify

`just test` (the unit tests of both validators),
`just skills-check` (the specification copy),
`just harness-md-lint` (`.agents/knowledge/project-harness` and the hub),
`just hub-check`,
`just harness-check` (the mirror's heading structure), then `just check`.

## Rules that bind every format change

- A `HARNESS.md` is an Agent Skill that also follows this specification:
  a directory named after its `name`, with `SKILL.md` as its main file.
  The specification defines that layout, the six frontmatter keys
  of Agent Skills (`name`, `description`, `license`, `compatibility`,
  `metadata`, `allowed-tools`), the type marker,
  and the rules for recognising headings. No body section is required.
  Its guidance on expressing a design and on assets adds no validation rule.
  No design values in frontmatter, and no filled-in example document.
- `spec/spec.md` writes out each Agent Skills rule the validators check,
  says that it comes from the Agent Skills specification, and links it.
  Both validators implement these rules themselves;
  neither calls the Agent Skills reference validator.
- The format prescribes no location for a document.
- A reader with no tool and no knowledge of the specification
  must still understand a conforming document;
  reject a key or value that needs a lookup.
- First-party tools read `metadata.type`
  and check that every `metadata` value is a string;
  they interpret nothing else in `metadata`.
  The hub check reads `tags` and `based-on`, because the hub defines them
  (`.agents/knowledge/hub.md`).
