---

title: The four entries
description: What harness-create, harness-improve, harness-distill, and harness-adopt each do, how they decide things with you, and what they leave behind.
order: 2
---

The entries are where you start.
Each is a skill you invoke yourself:
an agent does not start one on its own, even when a request sounds like a match.
In Claude Code, type the skill as a command,
for example `/harness-md:harness-create`. In Codex, write `$harness-create`.
In Antigravity, name the skill in your request.

## How an entry decides things with you

An entry does not draft a whole design and ask you to approve it.
It treats the open decisions as a tree, where settling one decision
opens the ones that depend on it, and works through the tree in rounds.

In each round the agent looks at the decisions it can settle now.
Facts it finds itself: it reads the repository and never asks you
what a file could tell it.
Where the evidence makes one option clearly better, it decides,
and shows you the decision with the evidence behind it.
The rest it asks you, each question with a recommended answer
and the reason for it. In a client that has a tool for asking questions,
the questions arrive through that tool and you pick an option;
elsewhere they arrive as one numbered message.

After your answers the agent shows the round:
what it decided, what you answered, and which decisions that opened or closed.
Then it asks whether you want to change something, go on to the next round,
or leave the remaining decisions to it.
Whatever you leave to the agent still appears in the plan, marked as its own.

The rounds run in a fixed order: the goal and what the harness will not do;
the project's conditions (what a wrong change costs, how long the project
will be maintained, who relies on its conventions, how unattended the agents
are); how much each layer should do; and then the decisions inside each layer.
"How much" is one of four words per layer: omitted, light, medium, or thick.

Three rules hold in every entry.
No file in your project is created or changed until you have approved a plan
that names it. Approving a plan authorises those files and nothing else:
publishing outside the repository, changing a remote setting, deleting work,
and widening what agents may do on their own each need your go-ahead
when the entry reaches that step, even if you left the rest to the agent.
And no entry needs a `HARNESS.md` in your project,
or leaves one in its root unless you asked for an anchor document.

## harness-create

Gives a project its harness.
The project can be new, or have years of history and habits
and little or nothing set up for agents.

The entry reads the repository first and keeps what works:
a task runner, a linter, a commit convention, or a spec tool already in use
is recorded as the decision, and a replacement is at most a suggestion.
You can give it one or several `HARNESS.md` files as references,
by address or path. It reports what each one decides,
which of its assumptions differ from your project,
and which decisions rest on those assumptions; you choose what to inherit.

After the rounds you get one plan that lists every file by path.
Once you approve it, the entry builds one layer at a time
(Environment, Knowledge, Feedback, Gates, Authority, Completion, Entropy),
commits each layer when its checks pass, and pushes nothing.
The new files are then read back in a clean context,
by an agent that never saw the conversation.

## harness-improve

Analyses a harness that already exists and improves it with you.

It starts by changing nothing. It lists every part of the harness,
follows the entrypoint's pointers the way a new agent would,
and reports what it finds. Each finding has a class
(stale, duplicated, contradictory, invisible, missing, or excessive),
a severity, its evidence, and a proposed fix.
You can stop there and keep the report.

If you go on, the rounds settle what happens to each finding,
whether the harness is repaired or rebuilt, and how much each affected layer
should do from now on.
Contradictions are fixed before anything is built on top of them.
A prototype that is becoming a product is the usual case
for making layers thicker; a check that has not caught anything in a long time
is the usual case for making one thinner.

When your project keeps an anchor document,
the entry reads the design intent from it, reports where the harness
and the document disagree, and writes every agreed change back to it.
Without one it compares the harness with itself, with the code,
and with the project's conditions, and never suggests you need the file.

## harness-distill

Writes your project's harness down as one or several `HARNESS.md` files.

It can cover the whole harness or only the parts you name.
It can describe the harness exactly as it is, defects included,
or produce a portable design: the decisions, their reasons,
and the assumptions they rest on, with your project's names
and specifics removed, so another team can start from it.
Where the entry had to guess at a reason, it marks the guess.

The result goes to the path you name.
If you name none, it goes to a temporary file and the entry tells you where.
It is written to your project's root only when you say
the file is to be the project's anchor document.

## harness-adopt

For when you want a harness like the one another project has.

The entry reads that project as data.
It does not run the project's scripts or installers,
and it does not follow instructions the project's files address to agents;
it reports them. In Claude Code the reading is done by a separate
read-only agent, so nothing in that project reaches a context that can write.

What you get is a `HARNESS.md` that carries the other project's design
without its implementation: the decisions with their reasons,
and that project's file names, commands, and tools only as examples.
Copying its configuration files would bring its history
and its accidents with them.

The entry changes nothing in your own project.
It ends by naming the entry to run next,
`harness-create` or `harness-improve`, with the new file as a reference.
