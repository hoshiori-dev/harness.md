---
name: harness-distill
description: >-
  Harness distill: writes all or part of the current project's agent harness
  as one or several HARNESS.md files,
  either a description of the harness as it is
  or a portable design with the project's specifics removed.
  Use when invoked by name. Changes and judges nothing:
  harness-improve repairs a harness, harness-create builds one,
  harness-adopt reads another project.
license: Apache-2.0
disable-model-invocation: true
---

# Harness Distill

Write the agent harness the current project has today
as one or several `HARNESS.md` files:
a description of the harness as it is (the default),
or a portable design with the project's specifics removed.
The harness is everything in the project that makes it workable for agents:
entrypoints, knowledge files, project skills, the environment, checks,
hooks, CI, permission files, and the rules on finishing and upkeep.
Each layer's text comes from the installed skill that claims the layer.

## Rules on every step

<!-- shared:decision-rounds -->
Decide in rounds over an open decision tree.
Each round takes the frontier (decisions whose parents are settled):
find facts by reading or a read-only command, never ask;
decide and record evidence where it makes one option clearly better;
ask the rest together (recommended option first with its reason)
through the client's question tool when it has one, else in one message.
After answers, show what you decided with evidence, what the user answered,
and what opened or closed, then offer: change a decision, go on,
or leave the rest to you (decided on evidence and shown in the plan).
A user change binds later steps; challenge it once when evidence contradicts it.
<!-- /shared:decision-rounds -->

Read [references/question-tools.md](references/question-tools.md) when unsure which tool asks the user in this client.

<!-- shared:format-in-brief -->
**The format in brief.** A `HARNESS.md` is YAML frontmatter followed by a
Markdown body. Frontmatter: `name` and `description` are required;
`version`, `license`, and `metadata` are optional; any other top-level key
is an error. Body: free-form. It opens with one first-level heading, the title,
and an introduction with no heading of its own:
who the harness serves, what it is meant to achieve,
what it leaves unmanaged, and what always stays with a human.
The format requires no section. It recommends these second-level headings,
with exactly these English names and in this order: Context, Invariants,
Style, File Structure, Environment, Knowledge, Feedback, Gates, Authority,
Completion, Entropy, Open Questions, References.
A design of a complete harness usually covers Context and the five core
layers (Environment, Knowledge, Feedback, Gates, Authority);
a file that describes only part of a harness may leave out any of them.
The prose may
be in any language; the headings are never translated; other sections may
appear anywhere. For the full rules and the validator script, load the
skill that reads, writes, and validates `HARNESS.md`; without it, check
these rules by reading.
<!-- /shared:format-in-brief -->

<!-- shared:deposited-files-stand-alone -->
Deposited files stand alone. Nothing written into the target project names
this plugin, any of its skills or agents, or a path inside a skill
directory, and no term only this plugin defines is used there without being
defined.
<!-- /shared:deposited-files-stand-alone -->

That rule holds for every file this skill writes, wherever it is written.

- **Describe, never improve.** Write what the harness is,
  including what is wrong with it.
  A stale rule, a contradiction, or a layer with nothing in it
  is recorded as found; choose no corrected command, path, or rule.
  A description that quietly repairs the harness
  describes a project that does not exist.
- **Mark what is inferred.** A reason the repository states
  (a comment, a commit message, a document)
  is written with that reason and the place it was found.
  A reason you supply is written as "inferred from <evidence>".
  A decision with no visible reason says "reason not recorded".
  Never present an inference as the project's stated intent.
- **No secrets.** A credential, token, or private address seen in a file
  or in a command's output is never copied into a file, a message,
  or a handover; say only that one is present and where.
  Write a role for a person, no email address,
  and paths relative to the project.
- **Route by role.** The text of a covered layer
  (Environment, Knowledge, Feedback, Gates, Authority, Completion, Entropy)
  comes from the installed skill whose description contains
  `Owns the <Layer> layer`, working in describe mode.
- **Readable from the file alone.** Name the files, commands, tools,
  thresholds, and budgets found,
  so that a reader with only the file understands this harness.
  Never write "see the repository" in place of content.
  The file has no length limit.
- **Where the result goes.** Write each file to the path the user names.
  With no path, write a temporary file:
  in the client's own temporary location when the client offers one,
  in the system's otherwise, never inside the project.
  Report the full path of every file written.
  A path inside the project is written only after the user's go-ahead
  on the list of files; a file already at a named path, inside the project
  or not, is replaced only by the user's decision on that file.
