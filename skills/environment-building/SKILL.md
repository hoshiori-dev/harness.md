---
name: environment-building
description: >-
  Owns the Environment layer of an agent harness (where a coding agent runs,
  the tools and credentials it holds, what it can reach); use when a harness
  workflow hands the layer over or an agent's sandbox, tools, or reach is in
  question.
license: Apache-2.0
---

# Environment Building

Client rules are aids an agent that runs code can write around; the boundary
that holds is the environment it runs in and the credentials it carries.
This skill settles that environment as the Environment section of
`HARNESS.md` and realises it: where the agent runs, what it holds and can
reach, which tools it is given, which files it must not change, and the
settings that keep every command non-interactive.

## Rules on every step

<!-- shared:layer-modes -->
This skill works in one of four modes, named by the workflow that hands over
or inferred from the request. **design**: return this layer's section of
`HARNESS.md` as prose; write nothing. **extract**: describe what the project
does today as this layer's section; write nothing. **build**: realise the
section in the project. **audit**: report where the project and the section
disagree; change nothing. A handover carries the project's Context, this
layer's section, and the parts of Invariants, Style, and File Structure
assigned to this layer; never ask again for what it carries. A build
handover that asks for the plan only stops after step 1 and returns the
files step 3 would create, change, or delete.
<!-- /shared:layer-modes -->

| Mode | Steps |
|---|---|
| design | 1, 2, 6 |
| extract | 1, 2, 6 |
| build | 1, 3, 4, 6 |
| audit | 1, 5, 6 |

<!-- shared:design-is-the-source -->
`HARNESS.md` in the project root is the design this work serves: design
intent comes from it, facts come from the code. Build what its sections say
and re-decide nothing they decide. Where a section is silent on a point the
work needs, apply the default this skill states and report it as an
assumption. When a fact in the code makes a sentence of the design
impossible to build, stop that item, report the conflict, and build the
rest.
<!-- /shared:design-is-the-source -->

<!-- shared:defaults-first -->
Defaults first. Settle from the repository everything it can show (tools in
use, directories, commands, history). Ask the user, once and in one round,
only for context the repository cannot show. Then draft the complete design
with one stated default for every decision, each with its reason, and
present it for a single approval. Never interview decision by decision. A
default the user changes binds every later step; challenge a change once
when the evidence contradicts it.
<!-- /shared:defaults-first -->

<!-- shared:nothing-lands-before-agreement -->
Nothing lands before agreement. Create or change no file in the target
project until the user has approved the design that covers it; an inspection
step reads and reports, it never writes.
<!-- /shared:nothing-lands-before-agreement -->

<!-- shared:design-is-not-approval -->
An approved design authorises the files it describes and nothing else.
Publishing anything outside the repository, changing a remote setting,
deleting work, and widening what agents may do on their own are each a
separate, explicit decision by the user, taken when that step is reached.
<!-- /shared:design-is-not-approval -->

<!-- shared:pending-decisions -->
When a step is blocked on a decision only the user can make, continue with
every step that does not depend on it and add the blocked item to a pending
decisions list. Each item states: what is blocked and why; the options; the
recommended option and its reason; which finished work each option would
change. Present the list once, at the end or when nothing else can proceed,
never one question at a time.
<!-- /shared:pending-decisions -->

<!-- shared:management-code-ownership -->
A script, hook, check, CI step, or task-runner recipe written into the target
project is the project's own management code: written for its role in the
language the project agreed to, readable first, failing with a message that
names what to fix, with no fallback that hides an unexpected error, and never
calling a script inside a skill directory. Tell the user that later fixes to
this plugin do not reach the delivered copy.
<!-- /shared:management-code-ownership -->

<!-- shared:deposited-files-stand-alone -->
Deposited files stand alone. Nothing written into the target project names
this plugin, any of its skills or agents, or a path inside a skill
directory, and no term only this plugin defines is used there without being
defined. `HARNESS.md` and its section names may be named: the file is the
project's own.
<!-- /shared:deposited-files-stand-alone -->

