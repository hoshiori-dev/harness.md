#!/usr/bin/env node
// Checks this repository's own agent harness: the entrypoint, the knowledge
// files, the project skills, and the documents that mirror each other.
// Harness drift misleads every future agent with confidence, so these rules
// run in CI next to the code checks.
import { lstatSync, readlinkSync } from "node:fs";
import { dirname, join, normalize, relative } from "node:path";
import {
  exists,
  Findings,
  fail,
  gitFiles,
  isDirectory,
  listDir,
  readLinkOrNull,
  readText,
  run,
} from "./lib/findings.ts";
import { frontmatter, SKILL_NAME_RE } from "./lib/plugin.ts";

const root = process.cwd();
const AGENTS_MD_LIMIT = 120;
const README = "README.md";
const README_MIRROR = "README.zh.md";
const SPEC = "spec/spec.md";
const SPEC_MIRROR = "spec/spec.zh.md";
const LINK_RE = /\[[^\]]*\]\(([^)\s]+)\)/g;
const CODE_SPAN_RE = /`([^`\n]+)`/g;
const findings = new Findings();
const tracked = gitFiles(root).filter((p) => exists(join(root, p)));

// This repository's own documents. Shipped skills under skills/ are excluded:
// they describe a target project's commands, not this repository's recipes,
// and their links are checked by check_skills.ts.
const docs = tracked.filter(
  (p) =>
    p === "AGENTS.md" ||
    p === "CLAUDE.md" ||
    p === "HARNESS.md" ||
    p === README ||
    p === README_MIRROR ||
    p === "CONTRIBUTING.md" ||
    (p.startsWith(".agents/knowledge/") && p.endsWith(".md")) ||
    (p.startsWith(".agents/skills/") && p.endsWith(".md")) ||
    (p.startsWith("com.") && p.endsWith(".md")),
);
// The files an agent is routed through: a path they name must exist.
const routed = docs.filter((p) => p === "AGENTS.md" || p.startsWith(".agents/knowledge/"));

checkEntrypoint();
checkDesign();
checkLinks();
checkNamedPaths();
checkRecipes();
checkKnowledgeReachable();
checkProjectSkills();
checkClaudeSkillLinks();
checkSymlinks();
checkReadmes();
checkSpecMirror();
process.exit(findings.report("check_harness"));

function checkEntrypoint() {
  if (!exists(join(root, "AGENTS.md"))) {
    findings.add({
      file: "AGENTS.md",
      rule: "entrypoint",
      problem: "file is missing.",
      fix: "create the agent entrypoint.",
    });
    return;
  }
  const lines = readText(join(root, "AGENTS.md")).split("\n").length;
  if (lines > AGENTS_MD_LIMIT) {
    findings.add({
      file: "AGENTS.md",
      rule: "entrypoint-budget",
      problem: `has ${lines} lines (limit ${AGENTS_MD_LIMIT}).`,
      fix: "move detail into .agents/knowledge/ or a project skill and leave a when-to-read pointer.",
    });
  }
  // Claude Code reads AGENTS.md by itself when no CLAUDE.md exists; one that
  // does exist must import the entrypoint, or the two drift apart.
  if (
    exists(join(root, "CLAUDE.md")) &&
    !readText(join(root, "CLAUDE.md")).includes("@AGENTS.md")
  ) {
    findings.add({
      file: "CLAUDE.md",
      rule: "claude-import",
      problem: "does not import AGENTS.md.",
      fix: "make the file contain @AGENTS.md, or delete it: Claude Code reads AGENTS.md when no CLAUDE.md exists.",
    });
  }
}

function checkDesign() {
  if (exists(join(root, "HARNESS.md"))) return;
  findings.add({
    file: "HARNESS.md",
    rule: "design",
    problem: "file is missing.",
    fix: "restore this repository's harness design; the harness is built from it and `just harness-md-lint` validates it.",
  });
}

function checkLinks() {
  for (const doc of docs) {
    readText(join(root, doc))
      .split("\n")
      .forEach((line, index) => {
        for (const match of line.matchAll(LINK_RE)) {
          const target = match[1] ?? "";
          if (/^(https?:|mailto:|#)/.test(target)) continue;
          const path = target.split("#")[0] ?? "";
          if (path === "") continue;
          const resolved = normalize(join(dirname(doc), path));
          if (!exists(join(root, resolved))) {
            findings.add({
              file: doc,
              line: index + 1,
              rule: "doc-link",
              problem: `link target ${target} does not exist.`,
              fix: "correct the path or remove the pointer.",
            });
          }
        }
      });
  }
}

/**
 * A code span in the entrypoint or a knowledge file that names a path under an
 * existing top-level entry of the repository must exist. Spans with spaces,
 * placeholders, or globs are commands or patterns, not paths; a path git
 * ignores (build output, caches) is not expected in a checkout.
 */
function checkNamedPaths() {
  const top = new Set(listDir(root).map((e) => e.name));
  const candidates: { doc: string; line: number; path: string }[] = [];
  for (const doc of routed) {
    readText(join(root, doc))
      .split("\n")
      .forEach((line, index) => {
        for (const match of line.matchAll(CODE_SPAN_RE)) {
          const span = match[1] ?? "";
          if (/[\s<>*{}$|,;=()'"\\[\]]/.test(span) || /^[a-z]+:\/\//.test(span)) continue;
          const path = (span.split("#")[0] ?? "").replace(/:\d+(-\d+)?$/, "").replace(/\/+$/, "");
          const first = path.split("/")[0] ?? "";
          if (!path.includes("/") || path.startsWith("/") || !top.has(first)) continue;
          if (path.split("/").some((part) => part === ".." || part === ".")) continue;
          if (!exists(join(root, path))) candidates.push({ doc, line: index + 1, path });
        }
      });
  }
  if (candidates.length === 0) return;
  const ignored = gitIgnored([...new Set(candidates.map((c) => c.path))]);
  for (const { doc, line, path } of candidates) {
    if (ignored.has(path)) continue;
    findings.add({
      file: doc,
      line,
      rule: "doc-path",
      problem: `names \`${path}\`, which does not exist.`,
      fix: "correct the path, or remove the sentence when what it described is gone.",
    });
  }
}

