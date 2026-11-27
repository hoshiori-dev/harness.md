// Unit tests of the format validator. Every case is built in a temporary
// directory; the last test fails when a finding code of
// openspec/specs/cli/lint has no case in this file.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, test } from "node:test";
import {
  CODES,
  type DirectoryFinding,
  format,
  formatDirectory,
  KEYS,
  lint,
  lintBytes,
  lintDirectory,
  parse,
  parseBytes,
  readDirectory,
  SECTIONS,
} from "./harness_md.ts";

/** The finding codes of cli/lint, requirement "Errors". */
const ERRORS = [
  "encoding-invalid",
  "main-file-missing",
  "frontmatter-missing",
  "frontmatter-invalid",
  "key-missing",
  "key-type",
  "key-duplicate",
  "name-format",
  "name-length",
  "name-directory",
  "description-length",
  "compatibility-length",
  "marker-prefix",
  "marker-type",
  "metadata-value",
] as const;

/** The finding codes of cli/lint, requirement "Warnings". */
const WARNINGS = [
  "key-unknown",
  "key-allowed-tools",
  "link-missing",
  "file-unreachable",
  "title-missing",
  "title-multiple",
  "section-duplicate",
  "section-order",
] as const;

type Expected = (typeof ERRORS)[number] | (typeof WARNINGS)[number];

/** Codes some case of this file expected and found. */
const covered = new Set<string>();

const roots: string[] = [];
after(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
});

const NAME = "my-design";
const FRONT = `name: ${NAME}\ndescription: "[HARNESS.md] A demo design."\nmetadata:\n  type: harness-design\n`;
const BODY = "# Demo\n\nAn introduction.\n";

function skill(front = FRONT, body = BODY): string {
  return `---\n${front}---\n\n${body}`;
}

function sections(names: readonly string[]): string {
  return BODY + names.map((name) => `\n## ${name}\n\nText.\n`).join("");
}

/** Creates `<temporary directory>/<name>/` holding `files` and returns its path. */
function directory(files: Record<string, string | Uint8Array>, name = NAME): string {
  const root = mkdtempSync(join(tmpdir(), "hmd-lint-"));
  roots.push(root);
  const dir = join(root, name);
  mkdirSync(dir);
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), content);
  }
  return dir;
}

/** The findings of a directory that holds `SKILL.md` with `text`, and `others`. */
function check(text: string, others: Record<string, string | Uint8Array> = {}): DirectoryFinding[] {
  return lintDirectory(directory({ "SKILL.md": text, ...others }));
}

/** Asserts the codes of `found`, in any order, and records them as covered. */
function expectCodes(found: { code: string; severity: string }[], expected: Expected[]): void {
  assert.deepEqual(found.map((f) => f.code).sort(), [...expected].sort());
  for (const f of found) {
    assert.equal(f.severity, CODES[f.code as Expected], `severity of ${f.code}`);
    covered.add(f.code);
  }
}

/** Asserts `file:line code` of every finding, in order, and records the codes as covered. */
function expectAt(found: DirectoryFinding[], expected: [string, number, Expected][]): void {
  assert.deepEqual(
    found.map((f) => [f.file, f.line, f.code]),
    expected,
  );
  for (const f of found) covered.add(f.code);
}

const LATIN1 = new Uint8Array([0x63, 0x61, 0x66, 0xe9, 0x0a]);

// ── Conforming documents ────────────────────────────────────────────────────

test("a conforming directory has no findings", () => {
  expectCodes(check(skill()), []);
  const linked = `${BODY}\nSee [the gates](references/gates.md) and [the check](scripts/check.py).\n`;
  expectCodes(
    check(skill(FRONT, linked), {
      "references/gates.md": "# Gates\n",
      "scripts/check.py": "print('ok')\n",
    }),
    [],
  );
});

test("the six keys of an Agent Skill are the defined keys", () => {
  assert.deepEqual(
    [...KEYS],
    ["name", "description", "license", "compatibility", "metadata", "allowed-tools"],
  );
  const front = `${FRONT}license: Apache-2.0\ncompatibility: Needs git.\n`;
  expectCodes(check(skill(front)), []);
});

