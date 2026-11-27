# environment-building Specification

## Purpose

Governs what an agent that loaded `environment-building` observably does with the Environment layer of a target project's harness: where the project's coding agent runs, the credentials and tools it holds, what it can reach, which control-plane files it must not change, and the settings that keep commands non-interactive. The skill works in four modes (design, extract, build, audit) around the Environment section of the project's `HARNESS.md`. It ships to Claude Code, Codex, and Antigravity. Non-goals: deciding which actions an agent may take with a tool, permission lists, and commit, branch, and remote rules (the Authority layer); lint, test, and CI recipes and the rule for changing their configuration (the Gates layer); running and observing the system under development (the Feedback layer); the entrypoint and its budget (the Knowledge layer); revoking, rescoping, or issuing credentials; and contributor setup of a dev container unrelated to agents.

## Requirements

### Requirement: Triggering
The skill SHALL load, from a description match, when a harness entry hands over the Environment layer, or when a target project's agent execution environment, sandbox, credential exposure, network reach, agent tools, or read-only control files are being decided, described, built, or audited, and SHALL NOT load for dev-container or Docker work unrelated to agents, for check and CI gates, or for agent permission lists.

#### Scenario: Sandbox design request
- **WHEN** the user says "before I let the coding agent loose on this repo, work out what it can reach from this container and what we should lock down"
- **THEN** the skill loads

#### Scenario: Credential exposure question
- **WHEN** the user says "the agent runs with my whole ~/.aws mounted; figure out what environment it should really be working in"
- **THEN** the skill loads

#### Scenario: Workflow hands over the layer
- **WHEN** a harness entry hands over "build mode, Environment layer" with the project's conditions and the decisions agreed for the layer
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

### Requirement: The handover is not asked again
The agent SHALL take the goal, the project's conditions, the layer's thickness and agreed decisions, and the files the plan lists for the layer from the handover, and SHALL NOT ask the user for anything the handover or the repository settles.

#### Scenario: Context supplied
- **WHEN** the handover states that agents run unattended overnight on public issues
- **THEN** the agent does not ask whether a person reviews each result

#### Scenario: Observable fact
- **WHEN** the dev container configuration lists its mounts
- **THEN** the agent reads the mounts from the file and does not ask the user to list them

### Requirement: Tools are designed with their reach
The decisions the agent returns, and any description it writes, SHALL name every tool the agent is given beyond file access and ordinary commands, each with its purpose, what it can reach, the credential it uses by name, and when it is available, and SHALL name the tools deliberately not provided. The recommendation SHALL add no MCP server where a command-line program in the environment gives the capability.

#### Scenario: Kinds of tool covered
- **WHEN** the project registers an MCP server, preinstalls a platform CLI for agents, and wraps a script as a task-runner recipe for them
- **THEN** all three appear as tools

#### Scenario: Hosted project
- **WHEN** the conditions name GitHub as the hosting platform
- **THEN** the decisions list the platform CLI with a token scoped to the repository, state what that token can and cannot change, and register no MCP server for the same capability

#### Scenario: Deliberately absent tool
- **WHEN** a wrong change in the project reaches production
- **THEN** the decisions list deploy and cloud-admin tools as not provided and say an agent that needs one stops and asks

#### Scenario: Secret value
- **WHEN** the agent observes a token variable in the session
- **THEN** every output names the variable and its scopes and none contains the value

### Requirement: Audit reports both directions
In audit mode the agent SHALL compare the project with the anchor document's text for the layer when the project adopted one, and otherwise with what the project's conditions call for; SHALL report exposures and tools present in the project that nothing accounts for; and SHALL give each finding a class, a severity, evidence, the source of truth, and a proposed disposition.

#### Scenario: Unlisted credential mount
- **WHEN** the container mounts `~/.aws` and no decision or document accounts for a cloud credential
- **THEN** the audit reports a high-severity finding with the configuration line as evidence and proposes cutting the mount or accepting it by an explicit decision

#### Scenario: No section to compare with
- **WHEN** the handover asks for an audit of a project that has adopted no anchor document
- **THEN** the agent compares the project with what its conditions call for and marks each finding as having no recorded design to compare with

### Requirement: Deposited files stand alone
Files the agent writes into the target project SHALL NOT name the plugin, its skills, or its agents, and SHALL use no term defined only by the plugin without defining it; the hand back SHALL describe other layers by role and name no skill.

#### Scenario: Finding for another layer
- **WHEN** the audit or build shows the agent's token can push to the default branch
- **THEN** the hand back passes "push needs authorisation in advance" and default-branch protection to the Authority layer by describing that layer

### Requirement: Outcomes
Given a target project and a handover, the agent SHALL leave a result a reader can judge without seeing the skill.

#### Scenario: Design for a pair-programmed project
- **WHEN** decide mode runs for a repository with a dev container the session uses, a pre-commit secret scanner, a linter configuration, a justfile, a GitHub remote, and a developer who reviews every result
- **THEN** the hand back recommends a thickness with its reasons and returns as settled, each with its evidence: the container as the base and the file defining it, the credentials by name and scope, the open network and why, the task runner and the platform CLI as the tools with their reach and the tools deliberately absent, the secret scanner and container configuration as hard read-only by convention and the linter configuration as soft read-only, and the non-interactive variables and where they are set; the result fails if it asks the user anything the repository shows, proposes replacing the container, adds a firewall or MCP server, leaves any of the ten decisions neither settled nor open, or changes a file

