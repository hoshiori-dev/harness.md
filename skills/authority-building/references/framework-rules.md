# Framework Rules

Read when writing the permission entries of a section,
when writing or auditing a client permission file,
when a user asks for an ask entry or for per-command approval,
or when a client has no generated format.

## Principle

Explicitly allow what is known safe;
explicitly deny what is known unrecoverable;
leave the rest to the client's default,
with the sandbox making a wrong default survivable.
Outward actions are governed by pre-authorisation, never by an allow entry.

No ask entries. Rules that ask train rubber-stamping:
a study of user-written permission rules found
that rules resolving to "ask" gave worse protection than allow and deny rules
(arXiv 2608.27443), and Anthropic reported
that sandboxing cut permission prompts by 84%,
which is where prompt fatigue is actually removed.
On a client whose default is to ask,
the remedy for a recurring prompt is a wider allow list.

The deny list guards against a careless collaborator's mistakes (a hard reset,
a force push, a bulk delete), not an attacker:
an agent that runs code can spell around any text pattern.
The sandbox and scoped tokens are the boundary,
and they belong to the Environment section.

## Fixed deny list

Present it for acceptance as one block;
the section states it entry by entry so it can be built without this file:

| Intent | Why |
|---|---|
| `git reset --hard` | discards uncommitted work; the rollback recipe commits first |
| `git push --force`, `--force-with-lease`, `-f` | rewrites pushed history |
| `git push --all`, `--mirror`, `--tags` | bulk publication of drafts and local tags |
| `git clean -fd` and variants | deletes untracked work |
| `git branch -D` | deletes unmerged work |
| `rm -rf` at the repository root (`rm -rf .`, `rm -rf ./`, `rm -rf /`, `rm -rf ~`) | unrecoverable; `rm -rf *` cannot be denied on Claude Code, where `*` is the wildcard |
| edits to the authority policy, the permission files, and the security hooks | self-protection: loosening a rule is outside agent authority |

An Invariant about what an agent may never do adds its own entry
when a command pattern or a path can express it.

## Allow list

Only from evidence: task-runner recipes, test, lint, build, format,
and read-only inspection commands observed in the repository,
each with its file and line. In the section,
either list the entries or state the rule that derives them
("every recipe of the task runner except those that push, publish, or release,
one entry per recipe").

- One entry per recipe (`Bash(just test *)`, `["just", "test"]`),
  never a runner wildcard (`Bash(just *)`, `["just"]`):
  the wildcard also allows every recipe that pushes, publishes, or releases.
- The same holds for programs that run their arguments as a command (`npx`,
  `uv run`, `docker exec`, `devbox run`):
  allow the runner together with the inner command, never the runner alone.
- Never: push, publish, release, tracker comment, label or state change,
  deletion of others' work, whether as a raw command or wrapped in a recipe,
  however often history shows them.

## Ask entries and per-command approval

An ask entry the user kept after one challenge,
with a reason no allow or deny entry can serve,
goes into the client's ask mechanism (Claude Code:
an `ask` array beside `allow` and `deny`; Codex:
a `prompt` rule) and nowhere else, and the section records it with the reason.

Per-command approval kept as the user's decision:
Claude Code gets no `allow` array
(its default asks for every shell command
that is not read-only) with the deny list unchanged.
Codex has no value that asks for every command
(`untrusted` is no longer accepted);
write `prompt` rules for the command families the user names
and keep `approval_policy = "on-request"`.

## Claude Code: `.claude/settings.json`

- Strict JSON (no comments, no trailing commas).
  Key `permissions` with `allow` and `deny` arrays.
  Evaluation order is deny, then ask, then allow;
  the first match decides, and an allow never carves an exception out of a deny.
  Lists from every settings file merge, and a deny from any scope wins.
