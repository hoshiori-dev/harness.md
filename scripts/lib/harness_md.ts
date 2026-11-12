// The HARNESS.md format validator this repository runs on its own files (the
// root HARNESS.md and every hub entry). It implements section 7 of
// spec/spec.md and nothing else. A second implementation ships to users
// inside the format skill (skills/harness-md/scripts/lint_harness_md.py);
// the two are kept in step by the shared cases under spec/fixtures/, which
// `just fixtures-check` runs through both.
import { isMap, isScalar, LineCounter, parseDocument } from "yaml";

export type Severity = "error" | "warning" | "note";

export interface Finding {
  severity: Severity;
  code: string;
  message: string;
  /** 1-based line in the file; 1 when the finding is about the file as a whole. */
  line: number;
}

/** Format versions, oldest first; the last one is what this validator supports. */
export const VERSIONS = ["alpha"] as const;
export const CURRENT_VERSION = VERSIONS[VERSIONS.length - 1] as string;

/** The recommended second-level sections in specification order (section 5.2). */
export const SECTIONS = [
  "Context",
  "Invariants",
  "Style",
  "File Structure",
  "Environment",
  "Knowledge",
  "Feedback",
  "Gates",
  "Authority",
  "Completion",
  "Entropy",
  "Open Questions",
  "References",
] as const;

export const KEYS = ["name", "description", "version", "license", "metadata"] as const;

const NAME_MAX = 64;
const DESCRIPTION_MAX = 1024;
const NAME_FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DELIMITER = /^---[ \t]*$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const H1 = /^ {0,3}#(?:[ \t].*)?$/;
const H2 = /^ {0,3}##(?!#)[ \t]+(.*)$/;

export interface Frontmatter {
  /** Top-level keys in file order, as written. */
  keys: string[];
  /** String values of the string-typed keys that are present and are strings. */
  strings: Record<string, string>;
  /** The parsed frontmatter as plain data; `metadata` is included untouched. */
  data: Record<string, unknown>;
}

export interface Parsed {
  findings: Finding[];
  /** Absent when the frontmatter is missing or invalid. */
  frontmatter?: Frontmatter;
  /** Recommended sections found, in file order, with their lines. */
  sections: { name: string; line: number }[];
  /** Lines of the first-level headings in the body, in file order. */
  titles: number[];
}

function codePoints(text: string): number {
  return [...text].length;
}

function normalise(text: string): string[] {
  return text.replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n");
}

