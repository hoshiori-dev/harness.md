Read this before starting a change that alters behaviour,
before writing or approving a spec, and before freezing a record.

# Specification Workflow

<!-- # CONFIGURE: on GitLab write "merge request" wherever this file says "pull request"; delete this line. -->

Specs here are {{LIFETIME}}. <!-- # CONFIGURE: {{LIFETIME}}: "the living description of the system: every change updates them" or "written to build one change and archived with it", followed by the fact that decided it, e.g. "the project is maintained for years". -->
Tool: {{TOOL}}. <!-- # CONFIGURE: {{TOOL}}: OpenSpec, Spec-Kit, the framework kept, or "a SPEC.md and PLAN.md committed with each change, plan mode for one-file changes", with the fact that decided it. -->

## Where specs live

{{SPEC_LOCATIONS}} <!-- # CONFIGURE: {{SPEC_LOCATIONS}}: the verified paths for living specs, one change in progress, and the archive; for per-change documents, where SPEC.md and PLAN.md sit and when plan mode is enough. -->

Behaviour lives in the specs; this file, the entrypoint, issues,
and pull request bodies link to them and never restate them.

{{NOT_AUTHORITATIVE}} <!-- # CONFIGURE: {{NOT_AUTHORITATIVE}}: delete when no contradiction is left open; otherwise "Not yet authoritative: <spec path>. It disagrees with <code path>; trust the code until it is fixed." -->

## What every spec answers

1. How done is judged: scenarios or a final check the agent runs itself,
   including "no draft commit left on the branch".
2. What is not done: the non-goals.
3. What is delivered: the pull request, report, or deployment,
   and the list of decisions that waited on a person.
4. Which irreversible actions are pre-authorised for this change:
   which branch may be pushed, whether comments or a pull request may be opened.

And every spec obeys four rules:

- Each goal has at least one scenario a reader who never saw the code can judge;
  at least one scenario in the spec covers a failure or edge path.
- Non-goals are written down.
- Goals describe behaviour, never the diff.
- Verification runs the scenarios and records the results;
  reading the diff is not verification.

{{HEADINGS}} <!-- # CONFIGURE: {{HEADINGS}}: per-change documents only: "Every SPEC.md or PLAN.md carries these headings: ..." with the five headings (Done when, Not doing, Delivers, Pre-authorised, Scenarios), each followed by the answers and rules it holds; for a framework, delete and say which of the tool's files answers each item. -->

## Approval

Approval is given {{MODE}}. <!-- # CONFIGURE: {{MODE}}: "in the conversation: <owner> closes each review there" or "on the pull request: the first by the `spec:approved` label, the second by the awaiting-archive check and the freeze". -->

1. The spec, and its design when more than one approach is reasonable or the
   change touches structure, interfaces, or dependencies, is approved by
   {{OWNER}} before any task list is written. The draft pull request opens <!-- # CONFIGURE: {{OWNER}}: a role or name, never "the team". -->
   when the spec is complete, and the agent stops there until approval.
2. When the last task is verified, the pull request is marked ready with the
   record still open. After the review closes, {{FREEZER}} freezes the <!-- # CONFIGURE: {{FREEZER}}: "the implementer, or a maintainer who pulled the fork's branch". -->
   record on the pull request's branch: the change is archived, merged into
   the living specs, or declared frozen at a named commit. A commit after
   the freeze reopens the review. Tasks follow the first approval; the
   freeze follows the review of the ready pull request.

{{RECORDED}} <!-- # CONFIGURE: {{RECORDED}}: approval on the pull request: "A person with write access adds `spec:approved`; it records the version approved and is removed automatically when the spec or design changes afterwards, so it is taken again. The awaiting-archive check stays red on a ready pull request until the freeze; that is the merge block." Approval in the conversation: "Nothing revokes a closing: before pushing or handing over, compare the branch tip with the freeze commit and ask again when they differ." -->

No job approves or freezes a record; a person on the branch does.

## Changes that carry no spec

A change to this project's own harness, tooling, checks, workflows, or
documents carries no spec. {{SPECLESS}} <!-- # CONFIGURE: {{SPECLESS}}: name the tool's marker for such a change when the project records one, and "`<self-check command>` covers it" when a harness self-check exists; otherwise delete. -->
Specs cover behaviour a change touches; nothing is back-filled for code no
change touches.

## Checks while working

- After every edit: `{{FAST_CHECK}}` (seconds, one file or the diff). <!-- # CONFIGURE: {{FAST_CHECK}}: the scoped command, run once before it is written here; delete the line when none exists. -->
- At the end of every task: `{{FULL_CHECK}}`. <!-- # CONFIGURE: {{FULL_CHECK}}: the project's full check. -->
- Remove every exploratory worktree and branch as soon as its evaluation
  ends; keep only the attempt chosen.
- Use the tool's task list for progress; keep no separate diary.

## Handoff notes

Session handoff and scratch notes go in `{{HANDOFF_DIR}}` and never enter <!-- # CONFIGURE: {{HANDOFF_DIR}}: `.agents/handoff/` (gitignored) or "the system temporary directory". -->
version control: they carry logs, environment values, and credentials more
often than code does.

## Update this file when

- The tool is upgraded, replaced, or its layout moves.
- How long specs live, an approval owner,
  or the way approval is recorded changes.
- A second copy of any fact here appears; merge it back.
- The scoped or the full check changes.
