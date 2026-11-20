import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fixturePlugin, MANIFEST, makeTree, runScript, writeTree } from "./lib/testing.ts";

const RETIRE_META = "schema: spec-driven\nretire_capabilities: true\n";

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

test("check_plugin accepts an entry whose spec an unarchived retiring change removes completely", () => {
  const mainSpec =
    "# alpha\n\n## Requirements\n\n### Requirement: First\n\n### Requirement: Second\n";

  // Standard bare requirement headings
  const root = makeTree(fixturePlugin());
  rmSync(join(root, "skills/alpha"), { recursive: true });
  writeTree(root, {
    "openspec/specs/skill/alpha/spec.md": mainSpec,
    "openspec/changes/drop-alpha/.openspec.yaml": RETIRE_META,
    "openspec/changes/drop-alpha/specs/skill/alpha/spec.md":
      "# Spec Delta\n\n## REMOVED Requirements\n\n### Requirement: First\n\n### Requirement: Second\n",
  });
  const full = runScript("check_plugin.ts", [], root);
  assert.equal(full.code, 0, full.output);

  // Case-insensitive and repeated section headings
  const ciRoot = makeTree(fixturePlugin());
  rmSync(join(ciRoot, "skills/alpha"), { recursive: true });
  writeTree(ciRoot, {
    "openspec/specs/skill/alpha/spec.md": mainSpec,
    "openspec/changes/drop-alpha/.openspec.yaml": RETIRE_META,
    "openspec/changes/drop-alpha/specs/skill/alpha/spec.md":
      "# Spec Delta\n\n## Removed Requirements\n\n### Requirement: First\n\n## removed requirements\n\n### Requirement: Second\n",
  });
  const ciResult = runScript("check_plugin.ts", [], ciRoot);
  assert.equal(ciResult.code, 0, ciResult.output);

  // Bullet-form removal entries (`-`, `*` with backticks, `+` with embedded backticks)
  const bulletMain =
    "# alpha\n\n## Requirements\n\n### Requirement: First\n\n### Requirement: Second\n\n### Requirement: Use `x`\n";
  const bulletRoot = makeTree(fixturePlugin());
  rmSync(join(bulletRoot, "skills/alpha"), { recursive: true });
  writeTree(bulletRoot, {
    "openspec/specs/skill/alpha/spec.md": bulletMain,
    "openspec/changes/drop-alpha/.openspec.yaml": RETIRE_META,
    "openspec/changes/drop-alpha/specs/skill/alpha/spec.md":
      "# Spec Delta\n\n## REMOVED Requirements\n\n- ### Requirement: First\n* `### Requirement: Second`\n+ ### Requirement: Use `x`\n",
  });
  const bulletResult = runScript("check_plugin.ts", [], bulletRoot);
  assert.equal(bulletResult.code, 0, bulletResult.output);
});

