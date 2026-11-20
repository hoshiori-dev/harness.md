---

title: Skills and the agents
description: The format skill, the methodology manual, the seven layer builders, the everyday skills, and the two read-only agents that ship with harness-md.
order: 3
---

Apart from the four entries,
the plugin's skills load on their own when a task calls for them.

## The format skill

The `harness-md` skill, which shares its name with the plugin, reads, writes,
and validates a `HARNESS.md`. It comes with three things:
a copy of the [specification](../../spec/);
a writing standard, which says how complete a section has to be for a reader
to work from the file alone; and the validator script.
It does not assume a file belongs in your project's root:
a file is a project's anchor document only when the project chose one.

The validator checks the format of a single file:
the frontmatter, the title,
and the order and repetition of the recommended sections.
It requires no section. It does not judge the prose,
and the plugin ships no tool that compares two files.

## The methodology manual

`harness-architecture` explains why each layer exists,
where a given rule belongs,
and how a project's conditions decide how much of each layer it needs.
Turn to it when you have a question about the method;
the entries and the builders do the building.

## The seven layer builders

There is one builder per layer of the harness.
Each knows how to decide, build, and check its layer,
and has a recommendation for every decision the layer has to settle.
You don't need to remember their names:
the entries pick the builder for each layer.

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
In **decide** it returns how much the layer should do and the layer's
decisions, each one either settled by evidence or left open with options.
In **describe** it writes down what the project does today.
In **build** it creates the files from the decisions you agreed to,
and it is the only mode that writes to the project.
In **audit** it reports findings and changes nothing.

You can also ask for one layer directly,
for example "set up the checks for this repository";
the builder then shows you what the evidence settles, asks you the rest,
and writes files only after you have accepted what it showed.

## The everyday skills

These are for work inside a harness that already exists.

| Skill                       | Use it for                                                                        |
| --------------------------- | --------------------------------------------------------------------------------- |
| `spec-driven-development`   | writing the specification before the code, and running a change through that loop |
| `openspec-workflow`         | creating, validating, and archiving OpenSpec changes                              |
| `spec-kit-workflow`         | taking a change from specification to code with Spec-Kit                          |
| `lightweight-spec-workflow` | agreeing on one change with plan mode or a single `SPEC.md`, without a framework  |
| `project-skill-building`    | writing and repairing the skills a project keeps for its own agents               |

## The two agents

Both agents are read-only.

`harness-verifier` reads a harness back after it was built or changed.
The entry hands it the new files with one line of intent each.
It reads them in a clean context, as an agent that never saw the build would,
and reports what it would understand and where the files contradict each other.

`harness-reader` reads a project that comes from outside,
for `harness-adopt` or when a reference is a whole project.
It reports what that project's harness consists of,
lists any instruction the project's files address to agents,
and follows none of them.

They ship to Claude Code only,
because the plugin formats of Codex and Antigravity have no place for agents.
In those clients the entry asks another clean-context subagent
to do the same reading. If none is available,
the agent does the reading itself and says so in its report.
