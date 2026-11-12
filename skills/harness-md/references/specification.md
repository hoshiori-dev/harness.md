# HARNESS.md Format Specification

Version: `1.0.0` (the specification itself is versioned with Semantic Versioning)

`HARNESS.md` is a document format for representing, storing,
and exchanging the design of an agent harness in software engineering.
Its core purpose is to record how a coding agent runs in a particular project,
what knowledge it obtains, which tools it calls, how it verifies its work,
which deterministic checks protect it,
and within what limits of authority it acts on its own.
This specification defines the file's syntax, its metadata fields,
the recommended body vocabulary, and the validation contract of the format.
A Chinese version is kept beside it as `spec.zh.md`;
where the two differ in detail, this English specification takes precedence.

## 1. Background, definitions, and positioning

In real software engineering,
a coding agent's basic ability to read and write files and run commands
does not mean that it can take
on the development tasks of a specific project directly, safely,
and with high quality.
To finish work independently in an engineering environment,
an agent first needs to understand the objective conditions
and boundaries of the project,
and then depends on a set of external mechanisms
that work together to obtain context, call tools, observe the system's feedback,
intercept defects, and follow the rules of collaboration.

A considerable part of these supporting conditions cannot be reliably inferred
by an agent from source code analysis
or from the model's own general knowledge alone.
Examples are the team's capacity for human review,
the organisation's internal branching and release conventions,
non-public internal APIs and architecture documents,
the business cost of a failure, the project's expected maintenance period,
and the particular engineering trade-offs the team has formed
over a long evolution. Without a clear record of the design,
an agent either keeps probing at key boundaries,
even acting beyond its authority,
or keeps interrupting its task to ask for human intervention
because it lacks enough information.

The collection of runtime environment, information channels,
means of verification, and limits of authority built around a coding agent
is called an **agent harness** (harness for short).
In a specific repository,
the implementation of a harness is usually spread over several places:
the entrypoint file (such as `AGENTS.md`
or a client-specific instructions file), domain knowledge documents,
scripts and task entries, MCP servers or tool registration configuration,
credential and sandbox policy, Git hooks, automated tests, and CI pipelines.
These artifacts are what make the harness actually run,
but in themselves they usually show only the final commands
and configuration of "how to do it",
and do not record the premises and trade-offs of "why it was designed this way".
At the same time, concrete artifacts inevitably carry the historical accidents,
scripting habits, and platform-specific limits of the original project;
if one repository's configuration files
are copied directly, as they are, into another project, mismatched dependencies,
outdated rules, and irrelevant engineering complexity
are very easily brought into the new environment along with them.

`HARNESS.md` aims to solve the problem of separating design intent
from concrete implementation.
The role it plays for an agent harness is similar to the role a `DESIGN.md`
or an architecture design document plays for a software system:
it carries the harness's design decisions, the premises under which they apply,
the reasons for the trade-offs,
and the expected mechanisms in structured metadata and a natural-language body.
By abstracting the design into a file format
that is independent of any concrete runtime configuration,
`HARNESS.md` becomes a representation of a design that can be stored, versioned,
and exchanged across projects.
Just as a general data-exchange format allows different systems to pass data
without sharing their internal implementation,
`HARNESS.md` allows different teams and projects to pass harness designs
between them, to be implemented again by the receiving person
or agent according to the target project's actual technology stack
and constraints.

In a project's body of documentation,
different files address their own audiences and moments of use,
and complement rather than replace one another:

* **`README.md`**: mainly for human developers and users;
  it introduces the project's features, how to get started quickly,
  and the everyday development workflow.

* **`AGENTS.md` or an equivalent entrypoint file**:
  mainly for an agent carrying out everyday coding tasks in the repository;
  it provides the immediate instructions, common commands,
  and knowledge index that have to be loaded for every task.

* **Skills, MCP, and client configuration**:
  concrete extensions of capability or means of runtime control,
  used to inject steps, tool interfaces,
  or permission limits into an agent under particular trigger conditions;
  they are not suited to holding, at length,
  the overall design reasoning that cuts across layers.

* **`HARNESS.md`**: mainly for **the people or agents who build, migrate,
  review, and improve an agent harness**;
  it preserves the overall design intent, the background assumptions,
  and the causal relations between the mechanisms.

This specification defines only the minimum structure of `HARNESS.md`
as a document format, its metadata contract, the recommended section vocabulary,
and the mechanical validation rules.
It does not prescribe "which components an excellent harness must contain",
does not mandate any engineering technology choice,
and does not replace a concrete methodology of harness design.

## 2. Format goal and design principles

