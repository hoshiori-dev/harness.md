// Check every hub entry against the hub's own entry rules
// (openspec/specs/hub/spec.md, hub/README.md):
//
//   node scripts/check_hub.ts [<hub directory>]
//
// The format validator ignores `metadata`; the hub does not, because the hub
// defines what it keeps there (`tags`, `based-on`). Exit codes: 0 clean,
// 1 findings, 2 bad arguments.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { format, parseBytes } from "./lib/harness_md.ts";

const TAG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const ENTRY_FILE = "HARNESS.md";
/** Files that may sit in hub/ beside the entry directories. */
const HUB_FILES = new Set(["README.md", "README.zh.md"]);

function isUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Findings for one entry directory, as printable lines. */
export function checkEntry(hub: string, entry: string): string[] {
  const dir = join(hub, entry);
  const file = join(dir, ENTRY_FILE);
  if (!existsSync(file)) return [`${dir}: an entry directory must contain ${ENTRY_FILE}`];
  const parsed = parseBytes(readFileSync(file));
  // An entry has to be clean: warnings count too.
  const problems = format(file, parsed.findings);
  const frontmatter = parsed.frontmatter;
  if (!frontmatter) return problems;

  const say = (message: string) => problems.push(`${file}: ${message}`);
  if (frontmatter.strings.name !== undefined && frontmatter.strings.name !== entry) {
    say(
      `\`name: ${frontmatter.strings.name}\` must equal the directory name \`${entry}\`; rename one of them`,
    );
  }
  if (!frontmatter.strings.license) {
    say("a hub entry states its licence; add `license:` (the hub's own entries use Apache-2.0)");
  }
  const metadata = frontmatter.data.metadata;
  const record =
    metadata && typeof metadata === "object" && !Array.isArray(metadata)
      ? (metadata as Record<string, unknown>)
      : undefined;
  const tags = record?.tags;
  if (!Array.isArray(tags) || tags.length === 0) {
    say("`metadata.tags` must be a non-empty list; the hub's search and filters are built from it");
  } else {
    for (const tag of tags) {
      if (typeof tag !== "string" || !TAG.test(tag)) {
        say(
          `the tag \`${String(tag)}\` must be lowercase letters and digits joined by single hyphens`,
        );
      }
    }
    if (new Set(tags).size !== tags.length) say("`metadata.tags` lists a tag twice");
  }
  const basedOn = record?.["based-on"];
  if (basedOn !== undefined) {
    if (!Array.isArray(basedOn) || basedOn.length === 0) {
      say("`metadata.based-on`, when present, must be a non-empty list of URLs");
    } else {
      for (const url of basedOn) {
        if (!isUrl(url))
          say(`\`metadata.based-on\` entry \`${String(url)}\` is not an http(s) URL`);
      }
    }
  }
  return problems;
}

export function checkHub(hub: string): string[] {
  const problems: string[] = [];
  for (const entry of readdirSync(hub).sort()) {
    const path = join(hub, entry);
    if (statSync(path).isDirectory()) problems.push(...checkEntry(hub, entry));
    else if (!HUB_FILES.has(entry)) {
      problems.push(
        `${path}: only ${[...HUB_FILES].join(", ")} and entry directories belong in the hub root`,
      );
    }
  }
  return problems;
}

function main(argv: string[]): number {
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(
      "usage: node scripts/check_hub.ts [<hub directory>]\n\nChecks every hub/<name>/HARNESS.md against the hub entry rules.\n\nexample: node scripts/check_hub.ts hub",
    );
    return 0;
  }
  const hub = argv[0] ?? "hub";
  if (!existsSync(hub) || !statSync(hub).isDirectory()) {
    console.error(`${hub}: not a directory`);
    return 2;
  }
  const problems = checkHub(hub);
  for (const problem of problems) console.log(problem);
  const entries = readdirSync(hub).filter((entry) => statSync(join(hub, entry)).isDirectory());
  console.error(
    `hub: ${entries.length} entr${entries.length === 1 ? "y" : "ies"}, ${problems.length} problem(s)`,
  );
  return problems.length === 0 ? 0 : 1;
}

if (import.meta.main) {
  process.exit(main(process.argv.slice(2)));
}
