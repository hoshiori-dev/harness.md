# Spec Delta

## RENAMED Requirements

- FROM: `### Requirement: Two implementations, one behaviour`
- TO: `### Requirement: Two implementations of one specification`

## MODIFIED Requirements

### Requirement: Two implementations of one specification
A tool that ships to users SHALL be a Python script with PEP 723 inline
metadata, run with `uv`, inside the skill that uses it; the repository's own
checks SHALL use a TypeScript implementation under `scripts/`. Both SHALL
implement the tool's spec under `openspec/specs/cli/`, and no check SHALL
compare the output of one with the other. Each SHALL have its own unit tests,
with at least one case for every finding code the tool's spec lists.

#### Scenario: Implementations diverge
- **WHEN** the two implementations report different codes for the same input
- **THEN** no command reports the difference; the implementation that departs from the tool's spec is corrected, and its unit tests gain the case

#### Scenario: Finding code without a test case
- **WHEN** a finding code the tool's spec lists has no case in the unit tests of one implementation
- **THEN** that implementation's test run fails naming the code

### Requirement: Script conduct
Every tool SHALL run without prompting, offer `--help` with a usage example,
write findings to stdout and diagnostics to stderr, offer JSON output, and
exit 0 on success, 1 on findings, and 2 on bad arguments.

#### Scenario: Path that is not a file
- **WHEN** a tool is given a path that does not exist, or a path of a kind its spec does not accept
- **THEN** it prints what is wrong on stderr and exits 2
