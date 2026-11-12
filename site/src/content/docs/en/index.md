---

title: The harness-md plugin
description: What the harness-md plugin does, how to install it in Claude Code, Codex, and Antigravity, and which workflow fits your situation.
order: 1
---

`harness-md` is a plugin for coding agents.
It is built around one document, a project's `HARNESS.md`,
which records the design of the project's harness.
A harness is how a project is set up for coding agents:
where the agent runs, what it reads, how it checks its work,
what stops a bad change, and what it may do without asking.
Every skill in the plugin either writes that document, reads it,
or turns it into a working harness.

You don't need the plugin to use a `HARNESS.md`.
The format is designed so that an agent with nothing installed
can read a file and build from it;
see [Using a HARNESS.md without the plugin](without-plugin/).
What the plugin adds is a fixed procedure, a validator for the format,
and seven builder skills. A harness has seven layers (Environment, Knowledge,
Feedback, Gates, Authority, Completion, Entropy),
and each builder knows how to design, build, and check one of them.

## Install

The plugin follows the Agent Plugins 1.0.0 layout and loads in three clients.

**Claude Code**

```text
/plugin install harness-md --marketplace hoshiori-dev/harness.md
```

This is one step on Claude Code 2.1.275 or later.
On earlier versions, run `/plugin marketplace add hoshiori-dev/harness.md`
first, then install.

**Codex**

```sh
codex plugin marketplace add hoshiori-dev/harness.md
codex plugin add harness-md@harness-md
```

**Antigravity**

```sh
agy plugin install https://github.com/hoshiori-dev/harness.md
```

The scripts that ship with the skills are written in Python
and need [uv](https://docs.astral.sh/uv/) to run, so install uv first.
uv fetches the dependencies each script declares;
your project needs no Python setup of its own.

## Which workflow to run

Four skills are workflows. They run only when you ask for them by name.

| Your situation                                                        | Run                                                                                                |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| A new project with no harness yet                                     | `harness-design`, then `harness-build`                                                             |
| An existing project that agents struggle in, with no `HARNESS.md` yet | `harness-audit` to find what is wrong, then `harness-design`, then `harness-build`                 |
| A harness that works, except that one thing keeps going wrong         | `harness-audit` with the symptom, then `harness-design` to revise the design, then `harness-build` |
| You want a project's harness written down, yours or one you admire    | `harness-extract`                                                                                  |
| You have a `HARNESS.md` and want the project to match it              | `harness-build`                                                                                    |

[The four workflows](workflows/) describes each one.
[Skills and the verifier agent](skills/) covers everything else the plugin
ships.
