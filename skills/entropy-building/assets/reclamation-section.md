## Harness Reclamation

Run at every monthly release, before tagging. Last run: never. <!-- # CONFIGURE: the anchor event and cadence the section names; the absolute date of the first sweep (YYYY-MM-DD), "never" only while the user defers it. -->

Walk the entrypoint, every knowledge file, every project skill, and the open
`type:harness-drift` issues, and hunt: <!-- # CONFIGURE: the drift label, or `.agents/drift.md` without an issue tracker. -->

1. Stale or dead content: run every documented command, open every path and
   link; do not trust them.
2. Rules the code now contradicts.
3. The same rule stated in two places; keep one owner, point the others.
4. Content no pointer from the entrypoint reaches.
5. Triggers that can no longer fire: a skill or row whose subject moved or
   vanished.
6. Over-thick constraints. The thinning signal is "what this constraint
   blocks no longer occurs": a lint rule for a long-fixed bug that has
   blocked nothing since, a skill for a finished migration, a route to a
   retired module.
7. Design drift: read `HARNESS.md` section by section against the harness. <!-- # CONFIGURE: delete item 7 when the project keeps no HARNESS.md. -->
   Where a harness file departs from what a section intends, fix the file,
   or change `HARNESS.md` first and then the file. Where the code shows a
   sentence of `HARNESS.md` is no longer true as a fact (a command, a
   path), correct the sentence. Rewrite its Context section when the
   project's situation changed (team size, how unattended agents are, the
   hosting platform), then reconsider every section that leaned on the old
   one.

Give every finding one disposition: update, reconnect, merge, thin, or
delete, with its evidence. Thin only after the user approves the finding and
its evidence; delete only on current, unambiguous evidence (a path that does
not exist, a command that fails) or the user's approval; otherwise report
it. A change to what `HARNESS.md` intends is the user's decision, never the
sweep's. When repeated agent failures on one instruction prompted the run,
report the pattern and a recommendation and edit nothing on that basis
alone.

Close the run by updating `Last run:` to today's absolute date and closing
the drift issues it resolved.