function parseFrontmatter(
  lines: string[],
  findings: Finding[],
): { frontmatter?: Frontmatter; bodyStart: number; noBody?: boolean } {
  if (!DELIMITER.test(lines[0] ?? "")) {
    findings.push({
      severity: "error",
      code: "frontmatter-missing",
      message:
        "the file has no frontmatter; start it with a line containing only `---`, the keys `name` and `description`, and a closing `---` line",
      line: 1,
    });
    return { bodyStart: 0 };
  }
  const end = lines.findIndex((line, index) => index > 0 && DELIMITER.test(line));
  if (end === -1) {
    findings.push({
      severity: "error",
      code: "frontmatter-invalid",
      message:
        "the frontmatter is never closed; add a line containing only `---` after the last key",
      line: 1,
    });
    return { bodyStart: lines.length, noBody: true };
  }
  const source = lines.slice(1, end).join("\n");
  const lineCounter = new LineCounter();
  // YAML 1.1 and duplicate keys allowed at parse time, so both validators
  // (this one and the PyYAML-based script) read the same values and report
  // duplicates themselves, at the top level only.
  const doc = parseDocument(source, { version: "1.1", uniqueKeys: false, lineCounter });
  const first = doc.errors[0];
  if (first) {
    findings.push({
      severity: "error",
      code: "frontmatter-invalid",
      message: `the frontmatter is not valid YAML: ${first.message.split("\n")[0]}`,
      line: (first.linePos?.[0].line ?? 1) + 1,
    });
    return { bodyStart: end + 1 };
  }
  if (!isMap(doc.contents)) {
    findings.push({
      severity: "error",
      code: "frontmatter-invalid",
      message:
        "the frontmatter must be a YAML mapping of keys to values, such as `name: my-design`",
      line: 1,
    });
    return { bodyStart: end + 1 };
  }

  const keys: string[] = [];
  const strings: Record<string, string> = {};
  const seen = new Set<string>();
  const known: readonly string[] = KEYS;
  const present = new Map<string, { line: number; value: unknown }>();
  for (const pair of doc.contents.items) {
    const keyNode = pair.key;
    const key = isScalar(keyNode) ? String(keyNode.value) : String(keyNode);
    const offset = isScalar(keyNode) && keyNode.range ? keyNode.range[0] : 0;
    const line = lineCounter.linePos(offset).line + 1;
    keys.push(key);
    if (seen.has(key)) {
      findings.push({
        severity: "error",
        code: "key-duplicate",
        message: `the key \`${key}\` appears more than once; keep one`,
        line,
      });
      continue;
    }
    seen.add(key);
    if (!known.includes(key)) {
      findings.push({
        severity: "error",
        code: "key-unknown",
        message: `\`${key}\` is not a key the format defines (${known.join(", ")}); move it under \`metadata\``,
        line,
      });
      continue;
    }
    const valueNode = pair.value;
    const value = isScalar(valueNode) ? valueNode.value : (valueNode ?? null);
    present.set(key, { line, value });
  }

  for (const key of ["name", "description"]) {
    const entry = present.get(key);
    if (!entry || entry.value === null || entry.value === "") {
      findings.push({
        severity: "error",
        code: "key-missing",
        message: `the frontmatter needs a non-empty \`${key}\``,
        line: entry?.line ?? 1,
      });
    } else if (typeof entry.value !== "string") {
      findings.push({
        severity: "error",
        code: "key-type",
        message: `\`${key}\` must be a string; quote the value`,
        line: entry.line,
      });
    } else if (entry.value.trim() === "") {
      findings.push({
        severity: "error",
        code: "key-missing",
        message: `the frontmatter needs a non-empty \`${key}\``,
        line: entry.line,
      });
    } else {
      strings[key] = entry.value;
    }
  }
  for (const key of ["version", "license"]) {
    const entry = present.get(key);
    if (!entry) continue;
    if (typeof entry.value !== "string") {
      findings.push({
        severity: "error",
        code: "key-type",
        message: `\`${key}\` must be a string; quote the value or remove the key`,
        line: entry.line,
      });
    } else {
      strings[key] = entry.value;
    }
  }

  const name = strings.name;
  if (name !== undefined) {
    const line = present.get("name")?.line ?? 1;
    if (codePoints(name) > NAME_MAX) {
      findings.push({
        severity: "warning",
        code: "name-length",
        message: `\`name\` is ${codePoints(name)} characters; keep it within ${NAME_MAX}`,
        line,
      });
    }
    if (!NAME_FORMAT.test(name)) {
      findings.push({
        severity: "warning",
        code: "name-format",
        message:
          "`name` should use only lowercase letters, digits, and single hyphens, and not start or end with a hyphen",
        line,
      });
    }
  }
  const description = strings.description;
  if (description !== undefined && codePoints(description) > DESCRIPTION_MAX) {
    findings.push({
      severity: "warning",
      code: "description-length",
      message: `\`description\` is ${codePoints(description)} characters; keep it within ${DESCRIPTION_MAX}`,
      line: present.get("description")?.line ?? 1,
    });
  }
  const version = strings.version;
  if (version !== undefined) {
    const line = present.get("version")?.line ?? 1;
    const index = (VERSIONS as readonly string[]).indexOf(version);
    if (index === -1) {
      findings.push({
        severity: "warning",
        code: "version-unknown",
        message: `\`version: ${version}\` is not a version this validator knows (${VERSIONS.join(", ")}); the file was checked against \`${CURRENT_VERSION}\``,
        line,
      });
    } else if (index < VERSIONS.length - 1) {
      findings.push({
        severity: "note",
        code: "version-older",
        message: `the file is written for \`${version}\`; the current version is \`${CURRENT_VERSION}\``,
        line,
      });
    }
  }

  const data = doc.toJS() as Record<string, unknown>;
  return { frontmatter: { keys, strings, data }, bodyStart: end + 1 };
}