test("check_plugin rejects partial, mixed, fenced, empty, archived, unretired, and symlinked spec removals", () => {
  const mainSpec =
    "# alpha\n\n## Requirements\n\n### Requirement: First\n\n### Requirement: Second\n";

  // Partial removal (with retire_capabilities declared)
  const partialRoot = makeTree(fixturePlugin());
  rmSync(join(partialRoot, "skills/alpha"), { recursive: true });
  writeTree(partialRoot, {
    "openspec/specs/skill/alpha/spec.md": mainSpec,
    "openspec/changes/drop-alpha/.openspec.yaml": RETIRE_META,
    "openspec/changes/drop-alpha/specs/skill/alpha/spec.md":
      "# Spec Delta\n\n## REMOVED Requirements\n\n### Requirement: First\n",
  });
  const partial = runScript("check_plugin.ts", [], partialRoot);
  assert.equal(partial.code, 1);
  assertIncludes(partial.output, ["openspec/specs/skill/alpha/spec.md: catalog-orphan-spec"]);

  // Mixed delta with ADDED, MODIFIED, or RENAMED
  for (const extra of [
    "## ADDED Requirements\n\n### Requirement: Third\n",
    "## MODIFIED Requirements\n\n### Requirement: Second\n",
    "## RENAMED Requirements\n- FROM: ### Requirement: A\n- TO: ### Requirement: B\n",
  ]) {
    const mixedRoot = makeTree(fixturePlugin());
    rmSync(join(mixedRoot, "skills/alpha"), { recursive: true });
    writeTree(mixedRoot, {
      "openspec/specs/skill/alpha/spec.md": mainSpec,
      "openspec/changes/drop-alpha/.openspec.yaml": RETIRE_META,
      "openspec/changes/drop-alpha/specs/skill/alpha/spec.md": `# Spec Delta\n\n## REMOVED Requirements\n\n### Requirement: First\n\n### Requirement: Second\n\n${extra}`,
    });
    const mixed = runScript("check_plugin.ts", [], mixedRoot);
    assert.equal(mixed.code, 1);
    assertIncludes(mixed.output, ["openspec/specs/skill/alpha/spec.md: catalog-orphan-spec"]);
  }

  // Requirement inside top-level and list-item fenced code blocks
  for (const fencedDelta of [
    "# Spec Delta\n\n## REMOVED Requirements\n\n### Requirement: First\n\n```markdown\n### Requirement: Second\n```\n",
    "# Spec Delta\n\n## REMOVED Requirements\n\n### Requirement: First\n\n- ```markdown\n  ### Requirement: Second\n  ```\n",
    "# Spec Delta\n\n## REMOVED Requirements\n\n### Requirement: First\n\n- ```markdown\n  - ### Requirement: Second\n  ```\n",
  ]) {
    const fencedRoot = makeTree(fixturePlugin());
    rmSync(join(fencedRoot, "skills/alpha"), { recursive: true });
    writeTree(fencedRoot, {
      "openspec/specs/skill/alpha/spec.md": mainSpec,
      "openspec/changes/drop-alpha/.openspec.yaml": RETIRE_META,
      "openspec/changes/drop-alpha/specs/skill/alpha/spec.md": fencedDelta,
    });
    const fenced = runScript("check_plugin.ts", [], fencedRoot);
    assert.equal(fenced.code, 1);
    assertIncludes(fenced.output, ["openspec/specs/skill/alpha/spec.md: catalog-orphan-spec"]);
  }

  // Requirement-less main spec
  const emptyRoot = makeTree(fixturePlugin());
  rmSync(join(emptyRoot, "skills/alpha"), { recursive: true });
  writeTree(emptyRoot, {
    "openspec/changes/drop-alpha/.openspec.yaml": RETIRE_META,
    "openspec/changes/drop-alpha/specs/skill/alpha/spec.md":
      "# Spec Delta\n\n## REMOVED Requirements\n\n### Requirement: First\n",
  });
  const empty = runScript("check_plugin.ts", [], emptyRoot);
  assert.equal(empty.code, 1);
  assertIncludes(empty.output, ["openspec/specs/skill/alpha/spec.md: catalog-orphan-spec"]);

  // Archived removal only
  const archivedRoot = makeTree(fixturePlugin());
  rmSync(join(archivedRoot, "skills/alpha"), { recursive: true });
  writeTree(archivedRoot, {
    "openspec/specs/skill/alpha/spec.md": mainSpec,
    "openspec/changes/archive/2026-01-01-drop-alpha/.openspec.yaml": RETIRE_META,
    "openspec/changes/archive/2026-01-01-drop-alpha/specs/skill/alpha/spec.md":
      "# Spec Delta\n\n## REMOVED Requirements\n\n### Requirement: First\n\n### Requirement: Second\n",
  });
  const archived = runScript("check_plugin.ts", [], archivedRoot);
  assert.equal(archived.code, 1);
  assertIncludes(archived.output, ["openspec/specs/skill/alpha/spec.md: catalog-orphan-spec"]);

  // Missing, false, string-typed, or schema-less retire_capabilities metadata
  for (const meta of [
    null,
    "schema: spec-driven\nretire_capabilities: false\n",
    'schema: spec-driven\nretire_capabilities: "true"\n',
    "retire_capabilities: true\n",
  ]) {
    const metaRoot = makeTree(fixturePlugin());
    rmSync(join(metaRoot, "skills/alpha"), { recursive: true });
    const files: Record<string, string> = {
      "openspec/specs/skill/alpha/spec.md": mainSpec,
      "openspec/changes/drop-alpha/specs/skill/alpha/spec.md":
        "# Spec Delta\n\n## REMOVED Requirements\n\n### Requirement: First\n\n### Requirement: Second\n",
    };
    if (meta !== null) files["openspec/changes/drop-alpha/.openspec.yaml"] = meta;
    writeTree(metaRoot, files);
    const metaResult = runScript("check_plugin.ts", [], metaRoot);
    assert.equal(metaResult.code, 1);
    assertIncludes(metaResult.output, ["openspec/specs/skill/alpha/spec.md: catalog-orphan-spec"]);
  }

  // Symlinked files or directories pointing outside the checkout are never read
  const outside = mkdtempSync(join(tmpdir(), "hmd-outside-"));
  try {
    writeFileSync(
      join(outside, "delta.md"),
      "# Spec Delta\n\n## REMOVED Requirements\n\n### Requirement: First\n\n### Requirement: Second\n",
    );
    writeFileSync(join(outside, "meta.yaml"), RETIRE_META);
    writeTree(outside, {
      "skill/alpha/spec.md":
        "# Spec Delta\n\n## REMOVED Requirements\n\n### Requirement: First\n\n### Requirement: Second\n",
    });

    const symlinkDeltaRoot = makeTree(fixturePlugin());
    rmSync(join(symlinkDeltaRoot, "skills/alpha"), { recursive: true });
    writeTree(symlinkDeltaRoot, {
      "openspec/specs/skill/alpha/spec.md": mainSpec,
      "openspec/changes/drop-alpha/.openspec.yaml": RETIRE_META,
      "openspec/changes/drop-alpha/specs/skill/alpha/spec.md": {
        symlink: join(outside, "delta.md"),
      },
    });
    const symlinkDelta = runScript("check_plugin.ts", [], symlinkDeltaRoot);
    assert.equal(symlinkDelta.code, 1);
    assertIncludes(symlinkDelta.output, [
      "openspec/specs/skill/alpha/spec.md: catalog-orphan-spec",
    ]);

    const symlinkMetaRoot = makeTree(fixturePlugin());
    rmSync(join(symlinkMetaRoot, "skills/alpha"), { recursive: true });
    writeTree(symlinkMetaRoot, {
      "openspec/specs/skill/alpha/spec.md": mainSpec,
      "openspec/changes/drop-alpha/.openspec.yaml": { symlink: join(outside, "meta.yaml") },
      "openspec/changes/drop-alpha/specs/skill/alpha/spec.md":
        "# Spec Delta\n\n## REMOVED Requirements\n\n### Requirement: First\n\n### Requirement: Second\n",
    });
    const symlinkMeta = runScript("check_plugin.ts", [], symlinkMetaRoot);
    assert.equal(symlinkMeta.code, 1);
    assertIncludes(symlinkMeta.output, ["openspec/specs/skill/alpha/spec.md: catalog-orphan-spec"]);

    const symlinkDirRoot = makeTree(fixturePlugin());
    rmSync(join(symlinkDirRoot, "skills/alpha"), { recursive: true });
    writeTree(symlinkDirRoot, {
      "openspec/specs/skill/alpha/spec.md": mainSpec,
      "openspec/changes/drop-alpha/.openspec.yaml": RETIRE_META,
      "openspec/changes/drop-alpha/specs": { symlink: outside },
    });
    const symlinkDir = runScript("check_plugin.ts", [], symlinkDirRoot);
    assert.equal(symlinkDir.code, 1);
    assertIncludes(symlinkDir.output, ["openspec/specs/skill/alpha/spec.md: catalog-orphan-spec"]);
  } finally {
    rmSync(outside, { recursive: true, force: true });
  }
});
