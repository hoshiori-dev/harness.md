# Writing each section

Read when writing or revising any section of a `HARNESS.md`. The standard
is the same everywhere: a reader with only this file can build what the
section describes, knows why, and knows what was left out on purpose. For
each section this file lists what the prose has to settle and where
content that seems to fit two sections goes. The lists are what a complete
section usually covers, not headings to copy: write connected prose and
drop a point that does not apply, saying so when its absence could be read
as an omission.

## Frontmatter

`name` identifies the design, not the project's repository: a reusable
design is named for what it is (`solo-library`), a project's own file may
use the project name. `description` says what the design is and what kind
of project it suits, in words a search would match; it does not summarise
the layers.

## Overview

- Who the harness serves: which people, which agents, doing what kind of
  work.
- What it is meant to achieve, in outcomes ("an agent can take an issue to
  a reviewable pull request without help"), not in mechanisms.
- What it does not police, so nobody builds a check for it later.
- What always stays with a human (merging, releasing, spending, deleting).

## Context

State conditions, not decisions. Each is something the designer cannot
change and the design must fit; each later section argues from them.

- The cost of a wrong change: what breaks and who notices (nothing, a
  teammate's afternoon, users, data, money).
- The maintenance horizon: weeks, a release, years.
- Who relies on the conventions: one person, a team, outside contributors
  whose agents arrive knowing nothing.
- How unattended agents are: watched turn by turn, reviewed between tasks,
  running alone on triggers.
- The code-hosting platform, or that there is none.
- The clients agents run in and the weakest model tier that must be able
  to follow the harness.
- Anything else given: regulated data, an existing CI system, a language
  the team will not leave.

In a reusable design, Context describes the kind of project the design
assumes, and says that a project keeping the file rewrites it first.

## Invariants

Rules that hold on every task and across layers, few enough to be read
every time: each one a single sentence with its reason. For each, say
where it is enforced (a check, a permission, only the entrypoint), because
an invariant nothing enforces is a hope. A rule that belongs to one layer
goes in that layer's section.

## Style

The shape of the codebase that makes it workable for an agent, as
intentions a reviewer could check: how cohesive a module is, which
constraints live in types or schemas instead of in written reminders,
whether every command goes through one entry, how fine-grained and how
fast the tests are, the stance on new dependencies, how errors are
reported. Formatting and naming rules are named by tool ("the formatter's
defaults") and not restated.

## File Structure

The paths the design requires and what each holds: a tree or a table.
Mark which paths are generated and which are hand-written, and which must
not be edited by an agent. It is intent, so it may name paths that do not
exist yet; it is not a listing of the repository.

## Environment

- Where the agent runs (host, container, virtual machine, cloud
  workspace) and how a session gets there.
- What it can reach: the filesystem outside the repository, the network,
  credentials (by name and scope, never by value), other systems.
- The tools it holds beyond editing files and running commands: registered
  tools and MCP servers, preinstalled CLIs it is expected to use, scripts
  and task-runner entries wrapped for agents. For each: what it is for,
  what it can reach, when it is available.
- What is deliberately not provided, and why.
- Which files are the control plane (hooks, permission files, sandbox and
  CI configuration) and how they are kept from being edited casually.
- Defaults that keep commands non-interactive (no pager, no prompts, no
  watch mode).

Which actions those tools may be used for is Authority.

## Knowledge

- The entrypoint file: its name, its size budget, what it contains (the
  always-on rules, the project map, when to read what, the verification
  commands) and what it must not contain.
- The knowledge files: the folder, one line per file saying when an agent
  reads it, and the rule for adding one.
- Project skills: which recurring procedures are packaged, and the test
  for making a new one.
- Where a new fact goes: the code, a comment, a knowledge file, the
  entrypoint, a skill.
- Outside documentation an agent should consult while working.
- What is deliberately not written down because the code already says it.

Sources the author used while designing go in References.

## Feedback

- The commands an agent runs to check its work: the fast one and the full
  one, what each covers, how long each may take.
- What their output looks like: quiet on success, bounded and actionable
  on failure.
- How the agent starts, drives, and observes the system under
  development: running it, driving its interface, reading logs,
  inspecting state.
- Test data and fixtures the agent can rely on.
- A second look in a clean context, when one is used.
- What the agent cannot verify itself and must hand to a human, said
  plainly.

A check that blocks whether or not the agent looked is a Gate; the same
command is often both, and each section then says its own half.

## Gates

- Each deterministic check: what it catches, the tool, where it runs
  (before a commit, in CI, both), and its time budget.
- The single command that runs everything CI runs.
- What a failing check tells the reader: what is wrong and what to do
  instead.
- The rule against weakening a check to get a change through, and how a
  check is legitimately changed.
- What is deliberately not gated, and why.

## Authority

- The classes of action: what an agent does freely, what it does only
  when a design, plan, or spec pre-authorised it, what always waits for a
  human. Examples for each.
- The permission entries: the deny list, the allow list or the rule that
  derives it, per client where clients differ.
- What happens when an action is refused or a decision is the user's: the
  agent finishes what does not depend on it and queues the rest.
- Commits: convention, checkpointing, attribution.
- Branches and merges: naming, who marks a request ready, who merges, the
  merge method, the protection on the default branch.
- Releases: the trigger and who pulls it.
- Platform entities kept (labels, issue forms, request template) and the
  ones deliberately absent.
- Remote settings and who applies them.

With no hosting platform, say so and stop after commits.

## Completion

- How the goal is agreed before work starts: the carrier (a spec tool, a
  per-change document, plan mode) and which changes need it.
- Who approves and how the approval is recorded.
- What counts as done: the checks that must pass, the evidence shown, the
  state the work is left in.
- What the agent does when it cannot finish.

## Entropy

- What keeps harness files true to the code: the self-check and what it
  verifies, the sync rule for each pair of files that must agree.
- What an agent does on finding a contradiction between the harness and
  the code mid-task.
- The periodic review: when, and what it removes.
- Whether this file stays as the anchor document and how it is kept in
  step, or that it is a template to delete after the build.

## Open Questions

Each undecided item with what it blocks and who decides. Remove an item
when it is decided; the decision moves into its section.

## References

Outside material the design drew on, each with a link and a phrase saying
what was taken from it. List only what was actually read.
