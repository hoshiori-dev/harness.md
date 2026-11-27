# Platform Decisions

Read when the project is hosted on GitHub or GitLab and the platform half
is being decided, described, or audited.
With no hosted remote, none of these rows applies.

Each row is returned as the workflow's Decide step says:
settled with its evidence (the probe's output, a file and line,
the handover's sentence), or open with its options,
the recommended one first, its reason, and the decisions it depends on.
Every row depends on the hosting platform;
the rows on protection and the required check also depend on the plan or tier
and the visibility the probe reports.

| Decision | Recommendation, and why | Other option, and what selects it |
|---|---|---|
| Branching | GitHub Flow, `<n>-<slug>` branches deleted on merge: one base, nothing to pick wrong | Environment or release branches, or an existing git-flow, on evidence |
| Merge method | Squash only; the request title follows the commit convention | A recorded rule that picks one method per change |
| Ready and merge | The agent stops at a draft request and reports; a human marks ready and merges | An agent marks ready on green checks where agents run unattended and mistakes are cheap; merging stays human |
| Default-branch protection | Changes only through requests; no force push, no deletion | A convention with a named owner where the plan or tier cannot enforce it |
| Required check | One aggregating gate job, required only after a green run on the default branch | None while no such job exists |
| Platform entities | `type:` and `area:` labels, the reserved `spec:` namespace, bug, feature, and task forms, one request template; boards, milestones, `priority:` and `status:` labels absent on purpose | An entity that passes the deletion test |
| Labels | One committed label file, synced by a workflow or CI job; no pruning without an approved delete list | A named person runs the sync |
| Releases | A human pushes a `vX.Y.Z` tag and one workflow or job publishes; agents never push tags | "No releases"; a release bot only as a recorded decision |
| Remote settings | Each has an owner and a row in a settings register; none changes without a go-ahead for that delta | — |
| Issue-to-merge procedure | One project skill from taking an issue to merging, with a publish gate before every outward write | — |

Who reviews and merges and who owns remote settings are the user's to state:
open, unless the handover or a file in the repository names them.
Where the plan or tier cannot enforce a protection,
say so in the decision before recommending it,
and return it as a convention with a named owner
and the condition that would make it enforceable.
