---
name: harness-md
description: >-
  The agent harness of the harness.md repository itself: a public,
  long-lived, single-maintainer repository that holds a format
  specification, a hub of reusable designs, a cross-client agent plugin of
  Markdown skills with Python scripts, TypeScript management code, and a
  static website. Suits a documentation-and-tooling repository where agents
  work task by task under review and outside contributors arrive with
  their own agents.
version: alpha
license: Apache-2.0
---

# The harness of harness.md

## Overview

This harness serves the maintainer of `hoshiori-dev/harness.md`, the coding
agents the maintainer works with (Claude Code, Codex, Antigravity), and
outside contributors whose agents arrive knowing nothing about the
repository.

It is meant to achieve three things. An agent can take an issue to a pull
request that is ready for review without help, because the rules it needs
are in the repository and the checks tell it when it is wrong. The four
products of the repository (the format specification, the hub, the plugin,
the website) cannot silently disagree with each other, because every pair
that must agree has a check or a named owner. And the maintainer reviews at
two points only, when a specification is approved and when a pull request
is merged, instead of on every command.

It does not police the quality of prose (a specification paragraph, a hub
entry's design, a page of the website): those are reviewed by a person. It
does not police visual taste on the website. It does not test whether a
skill behaves well in a real client: those tests are run by hand.

Always with a human: approving a specification, merging, tagging and
releasing, changing any setting on GitHub, and anything that touches
another repository (including deprecating `hoshiori-dev/harness-builder`,
the plugin this one replaces).

The repository's first implementation was written in one pass, before these
rules existed. The rules below apply to every change after it.

## Context

- **Cost of a wrong change: medium.** Nothing here runs in production and no
  user data is held. But the format specification, the validator, and the
  hub entries are copied into other people's projects, so a wrong rule or a
  bad default spreads and cannot be recalled; and a broken skill misleads
  every agent that loads it.
- **Horizon: long.** The format is at version `alpha` and is expected to
  evolve for years, with the hub growing entry by entry.
- **Who relies on the conventions:** one maintainer, plus outside
  contributors (mostly proposing hub entries and fixes) and their agents.
- **How unattended agents are:** checkpointed. An agent works a task through
  on its own and the maintainer reviews between tasks. No agent runs on a
  trigger without a person starting it.
- **Hosting:** GitHub, public repository `hoshiori-dev/harness.md`; the
  website is served by GitHub Pages from the same repository.
- **Clients and models:** Claude Code, Codex, and Antigravity. The weakest
  models expected to work here are the current Sonnet, Terra, and Flash
  tiers, so every rule is written to be followed by them.
- **Languages:** English is authoritative everywhere. Chinese documents are
  mirrors of the English ones.
- **Given tools:** the dev container in `.devcontainer/` (Node, pnpm, uv,
  just, pre-commit, betterleaks, OpenSpec, the GitHub CLI, and the three
  client CLIs). The plugin format is Agent Plugins 1.0.0.

## Invariants

1. **English first, mirrors in the same change.** `README.zh.md`,
   `spec/spec.zh.md`, `hub/README.zh.md`, and the Chinese pages of the site
   are updated in the change that edits their English source. Enforced by
   `just harness-check` for structure; a reviewer for meaning.
2. **The format changes in one place at a time.** A change to the format is
   an OpenSpec change that updates `openspec/specs/format/*` and, in the
   same change, the prose `spec/spec.md` and its mirror, both validator
   implementations, the fixtures, and the copy of the specification inside
   the format skill. Enforced by `just fixtures-check` and
   `just skills-check` for the mechanical parts; the reviewer for the
   prose.
3. **A shipped skill or agent changes only through an approved
   specification.** The change starts as an OpenSpec change and waits for
   the `spec:approved` label. Harness files, scripts, CI, documentation,
   hub entries, and the site are changed without one. Enforced by the pull
   request workflow and the maintainer.
4. **Generated files are never edited by hand:** `.claude-plugin/*` and
   `.agents/plugins/marketplace.json` (regenerate with `just gen`) and
   `.agents/skills/openspec-*/` (regenerate with
   `openspec init --tools agents --force`). Enforced by `just gen --check`.
5. **A check is never weakened to let a change through.** Not a hook, a
   workflow, a permission entry, a fixture expectation, or this file. A
   check that is wrong is changed in its own pull request, with the reason.
   Enforced by review.
6. **Nothing secret or private enters the repository, an issue, or a pull
   request.** The repository is public. Enforced by the secret scan before
   commits and in CI.
7. **No AI or tool attribution** in commits or pull requests. Enforced by
   `.claude/settings.json` and the commit rules.
8. **No filled-in example `HARNESS.md`** in the specification or in a skill
   asset; a skeleton holds headings and questions only. A worked example
   anchors every later design to itself. Enforced by review. (Hub entries
   are complete designs by nature and live only under `hub/`.)
9. **Text for people is written as text for people.** Specification prose,
   READMEs, hub READMEs, and site copy are drafted and reviewed with the
   `human-writing` skill; text for agents (skills, knowledge files, this
   file) follows `.agents/knowledge/skill-quality.md`. Enforced by review.

## Style

Management code is TypeScript run directly by Node (type stripping, so only
erasable syntax, `.ts` import extensions, `node:` built-ins). Each script
under `scripts/` is one check or one generator: it prints findings as
`path:line: message` lines that say what to fix, exits 0, 1, or 2 (clean,
findings, bad arguments), and has a `*_test.ts` beside it. Shared logic
lives in `scripts/lib/`. The only runtime dependency is `yaml`; adding one
needs a reason in the pull request.

Anything delivered to other machines (scripts inside `skills/`) is Python
with PEP 723 inline metadata, run with `uv`, standard library preferred,
with a `*_test.py` beside it. The validator exists twice on purpose: the
Python script users get and the TypeScript implementation this repository
runs. The shared fixtures in `spec/fixtures/` are what keeps the two equal.

Every command an agent or CI runs is a recipe in the `justfile`; nothing
documents a raw command when a recipe exists. Formatting and lint rules are
Biome's and Ruff's and live in their configuration.

A skill is a directory of Markdown written to
`.agents/knowledge/skill-quality.md`: self-contained, one coherent unit of
work, a `SKILL.md` under about 500 lines with detail in `references/`.

## File Structure

```text
HARNESS.md                     this design; opened only to check or change the harness
AGENTS.md                      the agent entrypoint (at most 120 lines)
README.md  README.zh.md        for people; Chinese mirrors English
spec/spec.md  spec/spec.zh.md  the format specification, prose; English is authoritative
spec/fixtures/                 validator conformance cases and expected.json
hub/<name>/HARNESS.md          hub entries; hub/README.md and its mirror hold the entry rules
plugin.json                    the portable plugin manifest (Agent Plugins 1.0.0)
skills/<name>/                 shipped skills: SKILL.md, references/, assets/, scripts/
com.anthropic.claude-code/     Claude Code's hand-written files: agents/*.md
.claude-plugin/                generated Claude Code manifest and marketplace
.agents/plugins/marketplace.json  generated Codex marketplace
.codex/config.toml  .claude/settings.json  client wiring and permission files
openspec/specs/<domain>/…      long-lived specs: format, cli, skill, agent, hub, site
openspec/changes/              changes in flight and the archive
scripts/  scripts/lib/         management code (TypeScript) and its tests
site/                          the website (Astro, Pagefind); its own package
.agents/knowledge/             knowledge files the entrypoint routes to
.agents/skills/                project skills; .claude/skills/ holds a symlink to each
.github/                       workflows, issue forms, pull request template, labels
.devcontainer/                 the development environment
justfile                       every documented command
```

`site/` reads `spec/` and `hub/` at build time and holds no copy of either.
`skills/harness-md/references/specification.md` is a byte-identical copy of
`spec/spec.md`, because a skill may not link outside its own directory.

## Environment

Agents run inside the dev container defined in `.devcontainer/`. The
container is the isolation: an agent sees the repository, the tools below,
and whatever credentials the person logged in with inside the container,
and nothing of the host's home directory. Work outside the container is
possible but unsupported; nothing here is tested there.

Tools the agent holds, beyond editing files and running commands:

| Tool | For | Reach |
|---|---|---|
| `just` | every documented command | the repository |
| `node`, `pnpm` | management scripts, the site | the repository; the npm registry on install |
| `uv` | Python scripts shipped in skills, Ruff, pytest | the repository; PyPI on first use |
| `openspec` | specs and changes | the repository |
| `pre-commit`, `betterleaks` | hooks and the secret scan | the repository |
| `gh` | issues, pull requests, labels | GitHub, with the token of whoever logged in; it can write, so what an agent may do with it is settled under Authority |
| `claude`, `codex`, `agy` | validating that the plugin loads in real clients (`just clients-validate`) | the local client installations; each may need the person's own login |

No MCP server is registered and the plugin ships none. No deployment
credential exists in the container: the website is deployed by a GitHub
Actions workflow, never from a session.

The control plane is `.claude/settings.json`, `.codex/config.toml`,
`.pre-commit-config.yaml`, `.betterleaks.toml`, `.github/workflows/`, the
`justfile`, and `scripts/check_*.ts`. An agent edits these only when the task is to change
them, never to get another change through; the files are not write-protected
by the environment, so this is kept by rule and by review.

The `justfile` exports the variables that keep commands non-interactive: no
pager, no git prompt, no OpenSpec telemetry or update check.

## Knowledge

`AGENTS.md` is the only entrypoint, at most 120 lines. Claude Code reads it
natively when no `CLAUDE.md` exists, so there is no `CLAUDE.md`. It holds
what every task needs and nothing else: the always-on rules (the invariants
above, compressed), a project map, a table of when to read which knowledge
file, the validation commands, the workflow in one paragraph, and the
keep-in-sync table. It names this file in one line, as the design to open
when the harness itself is checked or changed.

Knowledge files live in `.agents/knowledge/`, each opening with the
situation in which to read it:

| File | Read when |
|---|---|
| `plugin-architecture.md` | adding, removing, or re-scoping a skill or the agent; touching how workflows hand work to layer builders |
| `skill-quality.md` | writing or editing anything under `skills/` |
| `shared-blocks.md` | editing a `<!-- shared:… -->` block in a skill |
| `format-changes.md` | changing the format, the prose specification, a validator, or a fixture |
| `hub.md` | adding or reviewing a hub entry |
| `site.md` | editing `site/` or its workflow |
| `client-matrix.md`, `compatibility-watch.md` | a client does not load something; a client or OpenSpec was upgraded |
| `spec-workflow.md` | proposing, implementing, or archiving an OpenSpec change |
| `git-workflow.md`, `github-workflow.md`, `github/checks.md` | branching, committing, pushing; taking an issue, opening or finishing a pull request; a red check |
| `agent-authority.md`, `github/platform-settings.md` | before any push, comment, label, release, or remote setting; when an action was refused |
| `maintenance.md` | editing the entrypoint or a knowledge file; the periodic reclamation |

Project skills live in `.agents/skills/`: the generated `openspec-*`
skills, `github-project-workflow` (issue to merged pull request), and
`plugin-development` (adding or changing a shipped skill end to end). A
procedure becomes a project skill only when it has several ordered steps,
recurs, and has gone wrong when done from memory.

A new fact goes where it will stay true: in the code or a recipe when the
code can state it; in a knowledge file when an agent needs it for one kind
of task; in the entrypoint only when every task needs it. Nothing the code
already says is repeated in prose, because a copy goes stale.

## Feedback

An agent verifies its own work with recipes, in this order of cost:

| Recipe | Covers | Budget |
|---|---|---|
| the single recipe for what it touched (`just lint`, `just test`, `just skills-check`, `just harness-md-lint`, `just fixtures-check`, `just hub-check`, `just harness-check`, `just validate`, `just spec-check`) | one concern | seconds |
| `just check-fast` | everything that needs no network beyond the package caches | about a minute |
| `just check` | everything CI runs, including the site build and the secret scan | a few minutes |

Checks print nothing but a summary when they pass, and on failure one line
per finding that names the file, the line, and what to do. A check that
floods the context is a defect in the check.

To see the website, `just site-dev` serves it locally and `just site-build`
produces the static output that Pages will serve. To see the plugin as a
client sees it, `just clients-validate` loads it in the installed client
CLIs (local only; CI has no clients).

A skill's behaviour is tested by hand: the scenarios in its OpenSpec spec
are run through clean-context subagents on the weakest model tier
available, and the pull request records the results.

What an agent cannot verify here, and must say so instead of claiming:
how the website looks (unless it has a browser tool and used it), how a
skill behaves in a client's interactive session, and whether prose reads
well to a person.

## Gates

Before a commit (`pre-commit`, installed by the dev container's setup
script; target under ten seconds): whitespace, end-of-file, merge-conflict,
large-file, and syntax hooks; Biome; the TypeScript type check;
`just gen --check`; `just skills-check`; Ruff on `skills/**/*.py`; and
betterleaks on the staged files.

In CI: on a pull request the `checks` workflow runs the same recipes as
`just check`, split into jobs (lint, test, plugin, format, spec, site), and
one summary job, `checks / gate`, reports for all of them, so adding a job
never needs a change to the branch rule. Three more statuses sit beside the
gate: `secrets / scan`, a secret scan of the commits the push or pull
request adds; `checks / pr`, the pull request title; and
`checks / spec-archived`, which is withheld while an OpenSpec change in the
pull request is not archived, so that a change cannot merge half-finished.
These four are the required statuses on `main`. Pushes to other branches
run `just check-fast`. The site workflow builds and deploys the website
from `main`; a pull request builds it in `checks / site` without
deploying.

What the gates enforce, by concern:

- formatting, lint, and types of the management code (Biome, `tsc`), and of
  shipped Python (Ruff);
- unit tests of the scripts and of shipped Python;
- the two validators agree with the fixtures (`just fixtures-check`);
- the repository's own `HARNESS.md` and every hub entry conform
  (`just harness-md-lint`, `just hub-check`);
- skills meet the mechanical rules: names, description budgets, layer
  ownership, fixed builder steps, shared blocks, links, script hygiene, the
  specification copy (`just skills-check`);
- the plugin package and client wiring are consistent and every shipped
  entry has exactly one spec (`just validate`, `just gen --check`);
- the harness is true to the repository: links, recipes, budgets, symlinks,
  mirrors (`just harness-check`);
- specs are valid in strict mode (`just spec-check`);
- the site builds (`just site-check`, `just site-build`);
- no secret is committed (`just secrets` for the working tree, with
  git-ignored build output excluded in `.betterleaks.toml`; the commits
  themselves are scanned in CI).

Deliberately not gated: prose quality, the substance of a hub entry, visual
design, and skill behaviour in a client. They are judged in review.

## Authority

Every action is classified before it is taken.

- **Reversible and internal** (edit files, create a branch, run checks,
  commit locally): an agent does it without asking.
- **Irreversible or outward** (push, open or mark ready a pull request,
  comment, label, close, release, change a remote setting, delete anything
  a person wrote): an agent does it only when the plan or the issue
  pre-authorised that action; otherwise it is queued.
- **Never an agent's:** approving a pull request, adding `spec:approved`,
  merging, tagging, creating or editing a release, changing a remote
  setting, force-pushing, pushing to a branch another agent owns.

A plan or issue may pre-authorise, for its own branch: pushing, opening and
updating the draft pull request, marking it ready after the self-review,
and posting the ready-for-review comment. Nothing else.

When a decision is the maintainer's, the agent finishes everything that
does not depend on it and adds the item to a pending decisions list: what
is blocked and why, the options, the recommended option with its reason,
and which finished work each option would change. The list is presented
once, when nothing else can proceed or at the end. When a command, a hook,
or a permission refuses an action, the refusal is read as a decision (wrong
approach, a boundary reached, or a defect found) and is never routed around
with an equivalent command.

Permission files name what is known safe and what is known dangerous and
leave the rest to the client's default; they contain no "ask" entries,
because a prompt on every command exhausts the reviewer and protects
nothing. `.claude/settings.json` denies force pushes, pushes of all
branches or tags, hard resets, `git clean -f`, forced branch deletion, and
`rm -rf` of the repository root; allows the read-only and checking
recipes; and turns off commit and pull-request attribution.
`.codex/config.toml` only enables the plugin for the workspace: Codex keeps
its own sandbox and approval defaults, and the same rules reach it through
the entrypoint. The deny list guards against carelessness, not against an
attacker; the container and the token's scope are the real boundary.

Commits follow Conventional Commits with a lowercase imperative subject of
at most 50 characters, body lines of at most 72, and no AI or tool
attribution. Every verified task is one commit; draft commits are squashed
per task before a push and never reach the remote. A pull request's title
follows the same convention within 72 characters (`checks / pr` enforces
it), because it becomes the subject of the squash commit.

Work follows GitHub Flow: an issue, a branch created from it, a draft pull
request, review, squash merge into `main`. Squash is the only merge method.
`main` is protected by a ruleset that requires the four statuses named
under Gates and forbids direct pushes. Only the maintainer merges.

Releases are cut by the maintainer: a version bump in `plugin.json` on
`main`, then a `v*` tag, which triggers the release workflow.

Labels are `type:*`, `area:*` (`format`, `plugin`, `hub`, `site`,
`harness`), and `spec:*` (the state of a pull request's OpenSpec change);
they are defined in `.github/labels.json` and synchronised by a workflow.
Issue forms exist for bugs, features, tasks, and hub entries; there is one
pull request template. There are no project boards and no milestones: they
would repeat state the issues and pull requests already hold.

Remote settings (the ruleset, merge methods, Pages, secret scanning) are
recorded in `.agents/knowledge/github/platform-settings.md` and are applied
by the maintainer, or by an agent only after the exact change was shown and
approved for that one action, and then read back.

## Completion

The goal of a change is agreed before work starts. For a change to the
format, a shipped skill, the agent, the hub's entry rules, or the site's
behaviour, the carrier is an OpenSpec change in the pull request: proposal,
spec deltas, and design first. The maintainer approves by adding
`spec:approved` to the pull request; approval is always that recorded
label, never a sentence in a conversation. The task list is written and the
implementation starts only after it. Everything else (harness, scripts, CI,
documentation, a hub entry, site styling and copy) goes straight to a pull
request, with a plan in the issue or the conversation.

A task is done when `just check` passes, the change does what the spec's
scenarios say, the mirrors are updated, and the work is committed. A skill
change is done when its behavioural tests were also run and recorded. A
pull request is ready when the agent has re-read its own diff as a
reviewer would and found nothing to fix; it is mergeable when the OpenSpec
change, if any, has been archived on the branch after review.

An agent that cannot finish says what is done, what is not, and why, and
leaves the pending decisions list. It never reports a check as passing that
it did not run, and never calls unverified work verified.

## Entropy

`just harness-check` keeps the harness true to the repository: every path
and recipe the entrypoint and the knowledge files name exists, the
entrypoint is within its budget, each project skill has its symlink, the
READMEs list every shipped skill in both languages, and the specification's
mirror has the same structure as its source.

The entrypoint's keep-in-sync table names, for each thing that can change,
what must change with it: `plugin.json` or an agent file and the generated
files; a skill and its spec and both README tables; a shared block and
every skill using it; `spec/spec.md` and its mirror, the skill's copy, and
the format specs; a recipe or CI job and the validation table and the
checks knowledge file; a client's loading behaviour and the client matrix.

An agent that finds the harness contradicting the repository in the middle
of a task fixes it in the same change when the fix is small, and otherwise
opens an issue; it never only mentions it.

Every tenth merged pull request, or when the entrypoint passes its budget,
the maintainer or an agent runs the reclamation in
`.agents/knowledge/maintenance.md`: delete rules nothing triggered, merge
duplicates, remove workarounds whose cause is gone (the compatibility watch
lists them), and re-read this file against the harness. This file stays in
the repository as the anchor document. When it and an artifact disagree
about intent, the artifact is fixed or this file is changed first, in its
own pull request.

## Open Questions

- The `human-writing` skill is installed locally from an outside library
  and is not committed. Invariant 9 depends on it. Whether to vendor it, pin
  it, or only name it is undecided.
- The behavioural tests of the shipped skills have not been run; the first
  implementation was written before the process that requires them.
- Antigravity loads plugin agents only from the plugin root and Codex
  plugins carry no agents, so the verifier agent ships to Claude Code only.
  Revisit when either client changes.
- The website's visual direction was chosen without the maintainer's
  review.

## References

- The Agent Skills specification, for the frontmatter conventions and skill
  packaging: <https://agentskills.io/specification>
- Agent Plugins 1.0.0, for the plugin package: <https://agent-plugins.org/specification>
- `DESIGN.md` by Google Labs, for the role this file plays for a harness:
  <https://github.com/google-labs-code/design.md>
- `AGENTS.md`, for the entrypoint convention: <https://agents.md/>
- "Evaluating AGENTS.md" (arXiv 2602.11988), for keeping context files to
  what an agent cannot infer: <https://arxiv.org/abs/2602.11988>
- arXiv 2608.27443, for avoiding "ask" permission rules:
  <https://arxiv.org/abs/2608.27443>
- Thoughtworks Technology Radar, "Agent instruction bloat":
  <https://www.thoughtworks.com/radar/techniques/agent-instruction-bloat>
- Anthropic, "Claude Code sandboxing", for isolation over prompts:
  <https://www.anthropic.com/engineering/claude-code-sandboxing>
- `hoshiori-dev/harness-builder`, the predecessor plugin whose practice the
  skills here carry forward: <https://github.com/hoshiori-dev/harness-builder>