test("a block scalar carries the marker prefix", () => {
  const front = `name: ${NAME}\ndescription: >-\n  [HARNESS.md] A demo design,\n  on two lines.\nmetadata:\n  type: harness-design\n`;
  expectCodes(check(skill(front)), []);
});

test("a byte order mark, CRLF line endings, and spaces after a delimiter change nothing", () => {
  expectCodes(check(`﻿${skill()}`), []);
  expectCodes(check(skill().replaceAll("\n", "\r\n")), []);
  expectCodes(check(`---  \n${FRONT}--- \t\n\n${BODY}`), []);
});

test("a long file and a location outside any repository are not reported", () => {
  expectCodes(check(skill(FRONT, BODY + "A line of prose.\n".repeat(5000))), []);
});

// ── Directory and encoding ──────────────────────────────────────────────────

test("a directory without SKILL.md gets main-file-missing and nothing else", () => {
  const dir = directory({ "README.md": "# Readme\n", "HARNESS.md": skill() });
  const found = lintDirectory(dir);
  expectAt(found, [["SKILL.md", 1, "main-file-missing"]]);
  assert.equal(found[0]?.severity, "error");
  assert.match(formatDirectory(dir, found)[0] ?? "", /my-design:1: error\[main-file-missing\]: /);
  assert.doesNotMatch(formatDirectory(dir, found)[0] ?? "", /SKILL\.md:1:/);
});

test("a SKILL.md that is not UTF-8 gets one error for the whole directory", () => {
  const dir = directory({ "SKILL.md": LATIN1, "notes.md": "[x](missing.md)\n" });
  const found = lintDirectory(dir);
  expectAt(found, [["SKILL.md", 1, "encoding-invalid"]]);
  assert.equal(found[0]?.severity, "error");
});

test("a reached Markdown file that is not UTF-8 is reported, and the rest is checked", () => {
  const body = `${BODY}\n[Gates](gates.md), [notes](notes.md).\n`;
  const found = check(skill(FRONT, body), {
    "gates.md": new Uint8Array([0x5b, 0x78, 0x5d, 0x28, 0x61, 0x2e, 0x6d, 0x64, 0x29, 0xff, 0x0a]),
    "notes.md": "[gone](gone.md)\n",
    "extra.txt": "x\n",
  });
  expectAt(found, [
    ["extra.txt", 1, "file-unreachable"],
    ["gates.md", 1, "encoding-invalid"],
    ["notes.md", 1, "link-missing"],
  ]);
});

// ── Frontmatter ─────────────────────────────────────────────────────────────

test("a file with no frontmatter and no headings", () => {
  expectCodes(check("Only a paragraph of text.\n"), ["frontmatter-missing", "title-missing"]);
});

test("frontmatter that does not start on the first line is missing", () => {
  expectCodes(check(`\n${skill()}`), ["frontmatter-missing"]);
});

test("an unclosed frontmatter is the only finding, the body is not looked at", () => {
  const text = `---\n${FRONT}\n# Demo\n\n# Again\n\n[x](missing.md)\n`;
  expectAt(check(text, { "notes.md": "x\n" }), [["SKILL.md", 1, "frontmatter-invalid"]]);
});

test("frontmatter that is empty, a list, a scalar, or not YAML is invalid", () => {
  for (const front of ["", "- a\n- b\n", "just text\n", "name: [unclosed\n", "a: b: c\n"]) {
    expectCodes(check(skill(front)), ["frontmatter-invalid"]);
  }
});

test("a marker prefix written without quotes is invalid YAML, and the message says how to write it", () => {
  const found = check(
    skill(`name: ${NAME}\ndescription: [HARNESS.md] A design\nmetadata:\n  type: harness-design\n`),
  );
  expectAt(found, [["SKILL.md", 3, "frontmatter-invalid"]]);
  assert.match(found[0]?.message ?? "", /quote the value or use a block scalar/);
  // Another YAML error does not get the hint.
  const other = check(skill("name: [unclosed\n"));
  assert.doesNotMatch(other[0]?.message ?? "", /block scalar/);
});

