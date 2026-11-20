# What Each Part of a HARNESS.md Usually Holds

Read when an aspect the user named has to be matched to a layer,
and before writing a section of a result file.
The format requires none of these parts; this is what each is used for,
and what it holds in a design abstracted from another project.
A file that covers some aspects leaves the other sections out.

The headings are views of one harness, not boxes.
A thing that belongs to two views is explained once,
where it reads most naturally, and referred to from the other.

## The title

One first-level heading. It names the design,
for example the source project's name and "harness design".
It need not equal the frontmatter `name`.

## The introduction

Paragraphs directly under the title, with no heading of their own;
the format has no overview section.
It usually says four things:
who the harness serves (which people, which agents);
what it is meant to achieve, as outcomes;
what it visibly leaves unmanaged;
what always stays with a human (who merges, who releases).
Here it also says that the file is the design of the named project's harness,
read from outside and separated from its implementation,
and which aspects it covers.

## Context

The conditions the design was made under:
what a wrong change costs, how long the project is maintained,
who relies on its conventions, how unattended agents are,
the hosting platform, the clients and the weakest model;
then the facts the design must fit, such as the stack and the task runner.
Each condition has its evidence or "not observable".
A reader decides from this section whether the design fits their project,
so every condition a decision depends on has to be here.
It holds no decision.

## Invariants

The rules every task follows whatever it is about,
and how each is upheld: stated in the entrypoint, enforced by a check,
or denied by a permission file.
Typical ones: secret handling, the validation that must pass before work
is called done, commit discipline, what is never done without a go-ahead.
A rule for one kind of task belongs to its layer.
Leave the section out when the layers say everything.

## Style

The shape the code has so that agents can work in it:
how modules are bounded; which constraints live in types, schemas,
or assertions instead of written reminders;
whether every command goes through one entry;
how fine-grained tests are and where they sit;
the stance on new dependencies.
Formatting and naming rules are not listed:
say that a formatter and a linter hold them, with the source project's as examples.

## File Structure

The layout the design depends on:
which kinds of path have to exist and what each holds
(the entrypoint, the knowledge directory, the place of project skills,
hooks and checks, permission files, CI, specifications).
Give the source project's paths as the example layout.
It is not a listing of the source project's repository.

## Environment

Where agents run and what they can reach:
an isolated environment or the host; the tools, CLIs, scripts,
and registered servers available; which systems and credentials
are within reach; what is deliberately not provided.
"Which tools exist" is here;
"when an agent may use them without asking" is Authority;
"how they are used to check work" is Feedback.

## Knowledge

What an agent reads to work in the project, and when:
the always-loaded entrypoint and what is kept out of it;
knowledge read on demand and how an agent is routed to it;
project skills; entrypoints for subdirectories or single clients;
which source owns a fact that appears in more than one place.

## Feedback

What an agent can run and observe to check its own change:
the test command and how narrowly it can be scoped,
how the system under development is started and driven,
which output or state shows success, how fast the loop is.

## Gates

What blocks a defect whether or not the agent looked:
the checks at commit, at merge, and at release;
which are deterministic; what each failure tells the reader to do;
what is deliberately not gated and why.
The same check can be Feedback when the agent runs it
and a gate when a hook or CI runs it.

## Authority

What agents may do on their own, what needs a go-ahead,
and what only a human does: permissions per client,
publishing and pushing, deletion, remote settings;
the lifecycle on the hosting platform
(branches, commits, merge method, labels, templates, releases).
An action the source project's files do not mention is not written as allowed.

## Completion

How the goal of a piece of work is agreed before it starts,
and what must hold for it to count as done:
a specification step and who approves it, a definition of done,
review rules.

## Entropy

How drift between the harness, the documents, and the code
is found and repaired: a self-check of the harness,
rules for what changes together, a periodic clean-up.

## Open Questions

What a reader who wants to adopt the design cannot learn from the file
and would need: a decision whose reason is not stated
and on which other decisions rest; a condition that is not observable
and that changes which decisions fit.
Each item says what depends on it.
The source project's defects do not go here.

## References

The source: the source project's address and the commit read.
Then the documents the source project itself cites as the basis of its practice,
each marked "cited by the source project, not read" unless it was read.
Material an agent reads while working is Knowledge, not a reference.
