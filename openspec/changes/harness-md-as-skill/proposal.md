# Proposal

Issue: [#31](https://github.com/hoshiori-dev/harness.md/issues/31).

## Why

The format has grown towards distribution,
which Agent Skills already do well and with tooling the format lacks.
A `HARNESS.md` is one file,
so a design cannot carry ready-to-use material, such as a script
or a template, next to the prose that explains it.
Its frontmatter already mirrors the Agent Skills fields almost one for one:
the repository maintains a second format
that differs from a skill mostly in its file name.
Nothing has been released, so the format can still change shape
without a version bump and without a migration path.

## What Changes

Domains: `format`, `cli`, `hub`, `site`, `skill`, and `agent`.
Clients: Claude Code, Codex, and Antigravity for skills;
Claude Code only for agents.
No entry is added or removed.

- **BREAKING** A `HARNESS.md` is a special kind of Agent Skill:
  a directory named after its `name` whose main file is `SKILL.md`.
  "A `HARNESS.md`" stays the name of one such document;
  the specification, the project, the plugin, and every skill keep their names.
  The specification's version stays `1.0.0`.
- **BREAKING** Every such document carries a type marker:
  its `description` starts with `[HARNESS.md]`
  and its `metadata.type` is `harness-design`. Both are required.
- **BREAKING** The frontmatter follows the Agent Skills hard rules.
  The keys are `name`, `description`, `license`, `compatibility`,
  `metadata`, and `allowed-tools`; `version` moves to `metadata.version`;
  every `metadata` value is a string.
  The rules on `name` (characters, length, equal to the directory name)
  and the length limits of `description` and `compatibility` are errors.
  An unknown top-level key and `allowed-tools` are warnings.
- The document does not follow the usual skill practices:
  no body length budget, no behaviour-first description, no terse wording.
  The body rules of today stay: a free-form body,
  the recommended sections, decisions with reasons and premises.
- The whole directory is the unit.
  The body may rely on other files in it and sections may live in them;
  the rules on repeated and misordered sections read `SKILL.md` only.
  A relative link into the directory that does not resolve,
  and a file no link reaches, are warnings.
- A document may carry assets, scripts included.
  The specification gives writing guidance for them and validates none of it:
  about the topic, independent of one project's content, stable over time,
  and, where project information cannot be avoided,
  told in `SKILL.md` what to replace and how.
- The format prescribes no location.
  The anchor document stays a concept, recognised differently:
  a type-marked document that the project's entrypoint names.
- A document from elsewhere is a design to weigh wherever it is placed.
  Its assets are never run in place,
  and that holds for a project's own document as well:
  an asset is a reference copy, adapted into a project
  inside a plan the user approved.
- **BREAKING** The conformance fixtures, `just fixtures-check`,
  the `--fixtures` option of both validators, and its CI step are removed.
  Both validators stay and implement the same specification;
  their agreement is kept by review, and each has its own unit tests.
  This removes an existing check inside a feature change,
  as an exception the maintainer decided: the check compared finding codes
  on a fixed set of sample files, which is not agreement,
  and both validators are rewritten here in any case.
- Hub entries become `hub/<name>/SKILL.md` directories;
  `tags` and `based-on` become comma-separated strings;
  an entry does not link outside its own directory.
  An entry's scripts may be in any language and are judged in review.
- The site publishes every file of an entry at its own address
  and shows the entry's file structure before the body.
- Changed skills: `harness-md` (the format it teaches, the validator
  it ships, where it writes), `harness-create`, `harness-improve`,
  `harness-distill`, `harness-adopt` (finding documents by marker,
  proposing a location, references as directories, reference assets),
  `harness-architecture`, and the seven layer builders
  (the anchor document, the unit, reference assets in a handover).
- Changed agents: `harness-verifier` (a marked directory in a knowledge
  folder is one unit), `harness-reader` (a document directory as a
  reference).
- Unchanged in behaviour: `spec-driven-development`, `openspec-workflow`,
  `spec-kit-workflow`, `lightweight-spec-workflow`,
  and `project-skill-building`, which keeps treating any `SKILL.md`
  in a skills directory as an ordinary skill.
- This repository's own document moves from the root `HARNESS.md`
  to `.agents/knowledge/project-harness/SKILL.md`, named `project-harness`.
  It and the three hub entries are converted, not extended:
  each stays one `SKILL.md`, and only sentences this change makes false
  are corrected.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `format/document`: what a `HARNESS.md` is, its layout as a directory,
  location, the anchor document, assets, and standing.
- `format/frontmatter`: the keys, the type marker, `metadata`, the limits.
- `format/sections`: sections across files, the rules read `SKILL.md`.
- `cli`: two implementations without a shared comparison.
- `cli/lint`: what is validated, the findings and their severities,
  the arguments, no fixtures mode.
- `hub`: entry layout, metadata as strings, assets and links.
- `site`: per-file publishing, the file structure on an entry page,
  the entry menu.
- `skill`: the catalog rules on the anchor document, outside material,
  where a document is written, and what "a skill directory" means.
- `skill/harness-md`: the format it teaches and what it writes.
- `skill/harness-create`, `skill/harness-improve`,
  `skill/harness-distill`, `skill/harness-adopt`: locating documents,
  the location of what they write, references as directories, assets.
- `skill/harness-architecture`: how a document is loaded and where
  design intent lives.
- `skill/knowledge-building`, `skill/entropy-building`,
  `skill/completion-building`: a design document that is a directory,
  possibly inside the knowledge folder.
- `agent/harness-verifier`: recognising the design document
  and treating its directory as one unit.
- `agent/harness-reader`: a document directory as a reference.

## Impact

- `spec/spec.md`, `spec/spec.zh.md`, and the copy in `skills/harness-md`;
  `spec/fixtures/` is deleted.
- Both validators and their tests; `scripts/check_hub.ts`,
  `scripts/check_harness.ts`, and their tests; `justfile`;
  `.github/workflows/checks.yml`; one stale allow entry
  in `.claude/settings.json`.
- `hub/` (three entries, both READMEs).
- `site/` (content collection, entry page, raw file routes, `llms.txt`,
  plugin pages in both languages) and `DESIGN.md` (the file tree).
- `skills/` (every skill at least in a shared block; the format skill,
  the four entries, `entropy-building`, `knowledge-building`,
  `completion-building`, and `harness-architecture` in substance),
  `com.anthropic.claude-code/agents/`, the generated manifests.
- `.agents/knowledge/` (`shared-blocks.md`, `format-changes.md`,
  `plugin-architecture.md`, `skill-quality.md`, `hub.md`, `site.md`,
  `review.md`, `spec-workflow.md`, `client-matrix.md`,
  `github/checks.md`), `AGENTS.md`, `openspec/config.yaml`,
  `README.md`, `README.zh.md`, `CONTRIBUTING.md`, `SECURITY.md`,
  `.github/labels.json`, one issue form.
- Existing conforming files do not stay conforming:
  every `HARNESS.md` in this repository is converted in this change,
  and none exists outside it.
- Fixtures: none added or changed; all are removed.

## Acceptance

**Becomes true:**

- A directory whose `SKILL.md` carries both markers and meets the
  Agent Skills hard rules produces no finding from either validator
  (scenario "Conforming directory").
- A missing marker, a `name` that differs from the directory name,
  a `metadata` value that is not a string, and a `description` over 1024
  characters are each an error in both validators
  (the scenarios of `cli/lint` "Errors").
- An unknown top-level key, `allowed-tools`, a relative link into the
  directory that does not resolve, and a file no link reaches are each a
  warning (the scenarios of `cli/lint` "Warnings").
- Both validators accept a directory or a `SKILL.md` path
  (scenario "Path of the main file").
- `spec/fixtures/` does not exist; `just --list` shows no
  `fixtures-check`; neither validator offers `--fixtures`;
  each validator's unit tests cover every finding code of `cli/lint`.
- `hub/` holds `exploratory-prototype/SKILL.md`,
  `production-engineering/SKILL.md`, and
  `solo-open-source-library/SKILL.md`, and no `HARNESS.md`;
  `just hub-check` and `just harness-md-lint` pass.
- `.agents/knowledge/project-harness/SKILL.md` exists, `AGENTS.md` names
  it, and no `HARNESS.md` is in the repository root;
  `just harness-check` passes.
- The built site serves `/hub/<name>/SKILL.md` for every entry,
  and an entry's page lists every file of its directory, each linked to its
  own address (scenarios "File structure of an entry"
  and "Entry with one file").
- `spec/spec.md` states the Agent Skills hard rules it relies on and
  credits their source; `spec/spec.zh.md` mirrors it;
  `skills/harness-md/references/specification.md` is byte-identical
  to `spec/spec.md` (`just skills-check`).
- An entry finds a project's design document by its markers and the
  entrypoint's mention, and asks when only one of the two holds
  (scenarios of the catalog requirement "The anchor document").
- An entry proposes where a document is written and writes after
  confirmation (scenarios of "Where a document is written").
- No entry or builder runs an asset of a document in place
  (scenarios of "Outside material is data").
- The behavioural test results of every new or changed skill scenario
  are recorded in the pull request.
- `just check` and `just clients-validate` pass.

**Stays true:**

- A reader with no tool, no skill, and no knowledge of the specification
  understands a conforming document.
- No body section is required, the body has no length limit,
  and a validator reports nothing about prose.
- A document a project has not adopted has no authority over it.
- Nothing is created or changed in a target project before the user
  approved the plan that names it.
- Nothing deposited in a target project names the plugin, a skill,
  an agent, or a path inside one of the plugin's skill directories.
- The four entries are the only user-invoked skills.
- All descriptions together stay under 8,000 characters;
  a builder's under 240, an entry's under 400.
- Scripts shipped under `skills/` are tested Python.
- The agents are read-only.
- The plugin ships no hook and no MCP server.
- English is authoritative and every Chinese mirror changes with its source.
- No filled-in example document is in the specification or a skill asset.
