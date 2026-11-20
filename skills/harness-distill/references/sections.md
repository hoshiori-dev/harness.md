# What Each Part of the File Holds

Read before writing the title, the introduction, or a section
outside the layers, and when writing a layer's text yourself
because no installed skill claims the layer.
For each part: what it usually holds in a description of an existing harness,
where the content comes from, and what does not belong.
Every recommended section is optional:
write the ones that have something to say.

## The writing standard

It applies to every section, a builder's text included.

- **Decision, reason, premise, embodiment.** For each rule or mechanism
  let the reader see what was decided, why,
  which condition the decision depends on,
  and which file, command, or tool carries it out.
  A reason follows the marking rule: stated with its location,
  inferred with its evidence, or "reason not recorded".
- **Intent and incidental detail kept apart.** Say which specifics
  the project locks in (the entrypoint or a check requires them)
  and which are only the way it is done today.
  When nothing shows which one a detail is, say so.
- **One place per fact.** A condition stated in Context is referred to,
  not repeated, in the section that depends on it.
  A mechanism that serves several layers is explained once,
  where it reads most naturally, and mentioned in the others.
- **Explicit about what is absent.** What was looked for and not found
  is written as an observation. An absent section tells a reader nothing.
- **Plain.** No word that needs a tool or a methodology to understand.
  A term the project uses is defined where it first appears.
- **As long as needed.** No ordinary task loads this file.
  Do not compress, and do not pad.
- **Harness, not inventory of the repository.** Facts the code states
  (a full directory listing, a command's flags) stay in the code.

## The title

One first-level heading, the only one in the file.
It names the project or the harness; it need not equal `name`.

## The introduction

Ordinary paragraphs directly under the title, with no heading of their own.
There is no `## Overview`; the introduction does that work. Four things:

- who the harness serves (which people, which agents),
  from the entrypoint, the README, and the contribution documents;
- what it is meant to achieve, as stated there; when nothing states it,
  an inference marked as one;
- what it visibly does not manage (for example code style no check enforces);
- what stays with a human (who merges, who releases),
  from permission files and platform configuration.

A partial file adds which parts it covers and which it leaves out.

## Context

The project's conditions, as prose, each with its source
(observed in a named file, or stated by the user):
what a wrong change costs, how long the project will be maintained,
who relies on its conventions, how unattended agents are,
the hosting platform, the clients in use.
Add the observed facts the harness fits: the stack, the task runner.
A condition nobody could give is "not recorded".
Context holds no decision.

## Invariants

The rules every task follows whatever it is about:
those the entrypoint states for every task
and those a check enforces on every commit.
For each, how it is upheld: a check enforces it,
the entrypoint states it, or a permission file denies the opposite.
"Stated only, nothing enforces it" is a finding worth writing.
A rule for one kind of task belongs in its layer.

## Style

The shape of the code as far as the harness depends on it:
the formatter, linter, and type checker in use;
how tests sit beside the code; whether commands go through one entry.
Name the tools and let their configuration hold the rules.
Mark what is convention only.

## File Structure

The layout the harness depends on, one line per path with what it holds:
the entrypoint, the knowledge directory, the project-skill directory,
hook and check locations, permission files, CI files, the spec directory.
Not a listing of the repository.
A path an artifact names that does not exist is a contradiction
and goes into Open Questions.

## The seven layers

Normally each layer's text comes from the skill that claims the layer.
Use this table to write a layer yourself when none does,
and to place a sentence that could sit in two layers.

| Heading | Holds |
| --- | --- |
| Environment | where agents run; the tools, scripts, and MCP servers they can call; which systems and credentials they can reach; what is deliberately not provided |
| Knowledge | what agents read while working (entrypoints, knowledge files, project skills) and when each loads |
| Feedback | which commands an agent runs, and what output or state it observes, to check its own change |
| Gates | the deterministic checks that stop a defect at commit, merge, or release whether or not the agent looked |
| Authority | what agents may do on their own, what needs a person's go-ahead, what only a person does; commit, branch, merge, and release rules |
| Completion | how a task's goal is agreed before work starts and what makes a piece of work finished |
| Entropy | how drift between the harness, the documents, and the code is found and repaired |

Three boundaries decide most doubtful sentences:

- that a tool exists and what it can reach is Environment;
  when an agent may use it without asking is Authority;
  how it is used to check a change is Feedback;
- a check an agent chooses to run is Feedback;
  the same check wired to block a commit or a merge is Gates;
- documents agents read while working are Knowledge;
  documents the harness's authors relied on are References.

## Open Questions

Everything the description found unsettled:
every contradiction, with both locations and no chosen winner;
every "reason not recorded" a reader would need;
every defect noticed on the way (a rule nothing reaches,
a file nothing keeps current);
every condition that could not be given.
Each item says what depends on it.

## References

Outside material the project itself cites as the basis of its practice:
a paper, a vendor's documentation, a design it was adapted from.
List only a source that was opened, with what it was used for.
Material an agent reads while working belongs in Knowledge.
