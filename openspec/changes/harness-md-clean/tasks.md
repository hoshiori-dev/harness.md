# Tasks

## 1. Base

- [ ] 1.1 Merge the branch of `harness-md-as-skill` (issue #31)
  into this one once its tasks 4 and 5 (skills, agents, documentation)
  are committed there, and again whenever it moves.
  Verify: `git log` shows the base's task commits and `just check`
  passes before any edit.

## 2. Catalog and checks

- [ ] 2.1 Add the class "tool" to `scripts/check_skills.ts`
  (a list of tools, the limit of 400, the invocation switch on entries
  and tools, a finding that names a tool as a tool) with test cases,
  and to `.agents/knowledge/plugin-architecture.md`,
  `.agents/knowledge/skill-quality.md`,
  and `.agents/knowledge/client-matrix.md` (five user-invoked skills,
  five copies of the question-tools reference).
  Verify: `just test` and `just harness-check` pass; the scenarios
  "Tool over its limit" and "Tool without the invocation switch"
  each have a test.

## 3. The skill

- [ ] 3.1 Write `skills/harness-md-clean/SKILL.md`,
  `agents/openai.yaml` with implicit invocation off,
  and `references/question-tools.md` as the copy the entries carry;
  the description at most 400 characters; no step that names a client's
  tool or key.
  Verify: `just skills-check` and `just validate` pass;
  the total of all descriptions is under 8,000.
- [ ] 3.2 `just gen`.
  Verify: `just gen --check` passes.

## 4. Documentation

- [ ] 4.1 Add the skill to the skill tables of `README.md`
  and `README.zh.md` and to the website's skill pages in both languages.
  Verify: `just harness-check` and `just site-build` pass.

## 5. Verification

- [ ] 5.1 `just gen`, `just skills-check`, `just check`.
  Verify: all pass with no warning.
- [ ] 5.2 Behavioural tests of every scenario of `skill/harness-md-clean`
  and of the catalog requirement "Tools", through clean-context subagents
  on the least capable tier, each in a throwaway project built for it,
  the destructive scenarios in a temporary directory outside any checkout.
  Verify: the results are recorded in the pull request, and after each
  destructive scenario a listing of the throwaway project shows exactly
  the expected removals.
- [ ] 5.3 `just clients-validate`, and per client one request that
  resembles the tool's work without invoking it.
  Verify: no client loads the tool from a description match;
  a client that does is a stop for the maintainer's decision.

## Workflow follow-up

- Add the class to the Purpose of `openspec/specs/skill/spec.md`
  when the change is archived.
- Archive on the branch after the maintainer's review.