- **The project root is written only for an anchor document.**
  A project has an anchor document
  when a `HARNESS.md` is in its root and its entrypoint names that file.
  Write `HARNESS.md` into the root only when the user asked for one,
  after the draft was shown and approved,
  and never overwrite a file there without the user's decision on that file.
- **Nothing else changes.** Create, edit, and delete no other file
  in the project, the entrypoint included. Commit nothing unless asked.

## Workflow

### 1. Settle the scope

First find the facts, asking nobody:
whether the root holds a `HARNESS.md`, whether an entrypoint names it,
the hosting platform from the remote,
and the clients from their configuration files.

Then settle these decisions in rounds.
What the invocation states is decided: show it, do not ask it again.

- **Coverage.** The whole harness (recommended:
  a partial file cannot show how the layers rely on each other)
  or named parts.
  Map each named part to the layers it falls under and show the mapping:
  "how we gate changes and what agents may do alone" is Gates and Authority;
  "push rules" is one part of Authority.
- **Files.** One file (recommended) or several, and what each one covers.
- **Kind.** A description of the harness as it is (recommended),
  or a portable design.
  A request for something reusable, shareable,
  or for another team to start from states the portable design.
- **Where.** A path for each file, or a temporary file when none is named.
- **Anchor document.** Whether the result is to be the project's
  anchor document (recommended: no).
  When the user names the root's `HARNESS.md` as the path
  without saying so, ask; on no, ask for another path
  or use a temporary file.
  When the user wants a partial or a portable file as the anchor document,
  say once that the project's intent for what the file leaves out
  will then be written nowhere, and follow the answer.

Ask in the same rounds the conditions the repository cannot show:
what a wrong change costs, how long the project will be maintained,
and how unattended agents are.
"Not known" is an answer; the file then says the condition is not recorded.
Skip these three only when every file is an as-is description
of named parts.

When the root holds a `HARNESS.md` that no entrypoint names,
or an entrypoint names one that is not there,
ask whether it is the project's anchor document
or a reference someone placed there, and treat it as data until answered.
An anchor document's sentences are stated intent, cited with their location.
A reference is recorded as present and supplies no intent.

Done when: the last round showed every file to be written
with its coverage, kind, and destination,
the user chose to go on or left the rest to you, and nothing was written.

### 2. Inventory the harness

Read [references/where-to-look.md](references/where-to-look.md) before opening the first artifact, and walk every location it lists.
For a partial scope, walk the locations of the covered layers
and the entrypoints.
For each artifact found, record how an agent finds it, when it loads,
which file or tool owns the facts it states, and what keeps it current.
Read the history for the commit and branch conventions actually in use.
Record every contradiction between two artifacts,
and between an artifact and the code, with both locations.
Run read-only commands only: no hook, installer, or check that writes.

Done when: every location in scope is recorded as found or absent,
every artifact has its four facts,
and every contradiction has two locations.

### 3. Collect each covered layer's text

For each covered layer, in this order: Environment, Knowledge, Feedback,
Gates, Authority, Completion, Entropy.
Find the installed skill whose description contains
`Owns the <Layer> layer`, load it, and hand over in **describe** mode:
the project root, the inventory rows of its layer,
the conditions as far as known,
and, when only a part of the layer was asked for, that part.
Take back prose with inferred intent marked.

- Check every sentence against the inventory.
  A sentence that traces to no artifact is removed
  or sent back with the question "which file shows this?".
