# Specification Workflow

Read before proposing, implementing, or archiving an OpenSpec change,
and when unsure whether a change needs one.

Level: spec-anchored.
The specs under `openspec/specs/`
are the living description of what the repository ships;
the format prose, the validators, the skills, the agent, the hub rules,
and the site implement them. Tool: OpenSpec 1.17.0 (`openspec` CLI,
`spec-driven` schema), initialised
on 2026-11-11 with `openspec init --tools agents`.

## Artifact map

| Artifact | Path | Owns |
|---|---|---|
| Format specs | `openspec/specs/format/document/spec.md`, `openspec/specs/format/frontmatter/spec.md`, `openspec/specs/format/sections/spec.md` | the structured statement of the `HARNESS.md` format |
| Validator specs | `openspec/specs/cli/spec.md` (rules for every tool), `openspec/specs/cli/lint/spec.md` | what the validator reports; its conformance cases are `spec/fixtures/` |
| Catalog rules | `openspec/specs/skill/spec.md`, `openspec/specs/agent/spec.md` | rules every shipped skill or agent follows |
| Entry spec | `openspec/specs/<catalog>/<name>/spec.md` for `skill` and `agent` | observable behaviour of one shipped entry, the clients it ships to, and its behavioural test cases (scenarios) |
| Hub rules | `openspec/specs/hub/spec.md` | what a hub entry must satisfy |
| Site spec | `openspec/specs/site/spec.md` | the website's behaviour |
| Change | `openspec/changes/<id>/` (`proposal.md`, `design.md`, `tasks.md`, `specs/` deltas, `.openspec.yaml`) | one proposed change until archived |
| Archive | `openspec/changes/archive/<date>-<id>/` | the record of a merged change |
| Project rules for artifacts | `openspec/config.yaml` | context and per-artifact rules the OpenSpec skills apply |

Source of truth per fact: behaviour → the spec;
the format as outside readers see it → `spec/spec.md`,
written from the three format specs; package metadata → `plugin.json`;
conventions → this knowledge base; the harness design → `HARNESS.md`.
Nothing restates a spec; `AGENTS.md` and the skills point to it.

## Scope

| Change touches | Carrier |
|---|---|
| the format, the prose specification's meaning, a validator finding, a fixture expectation | OpenSpec change with delta specs under `format/` or `cli/` (`.agents/knowledge/format-changes.md`) |
| a shipped skill or the agent | OpenSpec change with a delta spec under `skill/<name>` or `agent/<name>`; `just validate` enforces one spec per entry and one entry per spec |
| the hub's entry rules, the site's behaviour | OpenSpec change with a delta under `hub/` or `site/` |
| harness, scripts, CI, documentation, a hub entry, site styling or copy, generated files, a reworded sentence that changes no rule | spec-less: straight to a pull request, labelled `spec:skipped` by the `pr-labels` workflow |

The harness is machine-checked (`just harness-check`, `just skills-check`)
instead of specified; a spec for it would be a second copy.
A large spec-less change that deserves a recorded design opens a change
with `skip_specs: true` in `.openspec.yaml` and ships proposal, design,
and tasks; it is archived before merge like any other.
Specs describe behaviour the change touches; nothing is back-filled.

## Artifact roles

| Artifact | Owns | Never holds |
|---|---|---|
| proposal | the end state: why, what changes, which entries, and `## Acceptance` with **Becomes true** and **Stays true** lists | the contract itself, the approach, steps |
| delta specs | the contract: requirements (each under 500 characters, or strict validation fails) with scenarios a reader judges without opening the implementation | implementation choices |
| design | how the end state is reached: Goals / Non-Goals each with how it is checked, decisions with rejected alternatives | the goal, acceptance, steps, secrets |
| tasks | implementation steps, each with its own verification; written only after gate 1 | acceptance; anything gate 1 must see |

An invariant that holds under any approach goes in the proposal's "Stays true";
one that holds only because of the chosen approach goes in the design.

## Lifecycle and gates

1. **Propose**: `openspec-propose` (or `openspec-explore` first);
   commit the change directory on the issue branch;
   open a draft pull request that carries it (one pull request holds change,
   implementation, and archive).
2. **Gate 1, proposal approval**: the maintainer reads proposal, design,
   and delta specs on the pull request and adds `spec:approved`.
   Approval is always that recorded label, never a sentence in a conversation.
   The `pr-labels` workflow records it (commit, account,
   hash of every file under the unarchived changes)
   and keeps the label only while that package is unchanged;
   an edit puts `spec:pending` back. Tasks are written only after the label.
3. **Implement**: `openspec-apply-change`, one task at a time,
   `just check` green between tasks;
   `just gen` after any change to `plugin.json` or an agents directory.
4. **Gate 2, implementation acceptance**:
   for a skill change the agent runs the behavioural tests the delta specs
   define (`.agents/knowledge/skill-quality.md`)
   and records the results in the pull request;
   it self-reviews and marks the pull request ready
   (`.agents/knowledge/agent-authority.md`); the maintainer reviews.
5. **Freeze**: after the review,
   the implementer archives on the branch with `openspec-archive-change`;
   the archive commit is the frozen record and a commit
   after it reopens the deliberation.
   The required archive check
   is reported only when no unarchived change remains,
   so the merge is blocked until then (`just spec-archived` names what is open).

State labels, maintained by `pr-labels` from the tree and never by hand:
`spec:skipped`, `spec:pending`,
`spec:approved` (added by a person with write permission, recorded,
package unchanged), `spec:archived`.
`just pr-labels <n>` prints the decision without writing.

## Validation

`just spec-check` (`openspec validate --all --strict`) proves structure.
Behaviour is proven by the scenarios:
a skill's trigger scenarios run as prompts to clean-context subagents
that do not name the skill,
outcome scenarios as tasks judged against the stated result,
both on the least capable model tier the session offers.
They run by hand before gate 2 and are not CI jobs:
CI has no agent credentials and the runs are costly.
When no subagent is available,
say so in the pull request and run the prompts in a fresh session instead.
The validator's scenarios are proven by `just fixtures-check`.

## First implementation (2026-11-11)

Every spec under `openspec/specs/` was written directly as the initial state,
with no change directory and no recorded approval,
in a session the maintainer ran with the agent before the workflows existed.
The shipped skills' behavioural tests were not run at that point;
one round ran on 2026-11-12, before the first merge,
and its results are recorded in pull request #1.
Every later change follows the lifecycle above.

## Update triggers

- New skill or agent catalog → add `openspec/specs/<catalog>/spec.md`,
  extend the catalog list in `scripts/check_plugin.ts`,
  the context in `openspec/config.yaml`, and this map.
- OpenSpec release adopted → `openspec init --tools agents --force`
  (never `openspec update`), `just harness-check`,
  update the version above and in `.agents/knowledge/compatibility-watch.md`.
