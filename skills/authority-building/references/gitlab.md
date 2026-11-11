# GitLab

Read when the target's platform is GitLab (GitLab.com or self-managed):
before writing the platform half of a section, before writing the files,
before any remote write, and before auditing a remote setting.

## What the tier allows

Namespace kind (user or group), tier, and visibility are separate facts
from the probe; a missing one is asked, never inferred from another. On
self-managed instances the tier is the instance licence; ask when the probe
reports it unknown.

| Capability | Available on |
|---|---|
| Protected branches (push and merge access levels, force push), merge method, squash option, pipelines must succeed, issue and merge request templates, labels | every tier |
| Required approvals, approval rules, Code Owner approval, push rules, scoped `::` labels | Premium and Ultimate |
| Project access tokens (the label sync job's token) | every self-managed tier; Premium and Ultimate on GitLab.com |

Where the tier lacks a rule the section states (required approvals on Free, for
example), record it in the settings register as a convention with its owner
and the trigger "tier upgrade". The minimal labels use a single colon
(`type:bug`), which is a plain label on every tier.

## Files

Each asset is reworked into the path beside it; an asset whose condition is
not met is not delivered.

| Asset | Path in the target |
|---|---|
| [issue-template-bug.md](../assets/gitlab/issue-template-bug.md), [issue-template-feature.md](../assets/gitlab/issue-template-feature.md), [issue-template-task.md](../assets/gitlab/issue-template-task.md) | `.gitlab/issue_templates/Bug.md`, `Feature.md`, `Task.md` |
| [merge-request-template.md](../assets/gitlab/merge-request-template.md) | `.gitlab/merge_request_templates/Default.md` |
| [labels.json](../assets/gitlab/labels.json) | `.gitlab/labels.json` |
| [ci-labels-sync.yml](../assets/gitlab/ci-labels-sync.yml) | the `labels-sync` job added to `.gitlab-ci.yml`, only when the section has CI run the sync and a project access token is available |
| [knowledge-gitlab-workflow.md](../assets/gitlab/knowledge-gitlab-workflow.md) | `gitlab-workflow.md` in the knowledge directory |
| [platform-settings.md](../assets/gitlab/platform-settings.md) | `platform-settings.md` in the knowledge directory: the settings register |
| [project-skill.md](../assets/gitlab/project-skill.md) | `gitlab-project-workflow/SKILL.md` in the project skills directory |
| `sync_labels.py`, `run_log_digest.py`, and their tests, from the assets directory | `scripts/`, or the project's own scripts path |

The knowledge file and the register each open with their "Read this
when…" line. When a file of that name exists, add the sections to it;
never create a second workflow or label file. The register holds every
remote setting with current value, target value, status, owner, readback
command, and trigger, including each decline and each convention the
platform cannot enforce. A rewrite of a script in another language replaces
the Python copy instead of sitting beside it.

## Remote writes

Each write below is one delta: show the current value (the readback) and
the exact command, apply only after the user approves that delta, then run
the readback again and record it in the settings register. `<id>` is the
URL-encoded project path (`group%2Fproject`); add `--hostname <host>` on
self-managed instances.

**Merge method**, squash only: `merge_method=ff` with `squash_option=always`
gives one commit per merge request; `merge_method=merge` with squash adds a
merge commit beside the squash commit.

```sh
glab api -X PUT projects/<id> -f merge_method=ff -f squash_option=always \
  -F remove_source_branch_after_merge=true
glab api projects/<id>   # read merge_method, squash_option, remove_source_branch_after_merge
```

**Protected default branch**: GitLab protects the default branch at
creation with maintainers allowed to push. To admit changes only through
merge requests, push access is "No one" (0) and merge access Maintainers
(40). An existing rule is replaced by delete then create; say in the delta
that the branch is unprotected between the two calls.

```sh
glab api -X DELETE projects/<id>/protected_branches/<branch>
glab api -X POST projects/<id>/protected_branches -f name=<branch> \
  -F push_access_level=0 -F merge_access_level=40 -F allow_force_push=false
glab api projects/<id>/protected_branches/<branch>
```

**Pipelines must succeed**, the required-check equivalent, as its own delta
only after `glab api "projects/<id>/pipelines?ref=<default>&status=success&per_page=1"`
shows a green pipeline: `glab api -X PUT projects/<id> -F only_allow_merge_if_pipeline_succeeds=true -F allow_merge_on_skipped_pipeline=false`.

**Labels**: `python3 scripts/sync_labels.py --platform gitlab --file .gitlab/labels.json --repo GROUP/PROJECT`
prints the plan; the same with `--apply` after approval;
`glab api "projects/<id>/labels?per_page=100"` is the readback, and a second
dry run printing only skips confirms it.

**Label sync token**: a human creates the project access token (api scope,
Planner role, an expiry) and stores it as the masked, protected CI/CD
variable `LABEL_SYNC_TOKEN`; it is a pending human action in the report and
a row in the register, never a value in any file.

## Gotchas

- "Protected" in the probe does not mean "changes only through requests":
  GitLab protects the default branch at creation but lets maintainers push.
- `"available": false` in the probe is an HTTP 403: the tier lacks the
  feature or the caller lacks the role. Settle which before saying a rule
  cannot be enforced.
- A line starting with `/` in a description or comment is a quick action:
  the issue templates use `/label` on purpose; nothing else may.
- The closing pattern `Closes #<n>` closes the issue only when the merge
  request targets the default branch.
- Fork merge requests run pipelines in the fork by default, and protected
  variables reach only protected refs; keep both so no fork code sees the
  label token.
- The label sync job's image must provide both `python3` and `glab`; pin it
  by digest, and deliver no job when no such image is agreed (a maintainer
  runs the sync instead).
- Label colours read back with `#`; the label file stores six hex digits
  without it, and the sync adds it.
