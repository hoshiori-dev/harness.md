// The HARNESS.md format validator this repository runs on its own documents
// (its own design document and every hub entry). A HARNESS.md is a directory
// whose main file is SKILL.md; this file implements the findings of
// openspec/specs/cli/lint (section 7 of spec/spec.md) and nothing else.
// A second implementation ships to users inside the format skill
// (skills/harness-md/scripts/lint_harness_md.py). Nothing compares the two:
// each implements the same specification and proves every finding code in its
// own unit tests.
import { readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { basename, join, normalize, posix, resolve } from "node:path";
import { fromMarkdown } from "mdast-util-from-markdown";
import { isMap, isScalar, LineCounter, parseDocument } from "yaml";

export type Severity = "error" | "warning";

/** Every finding code with its severity; a finding takes its severity from here. */
export const CODES = {
  "encoding-invalid": "error",
  "main-file-missing": "error",
  "frontmatter-missing": "error",
  "frontmatter-invalid": "error",
  "key-missing": "error",
  "key-type": "error",
  "key-duplicate": "error",
  "name-format": "error",
  "name-length": "error",
  "name-directory": "error",
  "description-length": "error",
  "compatibility-length": "error",
  "marker-prefix": "error",
  "marker-type": "error",
  "metadata-value": "error",
  "key-unknown": "warning",
  "key-allowed-tools": "warning",
  "link-missing": "warning",
  "file-unreachable": "warning",
  "title-missing": "warning",
  "title-multiple": "warning",
  "section-duplicate": "warning",
  "section-order": "warning",
} as const satisfies Record<string, Severity>;

export type Code = keyof typeof CODES;

/** A finding about one file's text. */
export interface Finding {
  severity: Severity;
  code: Code;
  message: string;
  /** 1-based line in the file; 1 when the finding is about the file as a whole. */
  line: number;
}

/** A finding about a document directory. */
export interface DirectoryFinding extends Finding {
  /**
   * The file the finding concerns, relative to the directory, with `/`
   * separators. `main-file-missing` is about the directory as a whole and
   * carries `SKILL.md` here.
   */
  file: string;
}

/** The main file of a document directory. */
export const MAIN_FILE = "SKILL.md";
/** The half of the type marker that starts `description`. */
export const MARKER_PREFIX = "[HARNESS.md]";
/** The half of the type marker that is the value of `metadata.type`. */
export const MARKER_TYPE = "harness-design";

/** The recommended second-level sections in specification order. */
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

/** The top-level keys of the frontmatter, those of an Agent Skill. */
export const KEYS = [
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
] as const;

const NAME_MAX = 64;
const DESCRIPTION_MAX = 1024;
const COMPATIBILITY_MAX = 500;
const NAME_FORMAT = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DELIMITER = /^---[ \t]*$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const H1 = /^ {0,3}#(?:[ \t].*)?$/;
const H2 = /^ {0,3}##(?!#)[ \t]+(.*)$/;
const UNQUOTED_MARKER = /^description:[ \t]*\[/;
const SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*:/;
const MARKDOWN_FILE = /\.(md|markdown)$/i;

export interface Frontmatter {
  /** Top-level keys in file order, as written. */
  keys: string[];
  /** String values of the string-typed keys that are present and are strings. */
  strings: Record<string, string>;
  /** The parsed frontmatter as plain data; `metadata` is included as parsed. */
  data: Record<string, unknown>;
  /** 1-based line of the first occurrence of each top-level key. */
  lines: Record<string, number>;
}

export interface Parsed {
  findings: Finding[];
  /** Absent when the frontmatter is missing or invalid. */
  frontmatter?: Frontmatter;
  /** Recommended sections found, in file order, with their lines. */
  sections: { name: string; line: number }[];
  /** Lines of the first-level headings in the body, in file order. */
  titles: number[];
  /** Number of lines before the body: the frontmatter and its delimiters. */
  bodyStart: number;
  /** False when the frontmatter is never closed, which leaves no body. */
  hasBody: boolean;
}

function finding(code: Code, line: number, message: string): Finding {
  return { severity: CODES[code], code, message, line };
}

function codePoints(text: string): number {
  return [...text].length;
}

function normalise(text: string): string[] {
  return text.replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n");
}

function checkMetadata(
  node: unknown,
  line: number | undefined,
  lineOf: (offset: number) => number,
  findings: Finding[],
): void {
  if (line === undefined) {
    findings.push(
      finding(
        "marker-type",
        1,
        `the frontmatter has no \`metadata\`; add \`metadata:\` with \`type: ${MARKER_TYPE}\` under it, which marks the document as a HARNESS.md`,
      ),
    );
    return;
  }
  if (!isMap(node)) {
    findings.push(
      finding(
        "metadata-value",
        line,
        `\`metadata\` must be a mapping of keys to strings, such as \`type: ${MARKER_TYPE}\` on an indented line under \`metadata:\``,
      ),
    );
    return;
  }
  // A key written twice inside `metadata` is not reported; the last one counts,
  // as it does for a YAML reader.
  let type: { value: unknown; line: number } | undefined;
  for (const pair of node.items) {
    const keyNode = pair.key;
    const key = isScalar(keyNode) ? String(keyNode.value) : String(keyNode);
    const keyLine = isScalar(keyNode) && keyNode.range ? lineOf(keyNode.range[0]) : line;
    const value = isScalar(pair.value) ? pair.value.value : (pair.value ?? null);
    if (typeof value !== "string") {
      findings.push(
        finding(
          "metadata-value",
          keyLine,
          `\`metadata.${key}\` must be a string; quote the value (YAML reads \`1.0\` as a number), or join the items of a list with commas`,
        ),
      );
    }
    if (key === "type") type = { value, line: keyLine };
  }
  if (type?.value !== MARKER_TYPE) {
    findings.push(
      finding(
        "marker-type",
        type?.line ?? line,
        type
          ? `\`metadata.type\` must be exactly \`${MARKER_TYPE}\`, which marks the document as a HARNESS.md`
          : `\`metadata\` has no \`type\`; add \`type: ${MARKER_TYPE}\` under it, which marks the document as a HARNESS.md`,
      ),
    );
  }
}

function parseFrontmatter(
  lines: string[],
  findings: Finding[],
): { frontmatter?: Frontmatter; bodyStart: number; hasBody: boolean } {
  if (!DELIMITER.test(lines[0] ?? "")) {
    findings.push(
      finding(
        "frontmatter-missing",
        1,
        "the file has no frontmatter; start it with a line containing only `---`, the keys `name`, `description`, and `metadata`, and a closing `---` line",
      ),
    );
    return { bodyStart: 0, hasBody: true };
  }
  const end = lines.findIndex((line, index) => index > 0 && DELIMITER.test(line));
  if (end === -1) {
    findings.push(
      finding(
        "frontmatter-invalid",
        1,
        "the frontmatter is never closed; add a line containing only `---` after the last key",
      ),
    );
    return { bodyStart: lines.length, hasBody: false };
  }
  const source = lines.slice(1, end).join("\n");
  const lineCounter = new LineCounter();
  const lineOf = (offset: number) => lineCounter.linePos(offset).line + 1;
  // YAML 1.1 and duplicate keys allowed at parse time, so both validators
  // (this one and the PyYAML-based script) read the same values; duplicates
  // are reported here, at the top level only.
  const doc = parseDocument(source, { version: "1.1", uniqueKeys: false, lineCounter });
  const first = doc.errors[0];
  if (first) {
    // `description: [HARNESS.md] A design` is a malformed YAML list, not a string.
    const unquoted = lines.slice(1, end).some((line) => UNQUOTED_MARKER.test(line));
    const hint = unquoted
      ? `; a \`description\` that starts with \`${MARKER_PREFIX}\` is not a YAML string as written: quote the value or use a block scalar (\`description: >-\` with the text on the next lines, indented)`
      : "";
    findings.push(
      finding(
        "frontmatter-invalid",
        (first.linePos?.[0].line ?? 1) + 1,
        `the frontmatter is not valid YAML: ${first.message.split("\n")[0]}${hint}`,
      ),
    );
    return { bodyStart: end + 1, hasBody: true };
  }
  if (!isMap(doc.contents)) {
    findings.push(
      finding(
        "frontmatter-invalid",
        1,
        "the frontmatter must be a YAML mapping of keys to values, such as `name: my-design`",
      ),
    );
    return { bodyStart: end + 1, hasBody: true };
  }

  const keys: string[] = [];
  const strings: Record<string, string> = {};
  const keyLines: Record<string, number> = {};
  const seen = new Set<string>();
  const known: readonly string[] = KEYS;
  const present = new Map<string, { line: number; value: unknown; node: unknown }>();
  for (const pair of doc.contents.items) {
    const keyNode = pair.key;
    const key = isScalar(keyNode) ? String(keyNode.value) : String(keyNode);
    const line = lineOf(isScalar(keyNode) && keyNode.range ? keyNode.range[0] : 0);
    keys.push(key);
    if (seen.has(key)) {
      findings.push(
        finding("key-duplicate", line, `the key \`${key}\` appears more than once; keep one`),
      );
      continue;
    }
    seen.add(key);
    keyLines[key] = line;
    if (!known.includes(key)) {
      findings.push(
        finding(
          "key-unknown",
          line,
          key === "version"
            ? "`version` is not a top-level key of the format; state the version of the design at `metadata.version`, as a string"
            : `\`${key}\` is not a key the format defines (${known.join(", ")}); move it under \`metadata\``,
        ),
      );
      continue;
    }
    const valueNode = pair.value;
    const value = isScalar(valueNode) ? valueNode.value : (valueNode ?? null);
    present.set(key, { line, value, node: valueNode });
  }

  for (const key of ["name", "description"]) {
    const entry = present.get(key);
    if (
      !entry ||
      entry.value === null ||
      (typeof entry.value === "string" && entry.value.trim() === "")
    ) {
      findings.push(
        finding("key-missing", entry?.line ?? 1, `the frontmatter needs a non-empty \`${key}\``),
      );
    } else if (typeof entry.value !== "string") {
      findings.push(
        finding("key-type", entry.line, `\`${key}\` must be a string; quote the value`),
      );
    } else {
      strings[key] = entry.value;
    }
  }
  for (const key of ["license", "compatibility", "allowed-tools"]) {
    const entry = present.get(key);
    if (!entry) continue;
    if (typeof entry.value !== "string") {
      findings.push(
        finding(
          "key-type",
          entry.line,
          `\`${key}\` must be a string; quote the value or remove the key`,
        ),
      );
    } else {
      strings[key] = entry.value;
    }
  }

  const name = strings.name;
  if (name !== undefined) {
    const line = keyLines.name ?? 1;
    if (codePoints(name) > NAME_MAX) {
      findings.push(
        finding(
          "name-length",
          line,
          `\`name\` is ${codePoints(name)} characters; it must be at most ${NAME_MAX}`,
        ),
      );
    }
    if (!NAME_FORMAT.test(name)) {
      findings.push(
        finding(
          "name-format",
          line,
          "`name` must use only lowercase letters, digits, and single hyphens, and not start or end with a hyphen",
        ),
      );
    }
  }
  const description = strings.description;
  if (description !== undefined) {
    const line = keyLines.description ?? 1;
    if (codePoints(description) > DESCRIPTION_MAX) {
      findings.push(
        finding(
          "description-length",
          line,
          `\`description\` is ${codePoints(description)} characters; it must be at most ${DESCRIPTION_MAX}`,
        ),
      );
    }
    if (!description.startsWith(MARKER_PREFIX)) {
      findings.push(
        finding(
          "marker-prefix",
          line,
          `\`description\` must start with the exact text \`${MARKER_PREFIX}\`, which marks the document as a HARNESS.md; put it before the first word`,
        ),
      );
    }
  }
  const compatibility = strings.compatibility;
  if (compatibility !== undefined) {
    const length = codePoints(compatibility);
    if (length === 0 || length > COMPATIBILITY_MAX) {
      findings.push(
        finding(
          "compatibility-length",
          keyLines.compatibility ?? 1,
          length === 0
            ? `\`compatibility\` is empty; give it 1 to ${COMPATIBILITY_MAX} characters or remove the key`
            : `\`compatibility\` is ${length} characters; it must be at most ${COMPATIBILITY_MAX}`,
        ),
      );
    }
  }
  if (strings["allowed-tools"] !== undefined) {
    findings.push(
      finding(
        "key-allowed-tools",
        keyLines["allowed-tools"] ?? 1,
        "`allowed-tools` grants tools to whoever loads the document, and a design document is only read; remove the key",
      ),
    );
  }
  const metadata = present.get("metadata");
  checkMetadata(metadata?.node, metadata?.line, lineOf, findings);

  const data = doc.toJS() as Record<string, unknown>;
  return {
    frontmatter: { keys, strings, data, lines: keyLines },
    bodyStart: end + 1,
    hasBody: true,
  };
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

/**
 * Parse the text of a `SKILL.md` and collect every finding that needs nothing
 * but that text: frontmatter, both marker halves, title, and sections.
 * The directory-level findings (`main-file-missing`, `name-directory`,
 * `link-missing`, `file-unreachable`) come from `readDirectory`.
 */
export function parse(text: string): Parsed {
  const findings: Finding[] = [];
  const lines = normalise(text);
  const { frontmatter, bodyStart, hasBody } = parseFrontmatter(lines, findings);
  const { sections, titles } = findHeadings(lines, bodyStart);

  // An unclosed frontmatter leaves no body to look at; say nothing about it.
  if (hasBody) {
    if (titles.length === 0) {
      findings.push(
        finding(
          "title-missing",
          Math.min(bodyStart + 1, lines.length),
          "the body has no first-level heading; start it with a `# Title` line, followed by an introduction",
        ),
      );
    } else if (titles.length > 1) {
      findings.push(
        finding(
          "title-multiple",
          titles[1] ?? 1,
          `the body has ${titles.length} first-level headings (the first on line ${titles[0]}); keep one as the title of the document`,
        ),
      );
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
      findings.push(
        finding(
          "section-duplicate",
          section.line,
          `the recommended section \`${section.name}\` appears more than once (first on line ${firstLine.get(section.name)}); merge them`,
        ),
      );
    }
  }
  const order: readonly string[] = SECTIONS;
  let latest: { name: string; rank: number } | undefined;
  for (const [name, line] of firstLine) {
    const rank = order.indexOf(name);
    if (latest && rank < latest.rank) {
      findings.push(
        finding(
          "section-order",
          line,
          `\`${name}\` comes after \`${latest.name}\`; the recommended order puts it before`,
        ),
      );
    } else {
      latest = { name, rank };
    }
  }

  findings.sort((a, b) => a.line - b.line);
  return { findings, frontmatter, sections, titles, bodyStart, hasBody };
}

export function lint(text: string): Finding[] {
  return parse(text).findings;
}

const ENCODING_MESSAGE = "the file is not valid UTF-8 text; save it as UTF-8";

function decode(bytes: Uint8Array): string | undefined {
  try {
    return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
  } catch {
    return undefined;
  }
}

/** Parse the bytes of a `SKILL.md`; a file that is not UTF-8 gets that one finding and no other. */
export function parseBytes(bytes: Uint8Array): Parsed {
  const text = decode(bytes);
  if (text === undefined) {
    return {
      findings: [finding("encoding-invalid", 1, ENCODING_MESSAGE)],
      sections: [],
      titles: [],
      bodyStart: 0,
      hasBody: false,
    };
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

/** Where the target of a link lies. */
export type LinkKind =
  /** Has a scheme, such as `https:` or `mailto:`; not checked. */
  | "scheme"
  /** Starts with `/`; not checked. */
  | "absolute"
  /** Only a fragment, such as `#gates`; not checked. */
  | "fragment"
  /** A relative path that leaves the directory; not checked. */
  | "outside"
  /** A relative path inside the directory; checked. */
  | "inside";

/** A link read from `SKILL.md` or from a Markdown file reached from it. */
export interface Link {
  /** The file that holds the link, relative to the directory. */
  file: string;
  /** 1-based line of the link, or of the definition of a reference-style link. */
  line: number;
  /** The destination as written, fragment included. */
  url: string;
  kind: LinkKind;
  /** For `inside`: the target relative to the directory, `.` for the directory itself. */
  target?: string;
}

interface MarkdownNode {
  type: string;
  url?: string;
  position?: { start: { line: number } };
  children?: MarkdownNode[];
}

/**
 * The destinations of the inline links, images, and link definitions of a
 * Markdown text. A reference-style link counts through its definition. Text
 * in code spans and fenced blocks is not a link to the parser, so it is not
 * returned.
 */
function linksOf(text: string): { url: string; line: number }[] {
  const out: { url: string; line: number }[] = [];
  const visit = (node: MarkdownNode) => {
    if (
      (node.type === "link" || node.type === "image" || node.type === "definition") &&
      typeof node.url === "string"
    ) {
      out.push({ url: node.url, line: node.position?.start.line ?? 1 });
    }
    for (const child of node.children ?? []) visit(child);
  };
  visit(fromMarkdown(text.replace(/^\uFEFF/, "")) as MarkdownNode);
  return out;
}

function classify(file: string, url: string): { kind: LinkKind; target?: string } {
  if (SCHEME.test(url)) return { kind: "scheme" };
  if (url.startsWith("/") || url.startsWith("\\")) return { kind: "absolute" };
  let path = url.split("#")[0] ?? "";
  if (path === "") return { kind: "fragment" };
  try {
    path = decodeURIComponent(path);
  } catch {
    // Not percent-encoding; take the path as written.
  }
  const target = posix.normalize(posix.join(posix.dirname(file), path)).replace(/\/+$/, "");
  if (target === ".." || target.startsWith("../")) return { kind: "outside" };
  return { kind: "inside", target: target === "" ? "." : target };
}

function hidden(path: string): boolean {
  return path.split("/").some((part) => part.startsWith("."));
}

/** Every file below `dir` whose name, and whose directories' names, do not start with a dot. */
function filesOf(dir: string, prefix = ""): string[] {
  const out: string[] = [];
  const entries = readdirSync(join(dir, prefix), { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const path = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) out.push(...filesOf(dir, path));
    // A link to a directory is neither a file of the document nor followed.
    else if (!(entry.isSymbolicLink() && kindOf(join(dir, path)) === "directory")) out.push(path);
  }
  return out;
}

function kindOf(path: string): "file" | "directory" | undefined {
  try {
    const stat = statSync(path);
    return stat.isDirectory() ? "directory" : "file";
  } catch {
    return undefined;
  }
}

function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export interface DirectoryResult {
  /** Ordered: those of `SKILL.md` first, then the other files by path, each by line. */
  findings: DirectoryFinding[];
  /** The parsed `SKILL.md`; absent when the file is missing or not UTF-8. */
  main?: Parsed;
  /** Every link read, in the order the files were read; empty when `SKILL.md` has no body to read. */
  links: Link[];
  /** The checked files of the directory, relative to it, sorted; `SKILL.md` included. */
  files: string[];
}

/**
 * Validate the document directory `dir`: its `SKILL.md`, the links of that
 * file and of every Markdown file reached from it, and the reachability of
 * every file in the directory. `dir` must be an existing directory.
 */
export function readDirectory(dir: string): DirectoryResult {
  const mainKind = kindOf(join(dir, MAIN_FILE));
  if (mainKind !== "file") {
    return {
      findings: [
        {
          ...finding(
            "main-file-missing",
            1,
            `the directory has no \`${MAIN_FILE}\`; a HARNESS.md is a directory whose main file has that name: add it, or rename the file that holds the design`,
          ),
          file: MAIN_FILE,
        },
      ],
      links: [],
      files: [],
    };
  }
  const mainText = decode(readFileSync(join(dir, MAIN_FILE)));
  if (mainText === undefined) {
    // Nothing else is reported for a directory whose main file cannot be read as text.
    return {
      findings: [{ ...finding("encoding-invalid", 1, ENCODING_MESSAGE), file: MAIN_FILE }],
      links: [],
      files: [],
    };
  }

  const main = parse(mainText);
  const findings: DirectoryFinding[] = main.findings.map((f) => ({ ...f, file: MAIN_FILE }));
  const name = main.frontmatter?.strings.name;
  const directoryName = basename(realpathSync(resolve(dir)));
  if (name !== undefined && name !== directoryName) {
    findings.push({
      ...finding(
        "name-directory",
        main.frontmatter?.lines.name ?? 1,
        `\`name: ${name}\` must equal the name of the directory, \`${directoryName}\`; rename one of them`,
      ),
      file: MAIN_FILE,
    });
  }

  const links: Link[] = [];
  const files = filesOf(dir).sort(compare);
  // An unclosed frontmatter leaves no body: no link is read, and nothing is
  // said about the other files, which no body could have reached.
  if (main.hasBody) {
    const reached = new Set<string>([MAIN_FILE]);
    const read = (file: string, text: string) => {
      const queue: string[] = [];
      for (const { url, line } of linksOf(text)) {
        const { kind, target } = classify(file, url);
        links.push({ file, line, url, kind, ...(target === undefined ? {} : { target }) });
        if (target === undefined) continue;
        const targetKind = kindOf(join(dir, target));
        if (targetKind === undefined) {
          findings.push({
            ...finding(
              "link-missing",
              line,
              `the link \`${url}\` points to \`${target}\`, which is not in the directory; correct the path, add the file, or remove the link`,
            ),
            file,
          });
        } else if (targetKind === "file" && !reached.has(target)) {
          reached.add(target);
          // A name that starts with a dot is not checked, so it is not read either.
          if (MARKDOWN_FILE.test(target) && !hidden(target)) queue.push(target);
        }
      }
      for (const next of queue) {
        const nextText = decode(readFileSync(join(dir, next)));
        if (nextText === undefined) {
          findings.push({ ...finding("encoding-invalid", 1, ENCODING_MESSAGE), file: next });
        } else {
          read(next, nextText);
        }
      }
    };
    // The frontmatter is YAML, not Markdown: blank it and keep the line numbers.
    const body = normalise(mainText).map((line, index) => (index < main.bodyStart ? "" : line));
    read(MAIN_FILE, body.join("\n"));

    for (const file of files) {
      if (reached.has(file)) continue;
      findings.push({
        ...finding(
          "file-unreachable",
          1,
          `no link reaches this file from \`${MAIN_FILE}\`; link it from \`${MAIN_FILE}\` or from a file it links, or remove it`,
        ),
        file,
      });
    }
  }

  const rank = (f: DirectoryFinding) => (f.file === MAIN_FILE ? 0 : 1);
  findings.sort((a, b) => rank(a) - rank(b) || compare(a.file, b.file) || a.line - b.line);
  return { findings, main, links, files };
}

/** The findings of the document directory `dir`, in the order they are printed. */
export function lintDirectory(dir: string): DirectoryFinding[] {
  return readDirectory(dir).findings;
}

/**
 * One line per finding, `path:line: severity[code]: message`, where `path` is
 * the path of the file under `dir`, or `dir` itself for a finding about the
 * directory as a whole.
 */
export function formatDirectory(dir: string, findings: DirectoryFinding[]): string[] {
  return findings.map((f) => {
    const path = f.code === "main-file-missing" ? normalize(join(dir, ".")) : join(dir, f.file);
    return `${path}:${f.line}: ${f.severity}[${f.code}]: ${f.message}`;
  });
}
