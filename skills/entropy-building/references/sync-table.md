# Sync Table

Read when choosing between the table and a sync skill for a concern,
or when writing table rows.

## The choice

Default to the Keep In Sync table when the concerns fit in about ten rows
and each update is linear (change X, edit document Y):
agents reread the entrypoint every session,
so the table needs no trigger to load.
A sync project skill is the alternative for a concern that is frequent, branchy,
or spans several artifacts that must be compared and updated together,
because a skill's description fires on that concern's own words.
Decide per concern; a project may mix. One mechanism owns each concern:
a concern a skill owns has no table row.

A table past about ten rows means the project has enough moving parts
for skills; say so in the section instead of growing it.

## Rows

Derive rows from the copies observed:
the task-runner recipes, the directory layout, the knowledge index,
each mirror pair, each generated file, and, when the project keeps `HARNESS.md`,
the paths its File Structure section requires. Each row states, in one line:

- **the change**, concrete: "a recipe is added, renamed, or removed",
  never "the docs change";
- **the document** and the part of it to update;
- **the check first**: what to run or read before editing that document,
  so the reverse direction is as concrete as the forward one.

A mirror pair's row starts from its confirmed source side:
"a section named in the pair changes in `README.md`"
→ "the same section of `README.zh.md`, in the same change".
An edit made first to the corrected side
is copied back to the source side in the same change, so the source still wins.

## Rules beside the table

- **Standing reverse rule**: before finishing an edit to a harness document,
  run the check of every row naming it and fix or report every mismatch found,
  not only the one that prompted the edit.
  Editing a harness document carries the same verification duty as editing code.
- **Tie-break**: the code or the task runner wins and the document is corrected.
  For a mirror pair of two documents,
  the default source side is the original language,
  and the translation is corrected;
  name the source side in the row and in the tie-break sentence.
  A pair where the user recorded the opposite ruling is named beside the rule,
  never left implicit.

## Existing mechanisms

A populated table or a sync skill already owning a concern stays:
add no second mechanism for it, do not reopen its choice,
and report any contradiction between it and the copies observed,
as a question in design mode and as a finding in audit mode.
Only these two count as existing sync mechanisms;
a reclamation note or a check script owns no concern.
An empty reserved heading is not an existing mechanism; fill it.
