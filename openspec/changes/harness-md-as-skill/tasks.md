# Tasks

## 1. The format in place

- [x] 1.1 Convert the format in one step, because a half-converted tree
  fails the repository's checks:
  both validators validate a directory by the findings table of the design
  and lose `--fixtures`; each test suite builds its cases in a temporary
  directory and has a test that fails when a finding code of `cli/lint`
  has no case; `spec/fixtures/`, the `fixtures-check` recipe, its CI step,
  and its allow entry are deleted;
  the three hub entries become `hub/<name>/SKILL.md` with both marker
  halves and string metadata, and `scripts/check_hub.ts` follows the `hub`
  delta; the repository's document moves to
  `.agents/knowledge/project-harness/SKILL.md`, `AGENTS.md` names it,
  and `scripts/check_harness.ts` treats the directory as one unit;
  the site reads `hub/<name>/SKILL.md` and serves it at
  `/hub/<name>/SKILL.md`; every knowledge file and `openspec/config.yaml`
  that names the fixtures or the old paths is corrected.
  Verify: `just check` passes; `just --list` shows no `fixtures-check`;
  `git ls-files spec/fixtures 'hub/*/HARNESS.md' HARNESS.md` prints nothing.

## 2. The site

- [ ] 2.1 Publish every file of an entry at `/hub/<name>/<path>`,
  show the file structure before the body on the entry page in both
  languages, point the menu at `SKILL.md` and "view on GitHub" at the
  directory, rewrite relative links in the rendered body,
  add the file tree to `DESIGN.md`, and update `.agents/knowledge/site.md`.
  Verify: `just site-check` and `just site-build` pass; the built
  `site/dist` holds `hub/<name>/SKILL.md` for each entry and each entry
  page lists `SKILL.md` (scenarios "File structure of an entry"
  and "Entry with one file").

## 3. The specification

- [ ] 3.1 Rewrite `spec/spec.md` from the three format deltas and
  `cli/lint`: sections 1 to 4 and 7 rewritten, 5 and 6 edited,
  the Agent Skills hard rules written out with their source,
  every example frontmatter with a block-scalar description.
  Verify: a read of each delta requirement against the prose finds it
  stated once and nothing contradicting it; no filled-in example document.
- [ ] 3.2 Mirror the result in `spec/spec.zh.md` section for section and
  copy `spec/spec.md` over `skills/harness-md/references/specification.md`.
  Verify: `just harness-check` and `just skills-check` pass.

## 4. Skills and agents

- [ ] 4.1 Edit the canon of `agreement-is-the-source`, `reference-is-data`,
  `deposited-files-stand-alone`, `management-code-ownership`,
  and `format-in-brief` in `.agents/knowledge/shared-blocks.md`
  and paste each into every skill that uses it.
  Verify: `just skills-check` passes.
- [ ] 4.2 `harness-md`: `SKILL.md`, `references/writing.md`, and the
  skeleton as `assets/SKILL.skeleton.md`, per `skill/harness-md`.
  Verify: `just skills-check` passes; closes every scenario of the
  `skill/harness-md` delta.
- [ ] 4.3 `harness-create` and `harness-improve` per their deltas:
  candidates by frontmatter, references as directories, reference assets
  in the plan, the location of a document, the manual checklist.
  Verify: `just skills-check` passes; closes the scenarios of both deltas.
- [ ] 4.4 `harness-distill` and `harness-adopt` per their deltas:
  a directory as output, both marker halves, the proposed location,
  the entrypoint line, assets in `harness-distill` only.
  Verify: `just skills-check` passes; closes the scenarios of both deltas.
- [ ] 4.5 `entropy-building` and `knowledge-building` per their deltas,
  the delivered self-check and its tests included.
  Verify: `just skills-check` and `just test` pass; closes the scenarios
  of both deltas.
- [ ] 4.6 `harness-architecture` and `completion-building` per their
  deltas, `detect_spec_tooling.py` and its tests included; the wording
  left in the other builders and the four specification skills.
  Verify: `just skills-check` and `just test` pass;
  `git grep -n 'root .HARNESS' skills/` prints nothing.
- [ ] 4.7 `harness-verifier` and `harness-reader` per their deltas,
  `com.anthropic.claude-code/README.md`, the description in `plugin.json`,
  then `just gen`.
  Verify: `just gen --check` and `just validate` pass.

## 5. Documentation and knowledge

- [ ] 5.1 `README.md` with `README.zh.md`, `CONTRIBUTING.md`,
  `SECURITY.md`, `.github/labels.json`, the website's plugin pages in both
  languages, and the knowledge files that describe the plugin
  (`plugin-architecture.md`, `skill-quality.md`, `format-changes.md`,
  `client-matrix.md`, `review.md`, `compatibility-watch.md`,
  `maintenance.md`, `plugin-development`).
  Verify: `just harness-check` and `just site-build` pass;
  `git grep -n 'HARNESS\.md file' -- ':!openspec' ':!spec'` shows only
  sentences about the old shape that are meant.

## 6. Verification

- [ ] 6.1 `just gen`, `just skills-check`, `just check`.
  Verify: all pass with no warning.
- [ ] 6.2 Run the Agent Skills reference validator over the three hub
  entries and the repository's document.
  Verify: it reports no error; the result is in the pull request.
- [ ] 6.3 Behavioural tests of every new or changed skill and agent
  scenario, through clean-context subagents on the least capable tier.
  Verify: the results are recorded in the pull request.
- [ ] 6.4 `just clients-validate`, and one listing of the plugin's skills
  per client to see whether `hub/<name>/SKILL.md` or the repository's
  document is offered as a skill.
  Verify: the result is in `.agents/knowledge/client-matrix.md`;
  if a client lists them, stop for the maintainer's decision.

## Workflow follow-up

- Package edits to make in one go, because each one resets the approval:
  state in `cli/lint` and in the design that links are not read from
  indented code blocks, HTML comments, or raw HTML; that a Markdown file
  ends in `.md` or `.markdown`, in any case; that a dot-named file is not
  read for links; that a link to a directory inside the document is not
  followed; that a non-string `allowed-tools` is `key-type` alone;
  that an unclosed frontmatter is the only finding of its directory.
- Known differences between the two validators, none on a scenario of
  `cli/lint`: YAML 1.1 scalars that the two YAML libraries resolve
  differently (`y`, `n`, `1e3`, `=`, `<<`), an alias to a string, the
  line of `frontmatter-invalid` for unparseable YAML, a link definition
  inside a block quote, a link inside an HTML block, and `--` as an
  argument.

- Edit the Purpose of each modified spec under `openspec/specs/`
  when the change is archived.
- Archive on the branch after the maintainer's review.
