# Audit Findings

Read when classifying an audit finding of the Environment layer
or choosing its disposition.

## Class and severity

- an exposure that contradicts a boundary in the anchor document:
  **contradictory**, **high**;
  an exposure nothing accounts for against the project's conditions:
  **missing**, **high** (missing isolation or boundary);
  disposition: cut it, or keep it only by the owner's explicit decision;
- a boundary the anchor document or the conditions call for that the project lacks
  (no firewall, a writable hard read-only file,
  a base the session is not running in): **missing**, **high**;
- a client sandbox setting that differs from the anchor document or agreed decision:
  **contradictory**, **medium**;
- a registered tool nothing accounts for:
  **contradictory**, **medium** when an anchor document lists the tools,
  otherwise **excessive**, **medium** (widens reach and costs context with no stated need);
  a tool the anchor document states that is absent from the environment: **stale**, **medium**;
- missing non-interactive variables, or a recipe that watches or prompts: **missing**, **medium**;
- a knowledge file that disagrees with the anchor document:
  **contradictory**, **medium**;
  one that no route reaches: **invisible**, **medium**;
- a restriction whose reason is gone (an allowlist or read-only mounts
  for an agent that is no longer unattended): **excessive**, **low**;
- wording that is stale but changes no behaviour: **stale**, **low**.

## Disposition

Propose one disposition per finding:
fix the artifact when the source of truth still states what the project wants;
amend the recorded decision when the project's practice
is the better answer or nothing ever decided the point.
