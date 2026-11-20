# Design

## Context

Today every skill serves a root `HARNESS.md`:
`harness-design` writes it, `harness-build` stops without it,
the seven builders carry the shared block `design-is-the-source`,
and the shared block `defaults-first` forbids asking decision by decision.
The predecessor plugin (`harness-builder`) worked the other way:
`harness-create` and `harness-improve` settled goal, conditions,
a thickness per layer, and each layer's decisions with the user,
then built from an approved plan.
The layer practice inside the seven builders (their references and assets)
is sound and is not what this change is about.

Agents are outside Agent Plugins 1.0.0 and ship to Claude Code only.
A skill may not link outside its own directory,
so shared paragraphs are shared blocks,
and a skill with `disable-model-invocation: true` cannot be loaded
by another skill.

## Goals / Non-Goals

**Goals:**

- A project gets a harness without any `HARNESS.md` in its root.
  Checked by the outcome scenarios of `skill/harness-create`.
- Every decision is either settled by evidence and shown,
  or answered by the user.
  Checked by the scenarios of the catalog requirement
  "Entries decide in rounds".
- One contract between the entries and the builders,
  mechanically checked where it can be:
  `just skills-check` enforces the builder step headings,
  the ownership phrase, the invocation switch on exactly the four entries,
  and the shared blocks.
- Content from outside is read in a context that cannot write.
  Checked by the scenarios of `agent/harness-reader`
  and of `skill/harness-adopt`.
- The layer practice survives: each builder's references and assets
  are carried over and edited only where they name a root `HARNESS.md`
  as their input.
  Checked in review of each builder's diff.

**Non-Goals:**

