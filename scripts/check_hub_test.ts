import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";
import { checkEntry, checkHub, items } from "./check_hub.ts";
import type { FileSpec } from "./lib/testing.ts";
import { makeTree } from "./lib/testing.ts";

const body = (sections: readonly string[]) =>
  `# Demo\n\nAn introduction.\n\n${sections.map((name) => `## ${name}\n\nText.\n\n`).join("")}`;
const BODY = body(["Context", "Authority"]);

const METADATA =
  "  type: harness-design\n" +
  '  version: "1.0.0"\n' +
  "  tags: demo, small-team\n" +
  "  based-on: https://example.com/design\n";
const HEAD =
  "name: demo\ndescription: >-\n  [HARNESS.md] A demo.\nlicense: Apache-2.0\nmetadata:\n";
const GOOD = HEAD + METADATA;

/** GOOD with one line of `metadata` replaced (or removed, with an empty line). */
function withMetadata(key: string, line: string): string {
  const pattern = new RegExp(`^  ${key}:.*\\n`, "m");
  assert.match(METADATA, pattern);
  return HEAD + METADATA.replace(pattern, line);
}

/** A hub holding one entry: its SKILL.md and any other files, keyed by path inside the entry. */
function hubWith(
  entry: string,
  frontmatter: string,
  text: string = BODY,
  others: Record<string, FileSpec> = {},
): string {
  const files: Record<string, FileSpec> = {
    [`${entry}/SKILL.md`]: `---\n${frontmatter}---\n\n${text}`,
  };
  for (const [path, spec] of Object.entries(others)) files[`${entry}/${path}`] = spec;
  return makeTree(files);
}

test("a conforming entry is clean", () => {
  assert.deepEqual(checkHub(hubWith("demo", GOOD)), []);
});

test("an entry whose other files are all reached by links is clean", () => {
  const hub = hubWith(
    "demo",
    GOOD,
    `${BODY}See [the gates](references/gates.md) and <https://example.com/guide>.\n`,
    {
      "references/gates.md": "# Gates\n\nRun [the check](../scripts/check.sh).\n",
      "scripts/check.sh": "#!/bin/sh\nexit 0\n",
    },
  );
  assert.deepEqual(checkHub(hub), []);
});

test("a name that differs from the directory is the format validator's finding, once", () => {
  const problems = checkEntry(hubWith("other", GOOD), "other");
  assert.equal(problems.length, 1, problems.join("\n"));
  const problem = problems[0] ?? "";
  assert.match(problem, /error\[name-directory\]/);
  assert.match(problem, /other[/\\]SKILL\.md:\d+:/);
  assert.match(problem, /demo/);
  assert.match(problem, /other/);
});

