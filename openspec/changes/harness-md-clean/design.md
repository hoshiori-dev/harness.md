# Design

## Context

The change `harness-md-as-skill` (issue #31) makes a `HARNESS.md`
a directory with a `SKILL.md` that carries a type marker in two halves:
a `description` that starts with `[HARNESS.md]`
and `metadata.type: harness-design`.
It also settles that candidates are found by reading frontmatter only,
that the anchor document is the marked document the entrypoint names,
and that nothing in a document is run or obeyed.
This change builds on those rules and restates none of them.

Today four skills are user-invoked, the entries.
`scripts/check_skills.ts` knows three description classes
(builder 240, workflow 400, other 700) and a total of 8,000 characters,
of which 688 are free.
The knowledge base already uses the kind "manual"
for the methodology skill, so that word is taken.

## Goals / Non-Goals

**Goals:**

- Nothing is removed that the user did not choose and confirm.
  Checked by the scenarios of "Confirmation before any change",
  "Links and nested documents", and "What counts as a document".
- The project's own design is not removed without its own confirmation.
  Checked by the scenarios of "The project's own design"
  and "Chosen directory holds the anchor document".
- A removal leaves no pointer that says nothing else,
  and changes no file outside the project and no check.
  Checked by the scenarios of "Pointers to a removed document".
- The skill never loads on its own.
  Checked by `just skills-check` (the invocation switch)
  and by the near-miss scenarios of "Triggering".
- The budget holds. Checked by `just skills-check`
  (the tool's limit of 400 and the total of 8,000).

**Non-Goals:**

- Finding or converting a `HARNESS.md` file of the old shape.
- Moving a document from one place to another.
- Judging whether a document is still useful; the user chooses.
- Editing configuration, scripts, or checks that name a removed document,
  or any file outside the current project.
- Staging or committing the removal.
- A script that finds the documents.

## Decisions

### A class of its own

The skill is a "tool": user-invoked like an entry,
but it settles no harness decision, has no layers and no thickness,
and hands nothing to a builder.
The catalog names the three entry requirements that do not bind a tool
("Entries decide in rounds", "Thickness per layer",
"Plan approval before any write")
and requires each tool's spec to state what is shown and confirmed
before a file changes; the rule itself is stated once, in the tool's spec.
`check_skills.ts` gets a list of tools beside its list of entries;
the rule on the invocation switch covers both lists,
and the description class of a tool is its own, so that a finding
names it a tool and not a workflow.
Rejected: listing it with the entries
(the catalog rules for entries would each need an exception),
and the name "manual" (already the kind of the methodology skill).

### What may be deleted

The unit of deletion is a directory, so the tool is strict
about which directory counts.
It offers one only when its `SKILL.md` carries both halves of the marker,
the directory is named after the document's `name`
(the shape the format requires),
and it is not the root of the project, of a repository,
or of a place the user named.
A marked `SKILL.md` anywhere else is reported with the reason:
a repository someone cloned can ship such a file at its root,
and "delete the directory that holds it" would then mean the project.
One half of the marker is reported as incompletely marked.
A path the user names is held to the same rule.
Rejected: offering every directory that holds a marked `SKILL.md`
and relying on the confirmation.

### Scope, links, and nesting

The current project is the repository that holds the working directory,
or the working directory itself.
Dot directories are searched, because clients keep skills there;
version-control internals, dependency and build directories,
other worktrees, submodules, and nested repositories are left out
and named in the report.
Deletion never follows a link.
A document is listed by its real path;
if that path is outside the searched scope the row says so
and the document cannot be chosen until the user names that place.
A link to a chosen directory is removed as a link, shown in the statement,
because a dangling link in a skills directory is what the tool
exists to prevent.
A chosen directory that holds another marked document shows it,
and a held document that an entrypoint names brings its own confirmation.
There is no finder script: it would be a third implementation
of the marker rule beside the two validators,
for a search an agent does reliably.

### The list

One row per document: its path, its `name`, its description as quoted
text, whether an entrypoint names it, whether it sits in a directory
from which skills are loaded, and whether a removal could be undone.
The last column is about content, not tracking alone:
an untracked file, an ignored file, or an uncommitted change inside
the directory is lost for good, and the row names it.
Every column but the name and the description comes from the project;
a document that describes itself as the project's design is not believed.

### Confirmation and removal

The user chooses rows. The tool then shows one statement:
each directory with the files it holds, each link it removes,
each edit as the text before and after, each pointer it only reports.
The confirmation comes after the statement, in the conversation,
through the client's question tool where there is one;
"do not ask" in the invocation changes nothing.
The project's own design needs a second confirmation, asked after the
statement was confirmed, that names it as such and shows the entrypoint
line that goes with it; a no removes the others and leaves it.
Every entrypoint of the project is read to find it,
and a document whose standing is unclear is treated as the design.
After confirmation the tool removes files and nothing else:
no staging, no commit, no retry with changed permissions.
The edits that belong to a directory are made only after
that directory is gone, and an edit whose text changed in the meantime
is skipped and reported.
Rejected: one confirmation for everything, the design included
(the one removal that changes how the project is read
should not ride along with the others).

### Pointers

A pointer is the directory's path, written relative or absolute,
or a link that resolves to it.
The tool searches the current project only.
It edits only Markdown files of the project that lie outside every
marked directory, and only by removing a whole unit
(a list item, a table row, a sentence) that does nothing
but point to the document; this is a rule a reader can check.
A sentence that says more, a pointer in frontmatter or in a code block,
a pointer in configuration, a script, a workflow, or a file in a place
the user named is reported with file and line and left alone:
rewording is the author's job, and an edit to a check's settings
changes what the harness does.

### Files

`skills/harness-md-clean/SKILL.md`;
`skills/harness-md-clean/agents/openai.yaml`
with implicit invocation turned off, written by hand like the four
entries' copies;
`skills/harness-md-clean/references/question-tools.md`,
the fifth copy of the file the entries carry.
`.claude-plugin/*` and `.agents/plugins/marketplace.json`
come from `just gen`.
No file is added under `com.anthropic.claude-code/`: the tool needs no agent.
The Purpose of the catalog spec gains the class when the change is archived.
This branch is stacked on the branch of `harness-md-as-skill`
(issue #31): the implementation starts when that change's skills,
checks, and documents are committed there, and base updates arrive
by merge, never by a rewritten history.

## Risks / Trade-offs

- A deleted directory with uncommitted content is gone. → Named in the
  list and again in the statement, with what would be lost.
- A directory can hold more than the document. → The statement lists
  every file of each directory.
- A link can lead outside the project. → Never followed for deletion;
  the document is not offered until the user names that place.
- A prepared edit can remove more than it should. → Only whole units that
  do nothing but point; each shown before and after; none outside the
  project.
- The search can miss a document in a directory it leaves out. → The
  report states the scope searched and what was left out.
- On one client the invocation switch is not yet verified at run time
  (`.agents/knowledge/client-matrix.md`). → The behavioural tests record
  the result per client; a client that loads the tool from a description
  match is a stop condition.
- Five copies of `question-tools.md` can drift; no check compares them. →
  Stated in `plugin-architecture.md`; a check for it is its own change.