test("name or description absent, null, empty, or blank is key-missing", () => {
  const metadata = "metadata:\n  type: harness-design\n";
  const description = 'description: "[HARNESS.md] A demo design."\n';
  for (const value of [undefined, "", '""', '"   "', "~"]) {
    const line = value === undefined ? "" : `name: ${value}\n`;
    expectCodes(check(skill(`${line}${description}${metadata}`)), ["key-missing"]);
    const absent = value === undefined ? "" : `description: ${value}\n`;
    // No marker-prefix beside the key-missing of a description.
    expectCodes(check(skill(`name: ${NAME}\n${absent}${metadata}`)), ["key-missing"]);
  }
  const both = check(skill(metadata));
  expectCodes(both, ["key-missing", "key-missing"]);
  assert.match(both[0]?.message ?? "", /`name`/);
  assert.match(both[1]?.message ?? "", /`description`/);
});

test("a string key that holds a number, a list, or a mapping is key-type", () => {
  for (const value of ["3", "[a, b]", "{a: b}"]) {
    const name = check(
      skill(
        `name: ${value}\ndescription: "[HARNESS.md] A demo."\nmetadata:\n  type: harness-design\n`,
      ),
    );
    expectCodes(name, ["key-type"]);
    assert.match(name[0]?.message ?? "", /`name`/);
    const description = check(
      skill(`name: ${NAME}\ndescription: ${value}\nmetadata:\n  type: harness-design\n`),
    );
    // No marker-prefix for a description that is not a string.
    expectCodes(description, ["key-type"]);
    for (const key of ["license", "compatibility", "allowed-tools"]) {
      const found = check(skill(`${FRONT}${key}: ${value}\n`));
      expectAt(found, [["SKILL.md", 6, "key-type"]]);
      assert.match(found[0]?.message ?? "", new RegExp(`\`${key}\``));
    }
  }
});

test("a repeated top-level key is an error", () => {
  expectAt(check(skill(`${FRONT}name: ${NAME}\n`)), [["SKILL.md", 6, "key-duplicate"]]);
});

test("an unknown top-level key is a warning on its own line that points to metadata", () => {
  const found = check(
    skill(
      `name: ${NAME}\ndescription: "[HARNESS.md] A demo."\ntags: a, b\nmetadata:\n  type: harness-design\n`,
    ),
  );
  expectAt(found, [["SKILL.md", 4, "key-unknown"]]);
  assert.equal(found[0]?.severity, "warning");
  assert.match(found[0]?.message ?? "", /`tags`.*`metadata`/);
  expectCodes(check(skill(`${FRONT}status: draft\n`)), ["key-unknown"]);
});

test("a top-level version is a key-unknown warning that points to metadata.version", () => {
  const found = check(skill(`${FRONT}version: "1.0"\n`));
  expectCodes(found, ["key-unknown"]);
  assert.match(found[0]?.message ?? "", /`metadata\.version`/);
  // Its type is no longer checked.
  expectCodes(check(skill(`${FRONT}version: 1.0\n`)), ["key-unknown"]);
});

test("allowed-tools as a string is a warning of its own, not an unknown key", () => {
  for (const value of ["Read", "Read Grep", '""']) {
    const found = check(skill(`${FRONT}allowed-tools: ${value}\n`));
    expectAt(found, [["SKILL.md", 6, "key-allowed-tools"]]);
    assert.equal(found[0]?.severity, "warning");
    assert.match(found[0]?.message ?? "", /`allowed-tools`/);
  }
});

test("name outside the character rules is name-format", () => {
  for (const name of ["my_design", "My_Design", "my--design", "-design", "design-"]) {
    const found = lintDirectory(
      directory(
        {
          "SKILL.md": skill(
            `name: ${name}\ndescription: "[HARNESS.md] A demo."\nmetadata:\n  type: harness-design\n`,
          ),
        },
        name,
      ),
    );
    expectCodes(found, ["name-format"]);
    assert.equal(found[0]?.severity, "error");
  }
});

