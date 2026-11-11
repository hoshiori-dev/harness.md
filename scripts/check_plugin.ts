#!/usr/bin/env node
// Checks the plugin package and its client wiring: schema conformance of the
// portable manifest, agreement between files that must name the same things,
// skill and agent layout, and the 1:1 relation between the OpenSpec catalogs
// and what the package ships. Every finding names the file and the fix.
//
//   check_plugin.ts                  run every rule
//   check_plugin.ts --footprint <id> print the files that belong to one client
import { join } from "node:path";
import type { ClientSpec } from "./lib/clients.ts";
import { CLIENTS, clientById, footprint } from "./lib/clients.ts";
import { exists, Findings, fail, isDirectory, listDir, readText } from "./lib/findings.ts";
import type { PluginManifest } from "./lib/plugin.ts";
import {
  agentHeader,
  frontmatter,
  loadManifest,
  PORTABLE_NAME_RE,
  SKILL_NAME_RE,
} from "./lib/plugin.ts";

const root = process.cwd();
const args = process.argv.slice(2);

if (args[0] === "--footprint") {
  const id = args[1];
  if (!id) fail(`--footprint needs a client id: ${CLIENTS.map((c) => c.id).join(", ")}`);
  try {
    for (const path of footprint(clientById(id), root)) console.log(path);
  } catch (error) {
    fail((error as Error).message);
  }
  process.exit(0);
}
if (args.length > 0) {
  fail(`unknown arguments ${args.join(" ")}; use --footprint <client> or nothing`);
}

const findings = new Findings();
const { manifest, errors: manifestErrors } = loadManifest(root);
for (const e of manifestErrors) {
  findings.add({
    file: "plugin.json",
    rule: "schema-plugin",
    problem: `${e}.`,
    fix: "match the Agent Plugins 1.0.0 plugin schema (scripts/schemas/).",
  });
}

checkName(manifest);
checkNoMcp();
const skills = checkSkills();
const agents = checkAgents();
checkCodex(manifest);
checkCatalogs(skills, agents);
process.exit(findings.report("check_plugin"));

function checkName(manifest: PluginManifest) {
  if (typeof manifest.name !== "string") return; // the schema finding covers it
  if (!PORTABLE_NAME_RE.test(manifest.name)) {
    findings.add({
      file: "plugin.json",
      rule: "name-portable",
      problem: `name "${manifest.name}" is not accepted by every supported client.`,
      fix: "use lowercase letters, digits, and single hyphens, starting and ending with a letter or digit.",
    });
  }
}

// The plugin ships no MCP server; gen.ts, dist.ts, and the client wiring have
// no MCP branch, so a server file would ship half-wired.
function checkNoMcp() {
  for (const path of ["mcp.json", "mcp_config.json", "com.anthropic.claude-code/mcp.json"]) {
    if (!exists(join(root, path))) continue;
    findings.add({
      file: path,
      rule: "mcp-unsupported",
      problem: "this plugin ships no MCP server, and nothing generates or packages MCP files.",
      fix: "delete the file; adding a server starts with an OpenSpec change that restores the MCP tooling.",
    });
  }
}

/** Returns the skill directory names. */
function checkSkills(): string[] {
  const dir = join(root, "skills");
  if (!isDirectory(dir)) return [];
  const names: string[] = [];
  const projectSkills = isDirectory(join(root, ".agents/skills"))
    ? new Set(
        listDir(join(root, ".agents/skills"))
          .filter((e) => e.isDirectory)
          .map((e) => e.name),
      )
    : new Set<string>();
  for (const entry of listDir(dir)) {
    if (!entry.isDirectory) continue;
    const file = `skills/${entry.name}/SKILL.md`;
    if (!exists(join(root, file))) {
      findings.add({
        file: `skills/${entry.name}/`,
        rule: "skill-shape",
        problem: "directory has no SKILL.md.",
        fix: "add SKILL.md with name and description frontmatter, or delete the directory.",
      });
      continue;
    }
    names.push(entry.name);
    const attrs = frontmatter(join(root, file));
    if (attrs === null) {
      findings.add({
        file,
        rule: "skill-frontmatter",
        problem: "no YAML frontmatter.",
        fix: "start the file with --- name/description ---.",
      });
      continue;
    }
    checkSkillFrontmatter(file, entry.name, attrs);
    if (projectSkills.has(entry.name)) {
      findings.add({
        file,
        rule: "skill-name-collision",
        problem: `a project skill .agents/skills/${entry.name} has the same name.`,
        fix: "rename one of them; Codex and Antigravity load both directories.",
      });
    }
  }
  return names;
}

