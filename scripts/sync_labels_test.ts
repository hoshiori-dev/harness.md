import assert from "node:assert/strict";
import { test } from "node:test";
import { makeTree, runScript } from "./lib/testing.ts";

test("sync_labels rejects a description over GitHub's 100-character limit before any gh call", () => {
  const root = makeTree({
    ".github/labels.json": JSON.stringify([
      { name: "ok", color: "0e8a16", description: "x".repeat(100) },
      { name: "long", color: "0e8a16", description: "y".repeat(101) },
    ]),
  });
  const result = runScript("sync_labels.ts", [], root);
  assert.equal(result.code, 2);
  assert.match(result.output, /label "long" description is 101 characters/);
});

test("sync_labels rejects a malformed declaration and unknown arguments", () => {
  const root = makeTree({
    ".github/labels.json": JSON.stringify([{ name: "bad", color: "#0e8a16", description: "x" }]),
  });
  const colour = runScript("sync_labels.ts", [], root);
  assert.equal(colour.code, 2);
  assert.match(colour.output, /color must be 6 hex digits/);
  assert.equal(runScript("sync_labels.ts", ["--force"], root).code, 2);
});