test("licence and tags are required of an entry; version and based-on are not", () => {
  const frontmatter =
    "name: demo\ndescription: >-\n  [HARNESS.md] A demo.\nmetadata:\n  type: harness-design\n";
  const problems = checkEntry(hubWith("demo", frontmatter), "demo");
  assert.equal(problems.length, 2, problems.join("\n"));
  assert.match(problems.join("\n"), /states its licence/);
  assert.match(problems.join("\n"), /`metadata\.tags` is missing; the hub's search and filters/);
});

test("items are split at commas and trimmed", () => {
  assert.deepEqual(items("open-source, library ,solo"), ["open-source", "library", "solo"]);
  const hub = hubWith("demo", withMetadata("tags", "  tags: open-source, library ,solo\n"));
  assert.deepEqual(checkHub(hub), []);
});

test("several URLs in based-on are accepted", () => {
  const hub = hubWith(
    "demo",
    withMetadata("based-on", "  based-on: https://example.com/a, http://example.org/b\n"),
  );
  assert.deepEqual(checkHub(hub), []);
});

test("an empty item is an error that names the key", () => {
  for (const value of ["open-source,,library", "open-source, library,", ",library"]) {
    const problems = checkEntry(
      hubWith("demo", withMetadata("tags", `  tags: "${value}"\n`)),
      "demo",
    );
    assert.equal(problems.length, 1, `${value}: ${problems.join("\n")}`);
    assert.match(problems[0] ?? "", /`metadata\.tags` has an empty item/);
  }
  const problems = checkEntry(
    hubWith("demo", withMetadata("based-on", "  based-on: https://example.com/a,\n")),
    "demo",
  );
  assert.equal(problems.length, 1, problems.join("\n"));
  assert.match(problems[0] ?? "", /`metadata\.based-on` has an empty item/);
});

test("a tag outside the format and a tag repeated after trimming are named", () => {
  const problems = checkEntry(
    hubWith("demo", withMetadata("tags", "  tags: Bad Tag, ok , ok, ok\n")),
    "demo",
  );
  assert.equal(problems.length, 2, problems.join("\n"));
  assert.match(problems[0] ?? "", /the tag `Bad Tag` must be lowercase/);
  assert.match(problems[1] ?? "", /lists the tag `ok` more than once/);
});

test("a based-on item that is not an http(s) URL is named", () => {
  for (const value of ["my earlier project", "ftp://example.com/design", "example.com/design"]) {
    const problems = checkEntry(
      hubWith("demo", withMetadata("based-on", `  based-on: ${value}\n`)),
      "demo",
    );
    assert.equal(problems.length, 1, `${value}: ${problems.join("\n")}`);
    const problem = problems[0] ?? "";
    assert.ok(problem.includes(`\`${value}\` is not an http(s) URL`), problem);
  }
});

test("a URL that contains a comma is split at it, and the item that is no URL is named", () => {
  const problems = checkEntry(
    hubWith("demo", withMetadata("based-on", "  based-on: https://example.com/a,b\n")),
    "demo",
  );
  assert.equal(problems.length, 1, problems.join("\n"));
  assert.match(problems[0] ?? "", /item `b` is not an http\(s\) URL/);
});

test("tags written as a list are the format validator's finding alone", () => {
  const problems = checkEntry(
    hubWith("demo", withMetadata("tags", "  tags: [demo, small-team]\n")),
    "demo",
  );
  assert.equal(problems.length, 1, problems.join("\n"));
  assert.match(problems[0] ?? "", /error\[metadata-value\]/);
});

test("a metadata that is not a mapping is the format validator's finding alone", () => {
  const frontmatter =
    "name: demo\ndescription: >-\n  [HARNESS.md] A demo.\nlicense: MIT\nmetadata: harness-design\n";
  const problems = checkEntry(hubWith("demo", frontmatter), "demo");
  assert.equal(problems.length, 1, problems.join("\n"));
  assert.match(problems[0] ?? "", /error\[metadata-value\]/);
});

test("a metadata key neither the format nor the hub defines is reported", () => {
  const problems = checkEntry(hubWith("demo", `${GOOD}  author: someone\n`), "demo");
  assert.equal(problems.length, 1, problems.join("\n"));
  assert.match(problems[0] ?? "", /`metadata\.author` is not a key the format or the hub defines/);
});

test("format errors and warnings fail an entry, and stray files are reported", () => {
  const hub = hubWith("Bad_Name", GOOD.replace("name: demo", "name: Bad_Name"));
  const extra = makeTree({ "notes.md": "x" });
  assert.match(checkHub(extra).join("\n"), /notes\.md: only README\.md, README\.zh\.md/);
  assert.match(checkHub(hub).join("\n"), /error\[name-format\]/);
  const unknown = checkEntry(hubWith("demo", `${GOOD}tags: a, b\n`), "demo");
  assert.equal(unknown.length, 1, unknown.join("\n"));
  assert.match(unknown[0] ?? "", /warning\[key-unknown\]/);
});

test("an entry needs no particular section, but a missing title or a wrong order fails it", () => {
  const untitled = checkEntry(
    hubWith("demo", GOOD, body(["Gates"]).replace("# Demo\n\n", "")),
    "demo",
  );
  assert.equal(untitled.length, 1, untitled.join("\n"));
  assert.match(untitled[0] ?? "", /warning\[title-missing\]/);
  const unordered = checkEntry(hubWith("demo", GOOD, body(["Authority", "Context"])), "demo");
  assert.equal(unordered.length, 1, unordered.join("\n"));
  assert.match(unordered[0] ?? "", /warning\[section-order\]/);
});

test("a directory without SKILL.md gets the format validator's finding", () => {
  const hub = makeTree({ "empty/HARNESS.md": "# Old shape\n" });
  const problems = checkHub(hub);
  assert.equal(problems.length, 1, problems.join("\n"));
  assert.match(problems[0] ?? "", /error\[main-file-missing\]/);
});

test("a file no link reaches and a link to a missing file fail an entry", () => {
  const unreached = checkEntry(
    hubWith("demo", GOOD, BODY, { "scripts/check.sh": "#!/bin/sh\n" }),
    "demo",
  );
  assert.equal(unreached.length, 1, unreached.join("\n"));
  assert.match(unreached[0] ?? "", /scripts[/\\]check\.sh:1: warning\[file-unreachable\]/);
  const missing = checkEntry(
    hubWith("demo", GOOD, `${BODY}See [the gates](references/gates.md).\n`),
    "demo",
  );
  assert.equal(missing.length, 1, missing.join("\n"));
  assert.match(missing[0] ?? "", /warning\[link-missing\]/);
});

test("a relative link out of the entry is reported with file, line, and target", () => {
  const text = `${BODY}Read [the specification](../../spec/spec.md).\n`;
  const line = `---\n${GOOD}---\n\n${text}`.split("\n").findIndex((l) => l.includes("../../")) + 1;
  const hub = hubWith("demo", GOOD, text);
  const problems = checkEntry(hub, "demo");
  assert.equal(problems.length, 1, problems.join("\n"));
  const problem = problems[0] ?? "";
  assert.ok(problem.startsWith(`${join(hub, "demo", "SKILL.md")}:${line}: `), problem);
  assert.match(problem, /`\.\.\/\.\.\/spec\/spec\.md` leaves the entry directory/);
});

test("a link to another entry from a reached file names the file that holds it", () => {
  const hub = hubWith("demo", GOOD, `${BODY}See [the gates](references/gates.md).\n`, {
    "references/gates.md":
      "# Gates\n\nText.\n\nCompare [another entry](../../production-engineering/SKILL.md).\n",
  });
  const problems = checkEntry(hub, "demo");
  assert.equal(problems.length, 1, problems.join("\n"));
  const problem = problems[0] ?? "";
  assert.ok(problem.startsWith(`${join(hub, "demo", "references", "gates.md")}:5: `), problem);
  assert.match(problem, /production-engineering\/SKILL\.md` leaves the entry directory/);
});

test("links with a scheme and links written in code are not reported", () => {
  const hub = hubWith(
    "demo",
    GOOD,
    `${BODY}See [a guide](https://example.com/guide) and [mail](mailto:a@example.com).\n\n` +
      "Write `[x](../outside.md)` to link.\n\n```md\n[y](../outside.md)\n```\n",
  );
  assert.deepEqual(checkHub(hub), []);
});
