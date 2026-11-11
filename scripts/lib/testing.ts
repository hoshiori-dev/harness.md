// Helpers for the management-code tests: build a throwaway repository from a
// file map and run a script against it as a subprocess, the way `just` does.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type FileSpec = string | { symlink: string };

/** Creates a temp directory holding `files`; keys are relative paths. */
export function makeTree(files: Record<string, FileSpec>): string {
  const root = mkdtempSync(join(tmpdir(), "hmd-test-"));
  writeTree(root, files);
  return root;
}

export function writeTree(root: string, files: Record<string, FileSpec>): void {
  for (const [path, spec] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(dirname(full), { recursive: true });
    if (typeof spec === "string") writeFileSync(full, spec);
    else symlinkSync(spec.symlink, full);
  }
}

const scriptsDir = fileURLToPath(new URL("../", import.meta.url));

/** Runs scripts/<script> with cwd=root; returns exit code and combined output. */
export function runScript(
  script: string,
  args: string[],
  root: string,
  env: Record<string, string> = {},
): { code: number; output: string } {
  const result = spawnSync(process.execPath, [join(scriptsDir, script), ...args], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, ...env },
  });
  if (result.error) throw result.error;
  return { code: result.status ?? -1, output: result.stdout + result.stderr };
}

/** `git init` plus `git add -A`, so the scripts that read `git ls-files` see the tree. */
export function gitInit(root: string): void {
  for (const args of [
    ["init", "-q"],
    ["add", "-A"],
  ]) {
    const r = spawnSync("git", args, { cwd: root, encoding: "utf8" });
    if (r.status !== 0) throw new Error(r.stderr);
  }
}

export const MANIFEST = {
  $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  name: "fixture-plugin",
  version: "1.2.3",
  description: "Fixture plugin.",
  author: { name: "Fixture Team" },
  homepage: "https://example.com/fixture",
  extensions: {
    "com.openai": {
      interface: {
        displayName: "Fixture",
        shortDescription: "Fixture plugin.",
        developerName: "Fixture Team",
        category: "Productivity",
        websiteURL: "https://example.com/fixture",
      },
    },
  },
};

const skill = (name: string) =>
  `---\nname: ${name}\ndescription: Fixture skill ${name}. Use when testing.\n---\n# ${name}\n`;
const mdAgent = (name: string) => `---\nname: ${name}\ndescription: Fixture agent.\n---\nBody.\n`;

/** A complete, valid plugin for every registered client. */
export function fixturePlugin(): Record<string, FileSpec> {
  return {
    "plugin.json": `${JSON.stringify(MANIFEST, null, 2)}\n`,
    "skills/alpha/SKILL.md": skill("alpha"),
    "com.anthropic.claude-code/agents/reviewer.md": mdAgent("reviewer"),
    ".codex/config.toml": '[plugins."fixture-plugin@fixture-plugin"]\nenabled = true\n',
    "openspec/specs/skill/spec.md": "# Skill Catalog\n",
    "openspec/specs/skill/alpha/spec.md": "# alpha\n",
    "openspec/specs/agent/spec.md": "# Agent Catalog\n",
    "openspec/specs/agent/reviewer/spec.md": "# reviewer\n",
  };
}