This format specification has only one core goal:
**an author may rely on this specification to write a well-formed `HARNESS.md`;
but understanding a `HARNESS.md` should not depend on this specification,
nor on any particular skill, MCP, client, or parsing tool.**

An author (whether a human engineer or a coding agent)
who writes the document by following this specification
can produce a file with a predictable structure and consistent metadata,
which is convenient for tools to search, archive, and validate.
A reader (whether a developer taking over the project or an agent
in another environment), even one who has never come across this specification,
can directly understand the harness design the file describes, and build,
assess, or rework a harness accordingly,
provided they are able to read an ordinary Markdown technical document.

Around this core goal,
the format establishes the following four design principles:

1. **Lightweight constraints.**
   The specification defines only the outer structure of the file,
   five top-level metadata fields, and the basic rules for recognising headings.
   Lightweight means
   that the specification itself has very few mechanical constraints,
   not that the length of a document is limited;
   to explain the design clearly, the body of a file may be of any length.

2. **Free-form body.**
   The design content of a harness is written entirely in natural language
   in the Markdown body. The specification has no required body section,
   prescribes no form fields that the body must fill in,
   and does not restrict authors from freely adding, removing,
   or combining extra sections as the project needs.

3. **Self-explanatory.** The metadata key names,
   the recommended section headings,
   and the design narrative in the body should all be understandable
   from common sense and context. Authors should explain specific terms,
   background conditions, and design reasons clearly in the body,
   so that readers can understand the whole design
   without consulting an external format manual.

4. **Implementation-neutral and portable.**
   A `HARNESS.md` records the engineering mechanisms and behavioural boundaries
   that are expected to be achieved,
   not the proprietary configuration syntax bound
   to one particular agent client.
   Even when a document mentions a specific client, model, or scripting tool,
   the emphasis is on explaining the role it plays in the overall design
   and the reason, so that other agents
   can implement the design again equivalently on a different toolchain
   or host environment.

To raise the efficiency of exchange across projects
while keeping the body free-form,
section 5 of this specification provides a recommended vocabulary
of second-level sections and an order for them.
The vocabulary is not a closed semantic taxonomy,
nor a checklist for judging whether a design is acceptable,
but a set of shared section signposts.
When different documents use the same English headings (such as `Context`,
`Environment`, `Gates`, `Authority`)
to organise similar subjects,
human readers and coding agents
can both locate the information they care about in a long document more quickly.
The recommended order, meanwhile, follows semantic dependency,
from overall background and constraints, to requirements on code and structure,
and then to running mechanisms and long-term evolution,
so that the premises set out earlier naturally support the specific design
that follows.

Precisely because the shared vocabulary serves readability and predictability
and is not enforced by machine,
this specification strictly distinguishes "format conformance errors (Error)"
from "advisory warnings (Warning)".
Violating the basic syntax or the metadata contract makes a file non-conforming;
departing from the recommended heading structure
or naming conventions produces only a warning,
which reminds the author to check whether it was intended,
and never causes a `HARNESS.md` with sound content to be judged an invalid file.

## 3. Use and lifecycle

Over the actual engineering lifecycle, a `HARNESS.md` goes through creation,
handover, expansion into an implementation, retention for reference,
drift checking, and iterative revision.
A project team may decide how to use and dispose of the file
according to its own needs;
the format stays neutral towards the different ways of use
and does not favour any one mode in its syntax.
The two most common basic uses are as a **template**
or as an **anchor document**.

In either mode, an agent does **not need** to load `HARNESS.md` automatically
for everyday business coding, bug fixing, or writing routine tests.
It is not the entrypoint file for everyday tasks.
Usually a person or an agent needs to open and read the file
on demand only in the following three kinds of situation:

1. **Building the harness for the first time, or reinstalling it**:
   generating or completing the repository's configuration, documents,
   and script artifacts from scratch according to what the document describes.

2. **Checking the harness for drift**:
   after the project has gone through several rounds of evolution,
   checking whether the repository's existing entrypoint file, scripts,
   permission settings, and gates have departed from the original design intent,
   or whether there are mechanisms the design requires
   that were never put in place.

3. **Improving the harness deliberately**:
   when engineering conditions change (for example, a new tool is introduced,
   the boundary of autonomy is adjusted,
   or a recurring collaboration defect is found),
   first assessing and revising the design in `HARNESS.md`,
   and then updating the implementation artifacts in the repository to match.

### 3.1 Use as a template

When a new project starts,
or an existing project introduces coding agents for the first time,
the team may obtain a ready-made `HARNESS.md` from a public design repository
(a hub) or from another project inside the organisation,
and put it in the root directory of the target project.
A developer then gives the coding agent the specific business background
and technology stack of the target project,
and the agent reads this `HARNESS.md`,
understands the design structure and the protective thinking set out in it,
and turns it into actual artifacts of the current repository (for example,
generating an `AGENTS.md`, configuring check scripts,
and setting up permission rules and CI gates).
When the whole harness has been built and verified to work,
the team may delete this `HARNESS.md` if it does not need
to maintain a design document in the repository for the long term.

