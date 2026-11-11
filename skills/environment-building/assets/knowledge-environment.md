Read this when a command hangs or prompts, before touching a credential, a mount, a container or sandbox file, a security hook, or a lint, test, type-check, or build configuration, when a tool you expected is missing, and when asked what this environment can reach.

# Agent Environment

The design behind these rules is the Environment section of `HARNESS.md`; change that first, never this file alone. <!-- # CONFIGURE: delete this sentence when the project does not keep `HARNESS.md`. -->

## Where you run

{{BASE}} <!-- # CONFIGURE: {{BASE}}: one or two sentences: the environment ("the dev container in `.devcontainer/`", "the developer's host") and what it can reach on the network ("open", or "only the hosts listed in `<firewall script>`"). -->

## Credentials

{{CREDENTIALS}} <!-- # CONFIGURE: {{CREDENTIALS}}: one line per credential the agent holds: the variable or file name, the system, the scopes. Names only, never a value. -->

Never print, copy, or commit a credential's value. Never widen a token or add a credential; ask the owner.

## Tools

| Tool | Use it for | Reaches |
|---|---|---|
| {{TOOL}} | {{PURPOSE}} | {{REACH}} | <!-- # CONFIGURE: one row per tool the section lists beyond the task runner: registered tools and servers, preinstalled CLIs, wrapper recipes; reach says read-only or what it changes, and where. -->

Not provided on purpose: {{ABSENT_TOOLS}}. When a task needs one, stop and report; do not install it. <!-- # CONFIGURE: {{ABSENT_TOOLS}}: the tools the section withholds; delete the paragraph when it withholds none. -->

## Files you must not change

Never change these; when one blocks the work, stop and report.

{{HARD_READ_ONLY}} <!-- # CONFIGURE: {{HARD_READ_ONLY}}: one line per hard read-only file with how it is enforced ("read-only mount" or "by convention"). -->

Change these only under the rule in {{GATES_KNOWLEDGE}}: <!-- # CONFIGURE: {{GATES_KNOWLEDGE}}: the path where the project's rule for changing check configuration lives. -->

{{SOFT_READ_ONLY}} <!-- # CONFIGURE: {{SOFT_READ_ONLY}}: one line per soft read-only file. -->

A refusal from a security rule, a read-only mount, or the network is a policy boundary, not a fault: do not retry it by another route; report it with the action that was refused.

## Non-interactive commands

{{RUNNER_RULE}} <!-- # CONFIGURE: {{RUNNER_RULE}}: with a task runner: "Run project commands through the task runner's recipes; it exports `CI=true`, `PAGER=cat`, `GIT_PAGER=cat`, and `GIT_TERMINAL_PROMPT=0`. When running a tool directly, set the same variables on the command line."; without one: "Set `CI=true`, `PAGER=cat`, `GIT_PAGER=cat`, and `GIT_TERMINAL_PROMPT=0` on each command." -->

{{FLAGS}} <!-- # CONFIGURE: {{FLAGS}}: per-command flags a recipe still needs (the test command's run-once flag) and recipes `CI=true` changes; delete when there are none. -->
