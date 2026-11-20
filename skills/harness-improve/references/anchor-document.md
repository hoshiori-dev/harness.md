# When the Project Has an Anchor Document

Read when a `HARNESS.md` is in the project's root and an entrypoint names it,
before the analysis and again before writing to the file.
Then, and only then, the file holds the project's design intent.
Without one, analyse the harness against its own consistency, the code,
and the project's conditions; skip this file,
and never propose creating a `HARNESS.md`.

## 1. Validate

With the skill that reads, writes, and validates `HARNESS.md` installed,
load it, run the validator it ships, and quote the output.
Otherwise check by reading and record the check as manual:
YAML frontmatter with `name` and `description`
and no top-level key other than `version`, `license`, `metadata`;
one first-level heading; section headings in English.
Each error is a finding in the group "anchor document".

## 2. Does its context describe this project?

Compare what the file says about the project (platform, stack, people,
how agents run) with the remote, the manifests, and the history.
A context that names a platform or a team the repository does not show
is a finding of severity high, because every decision in the file
rests on it. Ask whether the file is the project's anchor document
or a reference someone placed there, and treat it as a reference
until answered.

## 3. What each builder receives

For each layer, the file's text about that layer: its section,
or, when it has none, the sentences about the layer's subject
in the introduction or under another heading.
The format requires no section, so a layer without one is not undecided.
A layer the file says nothing about is analysed
against the project's conditions like a project without the file.

Three sections belong to no single layer. Check them yourself:

| Section | Check |
| --- | --- |
| Invariants | each one is stated in the entrypoint, enforced by a check, or denied in the permission files |
| Style | each enforceable part is in a tool's configuration; the rest is where an agent reads it |
| File Structure | each path it requires exists |

## 4. Drift in both directions

Every disagreement between the file and an artifact is one finding
that names both locations and says which side to change.

| Disagreement | Class | Proposed side |
| --- | --- | --- |
| The file names a fact the code states differently (a command, a path) | stale | amend the file to the code |
| The file states an intent and an artifact does something else | contradictory | fix the artifact, or amend the file; recommend one, the user chooses |
| The file calls for something and nothing exists | missing | build it, or amend the file |
| A working artifact is not named in the anchor document | stale | amend the anchor document to record it, or remove the artifact |
| A context sentence is no longer true | stale | amend the file; every decision resting on the sentence is in question |

Never decide by which side looks newer.
A built file that sends agents to `HARNESS.md` on ordinary tasks
is a finding; one line that names it for checking or changing the harness
is not.

## 5. Writing intent back

Each agreed change of intent is written to the file
in the same checkpoint commit as the layer it concerns.

- Change only the sentences the agreed decision touches;
  leave the rest exactly as written.
- Read every section that names what changed:
  a tool removed from Environment that Authority still mentions
  is a new stale sentence.
- A corrected fact is listed in the plan as "corrected to the code".
  A changed intent is listed with the old text, the new text,
  and the finding behind it.
- The four thickness words go into the file only with their definition
  beside them.
- Validate the file again after the last write.

The file is in the plan like any other file:
nothing in it changes before the plan is approved.
