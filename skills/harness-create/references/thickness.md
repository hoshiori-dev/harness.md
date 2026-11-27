# Thickness Per Layer

Read before proposing a thickness in step 4,
or when the user disputes one.
A thickness is set per layer, never for the project:
real projects are mixed, and one setting for the whole project
is wrong in some part of it.

## The four words

- **omitted**: nothing is built for the layer.
- **light**: one sentence or one entry.
- **medium**: a dedicated file or configuration, kept by convention.
- **thick**: enforced by a machine.

State this definition wherever the words are shown to the user.
Write none of the four words into a file of the project.

## How to propose

1. Take the builder's recommended thickness and its reasons.
2. Check it against the layer's table below and the settled conditions.
   Where the two disagree, show both and the condition that decides,
   and recommend the one the conditions select.
3. State what exists now. A layer the project already realises
   at some thickness starts there: the plan builds only the difference,
   and thinning what works is a suggestion for a separate change.
4. Start thin where the conditions leave a choice.
   A layer does more when the friction agents actually hit calls for it;
   a layer no condition demands stays omitted or light.
5. Where a non-goal constrains a layer ("no changes to CI"),
   the row names the non-goal as the reason.

## The layers

### Environment

Where the agent runs and what it can reach.

| Thickness | What it means here | Conditions that select it |
| --- | --- | --- |
| omitted | nothing built: agents run where the session already runs, with what it already holds | a short-lived project with nothing sensitive in reach where, in addition, no exposure was observed |
| light | the host or existing environment as it is; each token and its scopes named in one entrypoint sentence; non-interactive variables exported by the task runner | a short-lived project with nothing sensitive in reach |
| medium | a declared dev container (the same file for people and agents), an environment knowledge file, hard read-only files kept by convention, and the network open | a person reviews each result while the agent holds credentials or mistakes are costly to undo; a container is already in use |
| thick | a restricted container or VM, a deny-by-default network allowlist, hard read-only files on read-only mounts, and a token that cannot write to the default branch | no person reviews each result (agents unattended, or started by content anyone can write); a wrong change reaches production, customer data, or money |

### Knowledge

The entrypoint, the knowledge files read on demand, and the routes between them.

| Thickness | What it means here | Conditions that select it |
| --- | --- | --- |
| omitted | no entrypoint and no knowledge files; agents work from the code and human docs | only when nothing needs stating that an agent cannot infer and every other layer is omitted; any other layer needs a place for its one sentence, so recommend light at least |
| light | a single-file harness: one root `AGENTS.md` alone, up to about 200 lines, no knowledge folder; any client-specific file only imports it | one maintainer, a short horizon, watched sessions, little non-standard practice |
| medium | a root `AGENTS.md` of about 100 lines, never over 120, with a routing table, knowledge files loaded on demand, and a skills folder | maintained for a year or more; several people; procedures an agent cannot infer from the code |
| thick | the same, with a check that fails when a route's path is missing, a knowledge file is unrouted, a named recipe does not exist, or the entrypoint is over budget; requires Entropy and Gates not to be omitted | maintained for years; many people or outside contributors; unattended agents; a costly wrong change |

### Feedback

What an agent can run and observe to verify its own work.

| Thickness | What it means here | Conditions that select it |
| --- | --- | --- |
| omitted | nothing built; the closing report says nothing can be run and lists what a human verifies | a repository with nothing executable |
| light | the fast and full checks as two task-runner entries over existing commands, named in the entrypoint, with one sentence on what a human verifies; no knowledge file | discarded within weeks |
| medium | the fast and full checks, a scoped test returning in seconds, recipes that start, check, stop, and smoke-test the system, and a verification knowledge file routed from the entrypoint | everything else: kept beyond weeks, a wrong change cheap to undo, and agents attended |
| thick | medium, plus a browser- or device-driving tool with screenshots for an interface (or queryable logs and smoke requests for a service), a read-only clean-context reviewer whose tools the client restricts, a session-start check where agents run unattended, and evidence in the pull or merge request text; still nothing that blocks | kept beyond weeks, and agents unattended or a wrong change costs real work to undo |

### Gates

What blocks a defect whether or not the agent looked.

| Thickness | What it means here | Conditions that select it |
| --- | --- | --- |
| omitted | no hook and no CI check | only when no agent commits; while any agent commits, the secret scan stays, so challenge once and keep at least light |
| light | formatter and secret scan in the commit hook and in CI where a platform exists; lint, typecheck, and tests are deliberately not gated | a wrong change costs a revert; thrown away; one maintainer |
| medium | light, plus lint, typecheck, and tests: all in CI and the full recipe, in the hook where they fit the budget, and a checks knowledge file; nothing requires the result | a wrong change costs real work to undo; more than one person; maintained past one release cycle |
| thick | medium, plus structure checks for enforceable rules, a summary gate proposed as the one required check, and an agent-turn hook running the fast recipe where agents run unattended on a client that supports it | a wrong change reaches production, customers, or money; agents unattended; protected default branch; more than one person merges |

