# Compatibility Watch

Read at every reclamation run, after any client or OpenSpec upgrade, when a
client behaves differently from `.agents/knowledge/client-matrix.md`, and
before removing a workaround. This file is the one list of known
limitations, the workarounds built for them, and the condition under which
each workaround goes away. The matrix describes how things work today and
points here for why.

## Versions these facts were recorded against

| Component | Version installed 2026-11-11 | Limitation rows last verified | Re-check with |
|---|---|---|---|
| Agent Plugins specification | 1.0.0 (1.1.0 was a draft) | 2026-10-27 | `SPEC_VERSION` in `scripts/lib/plugin.ts`; `just schemas-update` then `git diff scripts/schemas/` |
| agentskills.io SKILL.md format | current page | 2026-10-27 | `SKILL_NAME_RE` and the 1024-character limit in `scripts/lib/plugin.ts` |
| Claude Code | 2.1.322 | 2026-10-27 on 2.1.311 | `claude --version` |
| Codex CLI | 0.167.1 | 2026-10-27 on 0.164.0 | `codex --version` |
| Antigravity CLI (`agy`) | 1.5.5 | 2026-10-27 on 1.4.7 | `agy changelog` (first line) |
| OpenSpec | 1.17.0 | 2026-11-11 | `openspec --version` |

`just versions` prints the installed versions for the log. The rows below
were verified in the predecessor repository (harness-builder) and carried
over; re-run each "Re-check how" at the first reclamation.

## Watch list

Each row is a limitation the harness carries today, with the workaround
built for it or, where the capability is simply not offered, the check that
keeps it from creeping back. When the resolving condition is true, apply
the disposition in one change, update the matrix, and delete the row. IDs
are kept from the predecessor, so numbers are not contiguous.

| ID | Limitation | Workaround in this repository | Re-check how | Resolved when | Then |
|---|---|---|---|---|---|
| W2 | Antigravity loads plugin agents only from the plugin root `agents/`, never from `com.google.antigravity/agents/`, so the verifier agent does not ship to Antigravity | none: the `antigravity` entry in `scripts/lib/clients.ts` has no `agents`, and the `agent-unsupported` rule in `scripts/check_plugin.ts` rejects that directory | `agy plugin validate .` on a scratch copy with `com.google.antigravity/agents/<n>.md` counts the agent; Antigravity plugin docs | the namespace agents are counted and load from an installed plugin | add `agents` to the registry entry, write the Antigravity version of each agent, mark it shipped in `openspec/specs/agent/spec.md` and the matrix, drop the item from `HARNESS.md` Open Questions |
| W4 | Antigravity has no workspace registration that survives installation | local testing installs the unpacked release archive globally with `agy plugin install <dir>` and removes it with `agy plugin uninstall` (`just clients-validate`) | create a `plugins.json` file under `.agents` in a scratch copy and start `agy` there | a documented workspace registration loads the root as a plugin without being copied on install | add it to the matrix and the `plugin-development` skill |
| W6 | Claude Code reads project skills from `.claude/skills/` only | one symlink per project skill, enforced by the `claude-skill-link` rule in `scripts/check_harness.ts` | Claude Code skills docs for `.agents/skills` | `.agents/skills/` is a documented project location | delete the symlinks and the rule, update the project map in `AGENTS.md` and the matrix |
| W7 | Claude Code does not read the Agent Plugins root manifest | generated `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` (`just gen`) | Claude Code plugin docs mention `agent-plugins.org`, or `claude plugin validate` accepts a root `plugin.json` alone | Claude Code loads the root manifest | stop generating the pointer manifest; keep `agents/` under the namespace |
| W9 | Codex plugins have no agents component | none: the `codex` entry in `scripts/lib/clients.ts` has no `agents`, and the `agent-unsupported` rule rejects a `com.openai/agents/` directory | Codex plugin docs for an `agents` component | plugins can bundle agent roles | add `agents` to the registry entry at the location Codex documents, write that version of each agent, update `openspec/specs/agent/spec.md` and the matrix |
| W10 | `com.anthropic.claude-code` is a self-chosen namespace | directory name and `scripts/lib/clients.ts` entry | Claude Code docs or the Agent Plugins compatible-clients list name an official namespace | an official value exists | rename the directory and the registry entry, regenerate |
| W11 | Agents, hooks, and commands are outside Agent Plugins 1.0.0 | per-client agent files under the namespace directory; vendored 1.0.0 schemas in `scripts/schemas/` | the specification's releases; `just schemas-update` | a release adds a component this plugin ships | bump `SPEC_VERSION` and the `$schema` values, run `just schemas-update`, move the component to its portable location through an OpenSpec change |
| W12 | `openspec update` rewrites skills for every detected tool and treats the `.claude/skills` symlinks as a Claude install | `openspec init --tools agents --force` only (`.agents/knowledge/maintenance.md`) | OpenSpec release notes | `openspec update` respects a single configured tool | allow `openspec update` in `.agents/knowledge/maintenance.md` and `.agents/knowledge/spec-workflow.md` |
| W13 | `betterleaks git --pre-commit --staged` failed in the dev container (git reports no repository to the subprocess) | the pre-commit hook scans staged files with `betterleaks dir` | run the git mode from the container | the git mode works | optional: switch the hook back; the file scan is also correct |
| W14 | A skill may not link outside its own directory, so the format skill cannot point at `spec/spec.md` | `skills/harness-md/references/specification.md` is a byte-identical copy, enforced by `just skills-check` | the Agent Skills specification allows a plugin-level shared file | skills of one plugin can share a file | replace the copy with the shared file and drop the rule |
| W15 | Antigravity has no known way to keep a skill out of model invocation | the four workflow descriptions are written so they do not match ordinary requests | Antigravity skills docs for an invocation switch | a switch is documented | add it to the four workflows and to the matrix |

## Adding a row

Add a row whenever a check, generator branch, or document exists only
because a client or specification cannot do something yet, or whenever a
capability is deliberately withheld from a client for that reason. Name the
file that carries the workaround so the disposition can be executed without
rediscovery.
