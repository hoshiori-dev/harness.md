# Feedback Decisions

Read when running step 2 (decide mode) or auditing without an anchor document:
this file holds the layer's thickness table and all eleven decisions.

## Thickness

A thickness the handover already settled stands.
Otherwise recommend one and give as reasons the conditions that select it.

| Thickness | What this layer is |
|---|---|
| omitted | Nothing is built. The hand back says that nothing can be run to verify a change, and why, and lists what a human verifies. |
| light | The fast and the full check as two task-runner entries over the commands that already exist, named in the agent entrypoint with one sentence on what a human verifies. Nothing is started, driven, or reviewed; no knowledge file. |
| medium | The fast and full checks, a scoped test, recipes that start, check, stop, and smoke-test the system, and a verification knowledge file routed from the entrypoint, kept by convention. |
| thick | Medium, plus a browser- or device-driving tool with screenshots for an interface, a reviewer whose read-only tools the client restricts, the session-start check where agents run unattended, and the evidence in the pull or merge request text. Still nothing that blocks. |

Thicker: a costly wrong change, unattended agents, an interface people see,
years of maintenance, several agents working at once.
Thinner: a short life, a person watching every session,
a library whose tests are the system.
Recommend the first that applies:
omitted when nothing can be run (a documentation repository with no checks);
light when the project is discarded within weeks;
thick when a wrong change costs real work to undo or agents run unattended;
medium otherwise.

## The eleven decisions

Return every row of this list.
A row the thickness removes is settled as "not built at this thickness".

| Decision | Recommendation, what selects it, and why | Depends on |
|---|---|---|
| Command surface | Two entries in the project's task runner (`just` when there is none): a fast check an agent runs after every small change and a full check it runs before calling a task done. Always, whatever the conditions: an agent needs one name for "check this" that hooks and CI can share. | thickness |
| Scoped test | One command that runs one test file or directory. Always, once tests exist: a failure is reproduced in seconds, not by the whole suite. | command surface |
| Time budgets | Fast check 10 seconds; full check the measured duration, stated. A full check over 15 minutes also gets a middle tier (the tests of the files changed since the base branch, or a fixed sample), each tier's duration stated, because an agent cannot tell that an hour has passed. | command surface |
| Output | Nothing but a summary line on success; on failure only the failures, bounded, with the full log in a file whose path is printed, because everything printed stays in the agent's context. Read [output.md](output.md) when deciding or writing any check or test command or its flags. | command surface |
| Running the system | A library: none, the tests are the system. Anything else: one non-interactive command that starts it, a readiness check, and a stop command, because a passing unit test does not show the feature works. Read [running-the-system.md](running-the-system.md) when the project is not a library. | thickness, kind of system |
| Driving and observing | A web interface gets a browser-driving tool and screenshots, with what the tooling cannot see listed for a human, when a wrong change costs real work to undo or agents run unattended; otherwise it is optional. A service gets a smoke request and bounded log reading. Where the environment has no tool to drive the system (a mobile application without a simulator), say that the agent cannot drive it here. Same reference as above. | running the system |
| Test practice | A bug fix starts with a test or script that fails for the reported reason. Tests are deterministic: no network, no wall clock, seeded randomness; a flaky suite teaches the agent the wrong answer. Read [test-practice.md](test-practice.md) when a decision covers test granularity, fixtures, seed data, or golden files. | scoped test |
| Evidence | An agent reports the command it ran and the tail of its output, or the screenshot path, so a reader can judge without rerunning. When agents run unattended or a wrong change is costly, the evidence goes into the pull or merge request text. | thickness |
| Review pass | None for a throwaway project, said with the reason: a second look costs more than the project's mistakes. A read-only reviewer in a fresh context before a pull or merge request when a wrong change is costly or agents run unattended and the client supports subagents. Read [review-pass.md](review-pass.md) when the decisions include a review pass or a check no tool can decide. | thickness, evidence |
| Session-start check | Off. When agents run unattended across sessions, the fast check and the smoke test run before new work starts, so a broken baseline is found first. | command surface, running the system |
| Human verification | Always stated, at every thickness: what an agent cannot verify here (visual judgement, real devices, production behaviour, paid third-party calls), with the manual steps, and that it reports each as unverified. | driving and observing |
