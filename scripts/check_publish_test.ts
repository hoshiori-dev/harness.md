import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { makeTree, runScript } from "./lib/testing.ts";

// A stand-in for betterleaks: reports a leak when the scanned file holds
// FAKE-SECRET, so the tests need neither the binary nor a real-looking key.
const FAKE_BETTERLEAKS = `#!/bin/sh
if grep -q FAKE-SECRET "$2"; then echo "Finding: REDACTED"; exit 1; fi
exit 0
`;

// Personal data is assembled at run time, so this file itself passes
// `just publish-check --commits` when it is pushed.
const PERSON_EMAIL = ["jane.doe", "corp.co.jp"].join("@");
const PERSON_HOME = ["", "home", "jane"].join("/");
const AUTHOR_EMAIL = ["me", "private.dev"].join("@");

function setup(files: Record<string, string>): { root: string; env: Record<string, string> } {
  const root = makeTree({ ...files, "bin/betterleaks": FAKE_BETTERLEAKS });
  chmodSync(join(root, "bin/betterleaks"), 0o755);
  return { root, env: { PATH: `${join(root, "bin")}:${process.env.PATH ?? ""}` } };
}

test("check_publish passes text with no secret or personal data", () => {
  const { root, env } = setup({
    "body.md": [
      "Contact t@example.com or 49699333+dependabot[bot]@users.noreply.github.com.",
      "Remote git@github.com:octo/app.git, built in /home/runner/work and ~/repo.",
      "Pinned actions/checkout@v7.0.1 and react@18.3.1; see @types/node.",
      "+@pytest.fixture and a web-flow commit by noreply@github.com.",
    ].join("\n"),
  });
  const result = runScript("check_publish.ts", ["body.md"], root, env);
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /check_publish: ok/);
});

test("check_publish reports an e-mail address, a home path, and a secret", () => {
  const { root, env } = setup({
    "body.md": `Ping ${PERSON_EMAIL}.\nLog at ${PERSON_HOME}/.cache/x and C:\\Users\\jane\\x.\n`,
    "comment.md": "token FAKE-SECRET\n",
  });
  const result = runScript("check_publish.ts", ["body.md", "comment.md"], root, env);
  assert.equal(result.code, 1);
  assert.match(result.output, /body\.md:1: publish-email: e-mail address jane\.doe@corp\.co\.jp/);
  assert.match(result.output, /body\.md:2: publish-path: local path \/home\/jane/);
  assert.match(result.output, /publish-path: local path C:\\Users\\jane/);
  assert.match(result.output, /comment\.md: publish-secret/);
  assert.match(result.output, /check_publish: 4 finding/);
});

test("check_publish scans commit authors and messages in a range", () => {
  const { root, env } = setup({ "a.txt": "a\n" });
  const git = (args: string[], email: string) => {
    const r = spawnSync(
      "git",
      ["-c", "user.name=t", "-c", `user.email=${email}`, "-c", "commit.gpgsign=false", ...args],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(r.status, 0, r.stderr);
  };
  git(["init", "-q"], "t@example.com");
  git(["add", "a.txt"], "t@example.com");
  git(["commit", "-qm", "chore: first"], "t@example.com");
  const clean = runScript("check_publish.ts", ["--commits", "HEAD"], root, env);
  assert.equal(clean.code, 0, clean.output);
  git(["commit", "-q", "--allow-empty", "-m", "chore: second"], AUTHOR_EMAIL);
  const leaked = runScript("check_publish.ts", ["--commits", "HEAD~1..HEAD"], root, env);
  assert.equal(leaked.code, 1);
  assert.match(leaked.output, /commits HEAD~1\.\.HEAD \(commit [0-9a-f]{7}\): publish-email/);
  // A commit that removes personal data passes: the removed line is not scanned.
  git(["config", "user.email", "t@example.com"], "t@example.com");
  writeFileSync(join(root, "a.txt"), `${PERSON_EMAIL}\n`);
  git(["commit", "-qam", "chore: add"], "t@example.com");
  writeFileSync(join(root, "a.txt"), "a\n");
  git(["commit", "-qam", "chore: remove"], "t@example.com");
  const removal = runScript("check_publish.ts", ["--commits", "HEAD~1..HEAD"], root, env);
  assert.equal(removal.code, 0, removal.output);
});

test("check_publish fails on bad arguments", () => {
  const { root, env } = setup({});
  assert.equal(runScript("check_publish.ts", [], root, env).code, 2);
  assert.equal(runScript("check_publish.ts", ["--commits"], root, env).code, 2);
  assert.equal(runScript("check_publish.ts", ["--body"], root, env).code, 2);
});
