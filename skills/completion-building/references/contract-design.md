# Designing the Contract

Read when reworking the contract asset into the project's specification
workflow knowledge file, when the section changes one value a deposited
contract records, and when a later run fills an item the contract left
pending.

The contract is the Completion section turned into the file agents read
before a behaviour change. The section says what was decided and why; the
contract says what to do. It repeats no reasoning and adds no decision.

## One source of truth per fact

| Fact | Rules | Points to it, never restates |
|---|---|---|
| What the system does | The specs (living specs when they stay the description of the system) | Entrypoint, knowledge base, issue and request bodies |
| Acceptance of one change | That change's scenarios | The request body, the issue |
| Engineering principles the tool reads (constitution, steering) | The tool's file | The entrypoint |
| How specs are written, approved, and frozen | The contract | Entrypoint, request template, project workflow skill |
| Why the workflow is shaped this way | The Completion section of `HARNESS.md`, when the project keeps the file | The contract never restates the reasons |
| Conventions and mechanics | The knowledge base | Specs never restate them |

A pointing file may summarise in one line and must link. A tool-owned file
(constitution, spec directory, change record) keeps the tool's format; never
rewrite it into harness style.

## Part by part

- **Read condition** (first line): "Read before starting a change that
  alters behaviour, before writing or approving a spec, and before
  freezing a record."
- **Lifetime and tool**: one sentence each with the fact that decided it,
  in the project's words ("maintained for years", "existing code").
- **Where a spec goes**: the path the tool uses, verified in the tree; for
  per-change documents, where `SPEC.md`/`PLAN.md` live and when plan mode
  suffices.
- **What a spec contains**: the four answers and four rules; for per-change
  documents, the five headings that hold them (`completion-boundary.md`,
  Per tool).
- **Approval**: both approvals, who owns each (a role or a name, never "the
  team"), how each is recorded, when tasks are written, who freezes, what a
  commit after the freeze means.
- **Scope**: specs cover behaviour a change touches; a change to the
  project's own harness, tooling, checks, workflows, or documents carries
  no spec. Name the tool's marker for such a change only when the project
  records one; name the covering harness self-check only when the project
  has one; otherwise state the rule alone. Untouched code is described by
  the codebase map, which is not normative.
- **Not yet authoritative**: each spec whose contradiction is still open,
  with "trust the code over this spec until it is fixed".
- **Checks**: the scoped command as the check after every edit, the full
  run as the task-end check.
- **Exploration**: an exploratory worktree or branch is removed as soon as
  its evaluation ends; keep the chosen attempt, delete the rest.
- **Handoff notes**: the location and the rule that such files never enter
  version control, because they carry logs, environment values, and
  credentials more often than code does. For the temporary-directory
  choice, the same rule with that location.
- **Progress**: when a framework tracks tasks, use its task list; no
  separate progress diary.
- **Update this file when**: the tool is upgraded or replaced, the lifetime
  of specs or the way approval is recorded changes, an approval owner
  changes, a second copy of any fact above appears (merge it back), or a
  check command changes.

## Vocabulary check

After writing, search the contract for each word this skill keeps to itself
(`carrier`, `layer`, `level`, `first gate`, `second gate`), for the bare
noun `request` (write the platform's "pull request" or "merge request"),
and for any specification-tool command line. Replace each hit with the
project's noun or delete it. Tool names and the project's own check
commands stay: they are facts of the project.

## Changing one recorded value

When the section changes a value, update every passage of the contract that
depends on it, then refresh every marker block that states it
(`approval-gates.md`, Marker text). For a change in how approval is
recorded that is the `Approval is given` line and the whole paragraph after
the two numbered approvals: recorded names the `spec:approved` label, the
fingerprint that removes it, and the awaiting-archive check; conversational
names the branch-tip comparison with the freeze commit. Leave every line
that does not depend on the value, in the contract and in the marker files,
unchanged.

## Filling a pending item

When an observed fact settles an item the contract left pending (a harness
self-check now exists, a scoped check was added, markers now exist), write
it into its part (Scope, Checks) as the first deposit would have, refresh
any marker block it affects, and drop it from the pending list. Ask nothing.
