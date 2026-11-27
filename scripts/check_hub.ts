// Check every hub entry against the hub's own entry rules
// (openspec/specs/hub/spec.md, hub/README.md):
//
//   node scripts/check_hub.ts [<hub directory>]
//
// An entry is a directory hub/<name>/ that is a HARNESS.md. The format
// validator checks the directory (main file, markers, name, links inside it)
// and leaves the contents of `metadata` alone beyond `type`; the hub does
// not, because the hub defines what it keeps there (`tags`, `based-on`).
// Exit codes: 0 clean, 1 findings, 2 bad arguments.
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { formatDirectory, MAIN_FILE, readDirectory } from "./lib/harness_md.ts";

const TAG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Files that may sit in hub/ beside the entry directories. */
const HUB_FILES = new Set(["README.md", "README.zh.md"]);
/** Keys under `metadata`: the two the format reads, the two the hub defines. */
const METADATA_KEYS = new Set(["type", "version", "tags", "based-on"]);

function isUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** A comma-separated metadata value as its items: split at commas, each trimmed. */
export function items(value: string): string[] {
  return value.split(",").map((item) => item.trim());
}

/** Findings for one entry directory, as printable lines. */
export function checkEntry(hub: string, entry: string): string[] {
  const dir = join(hub, entry);
  const file = join(dir, MAIN_FILE);
  const result = readDirectory(dir);
  // An entry has to be clean: warnings count too.
  const problems = formatDirectory(dir, result.findings);
  for (const link of result.links) {
    if (link.kind !== "outside") continue;
    problems.push(
      `${join(dir, link.file)}:${link.line}: the link to \`${link.url}\` leaves the entry directory; an entry is used from its own files alone, so link to a file inside \`${dir}\` or give a full URL`,
    );
  }
  const frontmatter = result.main?.frontmatter;
  if (!frontmatter) return problems;

  const say = (message: string) => problems.push(`${file}: ${message}`);
  if (!frontmatter.strings.license) {
    say("a hub entry states its licence; add `license:` (the hub's own entries use Apache-2.0)");
  }
  const metadata = frontmatter.data.metadata;
  // A `metadata` that is not a mapping, or a value in it that is not a string,
  // is the format validator's finding (`metadata-value`); nothing is added here.
  if (metadata !== undefined && (metadata === null || typeof metadata !== "object")) {
    return problems;
  }
  if (Array.isArray(metadata)) return problems;
  const record = (metadata ?? {}) as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (METADATA_KEYS.has(key)) continue;
    say(
      `\`metadata.${key}\` is not a key the format or the hub defines; an entry keeps only ${[...METADATA_KEYS].map((k) => `\`${k}\``).join(", ")} under \`metadata\``,
    );
  }
  /** The items of a comma-separated key, or undefined when an item is empty. */
  const split = (key: string, value: string): string[] | undefined => {
    const list = items(value);
    if (list.every((item) => item !== "")) return list;
    say(
      `\`metadata.${key}\` has an empty item; write the items separated by single commas, with no comma at the start or the end`,
    );
    return undefined;
  };
  const tags = record.tags;
  if (tags === undefined) {
    say(
      "`metadata.tags` is missing; the hub's search and filters are built from it, so add one string of tags separated by commas",
    );
  } else if (typeof tags === "string") {
    const list = split("tags", tags) ?? [];
    const seen = new Set<string>();
    const repeated = new Set<string>();
    for (const tag of list) {
      if (!TAG.test(tag)) {
        say(`the tag \`${tag}\` must be lowercase letters and digits joined by single hyphens`);
      }
      if (seen.has(tag)) repeated.add(tag);
      seen.add(tag);
    }
    for (const tag of repeated) {
      say(`\`metadata.tags\` lists the tag \`${tag}\` more than once; keep one`);
    }
  }
  const basedOn = record["based-on"];
  if (typeof basedOn === "string") {
    for (const url of split("based-on", basedOn) ?? []) {
      if (!isUrl(url)) {
        say(
          `\`metadata.based-on\` item \`${url}\` is not an http(s) URL; items are split at commas, so a URL here contains none`,
        );
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
      "usage: node scripts/check_hub.ts [<hub directory>]\n\nChecks every hub/<name>/ directory (main file SKILL.md) against the hub entry rules.\n\nexample: node scripts/check_hub.ts hub",
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
