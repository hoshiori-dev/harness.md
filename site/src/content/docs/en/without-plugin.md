---

title: Using a HARNESS.md without the plugin
description: How to use a HARNESS.md from the hub as a reference with any coding agent and nothing installed.
order: 4
---

Writing a `HARNESS.md` requires the specification; understanding one does not.
So a file from the [hub](../../hub/) works with any coding agent,
with nothing installed.

## Give the agent the file, then state the goal

1. Pick an entry in the hub and copy its address,
   or download the file to any place you like.
2. Tell your coding agent what the project is for
   and give it the address or the path.
3. Ask it to use the file as a reference for your project's harness.

A request like this is enough:

```text
This project is a command-line tool that syncs photo libraries between
two disks. Read the HARNESS.md at <address> as a reference and design an
agent harness for this project with me. Its Context section was written
for another kind of project: tell me where it does not fit this one,
and show me a plan before you create any file.
```

The last sentence matters. A hub entry carries its author's Context:
the cost of a wrong change, how long the project will live,
how unattended the agents are. Yours will differ somewhere,
and the decisions whose reasons depended on that Context need a second look.

The file does not have to be in your repository,
and you can give the agent more than one.

## Afterwards: you do not need the file

Once the harness is built it works without the file.
A project needs no `HARNESS.md` of its own.

If you want your project's design written down,
to share it or to keep it, have the agent write a `HARNESS.md`
that describes your harness as it now is,
not the entry you started from.

A project may also decide to keep such a file in its root
as its **anchor document**: the lasting record of the design, changed rarely.
Agents should almost never load it;
open it when you check the harness for drift or set out to improve it.
An artifact (a file that implements the design) that disagrees
with an anchor document is wrong until the document says otherwise:
fix the artifact, or amend the document.
Facts, such as what a command does or whether a path exists,
come from the code.

## What you give up

Without the plugin the agent works from the file and its own judgement.
You lose the validator, the skills that know how to design, build,
and check each layer, and the reread of the new files in a clean context
after a build. For a small project that trade is often fine.
If you want to check a file's format by hand,
the last section of the [specification](../../spec/) lists everything
a validator reports.
