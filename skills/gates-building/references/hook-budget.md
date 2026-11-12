# Hook Budget

Read when setting the commit-hook budget in the section,
when deciding whether a check goes in the hook,
or when an existing hook runs longer than the budget.

## Why the hook stays fast

The hook runs on every checkpoint commit an agent makes.
A slow hook gets bypassed with `--no-verify`,
and the secret scan must never be bypassed:
a squash keeps whatever a draft commit contained,
so the scan has to run on every commit, not only before a release.
Heavy verification belongs in CI and in the full recipe.

## The number

Default 10 seconds for a typical commit (a handful of staged files):
short enough that neither a person nor an agent is tempted to skip it.
Use 5 seconds when agents commit a checkpoint after every small step;
30 seconds when the typecheck cannot be scoped
and the project wants it local anyway. The section states the number.

## Placing each check

| Check | Hook | CI | Full recipe |
|---|---|---|---|
| Formatter | always, on staged files | yes | yes |
| Secret scan | always, on staged files | yes, on the added commits | yes |
| Lint | when it fits, on staged files | yes | yes |
| Typecheck | when the whole-project run fits | yes | yes |
| Tests | only a suite that fits the budget | yes, the full suite | yes |
| Structure check | on staged files | yes | yes |

A check that does not fit goes to CI and to the full recipe,
never into the hook.
The section and the hand back say which checks left the hook and why.

Whenever tests leave the hook,
the project needs a scoped test command that returns in seconds (one file,
one module, or the files changed since the base branch),
so an agent verifies each small change without waiting for CI.
That command belongs to the layer that owns Feedback;
when it is missing, report it in the hand back.

## Measuring

Time each candidate command in check-only mode on a typical change
(`time ruff check <files>`, `time tsc --noEmit --pretty false`).
Take the test-suite duration from CI history
or the user instead of running a long suite.
After writing the hook,
time `pre-commit run --files <the delivered files>` against the budget
and report the number.

## An existing hook over budget

In design mode, write the move into the section:
the slow checks go to CI and a scoped recipe,
with the measured or reported time as the reason.
In audit mode it is a finding with the same remedy.
In build mode change the hook only when the section says so;
otherwise leave it and add the move to the pending decisions list
with the time it costs per commit.
