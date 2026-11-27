# Spec Delta

## MODIFIED Requirements

### Requirement: Triggering
The skill SHALL load, from a description match, when a harness entry hands over the Entropy layer or when the means of keeping a project's agent harness in step with its code are being decided, described, built, or audited, and SHALL NOT load for product checks, a one-off fix to one document, synchronisation between product artifacts, or branch hygiene.

#### Scenario: Workflow hands over the layer for build
- **WHEN** a harness entry says "Entropy layer, build mode: here are the decisions agreed for the layer and the files the plan lists for it"
- **THEN** the skill loads

#### Scenario: Entrypoint drifts from the task runner
- **WHEN** the user says "AGENTS.md keeps describing commands that no longer exist in the justfile; set something up so the harness stays true to the code"
- **THEN** the skill loads

#### Scenario: Long-lived harness cleanup
- **WHEN** the user says "this harness has grown for two years; design a routine that finds dead rules and over-thick constraints"
- **THEN** the skill loads

#### Scenario: Audit of the sync mechanisms
- **WHEN** a harness entry says "audit mode, Entropy layer: does what keeps this harness in sync still match what the project's conditions call for?"
- **THEN** the skill loads

#### Scenario: Product lint in CI
- **WHEN** the user says "add ruff and mypy to CI so bad Python stops landing"
- **THEN** the skill does not load

#### Scenario: One-off document fix
- **WHEN** the user says "the link in AGENTS.md to the architecture doc is broken, fix it"
- **THEN** the skill does not load

#### Scenario: Product artifact synchronisation
- **WHEN** the user says "write a skill that keeps the ORM models in sync with the database migrations"
- **THEN** the skill does not load

#### Scenario: Branch hygiene
- **WHEN** the user says "clean up the stale feature branches that have already been merged"
- **THEN** the skill does not load

### Requirement: Behavior: Build deposits project-owned mechanisms
In build mode the agent SHALL fill the entrypoint's one keep-in-sync section, SHALL deposit the self-check among the project's own management scripts with its recipe, aggregate-check hookup, and CI job as the agreed decisions say, SHALL run it once and hand back its output verbatim, and SHALL hand sync or reclamation project skills to the skill that writes project skills by role. It SHALL create no label and change no remote setting.

#### Scenario: Reserved section present
- **WHEN** the entrypoint holds the keep-in-sync marker under a reserved heading
- **THEN** the content replaces the marker, the heading stays, and the entrypoint has exactly one sync section

#### Scenario: Entrypoint cannot take the section
- **WHEN** the project has no entrypoint yet, or the keep-in-sync content would break its line budget
- **THEN** the agent writes nothing into the entrypoint and hands the content back for the layer that owns Knowledge

#### Scenario: First run reports findings
- **WHEN** the deposited self-check reports stale paths on its first run
- **THEN** the agent hands back each finding as printed for a per-finding decision and does not edit the check's logic to make it pass

#### Scenario: Self-check agreed as advisory on GitLab
- **WHEN** the agreed decisions keep the gate independent of the self-check and the project's GitLab pipelines must succeed before a merge
- **THEN** the self-check job is absent from the gate's job list and is allowed to fail with a comment naming it the agreed advisory job, and the hand back says a failing self-check stays visible and blocks no merge

#### Scenario: Advisory self-check and a required aggregate job
- **WHEN** the agreed decisions keep the gate independent of the self-check and a required CI job runs the aggregate check recipe
- **THEN** the self-check is left out of the aggregate recipe, verification does not report that as a failure, and the hand back reports it as a deviation with the fact behind it

#### Scenario: Anchor document written after the layer
- **WHEN** the handover lists a new anchor `HARNESS.md` among the required paths and says the entry writes it after this layer
- **THEN** the self-check's design document settings name that path, the first self-check output is handed back verbatim with the missing anchor named as expected, and no setting is changed to hide it

