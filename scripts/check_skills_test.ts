import assert from "node:assert/strict";
import { test } from "node:test";
import type { FileSpec } from "./lib/testing.ts";
import { gitInit, makeTree, runScript, writeTree } from "./lib/testing.ts";

const PY = [
  "#!/usr/bin/env -S uv run --script",
  "# /// script",
  '# requires-python = ">=3.10"',
  "# ///",
  '"""Usage: tool.py --help"""',
  "",
].join("\n");

const LAYERS = [
  "Environment",
  "Knowledge",
  "Feedback",
  "Gates",
  "Authority",
  "Completion",
  "Entropy",
];
const STEPS = [
  "### 1. Observe",
  "### 2. Write the section",
  "### 3. Build",
  "### 4. Verify",
  "### 5. Audit",
  "### 6. Hand back",
]
  .map((s) => `${s}\n\nDo it.\n`)
  .join("\n");
const SHARED =
  "<!-- shared:design-is-not-approval -->\nA design is not approval.\n<!-- /shared:design-is-not-approval -->\n";

function skill(name: string, description: string, extra = ""): string {
  return `---\nname: ${name}\ndescription: ${description}\nlicense: Apache-2.0\n${extra}---\n# ${name}\n\nBody.\n`;
}

function builder(layer: string, tail = ""): string {
  return `${skill(
    `${layer.toLowerCase()}-building`,
    `Owns the ${layer} layer of an agent harness. Use when a workflow hands it over.`,
  )}\n## Workflow\n\n${STEPS}${tail}`;
}

function fixture(): Record<string, FileSpec> {
  const files: Record<string, FileSpec> = {
    ".agents/knowledge/shared-blocks.md": `# Shared blocks\n\n${SHARED}`,
    "spec/spec.md": "# Specification\n",
    "skills/harness-md/SKILL.md": `${skill(
      "harness-md",
      "Reads and validates a HARNESS.md. Use when one is at hand.",
      "compatibility: Python 3.10+ with uv.\n",
    )}Read [the specification](references/specification.md) when writing a file.\nRun [the validator](scripts/lint.py) after writing one.\n`,
    "skills/harness-md/references/specification.md": "# Specification\n",
    "skills/harness-md/scripts/lint.py": `${PY}print('ok')\n`,
    "skills/harness-md/scripts/lint_test.py": "def test_ok():\n    assert True\n",
    "skills/harness-md/agents/openai.yaml": "interface:\n  display_name: HARNESS.md\n",
    "skills/harness-build/SKILL.md": `${skill(
      "harness-build",
      "Builds a harness. Use when the user invokes it.",
      "disable-model-invocation: true\n",
    )}Route to the skill whose description says \`Owns the <Layer> layer\`.\n${SHARED}`,
    "skills/project-skill-building/SKILL.md": skill(
      "project-skill-building",
      "Writes project skills. Use when a procedure recurs.",
    ),
  };
  for (const layer of LAYERS) {
    files[`skills/${layer.toLowerCase()}-building/SKILL.md`] = builder(layer);
  }
  files["skills/environment-building/SKILL.md"] = builder(
    "Environment",
    "\nRead [threat model](references/threat-model.md) when rating isolation.\n",
  );
  // Reachability is transitive, and a reference may link a sibling directory of the same skill.
  files["skills/environment-building/references/threat-model.md"] =
    "# Threat model\n\nRead [the tiers](tiers.md) when grading.\n";
  files["skills/environment-building/references/tiers.md"] =
    "# Tiers\n\nStart from [the knowledge file](../assets/knowledge-environment.md) when depositing.\n";
  files["skills/environment-building/assets/knowledge-environment.md"] =
    "# Environment\n\nIsolation: {{ISOLATION}} <!-- # CONFIGURE: the confirmed isolation -->\n";
  // Caches a test run leaves behind are not skill files.
  files["skills/harness-md/scripts/__pycache__/lint.cpython-312.pyc"] = "bytes\n";
  files["skills/harness-md/.pytest_cache/README.md"] = "cache\n";
  return files;
}

function assertIncludes(output: string, expected: string[]) {
  for (const text of expected) assert.ok(output.includes(text), `missing "${text}" in:\n${output}`);
}

