// Validate HARNESS.md files against spec/spec.md section 6.
//
//   node scripts/lint_harness_md.ts [--json] [--strict] [<path>...]
//   node scripts/lint_harness_md.ts --fixtures <dir>
//
// With no path it checks ./HARNESS.md and every hub/*/HARNESS.md. Exit codes:
// 0 no errors (and, with --strict, no warnings), 1 findings, 2 bad arguments.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { type Finding, format, lint } from "./lib/harness_md.ts";

const USAGE = `usage: node scripts/lint_harness_md.ts [--json] [--strict] [<path>...]
       node scripts/lint_harness_md.ts --fixtures <dir>

Validates HARNESS.md files against the format specification (spec/spec.md).
With no <path>, checks ./HARNESS.md and every hub/*/HARNESS.md.

  --json      print findings as JSON on stdout
  --strict    exit 1 on warnings as well as errors
  --fixtures  run every *.md under <dir> and compare the finding codes with
              <dir>/expected.json

example: node scripts/lint_harness_md.ts HARNESS.md`;

function defaultPaths(): string[] {
  const paths: string[] = [];
  if (existsSync("HARNESS.md")) paths.push("HARNESS.md");
  if (existsSync("hub")) {
    for (const entry of readdirSync("hub").sort()) {
      const file = join("hub", entry, "HARNESS.md");
      if (existsSync(file)) paths.push(file);
    }
  }
  return paths;
}

function markdownFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir).sort()) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) files.push(...markdownFiles(path));
    else if (entry.endsWith(".md")) files.push(path);
  }
  return files;
}

/** Compare each fixture's finding codes with expected.json; returns the mismatches. */
export function runFixtures(dir: string): string[] {
  const expected = JSON.parse(readFileSync(join(dir, "expected.json"), "utf8")) as Record<
    string,
    string[]
  >;
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const file of markdownFiles(dir)) {
    const key = relative(dir, file).split("\\").join("/");
    seen.add(key);
    const want = expected[key];
    if (!want) {
      problems.push(`${key}: no entry in expected.json`);
      continue;
    }
    const got = lint(readFileSync(file, "utf8"))
      .map((f) => f.code)
      .sort();
    const wanted = [...want].sort();
    if (got.join(",") !== wanted.join(",")) {
      problems.push(`${key}: expected [${wanted.join(", ")}], got [${got.join(", ")}]`);
    }
  }
  for (const key of Object.keys(expected)) {
    if (!seen.has(key)) problems.push(`${key}: listed in expected.json but the file is missing`);
  }
  return problems;
}

function main(argv: string[]): number {
  let json = false;
  let strict = false;
  let fixtures: string | undefined;
  const paths: string[] = [];
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index] as string;
    if (arg === "--help" || arg === "-h") {
      console.log(USAGE);
      return 0;
    }
    if (arg === "--json") json = true;
    else if (arg === "--strict") strict = true;
    else if (arg === "--fixtures") {
      fixtures = argv[++index];
      if (!fixtures) {
        console.error(`--fixtures needs a directory\n\n${USAGE}`);
        return 2;
      }
    } else if (arg.startsWith("--")) {
      console.error(`unknown option ${arg}\n\n${USAGE}`);
      return 2;
    } else paths.push(arg);
  }

  if (fixtures) {
    if (!existsSync(join(fixtures, "expected.json"))) {
      console.error(`${fixtures}/expected.json not found`);
      return 2;
    }
    const problems = runFixtures(fixtures);
    for (const problem of problems) console.log(problem);
    console.error(
      problems.length === 0
        ? "fixtures: every case matches"
        : `fixtures: ${problems.length} mismatch(es)`,
    );
    return problems.length === 0 ? 0 : 1;
  }

  const targets = paths.length > 0 ? paths : defaultPaths();
  if (targets.length === 0) {
    console.error("nothing to check: no HARNESS.md here and no hub/*/HARNESS.md");
    return 2;
  }
  const results: { path: string; findings: Finding[] }[] = [];
  for (const path of targets) {
    if (!existsSync(path) || statSync(path).isDirectory()) {
      console.error(`${path}: not a file`);
      return 2;
    }
    results.push({ path, findings: lint(readFileSync(path, "utf8")) });
  }
  const count = (severity: string) =>
    results.reduce((sum, r) => sum + r.findings.filter((f) => f.severity === severity).length, 0);
  const errors = count("error");
  const warnings = count("warning");
  if (json) {
    console.log(JSON.stringify({ files: results, errors, warnings }, null, 2));
  } else {
    for (const result of results) {
      for (const line of format(result.path, result.findings)) console.log(line);
    }
  }
  console.error(`${results.length} file(s): ${errors} error(s), ${warnings} warning(s)`);
  return errors > 0 || (strict && warnings > 0) ? 1 : 0;
}

if (import.meta.main) {
  process.exit(main(process.argv.slice(2)));
}
