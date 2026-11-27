# Audit Findings

Read in audit mode, before judging the project against its baseline.

Report a finding when:

- a mechanism the baseline calls for is absent,
  is not wired where it should be (recipe, aggregate check, CI, gate),
  or no longer runs (missing);
- a self-check the baseline keeps advisory fails the gate,
  a required job, or a hook (contradictory);
- the layer is too thin for the conditions: no self-check on a harness
  several people and unattended agents depend on (missing);
- the layer is too thick for them: a monthly sweep and a gated self-check
  on a project nobody else relies on (excessive);
- a mechanism exists that the anchor document does not describe
  (**stale**, **low**; disposition: amend the anchor document to record it or remove the mechanism);
- a table row or sync skill names a document, recipe,
  or path that no longer exists (stale);
- two mechanisms own one concern, or a fact is stated in two places
  and nothing keeps the copies in step (duplicated);
- the reclamation's `Last run:` is older than its cadence, or "never"
  (stale; the disposition is to run the sweep);
- a CI step or script calls a file inside a skill directory
  (missing: the project's own copy; that copy is the disposition);
- a deposited mechanism is reachable from no entrypoint route (invisible);
- with an anchor document only: a path its File Structure section requires
  is missing (missing), or the self-check's required paths
  and that section disagree (contradictory).
  Without one, check nothing about a design document.

The source of truth is the code or the task runner for a fact,
and the anchor document, or failing one the conditions, for intent.
Where a mechanism and the anchor document disagree on intent,
propose fixing the mechanism, or changing the document
by the user's explicit decision;
put changing the document first only when the code shows
its sentence can no longer be built.