test("name over 64 characters is name-length", () => {
  const at = "a".repeat(64);
  const over = "a".repeat(65);
  const front = (name: string) =>
    `name: ${name}\ndescription: "[HARNESS.md] A demo."\nmetadata:\n  type: harness-design\n`;
  expectCodes(lintDirectory(directory({ "SKILL.md": skill(front(at)) }, at)), []);
  expectCodes(lintDirectory(directory({ "SKILL.md": skill(front(over)) }, over)), ["name-length"]);
});

test("name that differs from the directory is name-directory, naming both", () => {
  const found = lintDirectory(directory({ "SKILL.md": skill() }, "team-harness"));
  expectAt(found, [["SKILL.md", 2, "name-directory"]]);
  assert.match(found[0]?.message ?? "", /my-design/);
  assert.match(found[0]?.message ?? "", /team-harness/);
});

test("description length counts code points: 1024 passes, 1025 is an error", () => {
  const front = (description: string) =>
    `name: ${NAME}\ndescription: "${description}"\nmetadata:\n  type: harness-design\n`;
  const prefix = "[HARNESS.md] ";
  expectCodes(check(skill(front(prefix + "d".repeat(1024 - prefix.length)))), []);
  expectCodes(check(skill(front(prefix + "d".repeat(1025 - prefix.length)))), [
    "description-length",
  ]);
  // 600 Chinese characters take more than 1024 bytes.
  expectCodes(check(skill(front(prefix + "设".repeat(600)))), []);
});

test("compatibility over 500 characters or empty is compatibility-length", () => {
  expectCodes(check(skill(`${FRONT}compatibility: "${"c".repeat(500)}"\n`)), []);
  expectCodes(check(skill(`${FRONT}compatibility: "${"c".repeat(501)}"\n`)), [
    "compatibility-length",
  ]);
  expectAt(check(skill(`${FRONT}compatibility: ""\n`)), [["SKILL.md", 6, "compatibility-length"]]);
});

// ── Type marker and metadata ────────────────────────────────────────────────

test("a description without the prefix is marker-prefix, and only that", () => {
  for (const description of [
    "A harness design for small libraries.",
    "[harness.md] A design.",
    "A design, marked [HARNESS.md] later.",
  ]) {
    const found = check(
      skill(`name: ${NAME}\ndescription: "${description}"\nmetadata:\n  type: harness-design\n`),
    );
    expectAt(found, [["SKILL.md", 3, "marker-prefix"]]);
    assert.equal(found[0]?.severity, "error");
  }
});

test("metadata absent, without type, or with another type is marker-type, and only that", () => {
  const head = `name: ${NAME}\ndescription: "[HARNESS.md] A demo."\n`;
  expectAt(check(skill(head)), [["SKILL.md", 1, "marker-type"]]);
  expectAt(check(skill(`${head}metadata:\n  version: "1"\n`)), [["SKILL.md", 4, "marker-type"]]);
  expectAt(check(skill(`${head}metadata: {}\n`)), [["SKILL.md", 4, "marker-type"]]);
  for (const type of ["skill", "Harness-Design"]) {
    expectAt(check(skill(`${head}metadata:\n  type: ${type}\n`)), [["SKILL.md", 5, "marker-type"]]);
  }
});

test("an ordinary skill with neither half gets one error for each", () => {
  const found = check(skill(`name: ${NAME}\ndescription: Does things. Use when testing.\n`));
  expectCodes(found, ["marker-prefix", "marker-type"]);
});

test("a metadata value that is not a string is metadata-value for that key", () => {
  const front = `${FRONT}  tags: [a, b]\n  nested:\n    a: b\n  version: 1.0\n  flag: true\n  empty:\n`;
  const found = check(skill(front));
  expectAt(found, [
    ["SKILL.md", 6, "metadata-value"],
    ["SKILL.md", 7, "metadata-value"],
    ["SKILL.md", 9, "metadata-value"],
    ["SKILL.md", 10, "metadata-value"],
    ["SKILL.md", 11, "metadata-value"],
  ]);
  assert.deepEqual(
    found.map((f) => /`metadata\.([a-z]+)`/.exec(f.message)?.[1]),
    ["tags", "nested", "version", "flag", "empty"],
  );
  assert.equal(found[0]?.severity, "error");
});

