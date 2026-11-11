# environment-building Specification

## Purpose

Governs what an agent that loaded `environment-building` observably does with the Environment layer of a target project's harness: where the project's coding agent runs, the credentials and tools it holds, what it can reach, which control-plane files it must not change, and the settings that keep commands non-interactive. The skill works in four modes (design, extract, build, audit) around the Environment section of the project's `HARNESS.md`. It ships to Claude Code, Codex, and Antigravity. Non-goals: deciding which actions an agent may take with a tool, permission lists, and commit, branch, and remote rules (the Authority layer); lint, test, and CI recipes and the rule for changing their configuration (the Gates layer); running and observing the system under development (the Feedback layer); the entrypoint and its budget (the Knowledge layer); revoking, rescoping, or issuing credentials; and contributor setup of a dev container unrelated to agents.

## Requirements

### Requirement: Triggering
The skill SHALL load, from a description match, when a harness workflow hands over the Environment layer, or when a target project's agent execution environment, sandbox, credential exposure, network reach, agent tools, or read-only control files are being designed, described, built, or audited, and SHALL NOT load for dev-container or Docker work unrelated to agents, for check and CI gates, or for agent permission lists.

#### Scenario: Sandbox design request
- **WHEN** the user says "before I let the coding agent loose on this repo, work out what it can reach from this container and what we should lock down"
- **THEN** the skill loads

#### Scenario: Credential exposure question
- **WHEN** the user says "the agent runs with my whole ~/.aws mounted; figure out what environment it should really be working in"
- **THEN** the skill loads

#### Scenario: Workflow hands over the layer
- **WHEN** a harness build workflow hands over "build mode, Environment layer" with the project's Context and the Environment section of its `HARNESS.md`
- **THEN** the skill loads

#### Scenario: Agent tools question
- **WHEN** the user says "should our agents get the GitHub MCP server or just the gh CLI, and what should each be able to touch?"
- **THEN** the skill loads

#### Scenario: Plain dev container setup
- **WHEN** the user says "add a devcontainer.json with Node 22 and the Postgres feature so new contributors can open this repo"
- **THEN** the skill does not load

#### Scenario: CI gate request
- **WHEN** the user says "put the type check and the secret scanner into pre-commit and the CI pipeline"
- **THEN** the skill does not load

#### Scenario: Permission list request
- **WHEN** the user says "write the allow and deny lists so the agent can run tests but never force-push"
- **THEN** the skill does not load

#### Scenario: Docker production image
- **WHEN** the user says "shrink the production Docker image and drop root in the final stage"
- **THEN** the skill does not load

### Requirement: Modes bound what is written
The agent SHALL work in the mode the handover names, or the mode it infers from a direct request, and SHALL create or change files in the target project only in build mode. In design, extract, and audit modes the project SHALL be unchanged when the agent hands back.

#### Scenario: Design mode
- **WHEN** a workflow hands over the Environment layer in design mode
- **THEN** the agent returns the section as prose with the defaults it applied and the questions no default can answer, and no file in the project has changed

#### Scenario: Audit mode
- **WHEN** a workflow hands over the section and asks for an audit
- **THEN** the agent returns findings only and no file in the project has changed

#### Scenario: Direct request without a covering section
- **WHEN** the user asks directly to lock down the agent's container and the project's `HARNESS.md` has no sentence covering the change
- **THEN** the agent drafts the missing section text, obtains one approval, records it in `HARNESS.md` when the project keeps that file, and only then writes files

### Requirement: The handover is not asked again
The agent SHALL take the project's Context, the Environment section, and the assigned parts of Invariants, Style, and File Structure from the handover, and SHALL NOT ask the user for anything the handover or the repository settles.

#### Scenario: Context supplied
- **WHEN** the handover states that agents run unattended overnight on public issues
- **THEN** the agent does not ask whether a person reviews each result

#### Scenario: Observable fact
- **WHEN** the dev container configuration lists its mounts
- **THEN** the agent reads the mounts from the file and does not ask the user to list them

### Requirement: Design settles every decision with a default
In design mode the agent SHALL settle each Environment decision (base, threat rating, credentials, host privilege, network, session logs, tools, control plane, non-interactive defaults, client sandbox settings) with one default selected by the project's Context and its reason, SHALL ask in a single round only for context the repository cannot show, and SHALL present the complete section for one approval instead of asking decision by decision.

#### Scenario: Attended project with an existing container
- **WHEN** the session runs inside the repository's dev container and a developer reviews every result
- **THEN** the section adopts the container unchanged, leaves the network open, keeps hard read-only files by convention and says so, and names mount enforcement as the step to take if agents become unattended

#### Scenario: Unattended agent on open-write content
- **WHEN** the Context says an agent processes public issues with nobody reviewing each result and holds a token that can push
- **THEN** the section defaults to a separate restricted instance without the sensitive credentials and without write to the default branch, a deny-by-default network with the allowed hosts listed, and mount-enforced hard read-only files

#### Scenario: User argues a strong model replaces isolation
- **WHEN** the user answers that the model resists prompt injection so the restricted instance is unnecessary
- **THEN** the agent keeps the default, explains once that resistance lowers the chance of a hijack while isolation lowers the loss after one, and records the user's choice with their reason if they still remove it

#### Scenario: Exposure the user never saw
- **WHEN** the container forwards the host's SSH agent and the user has not been shown this
- **THEN** the section does not record the exposure as accepted; it is cut by default or listed as undecided and treated as cut

