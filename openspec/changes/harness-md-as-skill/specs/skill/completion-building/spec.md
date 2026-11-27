# Spec Delta

## MODIFIED Requirements

### Requirement: Script: detect_spec_tooling.py
The bundled script SHALL be a read-only inventory of a checkout: `--root <dir>` (default `.`), `--max-candidates <n>` (default 40), `--full`, and `--help` with an example. Stdout SHALL be one JSON object listing the spec tools found, each type-marked `HARNESS.md` found, entrypoint lines pointing at spec artifacts, and requirement-restating documents outside tool directories and skill trees; a summary goes to stderr; exit codes are 0, 1 (partial or failed inspection), and 2 (bad arguments).

#### Scenario: Repository with OpenSpec
- **WHEN** the script runs with `--root` on a checkout holding `openspec/specs` and `openspec/changes`
- **THEN** stdout JSON lists a tool entry for OpenSpec with its spec and change counts and owned paths, and the exit code is 0

#### Scenario: Design document present
- **WHEN** the checkout holds, in its knowledge folder, a type-marked `HARNESS.md` whose files are full of requirement words
- **THEN** the JSON reports its directory as a design document, recognised from the frontmatter of its `SKILL.md` alone, and lists no file of that directory among the requirement-restating candidates

#### Scenario: Several marked documents
- **WHEN** the checkout holds two type-marked directories in different places
- **THEN** the JSON lists both directories and marks neither as the project's anchor document

#### Scenario: Unmarked file of the old shape
- **WHEN** the checkout holds a root file named `HARNESS.md` that carries no type marker and is full of requirement words
- **THEN** the JSON reports no design document for it and treats the file as any other Markdown document when it lists requirement-restating candidates

#### Scenario: Bad root
- **WHEN** `--root` names a path that is not a directory
- **THEN** stderr says what is wrong and how to fix it, nothing is written to stdout, and the exit code is 2

#### Scenario: Unreadable subdirectory
- **WHEN** a directory under `--root` cannot be read
- **THEN** stderr names that path, any JSON on stdout is marked partial, and the exit code is 1

#### Scenario: Repeated run
- **WHEN** the script runs twice on an unchanged checkout
- **THEN** both outputs are identical and the checkout holds no new file