#### Scenario: Existing root file named as the anchor
- **WHEN** a `HARNESS.md` is in the root, no entrypoint names it yet, and the handover names it as the anchor document whose route the entry writes after this layer
- **THEN** the layer is configured for that path as for an adopted anchor document, and the file is not treated as a reference

#### Scenario: Project scripts in another language
- **WHEN** the agreed decisions name TypeScript as the project's management language
- **THEN** the deposited check is a port with the same settings, rule ids, messages, JSON shape, and exit codes

#### Scenario: Drift label needed
- **WHEN** the agreed decisions name a drift label that does not exist on the remote
- **THEN** the label appears in the hand back as a remote item and the agent creates nothing on the remote

### Requirement: Outcomes
Given a project and a handover, the agent SHALL leave every decision traceable to an agreed decision, the project's conditions, or an observed fact, and every deposited mechanism reachable from the entrypoint and owned by the project.

#### Scenario: Build with a sync table and a self-check
- **WHEN** build mode runs with agreed decisions naming a sync table, the three drift dispositions, a Python self-check under `scripts/` run by `just harness-check`, and an adopted anchor `HARNESS.md` kept in step, with the list of required paths
- **THEN** the entrypoint holds one keep-in-sync section with the dispositions, the ruling rule, and complete rows; the script exists with every setting filled, including the required paths and the design document; the recipe is part of the aggregate check and a CI job runs it; the first output is in the hand back; nothing deposited calls a file inside a skill directory; and no file the plan does not list was written

#### Scenario: Design for a long-lived project
- **WHEN** decide mode runs, handed over by an entry, for a project maintained for years with a monthly release and no `HARNESS.md`
- **THEN** the hand back recommends a thickness with its reasons and returns the layer's decisions, each settled with the fact behind it or open with its options, among them a reclamation routine anchored to the release with a monthly cadence; the result fails if it asks the user anything, returns a decision about a design document, or changes a file

#### Scenario: Audit of a neglected harness
- **WHEN** audit mode runs on a project whose reclamation says "Last run: never" after a year and whose CI calls a check script inside a skill directory
- **THEN** the findings include both, each with a class, a severity, evidence, and the source of truth, the first with running the sweep as its proposed disposition and the second with a project-owned copy as its proposed disposition, and no file changed

## REMOVED Requirements

### Requirement: Behavior: The mode decides what is written

**Reason**: The modes design and extract are replaced by decide and describe, and neither returns the text of a section of a root `HARNESS.md`.

**Migration**: See "Behavior: Only build mode writes" and "Behavior: Audit compares with the anchor document or the conditions".

### Requirement: Behavior: An absent section means the layer is omitted

**Reason**: A project is never expected to have a `HARNESS.md`, so a missing section says nothing; omission is the thickness the user agreed to.

**Migration**: See "Behavior: An omitted layer builds nothing".

### Requirement: Behavior: Design applies one default per decision

**Reason**: The builder no longer settles every decision with a default behind one approval; it returns decisions for the entry to settle with the user in rounds.

**Migration**: See "Behavior: Decide returns the layer's decisions". The defaults survive as recommendations.

### Requirement: Behavior: The section stands on its own

**Reason**: The builder no longer returns a designed section; the prose it returns is describe mode's account of what exists.

**Migration**: See "Behavior: Describe returns prose that stands on its own".

### Requirement: Behavior: A kept design document is held in step with the harness

**Reason**: A design document is kept in step only where the project adopted an anchor document; a `HARNESS.md` used as a template and deleted is no longer a case.

**Migration**: See "Behavior: An adopted anchor document is held in step with the harness".

## ADDED Requirements

### Requirement: Behavior: Only build mode writes
The agent SHALL work in the mode the handover names (decide, describe, build, audit) or the request implies, and SHALL change files in the project only in build mode. Run directly by a user, it SHALL show what it decided on the evidence, ask the open decisions, and write only after the user accepted; it SHALL record the change in a `HARNESS.md` only when the project adopted one as its anchor document.

