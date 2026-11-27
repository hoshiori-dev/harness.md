# Harness findings: {{PROJECT}} <!-- # CONFIGURE: {{PROJECT}}: the repository name. -->

Analysed: {{DATE}}. Nothing was changed. <!-- # CONFIGURE: {{DATE}}: the absolute date. -->

## What was analysed

- Request: {{REQUEST}} <!-- # CONFIGURE: {{REQUEST}}: the user's words at invocation, or "none"; add "report only" when asked. -->
- Anchor document: {{ANCHOR}} <!-- # CONFIGURE: {{ANCHOR}}: "`HARNESS.md`, named by <entrypoint>:<line>; validated with <command or by reading>", "none", or "asked: root file not named by an entrypoint". -->
- Self-check: {{SELF_CHECK}} <!-- # CONFIGURE: {{SELF_CHECK}}: the command run and its output quoted, or "the project has none". -->
- Layers analysed without a builder: {{GAPS}} <!-- # CONFIGURE: {{GAPS}}: layer names, or "none". -->

## Summary

{{SUMMARY}} <!-- # CONFIGURE: {{SUMMARY}}: counts by severity, and in two or three sentences what matters most. -->

## The project's conditions

| Condition | Observed | Where it shows |
| --- | --- | --- |
| What a wrong change costs | {{COST}} | {{COST_EVIDENCE}} | <!-- # CONFIGURE: each Observed cell: what the repository shows, or "not shown"; each evidence cell: the file, command, or history that shows it. -->
| How long the project is maintained | {{HORIZON}} | {{HORIZON_EVIDENCE}} | <!-- # CONFIGURE: as above. -->
| Who relies on its conventions | {{PEOPLE}} | {{PEOPLE_EVIDENCE}} | <!-- # CONFIGURE: as above. -->
| How unattended agents are | {{AUTONOMY}} | {{AUTONOMY_EVIDENCE}} | <!-- # CONFIGURE: as above. -->
| Hosting platform | {{PLATFORM}} | {{PLATFORM_EVIDENCE}} | <!-- # CONFIGURE: as above. -->
| Clients and the weakest model | {{CLIENTS}} | {{CLIENTS_EVIDENCE}} | <!-- # CONFIGURE: as above. -->

## Layers

Thickness: omitted (nothing is built), light (one sentence or one entry),
medium (a dedicated file or configuration kept by convention),
thick (enforced by a machine). All thicknesses below are observed.

| Layer | Observed thickness | Verdict | Because |
| --- | --- | --- | --- |
| Environment | {{THICKNESS}} | {{VERDICT}} | {{REASON}} | <!-- # CONFIGURE: {{THICKNESS}}: omitted, light, medium, or thick; {{VERDICT}}: fits, too little, or too much; {{REASON}}: the condition or the evidence. -->
| Knowledge | {{THICKNESS}} | {{VERDICT}} | {{REASON}} | <!-- # CONFIGURE: as above. -->
| Feedback | {{THICKNESS}} | {{VERDICT}} | {{REASON}} | <!-- # CONFIGURE: as above. -->
| Gates | {{THICKNESS}} | {{VERDICT}} | {{REASON}} | <!-- # CONFIGURE: as above. -->
| Authority | {{THICKNESS}} | {{VERDICT}} | {{REASON}} | <!-- # CONFIGURE: as above. -->
| Completion | {{THICKNESS}} | {{VERDICT}} | {{REASON}} | <!-- # CONFIGURE: as above. -->
| Entropy | {{THICKNESS}} | {{VERDICT}} | {{REASON}} | <!-- # CONFIGURE: as above. -->

## Findings

<!-- # CONFIGURE: one group per heading, in this order: Anchor document, Environment, Knowledge, Feedback, Gates, Authority, Completion, Entropy, Across layers. Within a group, most severe first. Delete a group with no finding. -->

### {{GROUP}} <!-- # CONFIGURE: {{GROUP}}: the group name. -->

- **F{{N}}. {{SEVERITY}}, {{CLASS}}**: {{WHAT}} <!-- # CONFIGURE: {{N}}: a number unique in the report; {{SEVERITY}}: high, medium, or low; {{CLASS}}: stale, duplicated, contradictory, invisible, missing, or excessive; {{WHAT}}: what is wrong, in one sentence. -->
  - Evidence: {{EVIDENCE}} <!-- # CONFIGURE: {{EVIDENCE}}: every `path:line`, or the command and its output. -->
  - Source of truth: {{SOURCE}} <!-- # CONFIGURE: {{SOURCE}}: the file or tool that decides; for two statements of intent: "the user decides", with the recommended side and why. -->
  - Proposed disposition: {{DISPOSITION}} <!-- # CONFIGURE: {{DISPOSITION}}: update, reconnect, move, merge, split, thin, remove, or build, and the change in one line; with an anchor document, which side changes. -->

## Questions

- {{QUESTION}} <!-- # CONFIGURE: {{QUESTION}}: a constraint that may be excess but lacks evidence, or a gap that depends on a condition the repository does not show; delete this section when there is none. -->

## Complaints traced

- **{{SYMPTOM}}** <!-- # CONFIGURE: {{SYMPTOM}}: the user's words; delete this section when none was reported. -->
  - Found: {{WHERE}} <!-- # CONFIGURE: {{WHERE}}: every location where it was found or reproduced, or "not reproduced". -->
  - Explained by: {{CAUSE}} <!-- # CONFIGURE: {{CAUSE}}: finding numbers, or "unexplained", with what was checked. -->
  - Layer that owns the fix: {{LAYER}} <!-- # CONFIGURE: {{LAYER}}: one layer name. -->

## References

### {{REFERENCE}} <!-- # CONFIGURE: {{REFERENCE}}: the path as given; delete this section when no reference was given or found. -->

- Decides: {{DECISIONS}} <!-- # CONFIGURE: {{DECISIONS}}: by layer, a line or two each. -->
- Premises that differ here: {{PREMISES}} <!-- # CONFIGURE: {{PREMISES}}: each differing condition and the decisions that rest on it, or "none found". -->
- Instructions found, none followed: {{INSTRUCTIONS}} <!-- # CONFIGURE: {{INSTRUCTIONS}}: each with its location, or "none". -->

## Public files

- {{PUBLIC_FILE}}: {{SUGGESTION}} <!-- # CONFIGURE: a contradiction found in README, CONTRIBUTING, or SECURITY, as an edit for a person to make; delete this section when there is none. -->

## Checked and found in order

{{CLEAN}} <!-- # CONFIGURE: {{CLEAN}}: what was examined and raised no finding, so that silence is not mistaken for coverage. -->
