# Starting, Driving, and Observing the System

Read when the project is anything other than a library: the section or the
build needs a way to start the system, act on it as a user would, and see
what it did.

A passing unit test shows that a function returns what the test expects.
It does not show that the feature works. Agents left with only unit tests
call features done that fail on first use; given a way to use the feature
and look at the result, they find and fix those failures themselves.

## By kind of system

| Kind | Start | Drive | Observe |
|---|---|---|---|
| Library | nothing to start | the tests | test output |
| Command-line tool | build, then run the binary | sample inputs kept in the repository | stdout, exit code, files written, compared with expected output |
| Service or API | one start command, a readiness probe, a stop command | a smoke request per user-visible path | the response, the service log, the local database |
| Web interface | the same, plus the dev server | a browser-driving tool: navigate, click, type | screenshots, the page's text or DOM, the browser console, network errors |
| Mobile or desktop application | a simulator or emulator when the environment has one | its automation tool | screenshots; otherwise a human verifies |
| Data pipeline | one run on a small fixed input | the run command | row counts and a sample of the output, compared with expected values |
| Infrastructure code | never applied by the agent | the tool's plan or dry-run command | the plan output |

## Starting it

The start command is one recipe an agent can run without a person:

- **Non-interactive.** No prompt, no watch-mode keypress, no browser
  window opened.
- **Returns control.** It starts the process in the background, writes its
  output to a log file in an ignored directory, and records the process id.
- **Waits for readiness.** It polls a health URL or the port, with a
  bounded number of tries, prints `ready` with the address, and on timeout
  prints an `ERROR` line with the last log lines and exits non-zero.
- **Idempotent.** A second run finds the process alive and says so.
- **Has a twin that stops it**, leaving no process and no port in use.

The address and port are stated, never discovered by trial. When the
Context says several agents work at the same time, each working copy gets
its own port and its own data (a port taken from an environment variable,
a database name derived from the directory), or two agents will test each
other's changes.

Services the system needs (a database, a queue) start from the same
recipe or from one named beside it. Calls to outside services go to a
fake, a recorded response, or a sandbox account with a spending limit;
never to production, and never with a production credential.

## Driving it

Prefer what runs from the shell: a smoke script, a recorded request, a
scripted browser run through a recipe. Any client can run it, the command
is visible in the task runner, and one example line in the knowledge file
is enough for an agent to adapt it.

A web interface needs more than requests: something has to load the page
and act on it. Two forms, either or both:

- **A scripted browser**, such as a Playwright script or test run by a
  recipe, with a screenshot command (`npx playwright screenshot <url>
  <file>`) for one-off looks.
- **A browser tool registered with the client**, for exploring a page
  step by step. Registering it is the work of the layer that owns
  Environment; this layer says what it is used to verify.

When a mockup or a previous screenshot exists, the agent puts its
screenshot beside it and compares; "the page loads" is not the check.

## Observing it

- **Logs.** State where the log is written. Read it bounded: the last
  lines, or the lines carrying the error word. A `logs` recipe that prints
  the tail is enough.
- **The local database.** A read-only query path against local data (a
  recipe that runs one statement), with the development credential. Never
  a production connection string in a recipe or a knowledge file.
- **Traces and metrics.** Only when the project already runs a local
  stack for them; then name the query command. Do not add a stack for the
  agent's sake in a project that is cheap to break.
- **The browser.** Console errors and failed requests are part of the
  observation, not only the picture.

## What stays invisible

Write down what the tools here cannot see, so the agent reports it
instead of claiming it: native dialogs and permission prompts, layout on
real devices, animation and timing, anything behind a login the agent has
no test account for, email and payment flows that end outside the system,
behaviour under production data or load. Each goes into the section's
human verification list with the manual steps.
