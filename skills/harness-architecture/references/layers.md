# The Layers

Read when the question is what a layer is for, what breaks without it,
which of two layers owns a topic, or which `HARNESS.md` section covers a
topic. Layer names are the section names of `HARNESS.md`.

## The seven layers

| Layer | Question it answers | Without it |
| --- | --- | --- |
| Environment | Where the agent runs, which tools it holds, what it can reach | Every rule is advice: an agent that runs code can write around any instruction, so the real boundary is the machine and the credentials it holds |
| Knowledge | How the agent learns the project, and what it reads when | It guesses conventions, or reads everything and loses the thread |
| Feedback | What the agent can run and observe to verify its own work | It reports work as done that it never saw working |
| Gates | Which deterministic checks stop a defect | A defect lands whenever the agent, or a person, did not look |
| Authority | What the agent may do directly, what needs a human, how it commits, branches, merges, and releases | It either stops to ask about everything or does something outward that cannot be undone |
| Completion | How the goal is agreed before work starts, what counts as done | It stops at "tests pass" or never stops; the result answers a question nobody asked |
| Entropy | How the harness stays consistent with the code | The harness goes stale, and a stale harness is trusted and wrong |

Build order is the order of the table: an environment before anything runs
in it, knowledge before feedback commands are documented, feedback before
gates reuse its commands, gates before authority relies on them, and
entropy last because it checks everything before it.

## Boundaries that are asked about

- **Feedback or Gates.** Feedback is what the agent chooses to run to see
  whether its work is right: a test for one module, a dev server, logs, a
  screenshot. Gates run whether or not the agent chose to: pre-commit
  hooks, CI checks, a required aggregate check. The same command often
  serves both; the Feedback section says how the agent uses it while
  working, the Gates section says where it blocks.
- **Environment or Authority.** Environment is capability: which tools
  exist and what they can reach. Authority is permission: which actions the
  agent may take with them. A token's scope is Environment; the rule "never
  push without a go-ahead" is Authority. They are designed as a pair: a
  wide permission is safe only in a narrow environment.
- **Authority and the platform.** Commits, branches, the merge method,
  labels, issue forms, request templates, releases, and remote settings are
  part of Authority, because how an agent works with the repository and the
  platform is the same question as what it is allowed to do.
- **Knowledge or References.** If an agent needs to read the material while
  working, it is Knowledge. If it is only where the design came from, it is
  References.
- **Tools.** Which tools exist and what they reach is Environment; what the
  agent may do with them is Authority; using them to start, drive, and
  observe the system under development is Feedback; skills and documents
  are things the agent reads, so they are Knowledge.

## The sections that are not layers

| Section | What it holds | Where it becomes real |
| --- | --- | --- |
| Overview | Who the harness serves, what it achieves, what it does not police, what stays with a human | The frame every layer is judged against |
| Context | The given conditions the design has to fit | The reason behind each layer's amount |
| Invariants | Cross-layer rules every task follows | Knowledge (the always-on rules of the entrypoint), Gates (each one a check can enforce), Authority (each one about what an agent may do) |
| Style | The shape the code should have so agents can work in it | Gates (what a formatter, linter, type checker, or structure check enforces), Knowledge (conventions an agent has to read), Feedback (test granularity) |
| File Structure | The directory layout the design requires | Each layer creates the paths it owns; Entropy checks the layout |
| Open Questions | What is undecided | Nothing is built from it |
| References | Outside material the design drew on | Nothing; an agent at work does not read it |

Style comes before the layers because the more the code explains itself
(cohesive modules, constraints in types, one entry for commands), the less
the layers have to explain around it.

## Required and optional

Environment, Knowledge, Feedback, Gates, and Authority are always present
in a design, even when a section says the project does nothing there and
why: a decision not to act must not look like a forgotten section.
Completion and Entropy may be left out; an absent section means the project
does nothing for that layer.
