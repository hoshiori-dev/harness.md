# Fitness

Read before recording the project's conditions and each layer's observed
thickness (sections 1 and 2), and again when the builders' findings are in,
before giving each layer a verdict (sections 3 to 5).
Drift asks whether the harness agrees with itself and the code.
Fitness asks whether it is right for the project as it is today:
a harness can be consistent and still too thin or too heavy,
because the project's conditions moved since it was built.

Thickness words used below: **omitted** (nothing is built),
**light** (one sentence or one entry),
**medium** (a dedicated file or configuration kept by convention),
**thick** (enforced by a machine).

## 1. The project's conditions today

Find each condition in the repository; where the repository does not
show it, record "not shown" and leave it for the first decision round.
Never guess a condition and never take a label
("prototype", "production") as one.

| Condition | Where it shows | Signs it has moved |
| --- | --- | --- |
| What a wrong change costs | deploy pipeline, user data, payments, dependants | the project gained or lost one of these |
| How long the project is maintained | age of the history, release tags | a prototype still alive past its stated life; a product being retired |
| Who relies on its conventions | authors in the history, a CONTRIBUTING file, outside requests | new authors, outside contributors |
| How unattended agents are | workflows that start agents on issues or schedules | longer sessions between human checks |
| Hosting platform | the remote | the remote changed |
| Clients and the weakest model | client configuration files | configuration for a client nothing else names |

With an anchor document, compare each condition with what its context says:
a condition that moved is a finding against the document,
severity medium, high when it moved toward more risk
(costlier changes, less supervision, input anyone can write).
Every decision that rests on the old condition is then in question.

## 2. Observed thickness

State what is observed as observed.

| Layer | Light | Medium | Thick |
| --- | --- | --- | --- |
| Environment | runs on the host with each token named and non-interactive defaults exported | a shared dev container, an environment knowledge file, hard read-only kept by convention, open network | restricted container or VM, deny-by-default network allowlist, guard files on read-only mounts, default-branch write restricted |
| Knowledge | one single-file root entrypoint up to about 200 lines | root entrypoint of about 100 lines with routing table, knowledge files behind routes, skills folder | medium, with entrypoint size, routes, and links checked by a machine |
| Feedback | fast and full checks as task-runner entries named in the entrypoint, with what a human verifies | scoped test command returning in seconds, start/check/stop/smoke recipes, verification knowledge file | medium, plus a browser or device driver with screenshots (or queryable logs), clean-context read-only reviewer, session-start check, evidence in pull or merge requests |
| Gates | formatting and a secret scan in commit hook and CI | lint, type check, and tests added in CI, full recipe, and hook within budget, plus checks knowledge file | medium, plus structure checks, one required summary gate, and an agent-turn hook |
| Authority | entrypoint always-on rules only (action classes, pre-authorisations, refusals, commits and attribution) | light, plus written policy with checkpoint/commit rules; on a hosted remote also platform docs, label file, forms, template, skill, convention-kept protections | medium, plus machine-refusing client permission files, refusing checkpoint recipes, and enforced remote protections, required check, and label sync |
| Completion | one entrypoint entry: agree goal and four answers in plan mode and run full check at task end | specification contract and specification tool or per-change `SPEC.md`/`PLAN.md` with scenarios, conversational approval | medium, plus approval recorded by label on the pull or merge request, machine validation, and a merge-blocking archive check |
| Entropy | one drift sentence in the entrypoint | keep-in-sync section (dispositions, ruling rule, sync table or sync skills) and non-blocking self-check in recipe and CI | medium, plus required CI gate depending on self-check and a dated reclamation routine |

Nothing at all is omitted.

## 3. Too little

A layer does too little when the conditions call for more than exists.
Each gap is a **missing** finding whose evidence is the condition
(where it shows) plus what is absent.

| Condition | Expect at least |
| --- | --- |
| A wrong change loses data, causes an outage, or is a security incident | type check, lint, and tests gating every merge; an isolated environment; guard files agents cannot edit |
| Agents work unattended for hours | irreversible and outward actions authorised in advance, never allowed by a permission entry; a format for queued decisions; a definition of done a machine can check; feedback the agent can run itself |
| Agents are triggered by content anyone can write, and hold private data and a way to send it out | real isolation: a restricted token, a network allow list, a container or VM |
| Many people or outside contributors rely on the conventions | conventions as checks, a protected default branch, required checks |
| Maintained for years | a harness self-check, sync rules in both directions, a periodic clean-up |
| Any project agents commit to | a secret scan on every commit; a fast, scoped test command |

When the condition behind a gap is "not shown", report the gap as depending
on that condition, not as a finding.

## 4. Too much

Excess never fails; it makes agents slower and more cautious
and teaches them to work around gates.
The trigger is "what this constraint catches no longer occurs".

Candidates:

- a lint rule or custom check for a problem fixed long ago;
- a skill written for a migration that has finished;
- a route for a module that was removed;
- the full test suite in a pre-commit hook, where a slow hook gets bypassed;
- entrypoint content loaded on every task that applies to rare tasks
  (move it behind a route instead of deleting it);
- an entrypoint over its budget, or one that restates what the code states;
- "ask" permission entries that fire many times a day;
- a layer doing more than the conditions support:
  a spec framework for a one-person throwaway,
  CI structure checks for a project discarded within a quarter.

Each is an **excessive** finding only with its three pieces of evidence:
the constraint, what it caught, and why that no longer occurs.
Without them, list it under questions for the user.

## 5. Verdict per layer

One line per layer: `fits`, `too little`, or `too much`,
the observed thickness, and the condition or evidence behind the verdict.
A layer can be both in different parts of the repository; say which part.
A verdict proposes nothing by itself:
the thickness a layer should have is settled with the user in the rounds.
