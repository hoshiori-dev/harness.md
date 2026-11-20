# HARNESS.md Hub

[中文](README.zh.md)

The hub is a collection of ready-made `HARNESS.md` files.
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
| [exploratory-prototype](exploratory-prototype/HARNESS.md) | A prototype, demo, or experiment: one person, an agent watched turn by turn, code that will be thrown away within a quarter. Thin on purpose. |
| [production-engineering](production-engineering/HARNESS.md) | A production codebase a team maintains for years, where a wrong change reaches users, data, or money. Every layer of the harness is filled in and enforced by machine. |
| [solo-open-source-library](solo-open-source-library/HARNESS.md) | A public library with one maintainer and outside contributors. Guards the public API and the release, and asks for little process elsewhere. |

## Using an entry

1. Pick the entry whose Context section is closest to your project.
   The Context is the part to read first:
   it lists what the design takes for granted,
   and a design built on the wrong assumptions will be too heavy or too light.
2. Open your coding agent in your repository, give it the entry's address,
   and tell it what the project is for. For example:
   "This is a payments API in Go, deployed weekly.
   Read
   https://raw.githubusercontent.com/hoshiori-dev/harness.md/main/hub/production-engineering/HARNESS.md
   as a reference and design an agent harness for this project with me.
   Tell me where its Context does not fit before you propose anything,
   and show me a plan before you write a file."
3. Go through what the agent proposes. Keep the decisions whose reasons hold
   for your project, change the ones that rest on a premise you do not share,
   and approve the plan before anything is built.

The file does not have to be in your repository, and you do not need
to keep it afterwards: the harness works without it.
You can give the agent more than one entry, for example a complete design
and a partial one that covers a single aspect in more depth.

An entry is a design to weigh, not a list of commands.
It states its decisions with their reasons so that you and your agent
can tell which ones fit. No plugin is needed.
An agent that has never heard of this format can read the file.

Entries are starting points.
An entry that is nearly right and adjusted to your project
is better than one followed to the letter.

## Entry rules

An entry lives at `hub/<name>/HARNESS.md`.
Beyond the format itself, the hub asks for the following.

- The directory name equals the `name` in the frontmatter.
- The frontmatter has `name`, `description`,
  `license: Apache-2.0`, and `metadata.tags`, a non-empty list of lowercase,
  hyphenated words used for filtering.
  It may have `metadata.based-on`,
  a list of URLs of the designs or sources the entry was derived from.
  It has no other top-level keys.
- The `description` says what the design is and which kind of project it suits,
  in 1024 characters or fewer. Search reads it,
  so use the words someone looking for this design would type.
- The body is in English. The validator reports no errors and no warnings,
  so the body has one title and its recommended sections are in order.
- The entry covers a complete harness or a stated part of one.
  Its `description` and its introduction say which,
  and a partial entry says what it leaves to the reader's own design.
- The entry is sufficient within the scope it declares:
  an agent with no plugin can design and build what it covers,
  a whole harness or the stated part, from the entry alone.
  It states each decision with its reason and the premise it rests on,
  including decisions not to do something.
  File names, commands, tools, and thresholds are given as examples
  of a decision, never in place of it.
- The entry can be used from wherever it is read.
  It does not tell the reader to place it in a project root,
  and keeping or deleting the file is not a step of using it.
  Any note on use is short and leaves the procedure to the reader.
- The entry is generic. It names no private project and contains no secrets.
- Sources listed under References are ones the author has actually read.

`tags` and `based-on` are conventions of this hub.
They are not part of the HARNESS.md format,
which ignores everything under `metadata`.

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
