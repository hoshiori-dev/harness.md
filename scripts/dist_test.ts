import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { test } from "node:test";
import { fixturePlugin, makeTree, runScript } from "./lib/testing.ts";

function git(root: string, ...args: string[]) {
  const r = spawnSync(
    "git",
    ["-c", "user.name=t", "-c", "user.email=t@example.com", "-c", "commit.gpgsign=false", ...args],
    {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1" },
    },
  );
  if (r.status !== 0) throw new Error(r.stderr);
}

test("dist archives the portable plugin with every client's generated files", () => {
  const root = makeTree({
    ...fixturePlugin(),
    LICENSE: "license\n",
    "spec/spec.md": "# not shipped\n",
    "hub/demo/HARNESS.md": "# not shipped\n",
  });
  assert.equal(runScript("gen.ts", [], root).code, 0);
  git(root, "init", "-q");
  git(root, "add", "-A");
  git(root, "commit", "-q", "-m", "fixture");
  const result = runScript("dist.ts", ["--tag", "v1.2.3"], root);
  assert.equal(result.code, 0, result.output);
  const list = spawnSync("unzip", ["-Z1", join(root, "dist/fixture-plugin-1.2.3.zip")], {
    encoding: "utf8",
  });
  assert.equal(list.status, 0, `unzip failed: ${list.stderr}`);
  const entries = list.stdout.trim().split("\n");
  for (const expected of [
    "fixture-plugin/plugin.json",
    "fixture-plugin/LICENSE",
    "fixture-plugin/skills/alpha/SKILL.md",
    "fixture-plugin/.claude-plugin/plugin.json",
    "fixture-plugin/.claude-plugin/marketplace.json",
    "fixture-plugin/com.anthropic.claude-code/agents/reviewer.md",
    "fixture-plugin/.agents/plugins/marketplace.json",
  ]) {
    assert.ok(entries.includes(expected), `missing ${expected} in ${entries.join(", ")}`);
  }
  for (const prefix of ["openspec/", "spec/", "hub/", ".codex/"]) {
    assert.equal(
      entries.some((e) => e.startsWith(`fixture-plugin/${prefix}`)),
      false,
      `${prefix} is not shipped`,
    );
  }
});

test("dist rejects a tag that does not match the manifest version", () => {
  const root = makeTree(fixturePlugin());
  const mismatch = runScript("dist.ts", ["--tag", "v9.9.9"], root);
  assert.equal(mismatch.code, 2);
  assert.match(mismatch.output, /does not match plugin\.json version 1\.2\.3/);
  const malformed = runScript("dist.ts", ["--tag", "1.2.3"], root);
  assert.equal(malformed.code, 2);
  assert.match(malformed.output, /is not vX\.Y\.Z/);
});
