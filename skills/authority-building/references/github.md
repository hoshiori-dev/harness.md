# GitHub

Read when the target's platform is GitHub:
before writing the platform half of a section, before writing the files,
before any remote write, and before auditing a remote setting.

## What the plan and visibility allow

Owner type, plan, and visibility are separate facts from the probe;
a missing one is asked, never inferred from another.

| Capability | Available on |
|---|---|
| Rulesets, branch protection, required checks, required reviews, CODEOWNERS enforcement | public repositories on every plan; private repositories only on Pro (personal), Team, or Enterprise |
| Merge-method settings, labels, issue forms, PR template, Actions | every plan and visibility |
| Bypass by team or app | organisation-owned repositories only |

On a private repository of a personal free account, nothing can refuse a merge:
each protection becomes a convention with an owner in the settings register,
and its trigger is "plan upgrade to Pro, or public visibility".
Say this before proposing the protection, not after.

## Files

Each asset is reworked into the path beside it;
an asset whose condition is not met is not delivered.

| Asset | Path in the target |
|---|---|
| [issue-form-bug.yml](../assets/github/issue-form-bug.yml), [issue-form-feature.yml](../assets/github/issue-form-feature.yml), [issue-form-task.yml](../assets/github/issue-form-task.yml) | `.github/ISSUE_TEMPLATE/bug.yml`, `feature.yml`, `task.yml` |
| [issue-template-config.yml](../assets/github/issue-template-config.yml) | `.github/ISSUE_TEMPLATE/config.yml` |
| [pull-request-template.md](../assets/github/pull-request-template.md) | `.github/pull_request_template.md` |
| [labels.json](../assets/github/labels.json) | `.github/labels.json` |
| [workflow-labels-sync.yml](../assets/github/workflow-labels-sync.yml) | `.github/workflows/labels.yml`, only when the section has a workflow run the sync |
| [codeowners](../assets/github/codeowners) | `.github/CODEOWNERS`, only when the section includes it |
| [knowledge-github-workflow.md](../assets/github/knowledge-github-workflow.md) | `github-workflow.md` in the knowledge directory |
| [platform-settings.md](../assets/github/platform-settings.md) | `platform-settings.md` in the knowledge directory: the settings register |
| [project-skill.md](../assets/github/project-skill.md) | `github-project-workflow/SKILL.md` in the project skills directory |
| `sync_labels.py`, `run_log_digest.py`, and their tests, from the assets directory | `scripts/`, or the project's own scripts path |

The knowledge file and the register each open with their "Read this when…" line.
When a file of that name exists, add the sections to it;
never create a second workflow or label file.
The register holds every remote setting with current value, target value,
status, owner, readback command, and trigger,
including each decline and each convention the platform cannot enforce.
A rewrite of a script in another language replaces the Python copy instead
of sitting beside it.

## Remote writes

Each write below is one delta:
show the current value (the readback) and the exact command or JSON,
apply only after the user approves that delta,
then run the readback again and record it in the settings register.

**Merge methods**, squash only:

```sh
gh api -X PATCH repos/OWNER/REPO -F allow_squash_merge=true -F allow_merge_commit=false \
  -F allow_rebase_merge=false -F delete_branch_on_merge=true \
  -f squash_merge_commit_title=PR_TITLE -f squash_merge_commit_message=PR_BODY
gh api repos/OWNER/REPO --jq '{allow_squash_merge,allow_merge_commit,allow_rebase_merge,delete_branch_on_merge}'
```

**Default-branch ruleset**,
written to a file outside the repository and shown as the delta:

```json
{
  "name": "default-branch",
  "target": "branch",
  "enforcement": "active",
  "conditions": {"ref_name": {"include": ["~DEFAULT_BRANCH"], "exclude": []}},
  "bypass_actors": [],
  "rules": [
    {"type": "deletion"},
    {"type": "non_fast_forward"},
    {"type": "pull_request", "parameters": {
      "required_approving_review_count": 0,
      "dismiss_stale_reviews_on_push": false,
      "require_code_owner_review": false,
      "require_last_push_approval": false,
      "required_review_thread_resolution": false}}
  ]
}
```

Apply with `gh api -X POST repos/OWNER/REPO/rulesets --input <file>`
(an existing ruleset: `-X PUT repos/OWNER/REPO/rulesets/<id>`),
read back with `gh api repos/OWNER/REPO/rulesets/<id>`.
The approval count comes from the section; 0 suits a single maintainer.
An empty `bypass_actors` binds admins too;
legacy branch protection exempts admins unless `enforce_admins` is on.

**Required check**, added later as its own delta:
append
`{"type": "required_status_checks", "parameters": {"strict_required_status_checks_policy": false, "required_status_checks": [{"context": "<job name>"}]}}`
to the ruleset's rules,
only after
`gh run list -R OWNER/REPO --branch <default> --workflow <file> --status success --limit 1`
shows a green run. Which job gates a merge is decided by the layer
that owns Gates; this layer only makes the platform require it.

**Labels**:
`python3 scripts/sync_labels.py --file .github/labels.json --repo OWNER/REPO`
prints the plan; the same with `--apply` after approval;
`gh label list -R OWNER/REPO --json name,color,description` is the readback.

## Gotchas

- `"available": false` in the probe is an HTTP 403:
  either the plan and visibility lack the feature
  or the caller lacks admin rights.
  Settle which from the plan and visibility facts
  before saying a rule cannot be enforced.
- A required check matches the job's displayed name.
  A path-filtered job that is skipped reports success,
  and a renamed job leaves its required check waiting forever;
  require an aggregating gate job, not a filtered one.
- Rulesets and legacy branch protection both apply, most restrictive wins:
  record both in the register, including "none".
- Labels named in an issue form that do not exist are dropped silently,
  so the label sync runs before the forms are relied on.
- `gh issue create` without `--template` ignores forms;
  the project skill mirrors their headings.
- A draft pull request on a public repository is public the moment it opens.
- Label colours are six hex digits without `#`.
