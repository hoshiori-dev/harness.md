#!/usr/bin/env bash
# Runs once after the dev container is created.
set -euo pipefail

# Node dependencies of the management scripts and the website, exactly as the
# lockfile records them. The Python tools (ruff, pytest) need no install: the
# justfile runs them through uv at the versions it pins.
pnpm install --frozen-lockfile

pre-commit install --install-hooks
