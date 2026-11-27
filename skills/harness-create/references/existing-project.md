# Existing Projects

Read when step 2 classified the project as existing:
any build or test command, task runner, CI, hook, branch or commit habit,
or agent-facing file.
The risk is turning a harness build into a project overhaul:
an ideal structure that replaces the layout, commands, and checks in use,
until the harness describes a project nobody recognises.

## Three principles

1. **Observe before deciding.** Start from what the project states itself:
   layout, commands, checks, entry files, history.
   Ask only what it cannot state:
   the conditions, and which existing behaviour is deliberate.
2. **Working choices are decisions already made.**
   A task runner, lint configuration, branch habit, commit convention,
   or spec tool in use is recorded as the decision, decided by the evidence,
   and shown in its round. It is never asked about.
   A replacement with a clear reason and a reasonable cost
   is listed once among the suggestions for separate changes.
3. **Plan the difference.** For each layer, state what exists,
   then what the conditions call for, and plan only what closes the gap.
   A first harness for an inherited project is often one root entrypoint
   and a few routes to the documents and commands it already has.

## Inventory

For every agent-facing file, project skill, permission file, hook, check,
and registered tool, record four facts:

- **found by**: how a future agent finds it (always loaded by the client,
  a route in an entrypoint, a skill description, nothing);
- **loads when**: at session start, on a matching path,
  on a description match, never;
- **source of truth**: the file or system that owns the facts it states
  (the task runner, the CI configuration, a manifest), or none;
- **kept current by**: a check, a sync rule, a person, or nothing.

With no agent-facing file at all, the inventory records only
the task runner, the checks, and the conventions the harness will keep
and route to.

Hand each layer's part of the inventory to its builder
as what was observed for the layer.

## Problems found on the way

Give each problem one class, with its evidence
(a file and line, or the output of a command that was run):

| Class | Meaning | What the plan does |
| --- | --- | --- |
| stale | states something the code or the tools no longer do (`CLAUDE.md` names `make test-all`; the `Makefile` has no such target) | corrects the statement to what the code does, in the owning layer's checkpoint |
| duplicated | one fact kept in two places with nothing holding them equal | keeps the source, routes to it, removes the copy |
| contradictory | two statements of intent that cannot both hold (a file demands one commit convention, the history shows another) | nothing until the user chose a side: ask in the round before any decision depends on it |
| invisible | exists, but no route or load condition reaches it | routes to it, or lists it for removal, as the user chooses |
| missing | the conditions call for it and it is absent | creates it |
| excessive | a constraint with evidence that what it guarded against no longer occurs | leaves it; thinning is a suggestion for a separate change |

When the side the user chose leaves README, CONTRIBUTING, or SECURITY
contradicting the harness, record a suggested edit for the closing report;
do not edit the file.

When the inventory shows an entrypoint with routes, knowledge files, checks,
and permission files, a working harness is present:
say that `harness-improve` fits better and ask which entry the user wants.

## How the plan treats what exists

Put every existing artifact in one of four groups:

| Group | Meaning | Plan |
| --- | --- | --- |
| kept | it works and a decision records it | nothing; list it as already there |
| changed | it exists and an agreed decision needs it to do something else | the change, with the decision and who made it |
| absent | an agreed decision has nothing realising it | create it |
| outside the plan | it exists and no decision mentions it | leave it; list it with one line on what it does |

An artifact outside the plan is never deleted or rewritten by the build.

- **An old client-specific entry file** (a lone `CLAUDE.md`):
  its rules move into the new entrypoint or a knowledge file,
  each rule checked against the code first;
  the file then imports the entrypoint.
  The plan names, for every rule, its old home and its new one.
  No rule is dropped in a move without the user's decision,
  and the old copy leaves in the same checkpoint that adds the new one.
- **Removing anything** (a file, a check, a permission entry)
  is deleting work: it needs its own go-ahead when the build reaches it,
  even when the plan lists it. The plan names what the thing was there
  to catch and why the agreed decisions no longer want it.
- **Contradictions first.**
  A contradiction the user settled is repaired
  before anything is built on the contradicted files.
  When the user wants to leave one open,
  add it to the pending decisions list
  and leave every contradicted file out of the plan.

## Checkpoints

Run the project's existing checks before the first change
and record the result,
so that a failure after a layer is known to be new.
A check that already fails is reported and never loosened or repaired here.
One commit per layer, in the convention the history shows;
a layer that only moves things is still its own commit.

Done when: every existing artifact has its four facts
and, where it has a problem, one class with evidence;
every working choice is recorded as a decision with its evidence;
every proposed replacement is listed as a suggestion for a separate change.
