# The Project's Conditions

Read before settling the conditions in step 4,
or when the user asks why a question is being asked.
The conditions are what the harness cannot change and has to fit.
Six of them set how much each layer does; none of them is a project type.

## How to settle each one

1. Look for the evidence listed below.
   When the repository states the value, record it as **observed**,
   with where it was seen. Show it; do not ask.
2. When the evidence only suggests a value, record it as an **inference**
   and show it as one: "one maintainer, inferred from a single author
   across the history; correct me if that is wrong."
   It is not a question and it is not a settled fact:
   the user corrects it when the round is shown, or lets it stand.
3. Ask everything that remains in the same round.
   Each question carries its typical answers, the recommended one first,
   and which layers each answer makes thicker or thinner.

Record every condition for the plan with how it was settled:
observed (with the evidence), inferred and not corrected, or answered.

## The conditions

### What a wrong change costs

What a bad change costs: nothing beyond a revert, a day of cleanup,
or lost data, an outage, a security incident.

- Evidence: rarely observable. A deploy pipeline, migrations,
  production configuration, or payment and user-data code suggest
  a high cost; show it as an inference.
- Typical answers: "nothing, we revert"; "a day of cleanup, no data lost";
  "data loss, an outage, or a security incident".
- Pushes: Gates, Environment, and Feedback thicker as the cost rises.
  A higher cost means machine checks and isolation instead of conventions.
  A low cost lets Gates stay at a secret scan and a formatter.
- One part of a repository can cost more than the rest
  (a data pipeline in a research repository). Ask about that part by name
  when the layout shows one.

### How long the project is maintained

How long the code is expected to live.

- Evidence: a long, steady history suggests years;
  a README calling the project a demo, prototype, or experiment
  suggests a short life. Both are inferences.
- Typical answers: "discarded within a quarter"; "a year or two";
  "maintained for years".
- Pushes: Entropy and Knowledge thicker as the horizon grows,
  Completion with them when specifications are kept beyond one change.
  A short horizon lets Entropy be omitted,
  because the project ends before its harness rots.

### Who relies on its conventions

How many people depend on the conventions holding.

- Evidence: distinct authors in `git log` give an inference,
  never a settled value. A CODEOWNERS file, review rules,
  or a CONTRIBUTING file suggest several people or outside contributors.
- Typical answers: "just me"; "a small team";
  "many people, or outside contributors".
- Pushes: Gates, Knowledge, and the platform part of Authority
  (branches, merge method, labels, templates) thicker as the number grows.
  More people make spoken agreements less reliable,
  so they become files and checks.
  One maintainer lets Knowledge and Authority be one step thinner.

### How unattended agents are

How long an agent works with nobody watching, and what starts it.

- Evidence: not observable, unless the invocation states it
  or a workflow file starts an agent on issues, pull requests,
  or a schedule.
- Typical answers: "I watch every session"; "I check between tasks";
  "unattended for hours or overnight";
  "started by issues or comments anyone can write".
- Pushes: Authority, Completion, Feedback, and Environment thicker
  as agents are left alone longer.
  Unattended work needs actions authorised in advance,
  a checkable definition of done, and feedback a machine gives.
  Content anyone can write, read by an agent that holds credentials,
  is the case that needs an enforced isolated environment.
  A watched session lets Authority and Completion stay light.

### Hosting platform

- Evidence: observable from `git remote -v`
  and from `.github/` or `.gitlab-ci.yml`.
  A self-hosted GitLab has its own hostname:
  treat the remote as GitLab only when `.gitlab-ci.yml` or `.gitlab/` exists.
  No remote is a value too.
- Never asked when observed.
  Asked only when there is no remote and the goal implies publishing.
- Pushes: decides whether the platform part of Authority exists at all
  and where Gates run in CI. With no remote,
  Authority holds no branch, merge, label, or release decision
  and Gates run in the commit hook only.

### Clients and weakest model

Which agent clients will work in the repository,
and the least capable model among them.

- Evidence: client configuration directories and files show some clients;
  the model is not observable.
- Typical answers: one client or several, by name;
  the smallest model tier that will be allowed to work here.
- Pushes: Knowledge (one entrypoint every client reads;
  a weaker model needs rules stated more explicitly and fewer of them)
  and Authority (one permission file per client).
  A weaker model also pushes Gates and Feedback thicker:
  what it will not infer has to be checked.

## Facts that are observed, not asked

An isolated environment the repository declares and the session runs in
(a dev container, a disposable workspace) is recorded as a fact
and handed to the Environment layer.
It pushes inversely: the more a mistake is contained,
the wider the allow list in Authority may be.
A container configuration the session is not running in is shown
with the question "do agents work inside it?" in the conditions round.

Whether several agents write to the repository at once is not a condition.
One agent at a time is assumed and shown as an assumption;
the user corrects it when the round is shown.

## Shape of the round

Through the client's question tool, one question per open condition.
Without one, a single message:

```markdown
Observed:

- Hosting platform: GitHub (`git remote -v` shows github.com).

Inferred; correct me where wrong:

- One maintainer, from a single author across the history.

The repository could not tell me these; one answer each.

1. What does a bad change cost here?
   Recommended: "a day of cleanup" (checks before commit and in CI).
   Others: "revert, nothing lost" (a secret scan and a formatter only);
   "data loss or an outage" (strict checks and an isolated environment).
2. ...
```
