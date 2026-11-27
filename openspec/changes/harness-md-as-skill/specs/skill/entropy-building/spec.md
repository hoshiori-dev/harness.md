# Spec Delta

## ADDED Requirements

### Requirement: Script: check_harness.py takes the design document as a directory
The delivered self-check SHALL take the design document as a directory path in its settings and hand that directory to the configured validator. It SHALL treat a type-marked directory under a configured knowledge directory as one unit, reached when the entrypoint names its `SKILL.md`, and SHALL hold no file inside it to a rule for knowledge files. It SHALL recognise the markers from frontmatter alone and SHALL NOT run a file inside such a directory.

#### Scenario: Design document given as a directory
- **WHEN** the design document setting names a directory holding a type-marked `SKILL.md` and a validator is configured
- **THEN** the validator runs once with that directory as its argument, and its exit code 0 yields no `design-format` finding

#### Scenario: Configured design document missing
- **WHEN** the design document setting names a directory that does not exist or holds no `SKILL.md`
- **THEN** a `design-doc` finding names the configured path, and the exit code is 1

#### Scenario: Design document inside the knowledge directory
- **WHEN** a configured knowledge directory holds the design document's directory with a `SKILL.md`, a second Markdown file, and a script, and the entrypoint names only the `SKILL.md`
- **THEN** no `knowledge-reachable` finding names a file of that directory

#### Scenario: Marked directory the entrypoint does not name
- **WHEN** a configured knowledge directory holds a type-marked directory and the entrypoint does not name its `SKILL.md`
- **THEN** one `knowledge-reachable` finding names that `SKILL.md`, and none names another file of the directory

#### Scenario: Validator inside the design document
- **WHEN** the configured validator command names a file that lies inside the configured design document's directory
- **THEN** the script prints nothing on stdout, explains on stderr that the project must hold its own copy, and exits 2

## MODIFIED Requirements

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
- **WHEN** the handover lists the directory of a new anchor `HARNESS.md` among the required paths and says the entry writes it after this layer
- **THEN** the self-check's design document settings name that directory, the first self-check output is handed back verbatim with the missing anchor named as expected, and no setting is changed to hide it

#### Scenario: Existing root file named as the anchor
- **WHEN** a type-marked `HARNESS.md` has its directory in the repository root, no entrypoint names it yet, and the handover names it as the anchor document whose entrypoint line the entry writes after this layer
- **THEN** the layer is configured for that directory as for an adopted anchor document, and the document is not treated as a reference

#### Scenario: Project scripts in another language
- **WHEN** the agreed decisions name TypeScript as the project's management language
- **THEN** the deposited check is a port with the same settings, rule ids, messages, JSON shape, and exit codes

#### Scenario: Drift label needed
- **WHEN** the agreed decisions name a drift label that does not exist on the remote
- **THEN** the label appears in the hand back as a remote item and the agent creates nothing on the remote

#### Scenario: Reference asset named in the plan
- **WHEN** the handover names a check script carried by a reference `HARNESS.md` as an asset the approved plan lists for the layer
- **THEN** the agent adapts it into the project's own management scripts with the project's settings, and no recipe, hook, or CI job it deposits calls the file where the reference keeps it

#### Scenario: Reference asset the plan does not name
- **WHEN** a reference the handover carries holds a check script that the approved plan does not name
- **THEN** the agent takes nothing from that script, builds the self-check from the agreed decisions, and runs the script nowhere

#### Scenario: Script inside the project's own design document
- **WHEN** the directory of the project's anchor document holds a self-check script and the approved plan names it as an asset to adopt
- **THEN** the deposited recipe and CI job run an adapted copy among the project's management scripts, never the file inside the document's directory

### Requirement: Outcomes
Given a project and a handover, the agent SHALL leave every decision traceable to an agreed decision, the project's conditions, or an observed fact, and every deposited mechanism reachable from the entrypoint and owned by the project.

#### Scenario: Build with a sync table and a self-check
- **WHEN** build mode runs with agreed decisions naming a sync table, the three drift dispositions, a Python self-check under `scripts/` run by `just harness-check`, and an adopted anchor `HARNESS.md` kept in step, with the list of required paths
- **THEN** the entrypoint holds one keep-in-sync section with the dispositions, the ruling rule, and complete rows; the script exists with every setting filled, including the required paths and the design document's directory; the recipe is part of the aggregate check and a CI job runs it; the first output is in the hand back; nothing deposited calls a file inside one of the plugin's skill directories or inside a design document's directory; and no file the plan does not list was written

#### Scenario: Design for a long-lived project
- **WHEN** decide mode runs, handed over by an entry, for a project maintained for years with a monthly release and no `HARNESS.md`
- **THEN** the hand back recommends a thickness with its reasons and returns the layer's decisions, each settled with the fact behind it or open with its options, among them a reclamation routine anchored to the release with a monthly cadence; the result fails if it asks the user anything, returns a decision about a design document, or changes a file

#### Scenario: Audit of a neglected harness
- **WHEN** audit mode runs on a project whose reclamation says "Last run: never" after a year and whose CI calls a check script inside a skill directory
- **THEN** the findings include both, each with a class, a severity, evidence, and the source of truth, the first with running the sweep as its proposed disposition and the second with a project-owned copy as its proposed disposition, and no file changed

### Requirement: Behavior: An adopted anchor document is held in step with the harness
In build mode the agent SHALL configure the self-check to require every path the agreed decisions list as required, taking paths only from that list and never by parsing prose. Where the project adopted an anchor document and the agreed decisions keep it in step, it SHALL also require the document and add re-reading it against the harness to the reclamation routine. Without an anchor document it SHALL configure nothing about a design document and, in audit mode, SHALL check nothing about one.

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

#### Scenario: Anchor document inside the knowledge folder
- **WHEN** build mode runs with agreed decisions that keep in step an anchor document whose directory lies inside the project's knowledge folder
- **THEN** the deposited check has that directory configured as the design document, its first output reports no file inside the directory as unreachable knowledge, and nothing deposited runs a file inside the directory
