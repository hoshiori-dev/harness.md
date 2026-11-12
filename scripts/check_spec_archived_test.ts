import assert from "node:assert/strict";
import { test } from "node:test";
import { makeTree, runScript } from "./lib/testing.ts";

test("check_spec_archived passes without openspec/changes and with archived changes only", () => {
  const bare = makeTree({ "plugin.json": "{}\n" });
  assert.equal(runScript("check_spec_archived.ts", [], bare).code, 0);

  const archived = makeTree({
    "openspec/changes/archive/2026-10-27-add-thing/proposal.md": "# done\n",
    "openspec/changes/README.md": "plain files are not changes\n",
  });
  const result = runScript("check_spec_archived.ts", [], archived);
  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /no unarchived change/);
});

test("check_spec_archived exits 1 naming every unarchived change", () => {
  const root = makeTree({
    "openspec/changes/archive/old/proposal.md": "# done\n",
    "openspec/changes/add-thing/proposal.md": "# wip\n",
    "openspec/changes/fix-other/proposal.md": "# wip\n",
  });
  const result = runScript("check_spec_archived.ts", [], root);
  assert.equal(result.code, 1);
  assert.match(result.output, /openspec\/changes\/add-thing: unarchived change/);
  assert.match(result.output, /openspec\/changes\/fix-other: unarchived change/);
  assert.equal(runScript("check_spec_archived.ts", ["--x"], root).code, 2);
});
