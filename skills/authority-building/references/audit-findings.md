# Audit Findings

Read when classifying an audit finding of the Authority layer
or choosing its disposition.

## What to report

- an allowed push or force push, or a runner wildcard in permission files:
  **contradictory**, **high**;
- a missing deny entry for an unrecoverable action:
  **missing**, **high**;
- the policy, permission files, and entrypoint core disagreeing:
  **contradictory**, **high**;
- an ask entry without a recorded reason, or surplus platform entities:
  **excessive**, **medium**;
- stash-as-checkpoint: **contradictory**, **medium**;
  no rollback recipe where checkpoints are required: **missing**, **medium**;
- attribution in recent commits against the rule: **contradictory**, **medium**;
- a register row whose readback differs from the remote,
  or a required check naming a job that does not exist: **stale**, **medium**;
- merge methods, protection, or labels differing from the source of truth:
  **contradictory**, **medium** (**high** when default-branch protection is missing or open);
- entities or working practices the anchor document does not name:
  **stale**, **low** (propose amending the anchor document to record them or removing them).

## Form and disposition

Each finding takes the form of the skill's rule on findings.
High here means an unrecoverable or outward action
can happen without a decision. Evidence is `path:line`,
or a readback command and its output.
The source of truth is the anchor document's sentence,
or the condition that calls for the recommendation.
The disposition is to fix the artifact or to amend the anchor document;
with no anchor document, to fix the artifact
or to keep the practice as the user's recorded decision.
