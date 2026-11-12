import { getCollection } from "astro:content";
import { readFile } from "node:fs/promises";
import type { MarkdownHeading } from "astro";
import { prepare } from "./markdown";

export interface HubEntry {
  /** Directory name under `hub/`; the URL segment. */
  id: string;
  name: string;
  description: string;
  version?: string;
  license?: string;
  tags: string[];
  basedOn: string[];
  /** The file exactly as it is in the repository. */
  raw: string;
  html: string;
  headings: MarkdownHeading[];
}

function stringList(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

/** Every `hub/<name>/HARNESS.md`, sorted by name. An empty hub is not an error. */
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
        description: entry.data.description,
        version: entry.data.version,
        license: entry.data.license,
        tags: stringList(metadata.tags),
        basedOn: stringList(metadata["based-on"]),
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
