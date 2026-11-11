# Review Pass and Self-Check Steps

Read when the section has a review pass, when a rule is handed over that
no tool can decide (business-logic consistency, a privacy review, a design
rule with no linter), or when deciding what evidence a finished task
carries.

Everything here is advisory: it gives a check a fixed place and a fixed
form, but compliance is not total. Keep every check a tool can decide in a
tool.

## Evidence

"All tests pass" on its own says very little. A finished task reports the
command that was run and the tail of its output, or the path of the
screenshot, so a reader can judge without rerunning. For a session nobody
watched it is the only record. The section says where the evidence goes:
the final message by default, the pull or merge request text when agents
run unattended or a wrong change is costly.

## A self-check step

A rule no tool can decide becomes a named step with a fixed position,
usually "before opening a pull request" in the knowledge file, routed from
the agent entrypoint. Write it as a short numbered list of concrete
questions about the change, never as advice:

```markdown
### Self-check: personal data (before every pull request)

1. List every new field, log line, and API response that carries personal
   data (name, email, address, identifier, location).
2. For each, name where it is stored and who can read it.
3. Confirm none is written to logs, analytics, or error reports.
4. Put the list and the answers in the pull request description.
```

When a project skill drives the pull-request procedure, the step also
belongs in its finishing step; describe that change in the hand back for
whoever maintains project skills.

## A reviewer in a fresh context

A reader that did not write the change is not swayed by the reasoning
that produced it. It is the same model on the same task, so it adds a
second look, not a smarter one; use it where a second look is worth its
tokens (the section's default: a costly wrong change, or unattended
agents).

- **Read-only.** It gets tools that read and search, and none that write.
  Where the client can restrict a subagent's tools, restrict them there,
  so the limit is enforced and not merely requested.
- **Narrow input.** The diff or the list of changed files, and the
  specification or task statement the change was built from. Not the
  conversation that produced it.
- **Narrow question.** Every requirement implemented, every listed edge
  case tested, nothing beyond the task. It skips style: a reviewer asked
  to find problems always finds some, and fixing every finding grows
  abstraction and tests for cases that cannot happen.
- **Fixed output.** `PASS` or `FAIL`, then findings with locations. The
  working agent fixes or answers each finding and says which.

Rework [assets/reviewer-instructions.md](../assets/reviewer-instructions.md) into the reviewer's instructions,
adding the project's own questions on the `# CONFIGURE:` line.

Where it lives depends on the client:

| Client | Form |
|---|---|
| Claude Code | a file `.claude/agents/<name>.md` whose frontmatter holds `name`, `description`, and `tools: Read, Grep, Glob`, with the instructions as its body |
| Any client with subagents | that client's own subagent format, with the same instructions and read-only tools |
| No subagents | a second session given the instructions and the diff by a person; or the self-check step alone |

With no subagent support, deliver only the self-check step and record it
in the knowledge file in one sentence: "No fresh-context reviewer: this
client has no subagents; the self-check step is the only review."

## Placement

The knowledge file says when the review runs (before a pull or merge
request, by default) and that its result is part of the evidence. It does
not block a commit or a merge; a review that must block is a human
approval on the platform, which belongs to the layer that owns Authority.
