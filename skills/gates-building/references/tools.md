# Tools and Their Quiet Flags

Read when naming a tool for a check in the section or writing any check command
into a hook, recipe, or CI job. Each row lists the default first,
then the alternatives. The quiet column is what the recipe runs.
Test runners are not listed:
the test recipes belong to the layer that owns Feedback.

Before writing a flag, confirm it in `<tool> --help` of the version the project
pins: flags change between major versions,
and a flag that does not exist fails the check on its first run.

## Python

| Role | Candidates (default first) | Quiet command |
|---|---|---|
| Format | **ruff format**; black | `ruff format --check --quiet` (hook: `ruff format --quiet`) |
| Lint | **ruff check**; flake8, pylint | `ruff check --output-format concise --quiet` |
| Typecheck | **pyright**; mypy | `pyright` (one line per diagnostic already); `mypy --no-error-summary` |

## TypeScript and JavaScript

| Role | Candidates (default first) | Quiet command |
|---|---|---|
| Format | **prettier**; biome | `prettier --check --log-level warn .`; `biome format .` |
| Lint | **eslint**; biome, oxlint | `eslint --quiet .` (hides warnings: a rule that must block is set to `error`); `biome lint --diagnostic-level=error .` |
| Typecheck | **tsc** | `tsc --noEmit --pretty false` |
| Runner | the package manager | `npm run --silent <script>`; `pnpm --silent <script>` |

A project that already formats and lints with one tool (biome,
deno) keeps that tool in both roles.

## Deno

| Role | Tool | Quiet command |
|---|---|---|
| Format | deno fmt | `deno fmt --check --quiet` |
| Lint | deno lint | `deno lint --compact` |
| Typecheck | deno check | `deno check --quiet .` |

## Go

| Role | Candidates (default first) | Quiet command |
|---|---|---|
| Format | **gofmt**; goimports | recipe body `out=$(gofmt -l .); printf '%s' "$out"; test -z "$out"` (prints the unformatted files and fails when any exist) |
| Lint | **golangci-lint**; go vet, staticcheck | `golangci-lint run`; `go vet ./...` |
| Typecheck | the compiler | `go build ./...` |

## Rust

| Role | Candidates | Quiet command |
|---|---|---|
| Format | rustfmt | `cargo fmt --check` |
| Lint | clippy | `cargo clippy -q --message-format=short -- -D warnings` |
| Typecheck | the compiler | `cargo check -q --message-format=short` |

## JVM, .NET, Ruby

| Ecosystem | Role | Candidates (default first) | Quiet command |
|---|---|---|---|
| Gradle | all | **the project's Gradle tasks** (spotless, detekt or checkstyle) | `./gradlew -q --console=plain <task>` |
| Maven | all | **the project's plugins** | `mvn -q -B <goal>` |
| .NET | format | **dotnet format** | `dotnet format --verify-no-changes --verbosity quiet` |
| .NET | lint, typecheck | **the build with analyzers** | `dotnet build -warnaserror -v q -nologo` |
| Ruby | format, lint | **rubocop**; standardrb | `rubocop --format emacs` |

## Secret scan and files without a language

| Role | Candidates (default first) | Command |
|---|---|---|
| Secret scan | **betterleaks**; gitleaks, TruffleHog | `betterleaks dir . --no-banner --redact`; `gitleaks dir . --no-banner --redact`; `trufflehog filesystem . --fail --no-update --results=verified,unknown` |
| Shell | **shellcheck** | `shellcheck -f gcc <files>` |
| YAML | **yamllint** | `yamllint -f parsable .` |

The scanners ship release binaries on their release pages;
verify the published checksum.
Installing a tool into the agent environment is the work of the layer
that owns Environment; this layer names the tool and its version.

## Adopting a tool that is already there

Adopt a tool without a second thought only in a role that is observable:
a hook, recipe, script, or CI step runs it in that role,
or its configuration for exactly that role exists.
A `ruff` lint table makes `ruff` the linter, not the formatter.
For any other role the default of the table applies and is reported
as an assumption.

## When a tool has no quiet mode

Keep the native output and add one sentence to the knowledge file:
"`<tool>` prints full logs; no compact flag exists; accepted."
Do not write a parser, filter, or `| grep` wrapper;
a scoped command (one file, one package) is the only other remedy.
When the user insists on a filter,
say once that it is a second system to maintain,
then write it as project-owned code and record the trade-off
in the knowledge file.
