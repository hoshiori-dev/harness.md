# Verification recipes. Every recipe is non-interactive: no watch mode, no
# pager, no prompt. Hooks, CI, and agents call these same recipes.

# Fast check, after every small change. Budget: 10 seconds. # CONFIGURE: the design's budget
check-fast: test-unit # CONFIGURE: every existing check recipe that fits the budget, and the tests that do

# Full check, before calling a task done: everything CI runs.
check: check-fast test # CONFIGURE: every existing check recipe

# The whole test suite, compact output.
test:
    pytest -q --tb=short --no-header # CONFIGURE: the test runner with its compact reporter

# The tests that fit the fast budget.
test-unit:
    pytest -q --tb=short --no-header tests/unit # CONFIGURE: the fast subset; delete when the whole suite fits

# One file or directory, seconds: `just test-fast tests/test_parser.py`.
test-fast path:
    pytest -q --tb=short --no-header -x {{ path }} # CONFIGURE: the scoped form of the test command

# Start the system in the background and wait until it answers.
up:
    #!/usr/bin/env bash
    set -euo pipefail
    port="${PORT:-8000}" # CONFIGURE: the port; from the environment when several agents work at once
    mkdir -p .run
    if [ -f .run/app.pid ] && kill -0 "$(cat .run/app.pid)" 2>/dev/null; then
      echo "already running (pid $(cat .run/app.pid)) on port ${port}"
      exit 0
    fi
    nohup python -m app --port "${port}" > .run/app.log 2>&1 & # CONFIGURE: the start command; no prompt, no browser window
    echo $! > .run/app.pid
    for _ in $(seq 1 30); do
      if curl -fsS "http://127.0.0.1:${port}/healthz" > /dev/null 2>&1; then # CONFIGURE: the readiness probe
        echo "ready on http://127.0.0.1:${port}; log: .run/app.log"
        exit 0
      fi
      sleep 1
    done
    echo "ERROR not ready after 30 s on port ${port}; last log lines:" >&2
    tail -n 20 .run/app.log >&2
    kill "$(cat .run/app.pid)" 2>/dev/null || true
    rm -f .run/app.pid
    exit 1

# Stop the system and leave nothing behind.
down:
    #!/usr/bin/env bash
    set -euo pipefail
    if [ ! -f .run/app.pid ]; then
      echo "not running"
      exit 0
    fi
    pid="$(cat .run/app.pid)"
    if kill -0 "${pid}" 2>/dev/null; then
      kill "${pid}"
      for _ in $(seq 1 10); do
        kill -0 "${pid}" 2>/dev/null || break
        sleep 1
      done
    fi
    rm -f .run/app.pid
    echo "stopped"

# Smoke test: one request a user would make, checked against the expected answer.
smoke:
    #!/usr/bin/env bash
    set -euo pipefail
    port="${PORT:-8000}" # CONFIGURE: the same port as `up`
    body="$(curl -fsS "http://127.0.0.1:${port}/healthz")" # CONFIGURE: a user-visible request
    if [ "${body}" != "ok" ]; then # CONFIGURE: the expected answer
      echo "ERROR smoke: expected 'ok', got '${body}'" >&2
      exit 1
    fi
    echo "smoke ok"

# Bring local data to the seeded state; safe to run again.
seed:
    python -m app.seed --reset # CONFIGURE: the seed command; delete when the system keeps no data

# The last lines of the system's log.
logs lines="80":
    @tail -n {{ lines }} .run/app.log
