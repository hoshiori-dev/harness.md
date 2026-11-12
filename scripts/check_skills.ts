#!/usr/bin/env node
// Lints the skills this plugin ships under skills/. check_plugin.ts holds the
// Agent Plugins floor (layout, name, description presence); this script holds
// the quality bar .agents/knowledge/skill-quality.md documents: description
// budgets by kind, body size, structure, links, reachability, script hygiene,
// and the repository's own invariants (layer ownership, the builders' fixed
// steps, shared blocks, workflow invocation, the specification copy,
// delivered-asset tests and placeholders). Errors are findings; advice is a
// warning on stderr that never changes the exit code.
import { dirname, join, normalize, relative } from "node:path";
import {
  exists,
  Findings,
  gitFiles,
  isDirectory,
  listDir,
  readText,
  warn,
} from "./lib/findings.ts";
import type { Layer } from "./lib/layers.ts";
import { builderName, LAYERS, ownershipPhrase } from "./lib/layers.ts";
import { bodyOf, frontmatter, SKILL_NAME_RE } from "./lib/plugin.ts";

const root = process.cwd();
const findings = new Findings();
const tracked = gitFiles(root);

const SKILLS_DIR = "skills";
const CANON_PATH = ".agents/knowledge/shared-blocks.md";
const SPEC_PATH = "spec/spec.md";
const SPEC_COPY = "skills/harness-md/references/specification.md";
const WORKFLOW_SKILLS = ["harness-design", "harness-build", "harness-extract", "harness-audit"];
/** A layer builder is `<layer>-building`; this one builds project skills, not a layer. */
const NOT_A_LAYER_BUILDER = "project-skill-building";
const BUILDER_STEPS = [
  "### 1. Observe",
  "### 2. Write the section",
  "### 3. Build",
  "### 4. Verify",
  "### 5. Audit",
  "### 6. Hand back",
];
/** Codex per-skill metadata; the only file a skill keeps outside scripts/, references/, assets/. */
const CODEX_METADATA = "agents/openai.yaml";
const PENDING_DECISIONS = "references/pending-decisions.md";
const INSERTION_MARKER = "<!-- harness: spec-workflow -->";
const INSERTION_MARKER_COUNT = 3;
const INSTALL_CMD_RE =
  /npx skills add|pnpm dlx skills|bunx skills|yarn dlx skills|skills add \S+\/skills/;
const TRIGGER_RE = /\b(when|before|if|on|after|during)\b/i;
const LINK_RE = /\[[^\]]*\]\(([^)\s]+)\)/g;
const SHARED_RE = /<!-- shared:([a-z0-9-]+) -->\n([\s\S]*?)<!-- \/shared:\1 -->/g;
const OWNERSHIP_RE = /Owns the ([A-Za-z][A-Za-z -]*?) layer/g;
const PLACEHOLDER_RE = /\{\{[A-Z_]+\}\}/;
/** Interpreter and tool caches a test run leaves behind; never part of a skill. */
const CACHE_RE = /(^|\/)(__pycache__|\.pytest_cache|\.ruff_cache)\/|\.py[co]$/;
/** Codex lists every description within 8,000 characters, so they share one budget. */
const DESCRIPTION_LIMITS = { builder: 240, workflow: 400, other: 700 } as const;
const DESCRIPTION_TOTAL_LIMIT = 8000;
const COMPATIBILITY_LIMIT = 500;
const BODY_LINE_WARN = 500;
const BODY_TOKEN_WARN = 5000;

type Kind = keyof typeof DESCRIPTION_LIMITS;

const skills = isDirectory(join(root, SKILLS_DIR))
  ? listDir(join(root, SKILLS_DIR))
      .filter((e) => e.isDirectory)
      .map((e) => e.name)
  : [];

if (skills.length === 0) {
  console.log("check_skills: ok (no skills)");
  process.exit(0);
}

const bodies = new Map<string, string>();
const descriptions = new Map<string, string>();
for (const name of skills) checkSkill(name);
reportDescriptionBudget();
checkLayerOwnership();
checkSharedBlocks();
checkPendingDecisions();
checkInsertionMarkers();
checkSpecificationCopy();
process.exit(findings.report("check_skills"));

