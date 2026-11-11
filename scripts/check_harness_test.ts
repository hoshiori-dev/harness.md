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

function harness(): Record<string, FileSpec> {
  return {
    "AGENTS.md":
      "# Fixture\n\nRead [the guide](.agents/knowledge/guide.md). Run `just check`.\nScripts live in `scripts/tool.ts`; build output goes to `scripts/out/`; entries are `scripts/<name>.ts`.\n",
    "HARNESS.md": "---\nname: fixture\ndescription: Fixture.\n---\n\n## Overview\n",
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
  delete files["HARNESS.md"];
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
    "HARNESS.md: design",
    ".agents/knowledge/orphan.md: knowledge-reachable",
    ".agents/skills/Bad/SKILL.md: skill-name",
    ".claude/skills/helper: claude-skill-link",
    "dangling: dangling-symlink",
  ]);
  assert.equal(result.output.includes("guide.md`, which does not exist"), false, result.output);
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
