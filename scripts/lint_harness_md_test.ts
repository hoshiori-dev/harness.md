// Tests of the validator's command line: arguments, exit status, options, and
// the printed shape of findings (openspec/specs/cli/lint). The rules
// themselves are tested in lib/harness_md_test.ts.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";
import { makeTree } from "./lib/testing.ts";

const SCRIPT = fileURLToPath(new URL("./lint_harness_md.ts", import.meta.url));

const roots: string[] = [];
after(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
});

function skill(name: string, extra = "", body = "# Demo\n\nAn introduction.\n"): string {
  return `---\nname: ${name}\ndescription: "[HARNESS.md] A demo design."\n${extra}metadata:\n  type: harness-design\n---\n\n${body}`;
}

function tree(files: Record<string, string>): string {
  const root = makeTree(files);
  roots.push(root);
  return root;
}

function run(root: string, ...args: string[]): { code: number; stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], { cwd: root, encoding: "utf8" });
  if (result.error) throw result.error;
  return { code: result.status ?? -1, stdout: result.stdout, stderr: result.stderr };
}

interface Report {
  files: {
    path: string;
    findings: { file: string; line: number; severity: string; code: string; message: string }[];
  }[];
  errors: number;
  warnings: number;
}

function runJson(root: string, ...args: string[]): { code: number; report: Report } {
  const result = run(root, "--json", ...args);
  return { code: result.code, report: JSON.parse(result.stdout) as Report };
}

const LINKED =
  "# Demo\n\nSee [the gates](references/gates.md) and [the check](scripts/check.py).\n";

test("a conforming directory prints no finding and exits 0, with and without --strict", () => {
  const root = tree({
    "my-design/SKILL.md": skill("my-design", "", LINKED),
    "my-design/references/gates.md": "# Gates\n",
    "my-design/scripts/check.py": "print('ok')\n",
  });
  for (const args of [["my-design"], ["--strict", "my-design"]]) {
    const result = run(root, ...args);
    assert.equal(result.code, 0);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, /^1 directory: 0 error\(s\), 0 warning\(s\)\n$/);
  }
});

test("the path of the main file stands for its directory", () => {
  const root = tree({
    "my-design/SKILL.md": skill("other-name", "tags: a\n"),
    "my-design/extra.txt": "x\n",
  });
  const byDirectory = run(root, "my-design");
  const byFile = run(root, "my-design/SKILL.md");
  assert.equal(byDirectory.code, 1);
  assert.deepEqual(byFile, byDirectory);
  assert.equal(byDirectory.stdout.split("\n").length - 1, 3);
  // A trailing separator names the same directory.
  assert.deepEqual(run(root, "my-design/"), byDirectory);
  // From inside the directory, the name is still read from the directory itself.
  const inside = run(join(root, "my-design"), ".");
  assert.match(inside.stdout, /^SKILL\.md:2: error\[name-directory\]: /);
  assert.deepEqual(run(join(root, "my-design"), "SKILL.md").stdout, inside.stdout);
});

test("a path that is neither a directory nor a main file exits 2 and validates nothing", () => {
  const root = tree({
    "my-design/SKILL.md": skill("my-design", "tags: a\n", "# Demo\n\n[g](references/gates.md)\n"),
    "my-design/HARNESS.md": "# Old\n",
    "my-design/references/gates.md": "# Gates\n",
  });
  for (const path of [
    "my-design/HARNESS.md",
    "my-design/references/gates.md",
    "no-such-directory",
    "no-such-directory/SKILL.md",
  ]) {
    // The good argument before it is not validated either.
    const result = run(root, "my-design", path);
    assert.equal(result.code, 2, path);
    assert.equal(result.stdout, "", path);
    assert.equal(result.stderr.includes(path), true, path);
  }
});

test("an unknown option exits 2, --fixtures included", () => {
  const root = tree({ "my-design/SKILL.md": skill("my-design") });
  for (const option of ["--fixtures", "--nope"]) {
    const result = run(root, option, "my-design");
    assert.equal(result.code, 2);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, new RegExp(`unknown option ${option}`));
  }
});

test("--help prints the usage with an example and exits 0", () => {
  const result = run(tree({}), "--help");
  assert.equal(result.code, 0);
  assert.match(result.stdout, /usage: node scripts\/lint_harness_md\.ts/);
  assert.match(result.stdout, /example: /);
  assert.doesNotMatch(result.stdout, /fixtures/);
});

test("warnings exit 0, and 1 with --strict", () => {
  const root = tree({ "my-design/SKILL.md": skill("my-design", 'version: "1.0"\n') });
  const plain = run(root, "my-design");
  assert.equal(plain.code, 0);
  assert.match(
    plain.stdout,
    /^my-design\/SKILL\.md:4: warning\[key-unknown\]: .*`metadata\.version`/,
  );
  assert.match(plain.stderr, /1 directory: 0 error\(s\), 1 warning\(s\)/);
  assert.equal(run(root, "--strict", "my-design").code, 1);
});