#### Scenario: Describe mode
- **WHEN** an entry hands over the layer in describe mode on a repository with a populated sync table and a harness check script
- **THEN** the agent returns prose describing both and what each covers, marks unstated intent as inferred, and changes no file

#### Scenario: Decide mode
- **WHEN** an entry hands over the Entropy layer in decide mode
- **THEN** the agent returns a recommended thickness and the layer's decisions, and no file in the project has changed

#### Scenario: Audit mode runs the existing check
- **WHEN** audit mode runs on a project that has a harness self-check recipe
- **THEN** the agent runs it, includes its findings among its own with a severity of high, medium, or low and evidence, and changes no file

#### Scenario: Direct request
- **WHEN** the user asks directly to set something up so the harness stays true to the code, with no entry running
- **THEN** the agent shows what it decided on the evidence, asks the open decisions through the client's question tool where there is one, and writes files only after the user accepted what was shown

#### Scenario: Direct request in a project with an anchor document
- **WHEN** the same direct request changes what the project's adopted anchor `HARNESS.md` says about keeping the harness in step
- **THEN** the accepted change is also written to that document in the same piece of work

#### Scenario: Direct request in a project without an anchor document
- **WHEN** the same direct request runs in a project with no `HARNESS.md`
- **THEN** the work completes and the project still has no `HARNESS.md`

### Requirement: Behavior: An omitted layer builds nothing
Omitted is the thickness at which nothing is built for the layer. When the layer's agreed thickness is omitted, the agent in build mode SHALL write nothing except removing a reserved, empty keep-in-sync heading and its marker from the entrypoint, and SHALL report the layer as omitted by agreement. In audit mode, when the thickness or the adopted anchor document omits the layer, it SHALL add one finding when the project nevertheless runs a harness check or sync rule.

#### Scenario: Build with the layer omitted
- **WHEN** build mode runs with the Entropy layer agreed as omitted and the entrypoint holds an empty reserved keep-in-sync heading
- **THEN** the heading and its marker are removed, no script, recipe, or routine is created, and the hand back says the layer is omitted by agreement

#### Scenario: Audit finds a mechanism in an omitted layer
- **WHEN** audit mode runs on a project whose adopted anchor document omits the layer and whose CI runs a harness check
- **THEN** the findings include one that names the check as evidence and the anchor document as the source of truth, and no file changed

### Requirement: Behavior: Decide returns the layer's decisions
In decide mode the agent SHALL return a recommended thickness with its reasons and each Entropy decision (which side wins a disagreement, what an agent does on finding drift, how each copy is kept in step, the self-check and its wiring, reclamation) as settled, with the fact that settles it, or as open, with its options, the recommended one first, its reason, and the decisions it depends on. Handed over by an entry it SHALL ask the user nothing itself.

#### Scenario: Throwaway prototype
- **WHEN** the project's conditions say it will be discarded within a quarter and only its author relies on its conventions
- **THEN** the agent recommends the thickness omitted and gives that reason

#### Scenario: Long-lived project with unattended agents
- **WHEN** the project's conditions say it is maintained for years, several people rely on its conventions, and agents work unattended
- **THEN** the hand back recommends thick, the machine-enforced thickness, and its recommendations carry the three drift dispositions, a sync mechanism per concern, a self-check wired into the task runner and CI with the gate depending on it, and a reclamation routine anchored to a named event with a cadence

#### Scenario: Maintained past a release by a small team
- **WHEN** the project's conditions say it outlives one release, two people rely on its conventions, and a wrong change is cheap to undo
- **THEN** the recommendations carry a sync table and a self-check in the aggregate check and CI, do not make the gate depend on it, and say reclamation is left out and what would add it

#### Scenario: Adopted anchor document
- **WHEN** the project has adopted a `HARNESS.md` as its anchor document
- **THEN** the hand back also returns whether the self-check and the reclamation routine keep that document in step with the harness

#### Scenario: No anchor document
- **WHEN** the project has no `HARNESS.md`
- **THEN** no returned decision concerns a design document, and none recommends creating one

