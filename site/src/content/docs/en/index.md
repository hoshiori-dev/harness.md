---

title: The harness-md plugin
description: What the harness-md plugin does, how to install it in Claude Code, Codex, and Antigravity, and which entry fits your situation.
order: 1
---

`harness-md` is a plugin for coding agents.
With it, you and your agent work out a project's harness together
and build it.
A harness is how a project is set up for coding agents:
where the agent runs, what it reads, how it checks its work,
what stops a bad change, and what it may do without asking.

The plugin's subject is the harness, not a document.
A `HARNESS.md` is the portable form of a harness design:
the plugin reads one as a reference, writes one when you want a design
to share or keep, and never requires your project to have one.

You don't need the plugin to use a `HARNESS.md`.
The format is designed so that an agent with nothing installed
can read a file and work from it;
see [Using a HARNESS.md without the plugin](without-plugin/).
What the plugin adds is a way of deciding things with you step by step,
a validator for the format, and seven builder skills.
A harness has seven layers (Environment, Knowledge,
Feedback, Gates, Authority, Completion, Entropy),
and each builder knows how to decide, build, and check one of them.

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

## Which entry to run

Four skills are entries. They run only when you ask for them by name.

| Your situation                                                          | Run                                                         |
| ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| A project with no harness yet, new or with years of history             | `harness-create`                                            |
| The same, and you have a design from the hub or another team to draw on | `harness-create` with the file's address or path            |
| A harness that agents struggle in, or one thing that keeps going wrong  | `harness-improve`                                           |
| You only want to know what is wrong                                     | `harness-improve`, and stop at the report                   |
| A prototype that is turning into a product                              | `harness-improve`                                           |
| You want your project's design written down, to share it or to keep it  | `harness-distill`                                           |
| You want a harness like the one another project has                     | `harness-adopt`, then `harness-create` or `harness-improve` |

[The four entries](workflows/) describes each one
and how they decide things with you.
[Skills and the agents](skills/) covers everything else the plugin ships.
