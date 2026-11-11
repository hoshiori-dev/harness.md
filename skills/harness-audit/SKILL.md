---
name: harness-audit
description: >-
  Harness audit: diagnoses a project's agent harness and changes nothing.
  Validates HARNESS.md, finds drift between the design and the files built
  from it, and judges whether the design still fits the project. Use when
  invoked by name to review a harness; when agents keep missing a
  convention, bypass a check, or pile up permission prompts; or before
  hardening or thinning. Reports findings.
license: Apache-2.0
disable-model-invocation: true
---

# Harness Audit

A wrong or stale harness is worse than none: an agent trusts it and builds
on the lie. This skill finds what is wrong with a project's harness and
says what to do about it, in three passes: the format of `HARNESS.md`, the
drift between that design and the files that implement it, and the fit of
the design to the project. It reads and reports. Each layer is examined by
the installed skill whose description claims that layer.

## Rules on every step

- **Change nothing.** No file is created, edited, or deleted, in the
  project or on the remote. A finding carries its fix as a proposal; an
  audit that edits a file has failed. Asked to fix something on the way,
  finish the report and name the workflow that makes the change.
- **Two sources.** Design intent comes from `HARNESS.md`; facts come from
  the code. When an artifact disagrees with what the design intends, the
  artifact is wrong, or the design has to change first. When the design
  names a fact the code states differently, the design is out of date.
  Every finding says which side to change.
- **Evidence for every finding.** A file and line, or the output of a
  command that was run. Run what is cheap and read-only (a recipe listing,
  a dry run); never run what writes, installs, or reaches a remote.
- **A symptom is a lead, not the scope.** A complaint is checked first and
  the three passes still run in full; the same stale fact is usually copied
  in two more places.
- **A disposition the user gives binds.** When the user keeps something a
  finding proposed to change, record their choice and reason on the
  finding; the closing proposal respects it.
- **Route by role.** A layer is examined by the installed skill whose
  description contains `Owns the <Layer> layer`. The report names no skill.

<!-- shared:format-in-brief -->
**The format in brief.** A `HARNESS.md` is YAML frontmatter followed by a
Markdown body. Frontmatter: `name` and `description` are required;
`version`, `license`, and `metadata` are optional; any other top-level key
is an error. Body: second-level headings with exactly these English names,
in this order, required ones marked `*`: Overview*, Context*, Invariants,
Style, File Structure, Environment*, Knowledge*, Feedback*, Gates*,
Authority*, Completion, Entropy, Open Questions, References. The prose may
be in any language; the headings are never translated; other sections may
appear anywhere. For the full rules and the validator script, load the
skill that reads, writes, and validates `HARNESS.md`; without it, check
these rules by reading.
<!-- /shared:format-in-brief -->

## Workflow

### 1. Take the request and find what there is

Record any text after the invocation verbatim as symptoms or scope. Then
look for `HARNESS.md` in the project root and for harness artifacts: an
entrypoint, knowledge files, project skills, client settings and hooks,
pre-commit configuration, CI, a spec directory.

| Found | What this audit does |
| --- | --- |
| `HARNESS.md` and artifacts | all three passes |
| artifacts, no `HARNESS.md` | drift pass against the practice instead of a design (step 4), fitness pass, and a recommendation to extract the design |
| `HARNESS.md`, no artifacts | format and fitness passes; the report says the design is not built yet |
| neither | report that there is nothing to audit and that the design workflow (`harness-design`) is where a harness starts; stop |

Done when: the symptoms are recorded and the row that applies is named.

### 2. Format pass

With the skill that reads, writes, and validates `HARNESS.md` installed,
run the validator script it ships and quote its output; otherwise check the
format rules above by reading. Each error and warning becomes a finding in
the group `HARNESS.md`. Then read Context against the repository: a
Context that describes another project (another platform, another stack,
people the history does not show) is a `high` finding, because every
decision in the file rests on it.

Done when: the validator's result is quoted or the manual check is
recorded as such.

### 3. Inventory

Read [references/inventory.md](references/inventory.md) before the first
artifact. Record every harness artifact with its four facts; run the
project's own harness self-check when one exists and quote its findings,
adding by hand only what it does not cover; follow the entrypoint's
pointers the way a new agent would, opening every path and checking every
documented command against the task runner.