### 3.2 Use as an anchor document

The second way is to keep `HARNESS.md`
in the root directory of the code repository for the long term,
as the authoritative basis of the project's harness design.
In this mode the file normally stays stable, like an engineering charter,
and is not changed frequently
along with everyday business feature development.

### 3.3 Context cost and the trade-off on length

The format sets no upper limit on the file length of a `HARNESS.md`
or on the word count of a section.
This design is directly related to the file being loaded on demand:
an entrypoint file (such as `AGENTS.md`)
is read into context when every everyday task starts,
and a skill occupies the context window every time it triggers,
so they must be highly condensed,
to avoid long background discussion crowding out the space for everyday work.
By comparison, a `HARNESS.md` consumes no context capacity while it is not open.

But this does not mean that reading on demand has no cost.
When an agent carries out a task of building, reviewing,
or refactoring the harness, once it opens `HARNESS.md`,
all of the file's content still occupies the context window of that task
and affects the efficiency of information retrieval.
Setting no limit on length in the format
is meant to allow authors to write out the necessary engineering premises,
reasons for trade-offs, and boundary conditions thoroughly:
a moderate amount of added,
clear causal explanation can significantly reduce wrong guesses and rework
during building and evolution.
A good `HARNESS.md` should pursue information density and structural clarity,
and be written until a reader can understand and build the expected harness
from this one file together with the project's code,
rather than piling up irrelevant preamble.

### 3.4 Boundaries of authority: which source prevails

When `HARNESS.md` is kept in the repository as an anchor document,
there is a clear boundary of responsibility and authority
between it and the project's code and configuration files:

* **Design intent follows `HARNESS.md`.**
  The entrypoint file, knowledge documents, hooks, scripts,
  and gate configuration that implement the harness in the repository
  are all artifacts of this design.
  When the structure or rules these artifacts exhibit
  are inconsistent with what `HARNESS.md` records,
  the system has undergone design drift:
  either the artifacts should be repaired
  so that they conform to `HARNESS.md` again,
  or `HARNESS.md` should be formally revised once the new practice
  has been confirmed to be more reasonable.

* **System state follows the code and the actual configuration.**
  What action a command actually performs at present,
  whether a directory or file really exists in the repository,
  and which checks the CI pipeline actually runs at this moment
  can be answered only by the current state of the codebase, scripts,
  and configuration files. No person or agent may,
  without verifying the actual state of the repository,
  take a design description in `HARNESS.md` directly as a runtime fact
  that is already in effect in the system.

## 4. File format and metadata

So that a design document can be read directly as ordinary text by people
and agents, and can also be reliably recognised and distributed
by indexing tools, code repository platforms, and design hubs,
`HARNESS.md` uses the same two-part structure
as the `SKILL.md` of the Agent Skills specification:

1. **YAML frontmatter**: at the start of the file,
   used only to hold the file's own identity and basic metadata.

2. **Markdown body**: immediately after the frontmatter,
   used to carry all of the concrete harness design content.

### 4.1 Basic file syntax and location

A `HARNESS.md` must be a plain-text file encoded in UTF-8.
The YAML frontmatter must start on the first line of the file;
the opening delimiter line and the closing delimiter line are each three hyphens
(`---`) on a line of their own.
The content between the two delimiter lines must parse as a valid YAML mapping
(a collection of key-value pairs).
All text after the closing delimiter line belongs to the Markdown body.
A validator must accept the following harmless variations:
a UTF-8 BOM at the start of the file,
spaces and tabs at the end of a delimiter line, and CRLF line endings.
When writing a file, however,
it is recommended to use UTF-8 encoding without a BOM
and clean `---` delimiter lines.

When `HARNESS.md` is used for a specific software project,
the file should be placed in the repository root,
and the file name is fixed as `HARNESS.md`.
When a design is stored as an independent,
reusable entry in a design repository (such as a public or internal hub),
it is still a file of exactly the same `HARNESS.md` format,
only not attached to a specific business codebase;
its directory structure is organised by the platform that hosts it.

### 4.2 Frontmatter field definitions

The sole responsibility of the frontmatter is to say "what this design document
is"; it must not be used to carry specific design statements
about the target project or the mechanisms of the harness.
Any content that concerns project constraints, environment and tools,
limits of authority, or workflow rules must be written in the Markdown body.

The format defines only the following five top-level frontmatter fields:

