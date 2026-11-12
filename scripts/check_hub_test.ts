import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { checkEntry, checkHub } from "./check_hub.ts";

const body = (sections: readonly string[]) =>
  `# Demo\n\nAn introduction.\n\n${sections.map((name) => `## ${name}\n\nText.\n\n`).join("")}`;
const BODY = body(["Context", "Authority"]);

function hubWith(entry: string, frontmatter: string): string {
  const hub = mkdtempSync(join(tmpdir(), "hub-"));
  mkdirSync(join(hub, entry));
  writeFileSync(join(hub, entry, "HARNESS.md"), `---\n${frontmatter}---\n\n${BODY}`);
  return hub;
}

const GOOD =
  "name: demo\ndescription: A demo.\nversion: alpha\nlicense: Apache-2.0\nmetadata:\n  tags: [demo, small-team]\n  based-on:\n    - https://example.com/design\n";

test("a conforming entry is clean", () => {
  assert.deepEqual(checkHub(hubWith("demo", GOOD)), []);
});

test("the directory name must equal name", () => {
  const problems = checkEntry(hubWith("other", GOOD), "other");
  assert.equal(problems.length, 1);
  assert.match(problems[0] ?? "", /must equal the directory name/);
});

test("version, licence, and tags are required of an entry", () => {
  const problems = checkEntry(hubWith("demo", "name: demo\ndescription: A demo.\n"), "demo");
  assert.equal(problems.length, 3);
});

test("tags and based-on are checked for shape", () => {
  const frontmatter =
    "name: demo\ndescription: A demo.\nversion: alpha\nlicense: MIT\nmetadata:\n  tags: [Bad Tag, ok, ok]\n  based-on: [not-a-url]\n";
  const problems = checkEntry(hubWith("demo", frontmatter), "demo").join("\n");
  assert.match(problems, /Bad Tag/);
  assert.match(problems, /lists a tag twice/);
  assert.match(problems, /not an http\(s\) URL/);
});

test("format warnings fail an entry, and stray files are reported", () => {
  const hub = hubWith("Bad_Name", GOOD.replace("name: demo", "name: Bad_Name"));
  writeFileSync(join(hub, "notes.txt"), "x");
  const problems = checkHub(hub).join("\n");
  assert.match(problems, /warning\[name-format\]/);
  assert.match(problems, /notes\.txt/);
});

test("an entry needs no particular section, but a missing title fails it", () => {
  const hub = mkdtempSync(join(tmpdir(), "hub-"));
  mkdirSync(join(hub, "demo"));
  const text = `---\n${GOOD}---\n\n${body(["Gates"]).replace("# Demo\n\n", "")}`;
  writeFileSync(join(hub, "demo", "HARNESS.md"), text);
  const problems = checkEntry(hub, "demo");
  assert.equal(problems.length, 1);
  assert.match(problems[0] ?? "", /warning\[title-missing\]/);
});

test("a directory without HARNESS.md is reported", () => {
  const hub = mkdtempSync(join(tmpdir(), "hub-"));
  mkdirSync(join(hub, "empty"));
  assert.match(checkHub(hub)[0] ?? "", /must contain HARNESS\.md/);
});
