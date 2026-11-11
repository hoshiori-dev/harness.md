---
name: harness-design
description: >-
  Harness design: produces or revises a project's HARNESS.md, the document
  that records its agent harness design, defaults first and behind one
  approval. Use when invoked by name to design a harness for a new or
  existing project, to adapt a HARNESS.md taken from elsewhere, or to revise
  the design after an audit or a recurring failure. Writes the document
  only; never builds the harness.
license: Apache-2.0
disable-model-invocation: true
---

# Harness Design

Produce the `HARNESS.md` of a project: the one document that says what its
agent harness should be and why. The harness itself (entrypoint, knowledge
files, checks, permission files) is built later from this document, so the
document has to be complete enough to build from. This skill holds the
procedure; the practice of each layer lives in the installed skill whose
description claims that layer.

## Rules on every step

<!-- shared:defaults-first -->
Defaults first. Settle from the repository everything it can show (tools in
use, directories, commands, history). Ask the user, once and in one round,
only for context the repository cannot show. Then draft the complete design
with one stated default for every decision, each with its reason, and
present it for a single approval. Never interview decision by decision. A
default the user changes binds every later step; challenge a change once
when the evidence contradicts it.
<!-- /shared:defaults-first -->

<!-- shared:nothing-lands-before-agreement -->
Nothing lands before agreement. Create or change no file in the target
project until the user has approved the design that covers it; an inspection
step reads and reports, it never writes.
<!-- /shared:nothing-lands-before-agreement -->

<!-- shared:deposited-files-stand-alone -->
Deposited files stand alone. Nothing written into the target project names
this plugin, any of its skills or agents, or a path inside a skill
directory, and no term only this plugin defines is used there without being
defined. `HARNESS.md` and its section names may be named: the file is the
project's own.
<!-- /shared:deposited-files-stand-alone -->

- **Buildable from the file alone.** A reader who has only `HARNESS.md`,
  no skill, and no memory of this conversation must be able to build the
  harness. Every section names its files, commands, tools, thresholds, and
  budgets; gives the reason for each decision; and says what is
  deliberately not done and why. The file has no length limit; never trim
  a section to save space.
- **Set each layer on its own.** Every default is traced to the project's
  Context, one layer at a time. A label ("a research repo", "production")
  is evidence for the Context, never a setting. When one part of the
  repository needs different treatment, the layer's section says so.
- **Keep what works.** A task runner, lint configuration, branch habit,
  commit convention, or spec tool in use is recorded as the design, not
  replaced. A replacement the design would benefit from is a suggestion in
  Open Questions.
- **Route by role.** A layer's section comes from the installed skill whose
  description contains `Owns the <Layer> layer`, with the layer named as in
  step 5. Write no skill name anywhere.
- **This skill writes one file.** `HARNESS.md` in the project root, after
  approval. README, CONTRIBUTING, and SECURITY are read, never written.
- **One agent at a time** is the design's assumption unless the user says
  several agents will write to the repository at once.

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

### 1. Find the starting point

Record any text after the invocation as the user's goal or complaint, in
their words. Then look at the project root and decide which of four starts
this is:

- **New design, nothing to preserve**: no `HARNESS.md`; no build or test
  command, no CI, no hooks, a handful of commits.
- **New design over existing habits**: no `HARNESS.md`, and the repository
  shows any habit (commands, a task runner, CI, hooks, branch or commit
  conventions, agent-facing files). A single old `CLAUDE.md` puts the
  project here.
- **A design from elsewhere**: a `HARNESS.md` whose Context describes
  another project or a kind of project, or that the user says came from
  somewhere else.
- **A revision**: a `HARNESS.md` whose Context describes this project, plus
  audit findings, a recurring failure, or a change the user wants.

When a `HARNESS.md` exists and its Context could be either, the question
"is this file's Context about this project?" joins the round in step 3.

Done when: one start is named, with the evidence for it.

### 2. Observe

Read the repository before asking anything; read all of it instead of
sampling. Record, each with where it was seen: layout and stack; build,
test, lint, and format commands; the task runner and its recipes; checks,
CI, and hooks; branch and commit-title habits from `git log`; the remote
and the hosting platform it shows (`git remote -v`); whether the session
runs inside an isolated environment the repository declares; every
agent-facing file, project skill, permission file, and registered tool.

Read [references/existing-habits.md](references/existing-habits.md) when
the repository shows any habit or agent-facing file, and run its inventory.

Done when: every recorded fact has its evidence (a file and line, or
command output), and no file has changed.

### 3. Ask the context round

Read [references/context-round.md](references/context-round.md) before
writing the round. Ask, in one message, only what step 2 could not settle:
the goal when the invocation did not give it; what a wrong change costs;
how long the project will be maintained; who relies on its conventions; how
unattended agents are; which clients and which weakest model will work
here. Present each value inferred from evidence as an inference to confirm
in the same message. Never ask the hosting platform when the remote shows
it, and never ask for a decision a default can make.

This is the only question round. A question that arises later goes into
Open Questions and is shown with the draft.

Done when: every Context condition is observed, a confirmed inference, or
the user's answer.

### 4. Write Overview and Context