function kindOf(name: string): Kind {
  if (WORKFLOW_SKILLS.includes(name)) return "workflow";
  if (name.endsWith("-building") && name !== NOT_A_LAYER_BUILDER) return "builder";
  return "other";
}

function skillFiles(name: string): string[] {
  const prefix = `${SKILLS_DIR}/${name}/`;
  return tracked.filter(
    (p) =>
      p.startsWith(prefix) &&
      p !== `${prefix}SKILL.md` &&
      !CACHE_RE.test(p) &&
      exists(join(root, p)),
  );
}

function checkSkill(name: string) {
  const dir = `${SKILLS_DIR}/${name}`;
  const file = `${dir}/SKILL.md`;
  if (!exists(join(root, file))) return; // check_plugin reports skill-shape
  const text = readText(join(root, file));
  bodies.set(name, text);
  const attrs = frontmatter(join(root, file));
  if (attrs === null) {
    findings.add({
      file,
      rule: "skill-frontmatter",
      problem: "no YAML frontmatter.",
      fix: "start the file with --- name/description/license ---.",
    });
    return;
  }
  checkFrontmatter(name, file, attrs);
  checkBodySize(file, text);
  checkStructure(name, dir);
  checkLinksAndReachability(name, dir, file, text);
  checkScripts(name);
  checkBodyRules(name, file, text);
  checkWorkflowInvocation(name, file, attrs);
  if (kindOf(name) === "builder") checkBuilderSteps(file, text);
}

function checkFrontmatter(name: string, file: string, attrs: Record<string, unknown>) {
  if (attrs.name !== name) {
    findings.add({
      file,
      rule: "skill-name",
      problem: `frontmatter name ${JSON.stringify(attrs.name)} differs from the directory name.`,
      fix: `set name: ${name}.`,
    });
  } else if (!SKILL_NAME_RE.test(name) || name.length > 64) {
    findings.add({
      file,
      rule: "skill-name",
      problem: `"${name}" is not a valid skill name.`,
      fix: "use 1-64 lowercase letters, digits, and single hyphens.",
    });
  }
  const description = attrs.description;
  if (typeof description !== "string" || description.trim() === "") {
    findings.add({
      file,
      rule: "skill-description",
      problem: "description is missing or empty.",
      fix: "write a description that names the capability and lists the triggers.",
    });
  } else {
    descriptions.set(name, description);
    const kind = kindOf(name);
    const limit = DESCRIPTION_LIMITS[kind];
    const length = [...description].length;
    if (length > limit) {
      findings.add({
        file,
        rule: "skill-description",
        problem: `description has ${length} characters (limit ${limit} for ${article(kind)}).`,
        fix: "cut identity that the body already states; keep one trigger per branch.",
      });
    }
  }
  if (typeof attrs.license !== "string" || attrs.license.trim() === "") {
    findings.add({
      file,
      rule: "skill-license",
      problem: "frontmatter has no license.",
      fix: "add license: Apache-2.0 (the plugin's license).",
    });
  }
  const hasScripts = skillFiles(name).some((p) => p.endsWith(".py"));
  if ("compatibility" in attrs) {
    const compat = attrs.compatibility;
    if (typeof compat !== "string" || [...compat].length > COMPATIBILITY_LIMIT) {
      findings.add({
        file,
        rule: "skill-compatibility",
        problem: `compatibility is not a string of at most ${COMPATIBILITY_LIMIT} characters.`,
        fix: "state only the runtime the bundled scripts require, briefly.",
      });
    }
    if (!hasScripts) {
      warn({
        file,
        rule: "skill-compatibility",
        problem: "declares compatibility but bundles no script.",
        fix: "remove the field; a SKILL.md-only skill has no environment requirement.",
      });
    }
  } else if (hasScripts) {
    warn({
      file,
      rule: "skill-compatibility",
      problem: "bundles scripts but declares no compatibility.",
      fix: "add a compatibility line naming the runtime (Python 3.10+ with uv).",
    });
  }
}

function article(kind: Kind): string {
  return kind === "builder"
    ? "a layer builder"
    : kind === "workflow"
      ? "a workflow skill"
      : "a skill that is neither a layer builder nor a workflow";
}

