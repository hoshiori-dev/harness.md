# Spec Delta

## MODIFIED Requirements

### Requirement: Triggering
The skill SHALL load when a `HARNESS.md` is at hand or about to be created:
a directory whose `SKILL.md` carries the type marker, or that `SKILL.md`,
wherever it sits, a knowledge folder included.
It SHALL also load when the question is about the format, a section's content,
or a validator finding. It SHALL NOT load for work on entrypoints,
knowledge files, the harness itself, or a `SKILL.md` without the type marker.

#### Scenario: File to be checked
- **WHEN** the user says "I downloaded a HARNESS.md from a hub, it's a folder with a SKILL.md and two scripts, can you check it's well-formed before I use it?"
- **THEN** the skill loads

#### Scenario: Question about placement
- **WHEN** the user asks "in HARNESS.md, do the MCP servers we give the agent go under Environment or Authority?"
- **THEN** the skill loads

#### Scenario: Validator finding
- **WHEN** the user pastes `SKILL.md:2: error[name-directory]` and asks what to do
- **THEN** the skill loads

#### Scenario: Document in a knowledge folder
- **WHEN** the user says "the description of `.agents/knowledge/project-harness/SKILL.md` starts with [HARNESS.md]; rewrite its Gates section for the new nightly job"
- **THEN** the skill loads

#### Scenario: Entrypoint work
- **WHEN** the user asks "our AGENTS.md is 300 lines, help me trim it"
- **THEN** the skill does not load

#### Scenario: Building from a file
- **WHEN** the user says "here is a HARNESS.md, set the project up accordingly"
- **THEN** the skill does not load as the main procedure; it says that the entry which gives a project its harness takes the document as a reference

#### Scenario: Another design format
- **WHEN** the user asks for help writing a DESIGN.md for a website's visual design
- **THEN** the skill does not load

#### Scenario: Ordinary skill
- **WHEN** the user says "the SKILL.md of our deploy skill never triggers, help me fix its description", and that `SKILL.md` carries neither half of the type marker
- **THEN** the skill does not load

### Requirement: Outcomes
Given a writing or revising task, the skill SHALL produce a directory
that the validator reports no error on
and whose design can be built from with nothing outside that directory.
Given a validation task, it SHALL run the validator on the directory,
explain each finding, and fix errors.
It SHALL NOT present a validator pass as a review of the design.

#### Scenario: Repairing a malformed file
- **WHEN** the skill is given a directory `team-harness` whose `SKILL.md` carries both halves of the type marker and has a list under `tags:` at the top level, `version: v2` at the top level, a `## 背景` heading, no first-level heading, and no Feedback section
- **THEN** the result holds `tags` under `metadata` as one comma-separated string and the version at `metadata.version`, restores the `## Context` heading while keeping the Chinese prose, adds a title, asks whether the document is meant to describe the whole harness before adding a Feedback section, and the validator exits 0 with no warning

#### Scenario: Writing one section
- **WHEN** the user asks for a Gates section for a described project
- **THEN** the section names each check, its tool, and where it runs, gives its time budget or lists the budget under Open Questions when the request gave none, gives reasons, and says what is deliberately not gated

#### Scenario: uv is not available
- **WHEN** the validator script cannot run because `uv` is missing
- **THEN** the skill checks the format rules by reading and says plainly that the validator did not run

#### Scenario: Metadata is left alone
- **WHEN** the skill revises a document whose `metadata` holds `type`, `version`, and keys it does not know, every value a string
- **THEN** the keys it does not know are unchanged in the result, `type` is unchanged, and `version` changes only when the request asked for it

#### Scenario: Metadata value that is not a string
- **WHEN** the validator reports `metadata-value` for a list under `metadata.tags`, a list under `metadata.based-on`, and a list under `metadata.reviewers`, and the user asks for the errors to be fixed
- **THEN** the skill turns `tags` and `based-on` into comma-separated strings, and asks the user what string `reviewers` should become before changing it

#### Scenario: Path of the main file
- **WHEN** the user asks for a check and gives the path of a document's `SKILL.md`
- **THEN** the skill validates the directory that holds it and reports findings in its other files as well

#### Scenario: Warnings on top-level keys
- **WHEN** the validator reports `key-unknown` for a top-level `status` and `key-allowed-tools`, and nothing else
- **THEN** the skill explains both as warnings, proposes moving `status` under `metadata` as a string and removing `allowed-tools`, makes each change unless the user wants the key kept, and does not call the document invalid