test("a type that is not a string is both metadata-value and marker-type", () => {
  const head = `name: ${NAME}\ndescription: "[HARNESS.md] A demo."\n`;
  expectCodes(check(skill(`${head}metadata:\n  type: [harness-design]\n`)), [
    "metadata-value",
    "marker-type",
  ]);
});

test("a metadata that is not a mapping is metadata-value alone", () => {
  const head = `name: ${NAME}\ndescription: "[HARNESS.md] A demo."\n`;
  for (const value of ["harness-design", "[a, b]", "3", ""]) {
    const found = check(skill(`${head}metadata: ${value}\n`));
    expectAt(found, [["SKILL.md", 4, "metadata-value"]]);
    assert.match(found[0]?.message ?? "", /`metadata`/);
  }
});

test("string metadata is never judged: any key, a key written twice, any wording", () => {
  const front = `${FRONT}  version: alpha\n  tags: a, b\n  name: other\n  description: other\n  twice: one\n  twice: two\n  based-on: https://example.com/a\n`;
  expectCodes(check(skill(front)), []);
  for (const version of ["alpha", "2026-11", '"3"', "1.0.0"]) {
    expectCodes(check(skill(`${FRONT}  version: ${version}\n`)), []);
  }
});

// ── Title and sections, read from SKILL.md only ─────────────────────────────

test("a missing or repeated first-level heading is one warning", () => {
  expectCodes(check(skill(FRONT, "## Context\n\nText.\n")), ["title-missing"]);
  const three = check(skill(FRONT, `${BODY}\n# Second\n\n# Third\n`));
  expectCodes(three, ["title-multiple"]);
  assert.equal(three[0]?.severity, "warning");
  expectCodes(check(skill(FRONT, "Demo\n====\n\nText.\n")), ["title-missing"]);
  expectCodes(check(skill(FRONT, "#Demo\n\nText.\n")), ["title-missing"]);
  expectCodes(check(skill(FRONT, "```\n# In a fence\n```\n")), ["title-missing"]);
  expectCodes(check(skill(FRONT, "")), ["title-missing"]);
  expectCodes(check(skill(FRONT, "   # Demo #\n\nText.\n")), []);
});

test("the title is not compared with the name, and an introduction is not required", () => {
  expectCodes(check(skill(FRONT, "# Something else entirely\n\n## Context\n\nText.\n")), []);
});

test("no section is required, and headings outside the vocabulary are ordinary", () => {
  expectCodes(check(skill(FRONT, sections([]))), []);
  expectCodes(check(skill(FRONT, sections(["Context", "Authority"]))), []);
  expectCodes(check(skill(FRONT, sections(["How to use this file", "Context"]))), []);
  expectCodes(check(skill(FRONT, sections(["Overview", "Context", "Overview"]))), []);
  expectCodes(check(skill(FRONT, sections(["背景", "gates", "GATES", "Gate"]))), []);
  assert.equal((SECTIONS as readonly string[]).includes("Overview"), false);
  assert.equal(SECTIONS.length, 13);
  expectCodes(check(skill(FRONT, sections(SECTIONS))), []);
});

test("recommended sections out of order are a warning", () => {
  const found = check(skill(FRONT, sections(["Authority", "Environment"])));
  expectCodes(found, ["section-order"]);
  assert.equal(found[0]?.severity, "warning");
  expectCodes(check(skill(FRONT, sections(["Context", "Gates", "References", "Style"]))), [
    "section-order",
  ]);
});

test("a repeated section is reported once for each repeated name", () => {
  const three = check(skill(FRONT, sections(["Gates", "Gates", "Gates"])));
  expectCodes(three, ["section-duplicate"]);
  assert.equal(three[0]?.severity, "warning");
  assert.match(three[0]?.message ?? "", /Gates/);
  expectCodes(check(skill(FRONT, sections(["Context", "Gates", "Context", "Gates"]))), [
    "section-duplicate",
    "section-duplicate",
  ]);
});

