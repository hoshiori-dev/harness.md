import assert from "node:assert/strict";
import { test } from "node:test";
import { format, lint, parse, REQUIRED_SECTIONS } from "./harness_md.ts";

function document(
  frontmatter = "name: demo\ndescription: A demo.\n",
  sections: readonly string[] = REQUIRED_SECTIONS,
): string {
  const body = sections.map((name) => `## ${name}\n\nText.\n\n`).join("");
  return `---\n${frontmatter}---\n\n# Demo\n\n${body}`;
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

test("a missing required section is an error; an absent optional one is nothing", () => {
  const withoutGates = REQUIRED_SECTIONS.filter((name) => name !== "Gates");
  assert.deepEqual(codes(document(undefined, withoutGates)), ["section-missing"]);
});

test("order is a warning and a duplicate is an error", () => {
  const swapped = ["Context", "Overview", ...REQUIRED_SECTIONS.slice(2)];
  assert.deepEqual(codes(document(undefined, swapped)), ["section-order"]);
  assert.deepEqual(codes(document(undefined, [...REQUIRED_SECTIONS, "Gates"])), [
    "section-duplicate",
  ]);
});

test("headings inside fences and at other levels do not count", () => {
  const withoutAuthority = REQUIRED_SECTIONS.filter((name) => name !== "Authority");
  const fenced = ["```", "## Authority", "```", "", "### Authority", ""].join("\n");
  assert.deepEqual(codes(document(undefined, withoutAuthority) + fenced), ["section-missing"]);
});

test("name and description limits are warnings", () => {
  const found = lint(document(`name: Bad_Name\ndescription: ${"d".repeat(1025)}\n`));
  assert.deepEqual(found.map((f) => `${f.severity}:${f.code}`).sort(), [
    "warning:description-length",
    "warning:name-format",
  ]);
});

test("version: known, unknown, and not a string", () => {
  assert.deepEqual(codes(document("name: demo\ndescription: A demo.\nversion: alpha\n")), []);
  assert.deepEqual(codes(document("name: demo\ndescription: A demo.\nversion: beta\n")), [
    "version-unknown",
  ]);
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
