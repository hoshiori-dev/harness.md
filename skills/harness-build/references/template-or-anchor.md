# Template or Anchor

Read before step 3 decides how to treat the file's Context. A `HARNESS.md`
can reach a project in two ways, and the build treats them differently.

## Telling them apart

| Sign | Reading |
| --- | --- |
| Context names this repository's stack, platform, people, or history, and step 2 confirms them | the project's own design |
| Context speaks of a kind of project ("a library one person maintains") | a reusable design used as a template |
| Context names facts step 2 contradicts (another platform, another stack, a team where the log shows one author) | a design from another project, used as a template |
| The file was added in the latest commit or is untracked, and the user's message is only the project's goal | a template just pasted in |
| The repository's artifacts already follow the file | the project's own design |

When the signs disagree, ask in the one round: "Is this file's Context
about this project, or was the file taken from elsewhere?"

## The project's own design

Build it as written. If step 2 shows a Context sentence that is no longer
true (the platform moved, the team grew), do not adapt it here: report it,
build everything that does not depend on it, and say that the design
workflow is where the design is revised.

## A template

### The one round

Ask in one message, and only what step 2 could not show:

- the project's goal, when the invocation did not give it;
- the stack, when neither the goal nor the repository shows it and the
  design leaves it open;
- each condition the file's Context states that the repository cannot
  confirm: what a wrong change costs, how long the project will be
  maintained, who relies on its conventions, how unattended agents are,
  which clients and which weakest model will work here.

Offer the template's own value as the default answer for each condition
("the design assumes agents are checked between tasks; is that right
here?"). The hosting platform comes from the remote and is not asked; with
no remote, say that the platform parts of Authority will be built for no
remote unless the user names one.

### Adapting without redesigning

1. **Rewrite Context** to this project: the answers from the round and the
   facts from step 2.
2. **Fill the blanks.** Where the design leaves a slot for the project
   ("the project's test command", "the main package"), fill it from the
   repository, or for an empty project from the stack's usual tool, and
   list each fill as an assumption.
3. **Where a condition matches**, change nothing.
4. **Where a condition differs**, find every sentence whose stated reason
   is that condition. Hand the layer's section to its builder in design
   mode with the old sentence, the new condition, and the instruction to
   change as little as possible. Take back the proposed sentence.
5. **Leave the rest alone.** A decision you would have made differently,
   whose reason still holds, is not yours to change.
6. Give the file a `name` and `description` for this project. Keep a
   `license` the source carried and tell the user what it requires. Record
   where the file came from in References when the user knows.

The plan shows the adaptation as pairs of old and new sentences with the
condition behind each. The user approves it with the plan.

### When the template does not fit

When most sentences would change, the template fits this project in name
only. Stop before planning, say so with the count of sentences affected,
and recommend the design workflow, which can start from the same file.

## What stays untouched in both cases

The introduction's "what stays with a human" and every Authority sentence
are never
loosened by an adaptation. A condition that would justify giving agents
more room than the file gives is reported as a suggestion, not applied.
