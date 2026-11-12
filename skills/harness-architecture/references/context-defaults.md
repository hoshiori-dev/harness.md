# From Context to Defaults

Read before saying how much a layer should do for a project,
or when a user disputes a default.
A layer's amount is set from the project's Context, one layer at a time,
never from a project label and never for the project as a whole.

## The Context conditions

| Condition | Typical values | Layers it moves most |
| --- | --- | --- |
| Cost of a wrong change | nothing beyond a revert; a day of cleanup; data loss, an outage, or a security incident | Gates, Environment |
| Maintenance horizon | discarded within a quarter; a year or two; maintained for years | Entropy, Knowledge |
| Who relies on the conventions | one person; a small team; many people or outside contributors | Gates, Knowledge, Authority |
| How unattended agents are | watched in every session; checked between tasks; unattended for hours; triggered by content anyone can write | Authority, Completion, Feedback, Environment |
| Hosting platform | GitHub, GitLab, another host, none | Authority (the platform half), Gates (CI) |
| Clients and weakest model | one client or several; the least capable model that will work here | Knowledge, Authority (permission files) |

An existing isolated environment (a dev container,
a disposable VM) is a fact about the project, observed,
and it works in the other direction:
stronger isolation allows a wider allow list and lighter gates,
because the environment absorbs the mistake.

## Defaults per layer

Each row gives the default when nothing in the Context pushes the layer,
then what pushes it up and what lets it shrink.
"Nothing, because …" is a legitimate design for any layer.

| Layer | Default | Does more when | Does less when |
| --- | --- | --- | --- |
| Environment | Commands never wait for input (`PAGER=cat`, no prompts, no watch mode); credentials limited to scoped tokens; the tools an agent is expected to use are listed with what each can reach | A wrong change is costly or agents are unattended: container or VM isolation, security files the agent cannot edit. Agents read content anyone can write while holding private data and a way to send it out: a network allow list and a restricted token | A person watches every session and nothing sensitive is reachable: the host with scoped tokens |
| Knowledge | One root entrypoint of about 100 lines: the rules that hold on every task first, then a table of "when doing X, read Y". Only practice that is not standard is written down | Long horizon or many people: knowledge files behind routes, an architecture note for what the tree cannot show, project skills for fragile recurring procedures. Weak models or several clients: critical procedures routed explicitly, one entrypoint all clients read | Short horizon, one person: the entrypoint alone, up to about 200 lines |
| Feedback | One command that tests a single file or module in seconds, one that runs everything, and a way to start the system and see what it did | Unattended agents or user-facing behaviour: the agent can drive the running system (requests, a browser, a simulator) and read structured logs; a costly change gets a dry run or a staging target | A throwaway: a smoke run that shows it starts |
| Gates | Formatting and a secret scan before every commit | Costly changes, long horizon, or many people: lint, type check, and fast tests before commit, the full suite in CI behind one required aggregate check, structure checks for boundaries that matter. Every custom check's failure message says how to fix it | Short horizon with cheap mistakes: the secret scan and a smoke check |
| Authority | Reversible work inside the repository never asks; irreversible or outward actions (push, publish, comment, release, remote settings, deletion) are pre-authorised in the plan or queued for the user. Allow the known safe, deny the known destructive, no "ask" entries. Commits are checkpoints, one per verified task, with no AI attribution. On a hosted project: short-lived branches off the default branch, squash merges, a minimal set of labels and templates | Unattended agents: a written policy, a fixed format for queued decisions, tokens scoped so the platform enforces what the policy says. Many people: a protected default branch with required checks | One watched maintainer: a few allow and deny entries and the client's defaults |
| Completion | The goal and the non-goals are agreed before work starts; done means the checks pass and the stated acceptance was observed | Unattended or costly work: a spec carrier with scenarios a reader can judge without the code, approval recorded where others can see it. Long horizon: specs kept for the parts under change, never back-filled for code nobody touches | One person, short tasks: a plan agreed in conversation; or the section is left out |
| Entropy | Sync rules in the entrypoint that name their trigger in both directions, and a place where an agent records a contradiction it finds | Long horizon or many people: a harness self-check in CI (links resolve, documented commands exist, budgets hold), a periodic clean-up, `HARNESS.md` kept in step with the artifacts | Discarded within a quarter: the section is left out, because the project ends before it rots |

## Two common combinations

Start from the closer column,
then adjust each layer where its conditions differ from the project's.

| Layer | Exploratory (demo, experiment, early prototype) | Engineering (production system, shared main line) |
| --- | --- | --- |
| Environment | Secrets kept out, a basic sandbox, open network | Container or VM, security files locked, a decision on where session logs go |
| Knowledge | Outside API and domain notes, quick-start commands, few style rules | Layout, layer boundaries, procedures, sync rules, behind routes |
| Feedback | Run it and look | Scoped tests in seconds, a drivable running system, readable logs |
| Gates | Secret scan and a "does it run" check | Type check, lint, tests, hooks, a required CI check |
| Authority | Wide allow list, a person judges the result, one branch per attempt | Written policy, pre-authorised irreversible actions, queued decisions |
| Completion | Agree the intent and the effect wanted | Scenarios for every requirement, recorded approval |
| Entropy | Left out, or one sync reminder | Self-check in CI, one source per fact, periodic clean-up |

## Adjusting per area

Ask of each layer: do the cost of a wrong change, the horizon,
and the unattended time in this part of the repository match
the project's overall values? Where one differs,
set the layer for that area in the direction the condition pushes,
and say so in the layer's section.

- A research repository with a data pipeline that must not break:
  Gates and Entropy take the engineering column for the pipeline;
  the rest stays exploratory.
- An `experiments/` directory inside a production repository: the reverse.
- A production project with one maintainer who watches every session:
  Knowledge and Authority shrink; Gates do not.

## Too much is also a defect

A constraint that no longer catches anything still costs:
it slows the agent and teaches it to work around gates.
A layer shrinks when what its constraint caught no longer occurs
(the module is gone, the migration is finished, a stronger check covers it),
and only on that evidence;
"nobody remembers why it exists" is a question for the user, not evidence.
