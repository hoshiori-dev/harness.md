# Generalising Into a Reusable Design

Read when the user asked for a reusable design in addition to the
description: a `HARNESS.md` someone else can put in their project root and
build from. The reusable design is a second file. It is a design, so
unlike the description it may leave out what was wrong in the source; say
which defects were left out.

## Procedure

1. **Copy the description** to the second path and work on the copy.
2. **Restate Context as a kind of project.** Replace this project's facts
   with the conditions under which the design holds: "one maintainer who
   accepts outside contributions; a wrong change costs a bad release;
   maintained for years; agents checked between tasks; hosted on GitHub".
   A reader decides from Context whether the design fits them, so every
   condition a decision depends on has to be there.
3. **Rewrite the introduction** for that kind of project.
4. **Remove what identifies the source.** Project and organisation names,
   people, addresses, internal systems, issue numbers. Replace each with
   its role ("the release workflow", "the default branch") or with a
   clearly marked slot the adopter fills ("the project's test command").
   Keep tool names: a design that says "a linter" cannot be built; one
   that says which linter, and why, can.
5. **Turn every inference into a decision or drop it.** A reusable design
   states what to do and why. For each "inferred" or "reason not recorded"
   mark: when the user can supply the reason, write it; when nobody can,
   either write the decision with the reason you would give and tell the
   user it is yours, or leave the decision out.
6. **Leave out the defects.** Contradictions and stale rules recorded in
   Open Questions are not carried over; list in the hand-over what was
   dropped, so the user knows the design is cleaner than its source.
7. **Keep it buildable.** After the removals, check each layer section
   again: does it still name files, commands, tools, and numbers? A slot
   is acceptable only where the adopter's project must supply the value.
8. **Frontmatter.** `name`: a short name for the design, not the source
   project. `description`: what the design is and the kind of project it
   suits. `license`: ask the user; when the source is someone else's
   project, tell them its licence first. `metadata` is left to the user: a
   hub or another platform defines what goes there.
9. **References.** Name the source the design was extracted from when the
   user is free to disclose it.

## Checks before handing over

- No name, address, or person from the source remains (search for each one
  removed).
- Context states conditions, not one project's facts.
- No sentence says "inferred" or "reason not recorded".
- Every slot is one an adopter can fill from their own repository.
- The file validates.