/** Every description's length against its limit, and the shared total. */
function reportDescriptionBudget() {
  let total = 0;
  const width = Math.max(...skills.map((s) => s.length));
  console.log("description budget (characters):");
  for (const name of skills) {
    const description = descriptions.get(name);
    if (description === undefined) continue;
    const kind = kindOf(name);
    const length = [...description].length;
    total += length;
    console.log(
      `  ${name.padEnd(width)}  ${kind.padEnd(8)}  ${String(length).padStart(4)} / ${DESCRIPTION_LIMITS[kind]}`,
    );
  }
  console.log(
    `  ${"total".padEnd(width)}  ${"".padEnd(8)}  ${String(total).padStart(4)} / ${DESCRIPTION_TOTAL_LIMIT}`,
  );
  if (total > DESCRIPTION_TOTAL_LIMIT) {
    findings.add({
      file: `${SKILLS_DIR}/`,
      rule: "skill-description-total",
      problem: `all descriptions together have ${total} characters (limit ${DESCRIPTION_TOTAL_LIMIT}).`,
      fix: "shorten the longest descriptions: Codex lists every description inside one 8,000-character budget and drops what does not fit.",
    });
  }
}

function checkBodySize(file: string, text: string) {
  const body = bodyOf(text);
  const lines = body.split("\n").length;
  const tokens = Math.round(body.length / 4);
  if (lines > BODY_LINE_WARN || tokens > BODY_TOKEN_WARN) {
    warn({
      file,
      rule: "skill-body-size",
      problem: `body has ${lines} lines and about ${tokens} tokens (advice: under ${BODY_LINE_WARN} lines and ${BODY_TOKEN_WARN} tokens).`,
      fix: "disclose branch-specific material into references/ behind a when-to-read pointer.",
    });
  }
}

function checkStructure(name: string, dir: string) {
  for (const sub of ["scripts", "references", "assets"]) {
    const path = join(root, dir, sub);
    if (!isDirectory(path)) continue;
    if (!tracked.some((p) => p.startsWith(`${dir}/${sub}/`))) {
      findings.add({
        file: `${dir}/${sub}/`,
        rule: "skill-structure",
        problem: "directory holds no tracked file.",
        fix: "delete the empty directory or put the file it was made for in it.",
      });
    }
  }
  if (exists(join(root, dir, "README.md"))) {
    findings.add({
      file: `${dir}/README.md`,
      rule: "skill-structure",
      problem: "a skill root holds no README; SKILL.md is the whole entry.",
      fix: "move the content into SKILL.md or a references/ file and delete README.md.",
    });
  }
  const unexpected = skillFiles(name).filter((p) => {
    const rel = p.slice(dir.length + 1);
    return (
      !/^(scripts|references|assets)\//.test(rel) && rel !== "README.md" && rel !== CODEX_METADATA
    );
  });
  for (const p of unexpected) {
    findings.add({
      file: p,
      rule: "skill-structure",
      problem: `file sits outside scripts/, references/, and assets/ (only ${CODEX_METADATA} may).`,
      fix: "move it into one of those directories and link it from SKILL.md.",
    });
  }
}

function linksOf(text: string): { target: string; line: number }[] {
  const out: { target: string; line: number }[] = [];
  text.split("\n").forEach((line, index) => {
    for (const match of line.matchAll(LINK_RE)) {
      const target = match[1] ?? "";
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      const path = target.split("#")[0] ?? "";
      if (path !== "") out.push({ target: path, line: index + 1 });
    }
  });
  return out;
}

function checkLinksAndReachability(name: string, dir: string, file: string, text: string) {
  const reachable = new Set<string>();
  // Transitive through Markdown: an asset linked from a reference SKILL.md links is reachable.
  const visit = (from: string, body: string) => {
    for (const { target, line } of linksOf(body)) {
      const resolved = normalize(join(dirname(from), target));
      if (target.startsWith("/") || relative(dir, resolved).startsWith("..")) {
        findings.add({
          file: from,
          line,
          rule: "skill-link-escape",
          problem: `link ${target} leaves the skill directory.`,
          fix: "a skill is self-contained: copy the material into the skill or drop the link.",
        });
        continue;
      }
      if (!exists(join(root, resolved))) {
        findings.add({
          file: from,
          line,
          rule: "skill-link",
          problem: `link target ${target} does not exist.`,
          fix: "correct the path or remove the pointer.",
        });
        continue;
      }
      if (reachable.has(resolved)) continue;
      reachable.add(resolved);
      if (resolved.endsWith(".md")) visit(resolved, readText(join(root, resolved)));
    }
  };
  visit(file, text);
  for (const p of skillFiles(name)) {
    if (p.endsWith("_test.py") || p === `${dir}/${CODEX_METADATA}`) continue;
    if (!reachable.has(p)) {
      findings.add({
        file: p,
        rule: "skill-file-reachable",
        problem: "not linked from SKILL.md or from a file SKILL.md links.",
        fix: "link it at first mention with its load condition, or delete it.",
      });
    }
  }
}

