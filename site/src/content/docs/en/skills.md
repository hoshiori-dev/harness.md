---

title: Skills and the verifier agent
description: The format skill, the methodology manual, the seven layer builders, the everyday skills, and the read-only verifier agent that ship with harness-md.
order: 3
---

Apart from the four workflows,
the plugin's skills load on their own when a task calls for them.

## The format skill

The `harness-md` skill, which shares its name with the plugin, reads, writes,
and validates a `HARNESS.md`. It comes with three things:
a copy of the [specification](../../spec/);
a writing standard, which says how complete a section has to be for the harness
to be built from the file alone; and the validator script.

The validator checks the format of a single file:
the frontmatter, the title,
and the order and repetition of the recommended sections.
It requires no section. It does not judge the prose,
and the plugin ships no tool that compares two files.

## The methodology manual

`harness-architecture` explains why each layer exists,
where a given rule belongs,
and how a project's Context decides how much of each layer it needs.
Turn to it when you have a question about the method;
the workflows and the builders do the building.

## The seven layer builders

There is one builder per layer of the harness.
Each knows how to design, build, and check its layer,
and has a default for every decision the layer's section has to settle.
You don't need to remember their names:
the workflows pick the builder for each layer.

| Builder                | Layer       | What the layer covers                                                                    |
| ---------------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `environment-building` | Environment | where the agent runs, which tools it holds, what it can reach                            |
| `knowledge-building`   | Knowledge   | the entrypoint, the knowledge files, what the agent reads when                           |
| `feedback-building`    | Feedback    | what the agent can run and observe to verify its own work                                |
| `gates-building`       | Gates       | the deterministic checks that stop a defect whether or not the agent looked              |
| `authority-building`   | Authority   | what the agent may do without asking, and how it commits, branches, merges, and releases |
| `completion-building`  | Completion  | how the goal is agreed before work starts, and what counts as done                       |
| `entropy-building`     | Entropy     | how the harness is kept consistent with the code                                         |

A builder works in four modes.
In **design** it returns its layer's section as prose.
In **extract** it describes what the project does today.
In **build** it creates the files,
and it is the only mode that writes to the project.
In **audit** it reports where the project and the section disagree.

You can also ask for one layer directly,
for example "set up the checks for this repository";
the builder then drafts that layer's section first and asks for one approval
before it writes files.

## The everyday skills

These are for work inside a harness that already exists.

| Skill                       | Use it for                                                                        |
| --------------------------- | --------------------------------------------------------------------------------- |
| `spec-driven-development`   | writing the specification before the code, and running a change through that loop |
| `openspec-workflow`         | creating, validating, and archiving OpenSpec changes                              |
| `spec-kit-workflow`         | taking a change from specification to code with Spec-Kit                          |
| `lightweight-spec-workflow` | agreeing on one change with plan mode or a single `SPEC.md`, without a framework  |
| `project-skill-building`    | writing and repairing the skills a project keeps for its own agents               |

## The verifier agent

`harness-verifier` is a read-only agent.
After a build, the workflow hands it the new files with one line of intent each.
It reads them in a clean context, as an agent that never saw the build would,
and reports what it would understand and where the files contradict each other.

It ships to Claude Code only,
because the plugin formats of Codex and Antigravity have no place for it.
In those clients the workflow asks another clean-context subagent
to do the same reading. If none is available,
the agent rereads the files itself from the start.