### Authority

What an agent may do without asking, and the platform lifecycle
(commits, branches, merge method, labels, templates, releases).

| Thickness | What it means here | Conditions that select it |
| --- | --- | --- |
| omitted | nothing built; agents act under each client's own defaults | only when no agent can write to the repository or its remote |
| light | the core sentences in the entrypoint's always-on rules (reversibility classes, standing pre-authorisations, refusals, commit convention and attribution), nothing else | a throwaway project |
| medium | light, plus a written policy file with checkpoint and commit rules; on a hosted remote also the platform knowledge file, label file, forms, request template, project skill, and a settings register whose protections are conventions with named owners | a kept repository where nothing can enforce the rules: no client in use has a permission file this layer generates, and the platform plan cannot enforce branch rules |
| thick | medium, plus what a machine refuses: per-client permission files (allow and deny entries, no "ask" entries), refusing checkpoint recipes, and on a hosted remote the merge-method setting, default-branch protection, required check, and label sync job | a repository that is kept and agents commit to; unattended agents; many people or outside contributors; a costly wrong change |

A strongly isolated environment allows a wider allow list at any thickness.

### Completion

How a change is agreed before work and how done is decided.

| Thickness | What it means here | Conditions that select it |
| --- | --- | --- |
| omitted | nothing; plan mode aligns the goal and the Feedback and Gates checks define done | watched sessions, cheap wrong changes, and discarded within a quarter |
| light | one entrypoint entry: behaviour-changing work is agreed in plan mode with the four answers stated in the conversation, and the full check ends every task; no contract file or tool | one maintainer present in every conversation, no change outlasts one session, and no specification tool in use |
| medium | a specification contract in the knowledge base and a specification tool or per-change `SPEC.md`/`PLAN.md` with checkable scenarios, both approvals given in conversation and kept by convention | everything else: maintained past one release; a costly wrong change; a specification tool already in use |
| thick | the same contract, with approval recorded on the pull or merge request (a label a person adds), machine validation of the carrier, and a check blocking the merge until the record is frozen | several committers; outside contributors; agents working with no one in the conversation |

### Entropy

What keeps the harness true to the code.

| Thickness | What it means here | Conditions that select it |
| --- | --- | --- |
| omitted | nothing | discarded within a quarter, and nobody besides the author relies on its conventions |
| light | one drift sentence in the entrypoint; no table, self-check, or routine | one person, no release in sight, kept longer than a quarter |
| medium | a keep-in-sync section (three dispositions, ruling rule, sync table or sync skills) and a self-check in a recipe, aggregate check, and CI without blocking a merge; no reclamation | maintained past one release, or anyone besides the author relies on its conventions, while a wrong change is cheap |
| thick | medium, plus the required CI gate depending on the self-check, a dated periodic reclamation routine, and keeping an adopted anchor document in step | maintained for years or a heavy harness; a wrong change is costly, or agents work unattended |

## Labels are evidence

A label ("a research repo", "production", "just a prototype")
is evidence for the conditions and never a thickness.
When the user offers one as a thickness ("keep everything light"):

1. Say which conditions the label suggests and show them as inferences.
2. Propose a thickness per layer from the conditions.
3. Before accepting light or omitted for a layer that guards something
   costly (the data of a research repository, a published package,
   credentials), ask what a wrong change to that thing costs.
4. Adopt the user's answer. Challenge once when the evidence contradicts it.

Typical mixes, as a check on a proposal and never as a preset:

- A research repository with a data pipeline that must not break:
  Gates and Entropy follow the pipeline's cost and horizon; the rest is light.
- An `experiments/` directory inside a production repository: the reverse;
  the layer's decisions exempt the directory by name.
- A production project with one maintainer who watches every session:
  Knowledge and Authority one step thinner than the cost alone suggests;
  Gates unchanged.
- A prototype discarded within a quarter: Entropy omitted, Completion omitted
  or light, Gates light.

## Dependencies between layers

Show these when a change the user makes triggers one:

- Knowledge omitted leaves no entrypoint:
  every other layer's one sentence and every route has no place.
- Entropy omitted: no check holds the entrypoint's size, routes, or links,
  so Knowledge cannot be thick, and no update table is kept.
- Gates omitted: Knowledge, Completion, and Entropy cannot be thick,
  because nothing runs or requires their validation.
- Environment thick allows Authority a wider allow list;
  Environment omitted or light with unattended agents needs Authority
  at medium or above.
- No hosting platform: Gates has no CI part
  and Authority no platform part, whatever their thickness.