function checkScripts(name: string) {
  const scripts = skillFiles(name).filter(
    (p) =>
      p.endsWith(".py") && !p.endsWith("_test.py") && /^skills\/[^/]+\/(scripts|assets)\//.test(p),
  );
  for (const p of scripts) {
    const text = readText(join(root, p));
    const firstLine = text.split("\n")[0];
    if (
      firstLine !== "#!/usr/bin/env -S uv run --script" &&
      firstLine !== "#!/usr/bin/env python3"
    ) {
      findings.add({
        file: p,
        line: 1,
        rule: "script-shebang",
        problem: "first line is not a uv or python3 shebang.",
        fix: "use `#!/usr/bin/env -S uv run --script` (`#!/usr/bin/env python3` is tolerated for a standard-library-only script).",
      });
    }
    if (!text.includes("# /// script") || !/requires-python\s*=\s*">=3\.10"/.test(text)) {
      findings.add({
        file: p,
        rule: "script-pep723",
        problem: 'no PEP 723 block with requires-python = ">=3.10".',
        fix: "add the `# /// script` block so uv and plain python3 agree on the runtime.",
      });
    }
    if (!text.includes("--help")) {
      findings.add({
        file: p,
        rule: "script-help",
        problem: "does not mention --help.",
        fix: "accept --help with a usage example; agents read it before running the script.",
      });
    }
    const test = p.replace(/\.py$/, "_test.py");
    if (!exists(join(root, test))) {
      findings.add({
        file: p,
        rule: "asset-has-test",
        problem: `has no sibling ${test.split("/").at(-1)}.`,
        fix: "add the pytest file; delivered management code is tested in this repository.",
      });
    }
  }
  const assets = skillFiles(name).filter((p) => /^skills\/[^/]+\/assets\//.test(p));
  for (const p of assets) {
    readText(join(root, p))
      .split("\n")
      .forEach((line, index) => {
        if (PLACEHOLDER_RE.test(line) && !line.includes("# CONFIGURE:")) {
          findings.add({
            file: p,
            line: index + 1,
            rule: "asset-no-placeholder",
            problem: "placeholder outside a `# CONFIGURE:` line.",
            fix: "assets are starting shapes with real text; mark the few settings a target fills with `# CONFIGURE:`.",
          });
        }
      });
  }
}

function checkBodyRules(name: string, file: string, text: string) {
  const installFinding = (path: string, line: number) =>
    findings.add({
      file: path,
      line,
      rule: "skill-no-install-cmd",
      problem: "names an external skill-library install command.",
      fix: "the plugin is self-contained; state the rule here instead of pointing at another library.",
    });
  text.split("\n").forEach((line, index) => {
    if (INSTALL_CMD_RE.test(line)) installFinding(file, index + 1);
    if (/\]\((?:\.\/)?references\/[^)]+\.md\)/.test(line) && !TRIGGER_RE.test(line)) {
      warn({
        file,
        line: index + 1,
        rule: "skill-pointer-has-trigger",
        problem: "links a reference without a load condition on the same line.",
        fix: 'word the pointer as "Read references/x.md when …".',
      });
    }
  });
  for (const p of skillFiles(name).filter((p) => p.endsWith(".md"))) {
    readText(join(root, p))
      .split("\n")
      .forEach((line, index) => {
        if (INSTALL_CMD_RE.test(line)) installFinding(p, index + 1);
      });
  }
}

