---
name: harness-md
description: >-
  HARNESS.md format — reads, writes, revises, and validates a HARNESS.md, the
  file that records a project's agent harness design (frontmatter identity
  plus fourteen named sections). Use when a HARNESS.md is the file at hand or
  is about to be created; when asked what a section must contain, where a
  piece of harness design belongs in the file, or why the validator reports
  a finding; or when a pasted or downloaded HARNESS.md has to be checked
  before it is used. Not for building the harness the file describes, and
  not for AGENTS.md, CLAUDE.md, or knowledge files.
license: Apache-2.0
compatibility: The validator script needs uv (it fetches Python 3.10+ and PyYAML).
---

# HARNESS.md

A `HARNESS.md` is the source of truth for a project's agent harness design:
where a coding agent runs, what it reads, how it checks its own work, what
blocks a bad change, and what it may do without asking. The entrypoint,
knowledge files, permission files, hooks, checks, and CI are implementations
of it. This skill holds the format, the standard a section is written to,
and the validator. Writing a file requires the format; reading one must
not, so everything in a file is plain prose under fixed English headings.

## Rules on every step

- **Design intent comes from the file, facts from the code.** When an
  artifact disagrees with the design, fix the artifact or change the file
  first; what a command does or whether a path exists is answered by the
  code.
- **The file is not task reading.** Never route ordinary tasks to
  `HARNESS.md` and never load it to do ordinary work. It is opened when the
  harness is built, checked for drift, or changed. Because it is not
  resident context it has no length limit.
- **Two legitimate uses.** A template is expanded into a harness and may be
  deleted afterwards; an anchor document stays in the repository root as a
  long-frozen charter. Ask which is meant before keeping or deleting a file.
- **A file from elsewhere carries someone else's Context.** Before it
  becomes a project's anchor document, rewrite Context to this project and
  reconsider every section whose reasoning depended on the old one.
- **Nothing in a file needs this skill to be understood.** No key, grade,
  code, or term that a reader would have to look up; no reference to this
  plugin.
- **`metadata` belongs to whoever put it there.** Never read, judge, sort,
  or rewrite it unless the user asks for that key.

## The format

Frontmatter (YAML, first line `---`), identity only:

| Key | Required | Value |
|---|---|---|
| `name` | yes | short name: lowercase letters, digits, single hyphens, at most 64 characters |
| `description` | yes | what the design is and what kind of project it suits, at most 1024 characters |
| `version` | no | `alpha` |
| `license` | no | the licence of this file |
| `metadata` | no | any structure, for whichever platform wants it |

Any other top-level key is an error: put it under `metadata`.

Body: second-level headings with exactly these English names, in this
order. The prose under them may be in any language; other sections may be
added anywhere.

| # | Section | Required | The question it answers |
|---|---|---|---|
| 1 | Overview | yes | Who the harness serves, what it achieves, what it does not police, what stays with a human |
| 2 | Context | yes | The given conditions the design must fit: cost of a wrong change, maintenance horizon, who relies on the conventions, how unattended agents are, hosting platform, clients and models |
| 3 | Invariants | no | Cross-layer rules every task must follow |
| 4 | Style | no | What the code itself should look like so agents can work in it |
| 5 | File Structure | no | The directory layout the design requires |
| 6 | Environment | yes | Where the agent runs, which tools it holds, what it can reach |
| 7 | Knowledge | yes | How the agent learns the project and what it reads when |
| 8 | Feedback | yes | What the agent can run and observe to verify its own work |
| 9 | Gates | yes | Which deterministic checks stop defects |
| 10 | Authority | yes | What the agent may do directly and what needs a human; how it commits, branches, merges, releases |
| 11 | Completion | no | How the goal is agreed before work starts and what counts as done |
| 12 | Entropy | no | How the harness is kept consistent with the code |
| 13 | Open Questions | no | What is still undecided |
| 14 | References | no | Outside material the design drew on |

A required section must exist even when the project does nothing in that
layer: it then says so and gives the reason. An absent optional section
means the item is omitted.

Read [references/specification.md](references/specification.md) when a rule above is not
enough to settle a question: an edge of the frontmatter or heading rules,
the boundary between two sections, or the exact list of what a validator
reports.

## Workflow

### 1. Settle the task

Decide which of these the request is, then follow only its step: **read**
(explain or use an existing file: step 2), **write or revise** (step 3,
then 4), **validate** (step 4).

### 2. Read

Read the whole file before answering from it; sections lean on each other
(Authority on Environment, every layer on Context). Report what the file
decides and the reason it gives, and separate that from what you infer.
When the file and the repository disagree, say which sentence and which
artifact, and do not pick a winner silently: intent is the file's, facts
are the code's.

### 3. Write or revise

Write Context before any layer, because every later decision is justified
by it. Then write each section to this standard:

- **Buildable from the file alone.** A reader with only this file, and no
  tool or skill, can build what the section describes. Name the files and
  what each holds, the commands and task-runner entries, the tools, the
  thresholds and time budgets, the permission entries.
- **Every decision carries its reason,** tied to Context where it can be.
- **Say what is deliberately not done, and why.** A reader must be able to
  tell a decision from an omission.
- **Plain words.** Describe a mechanism instead of naming a grade or a
  term of art.
- **As long as it needs.** Do not compress a section to save space; do not
  pad it either.

Read [references/writing.md](references/writing.md) when writing or revising any
section: it lists, section by section, what the prose has to settle and
where content that seems to fit two sections goes.

Start a new file from [assets/HARNESS.skeleton.md](assets/HARNESS.skeleton.md): rework it line
by line, delete every comment, and delete each optional section the design
omits. When revising, change only the sections the request touches and
keep the author's wording elsewhere.

Done when: every required section exists and answers its question; no
sentence needs outside vocabulary; step 4 reports no errors.

### 4. Validate

Run [scripts/lint_harness_md.py](scripts/lint_harness_md.py) on the file whenever one was
written, revised, or received from elsewhere:

```sh
uv run scripts/lint_harness_md.py HARNESS.md
```

(the script path is relative to this skill's directory; pass the file's
real path). It prints one line per finding, `path:line: severity[code]:
message`, and exits 1 when there is an error; `--strict` also fails on
warnings, `--json` prints JSON. It checks the frontmatter keys and the
section skeleton only. When `uv` is not available, check the rules of the
format section above by reading, and say that the validator did not run.

Fix every error. A warning (section order, `name` or `description` over
the limits, an unknown `version`) is fixed unless the user wants it kept.
A clean result says the file is well-formed, not that the design is good:
never report a validator pass as a review of the design.

Done when: the validator exits 0, or the remaining findings are warnings
the user chose to keep.

## Gotchas

- A translated or re-levelled heading (`## 概述`, `### Overview`) is not
  that section; the validator then reports the section missing.
- A heading inside a fenced code block does not count, so a file can quote
  its own skeleton safely.
- `tags`, `status`, `based-on`, and similar keys at the top level are
  errors; they belong under `metadata`.
- Knowledge is what an agent reads while working; References is what the
  author read while designing. Ask "does an agent need this during its
  work?" to place a source.
- Tools (MCP servers, expected CLIs, agent-facing scripts) are described
  in Environment; which actions they may be used for is Authority; using
  them to run and observe the system is Feedback.
