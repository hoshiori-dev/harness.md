# Approval Gates

Read when writing the approval decisions of the section,
when the user asks for a job that approves or archives,
when writing the approval part of the contract,
and when filling or refreshing a spec-workflow marker block.

Approval belongs at the two ends of a change, not on every step:
once on what will be built, once on what was built.

## The two gates

| Gate | Examines | Releases | Order |
|---|---|---|---|
| First | The spec, plus the design when one is warranted | The task list and the implementation | Closed before any task list is written |
| Second | The finished implementation against that spec | The freeze of the record | Opens when the pull or merge request is marked ready, after the last task is verified |

- A design is warranted when more than one reasonable approach exists
  or the change touches structure, interfaces, dependencies,
  or files outside the spec. It bounds the approach and lists no steps;
  it is committed, so it carries no secret.
- The draft pull or merge request opens when the spec (and design) are complete;
  the agent that published it stops until the first gate closes.
- The request is marked ready when the last task is verified,
  with the record still open. The second review runs on that.
- The freeze happens inside the request, after the second review closes:
  the record is archived (or merged into the living spec, or,
  for a tool without archiving, declared frozen at a named commit).
  The executor is the implementer, or a maintainer who pulled a fork's branch.
  A commit after the freeze reopens the review.

## How approval is recorded

| Context | Default | Why |
|---|---|---|
| One committer, or a pair, reviewing in the conversation; agents never work alone | In the conversation | Everyone who needs the decision is present |
| Several committers, outside contributors, or agents working with no one in the conversation | Recorded on the pull or merge request | Someone not present must see which version was approved |

**In the conversation.**
The gate owner discusses on the request and says in conversation that the review
is closed. Before acting, the agent reads the request's threads,
lists every unresolved one and every requested change the spec
does not carry yet, and proceeds when nothing is open.
Nothing revokes a closing, so before pushing or handing over,
the agent compares the branch tip with the freeze commit and asks again
when they differ.

**Recorded.** The same discussion,
then a person with write access adds an approval label
(`spec:approved` by default).
Automation records the approval with a fingerprint of the spec and design files
at that moment and removes the label when any of them changes afterwards;
the label is then taken again.
A required check fails a ready request that still holds an unfrozen record,
so the merge stays blocked until the freeze.
The skill for the chosen tool installs the label, the fingerprint,
and the check; the section and the contract record them as facts of the project.

## A job that archives or approves

Advise against it and do not put it in the section.
A CI job's own token cannot push to a contributor's fork,
so such a job cannot serve an outside contribution;
on a branch it could reach,
it would be the only automation needing write access to repository contents,
to save one step the implementer already runs.
The section names the implementer
(or a maintainer on a fork's branch) as the executor.
When the user insists, add it to the pending decisions list with this reason
and the recommendation to keep the person as executor.

## Marker text

A project file that should state the approval rules holds
`<!-- harness: spec-workflow -->` once. Write the block for that file
directly after the marker and close it with
`<!-- /harness: spec-workflow -->` on its own line. Reword in the project's
terms; keep the facts.

**Pull or merge request template**, approval in the conversation:

```markdown
Spec: <link to the change's spec on this branch>
Approval: closed in conversation by <gate owner>; tasks written after it.
- [ ] Every scenario run, result recorded under Validation
- [ ] Marked ready with the record open; frozen after the review closed
```

Recorded: the `Approval:`
line becomes "`spec:approved` on the current spec and design;
removed automatically when either changes".

**Project workflow skill, finish step**:

```markdown
When the last task is verified, mark the pull request ready with the
record still open. After <gate owner> closes the review (<in conversation | and
the approval is recorded>), freeze the record on this branch and push. A
commit after the freeze reopens the review: say so and ask again.
```

**Platform knowledge file**:

```markdown
Specification approvals and how they are recorded: `<contract path>`.
Approval: <in conversation | recorded with `spec:approved`>. The
awaiting-archive check is red on a ready pull request until the freeze;
that is the merge block, not a failure.
```

On GitLab every block says "merge request".

Drop the awaiting-archive sentence when approval is conversational,
unless the project runs that check anyway.
When the way approval is recorded changes,
replace each block between marker and end marker and nothing else
in those files.
