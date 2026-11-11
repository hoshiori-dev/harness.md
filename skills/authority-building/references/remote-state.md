# Remote State with Parallel Agents

Read when the Context or the user states that more than one agent works on
the repository at the same time (parallel worktrees, several sessions, a
fleet of agents).

Worktrees isolate files, not platform objects. Two agents commenting on
one issue leave a thread nobody can attribute; two writing labels on one
request overwrite each other; two pushing one branch lose commits.

## Where the rules live

The three remote rules (each agent owns its remote branch; platform writes
go through one coordinator; each such write is pre-authorised) are stated
once in the Authority section and deposited once, in the authority policy.
The platform knowledge file restates none of them. It carries only the
platform mechanics, in its "Parallel agents" section:

- the authority policy's path, as the source of the remote rules;
- the coordinator role (a named human, or the one agent designated as
  coordinator) that makes every label, comment, assignee, state, ready, and
  merge write;
- the per-agent branch pattern, for example `agent/<agent>/<n>-<slug>`.

Write it as one short paragraph and nothing more: no rule sentence about
branch ownership or pre-authorisation, no copy of the policy's wording.


## Cases

| Situation | Write |
|---|---|
| One agent at a time | delete the "Parallel agents" section; no coordinator or per-agent branch rule anywhere |
| Parallel, the policy holds the rules | the paragraph above, citing the policy by its path |
| Parallel, the section calls for no policy file | the rules go into the entrypoint's always-on block; the paragraph above cites the entrypoint |
| Parallel, an existing policy lacks the remote rules | add them to the policy when the section states them; otherwise report the gap as a finding and add them to no file |
