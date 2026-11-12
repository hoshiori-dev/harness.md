# Observation and Canaries

Read when the user asks to track agent friction (failing tool calls,
retry loops), to collect session logs,
or to run representative agent tasks after harness changes.

## Session logs are secrets

Client session logs (JSONL transcripts, hook output,
OpenTelemetry traces) hold prompts, file contents, and sometimes credentials.
Treat them as secrets:

- they stay out of the repository (gitignored) and off shared drives;
- analysis runs on the local machine, or on a redacted copy;
- centralised collection is an exposure-surface decision for the user,
  presented with what would leave the machine and who could read it,
  and never configured silently.

For friction tracking, write a local analysis into the section:
count the tool calls that fail or retry most often in the local logs,
then fix the script or add the missing sentence they point to.
The secret-handling rule goes where the harness keeps observation guidance
(the environment knowledge file, or the reclamation section when none exists).
No log leaves the machine without the user's explicit decision at that moment.

## Canary tasks are manual

A canary list is a handful of representative past tasks,
each with its source commit, the expected outcome, and how to judge it,
re-run by hand after a major harness refactor to catch a change
that made agents worse.

- Offer it only to large projects whose harness is heavy,
  and only when they opt in;
  never to a project whose Entropy section is the one drift sentence.
- Never wire it into CI: CI has no credentials to run agent tasks,
  and repeated runs cost too much. When asked for CI wiring,
  decline with these two reasons and offer the manual list the team triggers
  after major harness refactors.
