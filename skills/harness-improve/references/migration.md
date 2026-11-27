# Migration

Read when the agreed work moves the project to another spec carrier
(OpenSpec, Spec-Kit, per-change `SPEC.md` and `PLAN.md`,
a plan agreed in the conversation)
or to another hosting platform (GitHub, GitLab).
A migration enters the plan only when the user asked for it or accepted it;
the analysis never adds one on its own.

## Carrier migration

Layer: Completion. Its builder does the work;
where an installed skill covers the new carrier, the builder uses it.

1. **Freeze in-flight work.**
   List every open change or feature in the old carrier.
   Each is finished and archived in the old carrier,
   or frozen as it is and recorded; none is translated half-done.
2. **Sort the specs.** Each existing spec gets one of:
   moves (it covers code that is still changing; translate it),
   deleted (it covers code nobody is changing; an unmaintained spec rots),
   fixed first (it contradicts the code; the drift item precedes the move).
   Each deletion asks for its own go-ahead.
3. **Swap the automation last.**
   The old carrier's checks, labels, and CI jobs are removed
   and the new ones installed only after the user approves that item;
   each label or remote setting is a remote write with its own go-ahead.
4. **Repoint the harness.** The entrypoint route,
   the knowledge file for the spec workflow, request templates,
   and the self-check name the new carrier;
   the old paths leave every file.

Changes: the spec directory, the carrier's automation,
and the pointers to it.
Preserves: the completion rules, how a change is approved,
and the meaning of every spec that moves.

## Platform migration

Layer: Authority, which holds the platform lifecycle
(labels, templates, merge method, releases, remote settings).
Gates is touched only for the CI files.
The thickness of every layer stays as it is unless the plan says otherwise.

The plan lists what to recreate, each with its source and its target:

| Entity | Source | Target |
| --- | --- | --- |
| Labels | the label definitions or the platform's list | a label file and a dry-run sync |
| Templates | issue and request templates | the target platform's template paths |
| CI | workflow files | the target platform's syntax, calling the same task-runner recipes |
| Settings | branch protection, merge method, required checks | a settings record the user applies or approves |
| Platform knowledge | the knowledge file and project skill for the platform | rewritten for the target |

Every remote write (creating labels, changing settings,
requiring checks, archiving the old project)
is shown as a dry run first and needs its own go-ahead.
Settings only an administrator can change go into the closing report
as actions left for the user.

Changes: platform files and platform knowledge.
Preserves: the task-runner recipes CI calls,
the branch model unless the user changes it, and the commit convention.
