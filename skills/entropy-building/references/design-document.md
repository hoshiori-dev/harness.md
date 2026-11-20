# The Anchor Document

Read when the project adopted an anchor document,
and when configuring `DESIGN_DOC` or `DESIGN_VALIDATOR`.

A project has an anchor document
only when a `HARNESS.md` is in its root and its entrypoint names it.
The file is then the long-lived statement of what the harness is meant to be.
It is opened rarely:
to check the harness for drift and to improve it on purpose.
Agents do not load it for ordinary tasks,
so the entrypoint routes to it only as "read
before changing the harness itself".

Everything below applies only to such a project.
A `HARNESS.md` anywhere else, or one the entrypoint does not name,
is a reference: nothing is configured, deposited, or audited for it.
Never create a `HARNESS.md` or recommend creating one.

## Keeping it in step

Two different things can drift, and they are ruled differently:

| Disagreement | Who wins | Fix |
|---|---|---|
| Intent: the document says the harness should do X, a harness file does Y | `HARNESS.md` | fix the harness file; or change `HARNESS.md` first, with the user's decision, then the file |
| Fact: the document names a command or path, the code has another | the code | correct the sentence in `HARNESS.md` |

Three mechanisms keep the pair in step, each only where the agreed
decisions say the document is kept in step:

1. **Required paths.**
   `REQUIRED_PATHS` holds the list the handover carries, as in every project.
   With an anchor document that list covers the paths
   its File Structure section requires, listed by whoever hands over.
   Never derive paths by parsing that section's prose,
   in the script or by hand at check time:
   prose is free-form and a guessed path fails for no reason.
   When the handover carries no list, configure none and report the gap;
   in a run without an entry, list the paths with the user
   before they accept the decisions.
   The sync table gets the anchor row of the keep-in-sync shape
   in place of the plain required-path row:
   a change to a required path edits the File Structure section first,
   then the list.
2. **The file itself.** Set `DESIGN_DOC = "HARNESS.md"`;
   the check then reports a missing file as a finding.
   Set `DESIGN_VALIDATOR` only when the project holds its own copy of a format
   validator among its management scripts;
   the check runs it with the file's path appended and reports a non-zero exit.
   The check refuses a validator that lies inside a skill directory (exit 2):
   a skill is installed and replaced from outside the repository,
   so a project check may not depend on one.
   With no validator in the project,
   leave it `None` and say in the hand back that the format
   is not checked mechanically.
3. **Reclamation.** The routine re-reads `HARNESS.md` section by section
   against the harness (the seventh hunt item of the section and skill shapes)
   and rewrites its Context section when the project's situation changed.

Keep `HARNESS.md` out of `EXTRA_DOCS`.
It names paths that are required but may not exist yet and paths it rules out,
so the link and path checks would report design intent as stale references.

## Without an anchor document

Set `DESIGN_DOC = None` and `DESIGN_VALIDATOR = None`;
`REQUIRED_PATHS` still takes the handed-over list.
In the deposited shapes, every mention of `HARNESS.md` sits on a line
whose `# CONFIGURE:` comment says to delete it without an anchor document:
the intent paragraph and the anchor row of the keep-in-sync shape,
and the seventh hunt item and the sentence on changing intent
in both reclamation shapes. Delete each, whole.
The harness is then kept true to the code only.

## The document is adopted or dropped later

A project that adopts an anchor document later
needs the three mechanisms added;
a project that drops it needs them removed in the same change
that deletes the file or its mention in the entrypoint,
or the self-check reports `design-doc` on every run.
Both are decisions for the user before any file changes.