- **Without a handover**, infer the mode from the request. Before writing a
  file that no Environment section covers, run steps 1 and 2 for the missing
  part, get one approval, and, when the project keeps `HARNESS.md`, record
  the text there.
- **Names, never values.** Record a credential as its variable or file name
  and its scopes. Never print, copy, or write a secret's value.
- **Never touch a credential's lifetime.** Revoking, rescoping, or issuing a
  token is a by-hand step for the user, listed in the hand back.
- **Stay in the layer.** Which actions an agent may take with a tool, allow
  and deny lists, and commit, branch, and remote rules go to the layer that
  owns Authority; lint, test, and CI recipes and the rule for changing their
  configuration to the layer that owns Gates; running and observing the
  system under development to the layer that owns Feedback; the entrypoint
  and its budget to the layer that owns Knowledge. Hand over by describing
  the layer, never by naming a skill.
- **Assigned parts.** From File Structure, this layer creates only its own
  paths: the container or sandbox configuration, the firewall script, the
  environment knowledge file, agent-facing wrapper scripts. An invariant
  about where agents run or what they hold is carried into the knowledge
  file as a rule and, where the section says so, enforced by a mount or the
  network. A Style sentence that sends every command through one entry
  point makes the task runner the carrier of decision 9.

## Workflow

### 1. Observe

Read, record, write nothing. Collect, each with where it was seen:

- isolation: a dev container configuration, `Vagrantfile`, VM or cloud
  workspace configuration; whether this session runs inside one
  (`/.dockerenv`, `REMOTE_CONTAINERS`, `CODESPACES`);
- reach: mounts, `runArgs`, forwarded ports, and network mode from the
  container configuration and from `/proc/self/mountinfo`; credential
  directories and token variables present (names only); each token's scopes
  where a CLI reports them; a forwarded SSH agent or git credential helper;
- tools: MCP servers and tools registered in each client's project
  configuration; command-line programs the environment preinstalls
  (container features, image, setup script); scripts and task-runner
  recipes written for agents;
- the clients in use, each client's own sandbox setting, and where each
  writes session logs;
- control-plane files: security hooks and secret scanner, sandbox and
  container configuration, permission files, and linter, type-check, test,
  and build configuration;
- the task runner, the variables it exports, and whether the test command
  watches by default;
- the entrypoint, its line count, and the knowledge directory.

Read [references/devcontainer.md](references/devcontainer.md) when a dev container configuration exists or the session runs in a container, to read its reach correctly.

Done when: every item is recorded as observed, absent, or "ask", and no
file in the project has changed.

### 2. Write the section

In **extract** mode describe only what step 1 found, decision by decision
in the order below. Mark intent you inferred as "(inferred)"; write an
exposure that is present as present, with "no recorded decision"; never
replace what exists with a default.

In **design** mode settle every decision below. Take each from the handover
or the repository where it is settled there; otherwise apply the default
its Context selects. Two Context facts drive most defaults: whether **a
person reviews each result** before anything leaves the machine, and
whether **a wrong change reaches production, customer data, or money**.
Call the environment **strict** when no person reviews each result or a
wrong change reaches that far. Ask, in the one round, only for these facts
and for exposures step 1 could not observe.

1. **Base.** An isolated environment the session already uses is adopted as
   it is; propose no replacement. Otherwise: strict → a dev container with
   decisions 5 and 8 enforced, because only the environment stops an agent
   that runs code (alternatives: a VM, a cloud workspace). A person reviews
   each result but the agent holds credentials or mistakes are costly to
   undo → a dev container relied on by convention, the same file for people
   and agents. A short-lived project with nothing sensitive in reach → the
   host with scoped tokens, each token and its scopes named.
2. **Threat rating.** Rate three facts with evidence: the agent reaches
   sensitive assets, reads content it does not control, and can act
   outward; the least trusted source it reads (trusted repository,
   reputation-guarded, open-write such as issues or arbitrary pages);
   whether a person reviews each result. All three against it (assets,
   an open-write source, no person) → default a separate restricted
   instance: its own container or VM, none of the sensitive credentials, no
   write to the default branch, results landing as a branch or draft
   request. Read [references/threat-model.md](references/threat-model.md) when rating the facts, when a source is neither trusted nor open-write, or when the user argues a strong model replaces isolation.
