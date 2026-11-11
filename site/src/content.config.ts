import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// The specification and the hub live outside `site/` and are read where they
// are: the site never keeps a copy of their text.

const spec = defineCollection({
  loader: glob({
    base: "../spec",
    pattern: "spec*.md",
    // `spec.md` -> `en`, `spec.zh.md` -> `zh`
    generateId: ({ entry }) => (entry === "spec.md" ? "en" : entry.replace(/^spec\.|\.md$/g, "")),
  }),
});

const hub = defineCollection({
  loader: glob({
    base: "../hub",
    pattern: "*/HARNESS.md",
    generateId: ({ entry }) => entry.split("/")[0] ?? entry,
  }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    version: z.string().optional(),
    license: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
});

const docs = defineCollection({
  loader: glob({ base: "./src/content/docs", pattern: "*/*.md" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
  }),
});

export const collections = { spec, hub, docs };
