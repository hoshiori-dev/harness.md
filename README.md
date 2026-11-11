# harness.md

[中文](README.zh.md) · [Website](https://hoshiori-dev.github.io/harness.md/) · [Specification](spec/spec.md) · [Hub](hub/)

`HARNESS.md` is one file that records how a project is set up for coding
agents: where the agent runs, what it reads, how it checks its own work,
what stops a bad change, and what it may do without asking. That setup is
the project's agent harness.

It is not another instructions file. `AGENTS.md`, the knowledge files, the
permission settings, the hooks, and the CI checks are what an agent works
with on every task. `HARNESS.md` is the design they are built from, written
down with its reasons. An agent opens it only when the harness itself is
being built, checked, or changed.

This repository holds four things:

- the [format specification](spec/spec.md);
- the [hub](hub/), a collection of ready-to-use designs;
- `harness-md`, a plugin for Claude Code, Codex, and Antigravity that
  writes the file for a project, builds the harness it describes, and
  checks one against the other;
- the [website](https://hoshiori-dev.github.io/harness.md/), where the hub
  can be searched.

## Try it without installing anything

1. Pick a design from the [hub](hub/), for example
   [`solo-open-source-library`](hub/solo-open-source-library/HARNESS.md).
2. Save it as `HARNESS.md` in the root of your project.
3. Tell your coding agent what the project is for and ask it to build what
   the file describes.

The agent comes back with a plan before it writes anything. Expect the
plan to list an `AGENTS.md`, a few knowledge files, the commands that check
its work, hooks and CI jobs, and permission settings. The file is written
so that an agent with no plugin and no knowledge of the format can follow
it.

Afterwards you can delete the file, or keep it as the project's record of
the design and check the harness against it later. The format is meant for
both.

## The format in one minute

A `HARNESS.md` is YAML frontmatter that identifies the design (`name`,
`description`, and optionally `version`, `license`, `metadata`) followed by
prose under fixed English headings:

| Section | Required | What it answers |
|---|---|---|
| Overview | yes | Who the harness serves and what it is for |
| Context | yes | The conditions the design has to fit |
| Invariants | | Rules every task follows |
| Style | | What the code should look like so agents can work in it |
| File Structure | | The layout the design requires |
| Environment | yes | Where the agent runs and what it can reach |
| Knowledge | yes | What the agent reads, and when |
| Feedback | yes | How the agent verifies its own work |
| Gates | yes | Which checks stop defects |
| Authority | yes | What the agent may do, and how it commits, merges, and releases |
| Completion | | How a goal is agreed and what counts as done |
| Entropy | | How the harness stays consistent with the code |
| Open Questions | | What is undecided |
| References | | What the design drew on |

The format has one goal: writing a `HARNESS.md` requires the specification;
understanding one does not. Everything under the headings is ordinary
prose, and because agents rarely load the file, it can be as long as the
design needs. The [specification](spec/spec.md) is short and has a
[Chinese translation](spec/spec.zh.md).

## The plugin

### Install

- **Claude Code**: `/plugin install harness-md --marketplace hoshiori-dev/harness.md`
  (one step on Claude Code 2.1.275 or later; on earlier versions run
  `/plugin marketplace add hoshiori-dev/harness.md` first, then install).
  For local development, `claude --plugin-dir .`.
- **Codex**: `codex plugin marketplace add hoshiori-dev/harness.md`, then
  `codex plugin add harness-md@harness-md`.
- **Antigravity**: `agy plugin install https://github.com/hoshiori-dev/harness.md`.

The scripts that ship with the skills are Python. You need
[`uv`](https://docs.astral.sh/uv/) to run them.

### What you can do with it

| You want to | Use |
|---|---|
| Set up a new project for agents | `harness-design`, then `harness-build` |
| Find out what is wrong with an existing setup and fix it | `harness-audit`, then `harness-design` and `harness-build` |
| Keep improving a project that already works with agents | `harness-audit` with the symptom you see |
| Write down the design a project already has (your own project, or one you want to learn from) | `harness-extract` |
| Bring a project in line with a given `HARNESS.md` | `harness-build` |

These four skills are workflows. They run only when you invoke them by
name: `/harness-md:harness-design` in Claude Code, `$harness-design` in
Codex. Each one hands the layers of the design (Environment, Knowledge,
and so on) to the skill that knows that layer.

## Validate a file

The validator checks the frontmatter and the section headings and nothing
else. It never judges the prose. With the plugin installed, ask your agent
to validate the file. From a clone of this repository:

```sh
uv run skills/harness-md/scripts/lint_harness_md.py path/to/HARNESS.md
```

## Contribute a hub entry

A hub entry is a complete design in `hub/<name>/HARNESS.md`. The rules are
in [hub/README.md](hub/README.md). Entries come in by pull request.

## All skills

| Skill | Invocation | Summary |
|---|---|---|
| [`harness-md`](skills/harness-md/SKILL.md) | Model-invoked | Reads, writes, and validates a `HARNESS.md`; ships the validator script. |
| [`harness-design`](skills/harness-design/SKILL.md) | User-invoked | Produces or revises a project's `HARNESS.md`: reads the repository, asks once for what it cannot see, drafts the whole design with defaults, and waits for one approval. |
| [`harness-build`](skills/harness-build/SKILL.md) | User-invoked | Turns a `HARNESS.md` into the harness, layer by layer, or migrates an existing harness to it. |
| [`harness-extract`](skills/harness-extract/SKILL.md) | User-invoked | Writes the `HARNESS.md` that describes the harness a project already has. |
| [`harness-audit`](skills/harness-audit/SKILL.md) | User-invoked | Diagnoses a harness: format, drift between the design and the repository, and whether the design fits the project. Changes nothing. |
| [`harness-architecture`](skills/harness-architecture/SKILL.md) | Model-invoked | The methodology: why each layer exists, where a rule belongs, how a project's context decides how much each layer does. |
| [`environment-building`](skills/environment-building/SKILL.md) | Model-invoked | The Environment layer: isolation, credentials, tools, and what the agent can reach. |
| [`knowledge-building`](skills/knowledge-building/SKILL.md) | Model-invoked | The Knowledge layer: the `AGENTS.md` entrypoint, knowledge files, and the links between them. |
| [`feedback-building`](skills/feedback-building/SKILL.md) | Model-invoked | The Feedback layer: what an agent can run and observe to verify its work. |
| [`gates-building`](skills/gates-building/SKILL.md) | Model-invoked | The Gates layer: pre-commit hooks and CI checks that block defects. |
| [`authority-building`](skills/authority-building/SKILL.md) | Model-invoked | The Authority layer: permissions, commits, branches, merges, releases, and the platform setup on GitHub or GitLab. |
| [`completion-building`](skills/completion-building/SKILL.md) | Model-invoked | The Completion layer: how work is specified and approved and when a task is done. |
| [`entropy-building`](skills/entropy-building/SKILL.md) | Model-invoked | The Entropy layer: keeping the harness consistent with the code. |
| [`spec-driven-development`](skills/spec-driven-development/SKILL.md) | Model-invoked | Writing the specification before the code, and keeping the two in step as a change moves to merge. |
| [`openspec-workflow`](skills/openspec-workflow/SKILL.md) | Model-invoked | Working with OpenSpec changes inside pull or merge requests. |
| [`spec-kit-workflow`](skills/spec-kit-workflow/SKILL.md) | Model-invoked | Working with Spec-Kit features inside pull or merge requests. |
| [`lightweight-spec-workflow`](skills/lightweight-spec-workflow/SKILL.md) | Model-invoked | Agreeing on one change with plan mode or a `SPEC.md`, without a spec framework. |
| [`project-skill-building`](skills/project-skill-building/SKILL.md) | Model-invoked | Writing and repairing the skills a project keeps for its own agents. |

Claude Code also gets the agent
[`harness-verifier`](com.anthropic.claude-code/agents/harness-verifier.md),
which reads a freshly built harness back in a clean context and reports the
gaps. Codex and Antigravity plugins cannot include agents yet, so the
workflows fall back to an ordinary subagent there.

If you used [`harness-builder`](https://github.com/hoshiori-dev/harness-builder),
this plugin replaces it.

## Development

Open the dev container and run `just check`. The repository applies its own
method: [HARNESS.md](HARNESS.md) is the design of its harness, and
[AGENTS.md](AGENTS.md) is where an agent starts. See
[CONTRIBUTING.md](CONTRIBUTING.md) for how changes are proposed and
reviewed.

## License

Apache-2.0. See [LICENSE](LICENSE).
