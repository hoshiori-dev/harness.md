# HARNESS.md Hub

[中文](README.zh.md)

The hub is a collection of ready-made `HARNESS.md` files. Each one is a
complete design for an agent harness, written for one kind of project. You
drop it into a repository and a coding agent builds the harness from it.

Every entry follows the [HARNESS.md format](../spec/spec.md) and can also
be browsed and searched on the
[website](https://hoshiori-dev.github.io/harness.md/).

## Entries

| Entry | For |
| --- | --- |
| [exploratory-prototype](exploratory-prototype/HARNESS.md) | A prototype, demo, or experiment: one person, an agent watched turn by turn, code that will be thrown away within a quarter. Thin on purpose. |
| [production-engineering](production-engineering/HARNESS.md) | A production codebase a team maintains for years, where a wrong change reaches users, data, or money. Every layer of the harness is filled in and enforced by machine. |
| [solo-open-source-library](solo-open-source-library/HARNESS.md) | A public library with one maintainer and outside contributors. Guards the public API and the release, and asks for little process elsewhere. |

## Using an entry

1. Pick the entry whose Context section is closest to your project. The
   Context is the part to read first: it lists what the design takes for
   granted, and a design built on the wrong assumptions will be too heavy
   or too light.
2. Copy the file into your repository root as `HARNESS.md`:

   ```sh
   curl -fsSL -o HARNESS.md \
     https://raw.githubusercontent.com/hoshiori-dev/harness.md/main/hub/production-engineering/HARNESS.md
   ```

3. Open your coding agent in the repository and tell it what the project
   is for, then ask it to build the harness from `HARNESS.md`. For example:
   "This is a payments API in Go, deployed weekly. Build the agent harness
   described in HARNESS.md."

Each entry starts with a section called "How to use this file" that tells
the agent what to do next: check the Context against your project, ask you
what it cannot see, show you a plan, and build only after you approve. No
plugin is needed. An agent that has never heard of this format can follow
the file.

When the harness is built you choose what happens to the file. You can
delete it; the harness works without it. Or you can keep it as your
project's design document and check later changes to the harness against
it. If you keep it, rewrite Context so it describes your project and not
the generic one the entry assumed.

Entries are starting points. Edit freely before or after building: an
entry that is nearly right and adjusted by you is better than one followed
to the letter.

## Entry rules

An entry lives at `hub/<name>/HARNESS.md`. Beyond the format itself, the
hub asks for the following.

- The directory name equals the `name` in the frontmatter.
- The frontmatter has `name`, `description`, `version: alpha`,
  `license: Apache-2.0`, and `metadata.tags`, a non-empty list of
  lowercase, hyphenated words used for filtering. It may have
  `metadata.based-on`, a list of URLs of the designs or sources the entry
  was derived from. It has no other top-level keys.
- The `description` says what the design is and which kind of project it
  suits, in 1024 characters or fewer. Search reads it, so use the words
  someone looking for this design would type.
- The body is in English.
  The validator reports no errors and no warnings,
  so the body has one title and its recommended sections are in order.
- The entry can be built from the file alone. It names the files to
  create and what goes in them, the commands, the checks and their
  limits, and the permission rules, and it gives the reason for each
  decision, including decisions not to do something.
- The entry is generic. It names no private project and contains no
  secrets.
- Sources listed under References are ones the author has actually read.

`tags` and `based-on` are conventions of this hub. They are not part of
the HARNESS.md format, which ignores everything under `metadata`.

## Contributing an entry

New entries and changes to existing ones arrive as ordinary pull requests.
Two things have to be true before one is merged: the validator passes, and
a maintainer has reviewed the substance.

The substance is where the review time goes. A new entry should describe
a kind of project the existing entries serve badly, and it should differ
from them in what it decides, not in how it words the same decisions. It
helps to say in the pull request which project the design was used on and
what you changed after seeing an agent build from it.

To check an entry locally, run this from the repository root. It runs the
format validator and the hub's own rules over every entry:

```sh
just hub-check
```
