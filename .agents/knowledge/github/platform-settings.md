# Platform Settings Register

Read before reading back or changing a remote setting
of `hoshiori-dev/harness.md`,
and when a check is "not running" rather than failing.
These are account-side settings no checkout can recreate.

A setting is applied by the maintainer,
or by an agent only after the exact command and resulting state were shown
and the maintainer approved that one action
(`.agents/knowledge/agent-authority.md`).
After applying, run the readback and record date and result in the last column.

Observed state on 2026-11-11 (read-only): public repository;
merge commit, squash, and rebase all allowed; GitHub's default labels only;
no rulesets; Pages not enabled.
The settings below were applied on 2026-11-12, after pull request #1 merged
(as a merge commit, before squash-only was set).

| Setting | Intended value | Readback | Applied |
|---|---|---|---|
| Merge methods | squash only; delete head branch on merge; squash commit = pull request title + body | `gh repo view --json squashMergeAllowed,mergeCommitAllowed,rebaseMergeAllowed,deleteBranchOnMerge` → `true,false,false,true` | applied 2026-11-12; readback matched |
| Ruleset on `main` | require a pull request (0 approvals: one maintainer; threads resolved; squash only); required checks `checks / gate`, `secrets / scan`, `checks / pr`, `checks / spec-archived`; block deletion and force push; no bypass actors, so the owner also merges through pull requests | `gh api repos/{owner}/{repo}/rulesets` → `main`, `active` | applied 2026-11-12 after all four checks had reported on pull request #1; readback `main`, `active` |
| Labels | `.github/labels.json` applied by the `labels` workflow on every push to `main` that changes it; GitHub's default labels left in place | `just labels` reports no drift | synced by the `labels` workflow on the first push to `main`; `just labels` reported no drift on 2026-11-12 |
| Pages | source "GitHub Actions"; the site workflow deploys from `main` to `https://hoshiori-dev.github.io/harness.md/` | `gh api repos/{owner}/{repo}/pages --jq .build_type` → `workflow` | applied 2026-11-12; readback `workflow`; first deploy succeeded and the site answers |
| Secret scanning + push protection | enabled (GitHub's default for public repositories) | `gh api repos/{owner}/{repo} --jq .security_and_analysis` → both `enabled` | read back 2026-11-12: both `enabled` |
| Private vulnerability reporting | enabled (`SECURITY.md` sends reporters there) | `gh api repos/{owner}/{repo}/private-vulnerability-reporting` → `{"enabled":true}` | applied 2026-11-12; readback `{"enabled":true}` |
| Actions default token | read-only; workflows request write scopes per job | `gh api repos/{owner}/{repo}/actions/permissions/workflow` → `read`, approvals `false` | read back 2026-11-12: `read`, approvals `false` |
| Repository metadata | description and homepage equal to `plugin.json`; topics from its `keywords` | `gh repo view --json description,homepageUrl,repositoryTopics` | applied 2026-11-12; readback matched `plugin.json` |

Secrets and variables: none required.
The release and site workflows use the workflow's own `GITHUB_TOKEN`.

Update trigger: when a setting is applied or its intended value changes,
edit its row in the same pull request or,
for a setting applied outside a pull request, in the next one.
The intended values follow the Authority section of `HARNESS.md`.
