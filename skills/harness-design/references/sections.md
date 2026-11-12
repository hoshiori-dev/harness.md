# The Sections Outside the Layers

Read before writing the introduction, Context, Invariants, Style,
File Structure,
Open Questions, or References. The seven layer sections come from their
builders; the introduction and these six sections are written here. For each:
what it must contain,
where its content comes from, and what does not belong.

## The writing standard

It applies to every section, layer sections included; check a builder's
section against it before accepting it.

- **Buildable.** Name the file, the command, the tool, the number. "Tests
  run fast" cannot be built; "`just test <path>` runs one module's tests in
  under ten seconds" can.
- **Reasoned.** Each decision is followed by its reason, and the reason is
  a condition from Context or an observed fact. A reader in a different
  context needs the reason to know whether the decision still holds for
  them.
- **Explicit about what is absent.** What the design deliberately does not
  do is written with its reason, so that it never looks forgotten.
- **Plain.** No word that needs a tool or a methodology to understand. A
  term the project will use (for example a list of decisions waiting for
  the user) is defined where it first appears.
- **As long as needed.** No ordinary task loads this file, so length costs
  nothing. Do not compress, and do not pad.
- **Design, not inventory.** Say what must be true. Facts the code states
  (a full directory listing, a command's flags) stay in the code.

## The introduction

It sits directly under the title, before the first second-level heading,
as ordinary paragraphs with no heading of its own.
The format has no `## Overview` section; the introduction does that work.
Four things: who the harness serves (which people, which agents); what it
is meant to achieve, in terms of outcomes ("an agent can take an issue to a
reviewed pull request without a person watching"); what it does not police
(for example code style the project never enforced); what always stays with
a human (merging, releases, remote settings, or whatever the user said).
Name here any goal that reaches beyond the harness as outside the design.

## Context (in every complete design)

The given conditions, as prose: what a wrong change costs, how long the
project will be maintained, who relies on its conventions, how unattended
agents are, the hosting platform, the clients and the weakest model. Add
the observed facts the design must fit: the stack, the task runner in use,
an existing isolated environment, habits that stay. Say for each condition
whether it was stated by the user or observed. Context holds no decision;
a sentence that starts "we will" belongs in a layer.

## Invariants (optional)

The cross-layer rules every task must follow whatever it is about. Keep
only rules whose violation costs the same on any task: secret handling, the
validation command that must pass before work is called done, commit
discipline, what is never done without a go-ahead, the language of code and
documents. Each invariant says how it is upheld: a check enforces it, the
entrypoint states it, or the permission files deny the opposite. A rule
that applies to one kind of task is not an invariant; it belongs in the
layer that owns it. Leave the section out when the layers already say
everything.

## Style (optional)

The shape the code itself should have so that agents can work in it:

- how cohesive modules are and where the boundaries between them run;
- which constraints are expressed in types, schemas, or assertions instead
  of in written reminders;
- whether every command goes through one entry (a task runner) and which;
- how fine-grained tests are and where they live relative to the code;
- the project's stance on new dependencies.

Concrete formatting and naming rules are not written here: name the
formatter and linter and let their configuration hold the rules. On an
existing project, describe the shape the code has and mark what is a target
the code does not meet yet. Leave the section out when the design asks
nothing of the code's shape.

## File Structure (optional)

The layout the design requires: which directories and files have to exist
and what each holds. Collect every path the layer sections name (the
entrypoint, the knowledge directory, the project-skill directory, hook and
check locations, permission files, CI files, the spec directory) and add
the source layout only as far as the design depends on it. Any form works:
a tree with one-line purposes is the usual one. It is intent, not a
listing of what exists; a path the build will create belongs here, a path
that merely happens to exist does not.

## Open Questions (optional)

Everything undecided: a question a builder returned that no default could
answer; a contradiction between two existing sources of intent that only
the user can settle; a working habit the design keeps although a
replacement looks better, with the suggestion. Each item says what depends
on it. Nothing is built from this section.

## References (optional)

Outside material the design relied on: a paper, a vendor's documentation, a
design this one was adapted from. Each entry was opened and says what it
was used for. Material an agent must read while working is not a reference;
it belongs in Knowledge. Never list a source that was not checked.
