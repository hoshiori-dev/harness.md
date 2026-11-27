# Harness improvement plan: {{PROJECT}} <!-- # CONFIGURE: {{PROJECT}}: the repository name. -->

Goal: {{GOAL}} <!-- # CONFIGURE: {{GOAL}}: the goal as the user confirmed it, in their words. -->
Non-goals: {{NON_GOALS}} <!-- # CONFIGURE: {{NON_GOALS}}: what this work leaves alone. -->
Repair or rebuild: {{MODE}} <!-- # CONFIGURE: {{MODE}}: "repair" or "rebuild", and who decided. -->

## Kinds of work

| Kind | Changes | Preserves |
| --- | --- | --- |
| {{KIND}} | {{CHANGES}} | {{PRESERVES}} | <!-- # CONFIGURE: one row per agreed kind: repair, hardening, thinning, carrier migration, platform migration, re-layering. -->

## Decisions

| # | Decision | Settled by |
| --- | --- | --- |
| D{{N}} | {{DECISION}} | {{BY}} | <!-- # CONFIGURE: one row per decision behind the work; {{BY}}: "the user", "evidence: <what>", or "left to the agent: <evidence>". -->

## Thickness

Omitted (nothing is built), light (one sentence or one entry),
medium (a dedicated file or configuration kept by convention),
thick (enforced by a machine).

| Layer | Before (observed) | After | Because | Confirmed |
| --- | --- | --- | --- | --- |
| Environment | {{BEFORE}} | {{AFTER}} | {{CONDITION}} | {{CONFIRMED}} | <!-- # CONFIGURE: {{AFTER}}: a thickness, or "unchanged"; {{CONDITION}}: the condition that justifies a move, or "-"; {{CONFIRMED}}: "yes" for a changed or touched layer, "-" for an untouched one. -->
| Knowledge | {{BEFORE}} | {{AFTER}} | {{CONDITION}} | {{CONFIRMED}} | <!-- # CONFIGURE: as above. -->
| Feedback | {{BEFORE}} | {{AFTER}} | {{CONDITION}} | {{CONFIRMED}} | <!-- # CONFIGURE: as above. -->
| Gates | {{BEFORE}} | {{AFTER}} | {{CONDITION}} | {{CONFIRMED}} | <!-- # CONFIGURE: as above. -->
| Authority | {{BEFORE}} | {{AFTER}} | {{CONDITION}} | {{CONFIRMED}} | <!-- # CONFIGURE: as above. -->
| Completion | {{BEFORE}} | {{AFTER}} | {{CONDITION}} | {{CONFIRMED}} | <!-- # CONFIGURE: as above. -->
| Entropy | {{BEFORE}} | {{AFTER}} | {{CONDITION}} | {{CONFIRMED}} | <!-- # CONFIGURE: as above. -->

## Items

Drift items come first; every later item that touches the same files
lists them under Depends on.

| # | Layer | File | Action | Finding | Disposition | Verification | Depends on |
| --- | --- | --- | --- | --- | --- | --- | --- |
| {{N}} | {{LAYER}} | {{PATH}} | {{ACTION}} | {{FINDING}} | {{DISPOSITION}} | {{VERIFICATION}} | {{DEPENDS}} | <!-- # CONFIGURE: one row per file; {{ACTION}}: add, change, or delete; {{FINDING}}: the finding's number and class; {{VERIFICATION}}: the command, or "read-back"; {{DEPENDS}}: item numbers, or "-". -->

## Anchor document

| Sentence | Old text | New text | Finding or decision |
| --- | --- | --- | --- |
| {{SECTION}} | {{OLD}} | {{NEW}} | {{CAUSE}} | <!-- # CONFIGURE: one row per changed sentence; mark a fact corrected to the code as "corrected to the code"; delete this section when the project has no anchor document. -->

## Kept by the user

| Finding | Kept | Reason given |
| --- | --- | --- |
| {{FINDING}} | {{KEPT}} | {{REASON}} | <!-- # CONFIGURE: one row per finding whose proposed change the user declined; write "none" in one row when there is none. -->

## Steps that need their own decision

Approving this plan does not authorise them; each is asked when reached.

| Item | Action | Dry run |
| --- | --- | --- |
| {{ITEM}} | {{OUTWARD_ACTION}} | {{DRY_RUN}} | <!-- # CONFIGURE: {{OUTWARD_ACTION}}: a deletion, a push, a remote setting, or a wider agent permission; {{DRY_RUN}}: the command that shows it without doing it, or "none"; write "none" in one row when there is no such step. -->

## Checkpoints

One commit per verified layer, in the project's convention
({{CONVENTION}}), with no attribution to an AI or a tool; nothing pushed. <!-- # CONFIGURE: {{CONVENTION}}: the convention the history shows, with one example title. -->
Checks run before each commit: {{CHECKS}} <!-- # CONFIGURE: {{CHECKS}}: the project's check commands. -->

## Left out

- {{LEFT_OUT}} <!-- # CONFIGURE: a contradiction the user declined to settle, with every file it touches, all left out of this work; a tool replacement recommended separately; or "nothing". -->
