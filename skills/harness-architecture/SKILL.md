---
name: harness-architecture
description: >-
  Harness methodology manual: explains why an agent harness has the layers it
  has, where a rule or fact for coding agents belongs, how a project's
  context sets how much each layer does, and how several agents share one
  repository. Use when asked why agents ignore an entrypoint; whether a
  project needs CI, hooks, a sandbox, or specs; where a rule, procedure, or
  fact should live (entrypoint, knowledge file, project skill, hook, check,
  type); whether two copies of a fact may coexist; which HARNESS.md section
  covers a topic; or how parallel agents split worktrees and platform writes.
  Not for building or restructuring harness files.
license: Apache-2.0
---

# Harness Architecture

The method behind every harness layer, for an agent that answers questions
about a harness without changing it. A harness is everything between the
model, the codebase, and the development environment that makes an agent's
work in a project possible and safe. Its design is recorded in the project's
`HARNESS.md`; this skill explains, places, adjudicates, and hands off. It
writes no file and performs no build.

## Rules on every step

- Answer from the method and give the reason with the rule; a rule without
  its reason is not applied correctly to the next case.
- Trace every trade-off to the project's Context, never to a label such as
  "prototype" or "production". The Context conditions are: what a wrong
  change costs, how long the project will be maintained, who relies on its
  conventions, how unattended agents are, the hosting platform, and the
  clients and weakest model in use.
- Settle from the repository what it can show; ask for what it cannot,
  before a recommendation depends on it. Assume no client behaviour:
  clients differ in what they load and when.
- Give one recommendation per decision, with the alternatives in a sentence
  each.
- Change no file. When the question becomes a build, hand off (step 4).
- One agent at a time is the default. Raise worktrees, branch ownership,
  and coordinators only when the user describes or asks about several
  agents working at once.

## Workflow

### 1. Classify the question

Pick the branch: **reasoning** (why a practice holds, whether it applies
here), **placement** (where a rule, fact, or procedure lives),
**duplication** (one fact in several places, or the design and the code
disagreeing), **amount** (how much a layer should do for this project),
**concurrency** (several agents at once), **lookup or build** (which layer
or `HARNESS.md` section covers a topic; "set that up for us"). A request to
create, move, split, restructure, or audit files is a build, not a
question.

Done when: one branch is named.

### 2. Gather the facts the answer depends on

Read what the repository shows: `HARNESS.md` when present, entrypoints,
knowledge files, project skills, task-runner recipes, checks, client
configuration. Take the Context from `HARNESS.md` when the file has one
that describes this project; otherwise ask only for the conditions the
answer turns on.

Done when: every fact the recommendation rests on is observed or confirmed
by the user.

### 3. Answer within the branch

Every branch rests on this core.

**Two duties.** A harness narrows what an agent will do (soft boundaries
shift its output, hard boundaries cut it) and widens what it can do
(private context and tools reach answers it could not reach alone). Every
boundary that narrows also suppresses the rare better solution, so each
layer is set on its own, from the Context.

**Seven layers, each answering one question.** Environment: where the agent
runs, which tools it holds, what it can reach. Knowledge: how it learns the
project and what it reads when. Feedback: what it can run and observe to
verify its own work. Gates: which deterministic checks stop a defect
whether or not the agent looked. Authority: what it may do directly, what
needs a human, and how it commits, branches, merges, and releases.
Completion: how the goal is agreed before work starts and what counts as
done. Entropy: how the harness stays consistent with the code. Knowledge,
Feedback, Gates, and Authority are the smallest loop an agent can work in;
Environment is the safety partner of Authority. Those five are always
designed, even when the design is "nothing, because …".

**Thin by evidence.** Context an agent does not need dilutes its attention
and costs every task; context it lacks makes it guess. Write down only what
the code cannot say and what a capable newcomer would get wrong: practice
that is not standard. A root entrypoint holds about 100 lines, about 200
only when it is the whole harness of a small project. A stale or
contradictory harness is worse than none, because the agent trusts it.

**Two sources.** Design intent comes from `HARNESS.md`; facts come from the
code. An artifact that disagrees with the design is fixed, or the design is
changed first. `HARNESS.md` is not an entrypoint: agents open it only to
build, check, or change the harness, so it may be as long as it needs to
be.

Then, by branch:

- **Reasoning**: read [references/layers.md](references/layers.md) when the
  question is about what a layer is for, what breaks without it, or which
  of two layers owns a topic. Read
  [references/evidence.md](references/evidence.md) when the user doubts a
  practice or asks what it is based on; cite only what that file states.
- **Placement**: before recommending any home for a rule, fact, or
  procedure, read [references/placement.md](references/placement.md) when
  the question is where content belongs or how it loads. Classify the
  content by when the agent needs it, recommend one home, and add the
  client caveat when the home depends on the client. When the material is
  an entrypoint, end with its line count against the budget.
- **Duplication**: read
  [references/source-of-truth.md](references/source-of-truth.md) before
  answering; name the one source, the adjudication rule, and both sync
  directions.
- **Amount**: read
  [references/context-defaults.md](references/context-defaults.md) before
  saying how much a layer should do; state the Context conditions that move
  the answer and the default for each affected layer.
- **Concurrency**: read
  [references/multi-agent.md](references/multi-agent.md) before answering;
  give the workspace, shared-resource, remote-state, and merge rules.
- **Lookup**: read [references/layers.md](references/layers.md) when asked
  which layer or section covers a topic; name the section and the layer.

Done when: every decision has exactly one recommendation with its reason,
and every placement names one home.

### 4. Close or hand off

A question that turns into a build ends here. Name the layer and the
`HARNESS.md` section that own the work, and say which of the plugin's
user-invoked workflows the user should start: the one that designs or
revises `HARNESS.md` (the design changes), the one that builds a harness
from `HARNESS.md` (the design stands and the files must follow), the one
that audits (something is wrong and the cause is unknown), or the one that
extracts (a harness exists and no `HARNESS.md` describes it). State that a
design is approved before any file is written. Create nothing.

Done when: no file in the project has changed and the user knows the next
step and who performs it.

## Gotchas

- A label is not a condition. "It is only a prototype" says nothing about
  what a wrong change costs; a research repository's data pipeline can be
  the most expensive thing to break in the organisation.
- Different parts of one repository can deserve different treatment (an
  `experiments/` directory in a production repository). The layer's section
  says so; the project does not get one setting.
- An entrypoint that copies the directory tree is wrong the day a directory
  moves; the file system already states it.
- "Agents ignore our entrypoint" is usually a file over budget or a rule
  that should be a check, not a rule that needs stronger wording.