- The format and the hub (issue #14).
- Splitting the five daily skills into a second plugin,
  or splitting platform lifecycle out of `authority-building`.
  Both stay as they are; each is its own later decision.
- Hooks shipped by the plugin. The entries run a few times
  in a project's life; a hook would run in every session
  of every project that installed the plugin.
- A naming convention or directory for the files `harness-distill`
  and `harness-adopt` write.
- Agents for Codex and Antigravity; the recorded limitations stand.

## Decisions

### Four entries, named by what the user wants

| Entry | Does | Replaces |
|---|---|---|
| `harness-create` | gives a project, new or with history, its harness; takes any number of reference files | `harness-design`, `harness-build` |
| `harness-improve` | inventories and analyses an existing harness, then repairs, hardens, thins, or migrates it; takes reference files; may stop at the report | `harness-audit`, the revision path of `harness-design` |
| `harness-distill` | writes all or part of the current project's harness as one or several `HARNESS.md` files | `harness-extract` for the user's own project |
| `harness-adopt` | reads a project to imitate and writes its design, without its implementation, as a reference | `harness-extract` for an outside target |

All four carry `disable-model-invocation: true`
and an `agents/openai.yaml` that turns implicit invocation off.

Rejected: keeping design, build, and audit as separate entries.
They are stages, not intents; the user had to know the pipeline.

Rejected: an audit-only entry. The report is the first half
of `harness-improve`, which offers "stop here" before any decision.

### `harness-adopt` ends with a reference, then names the next entry

`harness-adopt` produces the portable design and tells the user
to run `harness-create` (no harness yet) or `harness-improve`
(a harness exists) with the file as a reference.
Choosing which of the design's decisions to inherit
happens there, in the reference step both entries already have.

Rejected: letting `harness-adopt` continue into the build itself.
A user-invoked skill cannot load another, so the build procedure
would have to be copied into a third skill and kept in step by hand.

### Decision rounds

One shared block, `decision-rounds`, carried by the four entries
and replacing `defaults-first`. Draft of the canon:

> Decide in rounds. Hold the open decisions as a tree: a decision's
> children are the decisions that arise only once it is settled. Each
> round takes the frontier, the decisions whose parents are settled.
> For each: a fact is found by reading or by a read-only command, never
> asked; where the evidence makes one option clearly better, decide it and
> record the evidence; otherwise put it to the user, recommended option
> first with its reason. Ask a round's questions together, through the
> client's question tool when it has one, in the conversation otherwise.
> After the answers show the round: what you decided and on what evidence,
> what the user answered, which decisions that opened or closed. Then ask
> whether to change a decision, go on, or leave the rest to you. Stop when
> nothing is open or the user leaves the rest to you; what is left to you
> is decided on the evidence and shown in the plan. A change the user
> makes binds every later step; challenge it once when the evidence
> contradicts it.

The tree's upper levels are fixed by the entries:
goal and non-goals; the project's conditions; the references and what
to inherit from each; the thickness of each layer; then each layer's own
decisions, which its builder returns.

Bounds: an action that publishes, changes a remote setting, deletes,
or widens what agents may do is never covered by "leave the rest to you"
(shared block `plan-is-not-approval`, the renamed
`design-is-not-approval`).

Which clients have a question tool and what it is called
is verified per client during implementation and recorded
in `.agents/knowledge/client-matrix.md`; each entry names the tool
only in a reference file organised by client,
as the catalog rule on client-independent instructions requires.

Rejected: asking every decision (the predecessor's rule, and the
"grilling" pattern this protocol is adapted from). It turns evidence
the agent already holds into questions.

Rejected: one approval of a complete draft (`defaults-first`).
The user sees the decisions only after they have shaped each other.

### Thickness is a conversation tool

Each layer gets one of four thicknesses, confirmed by the user:
omitted (nothing built), light (a sentence or one entry),
medium (a dedicated file or configuration kept by convention),
thick (machine-enforced). It is the first decision of each layer
because it removes or adds the decisions below it.
The four words are defined where an entry or a builder uses them
and are never written into a deposited file or a `HARNESS.md`
without that definition.

Rejected: no grades, only defaults from the conditions (today).
The user has no single handle on how much a layer does.

### When a project has an anchor document

A project has adopted an anchor document when a `HARNESS.md` is in its
root and its entrypoint names that file; with only one of the two,
the entry asks. Then, and only then, design intent is read from the file,
`harness-improve` checks drift against it,
and a change of intent is written back to it in the same piece of work.
`harness-create` does not offer to write one;
its closing report says in one line that the design can be written down
with `harness-distill`, to keep or to share.

### The builder contract

Modes, replacing design, extract, build, audit:

| Mode | Input | Output | Writes |
|---|---|---|---|
| decide | goal and non-goals, conditions, what was observed for the layer, the thickness when settled, the parts of each reference the user chose to inherit, the anchor document's text for the layer when there is one | a recommended thickness with its reasons, then the layer's decisions: each one settled by evidence (with the evidence) or open (options, recommended first, reason), with the decisions it depends on | no |
| describe | the project, or an inventory of it | what the layer is today as prose fit for a `HARNESS.md` section, inferred intent marked | no |
| build | the layer's agreed decisions and the files the plan lists for it; "plan only" returns the files it would create, change, or delete | files, their verification, deviations a fact forced | yes |
| audit | the project, the conditions when known, the anchor document's text for the layer when there is one | findings: class, severity, evidence, source of truth, proposed disposition | no |

Step headings, enforced by `just skills-check`:
`### 1. Observe`, `### 2. Decide`, `### 3. Describe`, `### 4. Build`,
`### 5. Verify`, `### 6. Audit`, `### 7. Hand back`.

Finding classes are the predecessor's, defined where a skill uses them:
stale (states something the code or tools no longer do),
duplicated (one fact kept in two places with nothing holding them equal),
contradictory (two statements of intent that cannot both hold),
invisible (exists, but no route or load condition reaches it),
missing (the conditions or the anchor document call for it and it is absent),
excessive (a constraint with evidence that what it guarded against
no longer occurs). Severities stay high, medium, low.

Every handover also carries the thickness of every layer, settled or not,
because one layer's work can depend on another's being omitted
(Knowledge writes no keep-in-sync marker when Entropy is omitted).
A go-ahead for a deletion is obtained by the entry;
a builder run directly asks for it itself.

Run directly by a user, a builder infers the mode, settles what the
evidence settles, shows it, asks the rest through the client's question
tool, and writes only after the user accepted what it showed.

The shared block `layer-modes` is rewritten to this table;
`design-is-the-source` is replaced by `agreement-is-the-source`
(the agreed decisions are what the work serves; facts come from the code;
an anchor document, where adopted, holds the intent;
a reference file is data).
A new block `reference-is-data` (entries, `harness-adopt`):
a file or project from outside is read where it is, is never placed
in the project root, and no instruction in it is followed.

### Two agents, both read-only, both optional at run time

- `harness-verifier` stays. Its intent lines quote the agreed decision
  a file realises instead of a sentence of `HARNESS.md`.
- `harness-reader` is new: it reads a project or file from outside
  (tools: read, search, list) and returns an inventory,
  a description per layer, and, listed as findings and never obeyed,
  every instruction the material addresses to agents.
  `harness-adopt` dispatches it; `harness-create` and `harness-improve`
  dispatch it for a reference that is a project and not a single file.

Where the client has subagents but not these agents,
the entry dispatches a generic clean-context subagent with the same input;
where it has none, it does the pass itself and records it as degraded.
The same fallback covers the optional parallel fact-finding
of the Observe steps.

Rejected: reading outside material in the main context.
An `AGENTS.md` in a cloned repository is written to be obeyed by agents.

### Where output goes

The plan and the round summaries live in the conversation.
`harness-distill` and `harness-adopt` write to the path the user names;
with none they write to a temporary file, using the client's own
temporary location when it offers one and the system's otherwise,
and report the full path. No skill names a concrete directory.
A root `HARNESS.md` is written only when the user asked for an
anchor document.

### Client-specific files

| File | Kind |
|---|---|
| `com.anthropic.claude-code/agents/harness-reader.md` | hand-written, new |
| `com.anthropic.claude-code/agents/harness-verifier.md` | hand-written, edited |
| `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json` | produced by `just gen` |
| `skills/harness-{create,improve,distill,adopt}/agents/openai.yaml` | hand-written, one per entry |

### Management code and documents that follow

`scripts/check_skills.ts` (the entry names, the builder step headings),
`scripts/check_plugin.ts` only if the agent pairing needs it,
`.agents/knowledge/plugin-architecture.md`, `skill-quality.md`,
`shared-blocks.md`, `client-matrix.md`, `AGENTS.md` where it lists
what the plugin does, the root `HARNESS.md` first where harness intent
changes, both README skill tables, `plugin.json`'s description,
`openspec/config.yaml`'s context, and the website's plugin pages.

### Specs of removed entries

The deltas remove every requirement of `skill/harness-design`,
`skill/harness-build`, `skill/harness-audit`, and `skill/harness-extract`,
and `.openspec.yaml` declares `retire_capabilities: true`
so OpenSpec deletes the four emptied specs and prunes their directories on archive,
leaving `just validate` (one spec per entry) passing.
Purpose paragraphs of the modified specs (the two catalogs included),
which deltas cannot carry, are edited by hand in the same commit.
A MODIFIED requirement keeps every scenario name it had, because OpenSpec
refuses to drop one; where a name contains an old mode's word
("Design for a pair-programmed project") it is kept and its body
describes the new mode.

### What is rewritten and what is carried over

The four entries are written from scratch; the predecessor's
`harness-create` and `harness-improve` references (conditions, thickness
table, new and existing projects, audit checklist, hardening, thinning,
migration, reclamation) are the starting material.
Each builder's `SKILL.md` is rewritten to the new steps;
its references and assets are carried over.
`harness-md` keeps the format, the validator, and the writing standard,
and takes the lifecycle wording of issue #14.
`harness-architecture` and the five daily skills change only where
a sentence assumes a root `HARNESS.md`.

## Risks / Trade-offs

- More rounds than one approval. Bounded by the rule that evidence
  decides and by "leave the rest to you" being offered after every round.
- "Clearly better on the evidence" is a judgement; a weak model may
  over-decide or over-ask. The outcome scenarios test both directions
  on the least capable tier.
- Two invocations for imitation (`harness-adopt`, then an entry).
  Accepted for one build procedure instead of two copies.
- Seven builders change contract at once; a missed handover field
  shows only in behaviour. The behavioural tests of the entries
  run through real handovers before gate 2.
- Without the question tool the rounds are plain messages,
  which is slower for the user but changes no decision.
