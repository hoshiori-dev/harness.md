// Validate HARNESS.md documents against openspec/specs/cli/lint
// (spec/spec.md section 7). A document is a directory whose main file is
// SKILL.md, and the directory is what is validated.
//
//   node scripts/lint_harness_md.ts [--json] [--strict] [<path>...]
//
// A path is a document directory or the path of its SKILL.md. With no path it
// checks .agents/knowledge/project-harness and every directory directly under
// hub/. Exit codes: 0 no errors (and, with --strict, no warnings), 1 findings,
// 2 bad arguments.
import { existsSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import {
  type DirectoryFinding,
  formatDirectory,
  lintDirectory,
  MAIN_FILE,
} from "./lib/harness_md.ts";

const OWN_DOCUMENT = ".agents/knowledge/project-harness";
const HUB = "hub";

const USAGE = `usage: node scripts/lint_harness_md.ts [--json] [--strict] [<path>...]

Validates HARNESS.md documents against the format specification (spec/spec.md).
A <path> is a document directory or the path of its ${MAIN_FILE}.
With no <path>, checks ${OWN_DOCUMENT} and every directory directly under ${HUB}/.

  --json      print findings as JSON on stdout, one object for each directory,
              each finding with its file relative to that directory
  --strict    exit 1 on warnings as well as errors

example: node scripts/lint_harness_md.ts ${HUB}/solo-open-source-library`;

function isDirectory(path: string): boolean {
  return existsSync(path) && statSync(path).isDirectory();
}

function defaultDirectories(): string[] {
  const directories: string[] = [];
  if (isDirectory(OWN_DOCUMENT)) directories.push(OWN_DOCUMENT);
  if (isDirectory(HUB)) {
    for (const entry of readdirSync(HUB).sort()) {
      const path = join(HUB, entry);
      if (!entry.startsWith(".") && isDirectory(path)) directories.push(path);
    }
  }
  return directories;
}

/** The directory an argument stands for, or what is wrong with the argument. */
function directoryOf(path: string): { directory: string } | { problem: string } {
  if (!existsSync(path)) return { problem: `${path}: no such file or directory` };
  if (statSync(path).isDirectory()) return { directory: path };
  if (basename(path) === MAIN_FILE) return { directory: dirname(path) };
  return {
    problem: `${path}: not a directory and not a ${MAIN_FILE}; pass a document directory or the path of its ${MAIN_FILE}`,
  };
}

function main(argv: string[]): number {
  let json = false;
  let strict = false;
  const paths: string[] = [];
  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      return 0;
    }
    if (arg === "--json") json = true;
    else if (arg === "--strict") strict = true;
    else if (arg.startsWith("--")) {
      console.error(`unknown option ${arg}\n\n${USAGE}`);
      return 2;
    } else paths.push(arg);
  }

  // Every argument is settled before anything is validated.
  const directories: string[] = [];
  if (paths.length === 0) {
    directories.push(...defaultDirectories());
    if (directories.length === 0) {
      console.error(
        `nothing to check: no ${OWN_DOCUMENT} here and no directory under ${HUB}/; pass a document directory`,
      );
      return 2;
    }
  } else {
    const problems: string[] = [];
    for (const path of paths) {
      const settled = directoryOf(path);
      if ("problem" in settled) problems.push(settled.problem);
      else directories.push(settled.directory);
    }
    if (problems.length > 0) {
      for (const problem of problems) console.error(problem);
      return 2;
    }
  }

  const results: { path: string; findings: DirectoryFinding[] }[] = directories.map((path) => ({
    path,
    findings: lintDirectory(path),
  }));
  const count = (severity: string) =>
    results.reduce((sum, r) => sum + r.findings.filter((f) => f.severity === severity).length, 0);
  const errors = count("error");
  const warnings = count("warning");
  if (json) {
    const files = results.map((r) => ({
      path: r.path,
      findings: r.findings.map((f) => ({
        file: f.file,
        line: f.line,
        severity: f.severity,
        code: f.code,
        message: f.message,
      })),
    }));
    console.log(JSON.stringify({ files, errors, warnings }, null, 2));
  } else {
    for (const result of results) {
      for (const line of formatDirectory(result.path, result.findings)) console.log(line);
    }
  }
  console.error(
    `${results.length} director${results.length === 1 ? "y" : "ies"}: ${errors} error(s), ${warnings} warning(s)`,
  );
  return errors > 0 || (strict && warnings > 0) ? 1 : 0;
}

if (import.meta.main) {
  process.exit(main(process.argv.slice(2)));
}
