# entropy-building Specification

## Purpose

Governs what an agent that loaded `entropy-building` observably does with the Entropy layer of a target project's harness: what keeps the harness true to the code and, when the project keeps `HARNESS.md`, to its own design (one source of truth per fact, the rule for drift found mid-task, sync rules in both directions, the project's own harness self-check, and periodic reclamation). The skill works in four modes (design, extract, build, audit) around the optional Entropy section of the project's `HARNESS.md`. It ships to Claude Code, Codex, and Antigravity. Non-goals: product lint, tests, and CI (the Gates layer); the entrypoint's structure and budget (the Knowledge layer); creating labels or other remote entities (the Authority layer); finishing or testing the project skills a sync or reclamation routine may become; a harness that rewrites its own knowledge from failure history; running canary tasks; validating the format of `HARNESS.md` itself.

## Requirements

### Requirement: Triggering
The skill SHALL load, from a description match, when a harness workflow hands over the Entropy layer or when the means of keeping a project's agent harness in step with its code are being designed, described, built, or audited, and SHALL NOT load for product checks, a one-off fix to one document, synchronisation between product artifacts, or branch hygiene.

#### Scenario: Workflow hands over the layer for build
- **WHEN** a workflow says "Entropy layer, build mode: here is the section and the list of paths File Structure requires"
- **THEN** the skill loads

#### Scenario: Entrypoint drifts from the task runner
- **WHEN** the user says "AGENTS.md keeps describing commands that no longer exist in the justfile; set something up so the harness stays true to the code"
- **THEN** the skill loads

#### Scenario: Long-lived harness cleanup
- **WHEN** the user says "this harness has grown for two years; design a routine that finds dead rules and over-thick constraints"
- **THEN** the skill loads

#### Scenario: Audit of the sync mechanisms
- **WHEN** a workflow says "audit mode: does what keeps this harness in sync still match the Entropy section?"
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

### Requirement: Behavior: The mode decides what is written
The agent SHALL work in the mode the handover names or the request implies. In design and extract mode it SHALL return the text of the Entropy section and write no file; in audit mode it SHALL return findings and write no file; only in build mode SHALL it change files in the project.

#### Scenario: Extract mode
- **WHEN** a workflow hands over the layer in extract mode on a repository with a populated sync table and a harness check script
- **THEN** the agent returns a section describing both and what each covers, marks unstated intent as inferred, and changes no file

#### Scenario: Audit mode runs the existing check
- **WHEN** audit mode runs on a project that has a harness self-check recipe
- **THEN** the agent runs it, includes its findings among its own with a severity of high, medium, or low and evidence, and changes no file

### Requirement: Behavior: An absent section means the layer is omitted
When the project's `HARNESS.md` has no Entropy section
and covers the subject nowhere else,
the agent in build or audit mode SHALL report that the design omits the layer.
In build mode it SHALL write nothing except removing a reserved,
empty keep-in-sync heading and its marker from the entrypoint.
In audit mode it SHALL add one finding
when the project nevertheless runs a harness check or sync rule.

#### Scenario: Build with no section
- **WHEN** build mode runs on a design without an Entropy section and the entrypoint holds an empty reserved keep-in-sync heading
- **THEN** the heading and its marker are removed, no script, recipe, or routine is created, and the hand back says "omitted by the design"

### Requirement: Behavior: Copies are inventoried before any mechanism
In every mode the agent SHALL list every fact the harness states in more than one place with the single source each should have, and every copy that cannot become a reference as a mirror pair with its source side, before it proposes, builds, or judges any mechanism.

#### Scenario: Command described in two documents
- **WHEN** the entrypoint and a knowledge file both spell out the flags of the test command
- **THEN** the agent names the task-runner recipe as the single source and the reference that replaces each copy

#### Scenario: Translation pair
- **WHEN** the repository holds `README.md` and `README.zh.md`
- **THEN** the agent lists them as a mirror pair with the original language as the source side and the sections that must match

### Requirement: Behavior: Design applies one default per decision
In design mode the agent SHALL settle every decision of the layer with one default selected by the project's Context and state the selecting fact: whether the section exists, which side wins a disagreement, what an agent does on finding drift, how each copy is kept in step, the self-check and its wiring, the status of the design document, and reclamation. It SHALL NOT interview the user decision by decision.

