import assert from "node:assert/strict";
import { test } from "node:test";
import type { FileSpec } from "./lib/testing.ts";
import { gitInit, makeTree, runScript, writeTree } from "./lib/testing.ts";

function readme(lang: "zh" | "en", rows: string[]): string {
  const heading = lang === "zh" ? "## 技能" : "## Skills";
  const other = lang === "zh" ? "[English](README.md)" : "[中文](README.zh.md)";
  // One row per link style the READMEs use: plain and code-formatted link text.
  const table = rows
    .map((r, i) =>
      i % 2 ? `| [\`${r}\`](skills/${r}/SKILL.md) | x |` : `| [${r}](skills/${r}/) | x |`,
    )
    .join("\n");
  return `# Fixture\n\n${other}\n\n${heading}\n\n| Skill | Purpose |\n|---|---|\n${table}\n`;
}

const DESIGN = ".agents/knowledge/project-harness/SKILL.md";

/** The SKILL.md of a HARNESS.md named `name`, with both marker halves unless told otherwise. */
function design(name: string, description = "[HARNESS.md] Fixture.", type = "harness-design") {
  return `---\nname: ${name}\ndescription: >-\n  ${description}\nmetadata:\n  type: ${type}\n---\n\n# Fixture\n`;
}

function harness(): Record<string, FileSpec> {
  return {
    "AGENTS.md": `# Fixture\n\nRead [the guide](.agents/knowledge/guide.md). Run \`just check\`.\nScripts live in \`scripts/tool.ts\`; build output goes to \`scripts/out/\`; entries are \`scripts/<name>.ts\`.\nThe design is \`${DESIGN}\`.\n`,
    [DESIGN]: design("project-harness"),
    justfile: "check:\n    echo ok\n",
    ".gitignore": "scripts/out/\n",
    "scripts/tool.ts": "// tool\n",
    ".agents/knowledge/guide.md": "# Guide\n",
    ".agents/skills/helper/SKILL.md":
      "---\nname: helper\ndescription: Fixture project skill.\n---\n",
    ".claude/skills/helper": { symlink: "../../.agents/skills/helper" },
    "README.md": readme("en", ["alpha", "beta"]),
    "README.zh.md": readme("zh", ["alpha", "beta"]),
    "skills/alpha/SKILL.md": "---\nname: alpha\ndescription: x\n---\n",
    "skills/beta/SKILL.md": "---\nname: beta\ndescription: x\n---\n",
    "spec/spec.md": "# Spec\n\n## One\n\n```md\n## Not a heading\n```\n\n### Detail\n",
    "spec/spec.zh.md": "# 规范\n\n## 一\n\n### 细节\n",
  };
}

function assertIncludes(output: string, expected: string[]) {
  for (const text of expected) assert.ok(output.includes(text), `missing "${text}" in:\n${output}`);
}

test("check_harness passes on a consistent fixture harness", () => {
  const root = makeTree(harness());
  gitInit(root);
  const result = runScript("check_harness.ts", [], root);
  assert.equal(result.code, 0, result.output);
});

test("check_harness reports broken links, paths, recipes, unreachable knowledge, and link drift", () => {
  const files = harness();
  files["AGENTS.md"] =
    "# Fixture\n\nRead [the guide](.agents/knowledge/missing.md). Run `just nope`.\nSee `scripts/gone.ts:12` and `.agents/knowledge/guide.md`.\n";
  files["CLAUDE.md"] = "Rules of my own.\n";
  files[".agents/knowledge/orphan.md"] = "# Orphan\n";
  files[".claude/skills/helper"] = "not a link\n";
  files[".agents/skills/Bad/SKILL.md"] = "---\nname: bad\ndescription: x\n---\n";
  files.dangling = { symlink: "nowhere" };
  delete files[DESIGN];
  const root = makeTree(files);
  gitInit(root);
  writeTree(root, { "AGENTS.md": files["AGENTS.md"] + Array(130).fill("line").join("\n") });
  const result = runScript("check_harness.ts", [], root);
  assert.equal(result.code, 1, result.output);
  assertIncludes(result.output, [
    "AGENTS.md:3: doc-link",
    "AGENTS.md:3: doc-recipe",
    "AGENTS.md:4: doc-path: names `scripts/gone.ts`",
    "AGENTS.md: entrypoint-budget",
    "CLAUDE.md: claude-import",
    `${DESIGN}: design: file is missing`,
    ".agents/knowledge/orphan.md: knowledge-reachable",
    ".agents/skills/Bad/SKILL.md: skill-name",
    ".claude/skills/helper: claude-skill-link",
    "dangling: dangling-symlink",
  ]);
  assert.equal(result.output.includes("guide.md`, which does not exist"), false, result.output);
});

test("check_harness requires the design to carry both markers and to be named by AGENTS.md", () => {
  const files = harness();
  files["AGENTS.md"] = "# Fixture\n\nRead [the guide](.agents/knowledge/guide.md).\n";
  files[DESIGN] = design("project-harness", "Fixture.");
  const root = makeTree(files);
  gitInit(root);
  const unnamed = runScript("check_harness.ts", [], root);
  assert.equal(unnamed.code, 1, unnamed.output);
  assertIncludes(unnamed.output, [
    `${DESIGN}: design-marker: the description does not start with \`[HARNESS.md]\``,
    `${DESIGN}: design-named: not named in AGENTS.md`,
    "check_harness: 2 finding(s)",
  ]);

  // Without the type marker the directory is no unit: only the marker is
  // missing here, because AGENTS.md names the file.
  writeTree(root, {
    "AGENTS.md": harness()["AGENTS.md"] as string,
    [DESIGN]: design("project-harness", "[HARNESS.md] Fixture.", "skill"),
  });
  const untyped = runScript("check_harness.ts", [], root);
  assert.equal(untyped.code, 1, untyped.output);
  assertIncludes(untyped.output, [
    `${DESIGN}: design-marker: the frontmatter lacks \`metadata.type: harness-design\``,
    "check_harness: 1 finding(s)",
  ]);
});