function checkSkillFrontmatter(file: string, dir: string, attrs: Record<string, unknown>) {
  const name = attrs.name;
  if (name !== dir) {
    findings.add({
      file,
      rule: "skill-name",
      problem: `frontmatter name ${JSON.stringify(name)} differs from the directory name.`,
      fix: `set name: ${dir}.`,
    });
  } else if (!SKILL_NAME_RE.test(dir) || dir.length > 64) {
    findings.add({
      file,
      rule: "skill-name",
      problem: `"${dir}" is not a valid agentskills.io name.`,
      fix: "use 1-64 lowercase letters, digits, and single hyphens; rename the directory and the frontmatter.",
    });
  }
  const description = attrs.description;
  if (
    typeof description !== "string" ||
    description.trim().length === 0 ||
    description.length > 1024
  ) {
    findings.add({
      file,
      rule: "skill-description",
      problem: "description is missing, empty, or over 1024 characters.",
      fix: "write a 1-1024 character description saying what the skill does and when to use it.",
    });
  }
}

interface AgentFile {
  client: ClientSpec;
  file: string;
  name: string;
  description?: string;
}

/** Returns agent names → files per client, after per-file checks. */
function checkAgents(): Map<string, AgentFile[]> {
  const byName = new Map<string, AgentFile[]>();
  for (const client of CLIENTS) {
    const spec = client.agents;
    if (!spec) {
      // The client's plugin system carries no agents: an agents directory
      // under its namespace would ship to nobody.
      const stray = `${client.namespaceDir}/agents`;
      if (isDirectory(join(root, stray))) {
        findings.add({
          file: stray,
          rule: "agent-unsupported",
          problem: `${client.id} plugins carry no agents, so nothing loads this directory.`,
          fix: "remove it; keep the role in the client's own workspace configuration, outside the plugin.",
        });
      }
      continue;
    }
    const dir = join(root, spec.dir);
    if (!isDirectory(dir)) continue;
    for (const entry of listDir(dir)) {
      if (!entry.isFile) continue;
      const file = `${spec.dir}/${entry.name}`;
      if (!entry.name.endsWith(spec.ext)) {
        findings.add({
          file,
          rule: "agent-extension",
          problem: `${client.id} agents are ${spec.ext} files.`,
          fix: "rename the file or move it to the right client directory.",
        });
        continue;
      }
      const stem = entry.name.slice(0, -spec.ext.length);
      const header = agentHeader(join(root, file));
      if (header === null || header.name === undefined) {
        findings.add({
          file,
          rule: "agent-name",
          problem: "no name field.",
          fix: `declare name: ${stem} in the frontmatter.`,
        });
        continue;
      }
      if (header.name !== stem) {
        findings.add({
          file,
          rule: "agent-name",
          problem: `name "${header.name}" differs from the file name.`,
          fix: `rename the file to ${header.name}${spec.ext} or set name to ${stem}.`,
        });
      }
      if (!header.description) {
        findings.add({
          file,
          rule: "agent-description",
          problem: "no description.",
          fix: "add a one-sentence description; clients use it to decide when to delegate.",
        });
      }
      const list = byName.get(header.name) ?? [];
      list.push({ client, file, name: header.name, description: header.description });
      byName.set(header.name, list);
    }
  }
  for (const [name, files] of byName) {
    for (const client of CLIENTS) {
      const spec = client.agents;
      if (!spec) continue;
      if (!files.some((f) => f.client === client)) {
        findings.add({
          file: `${spec.dir}/${name}${spec.ext}`,
          rule: "agent-parity",
          problem: `agent "${name}" exists for ${files
            .map((f) => f.client.id)
            .join(", ")} but not for ${client.id}.`,
          fix: `add the ${client.id} version, or remove the agent from every client.`,
        });
      }
    }
    const descriptions = new Set(files.map((f) => f.description));
    if (descriptions.size > 1) {
      findings.add({
        file: files[0]?.file ?? name,
        rule: "agent-description-parity",
        problem: `agent "${name}" has different descriptions across clients.`,
        fix: "use the same description text in every client version.",
      });
    }
  }
  return byName;
}

