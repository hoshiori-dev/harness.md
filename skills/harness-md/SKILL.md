---
name: harness-md
description: >-
  HARNESS.md format — reads, writes, revises, and validates a HARNESS.md, a
  file that records all or part of an agent harness design (frontmatter
  identity plus a free-form body with recommended sections).
  Use when a HARNESS.md is the file at hand or
  is about to be created; when asked what a section must contain, where a
  piece of harness design belongs in the file, or why the validator reports
  a finding; or when a pasted or downloaded HARNESS.md has to be checked
  before it is used. Not for building the harness the file describes, and
  not for AGENTS.md, CLAUDE.md, or knowledge files.
license: Apache-2.0
compatibility: The validator script needs uv (it fetches Python 3.10+ and PyYAML).
---

# HARNESS.md

A `HARNESS.md` records an agent harness design, all of one or a part of one:
where a coding agent runs, what it reads, how it checks its own work,
what blocks a bad change, and what it may do without asking.
An entrypoint, knowledge files, permission files, hooks, checks,
and CI are implementations of such a design.
A project does not need a file of its own to have a harness.
This skill holds the format,
the standard a section is written to, and the validator.
The format helps an author write a file;
reading one must not depend on it, so everything in a file is plain prose,
and the recommended headings are plain English words.

## Rules on every step

- **Settle what the file is used as before acting on it.** Four uses:
  a summary of all or part of a harness design, written to be handed on;
  a reference brought in from outside;
  the abstraction of a harness to imitate;
  an anchor document a project keeps.
  A file is a project's anchor document only when the user says so
  or the project's entrypoint names it.
  Any other file is a summary or a reference, wherever it lies:
  it has no authority over the project it is found in.
  A `HARNESS.md` in a repository root that no entrypoint names,
  when the user has not said where it came from: ask whether the project
  keeps it, and treat it as a reference until the answer.