- Bash rules match the command text with `*` standing for any text.
  A rule without `*` matches that exact command only.
  A trailing ` *` (space before it,
  and the rule's only wildcard) also matches the bare command. Put the `*`
  after the subcommand: `Bash(git log *)`, never `Bash(git *)`.
- Compound commands are split on `&&`, `||`, `;`, `|`, `|&`, `&`, and newlines:
  every part must be allowed, and a deny matches any part,
  including one inside a subshell or a command substitution.
  The wrappers `timeout`, `time`, `nice`, `nohup`, `stdbuf`, `command`,
  `builtin`, and a bare `xargs` are stripped before matching.
- A rule does not match the same program invoked another way (`git -C . push`,
  `/usr/bin/git push`, `bash -c 'git push'`).
  Add the spellings the repository's history shows and accept the rest.
- File rules are `Edit(path)` and `Read(path)`;
  `Write(path)` is accepted but matches nothing.
  In a project settings file write paths as `/path`,
  which anchors at the project root;
  `path` or `./path` is relative to the current directory, `//path` is absolute,
  `~/path` is the home directory.
- An MCP tool is `mcp__<server>__<tool>`;
  `mcp__<server>__*` is the whole server and is never allowed as a block.
- `settings.json` is the shared file to commit;
  its `allow` rules take effect only after each developer trusts the folder,
  while `deny` rules apply at once. `settings.local.json` is per developer,
  and "don't ask again" answers are saved there as allow rules.
- Attribution: `"attribution": {"commit": "", "pr": "", "sessionUrl": false}`
  removes the co-author trailer and the request footer.
  (`false` for the whole key needs v2.1.281 or later;
  `includeCoAuthoredBy` is deprecated.)

Rework `assets/claude-settings.jsonc` into strict JSON:
the asset is `.jsonc` only so its `# CONFIGURE:` lines can exist;
strip every comment when writing the target file.

## Codex: `.codex/config.toml` and `.codex/rules/*.rules`

- `config.toml` holds `approval_policy`:
  `on-request` for interactive work
  (a command asks only when it needs to leave the sandbox
  and no rule decides it), `never` for unattended runs.
  `untrusted` is no longer accepted and `on-failure` is deprecated.
  Write only `approval_policy` there:
  `sandbox_mode` and the `[sandbox_workspace_write]` table belong
  to the Environment section and are left as they are.
- Command rules are `prefix_rule(...)`
  calls in Starlark files under `.codex/rules/`.
  Both files load only once the user trusts the project,
  and rules are read at start, so Codex is restarted after a change.
- `pattern` is a non-empty list of argument prefixes,
  each position a literal or a list of alternatives;
  `decision` is `allow`, `prompt`, or `forbidden`,
  and the most restrictive matching rule wins;
  `justification` is shown on a refusal;
  `match` and `not_match` are examples Codex validates on load.
- A script that is a plain chain of commands joined by `&&`, `||`, `;`,
  or `|` is split and each part evaluated.
  A script with redirection, substitution, variables, wildcards,
  or control flow is evaluated as one `bash -lc` invocation,
  which no prefix rule here matches.
- Prefix matching means `["git", "push", "--force"]`
  does not match `git push origin --force`;
  add the orders the repository's history shows.
  Replace `origin` in the remote-first rule with the project's remote names,
  kept equal to the recipes' `remote`.
- Check a rule
  with
  `codex execpolicy check --pretty --rules .codex/rules/authority.rules -- git push --force origin main`
  .
- The configuration reference documents no attribution setting;
  the attribution rule reaches Codex through the entrypoint.

Rework `assets/codex-config.toml` and `assets/codex-authority.rules`.

## Other clients

For a client with no project-level permission file this skill generates
(Antigravity, Gemini CLI, and any other): write no file.
Keep the policy, and hand back the confirmed allow and deny entries
as a by-hand item, telling the user to check the client's current documentation
for where its permissions are configured.

## Existing files that contradict

Ask entries, an allowed push or force push, a runner wildcard,
an allow entry for a whole MCP server:
report each with its reason from this file, recommend the fix once,
and change the file only where the approved section says so.
A developer's `settings.local.json`
may hold entries the shared file deliberately lacks;
it is reported, never edited.
