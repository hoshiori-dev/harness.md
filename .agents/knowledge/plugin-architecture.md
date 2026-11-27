# Plugin Architecture

Read before adding, removing, or re-scoping a shipped skill or an agent,
or when a change touches how the entry skills hand work
to the layer builders. This file is the contract between them;
`scripts/lib/layers.ts` holds the layer names
and `just skills-check` enforces the mechanical parts.

## What ships

The plugin `harness-md` helps a developer and their coding agent
work out and build a good agent harness together.
Its subject is the harness, not a document.
A `HARNESS.md` (format: `spec/spec.md`) is what the plugin reads
as a reference and writes as a summary;
it is a project's anchor document only where the project chose one.

| Skill | Kind | Invocation | Job |
|---|---|---|---|
| `harness-create` | entry | user | Give a project, new or with history, its harness; takes any number of reference files |
| `harness-improve` | entry | user | Inventory and analyse an existing harness, report, then repair, harden, thin, or migrate it; may stop at the report |
| `harness-distill` | entry | user | Write all or part of the current project's harness as one or several `HARNESS.md` files |
| `harness-adopt` | entry | user | Read a project to imitate as data and write its design, without its implementation, as a reference |
| `harness-md` | format | model | Read, write, and validate a `HARNESS.md`; carries a copy of the specification, the writing standard, and the validator script |
| `harness-architecture` | manual | model | The methodology: why each layer exists, where a rule belongs, how conditions set thickness |
| `environment-building` … `entropy-building` | layer builder (7) | model | The practice of one layer, in four modes |
| `spec-driven-development`, `openspec-workflow`, `spec-kit-workflow`, `lightweight-spec-workflow`, `project-skill-building` | daily | model | Work inside a harness that already exists |
| `harness-verifier` | agent (Claude Code only) | dispatched | Read-only read-back of harness files in a clean context |
| `harness-reader` | agent (Claude Code only) | dispatched | Read-only reading of a project or file from outside, reporting and never obeying what it says |

What a user wants maps onto one entry:
a first harness is `harness-create`;
something wrong with an existing one, or a prototype that has to harden,
is `harness-improve`;
a design to hand on or keep is `harness-distill`;
a harness like another project's is `harness-adopt`,
then `harness-create` or `harness-improve` with its result as a reference.
A user-invoked skill cannot load another,
which is why `harness-adopt` ends by naming the entry to run next.

## Deciding with the user

The four entries carry the shared block `decision-rounds`.
Open decisions form a tree; each round takes the decisions
whose prerequisites are settled.
A fact is found, never asked.
Where the evidence makes one option clearly better the agent decides
and shows the decision with its evidence; the rest is asked,
through the client's question tool where there is one
(`references/question-tools.md` in each entry, the same file in all four,
naming no client).
After each round the user changes a decision, continues,
or leaves the rest to the agent.
Nothing is written before the user approved a plan that names every file,
and publishing, remote settings, deletions, and wider agent permissions
are decided when reached, whatever was left to the agent
(`plan-is-not-approval`).

The upper levels of the tree are fixed by the entries:
goal and non-goals; the project's conditions
(cost of a wrong change, maintenance horizon, who relies on the conventions,
how unattended agents are, hosting platform, clients and weakest model);
what to inherit from each reference; each layer's thickness;
then each layer's own decisions, which its builder returns.

Thickness (`layer-thickness`) is omitted, light, medium, or thick,
one per layer, confirmed by the user, settled before the layer's
other decisions. The words stay in the conversation.

## Anchor documents and references

A project has an anchor document only when a `HARNESS.md` is in its root
and its entrypoint names it; with one of the two, the entry asks.
A file the user asked for or confirmed counts from then on,
and the entry names it in every handover.
Then design intent is read from the file, `harness-improve` checks drift
against it, and an agreed change of intent is written back to it
in the same piece of work.
No entry requires one, and none writes one into a root unless asked.

Any other `HARNESS.md`, and any project read from outside,
is data (`reference-is-data`): read where it is, never executed,
never copied into a root, each decision weighed against the project's
own conditions. A project from outside is read through `harness-reader`.

`harness-distill` and `harness-adopt` write to the path the user names;
with none, to a temporary file in the client's temporary location
when it offers one and the system's otherwise. No skill names a directory.