test("closing hashes and indentation are accepted; other levels, fences, and Setext are not", () => {
  // Recognised as Context, so it is out of order after Environment.
  expectCodes(check(skill(FRONT, `${BODY}\n## Environment\n\n   ## Context ##\n`)), [
    "section-order",
  ]);
  const ordinary = [
    "## Gates",
    "",
    "```",
    "## Gates",
    "# Another title",
    "```",
    "",
    "~~~~",
    "## Gates",
    "~~~~",
    "",
    "### Gates",
    "",
    "# Gates",
    "",
    "Gates",
    "-----",
    "",
    "    ## Gates",
    "",
  ].join("\n");
  expectCodes(check(skill(FRONT, `## Context\n\n${ordinary}`)), []);
});

test("headings in a linked file take no part in the title and section checks", () => {
  const linked = "# One\n\n# Two\n\n## Gates\n\n## Authority\n\n## Environment\n\n## Gates\n";
  const body = `${BODY}\n## Gates\n\nSee [the gates](gates.md).\n`;
  expectCodes(check(skill(FRONT, body), { "gates.md": linked }), []);
  // A title in a linked file does not stand in for the one SKILL.md lacks.
  expectCodes(check(skill(FRONT, "See [the gates](gates.md).\n"), { "gates.md": linked }), [
    "title-missing",
  ]);
});

test("several problems in one file are all reported, ordered by line", () => {
  const front = `name: ${NAME}\nstatus: draft\nmetadata:\n  type: harness-design\n`;
  const found = check(skill(front, sections(["Gates", "Gates"])));
  expectAt(found, [
    ["SKILL.md", 1, "key-missing"],
    ["SKILL.md", 3, "key-unknown"],
    ["SKILL.md", 16, "section-duplicate"],
  ]);
});

// ── Links and reachability ──────────────────────────────────────────────────

test("a file reached through another file is reached", () => {
  const found = check(skill(FRONT, `${BODY}\n[Gates](references/gates.md)\n`), {
    "references/gates.md": "Run [the check](../scripts/check.py).\n",
    "scripts/check.py": "print('ok')\n",
  });
  expectCodes(found, []);
});

test("a file linked only from an unreached file is unreachable, as is that file", () => {
  const found = check(skill(), {
    "notes.md": "[draft](draft.md) and [gone](gone.md)\n",
    "draft.md": "Draft.\n",
  });
  expectAt(found, [
    ["draft.md", 1, "file-unreachable"],
    ["notes.md", 1, "file-unreachable"],
  ]);
  assert.equal(found[0]?.severity, "warning");
});

test("a link in an indented code block, an HTML comment, or an HTML tag is not a link", () => {
  const body = `${BODY}\nText.\n\n    [a](missing.md)\n\n<!--\n[b](gone.md)\n-->\n\n<a href="absent.md">x</a>\n`;
  expectCodes(check(skill(FRONT, body)), []);
  // In a list item an indented line continues the item: it is text.
  expectCodes(check(skill(FRONT, `${BODY}\n- item\n\n    [a](missing.md)\n`)), ["link-missing"]);
});

test("a file ending in .markdown is a Markdown file whose links are read", () => {
  const found = check(skill(FRONT, `${BODY}\n[a](a.markdown)\n`), {
    "a.markdown": "[b](b.md)\n",
    "b.md": "x\n",
  });
  expectCodes(found, []);
});

test("allowed-tools that is not a string is key-type alone", () => {
  expectCodes(check(skill(`${FRONT}allowed-tools: [Read]\n`)), ["key-type"]);
});

test("a link in a fenced block or a code span is not a link", () => {
  const body = `${BODY}\n\`\`\`markdown\n[x](missing.md)\n\`\`\`\n\n~~~\n![y](missing.png)\n~~~\n\nWrite \`[z](missing-too.md)\` to link.\n`;
  expectCodes(check(skill(FRONT, body)), []);
});

test("a link that leaves the directory is not checked, whether or not its target exists", () => {
  const body = `${BODY}\n[a](../other/README.md) [b](/etc/hosts) [c](https://example.com/a.md)\n[d](mailto:someone@example.com) [e](../gone/README.md) [f](../../x.md) <https://example.com>\n`;
  const dir = directory({ "SKILL.md": skill(FRONT, body) });
  mkdirSync(join(dir, "..", "other"));
  writeFileSync(join(dir, "..", "other", "README.md"), "# Other\n");
  const result = readDirectory(dir);
  expectCodes(result.findings, []);
  assert.deepEqual(
    result.links.map((link) => link.kind),
    ["outside", "absolute", "scheme", "scheme", "outside", "outside", "scheme"],
  );
});

