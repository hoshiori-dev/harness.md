---

title: The four workflows
description: What harness-design, harness-build, harness-extract, and harness-audit each do, and what they leave behind.
order: 2
---

The workflows are the plugin's entry points. Each is a skill you invoke yourself: an agent does not start one on its own, even when a request sounds like a match. In Claude Code, type the skill as a command, for example `/harness-md:harness-design`. In Codex, write `$harness-design`. In Antigravity, name the skill in your request.

The four workflows share three rules. First, the agent takes from the repository everything the repository can show and asks you once for the rest. It then drafts the whole design, with a default and a reason for every decision, and you approve the draft once instead of answering one question per decision. Second, no file in your project is created or changed until you have approved the design that covers it. Third, approving a design authorises only the files it describes. Publishing outside the repository, changing a remote setting, deleting work, and widening what agents may do on their own each need a separate go-ahead from you, which the workflow asks for when it reaches that step.

## harness-design

Produces a project's `HARNESS.md`, or revises the one it has.

For a new project it starts from your goal. For an existing one it starts from what the repository already does. If you pasted in a file from the hub, it first rewrites Context, the section describing the conditions the design has to fit, for your project. Then it reconsiders the sections whose reasoning depended on the old Context.

You get one file, `HARNESS.md`, in the repository root, checked by the validator.

## harness-build

Turns a `HARNESS.md` into the harness: the entrypoint, knowledge files, checks, permission files, and the rest. The file can be a template you pasted a minute ago or the project's anchor document: its lasting record of the design, kept in the repository and changed rarely. When a harness already exists, the workflow migrates it to match the design.

It builds one layer at a time. The layers are the seven parts of a harness the file describes, built in the order of their sections: Environment, Knowledge, Feedback, Gates, Authority, Completion, Entropy. Invariants, Style, and File Structure are not layers; the workflow hands each of their rules to the layers that can carry it out. When the design asks for something the repository makes impossible, the workflow skips that item, reports the conflict, and builds the rest.

At the end you decide whether `HARNESS.md` stays as the anchor document or is deleted.

## harness-extract

Reads a project and writes the `HARNESS.md` that describes the harness it already has. The project can be your own, or someone else's that you want to learn from.

The result describes the harness as it is today. Where the workflow had to guess at intent, it marks the guess.

## harness-audit

Diagnoses a harness and reports what it finds, without editing any file. It checks three things:

1. whether `HARNESS.md` is valid;
2. where the design and the artifacts (the files that implement it) have drifted apart;
3. whether the design still suits the project, given its Context.

Each finding names its evidence and says which side to fix: the artifact, or the design.
