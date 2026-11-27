# Final Review

Read when the read-back is done.
Check every item against the files on disk,
never against the plan or memory.
Each item ends as **passed**, **passed after a fix** (name the fix),
**not applicable** (with the reason), or a pending decision.
A failing item is fixed and read back.
It is recorded as passed once the fix is committed,
and step 8 runs the project's checks before that commit.

## Traceability

- [ ] Every changed, added, or deleted file is in the approved plan
      or in an amendment the user approved.
- [ ] Every change traces to a finding with an agreed disposition.
- [ ] Nothing the user kept was removed, weakened, or narrowed.
- [ ] Every drift item is resolved, or is in the pending decisions list
      with the files it touches left unchanged.
- [ ] README, CONTRIBUTING, and SECURITY are unchanged
      (`git diff --stat` over the work's commits shows none of them).
- [ ] Nothing was pushed, and no remote setting changed
      without its own go-ahead.

## Self-containment

- [ ] No changed file names this plugin, one of its skills or agents,
      or a path inside a skill directory.
      Search the changed files for those names.
- [ ] No check, hook, CI step, or task-runner recipe calls a script
      inside a skill directory. Where one did, the project has its own copy
      and the user was told that later fixes do not reach it.
- [ ] Every term a changed file uses as if the reader knew it
      (a list of decisions waiting for the user, a thickness word)
      is defined in a project file.
- [ ] No placeholder or fill instruction is left in any file.

## Mechanics

- [ ] Every rule and knowledge file is reachable from the entrypoint;
      the entrypoint is within the budget the project states
      (when it states none: about 100 lines, at most 120).
- [ ] Every link and path in a changed file resolves.
- [ ] Every documented command resolves and the approved verification
      commands were run. Record commands that need a human to run them.
      Each promised recipe is in the task runner, and the scoped test
      returns in seconds when the plan includes one.
- [ ] Commands never wait for input: no pager, no prompt, no watch mode.
- [ ] Every custom check's failure message says how to fix what it found.
- [ ] Each fact lives in one place; where a sync rule exists,
      it names its trigger in both directions.

## Safety

- [ ] The permission files hold no "ask" entry without a recorded reason.
- [ ] No permission entry allows an irreversible or outward action
      (push, publish, release, deletion, remote setting).
- [ ] The files that guard the harness (permission files, security hooks,
      the secret scan, sandbox configuration) are protected
      as the agreed decisions say.
- [ ] Where a secret scan is agreed, it runs on every commit,
      and it ran on this work's commits.
- [ ] Handoff notes and session logs are kept out of git.

## Thickness

- [ ] Each touched layer matches the agreed mechanisms for its confirmed
      thickness, including the checks and enforcement agreed for that layer.
      Nothing was built for an omitted layer.
- [ ] Each untouched layer's rules are unchanged, including in shared files.

## Anchor document

Only when the project has one; otherwise mark the group not applicable.

- [ ] It validates, and the entrypoint names it.
- [ ] Every realised change of intent is in it.
      Deferred changes of intent are in the pending decisions list.
- [ ] Each fact it names matches the code after this work
      (command names, paths).
- [ ] No changed file routes ordinary tasks to it.

Without an anchor document:

- [ ] The project's root still has no `HARNESS.md` this work created.
