# harness.md

Home of the `HARNESS.md` format (one file that records a project's agent
harness design), the official hub of ready-to-use designs, the website, and
`harness-md`, an Agent Plugins v1.0.0 plugin that designs, builds, extracts,
and audits harnesses around that file. The repository root is the plugin.
This repository's own design is `HARNESS.md`: open it only when the harness
itself is checked or changed, never for an ordinary task.

## Always

- English is authoritative. A Chinese mirror (`README.zh.md`,
  `spec/spec.zh.md`, `hub/README.zh.md`, the site's `/zh/` pages) changes in
  the same change as its English source. Talk to the user in their language.
- A change to the format, a shipped skill, the agent, the hub's entry rules,
  or the site's behaviour starts as an OpenSpec change and waits for the
  `spec:approved` label; harness, scripts, CI, docs, a hub entry, and site
  styling or copy go straight to a pull request.
- Never hand-edit generated files: `.claude-plugin/*`,
  `.agents/plugins/marketplace.json` (`just gen`), and
  `.agents/skills/openspec-*/` (`openspec init --tools agents --force`).
- Never weaken a check, hook, workflow, permission, or fixture expectation
  to make a change pass; propose that change in its own pull request.
- Commits: Conventional Commits, lowercase imperative subject of at most 50
  characters, no AI or tool attribution. One commit per verified task;
  drafts are squashed before a push and never reach the remote.
- Irreversible or outward actions (push, ready, comment, label, release,
  remote settings) happen only when the plan or issue pre-authorised them;
  otherwise queue them as pending decisions and finish the rest.
- Nothing secret or private enters the repository, an issue, or a pull
  request; everything here is public.
- Prose for people (specification, READMEs, site copy) is drafted and
  reviewed with the `human-writing` skill; text for agents follows
  `.agents/knowledge/skill-quality.md`.
- Break Markdown lines at punctuation, never inside a word or by width alone.
- No filled-in example `HARNESS.md` in the specification or a skill asset.
- Report only what you ran: never call a check passed, a page good-looking,
  or a skill working in a client without having verified it.

## Project Map

```text
spec/spec.md  spec/spec.zh.md  <- the format, prose; spec/fixtures/ = validator cases
hub/<name>/HARNESS.md          <- hub entries; hub/README.md holds the entry rules
plugin.json  skills/<name>/    <- the plugin and its skills (scripts: Python + uv)
com.anthropic.claude-code/     <- Claude Code's hand-written agent files
.claude-plugin/  .agents/plugins/  <- generated client manifests
openspec/specs/<domain>/       <- long-lived specs: format, cli, skill, agent, hub, site
scripts/  scripts/lib/         <- management code (TypeScript on Node) and tests
site/  DESIGN.md               <- the website (Astro, Pagefind; own pnpm package) and its visual design
.agents/knowledge/  .agents/skills/  <- knowledge files; project skills (.claude/skills links)
```

## When To Read What

| Situation | Read |
|---|---|
| Adding, changing, or removing a shipped skill or the agent | the `plugin-development` skill, then `.agents/knowledge/plugin-architecture.md` |
| Writing or editing any file under `skills/`; a skill misbehaves | `.agents/knowledge/skill-quality.md` |
| Editing a `<!-- shared:… -->` block in a skill | `.agents/knowledge/shared-blocks.md` |
| Changing the format, the prose specification, a validator, or a fixture | `.agents/knowledge/format-changes.md` |
| Adding or reviewing a hub entry | `.agents/knowledge/hub.md` |
| Editing `site/` or its workflow | `.agents/knowledge/site.md`; `DESIGN.md` before anything visual |
| A client does not load something; touching a wiring or generated file | `.agents/knowledge/client-matrix.md` |
| A client or OpenSpec was upgraded; removing a workaround | `.agents/knowledge/compatibility-watch.md` |
| Proposing, implementing, or archiving an OpenSpec change | `.agents/knowledge/spec-workflow.md`, then the `openspec-*` skills |
| Taking an issue, opening or finishing a pull request, any `gh` write | the `github-project-workflow` skill, `.agents/knowledge/github-workflow.md` |
| A check is red; adding or renaming a recipe or CI job | `.agents/knowledge/github/checks.md` |
| Branching, committing, squashing, pushing, tags | `.agents/knowledge/git-workflow.md` |
| Before any push, comment, label, release; an action was refused | `.agents/knowledge/agent-authority.md` |
| Before reading or changing a remote setting | `.agents/knowledge/github/platform-settings.md` |
| Editing this file, a knowledge file, or a check; adding a client; every tenth merged pull request | `.agents/knowledge/maintenance.md` |

## Development Environment

Work in the dev container (`.devcontainer/`): node, pnpm, uv, just,
pre-commit, betterleaks, openspec, `gh`, and the client CLIs, which use the
person's own login. Never store a credential in the repository.

## Validation

| Check | Command |
|---|---|
| Everything CI runs | `just check` |
| The fast subset (no openspec, site build, or secret scan) | `just check-fast` |
| Format, lint, types; unit tests | `just lint`; `just test` |
| Generated client files are current | `just gen --check` (regenerate: `just gen`) |
| Plugin layout, wiring, one spec per shipped entry | `just validate` |
| Skill rules: budgets, layers, steps, shared blocks, links, spec copy | `just skills-check` |
| Harness links, recipes, budget, symlinks, mirrors | `just harness-check` |
| `HARNESS.md` and hub entries conform; hub entry rules | `just harness-md-lint`; `just hub-check` |
| Both validators agree with `spec/fixtures/` | `just fixtures-check` |
| Specs strict; no unarchived change (merge gate) | `just spec-check`; `just spec-archived` |
| Site checks and static build | `just site-check`; `just site-build` |
| Plugin loads in the real clients (local only) | `just clients-validate` |

## Workflow

Issue → `gh issue develop` branch → draft pull request (carrying the
OpenSpec change when one is needed) → maintainer adds `spec:approved` →
task commits with `just check` green → behavioural tests for a skill change
→ self-review, ready → maintainer reviews → archive on the branch →
maintainer squash-merges → version bump and `v*` tag release.

## Keep In Sync

<!-- harness: keep-in-sync -->
| When this changes | Update |
|---|---|
| `plugin.json` or an agent file | `just gen`; commit the generated files |
| A skill or the agent is added, renamed, or removed | its spec under `openspec/specs/`, both README skill tables, the site's plugin pages, `just gen` |
| A shared block's canon | every skill using that id, same change |
| `spec/spec.md` | `spec/spec.zh.md`, `skills/harness-md/references/specification.md`, the format specs |
| A validator rule | the other validator, `spec/fixtures/`, `openspec/specs/cli/lint/spec.md` |
| A `justfile` recipe or CI job | the Validation table above, `.agents/knowledge/github/checks.md` |
| `README.md`, `hub/README.md` | their `.zh.md` mirrors, same change |
| The site's colours, type, spacing, or components | `DESIGN.md`, same change |
| A client's loading behaviour | `.agents/knowledge/client-matrix.md` and the watch list |
| Harness intent (a rule here, a check, a permission) | `HARNESS.md` first, same pull request |
