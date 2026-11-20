# Tasks

## 1. Contracts, knowledge, and checks

- [x] 1.1 Update `.agents/knowledge/plugin-architecture.md`,
  `.agents/knowledge/skill-quality.md`, and `.agents/knowledge/shared-blocks.md`
  to the four entries, decision rounds, layer thicknesses, the four builder modes
  and seven steps, anchor documents versus references, and `harness-reader`.
  Verify: `just harness-check` and `just skills-check` pass with zero warnings.
- [x] 1.2 Update `scripts/check_skills.ts` and `scripts/check_skills_test.ts`
  for the four entry names and the seven builder step headings
  (`1. Observe` through `7. Hand back`).
  Verify: `just skills-check` and `just test` pass.
- [x] 1.3 Update `.agents/knowledge/client-matrix.md`
  with each client's verified question tool and limits,
  and update `.agents/knowledge/compatibility-watch.md`
  and `.agents/skills/plugin-development/SKILL.md` to the new entries and two agents.
  Verify: `just harness-check` passes.
- [x] 1.4 Resolve the four `catalog-orphan-spec` findings from
  `scripts/check_plugin.ts` for removed unarchived skills
  (companion PR #21 / issue #20 merged into `main` and merged into this branch).
  Verify: `just validate` exits 0.

## 2. Read-only agents

- [x] 2.1 Add `com.anthropic.claude-code/agents/harness-reader.md`
  (read-only `Read, Grep, Glob` tools) per `agent/harness-reader`.
  Verify: `just clients-validate` passes and `harness-reader` answers its spec scenarios.
- [x] 2.2 Update `com.anthropic.claude-code/agents/harness-verifier.md`
  so intent lines quote agreed decisions and `HARNESS.md` is not opened unless listed.
  Verify: `harness-verifier` answers its modified spec scenarios.
- [x] 2.3 Update `com.anthropic.claude-code/README.md` to describe both
  `harness-verifier` and `harness-reader` and name the entry skills.
  Verify: `just harness-check` passes.

## 3. Entry skills

- [x] 3.1 Create `skills/harness-create/`, `skills/harness-improve/`,
  `skills/harness-distill/`, and `skills/harness-adopt/`, each with
  `disable-model-invocation: true`, `agents/openai.yaml`, `references/question-tools.md`,
  and role-based routing (`Owns the <Layer> layer`);
  remove `skills/harness-design/`, `skills/harness-build/`,
  `skills/harness-audit/`, and `skills/harness-extract/`.
  Verify: `just skills-check` passes with total descriptions under 8,000 characters
  and zero `skill-body-size` warnings.
- [x] 3.2 Align `skills/harness-adopt/` terminology (`source project` vs `target project`
  in the shared block) and verify `harness-reader` + read-only git commands
  satisfy `harness-adopt`.
  Verify: `grep -rn -i 'target' skills/harness-adopt/` hits only the shared block
  and `outside-targets.md` path references.

## 4. Seven layer builders

- [x] 4.1 Rewrite the `SKILL.md` of `environment-building`, `knowledge-building`,
  `feedback-building`, `authority-building`, `completion-building`, and `entropy-building`
  to the four modes (`decide`, `describe`, `build`, `audit`) and seven steps,
  moving step 2 decision tables and step 6 audit checklists into `references/`,
  aligning thickness definitions and audit finding classes across builders and entries,
  and updating references and assets where they assumed a root `HARNESS.md`.
  Verify: `just skills-check` and `just test` pass with zero warnings.
- [x] 4.2 Rewrite `skills/gates-building/SKILL.md` the same way, and apply the
  maintainer's decision on keeping (with a delta spec update) or removing
  the Verify rule requiring gates to be seen rejecting a violation.
  Verify: `just skills-check` and `just spec-check` pass, and the implementation
  matches `openspec/changes/rebuild-plugin/specs/skill/gates-building/spec.md`.

## 5. Format, methodology, and daily skills

- [x] 5.1 Update `skills/harness-md/` (`SKILL.md`, `references/writing.md`,
  `assets/HARNESS.skeleton.md`), `skills/harness-architecture/` (`SKILL.md`, references),
  and the four daily spec skills (`openspec-workflow`, `spec-kit-workflow`,
  `lightweight-spec-workflow`, `spec-driven-development`) for anchor-document wording.
  Verify: `just skills-check` and `just test` pass.
- [x] 5.2 Merge `main` after PR #15 merges, then copy `spec/spec.md` over
  `skills/harness-md/references/specification.md`.
  Verify: `cmp spec/spec.md skills/harness-md/references/specification.md`
  and `just skills-check` pass.

## 6. Manifest, documentation, and website

- [x] 6.1 Update `plugin.json`, `AGENTS.md` (at most 120 lines), `HARNESS.md`,
  `openspec/config.yaml`, `README.md`, `README.zh.md`, and the site's plugin pages
  (`en` and `zh` for `index.md`, `skills.md`, `workflows.md`), and run `just gen`.
  Verify: `just gen --check`, `just harness-check`, `just harness-md-lint`,
  `just site-check`, and `just site-build` pass.
- [x] 6.2 Reconcile `README.md` and `README.zh.md` after merging `main` (PR #15).
  Verify: `just harness-check` passes.

## 7. Verification and handoff

- [x] 7.1 Verify the package in all three clients (`just clients-validate`).
  Verify: `claude plugin validate`, `agy plugin validate` / `install`,
  and `codex plugin marketplace` pass.
- [x] 7.2 Run `just check` after resolving items 1.4 and 4.2
  (excluding `spec-archived`, which waits for review).
  Verify: `just check-fast`, `just spec-check`, `just site-check`,
  `just site-build`, and `just secrets` exit 0.
- [ ] 7.3 Run clean-context behavioural tests for every new and changed scenario
  under `openspec/changes/rebuild-plugin/specs/`, on the least capable model tier
  available, and record pass/fail per scenario in the pull request.
  Verify: every trigger, near-miss, and outcome scenario is recorded.
- [ ] 7.4 Commit per verified task (no AI attribution), run `just publish-check`,
  push, self-review the diff, mark the pull request ready, and post the handoff comment.
  Verify: `just check-fast` passes in CI and the pull request is ready for review.

## Workflow follow-up

- After the maintainer's review: archive `openspec/changes/rebuild-plugin/`
  on the branch (`openspec-archive-change`), which retires and deletes the four
  removed skill specs automatically via `retire_capabilities: true`,
  and update the Purpose paragraphs of `openspec/specs/skill/spec.md`
  and `openspec/specs/agent/spec.md` by hand in the archive commit.
