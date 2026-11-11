# HARNESS.md Format Specification

Version: `alpha`

A `HARNESS.md` file records the design of a project's agent harness: where a
coding agent runs, what it reads, how it checks its own work, what stops a
bad change, and what it may do without asking. This document defines the
format of that file. A Chinese translation is kept beside it as
`spec.zh.md`; when the two differ, this English text takes precedence.

## 1. What a HARNESS.md is

`HARNESS.md` is the source of truth for a project's harness design. It plays
the role for a harness that `DESIGN.md` plays for a visual design: it says
what the harness should be and why. The entrypoint file (`AGENTS.md` or its
equivalent), the knowledge files, the permission files, the hooks, the
checks, and the CI configuration are implementations of that design.

### 1.1 Two ways to use one

The person using the file decides how to use it. The format favours neither
way.

- **As a template.** Put an existing `HARNESS.md` (one from a hub, for
  instance) in the project root, tell a coding agent what the project is
  for, and have the agent expand the file into a complete harness. Once the
  harness is built the file may be deleted.
- **As an anchor document.** Keep the file in the repository as a charter
  that changes rarely. It is read and edited only when the harness is
  checked for drift or deliberately improved.

A `HARNESS.md` taken from somewhere else describes someone else's project in
its Context section. Before keeping it as the anchor document of your own
project, rewrite that section to describe your project, and reconsider
every section whose reasoning depended on the old one.

### 1.2 Rarely loaded, with no length limit

An agent should almost never load `HARNESS.md`. It is not an entrypoint and
ordinary tasks do not need it. Agents open it on demand in three situations:
when building the harness, when checking whether the harness has drifted,
and when improving it.

Because it does not sit in an agent's context, a `HARNESS.md` has no length
limit. Entrypoint files and skills are different: an entrypoint is loaded
on every task and a skill every time it triggers, so each of their lines
is paid for again and again. This file costs nothing until someone opens
it, so it should be as long as it needs to be for a reader to build the
harness from this file alone.

### 1.3 Which source wins

When the file is kept as an anchor document:

- **Design intent comes from `HARNESS.md`.** An artifact (any file that
  implements the design) that disagrees with it is wrong until the file
  says otherwise: fix the artifact, or amend the file.
- **Facts come from the code.** What a command does, or whether a path
  exists, is answered by the code and the configuration.

## 2. Goal and principles

The format has one goal: **writing a `HARNESS.md` requires this
specification; understanding one does not.**

An author, human or agent, who follows the specification produces a file of
a predictable shape. A reader, human or agent, who has never seen the
specification and has no skill or tool installed can still read the file
and know what it says.

Three principles follow from that goal.

1. **Light.** The specification defines only the file's identity fields and
   its section skeleton. It is the specification that is light; a file may
   be any length.
2. **Free-form.** The design itself is written entirely in prose. The
   specification places no limit on extra sections or extra explanation.
3. **Self-explanatory.** A file contains no key and no value that a reader
   has to look up in this specification to understand.

## 3. File structure

A `HARNESS.md` has two parts, like the `SKILL.md` of Agent Skills:

1. **YAML frontmatter**, which holds only the file's identity.
2. **A Markdown body**, which holds the design, organised under the section
   skeleton in section 5.

The file is UTF-8 text. The frontmatter starts on the first line with a
line containing only `---` and ends at the next such line.

A project's `HARNESS.md` lives in the repository root. A reusable design,
such as a hub entry, is the same kind of file; it simply belongs to no
project.

## 4. Frontmatter

The frontmatter identifies the file and carries no design content. Every
statement about the project or its harness belongs in the body.

| Key | Required | Value | Meaning |
| --- | --- | --- | --- |
| `name` | yes | a short name made of lowercase letters, digits, and hyphens | the name of this design |
| `description` | yes | a string | what this design is and what kind of project it suits |
| `version` | no | `alpha` | the format version the file was written for |
| `license` | no | a licence name, or a reference to a licence file shipped with the file | the licence of this `HARNESS.md` file itself |
| `metadata` | no | any structure | additional information for whichever platform wants it |

