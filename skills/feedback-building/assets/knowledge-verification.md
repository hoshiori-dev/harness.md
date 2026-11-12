# Verifying Work

Read this before calling a task done, when a check fails,
or when the running system must be inspected.

## Commands

<!-- # CONFIGURE: keep only the rows the design names; durations are the measured ones. -->

| When | Command | Takes | Prints |
|---|---|---|---|
| After every small change | `just check-fast` | about 10 s | one line on success; only the failures otherwise |
| One test file or directory | `just test-fast <path>` | seconds | the same |
| Before calling a task done | `just check` | about 4 min | the same; the full log path on failure |

A red result is fixed in the code. Never change a test, an expected output,
or a threshold to make it green.

## Running the system

{{RUN}} <!-- # CONFIGURE: {{RUN}}: the start recipe, the address it answers on, the readiness line it prints, the stop recipe, the services it needs, and the smoke recipe; delete the heading for a library. -->

## Looking at it

{{OBSERVE}} <!-- # CONFIGURE: {{OBSERVE}}: one line per observation tool with an example command (the log tail, a read-only database query, a screenshot of a page) and what it is used to verify; delete the heading when none. -->

## Tests

{{TESTS}} <!-- # CONFIGURE: {{TESTS}}: the level tests are written at, where fixtures live, the seed and reset command, the command that updates golden files, and the quarantine marker; delete what the design does not name. -->

A bug fix starts with a test or a script that fails for the reported reason.

## Evidence

A finished task reports the commands that were run and the tail of their
output, or the path of the screenshot. {{EVIDENCE_PLACE}} <!-- # CONFIGURE: {{EVIDENCE_PLACE}}: where the evidence goes (the final message; the pull or merge request text). -->

## Review

{{REVIEW}} <!-- # CONFIGURE: {{REVIEW}}: when the reviewer runs, how it is started, and that its result is part of the evidence; each self-check step with its numbered questions; or the sentence recording that the client has no subagents; delete the heading when the design has no review. -->

## A human verifies

{{HUMAN}} <!-- # CONFIGURE: {{HUMAN}}: one line per thing an agent cannot verify here, with the manual steps; the agent reports each as unverified. -->
