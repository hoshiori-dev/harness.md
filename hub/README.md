# HARNESS.md Hub

[中文](README.zh.md)

The hub is a collection of ready-made `HARNESS.md` documents.
Each one is a design for an agent harness, or for one part of a harness,
written for one kind of project.
You hand it to a coding agent as a reference
while the two of you work out the harness for your project.

Every entry follows the [HARNESS.md format](../spec/spec.md)
and can also be browsed and searched
on the [website](https://hoshiori-dev.github.io/harness.md/).

## Entries

| Entry | For |
| --- | --- |
| [exploratory-prototype](exploratory-prototype/SKILL.md) | A prototype, demo, or experiment: one person, an agent watched turn by turn, code that will be thrown away within a quarter. Thin on purpose. |
| [production-engineering](production-engineering/SKILL.md) | A production codebase a team maintains for years, where a wrong change reaches users, data, or money. Every layer of the harness is filled in and enforced by machine. |
| [solo-open-source-library](solo-open-source-library/SKILL.md) | A public library with one maintainer and outside contributors. Guards the public API and the release, and asks for little process elsewhere. |

## Using an entry

1. Pick the entry whose Context section is closest to your project.
   The Context is the part to read first:
   it lists what the design takes for granted,
   and a design built on the wrong assumptions will be too heavy or too light.
2. Open your coding agent in your repository,
   give it the address of the entry's `SKILL.md`,
   and tell it what the project is for. For example:
   "This is a payments API in Go, deployed weekly.
   Read
   https://raw.githubusercontent.com/hoshiori-dev/harness.md/main/hub/production-engineering/SKILL.md
   as a reference and design an agent harness for this project with me.
   Tell me where its Context does not fit before you propose anything,
   and show me a plan before you write a file."
3. Go through what the agent proposes. Keep the decisions whose reasons hold
   for your project, change the ones that rest on a premise you do not share,
   and approve the plan before anything is built.

An entry is a directory. `SKILL.md` is its main file,
and any other file it carries is reached from there by a relative link.
The entry does not have to be in your repository, and you do not need
to keep it afterwards: the harness works without it.
A script or a template an entry carries is a reference copy:
your agent adapts it into your project as part of the plan you approved,
and does not run it where it lies.
You can give the agent more than one entry, for example a complete design
and a partial one that covers a single aspect in more depth.

An entry is a design to weigh, not a list of commands.
It states its decisions with their reasons so that you and your agent
can tell which ones fit. No plugin is needed.
An agent that has never heard of this format can read the entry.

Entries are starting points.
An entry that is nearly right and adjusted to your project
is better than one followed to the letter.

## Entry rules

An entry is a directory `hub/<name>/` that is a `HARNESS.md`:
its main file is `SKILL.md`, and it may hold other files beside it.
Beyond the format itself, the hub asks for the following.

- The frontmatter has `name`, `description`, `license: Apache-2.0`,
  and `metadata` with `type: harness-design` and `tags`.
  The format requires that `name` equals the directory name
  and that every `metadata` value is a string,
  so `tags` is one string of lowercase, hyphenated words separated by commas,
  for example `tags: open-source, library, solo`. Filtering reads them.
  It may have `metadata.based-on`, a string of one or more URLs
  separated by commas, naming the designs or sources the entry was derived from.
  It has no top-level key the format does not define and no `allowed-tools`:
  each draws a warning.
- The `description` starts with `[HARNESS.md]`, as the format requires,
  and then says what the design is and which kind of project it suits,
  in 1024 characters or fewer. Search reads it,
  so use the words someone looking for this design would type.
- Every file is in English.
  The validator reports no errors and no warnings,
  so `SKILL.md` has one title, its recommended sections are in order,
  every relative link resolves, and a link reaches every file of the entry.
- No file links by relative path to anything outside the entry's directory.
  A source elsewhere, in this repository too, is given as a full URL
  or named in plain text.
- A file the entry carries beside its prose, such as a script or a template,
  follows the format's guidance on assets:
  it is about the entry's topic, holds nothing that belongs to one project,
  stays true over time, and where project information cannot be avoided,
  `SKILL.md` says what to replace and how.
  A script may be in any language.
  No check reads an asset; review judges it.
- The entry covers a complete harness or a stated part of one.
  Its `description` and its introduction say which,
  and a partial entry says what it leaves to the reader's own design.
- The entry is sufficient within the scope it declares:
  an agent with no plugin can design and build what it covers,
  a whole harness or the stated part, from the entry's files alone.
  It states each decision with its reason and the premise it rests on,
  including decisions not to do something.
  File names, commands, tools, and thresholds are given as examples
  of a decision, never in place of it.
- The entry can be used from the address of its `SKILL.md`,
  wherever it is read.
  It does not tell the reader where to place it,
  and keeping or deleting it is not a step of using it.
  Any note on use is short and leaves the procedure to the reader.
- The entry is generic. It names no private project and contains no secrets.
- Sources listed under References are ones the author has actually read.

`tags` and `based-on` are conventions of this hub.
They are not part of the HARNESS.md format,
which reads only `type` and `version` under `metadata`
and asks of every other key that its value is a string.

## Contributing an entry

New entries and changes to existing ones arrive as ordinary pull requests.
Two things have to be true before one is merged:
the validator passes, and a maintainer has reviewed the substance.

The substance is where the review time goes.
A new entry should describe a kind of project the existing entries serve badly,
and it should differ from them in what it decides,
not in how it words the same decisions.
It helps to say in the pull request which project the design was used
on and what you changed after seeing an agent build from it.

To check an entry locally, run this from the repository root.
It runs the format validator and the hub's own rules over every entry:

```sh
just hub-check
```