function checkWorkflowInvocation(name: string, file: string, attrs: Record<string, unknown>) {
  const isWorkflow = WORKFLOW_SKILLS.includes(name);
  const flag = attrs["disable-model-invocation"];
  if (isWorkflow && flag !== true) {
    findings.add({
      file,
      rule: "workflow-invocation",
      problem: "a workflow skill must be user-invoked only.",
      fix: "add `disable-model-invocation: true` to the frontmatter.",
    });
  } else if (!isWorkflow && flag !== undefined) {
    findings.add({
      file,
      rule: "workflow-invocation",
      problem: `only the workflow skills (${WORKFLOW_SKILLS.join(", ")}) may disable model invocation.`,
      fix: "remove `disable-model-invocation`; every other skill is reached by its description.",
    });
  }
}

/** A layer builder's workflow has the six fixed steps, in order, so workflows can address them. */
function checkBuilderSteps(file: string, text: string) {
  const lines = bodyOf(text)
    .split("\n")
    .map((l) => l.trimEnd());
  let cursor = -1;
  for (const step of BUILDER_STEPS) {
    const index = lines.indexOf(step);
    if (index === -1) {
      findings.add({
        file,
        rule: "builder-steps",
        problem: `the fixed step heading "${step}" is missing.`,
        fix: `a layer builder's workflow is exactly: ${BUILDER_STEPS.map((s) => s.slice(4)).join("; ")}.`,
      });
    } else if (index < cursor) {
      findings.add({
        file,
        rule: "builder-steps",
        problem: `the step heading "${step}" is out of order.`,
        fix: `keep the steps in this order: ${BUILDER_STEPS.map((s) => s.slice(4)).join("; ")}.`,
      });
    } else {
      cursor = index;
    }
  }
}

function checkLayerOwnership() {
  const owners = new Map<string, string[]>();
  for (const [name, text] of bodies) {
    const description = descriptions.get(name) ?? "";
    const file = `${SKILLS_DIR}/${name}/SKILL.md`;
    const phrases = [...description.matchAll(OWNERSHIP_RE)].map((m) => m[1] ?? "");
    if (kindOf(name) === "builder") {
      const layer = phrases[0];
      if (phrases.length !== 1 || layer === undefined) {
        findings.add({
          file,
          rule: "layer-ownership",
          problem: `description carries ${phrases.length} ownership phrases; a layer builder carries exactly one.`,
          fix: `write "${ownershipPhrase("<Layer>")}" once, with a layer from scripts/lib/layers.ts.`,
        });
      } else if (!(LAYERS as readonly string[]).includes(layer)) {
        findings.add({
          file,
          rule: "layer-ownership",
          problem: `"${layer}" is not a layer.`,
          fix: `use one of: ${LAYERS.join(", ")} (capitalised as the HARNESS.md section).`,
        });
      } else {
        owners.set(layer, [...(owners.get(layer) ?? []), name]);
        if (name !== builderName(layer as Layer)) {
          findings.add({
            file,
            rule: "layer-ownership",
            problem: `claims the ${layer} layer, whose builder is named ${builderName(layer as Layer)}.`,
            fix: `rename the skill to ${builderName(layer as Layer)}, or claim the layer its name carries.`,
          });
        }
      }
    } else if (phrases.length > 0 || [...text.matchAll(OWNERSHIP_RE)].length > 0) {
      findings.add({
        file,
        rule: "layer-ownership",
        problem: "carries an ownership phrase but is not a layer builder.",
        fix: `remove the phrase or write it as the pattern "${ownershipPhrase("<Layer>")}"; only <layer>-building skills own a layer.`,
      });
    }
  }
  for (const layer of LAYERS) {
    const names = owners.get(layer) ?? [];
    if (names.length === 1) continue;
    findings.add({
      file: `${SKILLS_DIR}/${builderName(layer)}/SKILL.md`,
      rule: "layer-builder",
      problem:
        names.length === 0
          ? `no skill owns the ${layer} layer.`
          : `${names.length} skills own the ${layer} layer: ${names.join(", ")}.`,
      fix: `exactly one builder, ${builderName(layer)}, carries "${ownershipPhrase(layer)}" in its description.`,
    });
  }
}

