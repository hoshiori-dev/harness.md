# Gates Decisions

Read when running step 2 (decide mode) or auditing without an anchor document:
this file holds the layer's thickness table and all thirteen decisions.

## Thickness

Recommend one thickness, with the conditions that selected it:

| Thickness | What this layer is |
|---|---|
| omitted | No hook and no CI job. Only when no agent commits to the repository; while any agent commits, the secret scan stays, so the layer is at least light. |
| light | Formatter and secret scan, in the commit hook and in CI. Lint, typecheck, and tests are deliberately not gated. |
| medium | Light, plus lint, typecheck, and tests: all in CI and the full recipe, in the hook where they fit the budget, and a knowledge file stating where each check runs. |
| thick | Medium, plus structure checks for every rule a script can decide, a summary gate proposed as the one required check, and, where agents run unattended on a client that supports it, an agent-turn hook. |

- Thinner: the project will be thrown away, a wrong change is cheap,
  one person works on it.
- Thicker, to medium: a wrong change costs real work to undo,
  the project outlives one release cycle,
  or more than one person relies on it.
- Thicker, to thick: a wrong change reaches production, customers, or money;
  agents run unattended; the default branch is protected;
  more than one person merges.

## The thirteen decisions

Return every row.

| Decision | Recommendation, the condition that selects it, and the reason |
|---|---|
| Check set | What the thickness selects, by the conditions above: formatter and secret scan only; then lint, typecheck, and tests added; then structure checks and a summary gate added. |
| Secret scan | Always, in the hook and in CI, while any agent commits. A squash keeps what a draft commit contained, so every commit is scanned. |
| Tool per role | The tool already running in that role. Otherwise the ecosystem's most widely used tool, because agents know it best. Read [tools.md](tools.md) when naming a tool or writing any check command. |
| Task runner | The one in use; otherwise `just`, as the one command surface for hooks, CI, and agents. |
| Hook framework | The one in use; otherwise `pre-commit`. |
| Hook budget | 10 seconds on a typical commit: short enough that nobody is tempted to skip it. Read [hook-budget.md](hook-budget.md) when setting the budget, placing a check, or when an existing hook is slower than the budget. |
| Where each check runs | Formatter and secret scan in the hook, always; every other check in the hook only when it fits the budget; every check in CI and in the full recipe. |
| CI platform | The platform the conditions name: GitHub or GitLab, never both. Any other host: hook and recipes only, with the CI jobs returned as an open decision. |
| Summary gate | One job that fails unless every check job succeeded, and the only check proposed as required. Recommended when the default branch is protected, more than one person merges, or agents run unattended; otherwise not. |
| Structure checks | None, unless an invariant or style rule assigned to this layer states something a script can decide (import direction, file placement, size limits). Each needs a stated alternative before it becomes a check. |
| Script language | The language the project already scripts in; otherwise the idiom of its main language; otherwise Python with the standard library. Never a language the user says they cannot read. |
| Agent-turn hook | None. When agents run unattended on a client that can run a script at the end of a turn, run the fast recipe there so a turn cannot end on a red check. |
| Changing a rule | Never weakened to pass. The secret-scan hook and CI job are hard read-only: no agent changes them. Every other check configuration is soft read-only: an agent changes it only in a way that keeps the rule, or through a proposal the user accepts. |

## How each decision is returned

- **Settled**, with its evidence, when the repository settles it
  (a tool observed running in that role, the platform of the remote),
  the handover settles it (an agreed decision,
  a sentence of the adopted anchor document),
  or the evidence makes one option clearly better
  (the secret scan while any agent commits;
  the check set once the thickness is settled).
- **Open** otherwise: the options, the recommended one first,
  its reason, and the decisions it depends on.
  The check set depends on the thickness;
  where each check runs on the check set, the tools, and the hook budget;
  the summary gate and the CI jobs on the CI platform;
  the agent-turn hook on the clients in use and the fast recipe.
- A tool recommended for a role it was not observed in
  is a recommendation, never reported as observed:
  a `ruff` lint table settles `ruff` as the linter
  and leaves the formatter a recommendation.
- A structure rule with no stated alternative, in the handover
  or in the project, is an open decision asking for the alternative.
- On a host other than GitHub or GitLab the CI jobs are an open decision.

Handed over by an entry, ask the user nothing.
