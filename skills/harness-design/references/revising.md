# Revising the Project's Own Design

Read before step 4 when the project keeps `HARNESS.md` as its anchor document
and the design has to change: an audit reported findings,
a failure keeps recurring, the project's Context moved,
or the user wants a layer to do more or less.

The file is a charter that stays frozen for long stretches.
A revision changes the sentences the cause touches and leaves the rest exactly
as written.

## Procedure

1. **State the cause.** One of: findings (list them with their evidence);
   a recurring failure (what happened, how often, which layer let it through);
   a changed condition (which Context sentence is no longer true); a request.
   A cause without evidence is a question to the user before anything
   is drafted.
2. **Update Context first** when a condition changed.
   Then every decision whose reason was the old condition is in scope,
   whichever layer holds it.
3. **Find the owning sections.**
   A recurring failure is fixed in the layer
   that could have stopped it most cheaply and most certainly:
   a check before a hook, a hook before an entrypoint rule,
   an entrypoint rule before a knowledge file.
   An agent that keeps missing a convention
   is rarely cured by stating the convention more loudly.
4. **Redraft only those sections.**
   Hand each to its builder in design mode with the existing section
   and the cause. Ask for the smallest change that answers the cause.
5. **Check the neighbours.** A changed sentence can strand another:
   a tool removed from Environment that Authority still mentions,
   a command renamed in Feedback that Gates still runs.
   Read every section that names what changed.
6. **Facts are corrected, intent is decided.**
   Where the file names a fact the code has moved past (a renamed command,
   a moved directory), correct the file to the code without ceremony
   and list it. Where the code departs from what the file intends,
   the user decides which side changes;
   that is a decision in the approval, never a silent edit.

## Removing a constraint

A revision that makes a layer do less names three things for each removal:
the constraint (file and line, or the sentence of the design);
what it was there to catch;
the evidence that this no longer occurs (the module is gone,
the migration finished, a stronger check covers it).
Without that evidence the constraint stays and the question goes to the user.

## The approval for a revision

Show the difference, not the whole file:
for each changed sentence, the old text, the new text, the cause,
and which artifacts will have to change when the revision is built.
List the sentences corrected as facts separately.
The user approves the difference as one.

After the file is written, nothing in the harness has changed yet.
Say so, and say that the build workflow brings the artifacts
to the revised design.
