# From Symptom to Layer

Read when the user reported a symptom: something agents keep doing, or
keep failing to do. A symptom is where the harness shows; the cause is
usually one layer earlier than it looks. For each symptom, check the
causes in order and stop at the first the evidence supports.

| Symptom | Check, in order |
| --- | --- |
| Agents keep missing a convention | Is it written anywhere an agent loads (Knowledge: no route, or a route with no condition)? Is the entrypoint over budget, so the rule is buried? Could a formatter, linter, or check enforce it (then it belongs in Gates, not prose)? Does another file contradict it? |
| Agents follow an outdated command or path | Where is the stale copy, and how many copies exist (Entropy: no sync rule, no self-check)? Is the command documented instead of pointed to (Knowledge)? |
| A check gets bypassed | How long does it take (Gates: too slow before commit)? Does its failure message say how to fix the problem? Do the permission files allow the bypass (`--no-verify`) (Authority)? Does it fail for reasons unrelated to the change? |
| CI goes green with a job skipped | Is there one aggregate check that fails when a job did not run (Gates)? Is that check required on the platform (Authority)? |
| Permission prompts pile up | Are common safe commands missing from the allow list (Authority)? Are there "ask" entries? Is there no isolated environment, so nothing can be allowed widely (Environment)? |
| An agent did something outward nobody approved (pushed, commented, deleted) | Does a permission entry allow it (Authority)? Is the rule only prose? Does the token permit it when the policy forbids it (Environment)? |
| Agents report work as done that does not work | Can the agent run the thing and see the result (Feedback)? Is "done" defined beyond "tests pass" (Completion)? Is the scoped test command fast enough to be used? |
| Agents never stop, or over-build | Are non-goals agreed before work (Completion)? Is there an acceptance the agent can observe? |
| Agents stop and ask about everything | Is reversible local work stated as never needing a question (Authority)? Is there a way to queue a decision and continue? |
| Commands hang | Pager, prompt, or watch mode not disabled (Environment)? |
| A skill never loads, or loads on the wrong task | Is a critical procedure left to description matching instead of an entrypoint route (Knowledge)? |
| Two agents overwrite each other | Does the design say several agents write at once? If so: worktrees, branch ownership, one coordinator for platform writes (Authority, Environment) |
| The harness keeps drifting after each repair | No trigger for sync in both directions, no self-check in CI, no periodic clean-up (Entropy) |

## Choosing the fix

Propose the cheapest mechanism that makes the failure impossible or
visible, in this order of preference:

1. a type, schema, or assertion in the code;
2. a deterministic check (formatter, linter, hook, CI);
3. a narrower environment or permission;
4. an always-on rule in the entrypoint;
5. a routed knowledge file or project skill.

Restating a rule more forcefully is not on the list. A rule an agent
missed three times is in the wrong place, not in the wrong tone.

## Writing it up

For each symptom: the symptom in the user's words; where it was found or
reproduced; the cause, as findings from the drift or fitness pass; the
layer that owns the fix; and the sentence of the design to add or change.
A recurring failure is fixed in the design first and built afterwards, so
that the fix outlives the session that made it.
