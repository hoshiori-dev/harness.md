# GitHub Checks

Read when writing or changing GitHub Actions workflows for the project's
checks.

## Which asset, where

| The section gates on | Deliver | Target path |
|---|---|---|
| formatter and secret scan only | [assets/github/workflow-secret.yml](../assets/github/workflow-secret.yml) | `.github/workflows/secrets.yml` |
| lint, typecheck, tests, no summary gate | [assets/github/workflow-checks.yml](../assets/github/workflow-checks.yml) without `boundaries` and `gate` | `.github/workflows/checks.yml` |
| structure checks or a summary gate | [assets/github/workflow-checks.yml](../assets/github/workflow-checks.yml) whole | `.github/workflows/checks.yml` |

The checks workflow carries its own secret-scan job; do not deliver the
secrets workflow beside it. Rework each job to run the recipe of the
section's tool and delete jobs for checks the section does not name. Keep
the commented `# harness:` slot: the harness self-check job is added there
later, and into the gate's `needs` when a gate exists.

## Rules every workflow keeps

- **Pinned actions.** Every `uses:` is a full commit SHA with the tag in a
  comment (`@<sha> # v7.0.1`). Reuse the SHAs the project's other
  workflows already pin; before keeping a SHA from the asset, confirm it
  is still the tag it claims.
- **First-party actions** (`actions/*`) by default. Any other action, an
  ecosystem setup action included, is a supply-chain decision: put it on
  the pending decisions list, and until it is accepted use
  `actions/setup-python` (or the ecosystem's `actions/setup-*`) and
  install tools with the ecosystem's package manager. The asset's
  `astral-sh/setup-uv` step is such an action.
- **Tools installed.** Every check job installs the task runner and the
  tools its recipe calls; a clean runner has neither.
- **Permissions.** `permissions: {}` at the top, `contents: read` per job,
  `persist-credentials: false` on every checkout.
- **Triggers.** `pull_request` plus `push` to the default branch; never
  `pull_request_target` for checks: it runs fork code with write tokens.
- **Concurrency.** A workflow carrying the secret scan cancels in progress
  only for pull requests
  (`cancel-in-progress: ${{ github.event_name == 'pull_request' }}`): a
  push run scans only its own commits, so cancelling it leaves them
  unscanned.
- **Unique job names** with a workflow prefix (`checks / lint`): a required
  check matches by name, and a renamed job orphans it.
- **No hidden failures.** No `|| true`, no `continue-on-error` on a check;
  the gate's `if: always()` is the one deliberate deferral and says why.

## The summary gate

GitHub reports a skipped job as success, so a gate that trusts it passes
untested code. The gate needs every check job, runs with `if: always()`,
and fails unless each result is `success`, naming every job that failed,
was cancelled, or was skipped.

- A job that is legitimately conditional cannot be both skipped and in the
  gate. Either run it always and let it finish fast when nothing relevant
  changed, or leave it out of the gate's needs and say so in the knowledge
  file.
- Never put `paths:` or `paths-ignore:` on the workflow carrying the gate:
  a skipped workflow produces no gate at all, and a required gate then
  waits forever.

## Settings a human applies

Registering `checks / gate` (or, with no gate, the individual jobs) as
required, branch protection, and secret-scanning push protection are
repository settings. List them in the hand back by exact job name; never
change them.

## Validating

Run `actionlint` on each workflow when it is available (`uvx --from
actionlint-py actionlint <files>` works without installing it); otherwise
parse the YAML and check every `needs:` entry names a job in the file.
