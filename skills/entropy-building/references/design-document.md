# The Design Document

Read when the project keeps `HARNESS.md`, when the section does not say
whether it does, and when configuring `REQUIRED_PATHS`, `DESIGN_DOC`, or
`DESIGN_VALIDATOR`.

`HARNESS.md` is used in one of two ways, and the user chooses which:

- **Anchor document.** The file stays in the repository as the long-lived
  statement of what the harness is meant to be. It is opened rarely: to
  check the harness for drift and to improve it on purpose. Agents do not
  load it for ordinary tasks, so it is not in the entrypoint's routing
  except as "read before changing the harness itself".
- **Template.** The file was put in the project root, expanded into a
  harness, and deleted. Nothing refers to it afterwards.

The section states which, in one sentence. When it does not and the file
exists, treat it as kept and report that as an assumption; when the file
does not exist, treat it as a deleted template.

## When it is kept

Two different things can drift, and they are ruled differently:

| Disagreement | Who wins | Fix |
|---|---|---|
| Intent: the design says the harness should do X, a harness file does Y | `HARNESS.md` | fix the harness file; or change `HARNESS.md` first, with the user's decision, then the file |
| Fact: the design names a command or path, the code has another | the code | correct the sentence in `HARNESS.md` |

Three mechanisms keep the pair in step:

1. **Required paths.** The build workflow hands this layer the paths the
   File Structure section requires, as a list. Put exactly that list into
   `REQUIRED_PATHS` (a trailing slash requires a directory). Never derive
   paths by parsing the section's prose, in the script or by hand at check
   time: prose is free-form and a guessed path fails for no reason. When
   the handover carries no list, ask the workflow for it or, in a run
   without one, list the paths with the user at the approval. The sync
   table gets one row: a change to a required path edits the File Structure
   section first, then the list.
2. **The file itself.** Set `DESIGN_DOC = "HARNESS.md"`; the check then
   reports a missing file as a finding. Set `DESIGN_VALIDATOR` only when
   the project holds its own copy of a format validator among its
   management scripts; the check runs it with the file's path appended and
   reports a non-zero exit. The check refuses a validator that lies inside
   a skill directory (exit 2): a skill is installed and replaced from
   outside the repository, so a project check may not depend on one. With
   no validator in the project, leave it `None` and say in the hand back
   that the format is not checked mechanically.
3. **Reclamation.** The routine re-reads `HARNESS.md` section by section
   against the harness (the seventh hunt item of the section and skill
   shapes) and rewrites Context when the project's situation changed.

Keep `HARNESS.md` out of `EXTRA_DOCS`. It names paths that are required but
may not exist yet and paths it rules out, so the link and path checks would
report design intent as stale references.

## When it was a template

Set `DESIGN_DOC = None`, `DESIGN_VALIDATOR = None`, and
`REQUIRED_PATHS = []`; delete the `HARNESS.md` paragraph and row from the
keep-in-sync shape and the seventh hunt item from the reclamation shape.
The harness is then kept true to the code only, and the section says that
the design lives in the artifacts.

## The file appears or disappears later

A project that deleted the template and later writes a `HARNESS.md` to keep
needs the three mechanisms added; a project that stops keeping the file
needs them removed in the same change that deletes it, or the self-check
reports `design-doc` on every run. Both are edits to the Entropy section
first.
