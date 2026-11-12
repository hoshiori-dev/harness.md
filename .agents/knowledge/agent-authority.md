# Agent Authority Policy

Read before pushing, marking a pull request ready, posting a comment,
adding or removing a label, releasing, or changing a remote setting;
when an action is refused;
and whenever unsure whether an action is yours to take.

The design behind this policy
is the Authority section of `HARNESS.md` (2026-11-11).
The dev container and the scope of the `gh` token decide what an agent *can* do;
this file decides what it *may* do, and it is the narrower of the two.

## Reversibility is the key

Classify every action before taking it:

- **Reversible and internal** (edit files, create a branch, run checks,
  commit locally, create a worktree): do it, no question asked.
- **Irreversible or outward** (push, open or mark ready a pull request, comment,
  label, close, release, change a remote setting,
  delete anything a person wrote):
  take it only when the plan or the issue pre-authorised that action;
  otherwise queue it as a pending decision and continue with the rest.
- **Never an agent's:** approving a pull request, adding `spec:approved`,
  merging, tagging, creating or editing a release, force-pushing,
  pushing to a branch another agent owns.

Local commits can be rewritten;
pushed commits cannot be erased from GitHub
(unreachable objects stay addressable), so the two are not the same class.

## Approval at both ends, not per command

Approval happens when a plan is agreed and when the work is handed over,
not on each command.
A plan approval covers the result and the bounds of the approach,
never a list of steps.

A plan or issue may pre-authorise, for its own branch only:
pushing, opening and updating the draft pull request,
marking it ready after the self-review below,
and posting the `Ready for review` comment. Nothing else can be pre-authorised.

When a step is blocked on a decision only a human can make,
do the parts that do not depend on it and add the item
to the pending decisions list: what is blocked and why, the options,
the recommended option with its reason,
and which finished work each option would change.
Present the list once, when nothing else can proceed or at the end.

## Remote settings

A remote setting (ruleset, merge methods, Pages, secret scanning,
label sync applied by hand) is changed by the maintainer.
An agent changes one only after it showed the exact command
and the resulting state and the maintainer approved that one action;
it then reads the setting back and records date and readback
in `.agents/knowledge/github/platform-settings.md`.
One approval covers one action, never the next.

## A refusal is a decision

When a command, hook, or permission refuses an action,
read the refusal as one of three things:
the approach is in the wrong place
(go back to the plan and choose another approach);
a policy boundary was reached (record a pending decision);
or a check found a defect (fix the defect).
Never route around a refusal with an equivalent command, a script,
or a loosened rule.

## Permission lists

A permission list names what is known safe and what
is known dangerous and leaves the rest to the client's default.
It carries no "ask" entries:
a prompt on every command exhausts the reviewer and protects nothing.
`.claude/settings.json` allows the checking recipes and denies force
and bulk pushes, hard resets, forced `git clean`, forced branch deletion,
and `rm -rf` of the root; it also turns off commit and pull-request attribution,
and no commit or pull request names an AI or a tool in any client.
The deny list guards against carelessness, not an attacker;
an agent that can run code can bypass it,
which is why the container and the token's scope are the real boundary.
In a client without such a list the same rules hold by this policy alone.

## Self-review before ready

Ready means the pull request is worth a human reviewer's time.
With `just check` green and the checklist ticked,
read the whole diff once against the issue and the spec and ask:
does it do all of what was asked and nothing else;
is anything wrong (a bug, a false sentence, a hand-edited generated file,
a loosened check, a secret, a mirror left behind);
would the maintainer have to ask a question the body could answer?
Act only on findings that change correctness, scope, or reviewability.
One pass, then `gh pr ready`.

## Handoff

After `gh pr ready`, post one comment headed `Ready for review` naming what
changed, what the self-review changed, where to start reading,
and the behavioural test results when a skill changed;
report the same in the session. State what was not verified (how the site looks,
how a skill behaves in a client's interactive session) instead of implying
it was.

## Gates

| Gate | Meaning | Owner |
|---|---|---|
| Proposal approval | the maintainer adds `spec:approved` to the pull request; the `pr-labels` workflow records the approved commit | maintainer |
| Review admission | the self-review passes; the draft becomes ready | agent, when pre-authorised |
| Integration | squash merge into `main` | maintainer |
| Release | tag `vX.Y.Z` pushed | maintainer |

The `pr-labels` workflow accepts `spec:approved` only from an account
with write permission and withdraws it when the approved package changes.
It cannot tell the maintainer from an agent working
through the maintainer's account: that line is this policy.

## First implementation

The repository's first implementation (2026-11-11) was written in one pass,
in a session the maintainer ran side by side with the agent,
before the workflows and the ruleset existed.
Every change after it follows this file.
A side-by-side session changes who answers a pending decision,
not what needs an answer.

## This file protects itself

Loosening this policy, a check, a hook, a workflow, a fixture expectation,
or a permission list is outside every agent's authority,
including when it would unblock the current task.
Propose the change in its own pull request and wait.
