# Tools

Read when the project registers or needs any tool beyond the task runner
and the hosting platform's CLI, or when writing the tools paragraph of the
section.

A tool is any capability the agent is given beyond reading and writing
files and running ordinary commands. Three kinds, checked in this order
because each later kind costs more:

| Kind | Cost | Use when |
|---|---|---|
| Task-runner recipes and scripts written for agents | none while unused; self-described by the runner's list | the project needs a repeatable command, a digest of noisy output, or a safe wrapper around a risky one |
| Command-line programs preinstalled in the environment | an install line; models already know the common ones | the work touches an outside system that has a CLI (hosting platform, cloud, database) |
| Tools and MCP servers registered with the client | their descriptions load into context on every task; a server is a process with its own reach and credential | no command-line program gives the capability (driving a browser, a service with no CLI) |

## What the section says about each tool

One entry per tool, in prose or a table:

- **name and purpose**: what the agent uses it for;
- **reach**: read-only or with side effects; which systems outside the
  repository it touches;
- **credential**: the variable or file it authenticates with, by name, and
  that credential's scopes;
- **availability**: always, or only in a named environment or client;
- **carrier**: the file that installs or registers it.

Then one sentence listing the tools deliberately not provided, with the
reason, and what an agent does when it needs one (stop and ask; never
install it).

A tool the section lists says only that the agent can reach it. Whether an
action with it needs a person belongs to the layer that owns Authority;
using it to start, drive, and observe the system under development belongs
to the layer that owns Feedback. Hand both over by describing the layer.

## Defaults by Context

- **Hosted project**: preinstall the platform's CLI. Give it a token scoped
  to this repository. When no person reviews each result, the token cannot
  push to the default branch or change settings.
- **A wrong change reaches production, customer data, or money**: no
  deploy, cloud-admin, publish, or production-database tool in the agent's
  environment; those run in CI or by a person.
- **A UI or service the agent must observe to verify its work**: the tool
  that drives it (a browser driver, an API client) is provided here and its
  use is described by the Feedback layer.
- **Documentation the agent should consult**: a documentation host on the
  network allowlist is enough; add a lookup tool only when plain fetching
  fails.

## Registering a tool

Register in the client's project-scoped configuration, tracked in the
repository, so every session gets the same set. Known carriers: Claude Code
reads MCP servers from `.mcp.json` in the repository root; Codex reads
`[mcp_servers.<name>]` tables from its `config.toml`. Clients change these
locations: confirm the file and key in the client's current documentation
before writing, and for any other client look it up instead of guessing.

- Pin the server's version; never register one that runs unpinned code
  from a registry at start.
- Pass credentials by environment variable name, never inline.
- A tool-registration file is a hard read-only control-plane file: add it
  to that list.
- An MCP server's tool descriptions are content the agent did not write.
  Register only servers whose source the user trusts as much as a
  dependency, and say so in the section.

## Wrapper scripts and recipes

An agent-facing wrapper goes in the project's management-script directory
and is reached through a task-runner recipe. It takes input from flags,
never prompts, prints the result on stdout and diagnostics on stderr, exits
0, 1, or 2 (success, finding or error, bad arguments), and prints a short
summary when the raw output would run long. A wrapper around a tool with
side effects states in its `--help` what it changes.