#### Scenario: Throwaway prototype
- **WHEN** Context says the project will be discarded within a quarter and only its author relies on its conventions
- **THEN** the agent recommends omitting the section and gives that reason

#### Scenario: Long-lived project with unattended agents
- **WHEN** Context says the project is maintained for years, several people rely on its conventions, and agents work unattended
- **THEN** the section carries the three drift dispositions, a sync mechanism per concern, a self-check wired into the task runner and CI with the gate depending on it, and a reclamation routine anchored to a named event with a cadence

#### Scenario: Maintained past a release by a small team
- **WHEN** Context says the project outlives one release, two people rely on its conventions, and a wrong change is cheap to undo
- **THEN** the section carries a sync table and a self-check in the aggregate check and CI, does not make the gate depend on it, and says reclamation is left out and what would add it

### Requirement: Behavior: The section stands on its own
The section the agent returns SHALL be plain prose that a reader without this plugin could build from: which side wins a disagreement, each mirror pair with its source side, what an agent does on finding drift and where the trace goes, each concern kept in step and by what, what the self-check verifies and where it runs, whether `HARNESS.md` is kept, and the reclamation event and cadence, with the reason beside each choice.

#### Scenario: Clean-context reader
- **WHEN** a reader who has never seen the skill reads only the returned section and is asked what to do on finding a stale command in a knowledge file
- **THEN** the reader names the dispositions and their criteria and says a remark in the conversation does not count

### Requirement: Behavior: A kept design document is held in step with the harness
When the section says the project keeps `HARNESS.md`, the agent in build mode SHALL configure the self-check to require the file and every path handed over from the File Structure section, SHALL take those paths only from the handed-over list and never by parsing prose, and SHALL add re-reading the design against the harness to the reclamation routine. When the section says the file was a template and is deleted, it SHALL configure none of this.

#### Scenario: Required path removed later
- **WHEN** a directory the File Structure section requires is deleted after the build
- **THEN** the project's self-check reports that path as required by the design and missing

#### Scenario: Template deleted after the build
- **WHEN** the section says `HARNESS.md` was used as a template and deleted
- **THEN** the deposited check has no design document and no required paths configured, and neither the sync section nor the reclamation routine mentions the file

#### Scenario: No path list in the handover
- **WHEN** build mode runs with a kept design document and the handover carries no list of required paths
- **THEN** the agent asks for the list or reports the gap, and writes no path it guessed from the section's prose

#### Scenario: Validator inside a skill directory
- **WHEN** the only format validator available lies inside an installed skill's directory
- **THEN** the agent leaves format validation unconfigured and reports that the format is not checked mechanically, instead of pointing the project's check at that script

### Requirement: Behavior: Build deposits project-owned mechanisms
In build mode the agent SHALL fill the entrypoint's one keep-in-sync section, SHALL deposit the self-check among the project's own management scripts with its recipe, aggregate-check hookup, and CI job as the section says, SHALL run it once and hand back its output verbatim, and SHALL hand sync or reclamation project skills to the skill that writes project skills by role. It SHALL create no label and change no remote setting.

#### Scenario: Reserved section present
- **WHEN** the entrypoint holds the keep-in-sync marker under a reserved heading
- **THEN** the content replaces the marker, the heading stays, and the entrypoint has exactly one sync section

#### Scenario: Entrypoint cannot take the section
- **WHEN** the project has no entrypoint yet, or the keep-in-sync content would break its line budget
- **THEN** the agent writes nothing into the entrypoint and hands the content back for the layer that owns Knowledge

#### Scenario: First run reports findings
- **WHEN** the deposited self-check reports stale paths on its first run
- **THEN** the agent hands back each finding as printed for a per-finding decision and does not edit the check's logic to make it pass

#### Scenario: Project scripts in another language
- **WHEN** the design names TypeScript as the project's management language
- **THEN** the deposited check is a port with the same settings, rule ids, messages, JSON shape, and exit codes

#### Scenario: Drift label needed
- **WHEN** the section names a drift label that does not exist on the remote
- **THEN** the label appears in the hand back as a remote item and the agent creates nothing on the remote

