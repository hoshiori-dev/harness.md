# Checkpoints

Read before the first change of step 7, after each layer,
and before committing the review's fixes in step 8.

## Before the first change

Run the project's existing checks and record each failure,
so that a later failure is known to be new.
When a recipe stops at its first failure,
run the checks behind it one by one, here and after each layer.

## After each layer

Run the project's checks.
Commit that layer's files when no check fails that passed before
the first change and every check this work added passes.
Compare failure by failure, never by exit status.
Commit in the project's commit convention,
with no attribution to an AI or a tool. Push nothing.

A check that already failed before the first change does not hold
a checkpoint back: name it in the commit message
with the plan item that repairs it,
or keep it in the pending decisions list when no item does.
A check this work added that fails only on code the work did not touch
does not hold a checkpoint back either: it is the builder's finding,
named in the commit message and kept in the pending decisions list.
Never weaken a check to make a checkpoint pass.

When a layer's checks can pass only together with a later layer's change,
build both and commit them as one checkpoint.

## After the final review

The commit of the review's fixes is a checkpoint under the same rule:
run the project's checks, the harness self-check among them,
and commit when no check fails that passed before the first change
and every check this work added passes.

## A rejected commit

When a hook rejects the commit, fix what it flagged and retry;
never bypass the hook.
When it rejects only for code the work did not touch,
leave that code alone and the layer uncommitted,
and put it on the pending decisions list:
the user repairs the code, or agrees where the check runs.