/** True when the TOML text holds `[plugins."<key>"]` with `enabled = true` before the next table. */
function codexPluginEnabled(toml: string, key: string): boolean {
  let inTable = false;
  for (const raw of toml.split("\n")) {
    const line = raw.replace(/#.*$/, "").trim();
    if (line.startsWith("[")) {
      inTable = line === `[plugins."${key}"]` || line === `[plugins.'${key}']`;
      continue;
    }
    if (inTable && /^enabled\s*=\s*true$/.test(line)) return true;
  }
  return false;
}

function checkCodex(manifest: PluginManifest) {
  // Every extensions block must belong to a supported client (Agent Plugins §8
  // namespaces); a block for a client this project dropped is dead data.
  const namespaces = new Set(CLIENTS.map((c) => c.namespaceDir));
  for (const ns of Object.keys(manifest.extensions ?? {})) {
    if (namespaces.has(ns)) continue;
    findings.add({
      file: "plugin.json",
      rule: "extension-namespace",
      problem: `extensions.${ns} belongs to no supported client.`,
      fix: "remove the block, or register the client in scripts/lib/clients.ts.",
    });
  }
  const client = CLIENTS.find((c) => c.id === "codex");
  if (!client) return;
  const extension = manifest.extensions?.["com.openai"] as
    | { interface?: Record<string, unknown> }
    | undefined;
  if (extension === undefined) {
    findings.add({
      file: "plugin.json",
      rule: "codex-extension",
      problem: "Codex is a supported client but extensions.com.openai is missing.",
      fix: "add the block with interface.{displayName,shortDescription,developerName,category}, or drop Codex from scripts/lib/clients.ts.",
    });
    return;
  }
  const iface = extension.interface ?? {};
  const pairs: [string, unknown, string, unknown][] = [
    ["interface.shortDescription", iface.shortDescription, "description", manifest.description],
    ["interface.developerName", iface.developerName, "author.name", manifest.author?.name],
    ["interface.websiteURL", iface.websiteURL, "homepage", manifest.homepage],
  ];
  for (const [field, value, source, expected] of pairs) {
    if (value !== undefined && expected !== undefined && value !== expected) {
      findings.add({
        file: "plugin.json",
        rule: "codex-interface",
        problem: `extensions.com.openai.${field} differs from ${source}.`,
        fix: `set it to the same value as ${source}, which is the source of truth.`,
      });
    }
  }
  const configPath = ".codex/config.toml";
  if (!exists(join(root, configPath))) {
    findings.add({
      file: configPath,
      rule: "codex-wiring",
      problem: "file is missing.",
      fix: `create it with a [plugins."${manifest.name}@${manifest.name}"] table holding enabled = true.`,
    });
    return;
  }
  const key = `${manifest.name}@${manifest.name}`;
  if (!codexPluginEnabled(readText(join(root, configPath)), key)) {
    findings.add({
      file: configPath,
      rule: "codex-plugin-enabled",
      problem: `no [plugins."${key}"] enabled = true.`,
      fix: "add that table so the local marketplace plugin is enabled for this project.",
    });
  }
}

function checkCatalogs(skills: string[], agents: Map<string, AgentFile[]>) {
  const specs = join(root, "openspec/specs");
  if (!isDirectory(specs)) {
    console.log("note: openspec/specs is absent; catalog checks skipped");
    return;
  }
  const catalogs: [string, string[], string][] = [
    ["skill", skills, "skills/<name>/"],
    ["agent", [...agents.keys()], "<client>/agents/<name>"],
  ];
  for (const [catalog, implemented, where] of catalogs) {
    const dir = join(specs, catalog);
    const specNames = isDirectory(dir)
      ? listDir(dir)
          .filter((e) => e.isDirectory && exists(join(dir, e.name, "spec.md")))
          .map((e) => e.name)
      : [];
    if ((implemented.length > 0 || specNames.length > 0) && !exists(join(dir, "spec.md"))) {
      findings.add({
        file: `openspec/specs/${catalog}/spec.md`,
        rule: "catalog-rules",
        problem: `the ${catalog} catalog has entries but no shared rules spec.`,
        fix: "write the catalog-level spec.md with the rules every entry follows.",
      });
    }
    const proposed = proposedSpecs(catalog);
    for (const name of implemented) {
      if (!specNames.includes(name) && !proposed.has(name)) {
        findings.add({
          file: `openspec/specs/${catalog}/${name}/spec.md`,
          rule: "catalog-missing-spec",
          problem:
            `${where.replace("<name>", name)} is implemented but has no spec, ` +
            "neither archived nor proposed by an unarchived change.",
          fix: "add the spec through an OpenSpec change, or remove the implementation.",
        });
      }
    }
    for (const name of specNames) {
      if (!implemented.includes(name)) {
        findings.add({
          file: `openspec/specs/${catalog}/${name}/spec.md`,
          rule: "catalog-orphan-spec",
          problem: `spec exists but ${where.replace("<name>", name)} is not implemented.`,
          fix: "implement it, or archive a change that removes the spec.",
        });
      }
    }
  }
}

// Entries an unarchived change proposes: `openspec/changes/<id>/specs/<catalog>/<name>/spec.md`
// outside `archive/`. In the combined shape an entry is implemented on the branch before the
// change is archived, so its delta spec stands in for the main spec until the archive commit;
// the `checks / spec-archived` gate keeps such a branch from merging.
function proposedSpecs(catalog: string): Set<string> {
  const changes = join(root, "openspec/changes");
  const names = new Set<string>();
  if (!isDirectory(changes)) return names;
  for (const change of listDir(changes)) {
    if (!change.isDirectory || change.name === "archive") continue;
    const dir = join(changes, change.name, "specs", catalog);
    if (!isDirectory(dir)) continue;
    for (const entry of listDir(dir)) {
      if (entry.isDirectory && exists(join(dir, entry.name, "spec.md"))) names.add(entry.name);
    }
  }
  return names;
}
