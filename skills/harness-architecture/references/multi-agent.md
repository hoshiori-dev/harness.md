# Several Agents in One Repository

Read when the user describes or asks about more than one agent working at once.
One agent at a time is the default; for a single agent none of this is raised.

## Workspace: split by read and write

- Reading in parallel (review, architecture analysis, a security scan):
  several agents share one working directory.
- Writing in parallel: one `git worktree` or one container per agent,
  so nobody overwrites another's files.

## Shared resources to check before a parallel run

Anything two agents could hold at once:
local ports, test database instances or schemas, fixed-path lock files,
build cache directories, outside API rate limits.
Allocate dynamically or namespace per agent.

## Remote shared state

A worktree isolates files, not the platform.
Two agents commenting on one issue produce a thread nobody can read;
two agents labelling one request overwrite each other;
two agents pushing one remote branch lose commits on a force push. Three rules:

1. Each agent owns its own remote branch; none is shared.
2. Writes to platform objects (issues, comments, labels,
   states) go through one coordinator, a person or one designated agent;
   parallel agents only produce results.
3. Those writes are outward and irreversible,
   so each is pre-authorised in the plan or the specification,
   never decided by one agent.

## Merging back

Name who merges and who settles conflicts before the agents start.
Split the work along file boundaries at planning time;
the quality of the split decides whether parallel work pays.

## Before recommending it

Clients differ in what their multi-agent support delivers (concurrent subagents,
shared context, structured returns);
a team member on a client without it works degraded.
Context cost multiplies with the agent count.
Confirm the clients in use and the merge owner with the user first;
the repository rarely shows either.

## Where it is recorded

In the design, parallel work is part of Authority (who may write what,
who merges) and Environment (what is isolated per agent).
A design that does not mention several agents is a single-agent design.

## Answer shape

For N agents each fixing one package:
one worktree and one remote branch per agent;
the shared resources above listed and namespaced;
one coordinator for platform writes, with those writes pre-authorised;
a named merge owner and conflict adjudicator. No file is built.