Read [references/sections.md](references/sections.md) before writing any
section yourself; it holds what each of the seven sections outside the
layers must contain. Write Overview (who the harness serves, what it is
meant to achieve, what it does not police, what always stays with a human)
and Context (the given conditions from step 3 and the observed facts the
design has to fit). A goal that reaches beyond the harness (splitting a
monolith, changing a framework) is named in Overview as outside the design.

Done when: both sections are drafted and every later default can cite a
sentence of Context.

### 5. Collect the layer sections

For each layer in this order: Environment, Knowledge, Feedback, Gates,
Authority, Completion, Entropy. Find the installed skill whose description
contains `Owns the <Layer> layer`, load it, and hand over in **design**
mode: the Context, the goal, what step 2 observed for this layer, anything
Overview rules out, and the layer's existing section when the start is a
design from elsewhere or a revision. Take back the section as prose, the
defaults it applied, and the questions no default could answer.

- Environment, Knowledge, Feedback, Gates, and Authority always get a
  section. A layer that should do nothing gets a section that says so and
  why.
- Completion and Entropy get a section unless the builder returns that the
  layer should be left out for this Context; then the section is absent and
  the reason goes into the approval summary.
- When no installed skill claims a layer, write its section yourself with
  the methodology manual skill, and record the gap for the approval
  summary. When two claim it, use either and say which.

After the seventh, read the sections against each other: every tool an
Authority rule mentions exists in Environment; every command Gates runs is
one Feedback or the task runner defines; every file Knowledge routes to is
one some section creates; no two sections decide the same thing
differently. Fix a disagreement by returning to the builder of the layer
that owns the topic.

Done when: every required layer has a section, and the cross-reading finds
no disagreement.

### 6. Write the remaining sections and the frontmatter

Following references/sections.md, write Invariants, Style, and File
Structure where the design has something to say, then Open Questions (every
question a builder returned, every unresolved contradiction, every
suggested replacement of a working habit) and References (outside material
the design actually relied on, each one checked to exist). Leave out an
optional section that would be empty.

Rework [assets/harness-skeleton.md](assets/harness-skeleton.md) into the
file: it gives the frontmatter and the heading order. Frontmatter: `name`
(lowercase letters, digits, single hyphens, at most 64 characters) and
`description` (what this design is and what kind of project it suits, at
most 1024 characters). Add `license` only when the user intends to publish
the file; leave `version` and `metadata` out unless the user asks for them.

Done when: the draft has frontmatter and every required section, in order.

### 7. Review and validate the draft

Read the draft as someone who has only this file:

1. Could each section be built without asking anyone? Mark every sentence
   that names no file, command, tool, or number where one is needed, and
   fix it.
2. Does every decision carry its reason, and is the reason a sentence of
   Context or an observed fact?
3. Search for words that need this plugin to understand (a mode name, a
   skill name, "the builder"); rewrite each plainly.
4. Does anything route ordinary tasks to `HARNESS.md`? The design may say
   the entrypoint names the file in one line for harness checks and
   changes; it never makes the file something agents read on every task.

Then validate: with the skill that reads, writes, and validates
`HARNESS.md` installed, run the validator script it ships on the draft and
fix every error; otherwise check the format rules above by reading.

Done when: the four readings find nothing and validation reports no error.

### 8. Present for one approval

Show the complete draft in the conversation, followed by an approval
summary: the defaults applied, grouped by layer, each with the Context
sentence behind it; the sections left out and why; Open Questions; any
layer written without a builder. Ask for one approval of the whole.

When the user changes a default, challenge it once if the evidence
contradicts it, then adopt it, return to the affected builder when the
change reaches into a layer, and repeat step 7. When the user rejects the
draft or stops, write nothing and summarise the observation, the Context,
and the open points so the work can resume.

Done when: the user approved the draft as presented, or the work ended with
nothing written.

### 9. Write the file and hand over

Write `HARNESS.md` to the project root, validate the file on disk, and
commit nothing unless the user asks. Then tell the user what the document
is and is not: it is the design, nothing has been built from it, and the
plugin's user-invoked build workflow (`harness-build`) is what turns it into the harness (for
a revision: what brings the existing harness to the revised design). Stop
there.

Done when: `HARNESS.md` exists, validates, and no other file has changed.

## Starts that change the steps

- **A design from elsewhere**: read
  [references/adapting.md](references/adapting.md) before step 4; it
  replaces the plain reading of steps 4 to 6.
- **A revision**: before step 4, read
  [references/revising.md](references/revising.md) when the start is a
  revision; only the sections the change touches are redrafted, and
  the approval shows the difference.
- **New design, nothing to preserve**: every default comes from Context
  alone. Design only commands the first build can make real, and start
  thin: a layer does more when the friction agents actually hit calls for
  it. When no source file shows the intended stack, the stack joins the
  round in step 3.

## Gotchas

- A default is still a decision. "We will decide the test command later"
  cannot be built; write the default and let the user change it.
- An inferred Context value presented as settled ("one author in the log,
  so a single maintainer") becomes a wrong design nobody was asked about.
  Inferences are confirmed in the round.
- A section that copies facts the code states (the directory listing, a
  command's flags) is wrong the day they change. The design names the
  recipe or the path; the code states the rest.
- Specifications for code nobody is changing rot from the day they are
  written. When the user wants them, say so once and record the decision
  in Completion.