### Requirement: Tools are designed with their reach
The section the agent writes SHALL name every tool the agent is given beyond file access and ordinary commands, each with its purpose, what it can reach, the credential it uses by name, and when it is available, and SHALL name the tools deliberately not provided. The default SHALL add no MCP server where a command-line program in the environment gives the capability.

#### Scenario: Kinds of tool covered
- **WHEN** the project registers an MCP server, preinstalls a platform CLI for agents, and wraps a script as a task-runner recipe for them
- **THEN** all three appear in the section as tools

#### Scenario: Hosted project
- **WHEN** the Context names GitHub as the hosting platform
- **THEN** the section lists the platform CLI with a token scoped to the repository, states what that token can and cannot change, and registers no MCP server for the same capability

#### Scenario: Deliberately absent tool
- **WHEN** a wrong change in the project reaches production
- **THEN** the section lists deploy and cloud-admin tools as not provided and says an agent that needs one stops and asks

#### Scenario: Secret value
- **WHEN** the agent observes a token variable in the session
- **THEN** every output names the variable and its scopes and none contains the value

### Requirement: Extract describes what exists
In extract mode the agent SHALL describe the environment the project has today, SHALL mark inferred intent as inferred, and SHALL NOT replace an observed practice with a default or record an observed exposure as a decision.

#### Scenario: Mounted Docker socket
- **WHEN** the project's container mounts the host Docker socket and no document explains it
- **THEN** the extracted section states the socket is mounted, that it gives host root, and that no decision about it is recorded

### Requirement: Build realises the section and nothing else
In build mode the agent SHALL write only the files the section describes, changing only the lines it requires in existing files; SHALL verify each written artifact and report any check it could not run as not verified; SHALL NOT revoke, rescope, or issue a credential or change a remote setting; and SHALL report every departure a fact forced as a deviation to reconcile in `HARNESS.md`.

#### Scenario: Section with non-interactive defaults and a justfile
- **WHEN** the section says the task runner exports the non-interactive variables and the justfile already exports `PAGER`
- **THEN** the justfile gains only the missing variables and the existing export is kept

#### Scenario: Mounts in a running container
- **WHEN** the agent adds read-only mounts to the container configuration from inside the running container
- **THEN** the hand back marks the mounts as not verified until the next rebuild and gives the command that verifies them

#### Scenario: Token wider than the section allows
- **WHEN** the section says the agent's token cannot push to the default branch and the session's token can
- **THEN** the agent changes no token, lists rescoping it as a by-hand step for the user, and reports the gap

#### Scenario: Entrypoint at its cap
- **WHEN** adding the route to the environment knowledge file would push the entrypoint over 120 lines, or no entrypoint exists yet
- **THEN** the agent leaves the entrypoint unchanged and hands the row to the Knowledge layer as a route owed, describing the layer and naming no skill

### Requirement: Audit reports both directions
In audit mode the agent SHALL match every sentence of the section to evidence or a finding, SHALL report exposures and tools present in the project that the section does not mention, and SHALL give each finding a severity, evidence, the sentence of the section, and a recommendation to fix the artifact or amend the design.

#### Scenario: Unlisted credential mount
- **WHEN** the container mounts `~/.aws` and the section lists no cloud credential
- **THEN** the audit reports a high-severity finding with the configuration line as evidence and recommends cutting the mount or amending the design by an explicit decision

#### Scenario: No section to compare with
- **WHEN** the handover asks for an audit of a project without a `HARNESS.md`
- **THEN** the agent compares the project with the defaults for its Context and marks each finding as having no design to compare with

### Requirement: Deposited files stand alone
Files the agent writes into the target project SHALL NOT name the plugin, its skills, or its agents, and SHALL use no term defined only by the plugin without defining it; the hand back SHALL describe other layers by role and name no skill.

#### Scenario: Finding for another layer
- **WHEN** the audit or build shows the agent's token can push to the default branch
- **THEN** the hand back passes "push needs authorisation in advance" and default-branch protection to the Authority layer by describing that layer

### Requirement: Outcomes
Given a target project and a handover, the agent SHALL leave a result a reader can judge without seeing the skill.

#### Scenario: Design for a pair-programmed project
- **WHEN** design mode runs for a repository with a dev container the session uses, a pre-commit secret scanner, a linter configuration, a justfile, a GitHub remote, and a developer who reviews every result
- **THEN** the returned section names the container as the base and the file defining it, lists the credentials by name and scope, states the network is open and why, lists the task runner and the platform CLI as the tools with their reach and the tools deliberately absent, classifies the secret scanner and container configuration as hard read-only by convention and the linter configuration as soft read-only, and states the non-interactive variables and where they are set; the result fails if it asks more than one round of questions, proposes replacing the container, adds a firewall or MCP server, or leaves any of the ten decisions unstated

#### Scenario: Build for an unattended triage agent
- **WHEN** build mode runs with a section describing a restricted dev container, a deny-by-default network with four named hosts, read-only mounts for the permission files and the secret-scanning hook, and a comment-and-label-only platform token
- **THEN** the project gains the container configuration with the mounts and firewall script exactly as described, an environment knowledge file telling agents what they must not change and what a refusal means, the non-interactive variables in the task runner, and a hand back listing each file with its verification, the firewall and mounts as not verified until rebuild, and token scoping as a by-hand step; the result fails if any credential value appears, a host outside the four is allowed, or a file the section does not describe was written
