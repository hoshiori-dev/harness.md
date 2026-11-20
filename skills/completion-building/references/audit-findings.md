# Audit Findings

Read when classifying an audit finding of the Completion layer
or choosing its disposition.

## What to report

Report a finding when:

- the source of truth names a tool, a spec lifetime, an approval owner,
  or a way of recording approval that is absent: **missing**, **medium**
  (**high** when an approval gate for unattended or costly work is absent);
- the contract, the tool's files, or recent pull or merge requests
  contradict the source of truth, or a marker block disagrees with the contract:
  **contradictory**, **medium** (**high** when an approval gate is bypassed);
- the contract is missing: **missing**, **medium**;
  unreachable from the entrypoint: **invisible**, **medium**;
  states something the anchor document does not mention:
  **stale**, **low** (propose amending the anchor document or removing the clause);
- a check command the source of truth or the contract names does not exist:
  **stale**, **medium** (or fails: **contradictory**, **medium**);
- a document outside the specs restates requirements or acceptance:
  **duplicated**, **medium** (the spec is the source of truth;
  disposition: replace the copy with a pointer to the spec);
- a spec contradicts the code or another spec
  (read [spec-drift.md](spec-drift.md) when reporting one):
  **contradictory**, **medium**;
- the handoff location is not gitignored (**missing**, **medium**),
  or handoff notes are committed (**contradictory**, **medium**);
- the layer is too thick or too thin for the conditions:
  recorded approval for one person who reviews in conversation (**excessive**, **low**),
  or conversational approval where agents work unattended (**missing**, **high**).

## Form and disposition

Each finding takes the form of the finding classes rule above,
with the evidence as `path:line` and one proposed disposition:
fix the artifact, or amend the anchor document.
Which side of a spec-versus-code contradiction is right is the user's call:
class **contradictory**, both readings stated, no source of truth named,
and the ruling left to the user as the disposition.