### Requirement: Behavior: Reclamation thins and never self-edits
A reclamation routine the agent installs SHALL carry the hunt list with the thinning signal "what this constraint blocks no longer occurs", an anchor event, a cadence, and an absolute `Last run:` date set by a first sweep. Thinning SHALL need the user's approval, and repeated agent failures SHALL yield a reported pattern and recommendation, never an automatic edit.

#### Scenario: Thinning candidate
- **WHEN** the first sweep finds a lint rule for a bug fixed long ago that has blocked nothing since
- **THEN** it is reported with the disposition "thin" and its evidence, and removed only after the user approves

#### Scenario: Cleanup prompted by an agent failure
- **WHEN** a run is prompted by agents repeatedly failing on one instruction
- **THEN** the routine reports the pattern and a recommendation and edits no knowledge on that basis alone

### Requirement: Behavior: Session logs are secrets and canaries are manual
When the user asks for agent-friction tracking or canary tasks, the agent SHALL treat session logs as secrets that stay local, SHALL present any centralised collection as the user's exposure decision, and SHALL offer canary tasks only as a manual list, never wired into CI.

#### Scenario: Canaries asked for CI
- **WHEN** the user asks to run canary agent tasks in CI after every harness change
- **THEN** the agent declines with the two reasons (no credentials in CI, cost) and offers the manual list

### Requirement: Outcomes
Given a project and a handover, the agent SHALL leave every decision traceable to the section, the Context, or an observed fact, and every deposited mechanism reachable from the entrypoint and owned by the project.

#### Scenario: Build with a sync table and a self-check
- **WHEN** build mode runs with a section naming a sync table, the three drift dispositions, a Python self-check under `scripts/` run by `just harness-check`, and a kept `HARNESS.md`
- **THEN** the entrypoint holds one keep-in-sync section with the dispositions, the ruling rule, and complete rows; the script exists with every setting filled, including the required paths and the design document; the recipe is part of the aggregate check and a CI job runs it; the first output is in the hand back; and nothing deposited calls a file inside a skill directory

#### Scenario: Design for a long-lived project
- **WHEN** design mode runs for a project maintained for years with a monthly release
- **THEN** the returned section includes a reclamation routine anchored to the release with a monthly cadence, each applied default with the Context fact behind it, and no file in the project changed

#### Scenario: Audit of a neglected harness
- **WHEN** audit mode runs on a project whose reclamation says "Last run: never" after a year and whose CI calls a check script inside a skill directory
- **THEN** the findings include both with evidence, the first as an artifact to fix and the second with a project-owned copy as the fix, and no file changed

### Requirement: Script: check_harness.py
The delivered self-check SHALL be read-only and configured by a settings block at its top. It SHALL print JSON findings (file, line, rule, problem, fix) on stdout and one line per finding on stderr, and exit 0 with no finding, 1 with findings, and 2 on bad arguments or an unusable setting. Tier 1 SHALL cover document links and paths, task-runner mentions, knowledge reachability, mirror pairs, required paths, and the design document; tier 2 SHALL cover skill frontmatter and the entrypoint budget.

#### Scenario: Stale recipe mention
- **WHEN** the entrypoint mentions a task-runner recipe the runner does not have
- **THEN** a `doc-recipe` finding names the file, the line, and the fix, and the exit code is 1

#### Scenario: Mirror pair out of step
- **WHEN** a configured section of the corrected file lacks a code span the source file has
- **THEN** a `mirror-pair` finding names the corrected file and says to edit it to match the source side

#### Scenario: Required path missing
- **WHEN** a configured required path ending in a slash exists only as a file, or does not exist
- **THEN** a `required-path` finding names it and says to create it or amend the design first

#### Scenario: Design document fails its validator
- **WHEN** the configured validator exits non-zero on the design document
- **THEN** a `design-format` finding carries the first lines of its output, and the exit code is 1

#### Scenario: Validator inside a skill directory
- **WHEN** the configured validator command names a file that lies under a directory holding `SKILL.md`
- **THEN** the script prints nothing on stdout, explains on stderr that the project must hold its own copy, and exits 2

#### Scenario: Configured path missing
- **WHEN** a configured knowledge directory does not exist
- **THEN** the script names the setting and the path on stderr and exits 2 instead of skipping the check

#### Scenario: Clean repository
- **WHEN** the script runs twice on a repository with no drift
- **THEN** both runs exit 0 with a count of zero and no file is written