function checkSharedBlocks() {
  const canonPath = join(root, CANON_PATH);
  const canon = new Map<string, string>();
  const used = new Set<string>();
  if (exists(canonPath)) {
    for (const m of readText(canonPath).matchAll(SHARED_RE)) {
      canon.set(m[1] ?? "", trimLines(m[2] ?? ""));
    }
  }
  for (const [name, text] of bodies) {
    const file = `${SKILLS_DIR}/${name}/SKILL.md`;
    for (const m of text.matchAll(SHARED_RE)) {
      const id = m[1] ?? "";
      used.add(id);
      if (!canon.has(id)) {
        findings.add({
          file,
          rule: "shared-block",
          problem: `shared block "${id}" has no canon in ${CANON_PATH}.`,
          fix: `add the block under the same delimiters to ${CANON_PATH}, or drop the delimiters.`,
        });
      } else if (trimLines(m[2] ?? "") !== canon.get(id)) {
        findings.add({
          file,
          rule: "shared-block",
          problem: `shared block "${id}" differs from its canon.`,
          fix: `copy the block from ${CANON_PATH} verbatim (or change the canon and every user).`,
        });
      }
    }
  }
  for (const id of canon.keys()) {
    if (!used.has(id)) {
      findings.add({
        file: CANON_PATH,
        rule: "shared-block",
        problem: `canon block "${id}" is used by no skill.`,
        fix: "delete the block from the canon or add it to the skill that needs it.",
      });
    }
  }
}

function trimLines(text: string): string {
  return text
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n");
}

/** The pending-decisions format has one text: every skill's copy is the same file. */
function checkPendingDecisions() {
  const present = skills
    .map((name) => `${SKILLS_DIR}/${name}/${PENDING_DECISIONS}`)
    .filter((p) => exists(join(root, p)));
  const first = present[0];
  if (first === undefined || present.length < 2) return;
  const canon = readText(join(root, first));
  for (const p of present.slice(1)) {
    if (readText(join(root, p)) !== canon) {
      findings.add({
        file: p,
        rule: "pending-decisions-identical",
        problem: `differs from ${first}.`,
        fix: "the pending-decisions format has one text; copy it byte for byte into every skill that carries it.",
      });
    }
  }
}

/**
 * A platform asset set that carries the spec-workflow insertion marker carries
 * it exactly three times (request template, the project skill's finish step,
 * the platform knowledge file); a set without the marker is not checked.
 */
function checkInsertionMarkers() {
  for (const name of skills) {
    for (const platform of ["github", "gitlab"]) {
      const dir = `${SKILLS_DIR}/${name}/assets/${platform}`;
      if (!isDirectory(join(root, dir))) continue;
      let count = 0;
      for (const p of skillFiles(name).filter((p) => p.startsWith(`${dir}/`))) {
        count += readText(join(root, p)).split(INSERTION_MARKER).length - 1;
      }
      if (count !== 0 && count !== INSERTION_MARKER_COUNT) {
        findings.add({
          file: `${dir}/`,
          rule: "insertion-markers",
          problem: `${count} insertion marker(s) "${INSERTION_MARKER}" across the assets; exactly ${INSERTION_MARKER_COUNT} are expected.`,
          fix: "one marker each in the request template, the project skill's finish step, and the platform knowledge file.",
        });
      }
    }
  }
}

/** The format skill carries the specification; its copy never differs from spec/spec.md. */
function checkSpecificationCopy() {
  if (!skills.includes("harness-md")) return;
  if (!exists(join(root, SPEC_PATH))) {
    findings.add({
      file: SPEC_PATH,
      rule: "specification-copy",
      problem: "the format specification is missing.",
      fix: `restore ${SPEC_PATH}; ${SPEC_COPY} is a copy of it.`,
    });
    return;
  }
  if (!exists(join(root, SPEC_COPY))) {
    findings.add({
      file: SPEC_COPY,
      rule: "specification-copy",
      problem: "the format skill carries no copy of the specification.",
      fix: `cp ${SPEC_PATH} ${SPEC_COPY}`,
    });
  } else if (readText(join(root, SPEC_COPY)) !== readText(join(root, SPEC_PATH))) {
    findings.add({
      file: SPEC_COPY,
      rule: "specification-copy",
      problem: `differs from ${SPEC_PATH}.`,
      fix: `edit ${SPEC_PATH} (through an OpenSpec change), then cp ${SPEC_PATH} ${SPEC_COPY}`,
    });
  }
}
