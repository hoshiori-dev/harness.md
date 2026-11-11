---
name: "{{NAME}}"  # CONFIGURE: lowercase letters, digits, single hyphens; at most 64 characters.
description: "{{DESCRIPTION}}"  # CONFIGURE: what this design is and what kind of project it suits; at most 1024 characters.
version: alpha
---

# {{TITLE}} <!-- # CONFIGURE: free text; usually the project or design name. -->

## Overview

<!-- Required. Who the harness serves, what it is meant to achieve, what it does not police, and what always stays with a human. -->

## Context

<!-- Required. The given conditions the design has to fit: the cost of a wrong change, how long the project will be maintained, who relies on its conventions, how unattended agents are, the code-hosting platform, the clients and models it targets. -->

## Invariants

<!-- Optional. The cross-layer rules every task must follow. Delete the section when there are none. -->

## Style

<!-- Optional. What the code itself should look like so that agents can work in it. Formatting and naming rules stay in the formatter and linter configuration. -->

## File Structure

<!-- Optional. The directory layout this design requires: which directories and files have to exist and what each holds. -->

## Environment

<!-- Required. Where the agent runs, which tools it holds, and what it can reach. -->

## Knowledge

<!-- Required. How the agent learns about the project, and what it reads when. -->

## Feedback

<!-- Required. What the agent can run and observe to verify its own work. -->

## Gates

<!-- Required. Which deterministic checks stop defects. -->

## Authority

<!-- Required. What the agent may do directly and what needs a human; how it commits, branches, merges, and releases. -->

## Completion

<!-- Optional. How the goal is agreed before work starts, and what counts as done. -->

## Entropy

<!-- Optional. How the harness is kept consistent with the code. -->

## Open Questions

<!-- Optional. What is still undecided. -->

## References

<!-- Optional. The outside material this design drew on. Material an agent reads while working belongs in Knowledge. -->
