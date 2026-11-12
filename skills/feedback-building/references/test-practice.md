# Tests an Agent Can Trust

Read when the section covers test granularity, fixtures, seed data,
or golden files, when Style hands over sentences about tests,
or when an audit finds tests that fail on a second run.

A test suite is the nearest thing an agent has to a definition of right.
When the suite is wrong or flaky,
the agent solves the wrong problem with confidence.

## Granularity

Take the level from Style when it states one. Otherwise:

- Pure logic gets unit tests beside the code.
- Each boundary the system has (HTTP handler, command-line entry,
  database access, message consumer) gets at least one test
  that goes through the boundary, against a local instance or a fake.
- One smoke path per user-visible feature runs against the started system.
- No test exists only to raise a coverage number.

A project that will be thrown away may say that only the smoke path is tested,
and why.

## Reproduce first

A bug fix starts with something that fails for the reported reason:
a test when the suite can express it, otherwise a script or a recorded request.
The agent runs it, sees it fail, fixes the code, and sees it pass.
A fix with no failing reproduction is reported as unverified.

## Determinism

- No network: outside calls are faked or recorded.
- No wall clock: time is injected or frozen.
- Randomness is seeded, and the seed is printed on failure.
- No order dependence: each test builds what it needs and can run alone.
- A test that fails without a code change
  is quarantined under a named marker with an issue, not retried until green;
  the knowledge file lists the marker.

## Fixtures and seed data

- Fixtures live in one stated directory and are small enough to read.
- A seed command brings local data to a known state and can be run again
  at any time; a reset is the same command.
- Seed data is invented. Nothing is copied from production.

## Golden files, snapshots, and oracles

A golden file is an expected output kept in the repository;
an oracle is a trusted implementation the output is compared with
(the previous version, a reference tool).

- Golden files are updated only by a named command,
  never by the ordinary test command,
  so a failing comparison cannot be made green by rerunning.
- An update is a change like any other:
  the diff of the golden file is read and justified in the evidence.
- When a trusted implementation exists,
  comparing with it beats writing expected values by hand.

## What an agent may not do to a test

Deleting a test, loosening an assertion,
or regenerating a golden file to make a failing check pass is the one move
that removes the feedback this layer exists to give.
The rule that forbids it is written by the layer that owns Gates;
when no such rule exists in the project, say so in the hand back.
