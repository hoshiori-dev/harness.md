# Error Routing for Custom Checks

Read when writing or porting a project-specific hook, structure check,
or lint rule, or a filter the user insisted on.

A custom check's failure is the most precise context an agent will get
at that moment. "Forbidden: X" makes the agent guess;
"X is forbidden, do Y, the rule is in Z" turns the block into guidance.

## The message

Every failure follows
[assets/check-message-style.md](../assets/check-message-style.md):
the location, what is wrong, the rule and where it is written,
and what to do instead.
A rule with no stated alternative is not ready to be a check:
in design mode it becomes an open question;
in build mode it becomes a pending decision and the check is not written.

## The reference implementation

[assets/check_boundaries.py](../assets/check_boundaries.py)
is a working import-direction check
(Python and TypeScript or JavaScript sources), standard library only,
with its tests
beside it in
[assets/check_boundaries_test.py](../assets/check_boundaries_test.py).
Use it when the section states an import-direction rule:

- **The script language is Python**:
  copy both files into the project's scripts directory, set the `# CONFIGURE:`
  lines (rules, module roots, aliases), and run it with `python3`.
- **Another language**: port it, keeping the command-line contract,
  the JSON on stdout, the message shape, and the exit codes;
  the test file lists the behaviours the port must keep.

Path aliases (`@/infra`, `~infra`)
resolve only through the aliases the configuration lists;
add every alias the project's `tsconfig.json` or bundler defines.

Other structure rules (a file kind allowed only in one directory, a size limit,
a banned call) follow the same contract with their own detection.

## Errors are not passes

- An input the check cannot open is an error that names the file and the reason,
  exit 1, never a skip.
- A configuration that names a directory that does not exist is an error,
  not "nothing to check".
- No `except Exception: pass`, no `|| true`,
  no default value standing in for data the check could not read.
- Bad arguments exit 2 with usage on stderr and touch nothing.

## Naming

Name the check for its role (`check_boundaries.py`),
never for a plugin or a tool vendor.
