# Making a Portable Design

Read when the user chose a portable design:
a `HARNESS.md` that someone in another project can read
and build their own harness from.
The reader does not have this project, so the file carries decisions,
not this project. Unlike the as-is description it is a design:
it leaves out what was wrong in the source.

## What a decision needs

Write every decision so that four things can be read from it:

- **the decision**: what is done or forbidden;
- **the reason**: why;
- **the premise**: the condition that has to hold for the reason to apply
  ("because agents run with nobody watching", "because one wrong release
  reaches paying users");
- **the embodiment**: the kind of mechanism that carries it out,
  with the source's own mechanism as an example.

The premise is what lets a reader in another project decide
whether to keep, change, or drop the decision.
A decision without one is copied blindly or not at all.

## Procedure

Work on a copy of each as-is draft. Keep two lists as you go:
**generalised** (each project specific and what replaced it)
and **left out** (each defect, inference, or decision not carried).
Both go into the closing message.

1. **Restate Context as a kind of project.**
   Replace this project's facts with the conditions the design holds under:
   "one maintainer who accepts outside contributions;
   a wrong change costs a bad release; maintained for years;
   agents are checked between tasks; hosted on a platform
   with required checks".
   Every condition a later decision names as its premise has to be there.
   A file that covers only parts and has no Context section
   states the conditions in its introduction.
2. **Rewrite the introduction** for that kind of project.
   A partial file still says which parts it covers and which it leaves out.
3. **Remove what identifies the source.**
   Project, product, and organisation names; people and account names;
   host names, addresses, and internal systems; issue and request numbers.
   Replace each with its role ("the release workflow",
   "the default branch", "the maintainer").
   A directory named after the product becomes a neutral example path.
4. **Turn specifics into examples.**
   State what must be true, then give the source's file name, command,
   or tool as an example: "agents read task-specific documents
   from one directory the entrypoint routes to (for example
   `.agents/knowledge/`)"; "a secret scan runs before every commit
   (for example as a pre-commit hook)".
   Keep a specific as a requirement only where the decision is about
   that very tool or path, and then give the reason.
5. **Resolve every inference.**
   For each sentence marked "inferred" or "reason not recorded",
   ask the user in one round, with your inference as the recommended answer:
   - confirmed by the user: write it as the reason, unmarked;
   - not confirmed, but the decision holds under a condition you can state:
     write that condition as the premise;
   - neither: leave the decision out and add it to the left-out list.
6. **Leave out the defects.**
   Contradictions, stale rules, and unreachable files
   recorded in Open Questions are not carried.
   Where a contradiction hides a real decision, ask the user which side
   is the decision; with no answer, leave both out.
   Open Questions keeps only what an adopter has to settle for themselves.
7. **Remove "nothing found" text.**
   A layer the source has nothing in is left out of the design
   and added to the left-out list;
   the introduction says the design does not cover it.
8. **Frontmatter.** `name`: a short name for the design,
   not the source project's.
   `description`: what the design covers and the kind of project it suits.
   `license`: only the one the user states; ask when the user said
   the file will be shared. Leave `metadata` to the user.
9. **References.** Keep the outside documents the design rests on.
   Do not name the source project.

## Checks before step 6

- Search the file for every name on the generalised list: none remains.
- Search for "inferred" and "reason not recorded": neither remains.
- Every decision has a reason and a premise,
  and every premise appears among the stated conditions.
- Context, or the introduction of a partial file,
  states conditions, not one project's facts.
- Every file name, command, and tool reads as an example
  or carries the reason it is required.
- No credential value, and no mention of where the source keeps one.
- Both lists are ready for the closing message.
