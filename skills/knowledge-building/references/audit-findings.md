# Audit Findings

Read when classifying an audit finding of the Knowledge layer
or choosing its disposition.

## Class and severity

- an invariant or Always rule the source calls for
  that the entrypoint lacks: **missing**, **high**;
- a `CLAUDE.md` that exists without importing `AGENTS.md`
  (Claude Code sees none of the entrypoint's rules): **invisible**, **high**;
  a `CLAUDE.md` stating rules that differ from `AGENTS.md`:
  **contradictory**, **high**;
- a knowledge file no route reaches: **invisible**, **medium**;
- a row whose file is missing; a command or path in the entrypoint
  that the task runner or tree does not have: **stale**, **medium**,
  with the task runner or the tree as source of truth;
- one fact stated in two files;
  content that restates what the code shows: **duplicated**, **medium**;
- a subdirectory entry file carrying safety, commit, or publishing rules
  (it may never load): **invisible**, **medium**;
- an entrypoint over budget; an Always rule that only some tasks need;
  a row routing a task to `HARNESS.md`: **excessive**, **medium**;
- a knowledge file that differs from the anchor document only in wording,
  or a knowledge file's opening line that does not match its routing row word for word:
  **stale**, **low**.

## Disposition

Evidence is `path:line`. Propose one disposition per finding:
fix the artifact when the source of truth still states what the project wants;
amend the anchor document when the project's practice
is the better answer or the document never decided;
for an invisible file, routing, merging, or removing it,
whichever the four questions support, as a decision for the user.