test("check_harness treats a type-marked directory in the knowledge folder as one unit", () => {
  const files = harness();
  // Files inside the design's directory: not named by AGENTS.md, and naming a
  // path that does not exist, which a knowledge file may not do.
  files[".agents/knowledge/project-harness/references/gates.md"] =
    "# Gates\n\nAn example layout keeps `scripts/gone.ts` beside the checks.\n";
  files[".agents/knowledge/project-harness/scripts/check.sh"] = "#!/bin/sh\n";
  const root = makeTree(files);
  gitInit(root);
  const clean = runScript("check_harness.ts", [], root);
  assert.equal(clean.code, 0, clean.output);

  // A second marked directory: its SKILL.md has to be named, its other files do not.
  // An unmarked directory is ordinary knowledge files, each held to the rules.
  writeTree(root, {
    ".agents/knowledge/reference-design/SKILL.md": design("reference-design"),
    ".agents/knowledge/reference-design/notes.md": "# Notes\n\nSee `scripts/gone.ts`.\n",
    ".agents/knowledge/plain/SKILL.md": "---\nname: plain\ndescription: Plain.\n---\n\n# Plain\n",
    ".agents/knowledge/plain/notes.md": "# Notes\n\nSee `scripts/gone.ts`.\n",
  });
  gitInit(root);
  const result = runScript("check_harness.ts", [], root);
  assert.equal(result.code, 1, result.output);
  assertIncludes(result.output, [
    ".agents/knowledge/reference-design/SKILL.md: knowledge-reachable",
    ".agents/knowledge/plain/SKILL.md: knowledge-reachable",
    ".agents/knowledge/plain/notes.md: knowledge-reachable",
    ".agents/knowledge/plain/notes.md:3: doc-path: names `scripts/gone.ts`",
    "check_harness: 4 finding(s)",
  ]);
});

test("check_harness does not take a marked SKILL.md at the knowledge root for a unit", () => {
  const files = harness();
  // A marked SKILL.md directly in the knowledge folder must not exempt the
  // knowledge files beside it.
  files[".agents/knowledge/SKILL.md"] = design("knowledge");
  files[".agents/knowledge/orphan.md"] = "# Orphan\n";
  const root = makeTree(files);
  gitInit(root);
  const result = runScript("check_harness.ts", [], root);
  assert.equal(result.code, 1, result.output);
  assertIncludes(result.output, [
    ".agents/knowledge/SKILL.md: knowledge-reachable",
    ".agents/knowledge/orphan.md: knowledge-reachable",
  ]);
});

test("check_harness still checks links and recipes inside a marked directory", () => {
  const files = harness();
  files[DESIGN] = `${design("project-harness")}\nRun \`just nope\`; see [the gates](gates.md).\n`;
  const root = makeTree(files);
  gitInit(root);
  const result = runScript("check_harness.ts", [], root);
  assert.equal(result.code, 1, result.output);
  assertIncludes(result.output, [
    `${DESIGN}:11: doc-link: link target gates.md does not exist`,
    `${DESIGN}:11: doc-recipe: mentions \`just nope\``,
  ]);
});

test("check_harness mirrors the READMEs and the specification", () => {
  const files = harness();
  files["README.zh.md"] = readme("zh", ["alpha"]);
  files["skills/gamma/SKILL.md"] = "---\nname: gamma\ndescription: x\n---\n";
  files["spec/spec.zh.md"] = "# 规范\n\n## 一\n\n## 二\n";
  const root = makeTree(files);
  gitInit(root);
  const result = runScript("check_harness.ts", [], root);
  assert.equal(result.code, 1, result.output);
  assertIncludes(result.output, [
    "README.zh.md: readme-mirror: skill table lacks the row for beta, which README.md lists",
    "README.md: readme-skill-table: skill table has no row for skills/gamma",
    "README.zh.md: readme-skill-table: skill table has no row for skills/gamma",
    "spec/spec.zh.md: spec-mirror: has 2 level-2 heading(s); spec/spec.md has 1",
    "spec/spec.zh.md: spec-mirror: has 0 level-3 heading(s); spec/spec.md has 1",
  ]);
  writeTree(root, {
    "README.md": readme("en", ["alpha", "beta", "gamma"]),
    "README.zh.md": readme("zh", ["alpha", "beta", "gamma"]),
    "spec/spec.zh.md": "# 规范\n\n## 一\n\n### 细节\n",
  });
  const fixed = runScript("check_harness.ts", [], root);
  assert.equal(fixed.code, 0, fixed.output);
});

test("check_harness reports a missing README mirror and specification mirror", () => {
  const files = harness();
  delete files["README.zh.md"];
  delete files["spec/spec.zh.md"];
  const root = makeTree(files);
  gitInit(root);
  const result = runScript("check_harness.ts", [], root);
  assert.equal(result.code, 1, result.output);
  assertIncludes(result.output, [
    "README.zh.md: readme-mirror: file is missing",
    "spec/spec.zh.md: spec-mirror: file is missing",
  ]);
});
