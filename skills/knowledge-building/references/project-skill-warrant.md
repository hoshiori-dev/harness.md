# Project Skill Warrant and Handoff

Read when a candidate is a procedure, when the user asks for a skill, when
deciding whether an existing skill needs a routing row, or when writing the
handoff for a skill the section names.

## The bar

A procedure becomes a project skill only when it is all of:

- **recurring**: it will run again, in future sessions, by agents that did
  not learn it;
- **non-obvious**: an agent without the skill gets it wrong or has to ask;
- at least one of **fragile** (a small mistake costs), **order-sensitive**
  (steps must run in sequence), or **branchy** (the right action depends on
  conditions).

The section states which condition each candidate passed or failed.

## Cheaper carriers

| Candidate | Carrier | Failed condition |
|---|---|---|
| "Run the type checker before pushing" | entrypoint line (Always, or a Validation recipe) | non-obvious: one command |
| Stable facts, no procedure (versions, limits, domain rules) | knowledge file | not a procedure |
| A constraint on one function or a local workaround | type or code comment | not recurring across the project |
| A problem that happened once ("an agent misconfigured the cache") | knowledge line or code comment now; skill only if it recurs | recurring: one incident is an anecdote |
| A procedure still changing | nothing yet | it changes before it runs again |

Never make: a skill wrapping one command the Validation table already
names; a "general guidelines" skill (no trigger can fire precisely); one
procedure split across two skills.

## Explicit routing

Description matching is probabilistic. A skill whose omission causes harm
(a check before every request is published, a migration gate) is
process-critical and gets a routing row: "When publishing a pull request,
load the `pr-compliance` skill." A skill that only helps (formatting
changelog entries) gets no row: description matching suffices and the row
would cost every session. Test: if the honest answer to question 1 of the
four questions is "we hope the description matches" and a miss causes harm,
route it.

## Handoff definition

Pass one per skill the section names to the skill that writes project
skills, described by that role. The handoff names no skill: not the writer,
and not a name for the new skill (the writer chooses it).

```markdown
Handoff to the skill that writes project skills

Procedure: <what the procedure accomplishes, one sentence>
Warrant: recurring because <evidence>; non-obvious because <evidence>;
<fragile | order-sensitive | branchy> because <evidence>
Trigger situations: <direct requests>; <indirect phrasings>; <the event or
agent behaviour that should load it>
Not for: <neighbouring tasks that must not load it>
Source material: <paths, runbooks, incidents>
Owned scripts: <operations longer than two lines, to live under the
skill's scripts/>, or none
Location: <the skills folder the section names>
Process-critical: <yes: report the chosen name so the routing row
"When <situation>, load the <name> skill" can be added | no>
Covered by: <the sentence of the Knowledge section that names it>
```

When the skill is not written before this layer hands back, list its
routing row as a follow-up waiting for the skill's name.
