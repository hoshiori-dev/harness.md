# Tasks

## 1. Specification

- [x] 1.1 Apply edits 1 to 6 of the design to `spec/spec.md`.
  Verify: `git diff main -- spec/spec.md` touches sections 3 and 4.1 only;
  `grep -n "^### 3\." spec/spec.md` still lists 3.1 to 3.4;
  the "Version:" line reads `1.0.0`;
  `grep -n "repository root\|root directory" spec/spec.md` finds only
  sentences about an anchor document.
- [x] 1.2 Mirror the same edits in `spec/spec.zh.md`, section for section.
  Verify: `just harness-check` passes (mirror heading structure)
  and each edited English paragraph has its Chinese counterpart.
- [x] 1.3 Copy `spec/spec.md` over
  `skills/harness-md/references/specification.md`.
  Verify: `cmp` reports no difference and `just skills-check` passes.

## 2. Hub

- [ ] 2.1 Read the three entries in full and list, per entry, the sentences
  that prescribe placement, keeping, or deleting the file, and the
  sentences that give a realisation in place of a decision.
  Verify: the list is posted as a comment on the pull request.
- [ ] 2.2 Rewrite `hub/README.md` ("Using an entry", "Entry rules",
  the opening) to the delta spec of `hub`, and mirror it in
  `hub/README.zh.md`.
  Verify: scenarios "Entry read from its URL", "Entry covering one aspect",
  and "Decision bound to one tool" can each be answered from the README;
  `just harness-check` passes.
- [ ] 2.3 Revise `hub/exploratory-prototype/HARNESS.md`:
  replace "How to use this file" with a short note,
  reword realisations as examples, remove keep-or-delete sentences.
  Verify: `just hub-check` passes; no decision listed in 2.1 is lost.
- [ ] 2.4 Revise `hub/solo-open-source-library/HARNESS.md` the same way.
  Verify: as 2.3.
- [ ] 2.5 Revise `hub/production-engineering/HARNESS.md` the same way.
  Verify: as 2.3.
- [ ] 2.6 Update `.agents/knowledge/hub.md` (main use, review questions).
  Verify: `just harness-check` passes and the file states the rules
  of the delta spec, not the old ones.

## 3. Documents and site copy

- [ ] 3.1 Update `README.md` and `README.zh.md`: the opening, "Try it
  without installing anything", and what a hub entry is.
  The plugin sections stay for the plugin change.
  Verify: `grep -n -i "root\|根目录" README.md README.zh.md` shows no
  instruction to place the file in a project root; `just harness-check`.
- [ ] 3.2 Update the website copy: `site/src/content/docs/en/without-plugin.md`,
  its `zh` counterpart, and the strings in `site/src/i18n/ui.ts`
  that describe the two uses and saving to the root.
  Verify: `just site-check` and `just site-build` pass.
- [ ] 3.3 Edit `.agents/knowledge/format-changes.md` and the root
  `HARNESS.md` only where a sentence restates the old positioning.
  Verify: `just harness-check` and `just harness-md-lint` pass.

## 4. Verification

- [ ] 4.1 `just gen --check` passes (nothing to generate).
- [ ] 4.2 `just skills-check` passes.
- [ ] 4.3 `just check` passes except the archive gate, which waits
  for the review (`just spec-archived` names this change).
- [ ] 4.4 Behavioural tests: none apply, because no skill or agent
  changes behaviour; state this in the pull request.
- [ ] 4.5 `just clients-validate` passes.

## Workflow follow-up

- After the maintainer's review: archive the change on the branch,
  and in the archive commit edit the Purpose paragraph of
  `openspec/specs/hub/spec.md` by hand.
