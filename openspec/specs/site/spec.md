# Site

## Purpose
The project website, built from `site/` with Astro and Pagefind and served by
GitHub Pages at `https://hoshiori-dev.github.io/harness.md/`. It presents the
format specification, the hub, and the plugin's documentation in English and
Chinese. Non-goals: accounts, server-side behaviour, analytics, hosting
designs that are not in this repository's hub.

## Requirements

### Requirement: Content comes from the repository
The specification pages SHALL be rendered from `spec/spec.md` and
`spec/spec.zh.md`, and the hub pages from `hub/*/HARNESS.md`, at build time;
the site SHALL hold no copy of either.

#### Scenario: Specification changes
- **WHEN** `spec/spec.md` changes and the site is rebuilt
- **THEN** the specification page shows the new text with no edit under `site/`

#### Scenario: Entry added to the hub
- **WHEN** a directory `hub/<name>/` with a valid `HARNESS.md` is added and the site is rebuilt
- **THEN** the entry appears in the hub index, in search, and has its own page

### Requirement: Two languages
Every page SHALL exist in English, served by default, and in Chinese under
`/zh/`, with a switch that leads to the same page in the other language. Hub
entries are English text shown unchanged in both.

#### Scenario: Switching language on an inner page
- **WHEN** a reader on the English specification page uses the language switch
- **THEN** the Chinese specification page opens, not the Chinese home page

### Requirement: Search-first home
The home page SHALL open with a search box over the hub's entries, followed by
a short introduction to `HARNESS.md` and links to the specification, the hub,
and the plugin documentation.

#### Scenario: Searching from the home page
- **WHEN** a reader types a word that occurs in a hub entry
- **THEN** matching entries are listed with their names and descriptions, and choosing one opens its page

### Requirement: Using a hub entry
A hub entry's page SHALL display the entry, and SHALL offer copying the raw
file to the clipboard and downloading it as `HARNESS.md`. The hub index SHALL
offer full-text search and filtering by tag.

#### Scenario: Download
- **WHEN** a reader chooses download on an entry page
- **THEN** the browser saves a file named `HARNESS.md` whose content is byte-identical to `hub/<name>/HARNESS.md`

### Requirement: Self-contained and accessible
The site SHALL make no request to another origin at runtime, SHALL work under
the `/harness.md/` base path, and SHALL be usable by keyboard and at phone
width.

#### Scenario: Built output
- **WHEN** `just site-build` completes
- **THEN** every internal link in the output resolves under the base path and no page references an external script, style sheet, or font
