# Contributing

Contributions are welcome, and most of them are small: a new hub entry, a
fix to a skill, a clearer sentence in the specification. This page tells you
which kind of change you are making and what it needs before it can merge.
The detailed rules live in `AGENTS.md` and `.agents/knowledge/`; they are
written for coding agents, but people can read them too.

If you work with a coding agent, point it at this repository and it will
pick up `AGENTS.md` on its own.

## Set up

Open the repository in the dev container. It installs everything and sets
up the git hooks.

Without the container you need Node 24 or later with `pnpm`, `uv`, `just`,
`pre-commit`, `betterleaks`, and OpenSpec 1.17. Run `pnpm install` once, then
`just check` to confirm that your setup works. The client CLIs (Claude
Code, Codex, Antigravity) are only needed for `just clients-validate`.

## Which kind of change is it?

**A hub entry.** Add `hub/<name>/HARNESS.md` and open a pull request. No
proposal is needed. `hub/README.md` has the entry rules, and
`just hub-check` verifies the mechanical ones. The review is about
substance: could an agent with nothing but your file build the harness it
describes?

**A fix or an improvement that does not change what users get.** This
covers scripts, CI, documentation, the website's styling or copy, and a
typo anywhere, including a clearer sentence in the specification that
changes no rule. Open a pull request; an issue first is optional.

**A change to what the project ships.** That covers the format itself, a
skill or the verifier agent, the hub's entry rules, and how the website
behaves. These start as an OpenSpec change (a short proposal with spec
deltas under `openspec/changes/<id>/`, created with
`openspec new change <id>`) in a draft pull request. A maintainer
approves it by adding the `spec:approved` label, and only then is it
implemented. This costs a round trip, and it is deliberate: a format rule
or a skill gets copied into other people's projects, where a mistake cannot
be recalled.

If you are unsure which kind you have, open an issue and ask.

## Make the change

1. Pick an issue or open one with the forms (bug, feature, task, hub
   entry).
2. Create a branch and open a draft pull request early. Keep every heading
   of the pull request template.
3. Make the change. Run `just check` before each push; it runs everything
   CI runs. `just check-fast` is the quick subset to run while you work.
4. When a check fails, fix the cause. Please do not relax a check, a hook,
   or a fixture expectation to get a change through; if a check is wrong,
   say so in the pull request and we will change it separately.
5. Mark the pull request ready. A maintainer reviews and squash-merges.

A few changes carry extra steps:

- Changed a skill? Run its behavioural tests and record the results in
  the pull request. The tests are the scenarios in its spec under
  `openspec/specs/skill/<name>/`; give each one to an agent in a fresh
  session that has not seen your change being made.
- Changed `plugin.json` or an agent file? Run `just gen` and commit the
  generated files. Never edit them by hand.
- Changed English text that has a Chinese translation (`README.md`,
  `spec/spec.md`, `hub/README.md`, a page of the website)? Update the
  translation in the same pull request. If you do not write Chinese, say so and
  a maintainer will do it.
- Changed the format? `.agents/knowledge/format-changes.md` lists every
  file that has to change with it.

## Conventions

- English is the authoritative language for everything in the repository.
- Commit messages and pull request titles follow Conventional Commits with
  a lowercase subject, for example `feat(hub): add data-pipeline entry`.
  Do not add AI or tool attribution.
- Management scripts under `scripts/` are TypeScript run directly by Node.
  Scripts that ship inside skills are Python with PEP 723 metadata and a
  `_test.py` beside each.
- Never commit secrets. betterleaks runs on every commit locally, and CI
  scans every pushed commit. Issues and pull requests are public too.

## Security issues

Please report them privately; see [SECURITY.md](SECURITY.md).
