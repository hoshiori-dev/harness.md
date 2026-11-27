# Thinning

Read when the agreed work includes thinning,
when a finding is classified excessive,
or when a layer's verdict is "too much".
Excess is quieter than staleness: it never fails,
it only makes agents slower, more cautious,
and busy passing gates.
The trigger is "what this constraint catches no longer occurs".

## Candidates

- A lint rule or custom check for a problem fixed long ago.
- A skill written for a one-off migration that has finished.
- A route for a module that was removed.
- A gate heavier than the layer's confirmed thickness:
  a structure check where the user confirmed lint and tests only;
  a full test suite in the commit hook that belongs in CI.
- Entrypoint content loaded every session that applies to rare tasks:
  move it behind a conditional route instead of deleting it.

## Evidence for each removal

Every removal names three things in the plan:

1. **Constraint**: the file and line (rule id, skill, route, hook).
2. **What it caught**: the problem it was written for,
   from its comment, commit message, or linked issue.
3. **Evidence it no longer occurs**: the removed module or API
   (a search shows no remaining use), the finished migration,
   a check that has not failed in the available history
   (give the range searched), or a stronger check that covers it.

"Nobody remembers why it exists" is not evidence.
Without evidence there is no removal: the item is a question to the user.
A constraint that still catches something stays.

## What the user keeps

When the user keeps a constraint proposed for removal,
record "keep" and their reason on the finding.
No later step removes it, weakens it, moves it to a slower stage,
or narrows what it covers.

## Removal is deletion

Removing a check, a hook, a permission entry, a skill, or a file
is deleting work: each asks for its own go-ahead when reached,
even when the plan lists it.

## Boundary

Changes: the named constraints, and the routes and sync entries
that mention them.
Preserves: every constraint without evidence, every constraint the user kept,
and the thickness of each untouched layer.
A removal that lowers a layer's thickness
(structure checks leaving CI moves Gates from thick to medium)
is shown as such, and the user confirms the new thickness.
