# Proposal

Issue: [#14](https://github.com/hoshiori-dev/harness.md/issues/14).

## Why

The specification and the hub treat the repository root as the normal home
of a `HARNESS.md`: both uses the specification describes begin by putting
the file there, and every hub entry carries a procedure that starts from a
file pasted into a root.
The maintainer's positioning is different.
A `HARNESS.md` is first a portable design document:
a summary of all or part of a harness design written to be handed on,
a reference brought in from outside while a project's own harness is designed,
and the abstraction that lets one project imitate another's design
without inheriting its implementation.
Keeping a file in the root as the project's anchor document is an optional use
that a project chooses explicitly;
a project needs no `HARNESS.md` of its own to have a good harness.

## What Changes

Domains: `format` and `hub`.
Clients: none; no shipped skill or agent is added, changed, or removed.
The plugin is rebuilt on this positioning in a later change.

- The format states four uses of a file: summary for distribution,
  outside reference, abstraction for imitation, and anchor document.
  It says that a project is not expected to keep a file of its own.
- Only an anchor document has a prescribed place and name:
  the repository root, `HARNESS.md`.
  The format prescribes neither for any other file.
- A file that is not the project's anchor document has no authority
  over that project; it is material to weigh.
- The specification's version stays `1.0.0`, by the maintainer's decision.
  Every file that conformed before still conforms.
  No validator finding changes, and no fixture is added or changed.
- A hub entry is a reference design handed to an agent wherever it is read.
  It no longer tells its reader to place it in a project root
  or to decide whether to keep or delete it.
- A hub entry may cover a complete harness or a stated part of one.
- A hub entry states each decision with its reason and the premise
  it rests on, and gives concrete realisations (file names, commands,
  tools) as examples of the decision, not as the decision.
- The three existing entries, `README.md`, `hub/README.md`,
  their Chinese mirrors, and the website copy that says how a file is used
  follow the new positioning.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `format/document`: the uses of a file, where a file lives,
  when a file is opened, and which files have authority over a project.
- `hub`: what an entry must be sufficient for, whether it may be partial,
  and what it may tell its reader to do with it.

## Impact

- `spec/spec.md`, `spec/spec.zh.md`,
  `skills/harness-md/references/specification.md` (the byte-identical copy).
- `openspec/specs/format/document/spec.md`, `openspec/specs/hub/spec.md`.
- `hub/README.md`, `hub/README.zh.md`, the three entries under `hub/`.
- `README.md`, `README.zh.md` (the sections on trying a design
  and on what a hub entry is), the website's page on using a file
  without the plugin and the prompt text on hub entry pages.
- `.agents/knowledge/hub.md`, `.agents/knowledge/format-changes.md`,
  and the root `HARNESS.md` where they restate the old positioning.
- Until the plugin is rebuilt, the shipped skills still describe
  the old positioning; no release is cut in between.

## Acceptance

**Becomes true:**

- `spec/spec.md` section 3 names the four uses and says a project
  is not expected to keep a file of its own; checked by reading
  the section against the scenarios of `format/document`.
- `spec/spec.md` section 4.1 prescribes a name and place only
  for an anchor document; `grep -n "repository root" spec/spec.md`
  finds the phrase only in sentences about an anchor document.
- `spec/spec.zh.md` has the same sections and the same statements;
  `just harness-check` passes (mirror heading structure).
- `skills/harness-md/references/specification.md` equals `spec/spec.md`;
  `just skills-check` passes.
- No entry under `hub/`, and neither README, tells a reader to put
  the file in a project root in order to use it;
  `grep -rn -i "root" hub/*/HARNESS.md README.md hub/README.md`
  shows no such instruction.
- `openspec/specs/hub/spec.md` accepts an entry that covers part
  of a harness (scenario "Entry covering one aspect").
- `just check` passes.

**Stays true:**

- The version line of the specification reads `1.0.0`.
- `spec/fixtures/expected.json` is unchanged and `just fixtures-check`
  passes with both validators unchanged.
- The format requires no body section and defines five top-level keys.
- A reader with no tool and no knowledge of the specification
  can understand a conforming file.
- A hub entry can be understood, and a harness designed from it,
  with no plugin installed.
- `just hub-check` enforces the same mechanical rules as before
  (layout, clean validation, `license`, `metadata.tags`, `based-on`).
- The specification contains no filled-in example file.