| Field | Required | Type and value requirements | Meaning | Validation result at the format level |
| ----- | ----- | ----- | ----- | ----- |
| `name` | yes | non-empty string; only ASCII lowercase letters, digits, and non-consecutive hyphens are recommended | the short name (identifier) of this harness design | missing, empty, or not a string: Error; violates the length or character naming rules: Warning |
| `description` | yes | non-empty string; no more than 1024 characters is recommended | briefly says what this design is and what kind of project it suits | missing, empty, or not a string: Error; more than 1024 characters: Warning |
| `version` | no | string; its form is not constrained | the version of this design itself; its form and meaning are decided by the author, and the format neither interprets nor compares it | present but not a string: Error |
| `license` | no | string | declares the licence name of this `HARNESS.md` file itself, or points to a licence file shipped with the file | present but not a string: Error |
| `metadata` | no | any YAML data structure | additional extension information for a specific platform, tool, or organisation | the format does not check its internal structure or content |

Of these fields, `license` and `metadata` directly follow the design
of the fields of the same names in the Agent Skills specification,
to make it easier to reuse tools across ecosystems.
Note that `license` describes the licence terms
of this `HARNESS.md` design document itself,
which are not necessarily the same
as the source code licence of the software project it is in.

### 4.3 Field constraints and rules for the extension space

The specific rules for each top-level field are as follows:

* **Required fields and type constraints**:
  `name` and `description` are required fields,
  and their values must be non-empty strings
  (a string containing only whitespace characters counts as empty).
  `version` and `license` are optional fields;
  once they appear in a file, their values must be of string type.
  Violating any of these required or basic type requirements
  is a format error (Error).

* **Soft constraints on naming and length**:
  the format restrictions on `name` and `description`
  are borrowed from the Agent Skills specification,
  but in this format they are only advisory constraints
  (a violation produces a Warning and does not count as an Error).
  Specifically, `name` should not be longer than 64 characters,
  and should consist only of ASCII lowercase letters (`a-z`), digits (`0-9`),
  and hyphens (`-`); it must not start or end with a hyphen,
  and must not contain two consecutive hyphens (`--`).
  `description` should not be longer than 1024 characters.
  Characters are counted as Unicode code points.

* **A closed top-level key space**:
  the frontmatter may contain only the five top-level keys listed
  in the table above (`name`, `description`, `version`, `license`, `metadata`).
  Any other top-level key not defined by this specification counts
  as a format error (Error);
  the same top-level key appearing more than once in the frontmatter also counts
  as a format error (Error).

* **The principle that `metadata` is entirely exempt from checking**:
  if an author or a platform needs to record additional properties not defined
  by this specification, they must be put inside the `metadata` field.
  `metadata` may be any valid YAML structure, such as a mapping, a list,
  or a scalar. The format neither defines nor constrains the key names
  and values inside `metadata`;
  format validation tools and general-purpose reading tools
  should ignore its internal content completely:
  they do not read its business semantics, do not perform structural validation,
  and do not compare it at the format level.
  Whichever external platform agrees on extension keys in `metadata`
  is responsible for checking them itself at its intake or publishing stage.
  For example, the official hub may agree to use `tags` and `based-on`
  in `metadata` to mark classification and derivation;
  that belongs to the hub's platform rules
  and has nothing to do with whether a file conforms
  to the `HARNESS.md` format specification.

## 5. Body organisation and the recommended vocabulary

The Markdown body of a `HARNESS.md` is used
to set out the project's harness design in full.
The basic principle of the format for the body's structure is:
**the body is entirely free-form, and there is no required section.**

Authors may decide freely how to organise the body
according to the project's actual complexity, risk profile,
and habits of expression. To help authors draft,
and to let human readers and coding agents of different backgrounds
quickly form an expectation of the document's structure,
this specification provides a convention for the document's main title
and a shared vocabulary made up of thirteen recommended second-level sections.

### 5.1 The document's main title (H1) and the general introduction

It is recommended to use one first-level ATX heading
at the start of the Markdown body
(for example `# Name of the project or harness`)
as the main title of the whole document.
The text of this first-level heading may be written freely and is not required
to match the `name` field in the frontmatter.
If the body has no first-level heading at all, or has more than one,
a validator gives a warning (Warning),
but this does not affect the file's format conformance.

After the first-level heading and before the first second-level heading,
it is recommended to write a general introduction directly
in natural-language paragraphs.
This introduction takes on the role of an overall overview,
and is usually used to explain:
who this harness serves,
what engineering goals it is centrally meant to achieve,
what it explicitly does not intend to bring under management,
and which key decisions are always reserved for humans.
This specification does not require the introduction to exist
and does not prescribe its length or format,
and a validator performs no check on whether the introduction exists
or on what it specifically says.

