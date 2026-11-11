---

title: Using a HARNESS.md without the plugin
description: How to turn a HARNESS.md from the hub into a working harness with any coding agent and nothing installed.
order: 4
---

Writing a `HARNESS.md` requires the specification; understanding one does not. So a file from the [hub](../../hub/) works with any coding agent, with nothing installed.

## Save the file, then state the goal

1. Pick an entry in the hub and download it, or copy its text.
2. Save it as `HARNESS.md` in the root of your project.
3. Tell your coding agent what the project is for and ask it to build the harness the file describes.

A request like this is enough:

```text
This project is a command-line tool that syncs photo libraries between
two disks. Read HARNESS.md in the repository root and build the agent
harness it describes for this project. The Context section was written
for another project: adapt it to this one first, and tell me what you
changed before you create any file.
```

The last sentence matters. A hub entry carries its author's Context: the cost of a wrong change, how long the project will live, how unattended the agents are. Yours will differ somewhere, and the sections whose reasoning depended on the old Context need a second look.

## Afterwards: delete it or keep it

Once the harness is built you have two choices, and the format favours neither.

- **Delete the file.** It was a template and it has done its job.
- **Keep it as the anchor document.** Leave it in the repository as the project's lasting record of the design, changed rarely. If the agent has not already rewritten Context for your project, do that now. Agents should almost never load the file; open it when you check the harness for drift or set out to improve it. An artifact (a file that implements the design) that disagrees with the design is wrong until the file says otherwise: fix the artifact, or amend the file. Facts, such as what a command does or whether a path exists, come from the code.

## What you give up

Without the plugin the agent works from the file and its own judgement. You lose the validator, the skills that know how to design, build, and check each layer, and the reread of the new files in a clean context after a build. For a small project that trade is often fine. If you want to check a file's format by hand, the last section of the [specification](../../spec/) lists everything a validator reports.