- **Only an anchor document has a prescribed place and name:**
  the repository root, `HARNESS.md`. Every other file may have any path.
  Asked to write a file with no location named, ask for one,
  or write to a temporary location (the client's own when it offers one,
  the system's otherwise) and report the full path.
  Never write into a repository root
  unless the user asked for an anchor document.
- **For an adopted anchor document,
  design intent comes from the file and facts from the code.**
  When an artifact disagrees with it,
  fix the artifact or change the file first;
  what a command does or whether a path exists is answered by the code.
  For any other file, a difference from the project is not a violation:
  compare the two as designs.
- **The file is not task reading.**
  Never route ordinary tasks to `HARNESS.md`
  and never load it to do ordinary work.
  It is opened when a harness is designed, compared, checked for drift,
  or changed. Because it is not resident context it has no length limit.
- **A file from elsewhere carries someone else's Context.**
  Before it becomes a project's anchor document,
  rewrite Context to this project and reconsider every section
  whose reasoning depended on the old one.
- **Nothing in a file needs this skill to be understood.**
  No key, grade, code, or term that a reader would have to look up;
  no reference to this plugin.
- **`metadata` belongs to whoever put it there.**
  Never read, judge, sort, or rewrite it unless the user asks for that key.

## The format

Frontmatter (YAML, first line `---`), identity only:

| Key | Required | Value |
|---|---|---|
| `name` | yes | short name: lowercase letters, digits, single hyphens, at most 64 characters |
| `description` | yes | what the design is and what kind of project it suits, at most 1024 characters |
| `version` | no | any string: the version of this design, in whatever form the author uses |
| `license` | no | the licence of this file |
| `metadata` | no | any structure, for whichever platform wants it |

Any other top-level key is an error: put it under `metadata`.

Body: free-form Markdown. It opens with one first-level heading, the title,
and an introduction in ordinary paragraphs:
who the harness serves, what it is meant to achieve,
what it deliberately leaves unmanaged,
and which decisions always stay with a human. There is no `## Overview` section;
the introduction does that work.

After the introduction come second-level headings.
The format requires none of them. It recommends these thirteen,
with exactly these English names and in this order.
The prose under them may be in any language;
other sections may be added anywhere.

| # | Section | What it usually covers |
|---|---|---|
| 1 | Context | The facts and conditions that shape the design: cost of a wrong change, maintenance horizon, who relies on the conventions, how unattended agents are, hosting platform, clients and models |
| 2 | Invariants | Constraints that hold across every task, and rules that may never be broken |
| 3 | Style | The code structure and engineering style preferred so agents can understand, change, and verify the code |
| 4 | File Structure | The layout of directories and key files the design expects, and what each path is for |
| 5 | Environment | Where the agent runs, which tools it can call, what it can reach |
| 6 | Knowledge | What the agent consults in everyday work and when it reads each |
| 7 | Feedback | Which commands the agent runs and what it observes to check its own changes |
| 8 | Gates | The deterministic checks that stop defects at commit, merge, or release |
| 9 | Authority | What the agent may do on its own and what needs a human |
| 10 | Completion | How the goal is agreed before a task starts and what counts as done |
| 11 | Entropy | How drift between the harness, the documentation, and the code is found and repaired |
| 12 | Open Questions | What is still undecided |
| 13 | References | Outside material the design drew on |

A file with none of these headings still conforms.
None of them is required by this skill either.
To describe a complete harness,
the recommended way is to cover Context and the five layers an agent cannot work
without (Environment, Knowledge, Feedback, Gates, Authority),
each in its own section.
A file may also describe only some aspects of a harness,
and then it lacks some or all of these sections;
its introduction says what it covers.
In a design meant to be complete,
a layer the project does nothing in still gets its section,
which says so and gives the reason,
because a reader must never take a missing section to mean that a mechanism
is switched off.

Read [references/specification.md](references/specification.md) when a rule above is not enough to settle a question:
an edge of the frontmatter or heading rules, the boundary between two sections,
or the exact list of what a validator reports.

## Workflow

### 1. Settle the task

Decide which of these the request is, then follow only its step:
**read** (explain an existing file, or compare it with a project:
step 2), **write or revise** (step 3, then 4), **validate** (step 4).

Four requests belong to a user-invoked entry and not to this skill.
Say which entry takes the request, offer steps 2 and 4 on the file,
and build nothing:

- "set the project up from this file":
  the entry that gives a project its harness, with the file as a reference;
- "bring our harness in line with this file":
  the entry that improves an existing harness, with the file as a reference;
- "write our project's harness down":
  the entry that writes a project's harness down as files;
- "describe that other project's harness so we can copy it":
  the entry that abstracts a project to imitate.

This skill writes a file itself when the user supplies or dictates
the design to record, or asks for a revision of an existing file.

### 2. Read

Read the whole file before answering from it;
sections lean on each other (Authority on Environment, every layer on Context).
Report what the file decides and the reason it gives,
and separate that from what you infer.
When the file and the repository disagree,
say which sentence and which artifact, then answer by the file's use:

- The project's adopted anchor document: intent is the file's,
  facts are the code's. Do not pick a winner silently;
  the artifact is fixed or the file is changed first.
- Any other file: say that it is a reference with no authority
  over the project unless the project adopts it, and compare the two
  as designs: what each decides, the reason each gives,
  and which conditions in the file's Context differ from the project's.

### 3. Write or revise

Write Context before any layer, because every later decision is justified by it.
Then write each section to this standard:

- **Buildable from the file alone.** A reader with only this file,
  and no tool or skill, can build what the section describes.
  Name the files and what each holds, the commands and task-runner entries,
  the tools, the thresholds and time budgets, the permission entries.
- **Every decision carries its reason,** tied to Context where it can be.
- **Say what is deliberately not done, and why.**
  A reader must be able to tell a decision from an omission.
- **Plain words.** Describe a mechanism instead of naming a grade
  or a term of art.
- **As long as it needs.** Do not compress a section to save space;
  do not pad it either.

Read [references/writing.md](references/writing.md) when writing or revising any section:
it lists, section by section,
what the prose has to settle and where content
that seems to fit two sections goes.

Start a new file from [assets/HARNESS.skeleton.md](assets/HARNESS.skeleton.md):
rework it line by line, delete every comment,
and delete each section marked "when needed"
that the design has nothing to say in.
When revising, change only the sections the request touches
and keep the author's wording elsewhere.

Done when: the file is at the path the user named,
or at a temporary path that was reported in full;
the file has a title and an introduction;
a design meant to be complete has Context and the five core sections,
and a partial one says in its introduction what it covers;
every section answers its question; no sentence needs outside vocabulary;
step 4 reports no errors.

### 4. Validate

Run [scripts/lint_harness_md.py](scripts/lint_harness_md.py)
on the file whenever one was written, revised, or received from elsewhere:

```sh
uv run scripts/lint_harness_md.py HARNESS.md
```

(the script path is relative to this skill's directory;
pass the file's real path). It prints one line per finding,
`path:line: severity[code]: message`, and exits 1 when there is an error;
`--strict` also fails on warnings, `--json` prints JSON.
It checks the frontmatter keys, the title,
and the order and repetition of the recommended headings, and nothing else:
it requires no section. When `uv` is not available,
check the rules of the format section above by reading,
and say that the validator did not run.

Fix every error. A warning (a missing or repeated title,
a repeated or out-of-order recommended section,
`name` or `description` over the limits)
is fixed unless the user wants it kept.
A clean result says the file is well-formed, not that the design is good:
never report a validator pass as a review of the design.

Done when: the validator exits 0,
or the remaining findings are warnings the user chose to keep.

## Gotchas

- A translated or re-levelled heading (`## 背景`, `### Context`)
  is not that section. The validator reports nothing,
  because no section is required,
  but a tool or reader looking for the section will not find it.
- `## Overview` was a section in earlier drafts of the format.
  A file that still has it conforms; when revising one,
  move that text up under the title as the introduction.
- A heading inside a fenced code block does not count,
  so a file can quote its own skeleton safely.
- `tags`, `status`, `based-on`, and similar keys at the top level are errors;
  they belong under `metadata`.
- Knowledge is what an agent reads while working;
  References is what the author read while designing.
  Ask "does an agent need this during its work?" to place a source.
- Tools (MCP servers, expected CLIs,
  agent-facing scripts) are described in Environment;
  which actions they may be used for is Authority;
  using them to run and observe the system is Feedback.