### 5.2 The recommended vocabulary of second-level sections

After the general introduction,
this specification defines
the following thirteen recommended second-level section headings (H2)
and their recommended order.
The table below lists the exact English name of each recommended heading
and a hint about the design content it can usually be used to express:

| Recommended order | Recommended second-level heading (case-sensitive) | Semantic hint for the section (not a requirement on content) |
| ----- | ----- | ----- |
| 1 | `Context` | The objective facts about the project, external conditions, business risks, maintenance period, and premises of collaboration that affect design decisions |
| 2 | `Invariants` | The global design constraints expected to hold at all times across tasks, and the bottom-line rules that must not be broken |
| 3 | `Style` | The preferences in code structure and engineering style established so that agents can understand, modify, and verify the code |
| 4 | `File Structure` | The layout of directories and key files the design expects the repository to have, and the responsibility each path carries |
| 5 | `Environment` | The runtime environment the agent is in, the tools, scripts, and MCP it can call, and the range of systems it can actually reach |
| 6 | `Knowledge` | The project knowledge and internal documentation sources the agent needs to consult in everyday work, and when it reads them |
| 7 | `Feedback` | Which commands the agent runs, and which output or state it observes, to check the correctness of its own changes |
| 8 | `Gates` | The gates and checking mechanisms that automatically intercept defects in a deterministic way at commit, merge, release, and similar stages |
| 9 | `Authority` | Which operations the agent may perform on its own, and which actions must ask for human confirmation or be completed by a human in person |
| 10 | `Completion` | How the goal is aligned before a task starts, and what conditions must be met for a piece of work to count as truly complete and deliverable |
| 11 | `Entropy` | How, in long-term evolution, deviations between harness artifacts, documentation, and the code implementation are identified and repaired |
| 12 | `Open Questions` | Matters in the current design that are not yet settled and are left for later practice to test or for the team to decide |
| 13 | `References` | The external materials and sources the author consulted or relied on when making this `HARNESS.md` design |

The order above follows a main line of logic from macro-level premises
to micro-level mechanisms and then to lifecycle evolution:
it first sets out the objective background the design sits in (`Context`)
and the overall requirements on the codebase itself (`Invariants`, `Style`,
`File Structure`); it then unfolds in turn the core running conditions
and control mechanisms that support an agent's autonomous work (`Environment`,
`Knowledge`, `Feedback`, `Gates`, `Authority`);
next it explains the criteria for closing a single task
and the mechanisms of long-term maintenance (`Completion`, `Entropy`);
and it ends with open questions and references (`Open Questions`, `References`).
This arrangement follows the dependencies between the concepts:
for example, only once the project's risk background (`Context`)
and the agent's environment and reachable range (`Environment`)
are clear can the degree of autonomy it should be given (`Authority`)
be reasonably defined.
But this order is meant to provide a predictable experience of reading
and generation, and does not prescribe the mechanical steps an agent takes
when executing a task.

### 5.3 Rules for section recognition, optionality, and extension

When recognising body sections,
validators and tools follow these explicit rules:

* **Exact match on an English second-level ATX heading**:
  a recommended section is recognised only through a second-level ATX heading
  (such as `## Context`),
  and the heading text must match the English name in the table
  in section 5.2 exactly (case-sensitive);
  for the syntax details see section 7.4.
  Although the body paragraphs of a `HARNESS.md`
  may be written in Chinese or any other natural language,
  it is recommended that second-level headings themselves stay in English
  and untranslated, to guarantee that tools across languages
  and different agents recognise the section skeleton consistently.

* **A non-matching heading is treated as ordinary free content**:
  if a document writes one of the terms as a third-level heading
  (such as `### Context`), changes its spelling or case (such as `## context`),
  translates it into another language (such as `## 背景`),
  or the heading appears inside a fenced code block,
  a validator does not recognise it
  as the corresponding recommended second-level section.
  Such headings are treated only as ordinary free body text or custom headings,
  and take no part in the order
  or duplicate checks of the recommended vocabulary.

* **All optional, adopted as needed**:
  all thirteen recommended sections in the table are optional.
  Authors need only pick and write the sections
  that have real expressive value for the current design;
  recommended sections that are not adopted are simply omitted,
  and a validator produces no error or warning for this.

* **Any extra sections are allowed**:
  authors may add any number of custom second-level headings
  or lower-level subheadings anywhere in the body (including between, before,
  or after the recommended sections) to express design content particular
  to the project.

