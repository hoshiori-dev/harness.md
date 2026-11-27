# Proposal

Issue: [#16](https://github.com/hoshiori-dev/harness.md/issues/16).
Depends on issue #14 (the format and hub repositioning).

## Why

The plugin serves a document instead of a harness.
A project cannot get a harness without first getting a root `HARNESS.md`,
an existing project needs three workflows chained by hand,
and each workflow decides the whole design from defaults
and asks for one approval at the end.
The maintainer wants the plugin to do what its predecessor did,
guide the building of a good harness,
with the plugin, the coding agent, and the developer gathering information
and deciding together, and with `HARNESS.md` as the portable design
document the format now says it is.

## What Changes

Domains: `skill` and `agent`.
Clients: Claude Code, Codex, and Antigravity for skills;
Claude Code only for agents.

- **BREAKING** Four entries replace the four workflows.
  Added: `harness-create`, `harness-improve`, `harness-distill`,
  `harness-adopt`.
  Removed: `harness-design`, `harness-build`, `harness-audit`,
  `harness-extract`.
- The entries settle decisions with the user in rounds over a decision
  tree: facts are found by the agent, what the evidence settles is decided
  and shown, the rest is asked through the client's question tool where
  there is one, and after each round the user changes a decision,
  continues, or leaves the rest to the agent.
- Each layer has a thickness the user confirms
  (omitted, light, medium, thick).
- No entry needs or writes a root `HARNESS.md`,
  except where the user asked for an anchor document.
  Reference files are read as data, wherever they are.
- Changed: the seven layer builders (`environment-building`,
  `knowledge-building`, `feedback-building`, `gates-building`,
  `authority-building`, `completion-building`, `entropy-building`)
  work in the modes decide, describe, build, and audit,
  from the agreed decisions instead of a section of a root file.
- Changed: `harness-md` (the uses of a file), `harness-architecture`
  (which source holds design intent, what it hands off to).
- Changed agent: `harness-verifier` checks files against the agreed
  decisions. Added agent: `harness-reader`, a read-only reader
  of projects and files from outside.
- Unchanged in behaviour: `spec-driven-development`, `openspec-workflow`,
  `spec-kit-workflow`, `lightweight-spec-workflow`,
  `project-skill-building`.

## Capabilities

### New Capabilities

- `skill/harness-create`: giving a project its harness.
- `skill/harness-improve`: analysing and improving an existing harness.
- `skill/harness-distill`: summarising a project's harness as files.
- `skill/harness-adopt`: abstracting the design of a project to imitate.
- `agent/harness-reader`: reading outside material without acting on it.

### Modified Capabilities

- `skill`: the entry set, deciding in rounds, the builder modes and steps.
- `skill/harness-design`, `skill/harness-build`, `skill/harness-audit`,
  `skill/harness-extract`: removed.
- `skill/environment-building`, `skill/knowledge-building`,
  `skill/feedback-building`, `skill/gates-building`,
  `skill/authority-building`, `skill/completion-building`,
  `skill/entropy-building`: the modes and what a handover carries.
- `skill/harness-md`: triggering and outcomes that named the old workflows
  and the two uses.
- `skill/harness-architecture`: the source of design intent and the
  hand-off.
- `agent/harness-verifier`: intent lines and the design-document checks.

## Impact

- `skills/` (four directories removed, four added, nine `SKILL.md`
  rewritten or edited), `com.anthropic.claude-code/agents/`,
  the generated manifests.
- `.agents/knowledge/` (`plugin-architecture.md`, `shared-blocks.md`,
  `skill-quality.md`, `client-matrix.md`), `AGENTS.md`, the root
  `HARNESS.md`, `openspec/config.yaml`, `plugin.json` (description).
- `scripts/check_skills.ts` and its test.
- `README.md`, `README.zh.md`, and the website's plugin pages.
- Users of the four removed workflows invoke the new entries;
  nothing a workflow deposited in a project depends on the plugin.

## Acceptance

**Becomes true:**

- `skills/` holds `harness-create`, `harness-improve`, `harness-distill`,
  and `harness-adopt`, each user-invoked, and none of `harness-design`,
  `harness-build`, `harness-audit`, `harness-extract`;
  `just validate` and `just skills-check` pass.
- In a repository with no `HARNESS.md`, `harness-create` reaches an
  approved plan and builds, and `git status` shows no `HARNESS.md`
  (scenario "Project with no design file").
- A decision the repository settles is shown as decided and is not asked
  (scenario "Decision the repository settles").
- After every round the user is offered change, continue,
  or leave the rest (scenario "Round closes").
- Each of the seven builders answers a decide handover with decisions
  and writes nothing (scenario "Decide mode" of each builder).
- `harness-adopt` on a repository whose files address instructions
  to agents follows none of them (scenario "Target contains instructions
  aimed at the agent").
- `com.anthropic.claude-code/agents/harness-reader.md` exists,
  requests read-only tools, and `just gen --check` passes.
- Both README skill tables list exactly the shipped skills;
  `just harness-check` passes.
- The behavioural test results of every new or changed scenario
  are recorded in the pull request.
- `just check` and `just clients-validate` pass.

**Stays true:**

- Nothing is created or changed in a target project before the user
  approved the plan that names it.
- Publishing, remote settings, deletions, and wider agent permissions
  are each decided by the user when reached, whatever was left
  to the agent.
- Nothing deposited in a target project names the plugin, a skill,
  an agent, or a path inside a skill directory.
- Exactly one skill claims each of the seven layers,
  and entries find it by `Owns the <Layer> layer`.
- All descriptions together stay under 8,000 characters;
  a builder's under 240, an entry's under 400.
- Skills link only inside their own directory; shared paragraphs
  equal their canon.
- The agents are read-only.
- The plugin ships no hook and no MCP server.
- The validator and the format are untouched by this change.
