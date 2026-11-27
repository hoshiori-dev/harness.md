import { getCollection } from "astro:content";
import { readFile } from "node:fs/promises";
import type { MarkdownHeading } from "astro";
import { prepare } from "./markdown";

export interface HubEntry {
  /** Directory name under `hub/`; the URL segment. */
  id: string;
  name: string;
  /** The description as the site shows it: without the type marker. */
  description: string;
  /** `metadata.version`. */
  version?: string;
  license?: string;
  tags: string[];
  basedOn: string[];
  /** `SKILL.md` exactly as it is in the repository. */
  raw: string;
  html: string;
  headings: MarkdownHeading[];
}

/** The type marker every `HARNESS.md` opens its description with. */
const MARKER = /^\[HARNESS\.md\]\s*/;

/**
 * The description without its `[HARNESS.md]` marker, on one line. Everything
 * in the hub is a `HARNESS.md`, so on a card, a page, or in `llms.txt` the
 * marker would only repeat itself; the raw file keeps it.
 */
function displayDescription(description: string): string {
  return description.trim().replace(MARKER, "").replace(/\s+/g, " ");
}

/** A comma-separated metadata value (`tags`, `based-on`): split at commas, each item trimmed. */
function commaList(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

/** Every `hub/<name>/SKILL.md`, sorted by name. An empty hub is not an error. */
export async function hubEntries(): Promise<HubEntry[]> {
  const entries = await getCollection("hub");
  const loaded = await Promise.all(
    entries.map(async (entry): Promise<HubEntry> => {
      if (!entry.filePath) throw new Error(`hub entry "${entry.id}" has no file path`);
      const raw = await readFile(entry.filePath, "utf8");
      const metadata = entry.data.metadata ?? {};
      return {
        id: entry.id,
        name: entry.data.name,
        description: displayDescription(entry.data.description),
        version: typeof metadata.version === "string" ? metadata.version : undefined,
        license: entry.data.license,
        tags: commaList(metadata.tags),
        basedOn: commaList(metadata["based-on"]),
        raw,
        html: prepare(entry.rendered?.html ?? "", `hub/${entry.id}`),
        headings: (entry.rendered?.metadata?.headings ?? []) as MarkdownHeading[],
      };
    }),
  );
  return loaded.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * The `limit` tags carried by the most entries, most used first (ties by
 * name). The hub index offers only these as filter buttons; any other tag is
 * found through the search box, which matches tags too.
 */
export function topTags(entries: HubEntry[], limit: number): string[] {
  const counts = new Map<string, number>();
  for (const tag of entries.flatMap((entry) => entry.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts]
    .sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b))
    .slice(0, limit)
    .map(([tag]) => tag);
}
