# From Conditions to Thickness

Read before saying how much a layer should do for a project,
or when a user disputes a recommendation.
A layer's amount is one of four thicknesses (omitted, light, medium, thick),
recommended from the project's conditions, one layer at a time,
never from a project label and never for the project as a whole.
Every row below is a recommendation for the stated conditions:
the user confirms the thickness, and may choose another.

## The project's conditions

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

## What each thickness is, per layer

Each thickness contains the one before it.
The skill that owns a layer holds the exact content;
this table is for explaining and comparing.

| Layer | Light | Medium | Thick |
| --- | --- | --- | --- |
| Environment | The host or the existing environment as it is; each token and its scope named in a sentence; non-interactive defaults exported by the task runner (`PAGER=cat`, `CI=true`, no prompts, no watch mode) | A dev container shared by people and agents; an environment knowledge file listing tools and what each can reach; hard read-only files kept by convention; network open | A restricted container or VM; hard read-only files on read-only mounts; a deny-by-default network allowlist; a token that cannot write to the default branch |
| Knowledge | One single-file root entrypoint, up to about 200 lines, holding only practice that is not standard, with no knowledge folder | A root entrypoint of about 100 lines, never over 120 (always-on rules first, then a routing table of "when doing X, read Y"), knowledge files behind those routes, project skills for fragile recurring procedures | Medium, plus a machine check failing when a route names a missing path, a knowledge file is unrouted, a documented recipe does not exist, or the entrypoint is over budget |
| Feedback | Two task-runner entries (fast and full) over existing commands, named in the entrypoint, with one sentence on what a human verifies | Fast and full checks, a command that tests one file or module in seconds, recipes to start, check, stop, and smoke-test the system, and a verification knowledge file | Medium, plus driving the running system (requests, browser screenshots, or queryable logs), a read-only clean-context reviewer whose tools the client restricts, a session-start check when unattended, and evidence in pull or merge requests; still non-blocking |
| Gates | Formatting and a secret scan before every commit and in CI; lint, typecheck, and tests deliberately not gated | Light, plus lint, type check, and tests in CI and the full recipe (in the commit hook where they fit the budget), and a checks knowledge file | Medium, plus structure checks for boundaries that matter (every custom check's failure message naming how to fix it), one required summary gate, and an agent-turn hook where supported and unattended |
| Authority | Sentences in the entrypoint's always-on rules: reversible work inside the repository never asks; outward actions are pre-authorised or queued; refusals stop retries; commits are checkpoints, one per verified task, with no AI attribution | Light, plus a written policy with checkpoint rules and a fixed format for queued decisions; on a hosted project also the platform knowledge file, label file, forms, request template, project skill, and convention-kept protections | Medium, plus what a machine refuses: per-client permission files (allow safe, deny destructive, no "ask" entries), refusing checkpoint recipes, a protected default branch with required check and merge method, and a label sync job |
| Completion | One entrypoint entry: behaviour-changing work is agreed in plan mode with the four answers stated in conversation, and the full check ends every task; no contract file or tool | A specification contract in the knowledge base and a specification tool or per-change `SPEC.md`/`PLAN.md` with checkable scenarios, both approvals given in conversation | Medium, plus approval recorded on the pull or merge request (a label a person adds), machine validation of the carrier, and a check blocking the merge until the record is frozen |
| Entropy | One drift sentence in the entrypoint: fix drift in the same change or record it where the next agent finds it | Keep-in-sync section (three dispositions, ruling rule, sync table or sync skills) and a non-blocking harness self-check in a recipe, aggregate check, and CI | Medium, plus the required CI gate depending on the self-check, a dated periodic reclamation routine, and keeping an adopted anchor document in step |

## Which thickness to recommend

| Layer | Light when | Medium when | Thick when | Omitted when |
| --- | --- | --- | --- | --- |
| Environment | A person watches every session and nothing sensitive is reachable | Several people or agents need the same tools, and mistakes are cheap to undo | A wrong change is costly or agents are unattended; or agents read content anyone can write while holding private data and a way to send it out | A watched throwaway on a machine that holds no credential worth protecting |
| Knowledge | Short horizon, one person | Long horizon or several people; weak models or several clients (critical procedures routed explicitly, one entrypoint all clients read) | Maintained for years, or many people and outside contributors rely on the routes | No agent works here beyond one-off questions |
| Feedback | Short horizon, cheap mistakes, a person looks at every result | Anything maintained past a release | Unattended agents, behaviour users see, or a costly wrong change | Nothing can be run; then say what a human verifies |
| Gates | Short horizon with cheap mistakes | A wrong change costs real work to undo, more than one person commits, or the project outlives a release | A wrong change reaches users, data, or money; many people; unattended agents | No agent commits. While one does, the secret scan stays |
| Authority | One watched maintainer | A team, or agents checked between tasks | Unattended agents, many people, or a costly publication | A watched session whose client defaults already ask before every outward action |
| Completion | Anything that outlives a quarter | Unattended or costly work, a long horizon, several people | Approval has to be visible to people outside the conversation | One person, short tasks, discarded within a quarter: a plan agreed in conversation is enough |
| Entropy | One person, kept longer than a quarter | Maintained past a release, or others rely on the conventions | Maintained for years, a costly wrong change, or unattended agents | Discarded within a quarter: the project ends before it rots |

Environment, Knowledge, Feedback, Gates, and Authority always get a decision;
"omitted, because …" is a legitimate one for any layer.
When two conditions point to different thicknesses for one layer,
recommend the thicker and name both conditions.

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
and say so in the layer's decision.

- A research repository with a data pipeline that must not break:
  Gates and Entropy take the engineering column for the pipeline;
  the rest stays exploratory.
- An `experiments/` directory inside a production repository: the reverse.
- A production project with one maintainer who watches every session:
  Knowledge and Authority get thinner; Gates do not.

## Too much is also a defect

A constraint that no longer catches anything still costs:
it slows the agent and teaches it to work around gates.
A layer shrinks when what its constraint caught no longer occurs
(the module is gone, the migration is finished, a stronger check covers it),
and only on that evidence;
"nobody remembers why it exists" is a question for the user, not evidence.
