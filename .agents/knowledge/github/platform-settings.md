# Platform Settings Register

Read before reading back or changing a remote setting of
`hoshiori-dev/harness.md`, and when a check is "not running" rather than
failing. These are account-side settings no checkout can recreate.

A setting is applied by the maintainer, or by an agent only after the exact
command and resulting state were shown and the maintainer approved that one
action (`.agents/knowledge/agent-authority.md`). After applying, run the
readback and record date and result in the last column.

Observed state on 2026-11-11 (read-only): public repository; merge commit,
squash, and rebase all allowed; GitHub's default labels only; no rulesets;
Pages not enabled.

| Setting | Intended value | Readback | Applied |
|---|---|---|---|
| Merge methods | squash only; delete head branch on merge; squash commit = pull request title + body | `gh repo view --json squashMergeAllowed,mergeCommitAllowed,rebaseMergeAllowed,deleteBranchOnMerge` → `true,false,false,true` | not applied yet; applied by the maintainer or after a per-action approval |
| Ruleset on `main` | require a pull request (0 approvals: one maintainer; threads resolved; squash only); required checks `checks / gate`, `secrets / scan`, `checks / pr`, `checks / spec-archived`; block deletion and force push; no bypass actors, so the owner also merges through pull requests | `gh api repos/{owner}/{repo}/rulesets` → `main`, `active` | not applied yet; applied by the maintainer or after a per-action approval. Register a required check only after it has reported once on a pull request |
| Labels | `.github/labels.json` applied by the `labels` workflow on every push to `main` that changes it; GitHub's default labels left in place | `just labels` reports no drift | not applied yet; first sync is `just labels --apply` by the maintainer or after a per-action approval |
| Pages | source "GitHub Actions"; the site workflow deploys from `main` to `https://hoshiori-dev.github.io/harness.md/` | `gh api repos/{owner}/{repo}/pages --jq .build_type` → `workflow` | not applied yet; applied by the maintainer or after a per-action approval |
| Secret scanning + push protection | enabled (GitHub's default for public repositories) | `gh api repos/{owner}/{repo} --jq .security_and_analysis` → both `enabled` | not read back yet |
| Private vulnerability reporting | enabled (`SECURITY.md` sends reporters there) | `gh api repos/{owner}/{repo}/private-vulnerability-reporting` → `{"enabled":true}` | not applied yet; applied by the maintainer or after a per-action approval |
| Actions default token | read-only; workflows request write scopes per job | `gh api repos/{owner}/{repo}/actions/permissions/workflow` → `read`, approvals `false` | not read back yet |
| Repository metadata | description and homepage equal to `plugin.json`; topics from its `keywords` | `gh repo view --json description,homepageUrl,repositoryTopics` | not applied yet; applied by the maintainer or after a per-action approval |

Secrets and variables: none required. The release and site workflows use
the workflow's own `GITHUB_TOKEN`.

Update trigger: when a setting is applied or its intended value changes,
edit its row in the same pull request or, for a setting applied outside a
pull request, in the next one. The intended values follow the Authority
section of `HARNESS.md`.
