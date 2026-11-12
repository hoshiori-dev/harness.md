# Designing Over Existing Habits

Read when the repository shows any habit or agent-facing file:
a build or test command, a task runner, CI, a hook,
a branch or commit convention, an entrypoint, a permission file.
The risk is turning a harness design into a project overhaul:
an ideal structure that replaces the layout, commands, and checks the team uses,
until the design describes a project nobody recognises.

## Three principles

1. **Observe before designing.** Start from what the project states itself:
   layout, commands, checks, entry files, history.
   Ask only what it cannot state: decisions, risk tolerance,
   which existing behaviour is deliberate.
2. **Working choices are the design.**
   A task runner, lint configuration,
   or branch habit in use is written into the design as it is.
   A replacement with a clear reason and a reasonable cost goes
   into Open Questions as a suggestion for a separate change.
3. **Design the difference.** For each layer, state what exists,
   then what Context calls for, and design only what closes the gap.
   A first design for an inherited project
   is often one root entrypoint and a few routes to the documents
   and commands it already has.

## Inventory

For every agent-facing file, project skill, permission file, hook, check,
and registered tool, record four facts:

- **found by**: how a future agent finds it (always loaded by the client,
  a route in an entrypoint, a skill description, nothing);
- **loads when**: at session start, on a matching path, on a description match,
  never;
- **source of truth**:
  the file or system that owns the facts it states (the task runner,
  CI configuration, a manifest), or none;
- **kept current by**: a check, a sync rule, a person, or nothing.

With no agent-facing file at all, the inventory records only the task runner,
the checks, and the conventions the design will keep.

## Problems found on the way

Classify each, with evidence, and hand it to the layer it belongs to in step 5:

| Class | Meaning | Where it goes in the design |
| --- | --- | --- |
| stale | states something no longer true | the owning layer's section says what replaces it |
| duplicated | the same fact in two places, one a copy | the owning layer names the one source |
| contradictory | two sources of intent disagree and neither is clearly the copy | Open Questions, and a question in the step 3 round when a default depends on it |
| invisible | exists but no agent will find it | Knowledge routes to it, or the design drops it |
| missing | Context calls for it and nothing exists | the owning layer's section designs it |
| excessive | constrains something that no longer occurs | the owning layer's section leaves it out and says why |

A contradiction between a rule and the history
(a file demands one commit convention,
the log shows another) is asked in the round before any section depends on it.
When the chosen side leaves README, CONTRIBUTING,
or SECURITY contradicting the design, record a suggested edit in Open Questions;
do not edit the file.

Done when: every existing artifact has its four facts and,
where it has a problem, one class with evidence;
every working choice is recorded as kept.