* **The warning mechanism for order and repetition**:
  if the recommended second-level sections actually adopted in a document
  are not arranged in the relative order of the table in section 5.2
  (for example, `Authority` is written before `Environment`),
  or the same recommended second-level section appears more than once
  in the document, a validator issues a warning (Warning),
  but this likewise does not break the file's format conformance.

The recommended vocabulary **is not a form to be filled in**.
When reading a `HARNESS.md`,
readers and agents must understand the design
on the basis of the natural-language content the body actually contains,
and must never treat the recommended sections
as a checklist of feature switches:
they cannot infer, merely because a document
does not write out a recommended heading (for example,
it has no separate `## Gates` or `## Entropy`),
that the project forbids gates or does not care at all
about long-term maintenance;
the relevant design intent may well already be merged
into the narrative of the introduction, of other recommended sections,
or of custom sections.

## 6. Expressing design information in a free-form body

Because the body of a `HARNESS.md` is free text with no mandatory sections,
a format validator does not check for the author whether the body
is substantial or its logic self-consistent.
For a `HARNESS.md` to have real value in being passed across environments,
guiding construction, and supporting long-term maintenance,
its author needs to organise the design information effectively
in natural-language narrative.
This section sets out principles for expressing information in a free-form body;
these principles are a communication guide for authors and readers,
and **do not constitute any new machine validation rule
or required-field contract**.

### 6.1 Carrying causal context: decision, reason, premise, and embodiment

The core value of a harness design that can be migrated
and maintained lies not in listing scattered commands,
but in making clear the causal chain behind the design.
Whether it uses recommended sections or custom paragraphs,
a good design narrative usually lets the reader see the connections
on four levels: **what decision was made, why it was made this way,
what preconditions the decision depends on,
and through what mechanism or artifact it is expected to be embodied**.

Explaining "why" and "which premises it depends on" is the key
to supporting a design's evolution across projects.
Many constraints in engineering, an organisation's internal private knowledge,
and a team's preferred code style need to be written into `HARNESS.md` precisely
because they form the premises of the decisions behind concrete mechanisms.
For example:

* Because a core module is jointly maintained with an external compliance team
  and the cost of a change incident is extremely high (premise),
  the design requires all modifications touching
  that directory to pass a dedicated static check,
  and forbids agents to merge branches directly (decision and mechanism);

* Because the project is only an internal prototype expected to live
  for two months, with an engineer supervising
  in real-time pairing throughout (premise),
  the design decides not to configure complex pre-commit gates
  and an automated regression suite,
  and relies only on lightweight unit-test feedback (decision and reason).

When writing, an author may gather the global objective conditions
in the `Context` section,
or may explain the background reasons a mechanism depends
on right where the concrete mechanism is set out
(such as in `Gates` or `Authority`);
there is no need to repeat the same fact mechanically across several sections
for the sake of tidy form,
and still less to treat the various dimensions of background as a fixed table
that must be filled in item by item in `Context`.
Only when readers understand the premises a rule depends on can they,
when project conditions change in future or the design
is migrated to a new repository,
judge accurately which parts of the design need to be kept
and which should be adjusted or dropped.

### 6.2 Distinguishing design intent from incidental implementation details

When describing the mechanisms of a harness,
authors should consciously distinguish "design intent
at the architectural level" from "incidental implementation
in the current environment".

When a design is meant to be reused across projects or to guide evolution
over the long term, explaining "why a certain kind of knowledge entry,
means of feedback, or limit of authority is needed"
is usually more portable than directly pasting a piece of script code
in one particular language. For example,
explaining that "the agent should be able to verify quickly and locally,
through a single idempotent command,
whether a change breaks existing contracts"
helps a receiving agent rebuild an equivalent mechanism in a new environment
more than merely writing down a line of parameter invocation
for one particular framework.

On the other hand, staying implementation-neutral does not mean that the body
may contain only abstract principles.
If certain specific directory paths, entrypoint file names,
command-line interfaces, tool names,
or model-client features are themselves the target state
the design explicitly requires,
the author may perfectly well write them in specific detail in the body.
The key is to let readers understand which specific details
are contracts the design deliberately locks in,
and which are only the current way of implementing things,
cited to illustrate the intent.
When different parts of a repository take different approaches (for example,
the main application directory requires strict deterministic gates,
while the experimental `experiments/` directory allows relaxed checks),
it is enough to explain this local difference and its reasons directly
in the paragraph on the mechanism concerned.

### 6.3 Understanding the vocabulary as a whole, and the elasticity of its boundaries

The headings of the recommended vocabulary represent different perspectives
on the same harness, not classification boxes
that are sealed off from one another and mutually exclusive.
In actual engineering, environment capabilities, knowledge reading,
observed feedback, deterministic gates,
and authorisation to act are often closely interwoven,
and together they support the agent's working loop.

