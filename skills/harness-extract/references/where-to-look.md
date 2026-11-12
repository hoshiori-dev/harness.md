# Where to Look

Read at the start of step 2 and walk every location. Paths are the common ones;
a project may use others, so also follow every pointer the entrypoint gives.
Record each location as found or absent:
an absence is a finding for the layer it belongs to.

## Locations by layer

| Layer | Look at |
| --- | --- |
| Environment | `.devcontainer/`, container and VM files (`Dockerfile`, `compose.yaml`, `Vagrantfile`), cloud workspace configuration; environment variables the task runner exports (`PAGER`, `CI`, prompts disabled); registered tools and MCP servers (`.mcp.json`, client settings); scripts wrapped for agents; which CLIs setup scripts install |
| Knowledge | root and subdirectory entrypoints (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`); knowledge directories (`.agents/knowledge/`, `docs/` files an entrypoint names, `ARCHITECTURE.md`); project skills (`.agents/skills/`, `.claude/skills/`, `.codex/skills/`); rule directories (`.claude/rules/`, `.cursor/rules/`) |
| Feedback | the task runner (`justfile`, `Makefile`, `package.json` scripts) for test, run, and watch commands; a scoped test command; dev-server and seed scripts; log and trace locations; browser or simulator drivers; fixtures |
| Gates | `.pre-commit-config.yaml` and other hook managers; CI workflows (`.github/workflows/`, `.gitlab-ci.yml`); formatter, linter, and type-checker configuration; secret-scan configuration; custom check scripts and their failure messages |
| Authority | client permission files (`.claude/settings.json`, `.codex/config.toml`, `.codex/rules/`); a written policy on what agents may do; `CODEOWNERS`; issue and request templates; label definitions; release configuration; the branch and commit conventions in `git log` and in CONTRIBUTING |
| Completion | a spec directory (`openspec/`, `.specify/`, `specs/`), per-change `SPEC.md` or `PLAN.md`, a definition of done in the entrypoint or a knowledge file, approval labels or review rules |
| Entropy | a harness self-check (a script or recipe that checks links, commands, budgets), a "keep in sync" section, a sync or clean-up skill, mirror checks for translated files, an existing `HARNESS.md` |

## Four facts per artifact

| Fact | Question | An empty answer usually means |
| --- | --- | --- |
| Found by | Which entrypoint line, route, or location makes an agent find it? | nothing reaches it |
| Loads when | Always, on a stated condition, by file location, by event, or by description match? | it never loads |
| Source of truth | Which file or tool must it agree with? | it restates code, or has drifted |
| Kept current by | Which check, sync rule, or routine? | it will drift next |

## The history

Read the last 50 commit titles and the branch names:

- the commit convention actually used, and whether an older one was abandoned;
- whether commits carry tool or AI attribution;
- the merge method visible in the history (merge commits, squashes, rebases);
- how releases are tagged.

History tells current practice from abandoned practice.
When a document states one convention and the history shows another,
record both.

## What the files cannot show

Write these as "not observable from the repository" unless the project
is the user's own and a read-only platform query or the user answers them:

- repository settings: branch protection, required checks, who may merge;
- how unattended agents are, and what triggers them,
  beyond what workflow files show;
- what a wrong change costs and how long the project will be maintained;
- which models the team allows.

## Contradictions to watch for

- an entrypoint that names a command the task runner does not define;
- a client-specific entrypoint that copies the shared one and has drifted;
- a rule in the entrypoint that a hook or CI contradicts;
- a permission file that allows what the written policy forbids;
- a specification that describes behaviour the code no longer has.

Each is recorded with both locations and goes into Open Questions.