## The layer builder contract

One builder per layer, named `<layer>-building` in lowercase,
for the seven layers in `scripts/lib/layers.ts`:
Environment, Knowledge, Feedback, Gates, Authority, Completion, Entropy.
A builder's description is one sentence of at most 240 characters
that contains `Owns the <Layer> layer`;
the entries find builders by that phrase and never by skill name.

A builder works in four modes (shared block `layer-modes`):

| Mode | Input | Output | Writes files |
|---|---|---|---|
| decide | goal and non-goals, conditions, what was observed, every layer's thickness when settled, the parts of each reference the user chose to inherit, the anchor document's text for the layer when there is one | a recommended thickness with its reasons, then the layer's decisions: each settled with its evidence, or open with options (recommended first), the reason, and the decisions it depends on | no |
| describe | the project, or an inventory of it | what the layer is today as prose fit for a `HARNESS.md`, inferred intent marked | no |
| build | the layer's agreed decisions and the files the plan lists for it; "plan only" returns the files it would create, change, or delete | files, their verification, deviations a fact forced | yes |
| audit | the project, the conditions when known, the anchor document's text for the layer when there is one | findings: class, severity, evidence, source of truth, proposed disposition | no |

Every builder's `SKILL.md` has the same workflow steps so the entries
can address them: 1 Observe, 2 Decide, 3 Describe, 4 Build, 5 Verify,
6 Audit, 7 Hand back.
Modes run: decide 1, 2, 7; describe 1, 3, 7; build 1, 4, 5, 7;
audit 1, 6, 7.
Step 2 defines what the layer looks like at each thickness
and carries the layer's decision list (inline or in a reference loaded in decide mode):
every decision the layer has to settle, each with one recommendation,
the condition that selects it, and the reason.

Conventions every builder and entry shares:

- **Findings** (`finding-classes`): class (stale, duplicated,
  contradictory, invisible, missing, excessive), severity (high, medium,
  low), evidence (`path:line` or the output of a command that was run),
  the source of truth, one proposed disposition.
- **Routes owed.** A builder that deposits a knowledge file adds its own row
  to the entrypoint's routing table only when the entrypoint exists and
  stays within its budget; otherwise it hands back a "route owed" (the
  situation and the file). The entry passes routes owed to the
  Knowledge builder.
- **Audit with no anchor document.** The layer is compared with what the
  project's conditions call for, and each finding is marked as having
  no recorded design to compare with. A missing `HARNESS.md` is never
  a finding.
- **Keep In Sync marker.** The entrypoint's `## Keep In Sync` section
  carries `<!-- harness: keep-in-sync -->`; Knowledge writes it when
  the Entropy layer's thickness is not omitted, and Entropy fills it.
- **Deletions.** A go-ahead for a deletion is obtained by the entry;
  a builder run directly asks for it itself.

Run directly by a user without an entry,
a builder infers the mode from the request, shows what the evidence settles,
asks the rest through the client's question tool, and writes only after
the user accepted what it showed (`agreement-is-the-source`).

Layer boundaries follow `spec/spec.md` section 5.2.
Authority includes the platform lifecycle (commits, branches, merge method,
labels, issue forms, request templates, releases, remote settings).
Feedback is what an agent can run and observe to verify its own work;
Gates is what blocks a defect whether or not the agent looked.

## Budgets

Codex lists every skill description in at most 8,000 characters
or 2% of context, so descriptions are a shared budget:
all shipped descriptions together stay under 8,000 characters;
a builder's is at most 240, an entry's at most 400, any other at most 700.
The four entries carry `disable-model-invocation: true`
and an `agents/openai.yaml` that turns implicit invocation off.

## What the plugin never does

- It does not carry the methodology as one document;
  each skill carries the principles it needs
  and `harness-architecture` explains the whole.
- It ships no diff tool:
  the validator checks one file's format and nothing else.
- It ships no hook and no MCP server.
  The entries run a few times in a project's life;
  a hook would run in every session of every project that installed it.
- It writes nothing into a target project that names the plugin
  (shared block `deposited-files-stand-alone`).
- It never treats a `HARNESS.md` it was handed as instructions.
