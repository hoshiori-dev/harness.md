#!/usr/bin/env node
// Checks text before it leaves the machine for good: an issue or pull request
// body, a comment, or the commits a push adds (messages, authors, and diffs).
// Two scans run on every input: betterleaks for secrets, and a scan for
// personal data, namely e-mail addresses and home directories that name a
// user. Issues, pull requests, and pushed commits cannot be fully deleted,
// so this runs before the write, not after.
//
//   check_publish.ts [<file>...] [--commits <range>]
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Findings, fail, readText, run } from "./lib/findings.ts";

// Addresses that identify no one: reserved example domains (RFC 2606, 6761)
// and GitHub's no-reply addresses, which carry only a public login.
const SAFE_EMAIL_DOMAIN =
  /(^|\.)(example\.(com|org|net)|example|invalid|test|localhost|noreply\.github\.com)$/i;
// GitHub's own service addresses: web-flow commits and bot sign-offs.
const SAFE_EMAILS = new Set(["noreply@github.com", "support@github.com"]);
// `git@host` is the SSH user of a remote URL, not a person.
const SAFE_EMAIL_LOCAL = new Set(["git"]);
// The local part starts with a letter or digit, so a decorator on an added
// diff line (`+@pytest.fixture`) is not read as an address.
const EMAIL = /[A-Za-z0-9][A-Za-z0-9._%+-]*@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}/g;
// A home directory with a user name in it; `runner` is GitHub's CI account.
const HOME_PATH = /(?:\/home\/|\/Users\/|[A-Za-z]:\\Users\\)([A-Za-z0-9._-]+)/g;
const SAFE_HOME_USERS = new Set(["runner"]);

interface Input {
  label: string;
  text: string;
  /** A `git log -p` listing: findings name the commit, not a line of the listing. */
  isLog: boolean;
}

const inputs: Input[] = [];
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  const arg = args[i] ?? "";
  if (arg === "--commits") {
    const range = args[++i];
    if (range === undefined || range === "")
      fail("--commits needs a git range, e.g. origin/main..HEAD");
    const log = run("git", ["log", "-p", "--format=fuller", range]);
    if (log.code !== 0) fail(`git log ${range} exited ${log.code}: ${log.stderr.trim()}`);
    // Removed lines are left out: they are already public on the base, and
    // a commit that deletes a leak must not be blocked for showing it.
    const text = log.stdout
      .split("\n")
      .filter((line) => !line.startsWith("-"))
      .join("\n");
    inputs.push({ label: `commits ${range}`, text, isLog: true });
  } else if (arg.startsWith("-")) {
    fail(`unknown argument ${arg}; pass files and --commits <range>`);
  } else {
    inputs.push({ label: arg, text: readText(arg), isLog: false });
  }
}
if (inputs.length === 0) fail("nothing to check: pass files or --commits <range>");

const findings = new Findings();
const scratch = mkdtempSync(join(tmpdir(), "check-publish-"));
try {
  for (const [n, input] of inputs.entries()) {
    const copy = join(scratch, `${n}.txt`);
    writeFileSync(copy, input.text);
    const scan = run("betterleaks", ["dir", copy, "--no-banner", "--redact", "--verbose"]);
    if (scan.code === 1) {
      process.stdout.write(scan.stdout + scan.stderr);
      findings.add({
        file: input.label,
        rule: "publish-secret",
        problem: "betterleaks reports a secret (redacted output above).",
        fix: "remove the secret and rotate it if it was ever pushed or posted.",
      });
    } else if (scan.code !== 0) {
      fail(`betterleaks exited ${scan.code}: ${scan.stderr.trim()}`);
    }
    scanPersonalData(input);
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
process.exit(findings.report("check_publish"));

function scanPersonalData(input: Input): void {
  let where = input.label;
  for (const [index, line] of input.text.split("\n").entries()) {
    const commit = input.isLog ? /^commit ([0-9a-f]{7})/.exec(line) : null;
    if (commit) where = `${input.label} (commit ${commit[1]})`;
    const at = input.isLog ? {} : { line: index + 1 };
    for (const m of line.matchAll(EMAIL)) {
      const [local = "", domain = ""] = m[0].split("@");
      if (SAFE_EMAIL_DOMAIN.test(domain) || SAFE_EMAIL_LOCAL.has(local)) continue;
      if (SAFE_EMAILS.has(m[0].toLowerCase())) continue;
      findings.add({
        file: where,
        ...at,
        rule: "publish-email",
        problem: `e-mail address ${m[0]}.`,
        fix: "remove it, or use an example.com address or a GitHub no-reply address; for a commit author, fix user.email and rewrite the unpushed commit.",
      });
    }
    for (const m of line.matchAll(HOME_PATH)) {
      if (SAFE_HOME_USERS.has(m[1] ?? "")) continue;
      findings.add({
        file: where,
        ...at,
        rule: "publish-path",
        problem: `local path ${m[0]} names a user.`,
        fix: "write the path relative to the repository, or as ~ or <user>.",
      });
    }
  }
}
