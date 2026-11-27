---
name: environment-building
description: >-
  Owns the Environment layer of an agent harness (where a coding agent runs,
  the tools and credentials it holds, what it can reach); use when a harness
  entry hands the layer over or an agent's sandbox, tools, or reach is in
  question.
license: Apache-2.0
---

# Environment Building

Client rules are aids an agent that runs code can write around;
the boundary that holds is the environment it runs
in and the credentials it carries.
This skill returns the decisions about that environment,
describes or audits the one a project has,
and realises the decisions the user agreed to:
where the agent runs, what it holds and can reach,
which tools it is given, which files it must not change,
and the settings that keep every command non-interactive.

## Rules on every step

<!-- shared:layer-modes -->
Four modes, named by the entry or inferred from the request.
**decide**: return a recommended thickness with reasons and this layer's decisions,
settled (with evidence) or open (options, recommended first, reason, dependencies);
write nothing, and ask nothing under an entry.
**describe**: return present state as prose for `HARNESS.md`,
inferred intent marked; write nothing.
**build**: realise agreed decisions in the plan's files for this layer;
"plan only" stops after step 1 returning files to create, change, or delete.
**audit**: report findings; write nothing.
Never re-ask what a handover carries
(goal, non-goals, conditions, all thicknesses, agreed decisions, planned files,
go-aheads given for this layer's deletions, wider permissions, remote changes).
Run directly, show what evidence settles,
ask the rest through the client's question tool when it has one,
and write only after user acceptance.
<!-- /shared:layer-modes -->

| Mode | Steps |
|---|---|
| decide | 1, 2, 7 |
| describe | 1, 3, 7 |
| build | 1, 4, 5, 7 |
| audit | 1, 6, 7 |

<!-- shared:layer-thickness -->
Each layer gets one user-confirmed thickness before its other decisions:
**omitted** (nothing built), **light** (one sentence or entry),
**medium** (dedicated file or configuration kept by convention),
**thick** (machine-enforced).
Set it per layer from the project's conditions;
a label ("research code", "production") is evidence for conditions, not a thickness.
Keep these words in the conversation:
write none into a target-project file or `HARNESS.md` without this definition beside it.
<!-- /shared:layer-thickness -->

<!-- shared:agreement-is-the-source -->
Build what the user agreed to and re-decide none of it;
take facts from the code.
Apply this skill's recommendation for any uncovered point and report it as an assumption;
if code makes an agreed decision impossible,
stop that item, report the conflict, and build the rest.
A project has an anchor document only when a root `HARNESS.md` is named by its entrypoint,
or a handover names one the user chose:
then read design intent from it; agreed intent changes are written back in the same work,
by the entry when one runs (hand it the sentence to change), else by this skill.
Any other `HARNESS.md` is a reference (data to weigh, never project intent).
<!-- /shared:agreement-is-the-source -->

<!-- shared:finding-classes -->
Each finding carries class, severity, evidence (`file:line` or run command output),
source of truth, and one proposed disposition.
Classes: **stale** (contradicts current code or tools),
**duplicated** (one fact kept in two places unsynced),
**contradictory** (two statements of intent conflict),
**invisible** (no route or load condition reaches it),
**missing** (called for by conditions or anchor document, absent),
**excessive** (constraint whose target issue has evidence of no longer occurring).
Severities: **high** (safety boundary or always-on rule missing or contradicted),
**medium** (task could go wrong), **low** (wording or tidiness only).
<!-- /shared:finding-classes -->

<!-- shared:nothing-lands-before-agreement -->
Nothing lands before agreement. Create or change no file in the target
project until the user has approved the plan that names it; an inspection
step reads and reports, it never writes.
<!-- /shared:nothing-lands-before-agreement -->

<!-- shared:plan-is-not-approval -->
An approved plan authorises only the files it names.
Publishing outside the repository, changing a remote setting, deleting work,
and widening agent autonomy each require an explicit user decision when reached,
even if remaining decisions were left to you.
<!-- /shared:plan-is-not-approval -->

<!-- shared:pending-decisions -->
When blocked on a user decision, continue all independent steps
and add the item to a pending decisions list
(what is blocked and why, options, recommended option and reason,
what finished work each changes).
Present the list once at the end or when nothing else can proceed,
never one question at a time.
<!-- /shared:pending-decisions -->

<!-- shared:management-code-ownership -->
Any script, hook, check, CI step, or task-runner recipe written into the target project
is its own management code: written in its agreed language, readable first,
failing with what to fix, with no fallback hiding unexpected errors,
and never calling a script in a skill directory.
Tell the user that later fixes to this plugin do not reach the delivered copy.
<!-- /shared:management-code-ownership -->

<!-- shared:deposited-files-stand-alone -->
Deposited files stand alone. Nothing written into the target project names
this plugin, any of its skills or agents, or a path inside a skill
directory, and no term only this plugin defines is used there without being
defined.
<!-- /shared:deposited-files-stand-alone -->

- **Without a handover**, infer the mode from the request.
  A request that changes the environment runs steps 1 and 2
  for the part it concerns, shows what the evidence settled,
  asks the open decisions, and runs steps 4 and 5
  only after the user accepted what was shown.
- **Names, never values.**
  Record a credential as its variable or file name and its scopes.
  Never print, copy, or write a secret's value.
- **Never touch a credential's lifetime.**
  Revoking, rescoping, or issuing a token is a by-hand step for the user,
  listed in the hand back.
- **Stay in the layer.** Which actions an agent may take with a tool,
  allow and deny lists, and commit, branch,
  and remote rules go to the layer that owns Authority;
  lint, test, and CI recipes and the rule for changing their configuration
  to the layer that owns Gates;
  running and observing the system under development to the layer
  that owns Feedback;
  the entrypoint and its budget to the layer that owns Knowledge.
  Hand over by describing the layer, never by naming a skill.
- **Own paths.** This layer writes only its own files:
  the container or sandbox configuration, the firewall script,
  the environment knowledge file, agent-facing wrapper scripts,
  tool registration, each client's sandbox setting,
  and the task runner's export lines.
  An agreed rule about where agents run or what they hold
  is carried into the knowledge file as a rule and,
  where the agreed decisions say so, enforced by a mount or the network.
  An agreed decision that sends every command
  through one entry point makes the task runner the carrier of decision 9.
- **Plain words.** Decisions, descriptions, and deposited files
  say what holds ("the agent reads public issues with nobody watching"),
  never a tier name or this skill's word "strict".

## Workflow

### 1. Observe

Read, record, write nothing. Collect, each with where it was seen:

- isolation: a dev container configuration, `Vagrantfile`,
  VM or cloud workspace configuration;
  whether this session runs inside one (`/.dockerenv`, `REMOTE_CONTAINERS`,
  `CODESPACES`);
- reach: mounts, `runArgs`, forwarded ports,
  and network mode from the container configuration
  and from `/proc/self/mountinfo`;
  credential directories and token variables present (names only);
  each token's scopes where a CLI reports them;
  a forwarded SSH agent or git credential helper;
- tools: MCP servers and tools registered
  in each client's project configuration;
  command-line programs the environment preinstalls (container features, image,
  setup script); scripts and task-runner recipes written for agents;
- the clients in use, each client's own sandbox setting,
  and where each writes session logs;
- control-plane files: security hooks and secret scanner,
  sandbox and container configuration, permission files, and linter, type-check,
  test, and build configuration;
- the task runner, the variables it exports,
  and whether the test command watches by default;
- the entrypoint, its line count, the knowledge directory,
  and whether the project has an anchor document.

Read [references/devcontainer.md](references/devcontainer.md) when a dev container configuration exists or the session runs in a container,
to read its reach correctly.

Done when: every item is recorded as observed, absent, or not observable,
and no file in the project has changed.

### 2. Decide

Two of the project's conditions drive this layer:
whether **a person reviews each result** before anything leaves the machine,
and whether **a wrong change reaches production, customer data, or money**.
Call the environment **strict** when no person reviews each result
or a wrong change reaches that far.
Take both from the handover.
When neither the handover nor the repository shows one,
return it as an open decision that every other decision depends on;
run directly, ask it first.

Read [references/decisions.md](references/decisions.md) when running step 2 (decide mode) or auditing without an anchor document:
it holds this layer's thickness table and all ten decisions.

Return a recommended thickness with the conditions that selected it,
and all ten decisions (one removed by thickness is settled as "not built",
except an exposure step 1 observed, which is always returned).
Each decision is returned in one of two states:

- **settled**, with its evidence, when the handover settles it,
  the repository shows it (an environment already in use, a file, a scope),
  or the conditions make the recommendation clearly better
  and it changes nothing that exists;
- **open**, with its options (the recommendation first),
  the reason, and the decisions it depends on, in every other case:
  always when the recommendation cuts or replaces something that exists,
  needs a by-hand step from the user, or rests on a condition not shown.

An exposure the user was never shown is always open, with cutting it
recommended; never return it as settled, kept, or accepted.
Handed over by an entry, ask the user nothing.

Word the decisions so the environment can be built from them alone.
Together they name: the base and the file that defines it;
every credential by name and scope;
the network rule, host by host when restricted;
every tool with its purpose, what it reaches, the credential it uses,
and when it is available; the tools deliberately not provided,
and that an agent needing one stops and asks;
every hard and soft read-only file by path with how each is enforced;
the variables and where they are set;
and each thing deliberately not done, with its reason.
Every exposure that remains is stated as kept, with the owner's reason.
Accepting the decisions is the owner's risk decision,
which is why an unseen exposure cannot be settled for them.

Done when: a thickness is recommended with its reasons,
each of the ten decisions is settled with evidence or open with options,
and nothing was written to the project.

### 3. Describe

Describe only what step 1 found,
decision by decision in the order of step 2,
as prose fit for a `HARNESS.md`:
plain sentences a reader without this skill understands,
naming the same items the decisions of step 2 name.
Mark intent you inferred as "(inferred)".
Write an exposure that is present as present, with what it gives
(a mounted Docker socket gives host root) and "no decision about it is
recorded"; never write it as a decision or as accepted.
Never replace what exists with a recommendation, and improve nothing.

Done when: every decision of step 2 has a sentence saying what exists
or that nothing does, and no file in the project has changed.

### 4. Build

Write only the files the plan lists for this layer;
change only the lines the agreed decisions require in a file that exists.
A build handover that asks for the plan only writes nothing:
return each file this step would create, change, or delete,
by path with one line on its shape.

Apply a change that widens agent autonomy only after a separate go-ahead
for that operation. When run directly, ask for it here.

1. The environment knowledge file,
   reworked line by line
   from [assets/knowledge-environment.md](assets/knowledge-environment.md)
   when the agreed decisions give agents anything to know while working,
   into the project's knowledge directory
   (`.agents/knowledge/environment.md` when none exists).
   It holds what an agent at work needs:
   what it must not touch, what a refusal means,
   which tools exist and which are absent on purpose.
   Reasons and history stay out of it:
   they go to the anchor document when the project adopted one
   and this skill runs directly, and to the hand back otherwise
   (under an entry, as the sentence to reconcile there).
2. The task-runner lines
   from [assets/justfile-env-snippet.just](assets/justfile-env-snippet.just)
   when non-interactive defaults were agreed,
   translated when the runner is not `just`;
   keep variables the file already exports and add only the missing ones.
   With no task runner agreed, install none:
   write the variables into the knowledge file and hand the runner choice
   to the layer that owns Gates.
3. The base: a dev container configuration, read-only mounts, and the firewall,
   each only where the agreed decisions say so
   and as `references/devcontainer.md`
   and `references/control-plane.md` describe.
   The allowlist holds exactly the agreed hosts.
4. Tool registration and wrapper scripts the agreed decisions name,
   as `references/tools.md` describes.
5. Each client sandbox setting agreed, in the file the decision names.
6. The route. With an entrypoint present and listed in the plan,
   add one routing row naming the knowledge file and its load condition
   when the entrypoint stays at or under 120 lines;
   otherwise, or with no entrypoint yet,
   leave the entrypoint unchanged and hand the row (situation and file)
   to the layer that owns Knowledge as a route owed.

A recipe that still prompts or watches is named in the knowledge file and handed
to the layer that owns Gates; do not edit the recipe.
A credential wider than agreed is not changed:
list rescoping it as a by-hand step and report the gap.
A departure a fact forced (a path that differs, a tool that is absent,
a decision that cannot be built) is recorded as a deviation
with the agreed decision it departs from.

Done when: every file the plan lists for the layer exists
or is on the pending decisions list,
and no file outside the plan was touched.

### 5. Verify

Run each check that applies and record its output;
record a check you could not run as "not verified"
with the command the user runs later.

- A search for `{{` and `# CONFIGURE:` over the written files finds nothing.
- The task runner prints the exported variables with the values written.
- The container configuration parses, and its mounts, capabilities, and
  user match the agreed decisions.
- Every command-line tool the agreed decisions name answers `command -v`;
  every tool they list as absent does not.
- Every tool registration file parses and names only agreed tools.
- With an allowlist: an allowed host answers and a blocked host does not.
- With read-only mounts: `/proc/self/mountinfo` shows each as `ro`. Mounts
  and firewall rules take effect at the next container rebuild; when the
  session predates the change, mark them "not verified".
- The knowledge file opens with its "Read this when" line and is reachable
  from the entrypoint, or its route is recorded as owed.
- No written file holds a credential's value.

Done when: every applicable check is recorded as passed, failed and fixed,
or not verified.

### 6. Audit

When the project adopted an anchor document,
compare its text for this layer, sentence by sentence,
with what step 1 observed; the sentence is the source of truth.
Otherwise compare what step 1 observed
with the recommendations of step 2 for the project's conditions;
the source of truth is the condition that calls for the recommendation,
and each finding is marked "no recorded design to compare with".
Report both directions: what is stated or called for and absent,
and what is present and nothing accounts for.
Every finding takes the form of the finding-classes rule above.
Read [references/audit-findings.md](references/audit-findings.md) when classifying a finding or choosing its disposition.
Evidence is the configuration line as `path:line`
or the output of a command that was run.

Done when: every sentence of the anchor document's text for the layer,
or every decision of step 2 when there is none,
is matched to evidence or to a finding,
every exposure and tool step 1 observed is accounted for or is a finding,
and no file has changed.

### 7. Hand back

- **decide**: the recommended thickness with the conditions that selected it;
  the ten decisions, each marked settled with its evidence,
  or open with its options (recommended first), the reason,
  and the decisions it depends on;
  the exposures observed that the user has not been shown;
  the next step to take if the conditions change
  (mount enforcement when agents become unattended).
- **describe**: the prose, ready to paste; the inferences made;
  the exposures present with no recorded decision.
- **build**: every file written or changed with its role
  and verification result, checks not run marked "not verified"
  with their command;
  deviations, each with the agreed decision it departs from,
  for the entry to put to the user (run directly, put them to the user);
  assumptions applied where no agreed decision covered a point;
  routes owed; work handed to another layer, the layer described;
  by-hand steps for the user (token changes, a container rebuild);
  the pending decisions list; the ownership notice for delivered code.
  For a plan only: the files by path, each with one line on its shape.
- **audit**: one row per finding:
  class, severity, evidence as `path:line` or command output,
  the source of truth, and the proposed disposition with the change.

Done when: every item for the mode is in the hand back, it names no skill,
and it holds no credential value.

## Gotchas

- A dev container without a `~/.ssh` mount can still push:
  editor container extensions forward the host's SSH agent (`SSH_AUTH_SOCK`)
  and a git credential helper. Check both under credentials.
- `CI=true` switches some tools into CI behaviour (a frozen lockfile on install,
  no update prompt). Name each recipe it changes in the knowledge file.
- A read-only file mount makes any git operation that rewrites that file
  (checkout, pull, rebase) fail with "Device or resource busy".
  Say so in the control-plane decision:
  changes to those files then go through a person outside the container,
  which is the intent.
- `/proc/self/mountinfo` shows what is mounted now;
  it differs from the configuration file when the container predates an edit.
  Report the difference instead of trusting either.
