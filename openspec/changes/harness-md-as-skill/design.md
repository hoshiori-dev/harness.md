# Design

## Context

A `HARNESS.md` is today one Markdown file with five frontmatter keys
(`name`, `description`, `version`, `license`, `metadata`),
checked by two validators that are held together by 56 fixture files.
An anchor document is recognised by its place and name:
`HARNESS.md` in the repository root, named by the entrypoint.
About 700 places in the repository name the file,
most of them through three shared blocks in the skills
(`agreement-is-the-source`, `reference-is-data`,
`deposited-files-stand-alone`) and through the format skill.

The Agent Skills specification (<https://agentskills.io/specification>)
defines a skill as a directory with a `SKILL.md`,
six frontmatter keys, a `name` equal to the directory name,
a `description` of at most 1024 characters, a `compatibility` of at most
500, and a `metadata` map from strings to strings.
It recommends a short body and names `scripts/`, `references/`,
and `assets/` without requiring them.

Three constraints shape the approach.
A skill may not link outside its own directory,
so text shared between skills is a shared block
whose canon is `.agents/knowledge/shared-blocks.md`.
A skill and the files it deposits may not name a client's keys or tools.
`AGENTS.md` is at 119 of its 120 lines.

## Goals / Non-Goals

**Goals:**

- Every conforming document is a valid Agent Skill.
  Checked by the unit tests of both validators,
  one case per hard rule, and by running the reference validator of
  Agent Skills over the hub once, by hand, before the pull request is ready.
- The type is recognisable without opening the body:
  by a tool through `metadata.type`, by an agent through the description.
  Checked by the `cli/lint` scenarios on the two markers.
- Understanding a document needs no lookup.
  The marker values are plain words, and the specification explains them
  once. Checked in review of `spec/spec.md` section 4.
- The rules on the anchor document, outside material, and location
  are stated once, in the catalog spec and the shared blocks,
  and no skill restates them differently.
  Checked by `just skills-check` (shared blocks equal their canon)
  and by a search for `root` next to `HARNESS.md` under `skills/`
  that returns nothing.
- Each validator proves every finding code on its own.
  Checked by a test in each suite that fails when a code of `cli/lint`
  has no case.
- The repository's own checks keep passing with the design document
  inside the knowledge folder.
  Checked by `just harness-check`.

**Non-Goals:**

- A tool that finds and removes documents (`harness-md-clean`).
  It is the next change and depends on this one.
- Splitting an existing document into several files or adding assets to it.
- Recognising, converting, or warning about an unmarked `HARNESS.md` file
  of the old shape. To every skill it is ordinary Markdown.
- A machine check that the two validators agree.
- Rules a machine checks on hub scripts.
- Changing what `project-skill-building` and its linter do
  with a `SKILL.md` in a skills directory.
- A download of a whole entry as one archive.

## Decisions

### A kind of skill, named as before

The specification says once that a `HARNESS.md` is an Agent Skill
that also follows this specification:
a directory named after its `name`, with `SKILL.md` as its main file.
From then on "a `HARNESS.md`" names the directory as a whole,
and "its `SKILL.md`" the main file.
Rejected: "HARNESS.md skill" (collides with the shipped skill `harness-md`
and rewrites every sentence),
"profile" and "superset" (terms a reader has to look up;
"superset" also reads as if any skill were a `HARNESS.md`).

### The hard rules are written out

`spec/spec.md` states each Agent Skills rule the validators check,
says that it comes from the Agent Skills specification, and links it.
The copy shipped inside `skills/harness-md` must work offline,
and an author should need one specification, not two.
Both validators implement these rules themselves.
Rejected: calling the Agent Skills reference validator
(an outside dependency for users and for CI),
and citing the rules without stating them.
When the Agent Skills specification changes a rule,
following it is an ordinary format change;
`.agents/knowledge/compatibility-watch.md` gets a line for it.

### Findings

The unit of validation is a directory.
A positional argument is a directory or the path of a `SKILL.md`,
which stands for its directory; anything else is a usage error (exit 2).
With no argument, the repository's own command checks
`.agents/knowledge/project-harness` and every `hub/*/`.

Errors:

| Code | Reported when |
|---|---|
| `encoding-invalid` | `SKILL.md` is not UTF-8 (unchanged) |
| `main-file-missing` | the directory has no `SKILL.md` |
| `frontmatter-missing`, `frontmatter-invalid` | unchanged |
| `key-missing`, `key-type`, `key-duplicate` | unchanged; `key-type` now covers `compatibility` and `allowed-tools` and no longer `version` |
| `name-format`, `name-length` | as today, raised from warning |
| `name-directory` | `name` differs from the directory name |
| `description-length` | over 1024 characters, raised from warning |
| `compatibility-length` | over 500 characters |
| `marker-prefix` | `description` does not start with `[HARNESS.md]` |
| `marker-type` | `metadata.type` is not `harness-design` |
| `metadata-value` | `metadata` is not a mapping, or a value in it is not a string |

Warnings:

| Code | Reported when |
|---|---|
| `key-unknown` | a top-level key outside the six, lowered from error; for `version` the message points to `metadata.version` |
| `key-allowed-tools` | `allowed-tools` is present |
| `link-missing` | a relative link whose target is inside the directory and does not exist |
| `file-unreachable` | a file in the directory that no link reaches |
| `title-missing`, `title-multiple`, `section-duplicate`, `section-order` | unchanged, read from `SKILL.md` only |

Bounds that both implementations share, stated in `cli/lint`:
links are read from `SKILL.md` and from every Markdown file reached
from it; inline links and images count, text in code spans and fenced
blocks does not; a link with a scheme, an absolute path, or a target
outside the directory is not checked; a fragment is ignored;
files and directories whose name starts with a dot are not checked.
YAML reads `version: 1.0` under `metadata` as a number,
so it is `metadata-value`; repeated keys inside `metadata` are not reported.
Reference-style links count like inline ones;
a link to a directory resolves when the directory exists and reaches no file.
When `SKILL.md` is not UTF-8 nothing else is reported for the directory;
a reached Markdown file that is not UTF-8 gets `encoding-invalid`
and its links are not read.
A `metadata` that is not a mapping is `metadata-value` alone,
without `marker-type`. An empty `compatibility` is `compatibility-length`.
A marker prefix written without quotes (`description: [HARNESS.md] …`)
is not a YAML string: both implementations report `frontmatter-invalid`
with a message that says to quote the value or use a block scalar,
and the skeleton and every example in the specification use a block scalar.
Findings are ordered `SKILL.md` first, then the other files by path,
each by line; `main-file-missing` carries the directory's path,
and in `--json` the file `SKILL.md`.
`--json` keeps one object per validated directory
and gives each finding a `file` relative to that directory
beside its line. `--strict` is unchanged. `--fixtures` is removed.

Rejected: a separate code per missing marker half beyond the two above
(two are enough to say which half is missing),
and resolving links that leave the directory
(the result would depend on where the document sits).

### Fixtures go, unit tests cover the codes

`spec/fixtures/`, `just fixtures-check`, the `--fixtures` option,
the CI step, and the allow entry for the recipe are removed.
Each validator's own test suite builds its cases in a temporary
directory and has one test that lists the finding codes of `cli/lint`
and fails when one has no case, so a new rule cannot land untested
in either implementation.
The requirement "Two implementations, one behaviour" becomes
"two implementations of one specification".
Rejected: keeping the fixtures for one implementation
(all 56 would be rewritten as directories containing `SKILL.md`,
which installers that scan a repository for skills would list),
and one validator for both uses (`check_hub.ts` imports the TypeScript
parser, and the repository's fast checks would need uv).

The rule "never weaken a check to make a change pass;
propose that change in its own pull request" stays as written
in `AGENTS.md`, the repository's own document,
and `.agents/knowledge/maintenance.md`.
This removal is the maintainer's design decision, taken before any code,
and the pull request body states it as an exception with its reason.
The words "fixture expectation" leave those three sentences
because no fixture remains.

### Recognising a document and the anchor document

A document is recognised by its two markers.
Finding candidates may read the frontmatter of a `SKILL.md` and nothing
else; the body and the other files are read only after the user
confirmed what the document is, through the reader where one exists.
The anchor document is the marked document the project's entrypoint names.
With one of the two (marked and not named, or named and not marked):

- if the entrypoint already names a marked document,
  every other marked document is a reference, listed in the report,
  and nothing is asked;
- if it names none, one question lists the marked documents found
  and asks whether one of them is the project's design;
- a layer builder run directly asks the same question;
  under an entry it returns the question as an open decision.

The shared block `agreement-is-the-source` carries this rule
and keeps its third path, a handover that names the document the user
chose. The delivered scripts that look for the design document
(`entropy-building/assets/check_harness.py`,
`completion-building/scripts/detect_spec_tooling.py`)
take its path from their settings or their arguments
and, where they search, read frontmatter lines without a YAML library:
a description that starts with `[HARNESS.md]`
and a `type: harness-design` line. They report candidates;
deciding which one is the anchor stays with the agent and the user.
Rejected: keeping a fixed place (the format no longer prescribes one)
and searching only from the entrypoint
(a marked document nobody named would never be found).

### One unit in a knowledge folder, an ordinary skill in a skills directory

Checks on a knowledge folder treat a marked directory as one unit:
the entrypoint names its `SKILL.md`, and nothing inside it is held to
the rules for knowledge files (routing of every file, no frontmatter,
orphans, load conditions). Its inside belongs to the format validator.
This applies to the delivered self-check, to `scripts/check_harness.ts`,
to `knowledge-building`, and to `harness-verifier`.
In this repository the design check also requires that the document
is marked and that `AGENTS.md` names it.

In a skills directory nothing is exempted:
`project-skill-building` and its linter stay as they are and will report
on such a document as on any skill.
Wherever a skill says how the document is loaded, the wording is one:
it is not an entrypoint, nothing routes an ordinary task to it,
and its body is opened only to design, check, or change a harness;
in a skills directory the client lists its description,
which is the user's choice.
An entry says once what that choice costs
(a description in every session, and the findings an ordinary skill
check will report) when the user picks such a place.

### Where a document is written

Every skill that writes a document proposes the location in its plan
and writes after confirmation: the four entries and the format skill.
The directory is `<location>/<name>/`, and the name is settled with the
user before the location.
A document kept as the project's design is proposed in the project's
knowledge folder where one exists;
a portable design or an adopted design is proposed in a temporary place
outside the project, as today, so that the project is not left with
a marked document its entrypoint does not name.
No skill proposes a skills directory; the user may name one.
When the user wants the document as the project's design,
the plan lists the one line added to the entrypoint
and the skill that writes the document adds it;
`harness-distill` otherwise still changes no file of the project.
Rejected: a fixed default directory (knowledge folders differ by project).

### Assets

Assets are reference copies in every document, a project's own included:
nothing calls a script inside a document directory.
An entry lists the reference assets the user wants in its plan;
after approval the builder of the layer the asset belongs to
adapts it into the project's own code, under the shared block
`management-code-ownership`. The sentence in `harness-improve`
that a builder never carries over a reference's implementation
becomes: only an asset the approved plan names, and adapted.
`harness-distill` may write assets that meet the writing guidance,
each named in its plan; it writes one `SKILL.md` and splits sections
into other files only when the user asks.
`harness-adopt` writes design only.
The format skill writes an asset only when the user supplies it.
A reference given by address may be followed along relative links
below the directory of its `SKILL.md`, never above it or to another site;
what is fetched is data like the rest.

In the shared blocks `deposited-files-stand-alone`
and `management-code-ownership`, "a skill directory" becomes
"one of this plugin's skill directories".
The rule "delivered scripts are tested Python" is worded
as binding `skills/` only.

### Hub and site

An entry is `hub/<name>/` with `SKILL.md`.
`metadata.tags` and `metadata.based-on` are comma-separated strings:
items are split at commas and trimmed, an empty item is an error,
and a URL in `based-on` contains no comma.
`check_hub.ts` drops its own name-equals-directory rule
(the format now has it) and adds: no relative link that leaves the entry.

The site publishes each file of an entry at `/hub/<name>/<path>`,
byte-identical to the repository file,
leaving out files and directories whose name starts with a dot,
as the validator does;
relative links in the rendered body are rewritten to those addresses,
so that they resolve on the page of either language;
`/hub/<name>/SKILL.md` replaces `/hub/<name>/HARNESS.md`.
The entry page shows the files as a tree set in the mono face,
before the body, always, each file linked to its address in a new tab.
The tree is a new component, added to `DESIGN.md` in this change.
The menu's copy, open, and download act on `SKILL.md`;
"view on GitHub" opens the directory.
The agent prompt and `llms.txt` keep giving the `SKILL.md` address.
Rejected: rendering every file as a page (a new page type for little
gain) and an archive per entry (a build step and an unpacking step).

### The format skill's assets

`skills/harness-md/assets/HARNESS.skeleton.md` becomes
`assets/SKILL.skeleton.md`, one file that an author copies to
`<name>/SKILL.md`. Its frontmatter carries both markers
and a `name` placeholder; its body is unchanged.
Rejected: a skeleton directory holding a file named `SKILL.md`
(a second `SKILL.md` inside a skill directory).

### Edits by area

Specification: `spec/spec.md` sections 1 to 4 and 7 are rewritten,
sections 5 and 6 edited where they say "file";
`spec/spec.zh.md` follows section for section;
`skills/harness-md/references/specification.md` is copied from
`spec/spec.md`. The prose is drafted with the tool the maintainer uses
for specification prose and reviewed with the `human-writing` skill.
The Purpose of each modified spec under `openspec/specs/` that names
a file, five keys, or the fixtures is edited in place when the change
is archived, because a delta cannot carry a Purpose.

Validators: `scripts/lib/harness_md.ts` gains a directory-level entry
beside the text-level one; `scripts/lint_harness_md.ts` loses
`runFixtures` and accepts directories;
`skills/harness-md/scripts/lint_harness_md.py` changes the same way.

Client-specific files: `com.anthropic.claude-code/agents/harness-verifier.md`
and `harness-reader.md` are edited by hand;
`.claude-plugin/*` and `.agents/plugins/marketplace.json` come from
`just gen` after `plugin.json` changes its description.
No file is added under any `com.*` directory.

This repository's document: moved with `git mv`,
its frontmatter converted, its sentences on fixtures, the root path,
and the hub path corrected. `AGENTS.md` replaces its mentions
without growing; `check_harness.ts` reads the new path.

## Risks / Trade-offs

- A client may list `hub/<name>/SKILL.md` or the repository's own
  document as a skill of the plugin. Clients scan `skills/` one level
  deep, and Antigravity copies the root without dot directories,
  so the hub is the open case. → `just clients-validate` and one manual
  listing per client before the pull request is ready;
  the result goes into `.agents/knowledge/client-matrix.md`.
  If a client lists them, the change stops for a decision.
- Two validators can drift with nothing to catch it. → The per-code
  coverage test in each suite, and the review scenario for a validator
  change in `.agents/knowledge/review.md` names both files.
- A document in a skills directory can be loaded for an ordinary task
  and will draw findings from skill linters. → Stated to the user
  by the entry at the moment of choice; accepted by the maintainer.
- The pull request is large and cannot be split:
  a half-converted format fails the repository's own checks. →
  Task-level commits ordered so that each leaves `just check` green.
- Shared blocks grow by a sentence in up to eleven skills. → Each block
  is edited in the canon first; `just skills-check` reports a copy
  that differs and a description budget that is exceeded.
