# Fitness

Read before the fitness pass. Drift asks whether the project follows its
design. Fitness asks whether the design is right for the project as it is
today. A harness can match its design perfectly and still be wrong,
because the design was written for a Context that has moved, or was too
thin or too heavy from the start.

## First: is Context still true?

Compare each Context condition with the present:

| Condition | Signs it has moved |
| --- | --- |
| Cost of a wrong change | the project gained a deploy pipeline, user data, payments, or dependants; or lost them |
| Maintenance horizon | a prototype that is still alive past its stated life; a product being retired |
| Who relies on the conventions | new authors in the history, a CONTRIBUTING file, outside pull requests |
| How unattended agents are | workflows that start agents on issues or schedules; longer sessions between human checks |
| Hosting platform | the remote changed |
| Clients and models | client configuration for a client the design does not name |

A condition that moved is a `medium` finding against Context, `high` when
it moved toward more risk (costlier changes, less supervision, untrusted
input). Every decision that cites the old condition is then in question.

## Too little

A layer does too little when the Context calls for more than the design
says. Evidence is a Context sentence plus what is absent.

| Context | Expect at least |
| --- | --- |
| A wrong change loses data, causes an outage, or is a security incident | type check, lint, and tests gating every merge; an isolated environment; guard files agents cannot edit |
| Agents work unattended for hours | irreversible and outward actions authorised in advance, never allowed by a permission entry; a format for queued decisions; a definition of done a machine can check; feedback the agent can run itself |
| Agents are triggered by content anyone can write, and hold private data and a way to send it out | real isolation: a restricted token, a network allow list, a container or VM |
| Many people or outside contributors rely on the conventions | conventions as checks, a protected default branch, required checks |
| Maintained for years | a harness self-check, sync rules in both directions, a periodic clean-up, `HARNESS.md` kept in step |
| Any project agents commit to | a secret scan on every commit; a fast, scoped test command |

**Hardening.** When a prototype has become long-lived, the design usually
needs three changes together, each its own finding: record the structure
and commands that have stopped changing (Knowledge); add type, lint, and
test gates and protect the guard files (Gates, Environment, Authority);
clear exploration leftovers and install sync and a self-check (Entropy).
Leftovers (temporary scripts, dead experiment directories, notes on
abandoned approaches) are listed; whether each goes is the user's
decision.

## Too much

Excess never fails; it only makes agents slower and more cautious, and
teaches them to work around gates. The trigger is "what this constraint
catches no longer occurs".

Candidates:

- a lint rule or custom check for a problem fixed long ago;
- a skill written for a migration that has finished;
- a route for a module that was removed;
- the full test suite in a pre-commit hook, where a slow hook gets
  bypassed;
- entrypoint content loaded on every task that applies to rare tasks (move
  it behind a route instead of deleting it);
- an entrypoint over its budget, or that restates what the code states;
- "ask" permission entries that fire many times a day;
- a layer doing more than the Context supports: a spec framework for a
  one-person throwaway, CI structure checks for a project discarded within
  a quarter.

Each excess finding names the constraint, what it caught, and the evidence
that it no longer occurs. Without that evidence it is a question for the
user, recorded as `low`.

## Keeping it from decaying again

When the project is maintained for years and nothing cleans the harness
periodically, add one finding for the Entropy layer: a routine that, on a
cadence tied to an event the team already has (a release, a
retrospective), hunts stale paths and dead commands (by running them),
rules the code now contradicts, one rule stated in two places, content no
route reaches, and constraints that no longer catch anything, and records
the date of its last run.

## Verdict per layer

Write one line per layer: `fits`, `too little`, or `too much`, followed by
the Context sentence or the evidence. A layer can be both in different
parts of the repository; say which part.
