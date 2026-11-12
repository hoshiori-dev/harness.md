import assert from "node:assert/strict";
import { test } from "node:test";
import { format, lint, lintBytes, parse, SECTIONS } from "./harness_md.ts";

const CORE = ["Context", "Environment", "Knowledge", "Feedback", "Gates", "Authority"] as const;

function document(
  frontmatter = "name: demo\ndescription: A demo.\n",
  sections: readonly string[] = CORE,
  title = "# Demo\n\nAn introduction.\n\n",
): string {
  const body = sections.map((name) => `## ${name}\n\nText.\n\n`).join("");
  return `---\n${frontmatter}---\n\n${title}${body}`;
}

const codes = (text: string) =>
  lint(text)
    .map((f) => f.code)
    .sort();

test("a minimal file has no findings", () => {
  assert.deepEqual(lint(document()), []);
});

test("an unknown top-level key is an error on its own line", () => {
  const found = lint(document("name: demo\ndescription: A demo.\ntags: [a]\n"));
  assert.deepEqual(
    found.map((f) => [f.severity, f.code, f.line]),
    [["error", "key-unknown", 4]],
  );
});

test("metadata is never inspected, duplicates inside it included", () => {
  const frontmatter =
    "name: demo\ndescription: A demo.\nmetadata:\n  name: 1\n  name: 2\n  x: [1, {y: z}]\n";
  assert.deepEqual(codes(document(frontmatter)), []);
  assert.deepEqual(parse(document(frontmatter)).frontmatter?.keys, [
    "name",
    "description",
    "metadata",
  ]);
});

test("no section is required, and Overview is an ordinary heading", () => {
  assert.deepEqual(lint(document(undefined, [])), []);
  assert.deepEqual(lint(document(undefined, ["Gates"])), []);
  assert.deepEqual(lint(document(undefined, ["Overview", "Context", "Overview"])), []);
  assert.equal((SECTIONS as readonly string[]).includes("Overview"), false);
  assert.equal(SECTIONS.length, 13);
});

test("order and repetition are warnings; a repeated name is reported once", () => {
  const swapped = ["Environment", "Context", ...CORE.slice(2)];
  assert.deepEqual(
    lint(document(undefined, swapped)).map((f) => `${f.severity}:${f.code}`),
    ["warning:section-order"],
  );
  assert.deepEqual(
    lint(document(undefined, [...CORE, "Gates", "Gates"])).map((f) => `${f.severity}:${f.code}`),
    ["warning:section-duplicate"],
  );
});

test("headings inside fences and at other levels do not count", () => {
  const fenced = ["```", "## Gates", "# Another title", "```", "", "### Gates", ""].join("\n");
  assert.deepEqual(codes(document() + fenced), []);
});

test("a missing or repeated first-level heading is a warning", () => {
  assert.deepEqual(
    lint(document(undefined, CORE, "")).map((f) => `${f.severity}:${f.code}`),
    ["warning:title-missing"],
  );
  const three = `${document()}# Second\n\n# Third\n`;
  assert.deepEqual(
    lint(three).map((f) => `${f.severity}:${f.code}`),
    ["warning:title-multiple"],
  );
  assert.deepEqual(codes(document(undefined, CORE, "Demo\n====\n\n")), ["title-missing"]);
  assert.deepEqual(codes(document(undefined, CORE, "   # Demo #\n\n")), []);
  assert.deepEqual(parse(document()).titles, [6]);
});

test("a file that is not UTF-8 gets one error and nothing else", () => {
  const bytes = new Uint8Array([0x2d, 0x2d, 0x2d, 0x0a, 0xff, 0x0a]);
  assert.deepEqual(
    lintBytes(bytes).map((f) => `${f.severity}:${f.code}`),
    ["error:encoding-invalid"],
  );
  assert.deepEqual(lintBytes(new TextEncoder().encode(`\uFEFF${document()}`)), []);
});

test("an unclosed frontmatter is the only finding for that file", () => {
  assert.deepEqual(codes("---\nname: demo\ndescription: A demo.\n\n# Demo\n"), [
    "frontmatter-invalid",
  ]);
});

test("name and description limits are warnings", () => {
  const found = lint(document(`name: Bad_Name\ndescription: ${"d".repeat(1025)}\n`));
  assert.deepEqual(found.map((f) => `${f.severity}:${f.code}`).sort(), [
    "warning:description-length",
    "warning:name-format",
  ]);
});

test("version is any string; only its type is checked", () => {
  for (const value of ["1.0.0", "alpha", "2026-11", '"3"']) {
    assert.deepEqual(codes(document(`name: demo\ndescription: A demo.\nversion: ${value}\n`)), []);
  }
  assert.deepEqual(codes(document("name: demo\ndescription: A demo.\nversion: 1.0\n")), [
    "key-type",
  ]);
});

test("format prints path:line: severity[code]: message", () => {
  const lines = format("HARNESS.md", lint("no frontmatter\n"));
  assert.match(lines[0] ?? "", /^HARNESS\.md:1: error\[frontmatter-missing\]: /);
});

test("a byte order mark and CRLF line endings change nothing", () => {
  assert.deepEqual(lint(`\uFEFF${document().replaceAll("\n", "\r\n")}`), []);
});