3. **Credentials.** No host credential mount; one token per outside system
   with the least scope the work needs; on a host base, name what the
   user's account exposes.
4. **Host privilege.** None: no Docker socket, no `--privileged`, no host
   home mount. A project that builds images gets rootless Docker or a
   remote builder.
5. **Network.** Open when a person reviews each result. Strict → deny by
   default and allow the git host, the package registries in use, each
   client's model endpoints, and documentation hosts the user names. Never
   host networking.
6. **Session logs.** They stay where each client writes them. Central
   collection is a privacy decision the owner takes explicitly (store,
   readers, retention, redaction); never default it on.
7. **Tools.** Every project command goes through the task runner. The
   hosting platform's CLI is preinstalled when the project is hosted, with
   its own scoped token. No MCP server by default: add one only for a
   capability no command-line program in the environment gives, because
   every registered tool costs context on every task and widens reach. Name
   what is deliberately absent (deploy and cloud CLIs, publish credentials,
   production database clients) so an agent that misses one does not
   install it. Read [references/tools.md](references/tools.md) when the project registers or needs any tool beyond the task runner and the platform CLI, or when writing the tools paragraph.
8. **Control plane.** Hard read-only (an agent never changes them):
   security rules, sandbox and container configuration, secret-scanning
   hooks, permission files. Soft read-only (changed only under the rule the
   Gates layer states): linter, type-check, test, and build configuration.
   Strict → enforce hard read-only by read-only mounts; otherwise by
   convention, saying so. Read [references/control-plane.md](references/control-plane.md) when classifying files, when writing mount enforcement or the network allowlist, or when a client has its own sandbox setting.
9. **Non-interactive defaults.** The task runner exports `CI=true`,
   `PAGER=cat`, `GIT_PAGER=cat`, `GIT_TERMINAL_PROMPT=0`, and any variable
   the project's own tools read; name every command that still needs a
   run-once flag.
10. **Client sandbox settings.** Each client's own sandbox is set
    consistently with decisions 1 and 5 and described as an aid, never as
    the boundary.

Read [references/sandbox-exposures.md](references/sandbox-exposures.md) when step 1 found a credential, a privileged interface, host networking, or log collection, or when deciding whether an exposure is cut or kept.

