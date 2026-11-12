# Reversibility

Read when classifying an action the section does not name,
when the user disputes a classification,
or when the user asks why a local commit and a push are not the same class.

## The one question

Can the agent undo this alone,
and does anything outside the working copy see it? Two classes, no third.

| Class | Examples | What the agent does |
|---|---|---|
| Reversible and internal | edit files, create a branch or worktree, run tests and checks, commit locally, squash unpushed commits | do it, no question |
| Irreversible or outward | push, open or update a pull request, post a comment, add or remove a label, change an issue or request state, release, publish a package, change a remote setting, delete anything the user wrote, send a message | take it only when it is pre-authorised; otherwise add it to the pending decisions list and continue with the rest |

Classify by effect, not by tool: a task-runner recipe that pushes is outward;
an MCP tool that only reads is internal.

## Pre-authorisation has two sources

- **Standing**: the Authority section names the outward actions agents take
  on every task without asking
  (for example "push the task branch and open its draft request").
  The deposited policy repeats that list.
- **Per task**: the approved plan
  or the task's specification names an outward action for that task only.

Nothing else pre-authorises.
An action that was approved once in a conversation is not standing;
a habit visible in history is not standing.

Defaults for the standing list, by Context:

| Context | Standing pre-authorisation |
|---|---|
| A human reviews between tasks; a wrong change is cheap to undo; the repository is private | push the task branch; open and update that branch's draft request |
| The repository is public, or a wrong publication is costly | none; a draft request on a public repository is public the moment it opens, so each task's plan names its outward actions |
| Agents run unattended on a queue of issues | push the task branch; open and update its draft request; nothing that touches another person's thread |

Never standing, in any Context: marking a request ready, merging, pushing a tag,
releasing or publishing, changing a remote setting,
deleting anything the agent did not create in the current task,
and force pushing.

## Why commit and push differ

A local commit can be rewritten, reset, or dropped; nobody else saw it.
Once pushed, the remote keeps the objects:
a force push moves the branch pointer, the old commits stay reachable by SHA,
the request's event log still links to them,
and erasing them means contacting platform support.
A push is therefore outward and irreversible even
when it is "only to my branch".

## Tools registered with the client

The same key sorts tool permissions: read-only tools are allowed;
tools with an outward effect are classified one by one;
a whole server or tool family is never put under ask or allowed as a block.
Which tools exist and what each can reach is the Environment section's subject;
this layer only sorts the actions.

## What the section and the policy state

The Authority section carries the table above with the project's own commands
and platform operations in place of the generic examples, the standing list,
and the rule for each class,
so a reader with that text alone can sort a new action.
When a wrong change is costly or agents run unattended,
it also carries the explicit list of this project's irreversible actions,
named as its platform's operations (`gh pr ready`, `gh release create`,
the project's publish recipe). The deposited policy repeats both.
