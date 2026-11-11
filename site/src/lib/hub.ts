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

export function allTags(entries: HubEntry[]): string[] {
  return [...new Set(entries.flatMap((entry) => entry.tags))].sort((a, b) => a.localeCompare(b));
}