Write the section so the environment can be built from it alone, in plain
prose a reader without this skill understands (say "the agent reads public
issues with nobody watching", not a tier name). It must name: the base and
the file that defines it; every credential by name and scope; the network
rule, host by host when restricted; every tool with its purpose, what it
reaches, the credential it uses, and when it is available; the tools
deliberately not provided; every hard and soft read-only file by path with
how each is enforced; the variables and where they are set; and each thing
deliberately not done, with its reason. Every exposure that remains is
written as kept, with the reason. Approval of the design is the owner's
risk decision, so an exposure the user was never shown is never written as
accepted.

Done when: every decision has text in the section, each default applied is
listed with the Context fact that selected it, and nothing was written to
the project.

### 3. Build

Write only what the section describes; change only the lines it requires
in a file that exists.

1. The environment knowledge file, reworked line by line from [assets/knowledge-environment.md](assets/knowledge-environment.md) when the section gives agents anything to know while working, into the project's knowledge directory (`.agents/knowledge/environment.md` when none exists). It holds what an agent at work needs: what it must not touch, what a refusal means, which tools exist and which are absent on purpose. Reasons and history stay in `HARNESS.md`.
2. The task-runner lines from [assets/justfile-env-snippet.just](assets/justfile-env-snippet.just) when the section sets non-interactive defaults, translated when the runner is not `just`; keep variables the file already exports. With no task runner agreed, install none: write the variables into the knowledge file and hand the runner choice to the layer that owns Gates.
3. The base: a dev container configuration, read-only mounts, and the
   firewall, each only where the section says so and as
   `references/devcontainer.md` and `references/control-plane.md` describe.
4. Tool registration and wrapper scripts the section names, as
   `references/tools.md` describes.
5. Each client sandbox setting the section states, in the file it names.
6. The route. With an entrypoint present, add one routing row naming the
   knowledge file and its load condition when the entrypoint stays at or
   under 120 lines; otherwise, or with no entrypoint yet, hand the row
   (situation and file) to the layer that owns Knowledge as a route owed.

A recipe that still prompts or watches is named in the knowledge file and
handed to the layer that owns Gates; do not edit the recipe.

Done when: every file the section describes exists or is on the pending
decisions list, and no file outside the section was touched.

### 4. Verify

Run each check that applies and record its output; record a check you could
not run as "not verified" with the command the user runs later.

- A search for `{{` and `# CONFIGURE:` over the written files finds nothing.
- The task runner prints the exported variables with the values written.
- The container configuration parses, and its mounts, capabilities, and
  user match the section.
- Every command-line tool the section names answers `command -v`; every
  tool it lists as absent does not.
- Every tool registration file parses and names only tools in the section.
- With an allowlist: an allowed host answers and a blocked host does not.
- With read-only mounts: `/proc/self/mountinfo` shows each as `ro`. Mounts
  and firewall rules take effect at the next container rebuild; when the
  session predates the change, mark them "not verified".
- The knowledge file opens with its "Read this when" line and is reachable
  from the entrypoint, or its route is recorded as owed.

Done when: every applicable check is recorded as passed, failed and fixed,
or not verified.

### 5. Audit

Compare the section, sentence by sentence, with what step 1 observed. With
no section in the handover, compare with the defaults of step 2 for the
project's Context and mark each finding "no design to compare with".
Report as findings:

- an exposure the section does not mention (a credential mount, a Docker
  socket, host networking, a token wider than stated): **high**;
- a boundary the section states that the project lacks or contradicts (no
  firewall, a writable hard read-only file, a base the session is not
  running in): **high**;
- a tool registered but absent from the section, or named in the section
  and missing from the environment: **medium**;
- missing non-interactive variables, a recipe that watches or prompts, a
  client sandbox setting that differs: **medium**;
- a knowledge file that disagrees with the section or that no route
  reaches: **medium**;
- wording that is stale but changes no behaviour: **low**.

For each finding recommend one side: fix the artifact when the section
still states what the project wants; amend the design when the project's
practice is the better answer or the section never decided.

Done when: every sentence of the section is matched to evidence or to a
finding, and no file has changed.

### 6. Hand back

- **design, extract**: the section text ready to paste; the defaults
  applied, each with the Context fact that selected it (design) or the
  inferences made (extract); the questions no default can answer.
- **build**: every file written or changed with its role and verification
  result; deviations where a fact forced a departure from the section, each
  with the sentence to reconcile in `HARNESS.md`; routes owed; work handed
  to another layer, the layer described; by-hand steps for the user (token
  changes, a container rebuild); the pending decisions list; the ownership
  notice for delivered code.
- **audit**: one row per finding: severity, evidence as `path:line` or
  command output, the sentence of the section, and "fix the artifact" or
  "amend the design" with the change.

Done when: every item for the mode is in the hand back and it names no
skill.

## Gotchas

- A dev container without a `~/.ssh` mount can still push: editor container
  extensions forward the host's SSH agent (`SSH_AUTH_SOCK`) and a git
  credential helper. Check both under credentials.
- `CI=true` switches some tools into CI behaviour (a frozen lockfile on
  install, no update prompt). Name each recipe it changes in the knowledge
  file.
- A read-only file mount makes any git operation that rewrites that file
  (checkout, pull, rebase) fail with "Device or resource busy". Say so in
  the section: changes to those files then go through a person outside the
  container, which is the intent.
- `/proc/self/mountinfo` shows what is mounted now; it differs from the
  configuration file when the container predates an edit. Report the
  difference instead of trusting either.
