# Auditing Gates

Read when running the audit step:
what to look for, and how each finding is classed and disposed.
The source of truth is the anchor document's text about gates
when the project adopted one,
otherwise what the decide step recommends for the project's conditions.

## What to look for

- a check the source of truth names with no hook entry, recipe, or CI job:
  **missing**, **medium** (**high** for the secret scan);
- a check that runs but the anchor document does not name:
  **stale**, **low**, disposition: amend the anchor document to record it or remove the check;
- a check that cannot fail (`|| true`, `continue-on-error`, `allow_failure`,
  a skipped job the gate counts as success, a `paths:`
  filter on the workflow carrying the gate): **contradictory**, **high**;
- a hook slower than the budget (such as running the full test suite before commits):
  **excessive**, **medium**;
- a hook without the secret scan: **missing**, **high**;
- a custom check whose message lacks the rule or the alternative,
  or that passes on unreadable input: **missing**, **medium**;
- CI jobs that run commands differing from the recipes:
  **contradictory** or **duplicated**, **medium**;
- unpinned actions or images: **missing**, **high**;
  a workflow triggered by `pull_request_target` running pull-request code: **contradictory**, **high**;
- check output that arrives as a full log although the tool has a quiet mode:
  **excessive**, **low**;
- a configuration change that weakened a rule
  (`git log -p` on the check configuration:
  a deleted rule, a widened exclusion with no reason): **contradictory**, **high**;
- a design gap: the conditions say a wrong change
  is costly or agents run unattended,
  and the anchor document gates less than the decide step recommends for them:
  **missing**, **medium** (**high** when a safety boundary is missing).

## What each finding carries

Each finding takes the form the skill's rule on findings gives:
class, severity, evidence, source of truth, one proposed disposition.
Evidence is `path:line` or a command and its output;
for a slow hook, the measured or reported time.
The source of truth is the anchor document's sentence,
or the condition that calls for the gate.
The disposition is one of: fix the artifact
(a slow hook: move the tests to CI and a scoped recipe),
or amend the anchor document
(a check that runs but the document does not name; a design gap).