test("a fragment is ignored: the file counts as reached, and no heading is looked up", () => {
  const body = `${BODY}\n[Gates](references/gates.md#no-such-heading) and [above](#demo).\n`;
  expectCodes(check(skill(FRONT, body), { "references/gates.md": "# Gates\n" }), []);
  expectAt(check(skill(FRONT, `${BODY}\n[Gates](gone.md#heading)\n`)), [
    ["SKILL.md", 12, "link-missing"],
  ]);
});

test("a reference-style link counts through its definition, on the definition's line", () => {
  const body = `${BODY}\nSee [the gates][g] and [the rest][r].\n\n[g]: references/gates.md\n[r]: references/rest.md\n`;
  const found = check(skill(FRONT, body), { "references/gates.md": "# Gates\n" });
  expectAt(found, [["SKILL.md", 15, "link-missing"]]);
});

test("a link to a directory resolves and reaches no file", () => {
  const body = `${BODY}\nThe scripts are in [scripts/](scripts/).\n`;
  const found = check(skill(FRONT, body), {
    "scripts/check.py": "print('ok')\n",
    "scripts/lib/util.py": "pass\n",
  });
  expectAt(found, [
    ["scripts/check.py", 1, "file-unreachable"],
    ["scripts/lib/util.py", 1, "file-unreachable"],
  ]);
});

test("files and directories whose name starts with a dot are not checked", () => {
  const found = check(skill(), {
    ".gitkeep": "",
    ".cache/data.json": "{}\n",
    ".notes/todo.md": "[x](missing.md)\n",
  });
  expectCodes(found, []);
});

test("a link that does not resolve is link-missing on the line of the link", () => {
  const found = check(skill(FRONT, `${BODY}\nSee [the gates](references/gates.md).\n`));
  expectAt(found, [["SKILL.md", 12, "link-missing"]]);
  assert.equal(found[0]?.severity, "warning");
  assert.match(found[0]?.message ?? "", /references\/gates\.md/);
});

test("a file no link reaches is file-unreachable", () => {
  expectAt(check(skill(), { "scripts/check.py": "print('ok')\n" }), [
    ["scripts/check.py", 1, "file-unreachable"],
  ]);
});

test("images count as links, and links between files may form a cycle", () => {
  const body = `${BODY}\n![Diagram](assets/flow.png) ![Gone](assets/gone.png) [a](a.md) [spaced](<my file.md>) [encoded](my%20other.md)\n`;
  const found = check(skill(FRONT, body), {
    "assets/flow.png": new Uint8Array([0x89, 0x50, 0x4e, 0x47]),
    "a.md": "[b](b.md) [main](SKILL.md)\n",
    "b.md": "[a](a.md)\n",
    "my file.md": "x\n",
    "my other.md": "x\n",
  });
  expectAt(found, [["SKILL.md", 12, "link-missing"]]);
});

test("a link in a reached file resolves against that file's directory", () => {
  const gates = `${"\n".repeat(6)}See [the rest](missing.md).\n`;
  const body = `${BODY}\n[Gates](references/gates.md)\n`;
  // missing.md sits beside SKILL.md, not in references/.
  const found = check(skill(FRONT, body), { "references/gates.md": gates, "missing.md": "x\n" });
  expectAt(found, [
    ["missing.md", 1, "file-unreachable"],
    ["references/gates.md", 7, "link-missing"],
  ]);
});