test("check_skills passes with no skills directory", () => {
  const root = makeTree({ "plugin.json": "{}\n" });
  gitInit(root);
  const result = runScript("check_skills.ts", [], root);
  assert.equal(result.code, 0, result.output);
  assertIncludes(result.output, ["no skills"]);
});

test("check_skills passes on a consistent fixture and prints the description budget", () => {
  const root = makeTree(fixture());
  gitInit(root);
  const result = runScript("check_skills.ts", [], root);
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /gates-building\s+builder\s+\d+ \/ 240/);
  assert.match(result.output, /harness-build\s+workflow\s+\d+ \/ 400/);
  assert.match(result.output, /harness-md\s+other\s+\d+ \/ 700/);
  assert.match(result.output, /total\s+\d+ \/ 8000/);
  assert.equal(result.output.includes("WARN"), false, result.output);
});

test("check_skills reports every repository rule", () => {
  const files = fixture();
  // a builder without a phrase, with an unknown shared block, an orphan reference, a missing step
  files["skills/authority-building/SKILL.md"] = `${skill(
    "authority-building",
    "Authority rules. Use when asked.",
  )}\n## Workflow\n\n${STEPS.replace("### 4. Verify", "### 4. Check")}See [notes](references/notes.md) when unsure.\n<!-- shared:nothing-lands -->\ntext\n<!-- /shared:nothing-lands -->\n`;
  files["skills/authority-building/references/notes.md"] = "# Notes\n";
  files["skills/authority-building/references/orphan.md"] = "# Orphan\n";
  files["skills/authority-building/references/pending-decisions.md"] = "A\n";
  // a builder claiming another builder's layer, with steps out of order
  files["skills/gates-building/SKILL.md"] = `${skill(
    "gates-building",
    "Owns the Entropy layer. Use when handed over.",
  )}\n## Workflow\n\n### 2. Write the section\n\n### 1. Observe\n\n### 3. Build\n\n### 4. Verify\n\n### 5. Audit\n\n### 6. Hand back\n`;
  // a builder naming a layer that does not exist (lowercase)
  files["skills/feedback-building/SKILL.md"] = builder("Feedback").replace(
    "Owns the Feedback layer",
    "Owns the feedback layer",
  );
  // a builder over its description limit
  files["skills/completion-building/SKILL.md"] = builder("Completion").replace(
    "Use when a workflow hands it over.",
    `Use when ${"x".repeat(240)}.`,
  );
  // a workflow without the flag, with an ownership phrase, an install command, and bad links
  files["skills/harness-build/SKILL.md"] =
    `${skill("harness-build", "Builds a harness. Owns the Gates layer. Use when invoked.")}Install with \`npx skills add someone/skills\`.\nEscape [up](../harness-md/SKILL.md) when needed.\nMissing [file](references/none.md) when needed.\nRead [pending](references/pending-decisions.md) when blocked.\n`;
  files["skills/harness-build/references/pending-decisions.md"] = "B\n";
  // a non-workflow with the flag; script and asset hygiene; stray files
  files["skills/entropy-building/SKILL.md"] = `${skill(
    "entropy-building",
    "Owns the Entropy layer. Use when a build reaches it.",
    "disable-model-invocation: true\n",
  )}\n## Workflow\n\n${STEPS}Run [the check](assets/check_harness.py) and [sync](assets/sync.py) after depositing.\n`;
  files["skills/entropy-building/assets/check_harness.py"] = "print('no shebang')\n";
  files["skills/entropy-building/assets/sync.py"] = `${PY}x = '{{OWNER}}'\n`;
  files["skills/entropy-building/README.md"] = "# nope\n";
  files["skills/entropy-building/stray.txt"] = "x\n";
  files["skills/entropy-building/agents/other.yaml"] = "x: 1\n";
  // insertion markers: one where three are expected
  files["skills/knowledge-building/SKILL.md"] = builder(
    "Knowledge",
    "\nCopy [the template](assets/github/pull-request-template.md) when asked.\n",
  );
  files["skills/knowledge-building/assets/github/pull-request-template.md"] =
    "<!-- harness: spec-workflow -->\n";
  // the specification copy drifted
  files["skills/harness-md/references/specification.md"] = "# Specification (edited)\n";
  const root = makeTree(files);
  gitInit(root);
  writeTree(root, {
    "skills/environment-building/SKILL.md": `${builder("Environment", "\nRead [threat model](references/threat-model.md) when rating isolation.\n")}<!-- shared:design-is-not-approval -->\nA design is approval.\n<!-- /shared:design-is-not-approval -->\n`,
  });
  const result = runScript("check_skills.ts", [], root);
  assert.equal(result.code, 1, result.output);
  assertIncludes(result.output, [
    "skills/authority-building/SKILL.md: layer-ownership: description carries 0 ownership phrases",
    'skills/authority-building/SKILL.md: builder-steps: the fixed step heading "### 4. Verify" is missing',
    'shared block "nothing-lands" has no canon',
    "skills/authority-building/references/orphan.md: skill-file-reachable",
    "skills/gates-building/SKILL.md: layer-ownership: claims the Entropy layer",
    'skills/gates-building/SKILL.md: builder-steps: the step heading "### 2. Write the section" is out of order',
    'skills/feedback-building/SKILL.md: layer-ownership: "feedback" is not a layer',
    "skills/completion-building/SKILL.md: skill-description: description has",
    "limit 240 for a layer builder",
    "skills/harness-build/SKILL.md: workflow-invocation",
    "skills/harness-build/SKILL.md: layer-ownership: carries an ownership phrase",
    "skills/harness-build/SKILL.md:9: skill-no-install-cmd",
    "skills/harness-build/SKILL.md:10: skill-link-escape",
    "skills/harness-build/SKILL.md:11: skill-link",
    "skills/entropy-building/SKILL.md: workflow-invocation",
    "skills/entropy-building/assets/check_harness.py:1: script-shebang",
    "skills/entropy-building/assets/check_harness.py: script-pep723",
    "skills/entropy-building/assets/sync.py: asset-has-test",
    "skills/entropy-building/assets/sync.py:6: asset-no-placeholder",
    "skills/entropy-building/README.md: skill-structure",
    "skills/entropy-building/stray.txt: skill-structure",
    "skills/entropy-building/agents/other.yaml: skill-structure",
    "skills/environment-building/SKILL.md: shared-block",
    "pending-decisions-identical",
    "skills/knowledge-building/assets/github/: insertion-markers",
    "skills/harness-md/references/specification.md: specification-copy: differs from spec/spec.md",
    "skills/authority-building/SKILL.md: layer-builder: no skill owns the Authority layer",
    "skills/feedback-building/SKILL.md: layer-builder: no skill owns the Feedback layer",
    "skills/gates-building/SKILL.md: layer-builder: no skill owns the Gates layer",
    "skills/entropy-building/SKILL.md: layer-builder: 2 skills own the Entropy layer",
  ]);
});

