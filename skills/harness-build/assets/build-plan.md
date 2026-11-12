# Harness build plan: {{PROJECT}} <!-- # CONFIGURE: {{PROJECT}}: the repository name. -->

Approving this plan authorises creating
or changing exactly the files listed below.
Publishing, changing a remote setting, deleting work,
and widening what agents may do on their own are each asked separately
when the build reaches them.

## Goal

{{GOAL}} <!-- # CONFIGURE: {{GOAL}}: the project's goal in the user's words. -->

## Design

- File: `HARNESS.md` ({{DESIGN_NAME}}), validated: {{VALIDATION}} <!-- # CONFIGURE: {{DESIGN_NAME}}: the name from the frontmatter; {{VALIDATION}}: "no errors", plus any warnings. -->
- Used as: {{USE}} <!-- # CONFIGURE: {{USE}}: "the project's own design" or "a template", with the evidence. -->

## Context adaptation

Only when the file is used as a template; delete this section otherwise.

| Section | Was | Becomes | Condition that differs |
| --- | --- | --- | --- |
| {{SECTION}} | {{OLD_SENTENCE}} | {{NEW_SENTENCE}} | {{CONDITION}} | <!-- # CONFIGURE: one row per changed sentence; {{SECTION}}, {{OLD_SENTENCE}}, {{NEW_SENTENCE}}, {{CONDITION}}. -->

## What exists

{{EXISTING}} <!-- # CONFIGURE: {{EXISTING}}: "nothing to preserve", or the observed stack, commands, checks, and harness artifacts, each with where it was seen. -->

## Layers

One block per layer, in build order.
A layer whose section says the project does nothing there keeps its heading
and the reason; a layer with no section is deleted from the plan.

### {{LAYER}} <!-- # CONFIGURE: {{LAYER}}: Environment, Knowledge, Feedback, Gates, Authority, Completion, or Entropy. -->

| File | Action | Realises (sentence of the design) | Verified by |
| --- | --- | --- | --- |
| {{PATH}} | {{ACTION}} | {{SENTENCE}} | {{VERIFICATION}} | <!-- # CONFIGURE: {{PATH}}; {{ACTION}}: create, change, or delete; {{SENTENCE}}: quoted from the section, or from Invariants, Style, or File Structure; {{VERIFICATION}}: the command or the read-back. -->

Already built: {{CONFORMING}} <!-- # CONFIGURE: {{CONFORMING}}: artifacts that already do what the section says, or "none". -->

## Skeleton

Paths File Structure requires that no layer owns,
and what an empty project needs for the design's commands to run.

| Path | Purpose |
| --- | --- |
| {{PATH}} | {{PURPOSE}} | <!-- # CONFIGURE: {{PATH}}, {{PURPOSE}}; write "none" under the table when empty. -->

## Commands the build will run

Everything that installs or downloads, with its source.

- {{COMMAND}} <!-- # CONFIGURE: {{COMMAND}}: the exact command and where its package comes from; "none" when empty. -->

## Assumptions

Where the design was silent and a default was applied.

- {{ASSUMPTION}} <!-- # CONFIGURE: {{ASSUMPTION}}: the point, the default, and why; "none" when empty. -->

## Not built

- {{NOT_BUILT}} <!-- # CONFIGURE: {{NOT_BUILT}}: Open Questions items, sentences that reach beyond a harness, layers with no installed builder; "none" when empty. -->

## Outside the design

Existing artifacts no sentence mentions; left as they are.

- {{OUTSIDE}} <!-- # CONFIGURE: {{OUTSIDE}}: the path and one line on what it does; "none" when empty. -->

## Separate decisions

Not authorised by approving this plan; each is asked when reached.

| Action | Kind | Decision |
| --- | --- | --- |
| {{ACTION}} | {{KIND}} | pending | <!-- # CONFIGURE: {{ACTION}}; {{KIND}}: push, remote setting, deletion, or wider permission. -->

## Checkpoints

One commit per verified layer, in this convention: {{CONVENTION}}; no AI or tool attribution; nothing pushed. <!-- # CONFIGURE: {{CONVENTION}}: from the Authority section, else the history, else Conventional Commits. -->
