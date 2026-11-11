# Sources of Truth

Read when a fact is recorded in more than one place, when the design and
the code disagree, when the user asks whether a copy is safe, or when a
harness deliberately keeps two copies.

## Design and code

A project that keeps `HARNESS.md` has two sources, and they answer
different questions.

- **Design intent comes from `HARNESS.md`.** What the harness should be and
  why. When an artifact (an entrypoint, a permission file, a hook, a check)
  disagrees with it, fix the artifact, or change `HARNESS.md` first and
  then the artifact. Never leave the two apart.
- **Facts come from the code.** What a command does, whether a path exists,
  what a check actually runs. When `HARNESS.md` names a fact the code has
  moved past, the file is corrected to match.

`HARNESS.md` is not an entrypoint and is not loaded for ordinary tasks. It
is opened to build the harness, to check it for drift, and to change it. A
project may also delete it once the harness is built; then the artifacts
are the only record and the rules below apply among them.

## Which place is the source of a fact

Code before documents. The file system is the source for layout, the
task-runner recipe for a command and its flags, the type signature for an
interface, the code comment for local counter-intuitive logic. A document
is the source only for what code cannot state: why something is done, and
when to read what. A fact copied from code into a document is a copy that
will expire.

## One fact, one place

Every fact lives in one place; every other place points at it. Of the two
diseases of a harness, drifting from the code is a missed update, but
internal contradiction is almost always one fact written in two places and
updated in one. Contradiction is worse: an agent facing two versions has no
basis to choose and believes one at random.

A client-specific entrypoint that imports the shared one (`CLAUDE.md`
holding only `@AGENTS.md`) instead of copying it is this rule applied.
Where every client in use reads the shared entrypoint directly, the import
file is not needed at all.

## The adjudication rule

Wherever two places still state one fact, the harness writes down which
wins. Code (the recipe, the file system, the type) wins over any document;
among documents, the place the routing table declares as the home of that
fact wins. The rule is written per fact, next to the fact or in the routing
table, never derived from file type.

Example: the entrypoint, a knowledge file, and a README each list the test
command with different flags. The source is the task-runner recipe; every
document names only the recipe (`just test`), and the flags exist in one
place.

## Triggers in both directions

A sync rule names a trigger, or it is not a rule. Forward: when this part
of the code changes, update these harness files. Reverse: after editing a
harness file, verify the facts it now claims (the command it describes runs
as described; the directory it names exists as written). The reverse
direction is the one people forget, because editing a document does not
feel like a change that needs verifying.

## Deviations must land

A contradiction an agent finds must land somewhere durable: fixed in place
when small and within the task's authority, queued for the user when the
intent is unclear, tracked as an issue when large. A mention in
conversation disappears with the conversation.

## Copies that cannot be pointers

Some copies are forced (a README in two languages, a specification copied
into a package). They are compensated by a mirror check in the harness
self-check: it fails when the pair diverges and names both files.

## When the user wants to keep two copies

Do not rewrite the files. State the contradiction, the rule it breaks, and
the mirror check that would compensate for the deliberate copy. Challenge
once with the evidence, then answer within the user's choice.
