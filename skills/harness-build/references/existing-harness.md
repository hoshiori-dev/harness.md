# Building Over an Existing Harness

Read when the repository already holds any harness artifact (an entrypoint,
knowledge files, project skills, permission files, hooks, checks, CI, a
spec directory) or any working habit. The same workflow then migrates the
project to the design: the plan is the difference between what exists and
what `HARNESS.md` says.

## Compare, then plan the difference

For each sentence of each layer's section, find the artifact that realises
it and put it in one of four groups:

| Group | Meaning | Plan |
| --- | --- | --- |
| conforms | an artifact does what the sentence says | nothing; list it as already built |
| differs | an artifact exists and does something else | change the artifact to the design |
| absent | nothing realises the sentence | create it |
| outside the design | an artifact exists that no sentence mentions | leave it; list it for the user |

An artifact outside the design is never deleted or rewritten by the build.
List each with one line on what it does. The user may remove it (a separate
decision) or have it recorded in the design (the design workflow).

## Contradictions first

A harness that contradicts itself, or a specification that contradicts the
code, is repaired before anything is built on top of it: those items come
first in the plan and every later item that touches the same files depends
on them. When the user wants other work first, say this once; if they still
decline, add the contradiction to the pending decisions list and leave
every contradicted file out of the remaining work.

Design intent comes from `HARNESS.md`, so where an artifact and the design
disagree about intent, the artifact changes. Where they disagree about a
fact the code states (a command's name, a path), the code is right: build
to the code and correct the sentence in the file in step 7.

## Where the design is silent, keep what works

The design decides what it decides. On everything else, the project's task
runner, lint configuration, branch habit, and commit convention stay as
they are. A replacement the build would find convenient is a suggestion in
the closing report, never a plan row.

## Removing things

Deleting a file, a check, a permission entry, a label, or a branch is
"deleting work" and needs its own yes even when the plan lists it. For a
constraint the design drops, the plan names the constraint, what it was
there to catch, and why the design no longer wants it (quote the sentence,
or the absence of one). Without that, it is an artifact outside the design
and stays.

## Moving a rule between layers

When the design puts a rule in another home than the one it has now (an
entrypoint rule that becomes a check; a hook's reminder that becomes an
entrypoint line), the plan names for each: the old home, the new home, the
pointer that replaces it if any, and the copy to delete. No rule is dropped
in a move, and the old copy is removed in the same checkpoint that adds the
new one.

## Changing the spec carrier

When the Completion section names another carrier than the one in use
(OpenSpec, Spec-Kit, per-change `SPEC.md` and `PLAN.md`, a plan agreed in
conversation):

1. **Freeze in-flight work.** List every open change or feature in the old
   carrier. Each is finished and archived in the old carrier, or frozen as
   it is and recorded; none is translated half-done.
2. **Sort the specs.** Each existing spec either moves (it covers code that
   is still changing; translate it), is deleted (it covers code nobody is
   changing), or is fixed first (it contradicts the code).
3. **Swap the automation last.** The old carrier's checks, labels, and CI
   jobs are removed and the new ones installed only after the user approves
   that item; each label or remote setting is a remote write with its own
   go-ahead.
4. **Repoint the harness.** The entrypoint route, the knowledge file for
   the spec workflow, request templates, and the self-check name the new
   carrier; the old paths leave every file.

## Changing the hosting platform

When Context and Authority name another platform than the remote shows, the
plan lists what to recreate, each with its source and its target:

| Entity | Source | Target |
| --- | --- | --- |
| Labels | the label definitions or the platform's list | a label file and a dry-run sync |
| Templates | issue and request templates | the target platform's template paths |
| CI | workflow files | the target platform's syntax, calling the same task-runner recipes |
| Settings | branch protection, merge method, required checks | a settings record the user applies |
| Platform knowledge | the knowledge file and project skill for the platform | rewritten for the target |

Every remote write is shown as a dry run first and needs its own go-ahead.
Settings only an administrator can change go into the closing report.

## Checkpoints over an existing harness

Run the project's existing checks before the first change and record the
result, so that a failure after a layer is known to be new. One commit per
layer, as in step 5; a layer that only removes or moves things is still its
own commit.
