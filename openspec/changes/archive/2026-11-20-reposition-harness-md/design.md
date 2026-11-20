# Design

## Context

The specification text is the maintainer's own draft
(Chinese first, English made from it once; English is authoritative since).
Its section 3 has four numbered subsections the maintainer approved,
and the website links to them.
Both validators take a path and never look at the file's name,
so where a file lives was only ever a statement of the prose
and of `format/document`.
Each hub entry opens with a section "How to use this file":
ten steps that begin with the file in a project root and end by asking
whether it stays. The same procedure is the build workflow of the plugin,
which is rebuilt in the next change.

## Goals / Non-Goals

**Goals:**

- The maintainer's text stays the base of the specification:
  only the sentences listed under "Edits to the specification" change.
  Checked by `git diff --stat spec/` touching sections 3 and 4.1 only,
  and by the reviewer reading the table below against the diff.
- Section numbers 3.1 to 3.4 keep their numbers,
  so existing links to 3.2, 3.3, and 3.4 still land on the same subject.
  Checked by `grep -n "^### 3\." spec/spec.md`.
- No rule a validator applies changes.
  Checked by `git diff --quiet main -- scripts/lib/harness_md.ts
  skills/harness-md/scripts/lint_harness_md.py spec/fixtures`.
- A hub entry keeps every design decision it makes today.
  Checked in review: each entry's diff removes procedure and placement,
  and rewords realisations as examples, without dropping a decision.

**Non-Goals:**

- The plugin's skills and agent. They keep the old positioning
  until the next change; `just skills-check` still passes
  because the specification copy is updated here.
- The website's behaviour (`openspec/specs/site/spec.md`).
  The prompt on a hub entry page already has the agent read the file
  at its published URL; only its wording is touched, which is copy.
- A naming convention for files that are not anchor documents.
  The maintainer decided the format prescribes none.
- New hub entries, including partial ones. The rule admits them;
  writing one is ordinary hub work.
- The root `HARNESS.md` of this repository as an anchor document.
  This repository chose to keep one, and that stays.

## Decisions

### Rewrite 3.1 in place instead of adding subsections

Section 3.1 "Use as a template" becomes "Use as a portable design",
with one paragraph each for summary, reference, and imitation.
Section 3.2 stays the anchor document; 3.3 and 3.4 keep their numbers.

Rejected: one subsection per use (3.1 to 3.4) with context cost and
authority moved to 3.5 and 3.6. It reads slightly more evenly,
but renumbers two sections the maintainer numbered and others link to,
for no gain in what the text says.

### Edits to the specification

`spec/spec.md` is edited first; `spec/spec.zh.md` follows section for
section; `skills/harness-md/references/specification.md` is then copied
from `spec/spec.md`. The English below is the draft the prose pass
(`human-writing`) starts from, so wording may still move;
the content of each edit is what this change fixes.

