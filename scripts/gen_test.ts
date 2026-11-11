import assert from "node:assert/strict";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fixturePlugin, MANIFEST, makeTree, runScript } from "./lib/testing.ts";

test("gen writes every client file, is deterministic, and --check passes afterwards", () => {
  const root = makeTree(fixturePlugin());
  const first = runScript("gen.ts", [], root);
  assert.equal(first.code, 0, first.output);
  const read = (p: string) => readFileSync(join(root, p), "utf8");
  const second = runScript("gen.ts", [], root);
  assert.equal(second.code, 0, second.output);
  assert.equal(second.output.includes("wrote"), false, "second run must write nothing");
  const check = runScript("gen.ts", ["--check"], root);
  assert.equal(check.code, 0, check.output);

  const claude = JSON.parse(read(".claude-plugin/plugin.json"));
  assert.deepEqual(claude.agents, ["./com.anthropic.claude-code/agents/reviewer.md"]);
  assert.equal(claude.mcpServers, undefined, "the plugin ships no MCP server");
  assert.equal(claude.$schema, undefined, "Claude manifest must not carry the spec $schema");
  assert.equal(claude.extensions, undefined, "Claude manifest must not carry other clients' data");
  const claudeMarket = JSON.parse(read(".claude-plugin/marketplace.json"));
  assert.equal(claudeMarket.plugins[0].source, "./");
  assert.deepEqual(claudeMarket.owner, { name: "Fixture Team" });
  const market = JSON.parse(read(".agents/plugins/marketplace.json"));
  assert.deepEqual(market.plugins[0].source, { source: "local", path: "./" });
  assert.equal(market.plugins[0].category, "Productivity");

  const list = runScript("gen.ts", ["--list"], root);
  assert.deepEqual(list.output.trim().split("\n"), [
    ".agents/plugins/marketplace.json",
    ".claude-plugin/marketplace.json",
    ".claude-plugin/plugin.json",
  ]);
});

test("gen --check reports stale and missing files", () => {
  const root = makeTree(fixturePlugin());
  assert.equal(runScript("gen.ts", [], root).code, 0);
  writeFileSync(join(root, ".claude-plugin/plugin.json"), "{}\n");
  rmSync(join(root, ".agents/plugins/marketplace.json"));
  const check = runScript("gen.ts", ["--check"], root);
  assert.equal(check.code, 1);
  assert.match(check.output, /\.claude-plugin\/plugin\.json: gen-stale/);
  assert.match(check.output, /\.agents\/plugins\/marketplace\.json: gen-missing/);
});

test("gen rejects a manifest that violates the schema or lacks the Codex category", () => {
  const root = makeTree({ ...fixturePlugin(), "plugin.json": JSON.stringify({ name: 7 }) });
  const result = runScript("gen.ts", [], root);
  assert.equal(result.code, 2);
  assert.match(result.output, /plugin\.json violates the Agent Plugins schema/);

  const noCategory = structuredClone(MANIFEST) as Record<string, unknown>;
  delete noCategory.extensions;
  const bare = makeTree({ ...fixturePlugin(), "plugin.json": JSON.stringify(noCategory) });
  const missing = runScript("gen.ts", [], bare);
  assert.equal(missing.code, 2);
  assert.match(missing.output, /interface\.category is missing/);

  const flag = runScript("gen.ts", ["--nope"], root);
  assert.equal(flag.code, 2);
});
