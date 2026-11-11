# Harness Maintenance

Read before editing `AGENTS.md`, a knowledge file, a project skill, or a
check; when `AGENTS.md` passes 120 lines; when the harness contradicts the
repository; at the reclamation anchor; and before adding or dropping a
client, changing how strict a check is, or upgrading OpenSpec.

`HARNESS.md` is the design of this harness and stays in the repository as
its anchor document. Design intent comes from it, facts from the code. A
harness change that alters intent changes `HARNESS.md` first, in the same
pull request; a harness file that only caught up with the code does not.

## Realtime rule

Before editing a harness file, inspect the artifacts its `Keep In Sync` row
in `AGENTS.md` names and fix or report every mismatch found, not only the
one that prompted the edit. The checks (`just harness-check`,
`just skills-check`) catch broken links, unknown recipes, unreachable
knowledge, budget overruns, symlink drift, mirror structure, and
shared-block divergence; they cannot catch a stale sentence. Verify the
other direction too: after editing a rule, confirm the recipe, script, or
directory it describes behaves as written.

## Mismatch reports

An agent that finds the harness contradicting the repository fixes it in the
same change when the fix is small and certain, queues it as a pending
decision when the intent is unclear or the fix exceeds the task, or opens an
issue labelled `type:task` + `area:harness` when it is large and deferred.
Saying it in the conversation alone is not an outcome.

## Periodic reclamation

Anchor: every tenth merged pull request, or when `AGENTS.md` passes its
budget. Walk every harness component and hunt:

- stale paths and dead commands: run them, do not trust them;
- rules the code or a client now contradicts (re-run
  `just clients-validate` and `just versions`, update the verification log
  in `.agents/knowledge/client-matrix.md`);
- the same fact stated twice;
- content unreachable from `AGENTS.md`;
- **weight no longer earned**: a check that never fires, a shared block one
  skill uses, a knowledge file no task reads, a rule written for a problem
  long fixed. Thinning is as much reclamation as fixing;
- `HARNESS.md` against the harness, section by section: where they
  disagree about intent, fix the artifact or change `HARNESS.md` first.

Walk every row of `.agents/knowledge/compatibility-watch.md`: run its
"Re-check how" column, and when "Resolved when" holds, execute "Then" in one
change and delete the row.

Dispose of every finding in the same run: update, reconnect, merge, thin, or
delete. Record the run below.

### Runs

| Date | Merged PRs since last run | Findings and dispositions |
|---|---|---|
| 2026-11-11 | first implementation | none; baseline |

## Changing the harness itself

Each branch is a complete procedure; finish with `just check`. A change that
makes any check, hook, or permission weaker needs the maintainer's explicit
decision in its own pull request, never an agent's judgement.

### Add or remove a client

The registry `scripts/lib/clients.ts` is the decision: a client is
supported because it is registered, never because a file exists.

1. Add or delete the client's entry and its `ClientId` (namespace directory,
   wiring files, generated files, and `agents` only when the client's plugin
   system carries agents; otherwise add a watch-list row). When deleting,
   run `just client-footprint <id>` first and remove those files.
2. Teach `scripts/gen.ts` to produce the client's files from `plugin.json`,
   failing loudly on anything the client cannot express; add cases to
   `scripts/gen_test.ts`. Add wiring checks to `scripts/check_plugin.ts`.
3. Update `.agents/knowledge/client-matrix.md` (table and verification
   log), `openspec/specs/agent/spec.md`, both READMEs, the site's plugin
   pages, the `clients-validate` recipe, the dev container features, and
   the Context section of `HARNESS.md`.
4. `just gen`, `just check`, then verify in the client and log it.

### Thicken or thin a check

- Check: the recipe in the `justfile`, its job and the summary job's needs
  in the `checks` workflow, its row in `.agents/knowledge/github/checks.md`
  and in the Validation table of `AGENTS.md`, and its place in `check-fast`
  when it needs no network, in one change. Secret scanning keeps its own
  workflow.
- Hook: `.pre-commit-config.yaml`; keep the whole run under ten seconds so
  nobody bypasses it. Secret scanning stays.
- Authority: `.agents/knowledge/agent-authority.md` and the Authority
  section of `HARNESS.md`, with the maintainer's decision and date.
- Spec strictness: the rules in `openspec/config.yaml` and the `--strict`
  flag of `just spec-check`.

### Upgrade OpenSpec

1. Note `openspec --version` and the version in
   `.agents/knowledge/spec-workflow.md`. Commit everything first so the
   regeneration can be reverted with git.
2. Run `openspec init --tools agents --force` in the repository root; never
   `openspec update` (it treats the `.claude/skills` symlinks as a Claude
   install and rewrites skills for every detected tool).
3. Diff the result; keep only changes under `.agents/skills/openspec-*` and
   `openspec/`, restore the hand-written `openspec/config.yaml`, and delete
   anything written elsewhere. A new `openspec-*` skill needs its
   `.claude/skills` symlink.
4. Update the version in the two knowledge files; `just harness-check`,
   `just spec-check`.