### Requirement: Behavior: Describe returns prose that stands on its own
In describe mode the agent SHALL describe what the project has today as plain prose fit for a `HARNESS.md`, readable without this plugin: which side wins a disagreement, each mirror pair with its source side, what an agent does on finding drift and where the trace goes, each concern kept in step and by what, what the self-check verifies and where it runs, and the reclamation event and cadence, with the reason beside each and inferred intent marked.

#### Scenario: Clean-context reader
- **WHEN** a reader who has never seen the skill reads only the returned description of a project whose entrypoint states the drift dispositions, and is asked what to do on finding a stale command in a knowledge file
- **THEN** the reader names the dispositions and their criteria and says a remark in the conversation does not count

#### Scenario: Practice without a stated reason
- **WHEN** the project's CI runs a harness check and no document says why
- **THEN** the description states what the check covers and where it runs, and marks the reason as inferred

### Requirement: Behavior: An adopted anchor document is held in step with the harness
In build mode the agent SHALL configure the self-check to require every path the agreed decisions list as required, taking paths only from that list and never by parsing prose. Where the project adopted an anchor document and the agreed decisions keep it in step, it SHALL also require the file and add re-reading it against the harness to the reclamation routine. Without an anchor document it SHALL configure nothing about a design document and, in audit mode, SHALL check nothing about one.

#### Scenario: Required path removed later
- **WHEN** a directory the handed-over list requires is deleted after the build
- **THEN** the project's self-check reports that path as required and missing

#### Scenario: Project without an anchor document
- **WHEN** build mode runs in a project that has adopted no anchor document
- **THEN** the deposited check has no design document configured, still requires the paths the agreed decisions list, and neither the sync section nor the reclamation routine mentions a design document

#### Scenario: Audit without an anchor document
- **WHEN** audit mode runs on a project with no `HARNESS.md`
- **THEN** no finding reports a design document as missing or out of step

#### Scenario: No path list in the handover
- **WHEN** build mode runs and the handover carries no list of required paths
- **THEN** the agent configures none, reports the gap, and writes no path it guessed from a document's prose

#### Scenario: Validator inside a skill directory
- **WHEN** the only format validator available lies inside an installed skill's directory
- **THEN** the agent leaves format validation unconfigured and reports that the format is not checked mechanically, instead of pointing the project's check at that script

### Requirement: Behavior: Build realises the agreed decisions and nothing else
In build mode the agent SHALL work from the layer's agreed decisions, SHALL write only the files the plan lists for the layer, and SHALL report every departure a fact forced as a deviation for the entry to put to the user. Asked for the plan only, it SHALL return the files it would create, change, or delete and write nothing.

#### Scenario: Plan only
- **WHEN** a build handover asks for the plan only
- **THEN** the agent returns the files it would create, change, or delete, each by path with one line on its shape, and writes nothing

#### Scenario: Fact forces a departure
- **WHEN** the agreed decision hooks the self-check into the aggregate check recipe and the task runner has no aggregate recipe
- **THEN** the agent creates no aggregate recipe on its own, and the hand back reports the hookup as a deviation with the fact behind it for the entry to put to the user

### Requirement: Behavior: Audit compares with the anchor document or the conditions
In audit mode the agent SHALL compare what keeps the harness in step with the anchor document's text for the layer when the project adopted one, and otherwise with what the project's conditions call for. Each finding SHALL have a class (stale, duplicated, contradictory, invisible, missing, excessive), a severity (high, medium, low), evidence, the source of truth, and a proposed disposition.

#### Scenario: Adopted anchor document
- **WHEN** the anchor document says a self-check runs in CI and no CI job runs one
- **THEN** a finding quotes the sentence as the source of truth, gives the CI configuration as evidence, and proposes adding the job or changing the document by an explicit decision

#### Scenario: Nothing recorded to compare with
- **WHEN** the handover asks for an audit of a project that has adopted no anchor document
- **THEN** the agent compares the project with what its conditions call for and marks each finding as having no recorded design to compare with
