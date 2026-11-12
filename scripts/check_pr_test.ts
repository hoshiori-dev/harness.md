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

test("check_pr checks only the title of a pull request Dependabot opened", () => {
  const botBody = "Bumps typescript from 6.0.3 to 7.0.2.\n";
  const root = tree(botBody);
  const bot = runScript("check_pr.ts", [], root, {
    PR_TITLE: "chore: bump typescript from 6.0.3 to 7.0.2 in /site",
    PR_BODY: botBody,
    PR_AUTHOR: "dependabot[bot]",
  });
  assert.equal(bot.code, 0, bot.output);
  const badTitle = runScript(
    "check_pr.ts",
    ["--title", "Bump typescript", "--body-file", "body.md", "--author", "dependabot[bot]"],
    root,
  );
  assert.equal(badTitle.code, 1);
  assert.match(badTitle.output, /pr-title/);
  const person = runScript("check_pr.ts", [], root, {
    PR_TITLE: "chore: bump typescript from 6.0.3 to 7.0.2 in /site",
    PR_BODY: botBody,
    PR_AUTHOR: "someone",
  });
  assert.equal(person.code, 1);
  assert.match(person.output, /pr-template/);
});

test("check_pr rejects a bad title and a missing section and ignores checklist ticks", () => {
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
  assert.match(result.output, /check_pr: 2 finding/);
});
