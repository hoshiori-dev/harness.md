# Entropy Decisions

Read when running step 2 (decide mode) or auditing without an anchor document:
this file holds the layer's thickness table and all eight decisions.

## Thickness

Recommend one thickness, with the conditions that selected it:

| Thickness | What the layer is | Conditions that select it |
|---|---|---|
| omitted | nothing: stale harness text costs less than the machinery against it | thrown away within about a quarter, and nobody but its author relies on its conventions |
| light | one drift sentence in the entrypoint; no table, self-check, or routine | one person, no release in sight, yet kept longer than a quarter |
| medium | a keep-in-sync section (three dispositions, the ruling rule, a sync table or sync skills) and a self-check run by a recipe, the aggregate check, and an advisory CI job: a failure is visible and blocks no merge; no reclamation | maintained past one release, or anyone besides the author relies on its conventions, while a wrong change is cheap to undo |
| thick | the same, with the required CI gate depending on the self-check, a dated reclamation routine, and, where the project adopted an anchor document, keeping it in step | maintained for years or a heavy harness; a wrong change is costly, or agents work unattended |

Thicker: a longer life, more people relying on the conventions,
a costlier wrong change, more unattended agents,
a heavier harness (many knowledge files, project skills, and checks),
more copies and mirror pairs.
Thinner: a short life, a sole author, changes cheap to undo,
a harness small enough to re-read in one sitting.
The thickness is the starting picture;
each decision below is still selected by its own condition.

## The eight decisions

With the thickness omitted, return none.
Every decision depends on the thickness; further dependencies are named.

| # | Decision | Recommendation, the condition that selects it, and the reason |
|---|---|---|
| 1 | Which side wins a disagreement | The code and the task runner win over the document that describes them; in a mirror pair the source side wins. The opposite ruling for one pair is the user's to record. |
| 2 | What an agent does when it finds drift | One person and no release in sight: one sentence, "fix it in the same change or record it where the next agent finds it, never only in the conversation". Otherwise three dispositions with their criteria: fix in the same change, the pending decisions list, a tracked issue. Read [correction-report.md](correction-report.md) when deciding them or the drift label. |
| 3 | How each copy is kept in step | A Keep In Sync table in the entrypoint: one row per concern, at most about ten. A concern that is frequent, branchy, or spans several artifacts gets a sync project skill instead. Read [sync-table.md](sync-table.md) when choosing or writing rows, and [sync-skill.md](sync-skill.md) when a concern gets a skill. |
| 4 | The harness self-check | On when the project is maintained past one release or anyone besides its author relies on its conventions: a script among the project's own management scripts, a task-runner recipe, part of the aggregate check, and a CI job. The required CI gate depends on it when a wrong change is costly or agents work unattended; otherwise the wiring is advisory, and a failing self-check blocks no merge. Its second tier (project skill frontmatter, entrypoint line budget) is on when the project has project skills. Off otherwise, and the hand back says so. Read [check-harness-config.md](check-harness-config.md) when deciding where it lives and in which language. |
| 5 | The paths the self-check requires (depends on 4) | The harness files and directories the agreed decisions of all layers need to exist, as a list the build handover carries; this skill adds its own (the script, the reclamation file). Never a path read out of prose: a guessed path fails for no reason. |
| 6 | The anchor document kept in step (only with an adopted anchor document; depends on 4 and 7) | Kept in step: the self-check requires the file to exist and validates its format when the project holds its own validator, the sync section rules intent against fact, and reclamation re-reads it against the harness. |
| 7 | Periodic reclamation | On when the project is maintained for years or its harness is heavy: a dated routine anchored to a team event (a release, a retro), monthly for a fast-moving project and quarterly otherwise. Off for anything shorter-lived; the hand back then names what would add it. Read [reclamation.md](reclamation.md) when deciding it. |
| 8 | Session logs and canary tasks | No decision unless the user asks. Read [observation.md](observation.md) when they do. |