#### Scenario: Build for an unattended triage agent
- **WHEN** build mode runs with agreed decisions for a restricted dev container, a deny-by-default network with four named hosts, read-only mounts for the permission files and the secret-scanning hook, and a comment-and-label-only platform token
- **THEN** the project gains the container configuration with the mounts and firewall script exactly as agreed, an environment knowledge file telling agents what they must not change and what a refusal means, the non-interactive variables in the task runner, and a hand back listing each file with its verification, the firewall and mounts as not verified until rebuild, and token scoping as a by-hand step; the result fails if any credential value appears, a host outside the four is allowed, or a file the plan does not list was written

### Requirement: Only build mode writes
The agent SHALL work in the mode the handover names (decide, describe, build, audit), or the mode it infers from a direct request, and SHALL create or change files in the target project only in build mode. In the other modes the project SHALL be unchanged when the agent hands back.

#### Scenario: Decide mode
- **WHEN** an entry hands over the Environment layer in decide mode
- **THEN** the agent returns a recommended thickness and the layer's decisions, and no file in the project has changed

#### Scenario: Audit mode
- **WHEN** an entry asks for an audit of the layer
- **THEN** the agent returns findings only and no file in the project has changed

#### Scenario: Direct request
- **WHEN** the user asks directly to lock down the agent's container, with no entry running
- **THEN** the agent shows what it decided on the evidence, asks the open decisions through the client's question tool where there is one, and writes files only after the user accepted what was shown

#### Scenario: Direct request in a project with an anchor document
- **WHEN** the same direct request changes what the project's adopted anchor `HARNESS.md` says about the environment
- **THEN** the accepted change is also written to that document in the same piece of work

### Requirement: Decide returns the layer's decisions
In decide mode the agent SHALL return a recommended thickness with its reasons and each Environment decision (base, threat rating, credentials, host privilege, network, session logs, tools, control plane, non-interactive defaults, client sandbox settings) either as settled, with the evidence that settles it, or as open, with its options, the recommended one first, its reason, and the decisions it depends on. Handed over by an entry it SHALL ask the user nothing itself.

#### Scenario: Attended project with an existing container
- **WHEN** the session runs inside the repository's dev container and a developer reviews every result
- **THEN** the hand back settles on the evidence: adopt the container unchanged, leave the network open, keep hard read-only files by convention, and names mount enforcement as the step to take if agents become unattended

#### Scenario: Unattended agent on open-write content
- **WHEN** the conditions say an agent processes public issues with nobody reviewing each result and holds a token that can push
- **THEN** the hand back recommends thick and, as recommended options, a separate restricted instance without the sensitive credentials and without write to the default branch, a deny-by-default network with the allowed hosts listed, and mount-enforced hard read-only files

#### Scenario: User argues a strong model replaces isolation
- **WHEN** the user answers that the model resists prompt injection so the restricted instance is unnecessary
- **THEN** the recommendation stands, it is explained once that resistance lowers the chance of a hijack while isolation lowers the loss after one, and the user's choice is recorded with their reason if they still remove it

#### Scenario: Exposure the user never saw
- **WHEN** the container forwards the host's SSH agent and the user has not been shown this
- **THEN** the exposure is returned as an open decision with cutting it recommended, never as settled or accepted

### Requirement: Describe states what exists
In describe mode the agent SHALL describe the environment the project has today as prose fit for a `HARNESS.md`, SHALL mark inferred intent as inferred, and SHALL NOT replace an observed practice with a recommendation or record an observed exposure as a decision.

#### Scenario: Mounted Docker socket
- **WHEN** the project's container mounts the host Docker socket and no document explains it
- **THEN** the description states the socket is mounted, that it gives host root, and that no decision about it is recorded

### Requirement: Build realises the agreed decisions and nothing else
In build mode the agent SHALL write only the files the plan lists for the layer, changing only the lines the agreed decisions require in existing files; SHALL verify each written artifact and report any check it could not run as not verified; SHALL NOT revoke, rescope, or issue a credential or change a remote setting; and SHALL report every departure a fact forced as a deviation for the entry to put to the user.

#### Scenario: Non-interactive defaults and an existing justfile
- **WHEN** the agreed decision is that the task runner exports the non-interactive variables and the justfile already exports `PAGER`
- **THEN** the justfile gains only the missing variables and the existing export is kept

#### Scenario: Mounts in a running container
- **WHEN** the agent adds read-only mounts to the container configuration from inside the running container
- **THEN** the hand back marks the mounts as not verified until the next rebuild and gives the command that verifies them

#### Scenario: Token wider than agreed
- **WHEN** the agreed decision is that the agent's token cannot push to the default branch and the session's token can
- **THEN** the agent changes no token, lists rescoping it as a by-hand step for the user, and reports the gap

#### Scenario: Entrypoint at its cap
- **WHEN** adding the route to the environment knowledge file would push the entrypoint over 120 lines, or no entrypoint exists yet
- **THEN** the agent leaves the entrypoint unchanged and hands the row to the Knowledge layer as a route owed, describing the layer and naming no skill

#### Scenario: Plan only
- **WHEN** a build handover asks for the plan only
- **THEN** the agent returns the files it would create, change, or delete, each by path with one line on its shape, and writes nothing