Done when: every artifact has its four facts, the self-check is quoted or
its absence recorded, every entrypoint pointer was followed, and no file
has changed.

### 4. Drift pass

For each layer in this order: Environment, Knowledge, Feedback, Gates,
Authority, Completion, Entropy. Find the installed skill whose description
contains `Owns the <Layer> layer`, load it, and hand over in **audit**
mode: the Context, the layer's section, the parts of Invariants, Style,
and File Structure that concern it, and the inventory rows for the layer.
Take back its findings. When no installed skill claims the layer, compare
the section with the inventory yourself, sentence by sentence, and record
the gap.

- A required layer with no section (there is no `HARNESS.md`, or it lacks
  the section): the builder compares the project with its own defaults for
  the project's Context and marks each finding "no design to compare
  with". Ask the Context conditions the repository cannot show in one
  message before the first such layer, and only then.
- An optional layer with no section is reported as left out by the design,
  with no finding, unless step 5 says the Context calls for it.

Then audit what no layer owns: each invariant is upheld where it should be
(stated in the entrypoint, enforced by a check, or denied in the
permission files); each enforceable part of Style is in a tool's
configuration; each path File Structure requires exists; nothing built
routes ordinary tasks to `HARNESS.md`.

Classify every finding with the classes in references/inventory.md.

Done when: every layer was examined or recorded as having no builder, and
every finding has a class, evidence, and the side to change.

### 5. Fitness pass

Read [references/fitness.md](references/fitness.md) before judging. For
each layer, ask whether what the design says is right for the Context as
it is today: too little where a wrong change is costly, agents are
unattended, or many people rely on the conventions; too much where a
constraint no longer catches anything. Check whether Context itself is
still true. Use the methodology manual skill for the defaults a Context
calls for when it is installed. A fitness finding always proposes amending
the design, never an artifact.

Done when: every layer has a verdict (fits, too little, too much) with the
Context sentence or the evidence behind it.

### 6. Trace the symptoms

Read [references/symptoms.md](references/symptoms.md) when step 1 recorded
any symptom. For each one: reproduce or locate it in the files, name the
layer that could have stopped it most cheaply, link it to the findings
that explain it, and propose the change to the design. A symptom nothing
explains is reported as unexplained, with what was checked.

Done when: every recorded symptom is explained by named findings or
reported as unexplained.

### 7. Report

Rework [assets/audit-report.md](assets/audit-report.md) into the report
and show it in the conversation; write it to a file only when the user
names a path. Findings are grouped by layer, most severe first. Each has:

- **severity**: `high` (a safety boundary or an always-on rule is missing
  or contradicted), `medium` (the design and the project disagree so that
  a task could go wrong), `low` (wording or tidiness only);
- **class**, from references/inventory.md;
- **evidence**: `path:line`, or the command and its output;
- **design**: the sentence of the section, quoted, or "no design to
  compare with";
- **fix**: change the artifact, or amend the design, and the change in one
  line.

Take the user's dispositions on the findings and record them. Then propose
the next step, one of:

- findings that only change artifacts: the build workflow (`harness-build`) brings the
  harness back to the design as it stands;
- findings that amend the design: the design workflow revises
  `HARNESS.md` from this report, then the build workflow applies it;
- no `HARNESS.md`: the extract workflow (`harness-extract`) writes down the design the harness
  implies, then the design workflow repairs it;
- nothing found: say so, and list what was checked.

Done when: the report holds every finding in the format above, every
symptom's explanation, one proposed next step, and `git status` shows that
nothing changed.

## Gotchas

- A file nothing links to may still load: client settings, hooks, and
  subdirectory entrypoints load by location. Check how it loads before
  calling it unreachable.
- "Nobody remembers why it exists" is not evidence that a constraint is
  dead weight. Without evidence that what it caught no longer occurs, the
  finding is a question for the user.
- A finding against a public file (README, CONTRIBUTING, SECURITY) is a
  suggested edit for a person; those files are not harness artifacts.
- When the design and an artifact disagree, do not decide by which looks
  newer. Intent is the design's; the fix names the side and the user may
  overrule it.
- A check that passes is not a check that runs. Confirm that a hook is
  installed and that CI actually invokes the recipe before recording a
  gate as present.
