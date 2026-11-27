# Harness plan: {{PROJECT}} <!-- # CONFIGURE: {{PROJECT}}: the repository name. -->

Approving this plan authorises creating or changing exactly the files listed below.
Publishing, changing a remote setting, deleting work,
and widening what agents may do on their own
are each asked separately when the build reaches them.

"Decided by" is one of: **user** (answered or changed in a round),
**evidence** (the repository settles it; the evidence is given),
**agent** (decided on the evidence after the user left the rest).

## Goal and non-goals

- Goal: {{GOAL}} <!-- # CONFIGURE: {{GOAL}}: the goal as the user gave or confirmed it, in their words. -->
- Not policed: {{NOT_POLICED}} <!-- # CONFIGURE: {{NOT_POLICED}}: what the harness will not enforce. -->
- Stays with a human: {{HUMAN_ONLY}} <!-- # CONFIGURE: {{HUMAN_ONLY}}: for example merging, releases, remote settings. -->
- Not changed in the project: {{NOT_CHANGED}} <!-- # CONFIGURE: {{NOT_CHANGED}}: parts of the goal that reach beyond the harness, with the user's answer. -->

## Conditions

| Condition | Value | Settled by |
| --- | --- | --- |
| What a wrong change costs | {{COST}} | {{COST_SOURCE}} | <!-- # CONFIGURE: the value, then "observed" with the evidence, "inferred, not corrected" with the evidence, or "answered"; the same for every row. -->
| How long the project is maintained | {{HORIZON}} | {{HORIZON_SOURCE}} | <!-- # CONFIGURE: as above. -->
| Who relies on its conventions | {{PEOPLE}} | {{PEOPLE_SOURCE}} | <!-- # CONFIGURE: as above. -->
| How unattended agents are | {{UNATTENDED}} | {{UNATTENDED_SOURCE}} | <!-- # CONFIGURE: as above. -->
| Hosting platform | {{PLATFORM}} | {{PLATFORM_SOURCE}} | <!-- # CONFIGURE: as above; "no remote" is a value. -->
| Clients and weakest model | {{CLIENTS}} | {{CLIENTS_SOURCE}} | <!-- # CONFIGURE: as above. -->

Assumed: one agent writes to the repository at a time. <!-- # CONFIGURE: replace when the user said several agents write at once. -->

## What exists

- Classification: {{CLASSIFICATION}} <!-- # CONFIGURE: {{CLASSIFICATION}}: "new, nothing to preserve" or "existing", with the evidence. -->
- Kept as it is: {{KEPT}} <!-- # CONFIGURE: {{KEPT}}: task runner, checks, CI, hooks, conventions, each with where it was seen; "nothing" for a new project. -->
- Outside the plan, left as it is: {{OUTSIDE}} <!-- # CONFIGURE: {{OUTSIDE}}: existing artifacts no decision mentions, one line each; delete the line when there are none. -->

## References

| Reference | Inherited | Not inherited, and why |
| --- | --- | --- |
| {{REFERENCE}} | {{INHERITED}} | {{NOT_INHERITED}} | <!-- # CONFIGURE: one row per reference; premises that differ go in the last column; delete the section when no reference was given. -->

## Thickness

omitted: nothing is built. light: one sentence or one entry.
medium: a dedicated file or configuration kept by convention.
thick: enforced by a machine.

| Layer | Exists now | Thickness | Conditions behind it | Decided by |
| --- | --- | --- | --- | --- |
| Environment | {{ENV_NOW}} | {{ENV_THICKNESS}} | {{ENV_REASON}} | {{ENV_BY}} | <!-- # CONFIGURE: "Exists now" is "nothing" for a new project; name a non-goal that constrains the row; the same for every row. -->
| Knowledge | {{KN_NOW}} | {{KN_THICKNESS}} | {{KN_REASON}} | {{KN_BY}} | <!-- # CONFIGURE: as above. -->
| Feedback | {{FB_NOW}} | {{FB_THICKNESS}} | {{FB_REASON}} | {{FB_BY}} | <!-- # CONFIGURE: as above. -->
| Gates | {{GA_NOW}} | {{GA_THICKNESS}} | {{GA_REASON}} | {{GA_BY}} | <!-- # CONFIGURE: as above. -->
| Authority | {{AU_NOW}} | {{AU_THICKNESS}} | {{AU_REASON}} | {{AU_BY}} | <!-- # CONFIGURE: as above. -->
| Completion | {{CO_NOW}} | {{CO_THICKNESS}} | {{CO_REASON}} | {{CO_BY}} | <!-- # CONFIGURE: as above. -->
| Entropy | {{EN_NOW}} | {{EN_THICKNESS}} | {{EN_REASON}} | {{EN_BY}} | <!-- # CONFIGURE: as above. -->

## Layers

### {{LAYER}} <!-- # CONFIGURE: one block per layer that is not omitted, in build order: Environment, Knowledge, Feedback, Gates, Authority, Completion, Entropy. -->

| Decision | Choice | Decided by | Evidence or reason |
| --- | --- | --- | --- |
| {{DECISION}} | {{CHOICE}} | {{BY}} | {{EVIDENCE}} | <!-- # CONFIGURE: one row per decision of the layer; {{BY}}: user, evidence, or agent; an inherited decision names its reference. -->

| File | Action | Realises | Verified by |
| --- | --- | --- | --- |
| {{PATH}} | {{ACTION}} | {{REALISES}} | {{VERIFICATION}} | <!-- # CONFIGURE: one row per file; {{PATH}}: project-relative; {{ACTION}}: create, change, or delete; {{REALISES}}: the decision above, quoted; {{VERIFICATION}}: the command, or the read-back. -->

## Skeleton

| Path | Needed by |
| --- | --- |
| {{SKELETON_PATH}} | {{SKELETON_COMMAND}} | <!-- # CONFIGURE: one row per file an empty project needs for a planned command to run; no product feature; delete the section when the project has code. -->

## Commands that install or download

- {{COMMAND}} <!-- # CONFIGURE: one line per command, exact, with where its package comes from; "none" when there are none. -->

## Steps that need their own decision

| Step | Kind | Asked when |
| --- | --- | --- |
| {{STEP}} | {{KIND}} | the build reaches it | <!-- # CONFIGURE: one row per step; {{KIND}}: publication, remote setting, deletion, or wider permission; remote writes are shown as a dry run first; "none" under the table when empty. -->

## Left to a person

- {{HUMAN_ACTION}} <!-- # CONFIGURE: one line per repository setting only a person applies, with the exact setting; delete the section when there are none. -->

## Gaps and assumptions

- {{GAP}} <!-- # CONFIGURE: one line per layer with no installed builder, per assumption with what it would change, and per pending decision; delete the section when there are none. -->

## Suggestions for separate changes

- {{SUGGESTION}} <!-- # CONFIGURE: replacements of working habits and edits to public files, for the user to decide outside this build; delete the section when there are none. -->

## Checkpoints

One commit per verified layer, in this convention: {{CONVENTION}}; no AI or tool attribution; nothing pushed. <!-- # CONFIGURE: {{CONVENTION}}: the agreed convention, else the one the history shows. -->
