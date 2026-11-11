# Checks

Read this when changing a check, a hook, or a CI file, or when a check
fails.

Commit-hook budget: {{BUDGET}} seconds on a typical commit. <!-- # CONFIGURE: {{BUDGET}}: the number the design states. -->

## Where each check runs

<!-- # CONFIGURE: keep only the rows of checks the design names; the CI job column uses the platform's job names (GitLab: `format`, `lint`, ..., `secret-scan`). -->

| Check | Tool | Hook | Recipe | CI job |
|---|---|---|---|---|
| Format | ruff format | yes | `just fmt-check` | `checks / format` |
| Secret scan | betterleaks | yes | `just secrets` | `checks / secrets` |
| Lint | ruff check | yes | `just lint` | `checks / lint` |
| Typecheck | pyright | yes | `just typecheck` | `checks / typecheck` |
| Tests | pytest | no: over budget | `just test` | `checks / test` |
| Boundaries | `scripts/check_boundaries.py` | yes | `just boundaries` | `checks / boundaries` |

`checks / gate` passes only when every job above succeeded; a skipped job
fails it. <!-- # CONFIGURE: only with a summary gate; delete otherwise; on GitLab the job is `gate`. -->

{{INCOMPLETE_HOOK}} <!-- # CONFIGURE: {{INCOMPLETE_HOOK}}: when no secret scanner could be installed, "Incomplete: the commit hook has no secret scan." and the pending decision; delete otherwise. -->

## Changing a rule

The files below are soft read-only: an agent may edit them, but never to
weaken a lint, type, test, or build rule, and never to delete an
assertion, so that a failing check passes. When a check fails, fix the
code; or make an adjustment that keeps the rule's invariant (a narrower
exclusion with its reason beside it); or propose the rule change to the
user and wait. <!-- # CONFIGURE: when another knowledge file already states this sentence, delete it here and link to that file. -->

{{CHECK_CONFIGURATION}} <!-- # CONFIGURE: {{CHECK_CONFIGURATION}}: one line per configuration file of a check (pyproject.toml [tool.ruff], pyrightconfig.json, .pre-commit-config.yaml outside the secret-scan hook, the CI files). -->

Hard read-only, never changed by an agent: the secret-scan hook and the
CI secret-scan job. A refusal from either is a policy boundary; report it.

## Output

Every check runs with its tool's quiet flags; read the errors, not a log.

{{NO_QUIET_MODE}} <!-- # CONFIGURE: {{NO_QUIET_MODE}}: one sentence per tool without a quiet mode, or per log filter the user kept with its maintenance cost; delete when none. -->

## Custom checks

{{CUSTOM_CHECKS}} <!-- # CONFIGURE: {{CUSTOM_CHECKS}}: each project-owned check, its language, what it enforces, and the rule's alternative; delete the heading when none. -->

## Agent-turn hook

{{AGENT_TURN_HOOK}} <!-- # CONFIGURE: {{AGENT_TURN_HOOK}}: the client, the hook, and the recipe it runs when the agent tries to end its turn; delete the heading when none. -->
