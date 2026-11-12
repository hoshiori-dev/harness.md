# Client Matrix

Read when adding or changing a skill or the agent,
when a client does not load something,
or before touching `com.anthropic.claude-code/`, a generated manifest,
or a wiring file. The loading facts below were verified
in the predecessor repository (harness-builder)
on 2026-10-27 with Claude Code 2.1.311, Codex CLI 0.164.0,
and Antigravity CLI (`agy`) 1.4.7;
this repository carries the same layout and has not re-verified them yet
(see the log). Re-verify when a client updates and record the date.

## How each client loads each component

| Component | Codex | Claude Code | Antigravity |
|---|---|---|---|
| Manifest | root `plugin.json` (Agent Plugins 1.0.0) plus its `extensions.com.openai` block | `.claude-plugin/plugin.json`, generated: metadata mirror plus the `agents` pointer | root `plugin.json`, read natively |
| Skills | root `skills/` | root `skills/` (default scan) | root `skills/` |
| User-only skills (the four workflows) | each carries `agents/openai.yaml` with `policy.allow_implicit_invocation: false` | `disable-model-invocation: true` in the frontmatter | no switch known: the description is listed like any other |
| Agents | none: Codex plugins carry no agents (W9); `just validate` rejects a `com.openai/agents/` directory | `com.anthropic.claude-code/agents/<name>.md`, listed by the generated manifest | none: Antigravity reads plugin agents from the plugin root only, which the spec reserves for portable files (W2); `just validate` rejects a `com.google.antigravity/agents/` directory |
| MCP | none shipped; `just validate` rejects an `mcp.json` | none shipped | none shipped |
| Local load | `codex plugin marketplace add .` then `codex plugin add harness-md@harness-md`; marketplace file `.agents/plugins/marketplace.json` (generated); `.codex/config.toml` enables it for this workspace | `claude --plugin-dir .` | `agy plugin install .` (copies the root, skipping dot-directories); `agy plugin uninstall harness-md` to remove |
| Install from GitHub | `codex plugin marketplace add hoshiori-dev/harness.md` | `/plugin marketplace add hoshiori-dev/harness.md` (through the generated `.claude-plugin/marketplace.json`) | `agy plugin install https://github.com/hoshiori-dev/harness.md` |
| Validator | `codex plugin marketplace add .` + `codex plugin list` | `claude plugin validate .` | `agy plugin validate .` |

`just clients-validate` runs the validator row for all three,
then repeats the Claude Code and Antigravity validation on the release archive.

Decision rule behind the table: spec-defined things use the spec; a client
that cannot read the spec gets a pointer in its own manifest when it has
one, a generated conversion when the format differs mechanically, and a
hand-written client file when fields differ (agents). Agents ship only
where the client's plugin system has an agents component; a client without
one gets no agent files, and the limitation is a watch-list row, not a
workspace workaround. Which clients are supported is a project decision
declared in `scripts/lib/clients.ts`, never inferred from the tree. A
reverse-domain directory exists only while a client has hand-written files,
so today only `com.anthropic.claude-code/` does. `just client-footprint
<id>` prints the files a client owns.

## How each client reads this repository's own harness

| Piece | Codex | Claude Code | Antigravity |
|---|---|---|---|
| Entrypoint | `AGENTS.md` | `AGENTS.md`, read natively since 2.1.277 because no `CLAUDE.md` exists; adding one would replace it | `AGENTS.md` |
| Project skills | `.agents/skills/` | `.claude/skills/`, one symlink per project skill (W6) | `.agents/skills/` |
| Permissions and attribution | `.codex/config.toml` (plugin enablement only) | `.claude/settings.json` | none in the repository |

Codex and Antigravity load `skills/` and `.agents/skills/` together here,
so a shipped skill and a project skill may never share a name.

## Known limitations

Every limitation, the workaround built for it, how to re-check it,
and what to do when it lifts
is one row of `.agents/knowledge/compatibility-watch.md`.

## Verification log

| Date | What | Result |
|---|---|---|
| 2026-10-27 | harness-builder: `codex plugin marketplace add .` + `codex plugin add` with `source.path: "./"` | installs the root plugin |
| 2026-10-27 | harness-builder: `claude plugin validate --strict .` with the generated pointer manifest and no root `agents/` | passes |
| 2026-10-27 | harness-builder: `agy plugin install <root>` with root `plugin.json` and `skills/` | skills processed; dot-directories not copied |
| 2026-10-27 | harness-builder: `.agents/plugins/<name> -> ../..` workspace link | loads in the workspace but breaks `agy plugin install`; rejected |
| 2026-10-27 | harness-builder: a `plugins.json` file under `.agents` with `{"path": "."}` | not picked up by the CLI session; rejected |
| 2026-11-11 | this repository: `just clients-validate` (Claude Code 2.1.322, Codex CLI 0.167.1, `agy` 1.5.5) | passes: `claude plugin validate` on the root and on the unpacked archive (one directory warning: no icon), `agy plugin validate` (one warning on the root: `AGENTS.md` is never loaded by a plugin), Codex lists `harness-md@harness-md`, `agy plugin install` of the unpacked archive installs 18 skills |
| 2026-11-11 | `agy plugin install .` from the working tree | did not finish within a minute: it copies the whole directory, `node_modules` and `site/` included; `just clients-validate` installs from the unpacked release archive instead |