test("an unknown top-level key is printed as path:line: warning[key-unknown]: message", () => {
  const root = tree({ "my-design/SKILL.md": skill("my-design", "tags: a, b\n") });
  const result = run(root, "my-design");
  const lines = result.stdout.trimEnd().split("\n");
  assert.equal(lines.length, 1);
  assert.equal(lines[0]?.startsWith("my-design/SKILL.md:4: warning[key-unknown]: "), true);
  assert.match(lines[0] ?? "", /`tags`.*`metadata`/);
});

test("a section repeated three times prints one line and exits 0", () => {
  const body = "# Demo\n\n## Gates\n\n## Gates\n\n## Gates\n";
  const root = tree({ "my-design/SKILL.md": skill("my-design", "", body) });
  const result = run(root, "my-design");
  assert.equal(result.code, 0);
  assert.equal(result.stdout.match(/warning\[section-duplicate\]/g)?.length, 1);
  assert.equal(result.stdout.trimEnd().split("\n").length, 1);
});

test("an error exits 1", () => {
  const root = tree({ "my_design/SKILL.md": skill("my_design") });
  const result = run(root, "my_design");
  assert.equal(result.code, 1);
  assert.match(result.stdout, /^my_design\/SKILL\.md:2: error\[name-format\]: /);
});

test("a directory without a main file is printed with the directory's path", () => {
  const root = tree({ "my-design/README.md": "# Readme\n" });
  const result = run(root, "my-design/");
  assert.equal(result.code, 1);
  assert.match(result.stdout, /^my-design:1: error\[main-file-missing\]: [^\n]*\n$/);
  const { report } = runJson(root, "my-design");
  assert.deepEqual(
    report.files[0]?.findings.map((f) => [f.file, f.line, f.code]),
    [["SKILL.md", 1, "main-file-missing"]],
  );
});

test("findings in several files: SKILL.md first, then the others by path, each by line", () => {
  const gates = `${"\n".repeat(6)}See [the rest](missing.md).\n`;
  const body = "# Demo\n\n[notes](notes.md) [gates](references/gates.md) [gone](gone.md)\n";
  const root = tree({
    "my-design/SKILL.md": skill("my-design", "tags: a\n", body),
    "my-design/notes.md": "[x](x.md)\n\n[y](y.md)\n",
    "my-design/references/gates.md": gates,
  });
  const result = run(root, "my-design");
  assert.equal(result.code, 0);
  assert.deepEqual(
    result.stdout
      .trimEnd()
      .split("\n")
      .map((line) => line.split(": ").slice(0, 2).join(": ")),
    [
      "my-design/SKILL.md:4: warning[key-unknown]",
      "my-design/SKILL.md:11: warning[link-missing]",
      "my-design/notes.md:1: warning[link-missing]",
      "my-design/notes.md:3: warning[link-missing]",
      "my-design/references/gates.md:7: warning[link-missing]",
    ],
  );
});

test("--json gives one object for each directory, and each finding its file", () => {
  const root = tree({
    "my-design/SKILL.md": skill("my-design", "", "# Demo\n\n[gates](references/gates.md)\n"),
    "my-design/references/gates.md": "# Gates\n\n[gone](gone.md)\n",
    "other/SKILL.md": skill("other"),
  });
  const { code, report } = runJson(root, "my-design", "other/SKILL.md");
  assert.equal(code, 0);
  assert.deepEqual(
    report.files.map((entry) => entry.path),
    ["my-design", "other"],
  );
  assert.deepEqual(report.files[1]?.findings, []);
  const found = report.files[0]?.findings ?? [];
  assert.equal(found.length, 1);
  assert.deepEqual(
    [found[0]?.file, found[0]?.line, found[0]?.severity, found[0]?.code],
    ["references/gates.md", 3, "warning", "link-missing"],
  );
  assert.equal(typeof found[0]?.message, "string");
  assert.deepEqual([report.errors, report.warnings], [0, 1]);
  assert.equal(run(root, "--json", "--strict", "my-design").code, 1);
});

test("with no argument it validates the repository's document and every hub directory", () => {
  const root = tree({
    ".agents/knowledge/project-harness/SKILL.md": skill("project-harness"),
    ".agents/knowledge/other/SKILL.md": skill("wrong-name"),
    "hub/README.md": "# Hub\n",
    "hub/beta/SKILL.md": skill("beta"),
    "hub/alpha/SKILL.md": skill("alpha", "tags: a\n"),
    "hub/empty/README.md": "# No main file\n",
    "hub/alpha/nested/SKILL.md": skill("wrong-name"),
    "elsewhere/SKILL.md": skill("wrong-name"),
  });
  const { code, report } = runJson(root);
  assert.equal(code, 1);
  assert.deepEqual(
    report.files.map((entry) => [entry.path, entry.findings.map((f) => `${f.file}: ${f.code}`)]),
    [
      [".agents/knowledge/project-harness", []],
      ["hub/alpha", ["SKILL.md: key-unknown", "nested/SKILL.md: file-unreachable"]],
      ["hub/beta", []],
      ["hub/empty", ["SKILL.md: main-file-missing"]],
    ],
  );
});

test("with no argument and nothing to check it exits 2", () => {
  const result = run(tree({ "README.md": "# Elsewhere\n" }));
  assert.equal(result.code, 2);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /nothing to check/);
});
