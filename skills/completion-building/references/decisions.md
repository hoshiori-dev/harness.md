# Completion Decisions

Read when running step 2 (decide mode) or auditing without an anchor document:
this file holds the layer's thickness table and all ten decisions.

## Thickness

What this layer is at each thickness:

| Thickness | What the project has |
|---|---|
| omitted | Nothing. The client's plan mode aligns the goal; the checks of the Feedback and Gates layers define done. |
| light | One entrypoint entry: a change that alters behaviour is agreed in plan mode with the four answers of decision 6 stated in the conversation, and the full check ends every task. No contract file, no tool. |
| medium | A specification contract in the knowledge base and a specification tool or per-change documents, with both approvals given in the conversation and kept by convention. |
| thick | The same contract, with approval recorded on the pull or merge request: a label a person adds and a check that blocks the merge until the record is frozen. |

Conditions that push it thinner: the project will be thrown away
within about a quarter; one person is in the conversation for every task;
a wrong change is cheap; no change outlasts one session.
Conditions that push it thicker: the project is maintained past one release;
several committers or outside contributors; agents work with no one
in the conversation; a wrong change is costly;
a specification tool is already in use (never below medium while it stays).

Recommend exactly one, first match wins, and give the conditions as the reason:

1. Thrown away within about a quarter, one person in the conversation
   for every task, and a wrong change cheap: omitted.
2. Several committers, outside contributors,
   or agents working with no one in the conversation: thick.
3. One person in the conversation for every task, no specification tool in use,
   and no change that outlasts one session: light.
4. Anything else: medium.

When the handover carries a settled thickness, return the decisions that
thickness leaves and do not re-decide it;
when the conditions select another, say so once with the evidence.
Omitted leaves no decision below. Light leaves decisions 6, 7, 8, and 9;
the others fall away with the contract.

## The ten decisions

Each row gives the recommendation and the condition that selects it;
the reason follows "because" or is the condition itself.

| # | Decision | Recommendation, and the condition that selects it |
|---|---|---|
| 1 | How long a spec lives | Maintained past one release: specs stay the living description of the system and every change updates them, because the next change starts from them. Otherwise a spec builds one change and is archived with it. |
| 2 | The specification tool | First match wins. A tool already in use: keep it. One maintainer and a small repository: a `SPEC.md`/`PLAN.md` committed with each change, plan mode for a one-file change. Existing code: OpenSpec. An application built from zero feature by feature: Spec-Kit. Anything else: OpenSpec. |
| 3 | The two approvals | Always two, never one per step: the spec (and its design when one is warranted) before any task list is written; the finished work before the record is frozen. Each has a named owner, a role or a person. |
| 4 | How approval is recorded | In the conversation when one committer or a pair reviews there and agents never work alone. On the pull or merge request (a label a person adds, removed when the spec changes, and a check that blocks the merge until the record is frozen) when there are several committers, outside contributors, or agents working with no one in the conversation. |
| 5 | Changes that carry no spec | Changes to the project's own harness, tooling, checks, workflows, and documents. |
| 6 | What every spec answers | Fixed: four answers and four rules. Read [completion-boundary.md](completion-boundary.md) when stating them, and state all eight in full. |
| 7 | Checks while working | The scoped check after every edit and the full check at the end of every task, both taken from the agreed decisions of the Feedback and Gates layers or found in step 1. Never invent a command; a missing scoped check is named to the layer that owns Feedback. |
| 8 | Exploration and progress | Exploratory worktrees and branches are removed when their evaluation ends; progress lives in the tool's task list, with no separate diary. |
| 9 | Handoff notes | `.agents/handoff/`, gitignored, because such notes carry logs and credentials more often than code does. The alternative is the system temporary directory. |
| 10 | Requirements written elsewhere, and specs that contradict the code | Each restating document becomes a pointer to the spec. For each contradicting spec the user decides which side is right. |

Read [carrier-choice.md](carrier-choice.md) when the tool in use does not fit the project's shape or is none of the three.
Read [approval-gates.md](approval-gates.md) when stating decisions 3 and 4 or when the user wants a job that approves or archives.

## How each decision is returned

- **Settled**, with its evidence, when the repository or the handover
  settles it (a tool directory the inventory lists, a check command
  that exists, a condition the handover states) or when the evidence
  makes one option clearly better. The evidence is a path, a command's output,
  or the condition quoted.
- **Open** otherwise: the options with the recommended one first,
  the reason, and the decisions it depends on.
  Decision 2 depends on the thickness and on decision 1;
  decision 4 on the thickness and on decision 3;
  the form decision 6 takes (the tool's files or five headings) on decision 2.
- Decision 6 is always settled: it holds whatever the tool.
- An approval owner is settled only when the handover or a project file
  names the person or role; otherwise it is open,
  with the roles the repository shows as options.
- A spec that contradicts the code is always open, with three options
  and one recommendation; no settled decision rules on it.
  Read [spec-drift.md](spec-drift.md) when returning one.
- Handed over by an entry, ask the user nothing:
  everything unsettled goes back as open.
