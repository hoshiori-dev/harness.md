---
name: "{{NAME}}"  # CONFIGURE: lowercase letters, digits, single hyphens; at most 64 characters.
description: "{{DESCRIPTION}}"  # CONFIGURE: what this design is and what kind of project it suits; at most 1024 characters.
---

# {{TITLE}} <!-- # CONFIGURE: free text; usually the project or design name. -->

<!-- Introduction, in ordinary paragraphs, with no heading of its own. Who the harness serves, what it is meant to achieve, what it deliberately leaves unmanaged, and which decisions always stay with a human. -->

## Context

<!-- For a complete harness. The facts and conditions the design has to fit: the cost of a wrong change, how long the project will be maintained, who relies on its conventions, how unattended agents are, the code-hosting platform, the clients and models it targets. -->

## Invariants

<!-- When needed. The constraints every task must respect, and the rules that may never be broken. Delete the section when there are none. -->

## Style

<!-- When needed. The code structure and engineering style the project prefers so that agents can understand, change, and verify the code. Formatting and naming rules stay in the formatter and linter configuration. -->

## File Structure

<!-- When needed. The layout this design expects: which directories and key files have to exist and what each is for. -->

## Environment

<!-- For a complete harness. Where the agent runs, which tools it can call, and what it can reach. -->

## Knowledge

<!-- For a complete harness. What the agent consults about the project, and when it reads each. -->

## Feedback

<!-- For a complete harness. What the agent runs and observes to check its own changes. -->

## Gates

<!-- For a complete harness. Which deterministic checks stop defects, and where they run. -->

## Authority

<!-- For a complete harness. What the agent may do on its own and what needs a human; how it commits, branches, merges, and releases. -->

## Completion

<!-- When needed. How the goal is agreed before work starts, and what counts as done. -->

## Entropy

<!-- When needed. How drift between the harness, the documentation, and the code is found and repaired. -->

## Open Questions

<!-- When needed. What is still undecided. -->

## References

<!-- When needed. The outside material this design drew on. Material an agent reads while working belongs in Knowledge. -->