For example, the same command-line tool or test script exists
in the runtime environment as an available capability (`Environment`);
it is also the self-check the agent uses, after modifying code,
to observe whether behaviour meets expectations (`Feedback`);
it may at the same time be configured in the commit flow as a mandatory check
that intercepts defects (`Gates`);
and whether the agent may execute it with particular arguments involves
the limits of authority (`Authority`).
When organising the body,
authors should take as their standard whatever reads most naturally
and is easiest to understand for humans and agents:
they may write a tool's existence and purpose in `Environment`
and refer to it directly in `Authority` and `Feedback`;
or they may explain closely related mechanisms thoroughly together
in one core section, without breaking a complete line of logic into fragments
to fit the heading classification.

In everyday writing and reading,
the following common conceptual distinctions help keep things clear and orderly,
but they too are rules of thumb that aid understanding,
not exclusive format prohibitions:

* **Tool capability and authorisation to use**:
  when introducing tools (including MCP servers registered with the client,
  preinstalled platform CLIs, the project's own task scripts, and so on),
  explaining "which tools the environment provides,
  what external systems or credentials they can reach,
  and which tools are deliberately not provided" usually belongs
  to the depiction of the runtime environment (`Environment`);
  stipulating "under what conditions the agent may call them directly,
  without asking, to perform actions with side effects,
  and when it must stop for a human to decide" focuses on authority to act
  (`Authority`); and "how to use these tools to start, drive,
  and observe the system under development" serves the verification of work
  (`Feedback`).

* **`Knowledge` and `References`**: both mention documents or external material,
  but they serve different audiences.
  `Knowledge` describes the information sources an agent needs to consult
  when carrying out everyday development tasks in the project
  (such as the entrypoint file, architecture notes, API manuals,
  and when to consult them); `References` lists the external articles,
  standards, or upstream design sources the author consulted
  when writing this `HARNESS.md` design document,
  which is equivalent to the reference list at the end of a paper,
  and an agent usually does not need to read them in everyday coding work.

* **`File Structure` and the actual state of the directories**:
  whether it is described with a directory tree, a table, or prose,
  `File Structure` expresses the target layout and division of responsibilities
  that this design requires the repository to have,
  so it may include paths that have not been created yet
  but are planned to be generated by an agent;
  which files actually exist in the repository at present
  is answered by the file system itself.

### 6.4 Interpreting omissions and undeclared matters with caution

Because the body is free-form,
no `HARNESS.md` can exhaust every detail of an engineering project.
When parsing and applying a design document,
readers and agents should remain careful and restrained about omitted content:

1. **An omitted section does not mean a disabled mechanism**:
   as stated earlier, the absence of a recommended section means
   only that the author did not give the subject a section
   of its own under that standard heading;
   it cannot be inferred from this that the design rejects
   that kind of mechanism.

2. **An action that is not mentioned is not authorised by default**:
   on safety and the limits of authority,
   if a document does not explicitly state
   that some high-risk or boundary-crossing operation
   (such as pushing to the remote main branch,
   modifying production configuration,
   or accessing a restricted external service)
   may be carried out by the agent on its own,
   the agent must not interpret it as authorised
   because the document "does not forbid it",
   but should adopt a conservative strategy in light of the project's background
   or confirm with a human.

3. **The adequacy of a design is judged by engineering review**:
   whether the feedback loops a `HARNESS.md` describes are closed,
   whether the strictness of its gates matches the project's risks,
   and whether its information is enough for an agent
   to build a usable harness all belong
   to the domain of engineering design quality.
   These problems should be discovered and made good by people or agents
   through substantive assessment in the course of creating, migrating,
   or reviewing a harness,
   and are not ruled on mechanically by a document format validator.

## 7. Conformance and validation

Whether a `HARNESS.md` file conforms to this format specification
is determined entirely by whether a format validator reports an error (Error):
**as long as a validator reports no Error for a file,
the file conforms to this format specification.**
Warnings (Warning) are used to give the author feedback
on structural suggestions,
and do not affect the file's format conformance.

**Format conformance** and **design adequacy** must be clearly distinguished.
Passing format validation means only
that the file satisfies the file structure syntax, metadata contract,
and heading recognition rules defined by this specification;
whether the harness design described in the body is complete,
whether it suits the target project,
and whether working engineering mechanisms
can be successfully built from this file alone
are assessments at the level of design content,
and are not among the responsibilities of machine format validation.

This section lists in full everything a validator should report,
and the range it explicitly does not check.

### 7.1 Errors (Error: cause non-conformance)

In any of the following cases, a validator must report an Error,
and the file is judged not to conform to this format:

1. **The file is not valid UTF-8 text**:
   the content of the file cannot be decoded as UTF-8.
   The validator then reports this item only and checks nothing else.

2. **The frontmatter block is missing or its syntax is invalid**:
   the file does not provide YAML frontmatter starting on the first line,
   does not provide a matching closing delimiter line (`---`),
   or the content between the delimiter lines cannot be parsed
   as a valid YAML mapping.

3. **A required field is missing, empty, or of the wrong type**:
   the `name` or `description` field is missing;
   its value is `null`, an empty string,
   or a string containing only whitespace characters;
   or its value is not of YAML string type.

4. **An optional string field is of the wrong type**:
   the file provides a `version` or `license` field,
   but its value is not of string type (for example, it is written as a number,
   a boolean, a list, a mapping, or a null value).

5. **Contains an unknown top-level key**:
   the frontmatter contains any top-level key other than `name`, `description`,
   `version`, `license`, and `metadata`.

6. **A top-level key is repeated**:
   the same top-level key appears twice or more in the frontmatter.

### 7.2 Warnings (Warning: do not affect conformance)

In any of the following cases, a validator should report a Warning,
but the file still conforms to this format:

1. **The body lacks a first-level heading (H1)**:
   there is no line in the Markdown body that is recognised
   as a first-level ATX heading (`# ...`).

2. **The body has more than one first-level heading (H1)**:
   two or more first-level ATX headings appear in the Markdown body;
   it is suggested that a validator report problems of this kind once per file,
   in aggregate.

3. **A recommended second-level section (H2) is repeated**:
   among the thirteen recommended second-level headings defined in section 5.2,
   the same heading appears as a second-level ATX heading
   in the body more than once;
   it is suggested that a validator report in aggregate
   by the name of the repeated section,
   to avoid the same section flooding the output several times.

4. **The recommended second-level sections (H2) are out of order**:
   the relative order of the recommended second-level headings
   that actually appear in the body is inconsistent with the order defined
   in the table in section 5.2.

5. **`name` violates the naming or length advice**:
   the `name` string is longer than 64 characters,
   or contains characters other than ASCII lowercase letters (`a-z`),
   digits (`0-9`), and hyphens (`-`), or starts with a hyphen,
   ends with a hyphen, or contains two consecutive hyphens (`--`).

6. **`description` exceeds the advised length**:
   the `description` string is longer than 1024 characters.

### 7.3 What is not checked and not reported

To guarantee the body's freedom of expression
and the independence of platform extensions,
a validator **must not** report any error or warning for the following:

* **Omitting any or all of the recommended second-level sections**:
  one, several, or even all thirteen of the recommended second-level headings
  in section 5.2 do not appear in the body
  (the format has no required body section).

* **The text of the H1 heading and the form of the introduction**:
  the text of the body's H1 heading is inconsistent with `name`
  in the frontmatter, or no general introduction paragraph
  is written below the H1 heading.

* **Custom and extra heading structure**:
  the body contains any second-level heading outside the recommended vocabulary
  (including Chinese second-level headings or other custom headings),
  and subheadings at any level (H3–H6).

* **The length and quality of the body content**:
  how many words the body of any section has,
  even if nothing follows a section heading,
  and whether the design described in natural language in the body is accurate,
  reasonable, complete, or executable.

* **The internal content of `metadata`**:
  the data structure, key names, and value types inside the `metadata` field,
  whether it is empty, and whether it satisfies the extension rules
  of a particular platform (such as a hub).

* **Specific engineering and client details**:
  whether the body mentions particular harness layers, particular tool commands,
  or the configuration of a particular coding agent client.

### 7.4 Syntax boundaries of heading recognition

When recognising first-level headings (H1)
and recommended second-level headings (H2) in the Markdown body,
a validator follows the conventional syntax boundaries of CommonMark
for ATX headings:

* No line of text inside a fenced code block
  (a block formed by three or more backticks `` ` `` or tildes `~`)
  is treated as a heading.

* A heading line may contain an indentation of at most three spaces
  before the opening `#` or `##`;
  the `#` or `##` must be followed immediately by at least one space or tab
  (except for an empty heading),
  and the line may end with an optional closing `#` sequence
  that conforms to CommonMark's rules, and trailing whitespace.

* After the plain-text content of a second-level ATX heading has been extracted
  (with leading and trailing whitespace
  and any valid trailing closing `#` sequence removed),
  the heading is identified as a recommended second-level section
  only when it matches one of the thirteen English names in the table
  in section 5.2 exactly, character by character (case-sensitive).
  Headings at any other level, Setext-style underlined headings,
  and second-level headings whose spelling does not match completely
  are all handled as ordinary body content,
  and do not trigger the order or duplicate checks for recommended sections.