`license` and `metadata` follow the fields of the same names in the Agent
Skills specification.

Rules:

- `name` and `description` are non-empty strings. `version` and `license`,
  when present, are strings.
- Versions are ordered by release. `alpha` is the first and, so far, the
  only one. When `version` is absent, a validator checks the file against
  the newest version that validator supports. When `version` is present,
  the file is checked against the version it names; if that version is
  older than the newest one the validator supports, the validator adds a
  note and nothing more. A version the validator does not know is reported
  as a warning, and the file is checked against the newest version.
- A top-level key this specification does not define is an error. Anything
  the specification has no key for goes inside `metadata`.
- A top-level key that appears twice is an error.
- `metadata` may hold any structure. The format neither defines nor checks
  what it contains, and the format's own tools ignore it entirely: they do
  not read it, validate it, or compare it. A platform that defines keys
  there checks them itself. The official hub, for example, keeps `tags`
  and `based-on` in `metadata`; those are rules of the hub and no part of
  this format.
- The limits on `name` and `description` come from the Agent Skills
  specification, but breaking them is reported as a warning, never as an
  error. `name` is at most 64 characters, uses only lowercase letters,
  digits, and hyphens, does not start or end with a hyphen, and has no two
  hyphens in a row. `description` is at most 1024 characters.
- The Agent Skills specification also requires `name` to equal the name of
  the directory the file is in. This format does not: a file in a project
  root has no meaningful directory name to compare with. A hub may require
  it in its own entry rules.

## 5. Body

### 5.1 The section skeleton

The specification defines the sections below, in this order. Other
sections are unrestricted and may appear anywhere.

| Order | Section | Required | The question it answers |
| --- | --- | --- | --- |
| 1 | Overview | yes | Who the harness serves, what it is meant to achieve, what it does not try to enforce, and what always stays with a human |
| 2 | Context | yes | The conditions the design has to fit and the designer cannot change, such as the cost of a wrong change, how long the project will be maintained, who relies on its conventions, how closely agents are supervised, the code-hosting platform, and the clients and models the harness targets |
| 3 | Invariants | no | The rules every task must follow, whichever part of the harness it touches |
| 4 | Style | no | What the code itself should look like so that agents can work in it |
| 5 | File Structure | no | The directory layout this design requires |
| 6 | Environment | yes | Where the agent runs, which tools it has, and what it can reach |
| 7 | Knowledge | yes | How the agent learns about the project, and what it reads when |
| 8 | Feedback | yes | What the agent can run and observe to verify its own work |
| 9 | Gates | yes | Which deterministic checks stop defects |
| 10 | Authority | yes | What the agent may do directly and what needs a human; how it commits, branches, merges, and releases |
| 11 | Completion | no | How the goal is agreed before work starts, and what counts as done |
| 12 | Entropy | no | How the harness is kept consistent with the code |
| 13 | Open Questions | no | What is still undecided |
| 14 | References | no | The outside material this design drew on |

The order puts requirements before mechanisms, which is why the required
sections are not all at the front:

- Overview and Context say what the design is and why;
- Invariants, Style, and File Structure state the requirements on the
  project: the rules that may not be broken, the shape of the code, the
  layout;
- Environment through Entropy are the seven layers of the harness, the
  mechanisms that meet those requirements, in the order they are built;
- Open Questions and References close the file.

### 5.2 Recognising a section

- A defined section is a second-level ATX heading (`## Overview`) whose text
  is exactly the English name in the table of 5.1, letter case included.
  The body may be written in any language, but these headings are not
  translated. A heading with different wording or at another level is not
  recognised as that section, and a heading inside a fenced code block is
  not a heading. The first-level heading may say anything.
- When the defined sections do not follow the order of the table, a
  validator reports a warning.
- A defined section that appears more than once is an error.

### 5.3 Required and optional sections

Environment through Entropy are the seven layers of the harness. Five of
them are required (Environment, Knowledge, Feedback, Gates, Authority) and
two are optional (Completion, Entropy). With Overview and Context, that
makes seven required sections.

