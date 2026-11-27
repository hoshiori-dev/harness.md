# Authority Policy Decisions

Read when running step 2 (decide mode) or auditing without an anchor document:
this file holds the layer's thickness table and its eleven policy decisions.

## Thickness

What this layer is at each thickness:

| Thickness | What exists |
|---|---|
| omitted | Nothing; agents act under each client's own defaults |
| light | The core sentences in the entrypoint's always-on rules (step 4, item 4), nothing else |
| medium | Light, plus the policy file with the checkpoint and commit rules; on a hosted remote also the platform knowledge file, label file, forms, request template, project skill, and a settings register whose protections are conventions with named owners |
| thick | Medium, plus what a machine refuses: client permission files, checkpoint recipes that refuse, and on a hosted remote the merge-method setting, default-branch protection, the required check, and the label sync job |

Thicker: a wrong change or publication is costly; agents run unattended;
the repository is public; several agents write at once;
outsiders open requests from forks;
the project is maintained for years or others rely on its conventions.
Thinner: a throwaway or short-lived project;
a human present at every step; no remote;
no client in use with a permission file this skill generates;
a plan or tier that cannot enforce branch rules.
Recommend one, with the conditions that selected it:
**thick** for a repository that is kept and that agents commit to,
because the deny list and the refusing recipes hold
when the agent never read the policy;
**medium** where nothing in the project can enforce the rules;
**light** for a throwaway project;
**omitted** only when no agent can write to the repository or its remote.

## The eleven policy decisions

| Decision | Recommendation, and why | Other option, and what selects it |
|---|---|---|
| Action classes | Two classes by reversibility, with this project's commands as examples, so a reader can sort a new action | Also name every irreversible action when a wrong change is costly or agents run unattended |
| Standing pre-authorisation | The outward actions agents take on every task; all others are named per task or queued | None on a public repository or where publication is costly |
| Refusals | Move the work or queue a pending decision; never retry by another route; a failed check is a defect, not a refusal | — |
| Permission lists | Allow observed test, lint, build, format, and read-only commands, one entry per recipe; deny the fixed list of unrecoverable actions, stated entry by entry; no ask entries, which train rubber-stamping. Files for Claude Code and Codex; other clients by hand | Per-command approval, or no client files, as the user's recorded decision |
| Codex approval mode | `on-request`: asks only to leave the sandbox | `never` when agents run unattended |
| Written policy | A policy file with its core in the entrypoint: a readable policy turns a refusal into a decision. Agents never edit it, the permission files, or security hooks | Entrypoint sentences and permission entries only, for a throwaway project |
| Checkpoints | Commits, never stashes; one task, one commit; drafts squashed per task; `checkpoint`, `squash-task`, `rollback`, `push-one` recipes, because a denied hard reset needs a safe rollback | — |
| Commit convention | The one history shows; else Conventional Commits, whose type makes squash messages mechanical | Plain 50/72 titles |
| Attribution | None in commits or requests; client settings that add it are turned off | The exact trailer a project that requires disclosure names |
| Concurrency | One agent at a time | Parallel on evidence: branch ownership, one coordinator for platform writes, each write pre-authorised |
| Step-by-step approval | Not in use | During bootstrap or specification with the user present, or where per-line accountability is required; state what ends it |