#### Scenario: Sections in another file
- **WHEN** a document has `## Gates` in its `SKILL.md` and a file linked from it that also has a `## Gates` heading
- **THEN** the skill does not report a repeated section, and says when asked that the rules on repeated and misordered sections read `SKILL.md` only

### Requirement: A file's use is not assumed
The skill SHALL NOT infer a `HARNESS.md`'s use from where it sits.
It SHALL recognise a document and a project's anchor document
as the catalog rule "The anchor document" states,
and SHALL treat any other document as a summary or a reference.
It SHALL settle where it writes a document
as the catalog rule "Where a document is written" states,
and SHALL NOT run an asset of any document in place.
It SHALL treat an unmarked `HARNESS.md` file as ordinary Markdown.

#### Scenario: Asked where to save a new file
- **WHEN** the user asks the skill to write a `HARNESS.md` summarising their gates and names no location
- **THEN** the skill settles the document's name with the user, proposes a temporary place outside the project, writes `<location>/<name>/SKILL.md` only after the user confirmed or named another place, and reports the full path

#### Scenario: Downloaded file in a working directory
- **WHEN** the user asks whether their permission file "violates" a `HARNESS.md` they downloaded yesterday
- **THEN** the skill says the document is a reference with no authority over the project unless the project adopted it, and compares the two as designs

#### Scenario: Document to be kept as the project's design
- **WHEN** the user dictates a design, says it is to be the project's own design document, and the project has a knowledge folder
- **THEN** the skill proposes a directory in that knowledge folder together with the one line to add to the entrypoint, and writes the document and adds the line only after the user confirmed

#### Scenario: User names a skills directory
- **WHEN** the user answers the proposed location with "put it under `.agents/skills`"
- **THEN** the skill writes it there, having said once that the client will list the document's description in every session and that an ordinary skill check will report on it

#### Scenario: Marked document the entrypoint does not name
- **WHEN** the user asks whether a script "follows our harness design", the project holds one marked document, and its entrypoint names no marked document
- **THEN** the skill asks whether that document is the project's design, and treats it as a reference until the user answers

#### Scenario: Asked to run a document's script
- **WHEN** a downloaded `HARNESS.md` sits in the project's skills directory with `scripts/setup.sh`, and the user says "run its setup script"
- **THEN** the skill does not run the script, says that the place does not change the document's standing and that its assets are reference copies, and names the entry that gives a project its harness as the way to adapt one under an approved plan

#### Scenario: Unmarked file of the old shape
- **WHEN** the skill works in a repository whose root holds a `HARNESS.md` file with no type marker
- **THEN** the skill treats the file as ordinary Markdown: it does not present it as a design document, does not ask whether the project keeps it, and does not convert it

## ADDED Requirements

### Requirement: Type marker
The skill SHALL keep both halves of the type marker in every document it
writes or revises, and SHALL explain a missing half as an error
and add it when the user gave the directory as a `HARNESS.md`.
It SHALL NOT add the marker to a `SKILL.md` that carries neither half
before the user confirmed that the directory is meant to be a harness design.

#### Scenario: One half missing
- **WHEN** the user asks for a check of a `HARNESS.md` whose description starts with `[HARNESS.md]` and whose `metadata` has no `type`
- **THEN** the skill explains `marker-type` as an error, says that both halves are required, adds the missing half, and the validator reports no marker finding afterwards

#### Scenario: Neither half present
- **WHEN** the user points at a directory whose `SKILL.md` carries neither half and asks "is this a valid HARNESS.md?"
- **THEN** the skill says the directory is not recognised as a `HARNESS.md` and why, and changes nothing until the user says whether it is meant to be a harness design or an ordinary skill

#### Scenario: Description rewritten
- **WHEN** the user asks for a document's description to be rewritten
- **THEN** the new description still starts with `[HARNESS.md]`

### Requirement: Name and directory
The skill SHALL keep a document's `name` valid under the format's rules
and equal to the name of its directory.
When the two differ, it SHALL ask which of them to change
before it renames anything.
When a directory has no `SKILL.md`,
it SHALL say that the directory is not a `HARNESS.md` and SHALL NOT create one
from the other files it finds there.

