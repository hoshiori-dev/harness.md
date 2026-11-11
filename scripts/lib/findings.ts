// Shared reporting for the project's management scripts.
//
// A finding is a problem in a committed file that the person or agent fixing
// it must act on: it names the file, the rule, the problem, and the fix. The
// scripts collect findings and exit 1 once, at the end. An unexpected failure
// of a script itself (unreadable file, missing tool) is not a finding: it
// exits 2 immediately through `fail`, with a message naming what was wrong.
import { spawnSync } from "node:child_process";
import { lstatSync, readdirSync, readFileSync, readlinkSync, statSync } from "node:fs";

export interface Finding {
  file: string;
  line?: number;
  rule: string;
  problem: string;
  fix: string;
}

export class Findings {
  readonly items: Finding[] = [];

  add(finding: Finding): void {
    this.items.push(finding);
  }

  /** Prints every finding and a summary line; returns the process exit code. */
  report(label: string): number {
    for (const f of this.items) {
      const where = f.line === undefined ? f.file : `${f.file}:${f.line}`;
      console.log(`${where}: ${f.rule}: ${f.problem} Fix: ${f.fix}`);
    }
    if (this.items.length === 0) {
      console.log(`${label}: ok`);
      return 0;
    }
    console.log(`${label}: ${this.items.length} finding(s)`);
    return 1;
  }
}

export interface Warning {
  file: string;
  line?: number;
  rule: string;
  problem: string;
  fix: string;
}

/**
 * A warning is advice, not a finding: it goes to stderr and never changes the
 * exit code, so a script that only warns still ends `ok`.
 */
export function warn(w: Warning): void {
  const where = w.line === undefined ? w.file : `${w.file}:${w.line}`;
  console.error(`WARN ${where}: ${w.rule} — ${w.problem} Fix: ${w.fix}`);
}

/** Unexpected failure of the script itself: print and exit 2. */
export function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(2);
}

function isNotFound(error: unknown): boolean {
  const code = (error as NodeJS.ErrnoException).code;
  return code === "ENOENT" || code === "ENOTDIR";
}

export function exists(path: string): boolean {
  try {
    lstatSync(path);
    return true;
  } catch (error) {
    if (isNotFound(error)) return false;
    throw error;
  }
}

export function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch (error) {
    if (isNotFound(error)) return false;
    throw error;
  }
}

export function readText(path: string): string {
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    return fail(`cannot read ${path}: ${(error as Error).message}`);
  }
}

/** Reads and parses a JSON file; a parse error is an unexpected failure. */
export function readJson(path: string): unknown {
  const text = readText(path);
  try {
    return JSON.parse(text);
  } catch (error) {
    return fail(`${path} is not valid JSON: ${(error as Error).message}`);
  }
}

export interface DirEntry {
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  isSymlink: boolean;
}

/** Sorted directory entries, so every listing is deterministic. A symlink is neither file nor directory. */
export function listDir(path: string): DirEntry[] {
  const entries = readdirSync(path, { withFileTypes: true }).map((e) => ({
    name: e.name,
    isFile: e.isFile(),
    isDirectory: e.isDirectory(),
    isSymlink: e.isSymbolicLink(),
  }));
  entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  return entries;
}

export interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

/** Runs a program without a shell; a program that cannot start is an unexpected failure. */
export function run(command: string, args: string[], cwd?: string): RunResult {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error) fail(`cannot run ${command}: ${result.error.message}`);
  return { code: result.status ?? 1, stdout: result.stdout, stderr: result.stderr };
}

/** Files git tracks or would track: committed files plus untracked, not-ignored ones. */
export function gitFiles(root: string): string[] {
  const result = run("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], root);
  if (result.code !== 0) fail(`git ls-files exited ${result.code}: ${result.stderr.trim()}`);
  return result.stdout
    .split("\0")
    .filter((p) => p.length > 0)
    .sort();
}

/** The symlink's target, or null when the path is missing or not a symlink. */
export function readLinkOrNull(path: string): string | null {
  try {
    if (!lstatSync(path).isSymbolicLink()) return null;
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
  return readlinkSync(path);
}