| # | Where | Now | Becomes | Reason |
|---|---|---|---|---|
| 1 | 3, first paragraph, last sentence | "The two most common basic uses are as a **template** or as an **anchor document**." | "A file is most often a **portable design**: a summary written to be handed on, a reference brought in from outside, or the abstraction of a harness to imitate. A project may also keep one as its **anchor document**. A project does not need a `HARNESS.md` of its own; keeping one is a decision it takes explicitly." | The uses and their order of importance changed. |
| 2 | 3, second paragraph | "In either mode, an agent does not need to load…" then three situations: building or reinstalling, checking for drift, improving deliberately | "In any of these uses…" then four situations: writing or revising a file; designing or building a harness with a file as a reference; and, where a project keeps an anchor document, checking for drift and improving deliberately | Two of the three situations assumed an anchor document; summarising had no situation at all. |
| 3 | 3.1, heading and body | "Use as a template": obtain a file, put it in the root of the target project, have the agent turn it into artifacts, delete it afterwards | "Use as a portable design": three paragraphs. Summary: all or part of a design, as one file or several, each saying what it covers. Reference: one or several files from a hub or another project, read where they are, weighed against the target project's own conditions. Imitation: the design of the project to imitate is written as a file first, so that decisions and reasons are inherited and incidental implementation is not. | The root is not where a reference has to be, and two of the main uses were missing. The imitation paragraph applies what section 1 already says about copying configuration between repositories. |
| 4 | 3.2, first sentence | "The second way is to keep `HARNESS.md` in the root directory of the code repository for the long term, as the authoritative basis…" | "A project may decide to keep a `HARNESS.md` in the root directory of its repository for the long term, as the authoritative basis…" plus one sentence: this is a deliberate choice and not the default. | "The second way" no longer counts correctly; the choice is explicit. |
| 5 | 3.4, after the two bullets | (nothing) | One paragraph: a file the project has not adopted as its anchor document has no authority over the project; its statements are material to weigh, not instructions, and a difference between it and the repository is not drift. | Without it, a reference file in a working directory could be read under the rules of 3.4. |
| 6 | 4.1, second paragraph | "When `HARNESS.md` is used for a specific software project, the file should be placed in the repository root, and the file name is fixed as `HARNESS.md`. When a design is stored as an independent, reusable entry…its directory structure is organised by the platform that hosts it." | "When a project keeps a file as its anchor document, the file should be placed in the repository root under the name `HARNESS.md`. For any other file in this format (a summary, a reference obtained from elsewhere, an entry in a design repository) this specification prescribes neither a name nor a location." | The maintainer's decision on naming. |

Sections 1, 2, 3.3, 4.2 onwards, 5, 6, and 7 are not edited.
The "Version:" line is not edited.

### Validators, fixtures, and the specification copy

Both validator implementations and `spec/fixtures/` are unchanged:
no rule changes. `skills/harness-md/references/specification.md`
is replaced by the new `spec/spec.md`.
No other file under `skills/` is edited in this change.

### Client-specific files

None. Nothing under `com.anthropic.claude-code/` changes,
and `just gen` has nothing new to produce.

### Hub entries: replace the procedure, keep the decisions

In each of the three entries the section "How to use this file"
shrinks to a short note with no heading rule attached to it:
the file is a design to weigh against the reader's project,
its Context states what it assumes, and nothing in it is a command.
In the layer sections, a sentence that fixes a file name, a command,
or a tool is reworded so the decision and its reason come first
and the realisation is an example.
Sentences that tell the reader to keep or delete the file are removed.

Rejected: leaving the entries as they are and changing only the rules.
The entries are the hub's own examples of what the rules mean;
three entries that break the new rules would teach the old ones.

Rejected: rewriting the entries from scratch as shorter designs.
Their decisions were reviewed; only their framing is wrong.

### Purpose paragraphs of the long-lived specs

OpenSpec deltas carry requirements only.
The Purpose paragraph of `openspec/specs/hub/spec.md` says an entry
"is meant to be pasted into a project root"; it is edited by hand
in the same commit that archives this change, to say an entry
is a reference design handed to an agent or read by a person.

### Knowledge files and the root HARNESS.md

`.agents/knowledge/hub.md` restates the hub's main use and the review
question "Buildable from the file alone?"; both are rewritten to the new
rules. `.agents/knowledge/format-changes.md` and the root `HARNESS.md`
are edited only where a sentence restates the old positioning.

## Risks / Trade-offs

- Between this change and the plugin rebuild, the shipped skills
  tell users to keep the file in the root.
  Accepted: no release is cut in between, and the next change follows.
- The specification changes meaning while its version stays `1.0.0`.
  Accepted by the maintainer; every conforming file stays conforming
  and no tool reports anything different.
- "Examples, not the decision" is a judgement no check can make.
  It stays a review question, like the rest of an entry's substance.
- The size of the entry edits is known only from their headings
  and one entry's opening; the three files are read in full
  before the tasks are written, and the task list states the scope found.
