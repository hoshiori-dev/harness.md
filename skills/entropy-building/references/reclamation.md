# Reclamation

Read when writing the reclamation decision of the section,
when installing or filling the routine, or when a long-lived project has none.

Sync rules catch drift at edit time; reclamation catches what nobody edited.
The default is on for a project maintained for years or one whose harness
is heavy (many knowledge files, project skills, and checks),
and off for anything shorter-lived.
In audit mode, a long-lived project without it is a finding
with "amend the design" as the fix; install nothing until the section says so.

## What the routine carries

- **The hunt**: stale or dead content (run the commands, open the paths),
  rules the code contradicts, duplicated rules,
  content unreachable from the entrypoint, triggers that cannot fire,
  over-thick constraints,
  the drift issues or drift file the correction-report rule fills, and,
  when the project keeps `HARNESS.md`, the design read against the harness.
- **The thinning signal**: "what this constraint blocks no longer occurs".
  A lint rule for a bug fixed long ago that has blocked nothing since
  is reported with the disposition "thin" and the evidence (rule, history,
  zero hits), and removed only after the user approves.
  Over-thickness never fails loudly; it makes agents slower and more cautious,
  so it is hunted on purpose.
- **Dispositions**: update, reconnect, merge, thin, or delete,
  one per finding with its evidence.
  Thinning needs the user's approval of the finding and its evidence;
  deletion needs current, unambiguous evidence (a path that does not exist,
  a command that fails) or the user's approval.
  A change to what `HARNESS.md` intends is always the user's.
- **Cadence anchored to a team rhythm**: a release, a retro, a sprint end.
  Monthly for fast-moving projects, quarterly for slower ones;
  the anchor gives the routine a trigger instead of an intention.
- **`Last run:`** with an absolute date.
  The installation runs the first sweep and sets it to that day;
  "never" stays only when the user defers that sweep,
  recorded as a pending decision.

## Form

Default: a dated section in a knowledge file the entrypoint routes to
([the section shape](../assets/reclamation-section.md)),
because the sweep is a linear checklist.
A project skill ([the skill shape](../assets/reclamation-skill.md)) fits
when the harness has many skills or the sweep branches by component;
hand that shape to the skill that writes project skills with the hunt,
thinning signal, cadence, `Last run:`, and dispositions filled in,
and do not finish it yourself.

## Failure-prompted cleanup

When repeated agent failures on one instruction prompt a run,
the routine reports the failure pattern and a recommendation
and makes no automatic edit to knowledge:
a harness that rewrites itself from failure history needs controls
(review gates, rollback, audit trail) this harness does not have.
