# New Projects

Read when step 2 classified the project as new:
no build or test command, no CI, no hooks, a handful of commits,
nothing that shows a habit.

## Report

State the classification and list the little that was observed
(README, licence, commit count, the language of any source file,
whether the directory is a git repository).
Say plainly that nothing needs preserving.
Then ask only what the repository cannot show:
the goal when the invocation did not give it,
the stack when neither the goal nor a source file shows it,
and the conditions.

## What changes when nothing exists

- **The harness sets the first conventions.**
  With no task runner, commit style, or check set to keep,
  each decision comes from its builder's recommendation
  for the settled conditions.
  A recommendation is decided without asking
  only where the goal or the conditions make it clearly better
  ("published to npm" settles the package registry);
  the rest is asked, recommended option first.
- **The language of management code is asked.**
  Scripts, hooks, and checks written into the project
  are the project's own code, and the user has to be able to read them.
  Recommend the project's own language or its community's usual
  scripting practice; plan no script before the answer.
- **Start thin.** A first harness is a root entrypoint,
  the always-on rules, and the few checks the conditions call for.
  A layer no condition demands stays omitted or light;
  say that it can be raised later when agents hit friction.
- **Specifications start with the first change.**
  The Completion layer decides how the next change is agreed,
  never a back-fill of documents for code that does not exist.

## The skeleton

The planned commands have to run on the day they are committed.
Where the project has no code, the plan lists, under its own heading,
the smallest set of files that makes them run:

- a manifest for the stack the goal names
  (`package.json`, `pyproject.toml`, `Cargo.toml`, …);
- the configuration of each tool a planned check runs;
- the smallest passing test, so that the test command has something to pass;
- a `.gitignore` for the stack.

Nothing else. No module, endpoint, command, or user interface of the product
is written, however small. When a planned command needs a source file
to exist, create the emptiest file the tool accepts.

Every command that installs or downloads a tool or dependency
is listed in the plan with its source,
and runs only after the plan is approved.

## Order of building

- When the directory is not a git repository, the plan says that
  `git init` runs first; the commit convention is then an agreed decision,
  because no history shows one.
- The skeleton is created and committed before the first layer.
- The entrypoint committed with the Knowledge layer names only commands
  that exist at that commit.
  Each later layer adds the commands it creates to the entrypoint
  when it creates them, or hands back a route owed.

Done when: the report lists every observed fact
and states that nothing needs preserving,
every question asked is one the repository cannot answer,
and the plan's skeleton holds no product feature.
