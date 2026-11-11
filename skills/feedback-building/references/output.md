# Output an Agent Can Act On

Read when writing any check or test command or its flags, when a check
floods the agent with a log, or when setting time budgets.

Everything a command prints becomes context the agent carries for the rest
of the session. A passing check that prints two hundred lines costs two
hundred lines on every run; a failing check that prints a full log buries
the one line that matters.

## The shape

- **Success**: one summary line (what ran, how many, how long), exit 0.
- **Failure**: only the failures. Each names the file and line, what was
  expected, and what happened, and stays within about a screen. Exit
  non-zero.
- **Full detail**: written to a log file whose path the failure prints,
  so the agent opens it only when the short form is not enough.
- **Searchable**: an error line starts with a fixed word (`ERROR`, the
  tool's own `FAILED`) and carries the reason on the same line, so one
  search finds every failure.
- **Counted**: totals are printed, never left for the agent to compute
  from the lines.

## Third-party tools: flags, not wrappers

Use the tool's own quiet flag or compact reporter. Do not wrap a tool in a
parser, a filter, or `| grep`: a wrapper is a second system that breaks
when the tool's output changes, and it hides the failures it did not
expect. A tool with no quiet mode keeps its native output; say so in the
knowledge file in one sentence and offer a scoped command (one file, one
package) instead. When the user insists on a filter, say once what it
costs to maintain, then write it as project-owned code and record the
trade-off in the knowledge file.

Confirm every flag in `<tool> --help` of the version the project pins
before writing it; a flag that does not exist fails the command on its
first run.

| Ecosystem | Test runner (default first) | Whole suite, compact | One file or directory |
|---|---|---|---|
| Python | **pytest**; unittest | `pytest -q --tb=short --no-header` | add `-x <path>` |
| TypeScript, JavaScript | **vitest**; jest, `node --test` | `vitest run --reporter=dot --silent`; `jest --ci --silent`; `node --test --test-reporter=dot` | add the path; never the bare `vitest` or `jest --watch` |
| Deno | deno test | `deno test --quiet --reporter=dot` | add the path |
| Go | go test | `go test ./...` (never `-v`) | `go test ./<package>/...`, `-run <Name>` |
| Rust | cargo test | `cargo test -q` | `cargo test -q <name>`, `-p <crate>` |
| Gradle | the project's test task | `./gradlew -q --console=plain test` | `--tests '<pattern>'` |
| Maven | surefire | `mvn -q -B test` | `-Dtest=<Class>` |
| .NET | dotnet test | `dotnet test -v q --nologo` | `--filter <expression>` |
| Ruby | **rspec**; minitest | `rspec --format progress` | add the path |
| Browser tests | Playwright | `npx playwright test --reporter=line` | add the path |

## The project's own scripts

A check, a test harness, or a smoke script the project wrote owns its
output and follows the shape above directly: a summary line, `ERROR
<reason>` lines, details in a log file, exit codes 0, 1, and 2 (pass,
finding or error, bad arguments).

## Time

An agent has no sense of elapsed time; it will wait an hour for a suite
without noticing.

- Every command the agent is told to run has a stated duration in the
  section and in the knowledge file.
- The fast check fits its budget (default 10 seconds). What does not fit
  moves to the full check.
- A full check over 15 minutes gets a middle tier: the tests of the files
  changed since the base branch, or a fixed sample of the suite. A sample
  is chosen by a seed that stays the same for one agent or worktree, so a
  test that failed on the last run is in the next run too.
- A command that can hang (a server start, a network call in a test) has
  a timeout and fails with a line saying what it waited for.
