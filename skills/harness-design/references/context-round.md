# The Context Round

Read before writing the one question round of step 3, or when the user asks
why a question is being asked. Context is what the designer cannot change
and the design has to fit. Six conditions set how much each layer does;
none of them is a project type.

## How to settle each one

1. Look for the evidence listed below. When the repository states the
   value, record it as **observed**, with where it was seen; do not ask.
2. When the evidence only suggests a value, write it as an **inference**:
   "I infer <value> from <evidence>; confirm or correct." It goes into the
   round.
3. Ask everything that remains in **one message**. Each question carries
   its typical answers and what each answer changes in the design.

## The conditions

### Cost of a wrong change

What a bad change costs: nothing beyond a revert, a day of cleanup, or lost
data, an outage, a security incident.

- Evidence: rarely observable. A deploy pipeline, migrations, production
  configuration, or payment and user-data code suggest a high cost; state
  it as an inference.
- Typical answers: "nothing, we revert"; "a day of cleanup, no data lost";
  "data loss, an outage, or a security incident".
- Changes: Gates and Environment. A higher cost means machine checks and
  isolation instead of conventions.

### Maintenance horizon

How long the code is expected to live.

- Evidence: a long, steady history suggests years; a README calling it a
  demo, prototype, or experiment suggests a short life. Both are
  inferences.
- Typical answers: "discarded within a quarter"; "a year or two";
  "maintained for years".
- Changes: Entropy and Knowledge. A short horizon lets Entropy be left out,
  because the project ends before it rots.

### Who relies on the conventions

How many people depend on conventions holding.

- Evidence: distinct authors in `git log` give an inference, never a
  settled value; a CODEOWNERS file, review rules, or a CONTRIBUTING file
  suggest several people or outside contributors.
- Typical answers: "just me"; "a small team"; "many people, or outside
  contributors".
- Changes: Gates, Knowledge, and the platform half of Authority. More
  people make agreements less reliable, so they become files and checks.

### How unattended agents are

How long an agent works with nobody watching, and what triggers it.

- Evidence: not observable, unless the invocation states it or a workflow
  file starts an agent on issues, pull requests, or a schedule.
- Typical answers: "I watch every session"; "I check between tasks";
  "unattended for hours or overnight"; "started by issues or comments
  anyone can write".
- Changes: Authority, Completion, Feedback, and Environment. Longer
  unattended time needs actions authorised in advance, a checkable
  definition of done, and feedback a machine gives. Content anyone can
  write, read by an agent that holds credentials, is the case that needs
  real isolation.

### Hosting platform

- Evidence: observable from `git remote -v` and from `.github/` or
  `.gitlab-ci.yml`. A self-hosted GitLab has its own hostname; treat the
  remote as GitLab only when `.gitlab-ci.yml` or `.gitlab/` exists. No
  remote is a value too.
- Never asked when observed. Asked only when there is no remote and the
  user's goal implies publishing.
- Changes: the platform half of Authority (branches, merge method, labels,
  templates, releases) and where Gates run in CI.

### Clients and weakest model

Which agent clients will work in the repository, and the least capable
model among them.

- Evidence: client configuration directories and files show some clients;
  the model is not observable.
- Typical answers: one client or several, by name; the smallest model tier
  the team will let work here.
- Changes: Knowledge (one entrypoint every client reads; how explicit rules
  must be for the weakest model) and Authority (which permission files
  exist).

## Facts that are observed, not asked

An isolated environment the repository declares and the session runs in (a
dev container, a disposable workspace) is recorded as a fact and handed to
the Environment layer. A container configuration the session is not running
in is reported with the question "do agents work inside it?" in the round.

## Shape of the round

```markdown
The repository could not tell me these; one answer each.

1. Cost of a wrong change: what does a bad change cost here? Typical:
   "revert, nothing lost" (few checks), "a day of cleanup" (checks before
   commit and in CI), "data loss or an outage" (strict checks and an
   isolated environment).
2. ...

I inferred these; confirm or correct.

- One maintainer, from a single author across the history.
- ...
```
