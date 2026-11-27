# Hardening

Read when the agreed work includes hardening:
a prototype, demo, or experiment becomes a long-lived product,
or a condition moved toward more risk.
Hardening has three parts.
Each part is its own decision the user confirms, never a bundle,
and each raises the thickness of the layers it names
only as far as the conditions call for.

## 1. Record the stable structure

Write the directory structure and commands that have stopped changing
into the entrypoint or an architecture file it routes to,
from the code as it is, never as it should become.
Leave out what the file system already shows;
record what it does not: boundaries, which directories are stable,
which stay experimental.
Layer: Knowledge.

## 2. Add the gates and protect the guard files

- Formatting and a secret scan come first;
  they are the floor of every Gates thickness above omitted.
- Type, lint, and test checks go into the commit hook (the parts that
  take seconds) and CI (the rest), using the tools the project already has.
  Propose a tool only where none exists, with the ecosystem's options.
- The configuration of those checks changes only through a reviewed change,
  and the entrypoint says so.
- The files that guard the harness are protected from agents:
  sandbox and container configuration, secret-scan hooks,
  client permission files, the written policy.
  Agents cannot edit them; changes go through the user.
- Each check an agent is expected to pass, the agent can also run:
  one command, output that names the error and where to look.

Layers: Gates (the checks), Feedback (running and reading them),
Environment (the sandbox files), Authority (the permission files).

## 3. Clear leftovers and install sync

- List exploration leftovers: temporary scripts (`scripts/tmp_*`,
  scratch notebooks), dead experiment directories,
  notes that describe abandoned approaches.
  Each is removed or kept by the user's explicit decision;
  a deletion is never implied by the plan.
- Install sync rules in both directions and a harness self-check
  wired into the task runner and CI.
  The self-check is the project's own code.

Layer: Entropy.

## Boundary

Changes: the checks, the entrypoint's structure section,
protection of the guard files, the leftovers, sync.
Preserves: the task runner, the existing lint configuration,
the branching habit, the commit convention, and all application code.
The plan adds only what the confirmed thicknesses require.
