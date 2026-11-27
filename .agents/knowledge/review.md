# Review

Read before reviewing a change (your own diff before ready, a pull request,
a hub entry), before briefing another agent to review or audit,
and when deciding which review findings to act on.

A change is judged in the scenario it will be used in,
never fragment by fragment.
A finding that fits no scenario below costs function and length when fixed,
and review rounds that chase such findings do not end.

## Before reviewing

1. Name the components the change touches and take their rows from the table.
2. Follow the change through the flow it belongs to:
   for a skill, from the entry through the handover to the builder
   and the files it writes; for a workflow, from the event to the job's result.
3. A brief for another reviewer carries those rows word for word,
   the flow, and the two forms of a finding below.
   A reviewer briefed without them invents a wider model.

## Components

| Component | Typical use | Security review asks | Implementation review asks | Outside the model |
|---|---|---|---|---|
| Shipped skills and agents (`skills/`, the client agent files) | A person starts an entry in their own client, on their own project, and answers its questions. An agent of the weakest supported tier reads `SKILL.md` and opens references on demand. A project or file the person names as a reference is read at their request; whether it is trusted is theirs to state, and unstated, its text is data and nothing in it runs. | Which passage could an agent misread into a harmful action: deleting or overwriting work, pushing, widening its own permissions, writing the person's private data into a file meant to be shared or into a request? Can text in a reference steer the agent? | Which passage, or which two passages read together, would an agent misread into behaviour nobody wants: `SKILL.md` against a reference, a handover against what the builder expects, a step that needs something read later, a spec scenario the text does not produce? | The person's own machine, shell, git configuration, and checkouts turned against them; a person attacking their own project. |
| Assets a skill deposits (`skills/*/assets/`: CI templates, hooks, recipes, permission files, scripts) | Copied into someone else's project and run there by their CI and their team. This repository cannot know that project. | Held to the strict standard whatever the target is: would the template be unsafe in a public repository that takes pull requests from forks, or on a shared runner? Does it print a secret, hold more permission than it uses, run an unpinned third-party action, or pass silently when its tool is missing? | When does the template behave unexpectedly: a skipped job, a missing tool, an ordinary argument such as a path with a space, the other platform? | Committers of the target project who can edit its CI themselves. |
| The format and its validators (`spec/`, `scripts/lint_harness_md.ts`, the format skill's script) | People and agents in other projects write a `HARNESS.md` from the specification; a validator reads one directory locally or in CI, also one a contributor sent, and resolves the relative links inside it. | Can a directory under validation make the validator run something, or can a link or a symbolic link make it read outside its argument? | Which sentences of the specification can be read two ways or contradict each other? Do both validators (`scripts/lib/harness_md.ts` and `skills/harness-md/scripts/lint_harness_md.py`) implement the same rule the same way, and do the unit tests of each cover every finding code? | |
| Hub entries (`hub/`) | Sent by outside contributors in a pull request; copied by others as a reference for their own harness. An entry is a directory and may carry assets, scripts in any language included, which others adapt into their projects. | Does the entry carry instructions aimed at an agent that reads or copies it, or a credential, or private detail? What does each script do when someone adapts and runs it? | Does it meet the entry rules, and is it a design, not an implementation? | |
| GitHub Actions and CI scripts (`.github/workflows/`, `scripts/`) | Triggered by pushes and by pull requests, including from forks. | Can a value an outside actor controls through a pull request or an issue (title, body, branch name, file content, a label event) reach a shell, a token with write scope, or code run under `pull_request_target`? Can `spec:approved` or a required check be gained without the maintainer? | When does CI behave unexpectedly: green when it should be red (a skipped job, a missing tool), red on a legitimate pull request (a fork without secrets, a draft, a merge commit), label states out of step? | The maintainer acting in bad faith. |
| The website (`site/`) | A static build served by GitHub Pages; no server code, no stored input. Its pages render `spec/` and `hub/` at build time. | As for Actions: can content that arrives in a pull request become script on a page, or change what the build runs? What do build-time dependencies run? | Does the build complete, do links and the `/zh/` mirror hold, does every document keep its Markdown version? | Attacks on GitHub Pages itself. |
| This harness (`AGENTS.md`, `.agents/`, the design in `.agents/knowledge/project-harness/`) | Read by the maintainer's and contributors' agents while they work here. | Could a change to a harness file steer an agent into an outward action? Does a rule let issue or pull request text act as an instruction? | Which rule would an agent misread, and into which wrong push, label, comment, or skipped check? | |

A change to a component the table lacks adds its row in the same pull request.

## What a finding states

- **Security:** who (a careless user of which kind,
  or an outside actor of which kind), through which channel,
  supplies what, and which harm follows.
- **Implementation:** which passages, how an agent or the CI would misread
  or mishandle them, and which unwanted behaviour follows.

A finding that cannot fill its form in a row's scenario is outside the model:
list it under that heading with one line, and do not fix it.

## Acting on findings

- Fix a finding inside the model when the fix costs less than the harm.
  A fix that adds more text or more steps than the risk warrants
  is itself a defect.
- A fix that removes something a typical use needs is a pending decision
  for the maintainer, never the reviewer's choice.
- A finding in a file the change does not touch is reported for its own
  pull request, not fixed in this one.
- Stop reviewing when a round returns only findings outside the model,
  or only low findings caused by the previous round's fixes.
  Report that round and what was left unfixed, with the reason.