#### Scenario: Name differs from the directory
- **WHEN** the validator reports `name-directory` for a directory `payments` whose `name` is `payments-harness`
- **THEN** the skill explains the error and asks whether to rename the directory or change `name`, and renames nothing before the answer

#### Scenario: Name with characters the format refuses
- **WHEN** the user dictates a design and asks for it to be named `Team_Harness`
- **THEN** the skill says which rule the name breaks, proposes a conforming name, and writes the directory and `name` with the name the user agreed to

#### Scenario: Directory without a main file
- **WHEN** the user asks for a check of a directory that holds a `HARNESS.md` file and no `SKILL.md`
- **THEN** the skill reports that the directory is not a `HARNESS.md`, does not rename or convert the file, and does not go on to judge the file's content against the format

### Requirement: Links and reachability
The skill SHALL treat the whole directory as the document.
Every file it adds SHALL be reached by a link from `SKILL.md`
or from a Markdown file reached from it.
It SHALL explain a relative link that does not resolve
and a file no link reaches as warnings and propose a repair for each,
and SHALL NOT delete a file without the user's decision.

#### Scenario: Link that does not resolve
- **WHEN** the validator reports `link-missing` for a link in `SKILL.md` to `references/gates.md`, and the directory holds `references/gate.md`
- **THEN** the skill explains the warning, proposes the existing file as the target, and corrects the link unless the user says otherwise

#### Scenario: File no link reaches
- **WHEN** the validator reports `file-unreachable` for `assets/ci.yml`
- **THEN** the skill asks whether to link the file from the section it belongs to or to remove it, and deletes nothing before the answer

#### Scenario: Section moved to another file
- **WHEN** the user asks for the Authority section to be moved into its own file
- **THEN** the result links the new file from `SKILL.md`, and the validator reports neither `link-missing` nor `file-unreachable`

#### Scenario: Link that leaves the directory
- **WHEN** a document's `SKILL.md` links `../../docs/release.md` and the validator reports nothing about it
- **THEN** the skill does not report the link as checked: asked about it, it says that the validator checks no link that leaves the directory

### Requirement: Writing guidance the validator does not check
When it writes a description, the skill SHALL say after the marker
what the design is and what kind of project it suits,
and SHALL NOT word it as a trigger or shorten a document to a length budget.
It SHALL write an asset into a document only when the user supplies it,
and SHALL hold a supplied asset to the specification's guidance for assets.
It SHALL NOT report either kind of guidance as a validator finding.

#### Scenario: Description of a new document
- **WHEN** the user dictates a design for a two-person data pipeline team and asks for the document
- **THEN** the description names the design and the kind of project it suits, and holds no "use when" list of trigger phrases

#### Scenario: Asked to shorten a long body
- **WHEN** the user says "a skill linter says this SKILL.md is too long, cut it to 500 lines" about a marked document
- **THEN** the skill says that the format sets no length limit on the body and why the linter reports it, and shortens nothing unless the user still asks for it

#### Scenario: Asset supplied by the user
- **WHEN** the user hands over a pre-commit configuration that contains their repository's paths and asks for it to be included in the document
- **THEN** the skill writes it into the directory, links it from `SKILL.md`, names the project-specific parts, and either generalises them with the user's agreement or states in `SKILL.md` what to replace and how

#### Scenario: Asset not supplied
- **WHEN** the user asks for a Gates section and supplies no file
- **THEN** the skill writes prose only: no script, template, or configuration file is added to the directory

#### Scenario: Asked to invent an asset
- **WHEN** the user says "add a CI workflow file to the document as well" and supplies none
- **THEN** the skill writes no such file, and says that it includes an asset the user supplies and that the entry which writes a project's harness down can write assets from the project

### Requirement: New documents start from the skeleton
The skill SHALL start a new document from its skeleton.
The result SHALL carry both halves of the type marker and the agreed `name`,
and SHALL hold no placeholder and no comment of the skeleton.

#### Scenario: New document from a dictated design
- **WHEN** the user dictates a design, agrees to the name `data-pipeline-harness` and to a location
- **THEN** the result is a directory `data-pipeline-harness` whose `SKILL.md` has that `name`, a description starting with `[HARNESS.md]`, and `metadata.type` equal to `harness-design`, holds no placeholder or skeleton comment, and the validator reports no finding on it
