# Evidence

Read when the user doubts a practice, asks what it is based on, or wants to
add more to a harness "to be safe". State only what is written here; when a
question needs a number or a source that is not here, say so instead of
supplying one.

## Context files cost more than they return

- *Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for
  Coding Agents?* (Gloaguen et al., arXiv 2602.11988). Across several
  models and coding agents, repository context files did not generally
  raise task success, and they raised inference cost by more than 20% on
  average. This held for generated and for developer-written files. Agents
  did follow the instructions in them; repository overviews in particular
  did not help. The authors' conclusion: context files are useful for
  stating non-standard practices, and anything beyond that should be
  measured before it is relied on.
- Thoughtworks Technology Radar, volume 35, lists "agent instruction bloat"
  under Caution: instruction files that keep growing until agents follow
  them worse.

What follows for a design: an entrypoint states what a capable newcomer
would get wrong in this project and nothing a model already does by
default. A layout overview, a list of standard commands, and general
advice are cost without return.

## Skills are matched, not guaranteed

- Vercel's agent evaluations (*AGENTS.md outperforms skills in our agent
  evals*, January 2026): a compressed documentation index placed in
  `AGENTS.md` reached a 100% pass rate on their tasks, while skills reached
  at most 79% even when the agent was told to use them, because the agent
  often never invoked the skill.

What follows: a procedure whose miss causes harm is named in the entrypoint
by situation; description matching is for optional helpers.

## A boundary beats a prompt

- Anthropic reports that sandboxing reduced permission prompts in Claude
  Code by 84% in its own use, and that users were approving roughly 93% of
  the prompts they saw (*How we contain Claude across products*, Anthropic
  engineering). Both figures are self-reported.
- A 2026 study of agent permission rules (arXiv 2608.27443) found that
  rules users write themselves lean on "ask" decisions, and that this gives
  worse protection than deciding in advance what is allowed and denied.

What follows: restrict what the environment can reach, then allow widely
inside it. An "ask" entry is not a safeguard; a person who is asked fifty
times a day approves without reading.

## Verification the agent can run is the best investment

Claude Code's best-practices documentation calls giving the agent a way to
verify its own work (tests, screenshots, expected outputs) the single
highest-leverage thing a team can do. An agent that can run a check and see
the result corrects itself; an agent that cannot reports work it never saw
working. This is why Feedback is a required layer and why a fast, scoped
test command is in every default.

## How to use this file

Evidence supports a default; it does not replace the project's Context. A
team with a measured reason to deviate deviates, and the layer's section in
`HARNESS.md` records the reason.