function gitIgnored(paths: string[]): Set<string> {
  // A missing path may be a directory, and a directory-only pattern (`out/`)
  // matches only with the trailing slash, so both spellings are asked.
  const asked = paths.flatMap((p) => [p, `${p}/`]);
  const result = run("git", ["check-ignore", "--", ...asked], root);
  // 0: some are ignored; 1: none is; anything else is an unexpected failure.
  if (result.code !== 0 && result.code !== 1) {
    fail(`git check-ignore exited ${result.code}: ${result.stderr.trim()}`);
  }
  return new Set(
    result.stdout
      .split("\n")
      .filter((p) => p.length > 0)
      .map((p) => p.replace(/\/$/, "")),
  );
}

function checkRecipes() {
  if (!exists(join(root, "justfile"))) {
    findings.add({
      file: "justfile",
      rule: "recipes",
      problem: "file is missing.",
      fix: "add the justfile; documentation refers to `just <recipe>` commands.",
    });
    return;
  }
  const result = run("just", ["--summary"], root);
  if (result.code !== 0) fail(`just --summary exited ${result.code}: ${result.stderr.trim()}`);
  const recipes = new Set(result.stdout.trim().split(/\s+/));
  for (const doc of docs) {
    readText(join(root, doc))
      .split("\n")
      .forEach((line, index) => {
        for (const match of line.matchAll(/`just ([a-z][a-z0-9-]*)/g)) {
          const recipe = match[1] ?? "";
          if (!recipes.has(recipe)) {
            findings.add({
              file: doc,
              line: index + 1,
              rule: "doc-recipe",
              problem: `mentions \`just ${recipe}\`, which is not a recipe.`,
              fix: "add the recipe to the justfile or correct the document.",
            });
          }
        }
      });
  }
}

