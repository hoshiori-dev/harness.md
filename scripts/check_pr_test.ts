import assert from "node:assert/strict";
import { test } from "node:test";
import { makeTree, runScript } from "./lib/testing.ts";

const TEMPLATE =
  "## Summary\n\n## Related work\n\n## Verification\n\n## Checklist\n\n- [ ] No secrets, tokens, or private data are in this change.\n";
const goodBody =
  "## Summary\n\nx\n\n## Related work\n\nCloses #1\n\n## Verification\n\njust check\n\n## Checklist\n\n- [x] just check passes locally.\n- [x] No secrets, tokens, or private data are in this change.\n";

function tree(body: string): string {
  return makeTree({ ".github/pull_request_template.md": TEMPLATE, "body.md": body });
}

test("check_pr accepts a conventional title and a complete body", () => {
  const root = tree(goodBody);
  const result = runScript(
    "check_pr.ts",
    ["--title", "feat(plugin): add example skill", "--body-file", "body.md"],
    root,
  );
  assert.equal(result.code, 0, result.output);
  const fromEnv = runScript("check_pr.ts", [], root, {
    PR_TITLE: "fix: correct a rule",
    PR_BODY: goodBody,
  });
  assert.equal(fromEnv.code, 0, fromEnv.output);
});

test("check_pr rejects a bad title, a missing section, and an unticked security item", () => {
  const root = tree(
    goodBody
      .replace("## Verification\n\njust check\n\n", "")
      .replace("- [x] No secrets", "- [ ] No secrets"),
  );
  const result = runScript(
    "check_pr.ts",
    ["--title", "Add Example Skill", "--body-file", "body.md"],
    root,
  );
  assert.equal(result.code, 1);
  assert.match(result.output, /pr-title/);
  assert.match(result.output, /section "## Verification" is missing/);
  assert.match(result.output, /pr-security-item/);
});