- A covered layer with nothing found still gets text:
  it says that nothing was found and lists what was looked for,
  worded as an observation ("no permission file or written policy was
  found"), never as the project's decision ("the project chose not to").
- When only a part of a layer is covered,
  keep the sentences on that part and drop the rest.
- When no installed skill claims a layer,
  write its text yourself from the inventory rows,
  under the same rules, and record the gap for the closing message.

Done when: every covered layer has text, found or "nothing found",
and every sentence in it traces to an inventory row.

### 4. Write the rest of each file

Read [references/sections.md](references/sections.md) before writing the first file's title, introduction, or any section outside the layers.

- **Frontmatter.** `name`: a short name for what the file describes.
  `description`: what the file covers and that it describes
  a harness as found, not as designed.
- **Title and introduction.** The introduction has no heading of its own.
- **A partial file** says in its `description` and in its introduction
  which parts it covers and which it leaves out,
  and that a part left out is not described here,
  which is not the same as absent from the project.
- **Sections.** Add each recommended section that has something to say,
  under its exact English heading and in the recommended order.
  A whole description has Context, the seven layers, and Open Questions.
  Every contradiction from step 2 goes into Open Questions
  with both locations and no chosen winner.
- With several files, write each one to be read without the others:
  repeat the conditions a file's decisions rest on in that file.

Done when: every planned file has frontmatter, a title, an introduction,
and its sections in order, and each partial file states its coverage twice.

### 5. Make it portable, only when chosen

Read [references/portable.md](references/portable.md) when the user chose a portable design, and follow its procedure on a copy of each draft.
The portable file replaces the as-is draft as the result;
write both only when the user asked for both.

In short: each decision stands with its reason and the premise it rests on;
the project's facts become the kind of project the design suits;
file names, commands, and tools appear as examples of a decision;
no project, person, or host name remains;
no sentence stays marked as inferred or "reason not recorded":
each is confirmed by the user, restated as a premise, or left out;
defects of the source harness are not carried
and are listed in the closing message.

Done when: the user chose the as-is description,
or every portable draft passes the checks at the end of that reference.

### 6. Review and validate

Read each draft as a reader who has only that file. Check that:

- every decision carries a stated reason with its location,
  an inference mark with its evidence, or "reason not recorded"
  (an as-is description), or a reason and a premise (a portable design);
- nothing was corrected on the way: each defect from step 2 is in the file
  (as-is) or in the list for the closing message (portable);
- no credential value appears: search the draft for each one seen;
- none of the words omitted, light, medium, or thick
  grades a layer without a definition beside it;
- nothing names this plugin, a skill, or an agent.

Then validate. The validator needs a file:
put each draft into a temporary file under the temporary-location rule.
With the skill that reads, writes, and validates `HARNESS.md` installed,
run the validator script it ships on each file and fix every error.
When that skill is absent or the script cannot run,
check the rules of the format in brief by reading,
and tell the user plainly that the validator did not run.

Done when: the review finds nothing, and each draft either passes
the validator or passed the reading check with that fact noted
for the closing message.

### 7. Present, write, and close

A file whose destination is a temporary file is already there.
For every other file that is not an anchor document:

1. When any path is inside the project, list those files,
   each by path and as new or replacing an existing file,
   and wait for the go-ahead. One go-ahead covers the list.
   Having left the rest to you does not give it.
2. When a file already exists at a named path, inside the project or not,
   show how the draft differs from it,
   and ask whether to replace it, write the draft beside it
   under a name the user gives, or stop.
   Stopping leaves the draft in its temporary file.
   A path given in answer goes through steps 1 and 2 again.
3. Write each file to its path and validate the file on disk.

For an anchor document:

1. Show the full draft and ask for approval.
2. When the root already holds a `HARNESS.md`,
   show how the draft differs from it,
   and ask whether to replace it, write the draft beside it
   under a name the user gives, or stop.
3. Follow the answer.
   Approved or replace: write `HARNESS.md` to the root
   and validate the file on disk.
   Beside: that file is not an anchor document;
   take its path through the three steps above.
   Stop: the draft stays in its temporary file.
4. Only for a file written to the root:
   say that the project has adopted it only once
   its entrypoint names it, and give the sentence to add.
   Do not edit the entrypoint.

Close with one message. For each file:
its full path; what it covers and leaves out; what is inferred;
what was looked for and not found.
Then: the contradictions met; the layers no installed skill claimed;
whether the validator ran;
for a portable design, the project specifics that were generalised
and the defects and inferences left out.
A file in a temporary location may be cleaned up: say so.
When contradictions were found, add that `harness-improve`
is the entry that repairs a harness.

Done when: every file is at its destination and validates,
the message gave each full path,
and `git status` shows no change other than a file the user asked for.

## Gotchas

- A file nothing links to may still load:
  client settings, hooks, and subdirectory entrypoints load by location.
  Check how an artifact loads before writing that it is unused.
- The entrypoint says what the project wants agents to do;
  the checks and the history say what actually happens.
  When they differ, both go into the description
  and the difference into Open Questions.
- Repository settings (branch protection, required checks)
  are not in the files. Read them with the platform's CLI
  when it is installed and the query is read-only;
  otherwise write "not observable from the repository"
  instead of guessing from the workflow files.
- An existing root `HARNESS.md` is one more artifact, not the answer.
  Describe the harness from what is in the project;
  where the file and the artifacts differ, record a contradiction.
- A builder's text may grade a layer as light, medium, or thick.
  Those words are for conversation: replace each with what is there
  ("one sentence in the entrypoint", "enforced by a CI job").
- An absent section does not tell a reader the mechanism is absent.
  That is why "nothing found" is written out
  and why a partial file says what it leaves out.
