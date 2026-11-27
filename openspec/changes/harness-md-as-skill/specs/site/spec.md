# Spec Delta

## ADDED Requirements

### Requirement: Every file of a hub entry is published
The site SHALL publish every file of a hub entry's directory at
`/hub/<name>/<path>`, where `<path>` is the file's path inside `hub/<name>/`,
byte-identical to the repository file and generated at build time.

#### Scenario: Agent fetches the main file
- **WHEN** an agent requests `/hub/<name>/SKILL.md`
- **THEN** it receives the entry's `SKILL.md`, byte-identical to `hub/<name>/SKILL.md`

#### Scenario: Agent fetches another file of an entry
- **WHEN** an entry holds `scripts/check.py` and an agent requests `/hub/<name>/scripts/check.py`
- **THEN** it receives that file, byte-identical to `hub/<name>/scripts/check.py`

#### Scenario: File added to an entry
- **WHEN** a file is added under `hub/<name>/` and the site is rebuilt
- **THEN** the file is served at `/hub/<name>/<path>` with no edit under `site/`

### Requirement: File structure on a hub entry page
A hub entry's page SHALL show the entry's file structure before the body:
a tree of every file of the entry's directory, each at its path inside the
directory and each linked to its published address, opening in a new tab.
The page SHALL show it for every entry, whatever the number of its files.

#### Scenario: File structure of an entry
- **WHEN** a reader opens the page of an entry that holds `SKILL.md`, `scripts/check.py`, and `references/notes.md`
- **THEN** the page lists the three files, the last two under their directories, above the entry's body, and each is a link to `/hub/<name>/<path>`

#### Scenario: Entry with one file
- **WHEN** a reader opens the page of an entry whose directory holds only `SKILL.md`
- **THEN** the file structure is shown above the body with the single file `SKILL.md`, linked to `/hub/<name>/SKILL.md`

#### Scenario: Following a file
- **WHEN** a reader chooses a file in the file structure
- **THEN** the file's published address opens in a new tab and the entry's page stays open

## MODIFIED Requirements

### Requirement: Content comes from the repository
The specification pages SHALL be rendered from `spec/spec.md` and
`spec/spec.zh.md`, and the hub pages from the entry directories `hub/*/`,
each with its `SKILL.md`, at build time;
the site SHALL hold no copy of either.

#### Scenario: Specification changes
- **WHEN** `spec/spec.md` changes and the site is rebuilt
- **THEN** the specification page shows the new text with no edit under `site/`

#### Scenario: Entry added to the hub
- **WHEN** a directory `hub/<name>/` with a valid `SKILL.md` is added and the site is rebuilt
- **THEN** the entry appears in the hub index, in search, and has its own page

### Requirement: Using a hub entry
A hub entry's page SHALL display the entry and SHALL offer, in one menu beside
the control that copies the agent prompt, copying the entry's raw `SKILL.md`,
opening it in a new tab, downloading it as `SKILL.md`, and viewing the entry's
directory on GitHub.
Each tag on an entry's page SHALL link to the hub index narrowed to that tag.

#### Scenario: Copying the file
- **WHEN** a reader chooses the menu's copy action on an entry's page
- **THEN** the clipboard holds the entry's `SKILL.md` exactly as it is in the repository

#### Scenario: Download
- **WHEN** a reader chooses download on an entry page
- **THEN** the browser saves a file named `SKILL.md` whose content is byte-identical to `hub/<name>/SKILL.md`

#### Scenario: Viewing on GitHub
- **WHEN** a reader chooses the menu's GitHub action on an entry's page
- **THEN** GitHub opens at the directory `hub/<name>/`, not at one file in it

### Requirement: Markdown version of every document
Every document page SHALL have a Markdown version generated at build time: the
specification at `/spec.md`, byte-identical to the repository file; a plugin
documentation page `/plugin/<page>/` at `/plugin/<page>.md`; and a hub entry
at its raw `SKILL.md`. Each such page SHALL link to its Markdown version in
its head and SHALL offer, in one menu, copying it and opening it in a new tab.
The home page and the hub index are navigation and SHALL have neither.

#### Scenario: Agent fetches a page
- **WHEN** an agent requests `/spec.md`
- **THEN** it receives the specification as Markdown, byte-identical to `spec/spec.md`

#### Scenario: Copying a document
- **WHEN** a reader chooses the copy action on the specification or a plugin documentation page
- **THEN** the clipboard holds exactly the text of that page's Markdown version, and the control confirms the copy

#### Scenario: Home page
- **WHEN** a reader opens the home page or the hub index
- **THEN** the page offers no copy-as-Markdown control and no Markdown version exists for it

#### Scenario: Hub entry page
- **WHEN** a reader opens a hub entry's page
- **THEN** the Markdown version linked in the page's head is `/hub/<name>/SKILL.md`

### Requirement: Index for agents
The site SHALL publish `/llms.txt`, generated at build time: a title, a
summary of what HARNESS.md is, and links, as absolute URLs, to the Markdown
version of the specification, every hub entry's `SKILL.md`, and every plugin
documentation page, with translations listed last. Every page SHALL link to it.

#### Scenario: Entry added to the hub
- **WHEN** an entry is added under `hub/` and the site is rebuilt
- **THEN** `/llms.txt` lists the entry with its description and the URL of its `SKILL.md`

#### Scenario: Agent starts from the index
- **WHEN** an agent fetches `/llms.txt` and follows any link in it
- **THEN** it receives Markdown, not an HTML page

#### Scenario: Entry with several files
- **WHEN** an entry holds files beside its `SKILL.md` and the site is rebuilt
- **THEN** `/llms.txt` lists the entry once, with the URL of its `SKILL.md`, and lists none of its other files

### Requirement: Prompt for an agent on a hub entry
A hub entry's page SHALL offer a prompt, in the page's language, that tells a
coding agent to read the entry's `SKILL.md` at its published URL and build
from it after showing a plan, ending with a place for the reader's own
requirements. Copying SHALL include what the reader typed there.

#### Scenario: Reader describes the project first
- **WHEN** a reader types a description of their project under the prompt and chooses copy
- **THEN** the clipboard holds the prompt followed by that description

#### Scenario: Nothing typed
- **WHEN** a reader chooses copy without typing anything
- **THEN** the clipboard holds the prompt ending at the line that opens the reader's part, so they can continue after pasting

#### Scenario: Address in the prompt
- **WHEN** a reader copies the prompt on the page of the entry `<name>`
- **THEN** the address the prompt gives is the absolute URL of `/hub/<name>/SKILL.md`
