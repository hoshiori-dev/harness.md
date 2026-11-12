#!/usr/bin/env node
// Builds the release archive: the plugin payload (the portable manifest, the
// skills, the client namespaces, and every registered client's generated
// files, without which the archive loads in no client that needs a pointer
// manifest) as dist/<name>-<version>.zip from the committed tree, so
// untracked files never ship. The format specification, the hub, the website,
// and this repository's harness are not part of the plugin.
//
//   dist.ts [--tag vX.Y.Z]   with --tag, fail unless X.Y.Z equals plugin.json#version
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { CLIENTS } from "./lib/clients.ts";
import { exists, fail, listDir, run } from "./lib/findings.ts";
import { loadManifest } from "./lib/plugin.ts";

const root = process.cwd();
const args = process.argv.slice(2);
const { manifest, errors } = loadManifest(root);
if (errors.length > 0) {
  fail(`plugin.json violates the Agent Plugins schema:\n  ${errors.join("\n  ")}`);
}
if (manifest.version === undefined) fail("plugin.json has no version; a release needs one.");

const tagIndex = args.indexOf("--tag");
if (tagIndex !== -1) {
  const tag = args[tagIndex + 1];
  if (!tag || !/^v\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(tag)) {
    fail(`tag "${tag ?? ""}" is not vX.Y.Z. Fix: tag releases as v<plugin.json version>.`);
  }
  if (tag.slice(1) !== manifest.version) {
    fail(
      `tag ${tag} does not match plugin.json version ${manifest.version}. Fix: bump the version or retag.`,
    );
  }
}

const payload = [
  "plugin.json",
  "LICENSE",
  "README.md",
  "skills",
  ...listDir(root)
    .filter((e) => e.isDirectory && e.name.startsWith("com."))
    .map((e) => e.name),
  // The generated client files: without them the archive loads in no client
  // that needs a pointer manifest.
  ...CLIENTS.flatMap((c) => c.generatedFiles),
]
  .filter((p) => exists(join(root, p)))
  .sort();

mkdirSync(join(root, "dist"), { recursive: true });
const archive = `dist/${manifest.name}-${manifest.version}.zip`;
const result = run(
  "git",
  [
    "archive",
    "--format=zip",
    `--prefix=${manifest.name}/`,
    "-o",
    archive,
    "HEAD",
    "--",
    ...payload,
  ],
  root,
);
if (result.code !== 0) {
  fail(
    `git archive exited ${result.code}: ${result.stderr.trim()} (every payload path must be committed)`,
  );
}
console.log(`wrote ${archive} (${payload.join(", ")})`);
