# Agent-Turn Hook

Read when an agent-turn hook was agreed and it must be registered,
or when an audit finds one.

Some clients can run a script when the agent tries to end its turn
and send the agent back to work when the script fails.
The check then runs whether or not the agent remembered it,
which is what makes it a gate. Use it only where one was agreed:
it costs the fast recipe's duration on every turn,
so the recipe must fit its budget.

## What the hook runs

The fast aggregate recipe, nothing else.
On failure the script prints the recipe's own errors to stderr and exits
with the code the client reads as "do not stop".
It adds no parsing, and it never runs the full check:
a turn that waits minutes to end gets interrupted by the user instead.

## By client

| Client | Registration |
|---|---|
| A client with an end-of-turn hook that can send the agent back | register the script in that client's form, with the exit code its documentation gives for "keep working"; a client may stop honouring the block after a number of consecutive blocks, which the same documentation states |
| A client without one | nothing; say so in the knowledge file |

Confirm the hook format against the client's current documentation
before writing it: hook schemas change between versions,
and a malformed entry is ignored without an error.

## Rules

- The hook configuration file is a permission file of the client.
  Whether an agent may edit it is decided by the layer that owns Authority;
  list the file in the hand back for it.
- A hook that cannot find the task runner fails loudly;
  it never exits 0 because the check could not run.
- The knowledge file names the client, the hook, and the recipe,
  so a reader of a red turn knows where the message came from.
