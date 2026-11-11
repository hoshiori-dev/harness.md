# Security Policy

## Reporting a vulnerability

Report vulnerabilities privately through GitHub's
[private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
on this repository. Please do not open a public issue. You can expect an
acknowledgement within seven days.

## Scope

- The plugin's shipped skills and agent, including every script, template,
  workflow, and command they tell an agent to run or to write into a target
  project.
- The validator: the Python script shipped in the `harness-md` skill and
  the TypeScript one this repository runs.
- Hub entries. They are designs that people paste into their own projects
  and hand to an agent, so an entry that leads an agent to weaken a
  project's protections, or that carries instructions hidden from a human
  reader, is a vulnerability.
- The repository's workflows, management scripts, and website.

Vulnerabilities in the clients themselves (Claude Code, Codex,
Antigravity), in the tools the skills configure (OpenSpec, Spec-Kit,
betterleaks), or in the Agent Plugins and Agent Skills specifications
belong to their maintainers.

## Supported versions

The latest release tag only.
