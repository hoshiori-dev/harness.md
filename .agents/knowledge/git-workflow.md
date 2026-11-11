# Git Workflow

Read before creating a branch, committing, squashing, pushing, opening a pull
request, merging, or tagging.

Model: GitHub Flow. One line of development (`main`), short-lived issue
branches, every version a tag of `main`.

## Branches

| Branch | Meaning | Protection |
|---|---|---|
| `main` | releasable; every commit passed the summary check | ruleset: pull request required, checks required, squash only, no force push (`.agents/knowledge/github/platform-settings.md`) |
| `<n>-<slug>` | one issue, as `gh issue develop -c <n>` names it | cut from `main`, deleted on merge; one agent, one branch |

## Checkpoints are commits

- Commit after every verified task of the plan or the OpenSpec tasks list;
  never stash as a checkpoint and never rely on a session-only undo.
- A finished task is one atomic commit written to the convention below.
  Draft commits made inside a task are squashed into that task's commit when
  the task ends, non-interactively: `git reset --soft <task-start>` then one
  commit. Squash per task, not per pull request.
- A task that turns out to hold two independent changes goes back to the
  plan and is split there; do not carve commits out of a mixed diff by hunk.
- Draft commits never leave the machine. Push only after the task's commit
  exists, and push one explicit ref (`git push origin HEAD`), never `--all`,
  `--mirror`, or `--tags`. Only unpushed history is rewritten; pushed
  history is reverted.
- Squashing changes no content: the pre-commit hooks, betterleaks included,
  run on every checkpoint commit, so a stray credential is caught before it
  can be folded into a task commit.
- "No draft commit on the branch" is part of every task's completion.

## Commit messages

Conventional Commits: `<type>(<scope>)?: <subject>`. Subject: lowercase,
imperative, no trailing period, at most 50 characters. Body, when present:
a blank line after the subject, lines of at most 72 characters. Types:
`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`,
`style`, `revert`. Scopes: a skill name or an area (`format`, `plugin`,
`hub`, `site`, `harness`, `ci`).

For a shipped skill, `fix` corrects behaviour the installed skill gets
wrong, `feat` adds a capability, `refactor` changes structure only; the file
format never decides the type. For the format, `feat` or `fix` is a change
that alters what a validator reports; a reworded sentence of the
specification is `docs`.

No AI or tool attribution, in a trailer or anywhere else. The pull request
title follows the same rule because it becomes the commit on `main`;
`checks / pr` enforces the form and a ceiling of 72 characters.

## Merge method

Squash only. Task-level commits exist on the branch for review and
bisection during the pull request; `main` receives one commit per pull
request whose message is the pull request's title and body.

## Tags and versions

`vX.Y.Z` equals the `version` in `plugin.json`; `just dist --tag` refuses a
mismatch. Bump the version in a normal pull request, merge, then the
maintainer tags `main` and pushes the tag, which runs the release workflow.
The format's own version (`alpha`) is independent of the plugin's and
changes only through a format change (`.agents/knowledge/format-changes.md`).