test("check_skills fails when the descriptions exceed the shared budget", () => {
  const files = fixture();
  for (let i = 0; i < 12; i++) {
    files[`skills/extra-${i}/SKILL.md`] = skill(
      `extra-${i}`,
      `Extra skill. Use when ${"y".repeat(660)}.`,
    );
  }
  const root = makeTree(files);
  gitInit(root);
  const result = runScript("check_skills.ts", [], root);
  assert.equal(result.code, 1, result.output);
  assertIncludes(result.output, ["skills/: skill-description-total: all descriptions together"]);
});

test("check_skills warns without failing", () => {
  const files = fixture();
  files["skills/environment-building/SKILL.md"] = `${skill(
    "environment-building",
    "Owns the Environment layer. Use when handed over.",
    "compatibility: none needed\n",
  )}\n## Workflow\n\n${STEPS}Read [threat model](references/threat-model.md).\n${"Long line of body text.\n".repeat(520)}`;
  const root = makeTree(files);
  gitInit(root);
  const result = runScript("check_skills.ts", [], root);
  assert.equal(result.code, 0, result.output);
  assertIncludes(result.output, [
    "WARN skills/environment-building/SKILL.md: skill-compatibility",
    "WARN skills/environment-building/SKILL.md: skill-body-size",
    "skill-pointer-has-trigger",
  ]);
});
