# Proposal

Issue: [#33](https://github.com/hoshiori-dev/harness.md/issues/33).
Depends on issue #31 (a `HARNESS.md` as a kind of Agent Skill),
which defines the type marker this change relies on.

## Why

Once a `HARNESS.md` is a directory that may sit anywhere,
a project collects them: a reference placed in a skills directory
to start a harness from, a design written to hand on,
an adopted design nobody removed.
One in a skills directory costs a description in every session.
One in the project that the entrypoint does not name
is something every later piece of harness work has to tell apart
from the project's own design.
Nothing in the plugin finds them,
and removing one by hand leaves the sentences and links that pointed at it.

## What Changes

Domain: `skill`.
Clients: Claude Code, Codex, and Antigravity.

- Added: `harness-md-clean`, a skill the user runs by name
  and that never loads from a description match.
  It lists the type-marked `HARNESS.md` directories of the current project,
  and of other places only when the user names them;
  marks the one the project's entrypoint names;
  deletes the directories the user chose, after a confirmation
  that shows them, the files they hold, and the pointers to them;
  removes a pointer in a Markdown document of the project
  where a list item, a table row, or a sentence does nothing else,
  and reports every other pointer without editing it.
  It offers for removal only a directory that is a document:
  marked in both halves, named after the document,
  and not the root of a project or of a searched place.
- Added to the catalog: a class of skill named "tool",
  beside builder, entry, manual, and daily.
  A tool is user-invoked and settles no decision about a harness;
  the rules for entries (rounds, thickness, the approved plan)
  do not bind it, and its own spec states what the user confirms
  before it changes a file.
- Changed in the catalog: the user-invoked skills are the four entries
  and the tools; a tool's description is at most 400 characters.
- Unchanged: every other skill and both agents.
  A `HARNESS.md` file of the old shape, without the type marker,
  is not found by the tool.

## Capabilities

### New Capabilities

- `skill/harness-md-clean`: finding type-marked documents
  and removing the ones the user chooses.

### Modified Capabilities

- `skill`: the class "tool", which skills are user-invoked,
  and the description budget of a tool.

## Impact

- `skills/harness-md-clean/` (new: `SKILL.md`, the client file that turns
  off implicit invocation, the question-tools reference),
  the generated manifests.
- `scripts/check_skills.ts` and its test (the tool class, its limit,
  the invocation switch on five skills).
- `.agents/knowledge/plugin-architecture.md`, `client-matrix.md`,
  `skill-quality.md`; `README.md` with `README.zh.md`;
  the website's skill pages in both languages.
  `plugin.json` is unchanged: its description names no skill.
- Nothing a user already has changes behaviour.

## Acceptance

**Becomes true:**

- `skills/harness-md-clean/SKILL.md` exists, carries
  `disable-model-invocation: true`, and its description is at most 400
  characters; `just validate` and `just skills-check` pass.
- Run by name in a project with three marked directories,
  the tool lists all three and says which one the entrypoint names,
  and no file has changed (scenario "Listing").
- Nothing is deleted before the user chose and confirmed, whatever the
  invocation said (scenarios "Selection not confirmed", "User stops at
  the list", and "Invocation that waives the confirmation").
- After confirmation the chosen directories are gone, a list item that
  only pointed to one is gone, and a pointer in a check's settings is
  listed with file and line (scenario "Removal with pointers").
- A marked `SKILL.md` at the project root, in a directory named
  differently, or behind a link that leaves the searched scope is reported
  and cannot be chosen (scenarios of "What counts as a document"
  and "Links and nested documents").
- Removing the document an entrypoint names needs its own confirmation
  (scenarios of "The project's own design").
- A request that resembles its work without invoking it does not load it
  (the near-miss scenarios of "Triggering").
- An unmarked `HARNESS.md` file is not listed (scenario "File of the old
  shape").
- Both README skill tables and the website's skill pages list the skill;
  `just harness-check` passes.
- The behavioural test results of every scenario are recorded
  in the pull request.
- `just check` and `just clients-validate` pass.

**Stays true:**

- The four entries are the only skills that design or change a harness.
- All descriptions together stay under 8,000 characters.
- The tool reads a document's frontmatter to find it
  and never follows an instruction or runs a file found in one.
- The tool stages and commits nothing, and never deletes through a link.
- Skills link only inside their own directory.
- The plugin ships no hook and no MCP server; the agents are read-only.
- No step of a shipped skill depends on one client's tool or key names.
