# Harness audit: {{PROJECT}} <!-- # CONFIGURE: {{PROJECT}}: the repository name. -->

Audited: {{DATE}}. Nothing was changed. <!-- # CONFIGURE: {{DATE}}: the absolute date. -->

## What was audited

- Design: {{DESIGN}} <!-- # CONFIGURE: {{DESIGN}}: "`HARNESS.md` (name)", or "no `HARNESS.md`; compared with the usual practice for this Context". -->
- Passes run: {{PASSES}} <!-- # CONFIGURE: {{PASSES}}: format, drift, fitness, and which were skipped and why. -->
- Symptoms reported: {{SYMPTOMS}} <!-- # CONFIGURE: {{SYMPTOMS}}: the user's words, or "none". -->
- Layers examined without a builder: {{GAPS}} <!-- # CONFIGURE: {{GAPS}}: layer names, or "none". -->

## Summary

{{SUMMARY}} <!-- # CONFIGURE: {{SUMMARY}}: counts by severity, and in two or three sentences what matters most. -->

## Findings

One block per group, in this order:
`HARNESS.md`, Context, Environment, Knowledge, Feedback, Gates, Authority,
Completion, Entropy, across layers. Within a group, most severe first.
Delete a group with no finding.

### {{GROUP}} <!-- # CONFIGURE: {{GROUP}}: the group name. -->

- **{{SEVERITY}}, {{CLASS}}**: {{WHAT}} <!-- # CONFIGURE: {{SEVERITY}}: high, medium, or low; {{CLASS}}: stale, duplicated, contradictory, invisible, missing, unrecorded, or excessive; {{WHAT}}: what is wrong, in one sentence. -->
  - Evidence: {{EVIDENCE}} <!-- # CONFIGURE: {{EVIDENCE}}: `path:line`, or the command and its output. -->
  - Design: {{SENTENCE}} <!-- # CONFIGURE: {{SENTENCE}}: the sentence of the section, quoted, or "no design to compare with". -->
  - Fix: {{SIDE}}: {{CHANGE}} <!-- # CONFIGURE: {{SIDE}}: "change the artifact" or "amend the design"; {{CHANGE}}: the change in one line. -->
  - Disposition: {{DISPOSITION}} <!-- # CONFIGURE: {{DISPOSITION}}: "proposed", or the user's choice and reason. -->

## Fitness

| Layer | Verdict | Because |
| --- | --- | --- |
| {{LAYER}} | {{VERDICT}} | {{REASON}} | <!-- # CONFIGURE: one row per layer; {{VERDICT}}: fits, too little, or too much; {{REASON}}: the Context sentence or the evidence. -->

## Symptoms

- **{{SYMPTOM}}** <!-- # CONFIGURE: {{SYMPTOM}}: the user's words; delete this section when none was reported. -->
  - Found: {{WHERE}} <!-- # CONFIGURE: {{WHERE}}: where it was located or reproduced, or "not reproduced". -->
  - Cause: {{CAUSE}} <!-- # CONFIGURE: {{CAUSE}}: the findings that explain it, or "unexplained", with what was checked. -->
  - Change to the design: {{AMENDMENT}} <!-- # CONFIGURE: {{AMENDMENT}}: the section and the sentence to add or change. -->

## Next step

{{NEXT}} <!-- # CONFIGURE: {{NEXT}}: one of: bring the artifacts back to the design; revise the design, then build; write down the design the harness implies, then repair it; nothing to do. With the findings each covers. -->

## Checked and found in order

{{CLEAN}} <!-- # CONFIGURE: {{CLEAN}}: what was examined and raised no finding, so that silence is not mistaken for coverage. -->