function checkKnowledgeReachable() {
  if (!exists(join(root, "AGENTS.md"))) return;
  const agentsMd = readText(join(root, "AGENTS.md"));
  for (const file of tracked.filter(
    (p) => p.startsWith(".agents/knowledge/") && p.endsWith(".md"),
  )) {
    if (!agentsMd.includes(file)) {
      findings.add({
        file,
        rule: "knowledge-reachable",
        problem: "not referenced from AGENTS.md.",
        fix: "add a when-to-read row pointing at this file, or delete the file.",
      });
    }
  }
}

function projectSkillFiles(): string[] {
  return tracked.filter((p) => /^\.agents\/skills\/[^/]+\/SKILL\.md$/.test(p));
}

function checkProjectSkills() {
  for (const file of projectSkillFiles()) {
    const dir = file.split("/").at(-2) ?? "";
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
    if (attrs.name !== dir) {
      findings.add({
        file,
        rule: "skill-name",
        problem: `frontmatter name ${JSON.stringify(attrs.name)} differs from the directory name.`,
        fix: `set name: ${dir}.`,
      });
    } else if (!SKILL_NAME_RE.test(dir) || dir.length > 64) {
      findings.add({
        file,
        rule: "skill-name",
        problem: `"${dir}" is not a valid agentskills.io name.`,
        fix: "use 1-64 lowercase letters, digits, and single hyphens.",
      });
    }
    const description = attrs.description;
    if (typeof description !== "string" || description.trim() === "" || description.length > 1024) {
      findings.add({
        file,
        rule: "skill-description",
        problem: "description is missing, empty, or over 1024 characters.",
        fix: "write a 1-1024 character description.",
      });
    }
  }
}

function checkClaudeSkillLinks() {
  const projectSkills = new Set(projectSkillFiles().map((p) => p.split("/")[2] ?? ""));
  for (const name of [...projectSkills].sort()) {
    const target = readLinkOrNull(join(root, ".claude/skills", name));
    if (target !== `../../.agents/skills/${name}`) {
      findings.add({
        file: `.claude/skills/${name}`,
        rule: "claude-skill-link",
        problem:
          target === null
            ? "missing symlink; Claude Code reads project skills only from .claude/skills/."
            : `points to ${target}.`,
        fix: `ln -sfn ../../.agents/skills/${name} .claude/skills/${name}`,
      });
    }
  }
  if (isDirectory(join(root, ".claude/skills"))) {
    for (const entry of listDir(join(root, ".claude/skills"))) {
      if (entry.isDirectory && !entry.isSymlink) {
        findings.add({
          file: `.claude/skills/${entry.name}`,
          rule: "claude-skill-link",
          problem: "is a real directory, so it can drift from .agents/skills.",
          fix: `replace it with a symlink: rm -r .claude/skills/${entry.name} && ln -s ../../.agents/skills/${entry.name} .claude/skills/${entry.name}`,
        });
      }
    }
  }
}

function checkSymlinks() {
  for (const path of tracked) {
    const full = join(root, path);
    if (!lstatSync(full).isSymbolicLink()) continue;
    const target = normalize(join(dirname(full), readlinkSync(full)));
    if (!exists(target)) {
      findings.add({
        file: path,
        rule: "dangling-symlink",
        problem: `points to ${relative(root, target)}, which does not exist.`,
        fix: "restore the target or remove the link.",
      });
    } else if (relative(root, target).startsWith("..")) {
      findings.add({
        file: path,
        rule: "symlink-escape",
        problem: "points outside the repository.",
        fix: "link only to paths inside the repository.",
      });
    }
  }
}

