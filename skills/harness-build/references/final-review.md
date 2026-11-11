# Final Review

Read in step 7. Check every item against the files on disk and against the
text of `HARNESS.md`, never against the plan or memory. Each item ends as
**passed**, **not applicable** (the design says the project does nothing
there, or the section is absent), or a pending decision. A failing item is
fixed, read back, and committed before it is recorded as passed.

## Self-containment

- [ ] No built file names this plugin, one of its skills or agents, or a
      path inside a skill directory. Search the built files for those
      names and for the phrase `Owns the`.
- [ ] No check, hook, CI step, or task-runner recipe calls a script inside
      a skill directory. Where one does, the project gets its own copy and
      the user is told that later plugin fixes do not reach it.
- [ ] Every term a built file uses as if the reader knew it (for example
      a list of decisions waiting for the user) is defined in a project
      file.
- [ ] No placeholder (`{{NAME}}`) or fill instruction is left in any file.

## The design is realised

- [ ] Every sentence of every layer section that calls for an artifact has
      one, or is in the report as not built with the reason.
- [ ] Every invariant is upheld where the plan assigned it: stated in the
      entrypoint, enforced by a check, or denied in the permission files.
- [ ] Every path File Structure requires exists.
- [ ] Nothing was built that the design does not describe and the plan did
      not list as an assumption.

## Mechanics

- [ ] Every rule and knowledge file is reachable from the entrypoint; the
      entrypoint is within the budget the Knowledge section states (when it
      states none: about 100 lines, at most 120).
- [ ] Every link and path in a built file resolves.
- [ ] Every command a built file documents exists in the task runner and
      runs; the fast, scoped test command returns in seconds.
- [ ] Commands never wait for input: no pager, no prompt, no watch mode.
- [ ] Every custom check's failure message says how to fix what it found.
- [ ] Each fact lives in one place; where a sync rule exists, it names its
      trigger in both directions.

## Safety

- [ ] The permission files allow what the Authority section allows and deny
      what it denies, and hold no "ask" entry the section does not call
      for.
- [ ] No permission entry allows an irreversible or outward action (push,
      publish, release, deletion, remote setting); those are authorised in
      advance in a plan or queued for the user.
- [ ] The files that guard the harness (permission files, security hooks,
      the secret scan, sandbox configuration) are protected the way the
      Environment and Authority sections say.
- [ ] A secret scan runs on every commit when the Gates section calls for
      one, and it ran on this build's commits.
- [ ] Handoff notes and session logs are kept out of git.

## `HARNESS.md` itself

- [ ] It validates.
- [ ] Its Context describes this project.
- [ ] No built file routes ordinary tasks to it. When the entrypoint names
      it, the line says it is for harness checks and changes.
- [ ] Each fact it names matches the code after this build (command names,
      paths).