The five layers are required because of what an agent needs in order to
work at all. Knowledge, Feedback, Gates, and Authority together are the smallest
loop: the agent knows the project, it can tell whether its work is right,
deterministic checks stop its mistakes, and it knows what it may do and
where to stop. Environment is required alongside Authority because the two
have to be read together: what an agent is allowed to do cannot be judged
apart from where it runs and what it can reach. With any of the five
missing, the file alone is not enough to build a harness that works.

A required section may say that nothing is done. A project can decide to
do nothing in a layer, but the section still has to exist, say so, and give
the reason, for example "this project has no pre-commit checks because it
will be thrown away within a quarter". That way a decision not to act never
looks the same as a section someone forgot. A validator cannot check this,
since it never reads prose: an empty section passes validation and fails
its reader.

Leaving out an optional section means the design has nothing there: no
invariants, no completion rules, and so on. A validator does not report it.

### 5.4 Notes on individual sections

These notes say which section a topic belongs to. They do not say how to
write a section well enough that the harness can be built from the file
alone; that is left to the tools and skills that help authors.

#### Style

Style describes the shape of the codebase itself. The layers stand on it:
the more the code explains itself, the less has to be explained around it.
Typical subjects are how cohesive the structure is, which constraints are
expressed in types instead of in written reminders, whether commands go
through a single entry point, how fine-grained the tests are, and the
project's stance on new dependencies. Concrete formatting and naming rules
belong in the formatter and linter configuration.

#### File Structure

File Structure describes the layout the design requires: which directories
and files have to exist and what each holds. It states intent, so it may
name paths that do not exist yet, and artifacts are expected to conform to
it. It may be a tree, a table, or prose.

#### Parts of a repository handled differently

When one layer is handled differently in different parts of a repository
(an `experiments/` directory in a production repository, say), the layer's
own section explains it.

#### Knowledge and References

Both sections list sources, but for different readers.

- Knowledge is a layer of the harness. It covers what an agent reads while
  working in the project: the entrypoint, the knowledge files, and any
  outside documentation the agent should consult during its work.
- References is about this file. It lists the outside material the author
  relied on when writing the design, like the reference list at the end of
  a paper. An agent at work does not need to read it.

To place a piece of material, ask whether an agent needs to read it while
doing its work. If it does, the material belongs in Knowledge. If it is
only where the design came from, it belongs in References.

#### Tools

Tools belong in Environment. A tool is any capability the agent is given
beyond reading and writing files and running ordinary commands. Typical
examples (the list is not exhaustive):

- tools and MCP servers registered with the agent client;
- command-line programs preinstalled in the environment that the agent is
  expected to use, such as the hosting platform's CLI;
- scripts and task-runner entries the project provides for agents.

A section that discusses tools typically says which tools exist and what
each is for; what each can reach (read-only or with side effects, whether
it touches systems outside the repository, which credential it uses); when
it is available; and which tools are deliberately withheld. None of this
is required.

Where tools meet the neighbouring layers:

| Question | Section |
| --- | --- |
| Which tools can the agent use, and what can they reach? | Environment |
| Which actions may the agent take with them, and which need a human? | Authority |
| How does the agent use tools to start, drive, and observe the system under development? | Feedback |
| What does the agent read: skills, knowledge files, documentation? | Knowledge |

## 6. Validation

A file conforms to the format when a validator reports no error for it.
Warnings and notes do not affect conformance. This section lists
everything a validator reports.

**Errors**

- The frontmatter is missing or is not a valid YAML mapping.
- `name` or `description` is missing, empty, or not a string.
- `version` or `license` is present and is not a string.
- A top-level key is not defined by this specification.
- A top-level key appears twice.
- A required section is missing: Overview, Context, Environment, Knowledge,
  Feedback, Gates, Authority.
- A defined section appears more than once.

**Warnings**

- The defined sections are out of order.
- `name` is longer than 64 characters or breaks the character rules.
- `description` is longer than 1024 characters.
- `version` names a version the validator does not know; the file is then
  checked against the newest version the validator supports.

**Notes**

- `version` names a version older than the newest one the validator
  supports.

**Not checked**

- Anything inside `metadata`.
- Extra sections.
- The prose of any section.