test("findings are ordered SKILL.md first, then the other files by path, each by line", () => {
  const body = `# Demo\n\n[z](z.md) [a](a/a.md) [gone](gone.md)\n\n# Again\n`;
  const dir = directory({
    "SKILL.md": skill(`${FRONT}tags: a\n`, body),
    "z.md": "[x](x.md)\n\n[y](y.md)\n",
    "a/a.md": "\n[x](x.md)\n",
    "b.txt": "x\n",
  });
  const found = lintDirectory(dir);
  expectAt(found, [
    ["SKILL.md", 6, "key-unknown"],
    ["SKILL.md", 11, "link-missing"],
    ["SKILL.md", 13, "title-multiple"],
    ["a/a.md", 2, "link-missing"],
    ["b.txt", 1, "file-unreachable"],
    ["z.md", 1, "link-missing"],
    ["z.md", 3, "link-missing"],
  ]);
  const lines = formatDirectory(dir, found);
  assert.equal(lines[0]?.startsWith(`${dir}/SKILL.md:6: warning[key-unknown]: `), true);
  assert.equal(lines[3]?.startsWith(`${dir}/a/a.md:2: warning[link-missing]: `), true);
});

// ── The exported API ────────────────────────────────────────────────────────

test("readDirectory returns the parsed main file, the links read, and the checked files", () => {
  const body = `${BODY}\n[Gates](references/gates.md#run) [site](https://example.com)\n`;
  const dir = directory({
    "SKILL.md": skill(`${FRONT}license: MIT\n`, body),
    "references/gates.md": "[up](../SKILL.md)\n",
    ".hidden": "x\n",
  });
  const result = readDirectory(dir);
  assert.deepEqual(result.findings, []);
  assert.equal(result.main?.frontmatter?.strings.license, "MIT");
  assert.deepEqual(result.main?.frontmatter?.data.metadata, { type: "harness-design" });
  assert.deepEqual(result.files, ["SKILL.md", "references/gates.md"]);
  assert.deepEqual(result.links, [
    {
      file: "SKILL.md",
      line: 13,
      url: "references/gates.md#run",
      kind: "inside",
      target: "references/gates.md",
    },
    { file: "SKILL.md", line: 13, url: "https://example.com", kind: "scheme" },
    {
      file: "references/gates.md",
      line: 1,
      url: "../SKILL.md",
      kind: "inside",
      target: "SKILL.md",
    },
  ]);
});

test("the text-level functions report what needs only the text of SKILL.md", () => {
  assert.deepEqual(lint(skill()), []);
  // No directory is known, so name-directory, links, and reachability are not reported.
  assert.deepEqual(lint(skill(FRONT, `${BODY}\n[x](missing.md)\n`)), []);
  const parsed = parse(skill(`${FRONT}license: MIT\n`, sections(["Context", "Gates"])));
  assert.deepEqual(parsed.frontmatter?.keys, ["name", "description", "metadata", "license"]);
  assert.deepEqual(parsed.frontmatter?.strings, {
    name: NAME,
    description: "[HARNESS.md] A demo design.",
    license: "MIT",
  });
  assert.deepEqual(parsed.frontmatter?.lines, {
    name: 2,
    description: 3,
    metadata: 4,
    license: 6,
  });
  assert.deepEqual(parsed.titles, [9]);
  assert.deepEqual(
    parsed.sections.map((s) => s.name),
    ["Context", "Gates"],
  );
  assert.equal(parsed.bodyStart, 7);
  assert.equal(parsed.hasBody, true);
  expectCodes(lintBytes(LATIN1), ["encoding-invalid"]);
  assert.equal(parseBytes(LATIN1).frontmatter, undefined);
  assert.deepEqual(lintBytes(new TextEncoder().encode(`﻿${skill()}`)), []);
});

test("format prints path:line: severity[code]: message", () => {
  const lines = format("my-design/SKILL.md", lint("no frontmatter\n"));
  assert.match(lines[0] ?? "", /^my-design\/SKILL\.md:1: error\[frontmatter-missing\]: /);
});

// ── Coverage of the finding codes ───────────────────────────────────────────

test("the validator defines exactly the codes of cli/lint, with their severities", () => {
  const expected: Record<string, string> = {};
  for (const code of ERRORS) expected[code] = "error";
  for (const code of WARNINGS) expected[code] = "warning";
  assert.deepEqual({ ...CODES }, expected);
});

// Keep this test last: it reads what the cases above recorded.
test("every finding code of cli/lint has a case in this file", () => {
  const missing = [...ERRORS, ...WARNINGS].filter((code) => !covered.has(code));
  assert.deepEqual(missing, [], `finding codes without a test case: ${missing.join(", ")}`);
});
