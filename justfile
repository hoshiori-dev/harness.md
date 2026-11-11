# Task runner for the harness.md repository. Every documented command is a
# recipe here; CI jobs run the same recipes.

set shell := ["bash", "-euo", "pipefail", "-c"]
set positional-arguments

export OPENSPEC_NO_UPDATE_CHECK := "1"
export OPENSPEC_TELEMETRY := "0"
export ASTRO_TELEMETRY_DISABLED := "1"
export PAGER := "cat"
export GIT_PAGER := "cat"
export GIT_TERMINAL_PROMPT := "0"

# Pinned versions of the Python tools the recipes run through uv. CI
# (.github/actions/setup-tools) installs uv and reads them from here.
ruff_version := "0.15.0"
pytest_version := "9.0.2"
# Third-party packages the shipped Python scripts declare (PEP 723) and their
# tests import; a script that adds a dependency adds it here too.
pytest_with := "--with 'pyyaml>=6.0'"
# The rules `ruff check` adds to its defaults for shipped Python: no blind
# `except`, no silent `pass` (.agents/knowledge/skill-quality.md).
ruff_select := "--extend-select BLE001,S110"

# List recipes.
default:
    @just --list

# Generate client-specific files from plugin.json and the agents directories (`--check`: report drift only).
gen *flags:
    node scripts/gen.ts "$@"

# Format the management scripts (Biome) and the shipped Python (ruff).
fmt:
    pnpm exec biome check --write
    if compgen -G 'skills/*/*/*.py' >/dev/null; then uvx ruff@{{ ruff_version }} format skills/; else echo "ruff: no Python under skills/"; fi

# Formatting, lint, and type checks for the management code (Biome, tsc) and the shipped Python assets (ruff, only once skills/ holds .py files).
lint:
    pnpm exec biome check
    pnpm exec tsc --noEmit
    if compgen -G 'skills/*/*/*.py' >/dev/null; then uvx ruff@{{ ruff_version }} check {{ ruff_select }} skills/ && uvx ruff@{{ ruff_version }} format --check skills/; else echo "ruff: no Python under skills/"; fi

# Unit tests of the management scripts (node --test) and of the shipped Python assets (pytest, only once skills/ holds tests).
test:
    node --test 'scripts/**/*_test.ts'
    if compgen -G 'skills/*/*/*_test.py' >/dev/null; then PYTHONDONTWRITEBYTECODE=1 uv run --no-project --python 3.12 --with pytest=={{ pytest_version }} {{ pytest_with }} pytest -q -p no:cacheprovider --import-mode=importlib skills/; else echo "pytest: no Python tests under skills/"; fi

# Plugin package and client wiring consistency; every shipped skill and agent has its OpenSpec spec.
validate:
    node scripts/check_plugin.ts

# Shipped skills: description budgets, structure, links, reachability, script hygiene, shared blocks, layer ownership, the specification copy.
skills-check:
    node scripts/check_skills.ts

# Harness integrity: links, named paths, recipes, entrypoint budget, project skills, symlinks, README and specification mirrors.
harness-check:
    node scripts/check_harness.ts

# Validate HARNESS.md files against the format specification (no path: ./HARNESS.md and every hub/*/HARNESS.md).
harness-md-lint *paths:
    node scripts/lint_harness_md.ts "$@"

# Run both validators (this repository's TypeScript one and the Python one the format skill ships) over the conformance fixtures.
fixtures-check:
    node scripts/lint_harness_md.ts --fixtures spec/fixtures
    uv run skills/harness-md/scripts/lint_harness_md.py --fixtures spec/fixtures

# Hub entries against the hub's own entry rules.
hub-check:
    node scripts/check_hub.ts

# OpenSpec specs and changes, strict mode.
spec-check:
    openspec validate --all --strict --no-interactive

# Unarchived OpenSpec changes: exit 1 while one exists (the pr workflow then withholds the `checks / spec-archived` check and the ruleset blocks the merge).
spec-archived:
    node scripts/check_spec_archived.ts

# Print the OpenSpec state label a pull request should carry, without writing (the pr-labels workflow applies it).
pr-labels number:
    node scripts/sync_pr_labels.ts "$1"

# Secret scan of the working tree.
secrets:
    betterleaks dir . --no-banner --redact

# Secret scan of the commits in a git range (empty: the whole history); the secrets workflow runs it on the commits a push or pull request adds. The GIT_CONFIG_* variables let the git that betterleaks spawns trust the dev container's root-owned checkout.
secrets-commits range="":
    GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=safe.directory GIT_CONFIG_VALUE_0='*' betterleaks git . --no-banner --redact {{ if range == "" { "" } else { "--log-opts=" + range } }}

# Every pre-commit hook on every file.
pre-commit:
    pre-commit run --all-files

# Install the workspace's Node dependencies (the management scripts and the website) from the lockfile.
site-install:
    pnpm install --frozen-lockfile

# Serve the website locally with live reload.
site-dev:
    pnpm --filter ./site run dev

# Build the website into site/dist.
site-build:
    pnpm --filter ./site run build

# Static checks of the website's source.
site-check:
    pnpm --filter ./site run check

# The checks that need neither openspec, the website build, nor betterleaks; the push workflow runs them on every branch but main.
check-fast: (gen "--check") lint validate skills-check harness-check harness-md-lint fixtures-check hub-check test

# Everything CI runs.
check: check-fast spec-check site-check site-build secrets

# Validate the package with the installed client CLIs (local only; CI has no clients). Antigravity installs from the unpacked release archive: it copies the whole directory it is given, and the working tree holds node_modules and the website.
clients-validate:
    claude plugin validate .
    agy plugin validate .
    codex plugin marketplace add . >/dev/null
    codex plugin list | grep -F "harness-md@harness-md"
    codex plugin marketplace remove harness-md >/dev/null
    just dist
    name="$(node -p 'JSON.parse(require("node:fs").readFileSync("plugin.json", "utf8")).name')"; version="$(node -p 'JSON.parse(require("node:fs").readFileSync("plugin.json", "utf8")).version')"; out="$(mktemp -d)"; trap 'rm -rf "$out"' EXIT; unzip -q "dist/$name-$version.zip" -d "$out" && claude plugin validate "$out/$name" && agy plugin validate "$out/$name" && agy plugin install "$out/$name" >/dev/null && agy plugin list --json | grep -F "\"$name\"" && agy plugin uninstall "$name" >/dev/null

# Print the versions of the clients and tools the harness is verified against.
versions:
    node --version
    pnpm --version
    just --version
    uv --version
    openspec --version
    claude --version
    codex --version
    agy changelog 2>/dev/null | awk 'NR == 1 { print "agy " $0 }'
    betterleaks version

# Files that belong to one client (codex | claude-code | antigravity).
client-footprint id:
    node scripts/check_plugin.ts --footprint "$1"

# Build the release archive into dist/ (`--tag vX.Y.Z` checks it against plugin.json).
dist *flags:
    node scripts/dist.ts "$@"

# Compare .github/labels.json with the repository's labels (`--apply` writes).
labels *flags:
    node scripts/sync_labels.ts "$@"

# Refresh the vendored Agent Plugins schema.
schemas-update:
    curl -sfL "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json" -o "scripts/schemas/agent-plugins/1.0.0/plugin.schema.json"

# Remove build output.
clean:
    rm -rf dist site/dist
