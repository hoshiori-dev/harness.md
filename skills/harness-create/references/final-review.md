# Final Review

Read before closing, in step 8.
Check every item against the files on disk and the agreed decisions
as the plan records them, never against memory.
Each item ends as **passed**,
**not applicable** (with the agreed decision that leaves it out,
for example "Entropy: nothing is built"), or a pending decision.
A failing item is fixed, read back, and committed
before it is recorded as passed.

## Self-containment

- [ ] No built file names this plugin, one of its skills or agents,
      or a path inside a skill directory.
      Search the built files for those names and for the phrase `Owns the`.
- [ ] No check, hook, CI step, or task-runner recipe calls a script
      inside a skill directory. Where one does, the project gets its own copy
      and the user is told that later plugin fixes do not reach it.
- [ ] No built file uses "omitted", "light", "medium", or "thick"
      as the name of a setting without defining it there.
- [ ] Every term a built file uses as if the reader knew it
      (for example a list of decisions waiting for the user)
      is defined in a project file.
- [ ] No placeholder (`{{NAME}}`) or fill instruction is left in any file.
- [ ] A root `HARNESS.md` created in this work was explicitly requested
      as an anchor document and the entrypoint names it.
      No reference was copied into the project,
      and no built file routes tasks to a reference.

## The agreement is realised

- [ ] Every agreed decision that calls for an artifact has one,
      or is in the report as not built with the reason.
- [ ] Every file the build wrote is in the plan or in an approved amendment.
- [ ] Nothing was built that no agreed decision covers,
      except what the report lists as an assumption.
- [ ] Every working habit recorded as kept is unchanged:
      the task runner, the lint configuration, the commit convention.
- [ ] README, CONTRIBUTING, and SECURITY are unchanged;
      each contradiction with the harness has a suggested edit in the report.
- [ ] No product feature was written;
      skeleton files are the ones the plan listed.

## Mechanics

- [ ] The always-on rules come first in the entrypoint,
      and its routes are organised by when an agent needs to read what.
- [ ] Every rule and knowledge file is reachable from the entrypoint;
      the entrypoint is within the size the Knowledge decisions state
      (when they state none: about 100 lines, at most 120).
      A client-specific file imports the shared entrypoint
      and keeps only agreed client-specific instructions alongside it.
- [ ] Every link and path in a built file resolves.
- [ ] Every documented command resolves and the approved verification
      commands were run. Record commands that need a human to run them.
      Each promised recipe is in the task runner, and the scoped test
      returns in seconds when the plan includes one.
- [ ] Commands never wait for input: no pager, no prompt, no watch mode.
- [ ] Every custom check's failure message says how to fix what it found.
- [ ] Each fact lives in one place; where a sync rule exists,
      it names its trigger in both directions.
- [ ] Every route owed was placed in the entrypoint.

## Safety

- [ ] The permission files allow what the Authority decisions allow
      and deny what they deny,
      and hold no "ask" entry no decision calls for.
- [ ] No permission entry allows an irreversible or outward action
      (push, publish, release, deletion, remote setting).
- [ ] The files that guard the harness (permission files, security hooks,
      the secret scan, the environment's configuration)
      are protected the way the Environment and Authority decisions say.
- [ ] A secret scan runs on every commit when the Gates decisions call for one,
      and it ran on this build's commits.
- [ ] Handoff notes and session logs are kept out of git.
- [ ] Rules for several agents (worktrees, remote branches, shared resources)
      exist only when the user said several agents write at once.

## Commits and remote

- [ ] One commit per verified layer, in the project's convention,
      with no AI or tool attribution, and no hook was bypassed.
- [ ] Nothing was pushed, and no remote setting, label, or deletion
      was applied, without the user's go-ahead at that step.
- [ ] Every repository setting the decisions call for
      (branch protection, required checks, secret scanning)
      is in the report with the exact setting, and none was applied.