// README.md (English, authoritative) and README.zh.md (its Chinese mirror):
// the skill table of each lists the same skills, and every shipped skill
// appears in both.
function checkReadmes() {
  const readmes = [README, README_MIRROR];
  const shipped = tracked
    .filter((p) => /^skills\/[^/]+\/SKILL\.md$/.test(p))
    .map((p) => p.split("/")[1] ?? "");
  const tables = new Map<string, Set<string>>();
  for (const readme of readmes) {
    if (!exists(join(root, readme))) {
      findings.add({
        file: readme,
        rule: "readme-mirror",
        problem: "file is missing.",
        fix:
          readme === README
            ? "write the English README with the skill table."
            : `write it as the Chinese translation of ${README}, same skill table.`,
      });
      continue;
    }
    tables.set(readme, skillTableNames(readText(join(root, readme))));
  }
  const a = tables.get(README);
  const b = tables.get(README_MIRROR);
  if (a !== undefined && b !== undefined) {
    for (const [from, to, target] of [
      [a, b, README_MIRROR],
      [b, a, README],
    ] as const) {
      for (const name of from) {
        if (to.has(name)) continue;
        findings.add({
          file: target,
          rule: "readme-mirror",
          problem: `skill table lacks the row for ${name}, which ${target === README ? README_MIRROR : README} lists.`,
          fix: `add the ${name} row so both READMEs describe the same skills.`,
        });
      }
    }
  }
  for (const [readme, names] of tables) {
    for (const skill of shipped) {
      if (!names.has(skill)) {
        findings.add({
          file: readme,
          rule: "readme-skill-table",
          problem: `skill table has no row for skills/${skill}.`,
          fix: `add a row naming ${skill} with its one-line purpose.`,
        });
      }
    }
  }
}

/** Skill names from table rows under every heading that mentions skills (English or Chinese). */
function skillTableNames(text: string): Set<string> {
  const names = new Set<string>();
  let inSection = false;
  for (const line of text.split("\n")) {
    if (/^#{1,6}\s/.test(line)) inSection = /skills?|技能/i.test(line);
    if (!inSection) continue;
    const m = line.match(/^\| \*{0,2}\[?`?\[?([a-z0-9-]+)/);
    if (m?.[1] !== undefined && m[1] !== "skill") names.add(m[1]);
  }
  return names;
}

/** Headings per level, ATX only, fenced code blocks skipped. */
function headingCounts(text: string): number[] {
  const counts = [0, 0, 0, 0, 0, 0];
  let fence: string | null = null;
  for (const line of text.split("\n")) {
    const open = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (open?.[1] !== undefined) {
      const marker = open[1];
      if (fence === null) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      continue;
    }
    if (fence !== null) continue;
    const m = line.match(/^(#{1,6})\s/);
    if (m?.[1] !== undefined) counts[m[1].length - 1] = (counts[m[1].length - 1] ?? 0) + 1;
  }
  return counts;
}

// The Chinese specification mirrors the English one section by section; a
// heading added to one and not the other is the cheapest drift to catch.
function checkSpecMirror() {
  if (!exists(join(root, SPEC))) {
    findings.add({
      file: SPEC,
      rule: "spec-mirror",
      problem: "the format specification is missing.",
      fix: `restore ${SPEC}; it is the authoritative text of the format.`,
    });
    return;
  }
  if (!exists(join(root, SPEC_MIRROR))) {
    findings.add({
      file: SPEC_MIRROR,
      rule: "spec-mirror",
      problem: "file is missing.",
      fix: `write it as the Chinese translation of ${SPEC}, heading for heading.`,
    });
    return;
  }
  const en = headingCounts(readText(join(root, SPEC)));
  const zh = headingCounts(readText(join(root, SPEC_MIRROR)));
  en.forEach((count, index) => {
    if (zh[index] === count) return;
    findings.add({
      file: SPEC_MIRROR,
      rule: "spec-mirror",
      problem: `has ${zh[index]} level-${index + 1} heading(s); ${SPEC} has ${count}.`,
      fix: `bring the translation in line with ${SPEC}: every section there has one section here.`,
    });
  });
}
