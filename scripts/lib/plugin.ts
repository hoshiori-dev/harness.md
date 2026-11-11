// Loading and validating the portable plugin manifest (Agent Plugins 1.0.0)
// and the client-specific agent files, plus the small helpers every script
// shares. The plugin ships no MCP server, so nothing here reads mcp.json.
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Ajv2020 as Ajv2020Class, ErrorObject } from "ajv/dist/2020.js";
import { parse as parseYaml } from "yaml";
import { exists, fail, readJson, readText } from "./findings.ts";

export const SPEC_VERSION = "1.0.0";
/** Vendored schemas, resolved from this file so checks work from any working directory. */
export const SCHEMA_DIR = fileURLToPath(
  new URL(`../schemas/agent-plugins/${SPEC_VERSION}/`, import.meta.url),
);

/** Intersection of the name rules of the spec, Claude Code, Codex, and Antigravity. */
export const PORTABLE_NAME_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
/** agentskills.io: 1-64 chars, lowercase alphanumerics and single hyphens. */
export const SKILL_NAME_RE = /^(?!.*--)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export interface PluginManifest {
  $schema: string;
  name: string;
  version?: string;
  description?: string;
  author?: { name?: string; email?: string; url?: string };
  homepage?: string;
  repository?: string;
  license?: string;
  keywords?: string[];
  extensions?: Record<string, Record<string, unknown>>;
}

/** Schema violations as `path: message` strings, empty when valid. */
export function schemaErrors(data: unknown): string[] {
  // Loaded here, not at the top: ajv takes over a second to load, and most
  // scripts that import this module never validate the manifest.
  const { Ajv2020 } = createRequire(import.meta.url)("ajv/dist/2020.js") as {
    Ajv2020: typeof Ajv2020Class;
  };
  const ajv = new Ajv2020({ strict: false, allErrors: true });
  const validate = ajv.compile(readJson(join(SCHEMA_DIR, "plugin.schema.json")) as object);
  if (validate(data)) return [];
  return (validate.errors ?? []).map((e: ErrorObject) => {
    const where = e.instancePath === "" ? "(root)" : e.instancePath;
    const extra =
      e.keyword === "additionalProperties"
        ? ` (${(e.params as { additionalProperty: string }).additionalProperty})`
        : "";
    return `${where} ${e.message ?? e.keyword}${extra}`;
  });
}

export function loadManifest(root: string): { manifest: PluginManifest; errors: string[] } {
  const path = join(root, "plugin.json");
  if (!exists(path)) fail(`${path} not found: the plugin root must hold plugin.json`);
  const data = readJson(path);
  return { manifest: data as PluginManifest, errors: schemaErrors(data) };
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** The Markdown text after the frontmatter block (the whole text when there is none). */
export function bodyOf(text: string): string {
  return text.replace(FRONTMATTER_RE, "");
}

/** Frontmatter attributes of a Markdown file, or null when it has none. */
export function frontmatter(path: string): Record<string, unknown> | null {
  const match = readText(path).match(FRONTMATTER_RE);
  if (!match) return null;
  let attrs: unknown;
  try {
    attrs = parseYaml(match[1] ?? "");
  } catch (error) {
    return fail(`${path}: frontmatter is not valid YAML: ${(error as Error).message}`);
  }
  if (typeof attrs !== "object" || attrs === null || Array.isArray(attrs)) return null;
  return attrs as Record<string, unknown>;
}

/** `name` and `description` of an agent file (Markdown with frontmatter). */
export function agentHeader(path: string): { name?: string; description?: string } | null {
  const attrs = frontmatter(path);
  if (attrs === null) return null;
  return { name: str(attrs.name), description: str(attrs.description) };
}

function str(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/** Deterministic JSON: two-space indent, trailing newline, keys in insertion order. */
export function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

/** Copies `source` into a new object with only the listed keys, in that order. */
export function pick<T extends object>(source: T, keys: readonly (keyof T)[]): Partial<T> {
  const out: Partial<T> = {};
  for (const key of keys) {
    if (source[key] !== undefined) out[key] = source[key];
  }
  return out;
}
