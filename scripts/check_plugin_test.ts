import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fixturePlugin, MANIFEST, makeTree, runScript, writeTree } from "./lib/testing.ts";

function assertIncludes(output: string, expected: string[]) {
  for (const text of expected) assert.ok(output.includes(text), `missing "${text}" in:\n${output}`);
}

test("check_plugin passes on the fixture plugin", () => {
  const root = makeTree(fixturePlugin());
  const result = runScript("check_plugin.ts", [], root);
  assert.equal(result.code, 0, result.output);
});

test("check_plugin reports layout and wiring findings", () => {
  const root = makeTree(fixturePlugin());
  writeTree(root, {
    "skills/beta/SKILL.md": "---\nname: Beta\ndescription: x\n---\n",
    "skills/empty/notes.md": "no SKILL.md here\n",
    ".agents/skills/alpha/SKILL.md": "---\nname: alpha\ndescription: project skill\n---\n",
    "com.openai/agents/rogue.md": "---\nname: rogue\ndescription: Codex cannot ship this.\n---\n",
    "com.anthropic.claude-code/agents/other.md": "---\nname: mismatch\ndescription: x\n---\n",
    "openspec/specs/agent/ghost/spec.md": "# ghost\n",
    "mcp.json": "{}\n",
  });
  rmSync(join(root, "openspec/specs/skill/alpha/spec.md"));
  const result = runScript("check_plugin.ts", [], root);
  assert.equal(result.code, 1);
  assertIncludes(result.output, [
    "skills/beta/SKILL.md: skill-name",
    "skills/empty/: skill-shape",
    "skills/alpha/SKILL.md: skill-name-collision",
    "com.openai/agents: agent-unsupported",
    "com.anthropic.claude-code/agents/other.md: agent-name",
    "mcp.json: mcp-unsupported",
    "openspec/specs/skill/alpha/spec.md: catalog-missing-spec",
    "openspec/specs/agent/ghost/spec.md: catalog-orphan-spec",
    "openspec/specs/skill/beta/spec.md: catalog-missing-spec",
  ]);
});

test("check_plugin requires the Codex extension block and config for a supported Codex", () => {
  const files = fixturePlugin();
  files[".codex/config.toml"] =
    '# [plugins."fixture-plugin@fixture-plugin"]\n[plugins."fixture-plugin@fixture-plugin"]\nenabled = false\n\n[other]\nenabled = true\n';
  const root = makeTree(files);
  const result = runScript("check_plugin.ts", [], root);
  assert.equal(result.code, 1);
  assertIncludes(result.output, [".codex/config.toml: codex-plugin-enabled"]);

  const manifest = structuredClone(MANIFEST) as Record<string, unknown>;
  manifest.extensions = { "com.example": {} };
  writeTree(root, { "plugin.json": `${JSON.stringify(manifest)}\n` });
  const noBlock = runScript("check_plugin.ts", [], root);
  assertIncludes(noBlock.output, [
    "plugin.json: extension-namespace",
    "plugin.json: codex-extension",
  ]);
});

test("check_plugin skips catalogs loudly when openspec is absent", () => {
  const root = makeTree(fixturePlugin());
  rmSync(join(root, "openspec"), { recursive: true });
  const result = runScript("check_plugin.ts", [], root);
  assert.equal(result.code, 0, result.output);
  assertIncludes(result.output, ["openspec/specs is absent; catalog checks skipped"]);
});

test("check_plugin --footprint lists a client's files", () => {
  const root = makeTree(fixturePlugin());
  runScript("gen.ts", [], root);
  const claude = runScript("check_plugin.ts", ["--footprint", "claude-code"], root);
  assert.equal(claude.code, 0);
  assert.deepEqual(claude.output.trim().split("\n"), [
    ".claude-plugin/marketplace.json",
    ".claude-plugin/plugin.json",
    "com.anthropic.claude-code",
  ]);
  const codex = runScript("check_plugin.ts", ["--footprint", "codex"], root);
  assert.deepEqual(codex.output.trim().split("\n"), [
    ".agents/plugins/marketplace.json",
    ".codex/config.toml",
  ]);
  const unknown = runScript("check_plugin.ts", ["--footprint", "nope"], root);
  assert.equal(unknown.code, 2);
});

test("check_plugin accepts an entry whose spec an unarchived change proposes", () => {
  const root = makeTree(fixturePlugin());
  rmSync(join(root, "openspec/specs/skill/alpha/spec.md"));
  writeTree(root, { "openspec/changes/add-alpha/specs/skill/alpha/spec.md": "# Spec Delta\n" });
  const pending = runScript("check_plugin.ts", [], root);
  assert.equal(pending.code, 0, pending.output);
  writeTree(root, {
    "openspec/changes/archive/2026-01-01-old/specs/skill/alpha/spec.md": "# Spec Delta\n",
  });
  rmSync(join(root, "openspec/changes/add-alpha"), { recursive: true });
  const archivedOnly = runScript("check_plugin.ts", [], root);
  assert.equal(archivedOnly.code, 1);
  assertIncludes(archivedOnly.output, ["openspec/specs/skill/alpha/spec.md: catalog-missing-spec"]);
});