function findHeadings(
  lines: string[],
  bodyStart: number,
): { sections: { name: string; line: number }[]; titles: number[] } {
  const found: { name: string; line: number }[] = [];
  const titles: number[] = [];
  const defined: readonly string[] = SECTIONS;
  let fence: { char: string; length: number } | undefined;
  for (let index = bodyStart; index < lines.length; index++) {
    const line = lines[index] ?? "";
    const fenceMatch = FENCE.exec(line);
    if (fence) {
      const marker = fenceMatch?.[1];
      if (
        marker?.startsWith(fence.char) &&
        marker.length >= fence.length &&
        line.trim() === marker
      ) {
        fence = undefined;
      }
      continue;
    }
    if (fenceMatch?.[1]) {
      fence = { char: fenceMatch[1].charAt(0), length: fenceMatch[1].length };
      continue;
    }
    if (H1.test(line)) {
      titles.push(index + 1);
      continue;
    }
    const heading = H2.exec(line);
    if (!heading) continue;
    const text = (heading[1] ?? "").replace(/[ \t]+#+[ \t]*$/, "").trim();
    if (defined.includes(text)) found.push({ name: text, line: index + 1 });
  }
  return { sections: found, titles };
}

/** Parse a HARNESS.md and collect every finding of spec/spec.md section 7. */
export function parse(text: string): Parsed {
  const findings: Finding[] = [];
  const lines = normalise(text);
  const { frontmatter, bodyStart, noBody } = parseFrontmatter(lines, findings);
  const { sections, titles } = findHeadings(lines, bodyStart);

  // An unclosed frontmatter leaves no body to look at; say nothing about it.
  if (!noBody) {
    if (titles.length === 0) {
      findings.push({
        severity: "warning",
        code: "title-missing",
        message:
          "the body has no first-level heading; start it with a `# Title` line, followed by an introduction",
        line: Math.min(bodyStart + 1, lines.length),
      });
    } else if (titles.length > 1) {
      findings.push({
        severity: "warning",
        code: "title-multiple",
        message: `the body has ${titles.length} first-level headings (the first on line ${titles[0]}); keep one as the title of the document`,
        line: titles[1] ?? 1,
      });
    }
  }

  const firstLine = new Map<string, number>();
  const repeated = new Set<string>();
  for (const section of sections) {
    if (!firstLine.has(section.name)) {
      firstLine.set(section.name, section.line);
    } else if (!repeated.has(section.name)) {
      // Once for each repeated name, however often it repeats.
      repeated.add(section.name);
      findings.push({
        severity: "warning",
        code: "section-duplicate",
        message: `the recommended section \`${section.name}\` appears more than once (first on line ${firstLine.get(section.name)}); merge them`,
        line: section.line,
      });
    }
  }
  const order: readonly string[] = SECTIONS;
  let latest: { name: string; rank: number } | undefined;
  for (const [name, line] of firstLine) {
    const rank = order.indexOf(name);
    if (latest && rank < latest.rank) {
      findings.push({
        severity: "warning",
        code: "section-order",
        message: `\`${name}\` comes after \`${latest.name}\`; the recommended order puts it before`,
        line,
      });
    } else {
      latest = { name, rank };
    }
  }

  findings.sort((a, b) => a.line - b.line);
  return { findings, frontmatter, sections, titles };
}

export function lint(text: string): Finding[] {
  return parse(text).findings;
}

const ENCODING_INVALID: Finding = {
  severity: "error",
  code: "encoding-invalid",
  message: "the file is not valid UTF-8 text; save it as UTF-8",
  line: 1,
};

/** Parse the bytes of a file; a file that is not UTF-8 gets that one finding and no other. */
export function parseBytes(bytes: Uint8Array): Parsed {
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
  } catch {
    return { findings: [{ ...ENCODING_INVALID }], sections: [], titles: [] };
  }
  return parse(text);
}

export function lintBytes(bytes: Uint8Array): Finding[] {
  return parseBytes(bytes).findings;
}

/** One line per finding, in the shape editors and CI logs link: `path:line: severity[code]: message`. */
export function format(path: string, findings: Finding[]): string[] {
  return findings.map((f) => `${path}:${f.line}: ${f.severity}[${f.code}]: ${f.message}`);
}
