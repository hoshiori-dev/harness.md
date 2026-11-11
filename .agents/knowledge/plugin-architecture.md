# Plugin Architecture

Read before adding, removing, or re-scoping a shipped skill or the agent, or
when a change touches how the workflow skills hand work to the layer
builders. This file is the contract between them; `scripts/lib/layers.ts`
holds the layer names and `just skills-check` enforces the mechanical parts.

## What ships

The plugin `harness-md` is built around one document: a project's
`HARNESS.md` (format: `spec/spec.md`). Every skill either produces that
document, reads it, or turns it into a harness.

| Skill | Kind | Invocation | Job |
|---|---|---|---|
| `harness-md` | format | model | Read, write, and validate a `HARNESS.md`; carries a copy of the specification, the writing standard, and the validator script |
| `harness-design` | workflow | user | Produce or revise a project's `HARNESS.md`, defaults first, one approval |
| `harness-build` | workflow | user | Turn a `HARNESS.md` (a pasted template or the project's anchor document) into the harness, or migrate an existing harness to it |
| `harness-extract` | workflow | user | Write the `HARNESS.md` that describes the harness a project already has (the user's own, or one to learn from) |
| `harness-audit` | workflow | user | Diagnose a harness: validate the file, find drift between design and artifacts, judge the design against the methodology; changes nothing |
| `harness-architecture` | manual | model | The methodology: why each layer exists, where a rule belongs, how context sets thickness |
| `environment-building` … `entropy-building` | layer builder (7) | model | The practice of one layer, in four modes |
| `spec-driven-development`, `openspec-workflow`, `spec-kit-workflow`, `lightweight-spec-workflow`, `project-skill-building` | daily | model | Work inside a harness that already exists |
| `harness-verifier` | agent (Claude Code only) | dispatched | Read-only read-back of harness files in a clean context |

The five user scenarios map onto the workflows: greenfield is design then
build; brownfield is audit, then design, then build; continuous improvement
is audit, then a design revision, then build; documenting or learning from a
harness is extract; migrating to a given `HARNESS.md` is build.

## The layer builder contract

One builder per layer, named `<layer>-building` in lowercase, for the seven
layers in `scripts/lib/layers.ts`: Environment, Knowledge, Feedback, Gates,
Authority, Completion, Entropy. A builder's description is one sentence of
at most 240 characters that contains `Owns the <Layer> layer` with the
layer's section name; the workflows find builders by that phrase and never
by skill name.

A builder works in four modes (shared block `layer-modes`):

| Mode | Input | Output | Writes files |
|---|---|---|---|
| design | Context, what was observed, the user's goal | the layer's section as prose, the defaults applied, questions no default can answer | no |
| extract | the project | the layer's section describing what exists, with inferred intent marked as inferred | no |
| build | the section, plus assigned parts of Invariants, Style, File Structure | files, their verification, deviations for the workflow to reconcile into `HARNESS.md` | yes |
| audit | the section and the project | findings: severity, evidence (`path:line`), the sentence of the section, and whether to fix the artifact or amend the design | no |

Every builder's `SKILL.md` has the same workflow steps so the workflows can
address them: 1 Observe, 2 Write the section (design, extract), 3 Build,
4 Verify (build), 5 Audit, 6 Hand back. Step 2 carries the layer's decision
list: every decision the section must settle, each with a default chosen
from the project's Context (cost of a wrong change, maintenance horizon,
who relies on the conventions, how unattended agents are, hosting platform,
clients and models) and the reason for it.

Conventions every builder and workflow shares:

- **Severity** of an audit finding: `high` (a safety boundary or an
  always-on rule is missing or contradicted), `medium` (the design and the
  project disagree so that a task could go wrong), `low` (wording or
  tidiness only).
- **Routes owed.** A builder that deposits a knowledge file adds its own row
  to the entrypoint's routing table only when the entrypoint exists and
  stays within its budget; otherwise it hands back a "route owed" (the
  situation and the file). The build workflow passes routes owed to the
  Knowledge builder.
- **Audit with no section.** A required layer is compared with the step 2
  defaults for the project's Context and each finding is marked "no design
  to compare with"; an optional layer with no section is reported as
  omitted by the design.
- **Keep In Sync marker.** The entrypoint's `## Keep In Sync` section
  carries `<!-- harness: keep-in-sync -->`; Knowledge writes it when the
  design has an Entropy section and Entropy fills it.

Run directly by a user without a workflow, a builder infers the mode from
the request. Before it writes files that no `HARNESS.md` section covers, it
drafts the section (or the change to it), gets one approval, and, when the
project keeps `HARNESS.md` as its anchor document, records it there.

Layer boundaries follow `spec/spec.md` section 5.1. Authority includes the
platform lifecycle (commits, branches, merge method, labels, issue forms,
request templates, releases, remote settings). Feedback is what an agent
can run and observe to verify its own work; Gates is what blocks a defect
whether or not the agent looked.

## The three sections that are not layers

`harness-build` hands Invariants, Style, and File Structure to the layers;
no builder owns them.

| Section | Goes to |
|---|---|
| Invariants | Knowledge (the always-on rules of the entrypoint); Gates (each invariant a deterministic check can enforce); Authority (each invariant about what an agent may do) |
| Style | Gates (what a formatter, linter, type checker, or structure check can enforce); Knowledge (conventions an agent has to read); Feedback (test granularity and how tests are run) |
| File Structure | each layer creates the paths it owns; `harness-build` creates the rest of the skeleton; Entropy registers the layout in the harness self-check |

## Budgets

Codex lists every skill description in at most 8,000 characters or 2% of
context, so descriptions are a shared budget: all shipped descriptions
together stay under 8,000 characters; a builder's is at most 240, a
workflow's at most 400, any other at most 700. The four workflows carry
`disable-model-invocation: true`.

## What the plugin never does

- It does not carry the methodology as one document; each skill carries the
  principles it needs and `harness-architecture` explains the whole.
- It ships no diff tool: the validator checks one file's format and nothing
  else.
- It writes nothing into a target project that names the plugin (shared
  block `deposited-files-stand-alone`).
