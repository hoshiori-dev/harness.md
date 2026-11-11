#!/usr/bin/env node
// Generates the client-specific files that can be derived from the portable
// plugin manifest (plugin.json) and the agents directory of a client whose
// plugin system carries agents:
//
//   Claude Code   .claude-plugin/plugin.json, .claude-plugin/marketplace.json
//   Codex         .agents/plugins/marketplace.json
//   Antigravity   nothing: it reads plugin.json and skills/ natively
//
// The clients are those registered in lib/clients.ts. The plugin ships no MCP
// server, so there is no MCP conversion.
//
//   gen.ts            write files that differ from the expected content
//   gen.ts --check    write nothing; report STALE and MISSING files
//   gen.ts --list     print the paths this run would generate
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { ClientSpec } from "./lib/clients.ts";
import { CLIENTS } from "./lib/clients.ts";
import { exists, Findings, fail, listDir, readText } from "./lib/findings.ts";
import type { PluginManifest } from "./lib/plugin.ts";
import { loadManifest, pick, stableJson } from "./lib/plugin.ts";

const METADATA_KEYS = [
  "name",
  "version",
  "description",
  "author",
  "homepage",
  "repository",
  "license",
  "keywords",
] as const;

const root = process.cwd();
const flags = new Set(process.argv.slice(2));
for (const flag of flags) {
  if (flag !== "--check" && flag !== "--list") fail(`unknown flag ${flag}; use --check or --list`);
}

const { manifest, errors: manifestErrors } = loadManifest(root);
if (manifestErrors.length > 0) {
  fail(`plugin.json violates the Agent Plugins schema:\n  ${manifestErrors.join("\n  ")}`);
}

const expected = new Map<string, string>();
for (const client of CLIENTS) {
  for (const [path, content] of generate(client, manifest)) expected.set(path, content);
}

if (flags.has("--list")) {
  for (const path of [...expected.keys()].sort()) console.log(path);
  process.exit(0);
}

const findings = new Findings();
for (const [path, content] of [...expected].sort()) {
  const full = join(root, path);
  const current = exists(full) ? readText(full) : null;
  if (current === content) continue;
  if (flags.has("--check")) {
    findings.add({
      file: path,
      rule: current === null ? "gen-missing" : "gen-stale",
      problem:
        current === null
          ? "generated file is missing."
          : "generated file differs from its sources.",
      fix: "run `just gen` and commit the result.",
    });
    continue;
  }
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
  console.log(`wrote ${path}`);
}
process.exit(findings.report(flags.has("--check") ? "gen --check" : "gen"));

function generate(client: ClientSpec, manifest: PluginManifest): [string, string][] {
  switch (client.id) {
    case "claude-code":
      return generateClaudeCode(client, manifest);
    case "antigravity":
      return [];
    case "codex":
      return generateCodex(manifest);
  }
}

function agentFiles(client: ClientSpec): string[] {
  const spec = client.agents;
  if (!spec) return [];
  const dir = join(root, spec.dir);
  if (!exists(dir)) return [];
  return listDir(dir)
    .filter((e) => e.isFile && e.name.endsWith(spec.ext))
    .map((e) => `${spec.dir}/${e.name}`);
}

function generateClaudeCode(client: ClientSpec, manifest: PluginManifest): [string, string][] {
  const out: [string, string][] = [];
  // Only fields Claude Code knows: an unknown top-level key fails `claude plugin validate --strict`.
  const claude: Record<string, unknown> = pick(manifest, METADATA_KEYS);
  const agents = agentFiles(client).map((p) => `./${p}`);
  if (agents.length > 0) claude.agents = agents;
  out.push([".claude-plugin/plugin.json", stableJson(claude)]);
  // A marketplace at the repository root lets Claude Code install the plugin
  // straight from GitHub: /plugin marketplace add <owner>/<repo>.
  const marketplace: Record<string, unknown> = { name: manifest.name };
  if (manifest.author?.name !== undefined) marketplace.owner = { name: manifest.author.name };
  if (manifest.description !== undefined) marketplace.description = manifest.description;
  marketplace.plugins = [{ name: manifest.name, source: "./", description: manifest.description }];
  out.push([".claude-plugin/marketplace.json", stableJson(marketplace)]);
  return out;
}

function generateCodex(manifest: PluginManifest): [string, string][] {
  const iface = (
    manifest.extensions?.["com.openai"] as { interface?: { category?: string } } | undefined
  )?.interface;
  if (iface?.category === undefined) {
    fail(
      'plugin.json: extensions.com.openai.interface.category is missing; the Codex marketplace entry requires a category. Fix: add it (for example "Productivity").',
    );
  }
  const marketplace = {
    name: manifest.name,
    plugins: [
      {
        name: manifest.name,
        source: { source: "local", path: "./" },
        policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
        category: iface.category,
      },
    ],
  };
  return [[".agents/plugins/marketplace.json", stableJson(marketplace)]];
}
