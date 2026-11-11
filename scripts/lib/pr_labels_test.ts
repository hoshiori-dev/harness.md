import assert from "node:assert/strict";
import { test } from "node:test";
import type { Api, ChangedFile, Comment, Event, LabelEvent, Pull, TreeEntry } from "./pr_labels.ts";
import {
  APPROVED,
  ARCHIVED,
  decide,
  labelPlan,
  PENDING,
  packageHash,
  parseRecord,
  RECORD_AUTHOR,
  recordBody,
  SKIPPED,
} from "./pr_labels.ts";

function assertIncludes(actual: string, expected: string) {
  assert.ok(actual.includes(expected), `missing "${expected}" in: ${actual}`);
}
/** The value, or a failed assertion when it is absent. */
function present<T>(value: T | null | undefined): T {
  assert.ok(value !== null && value !== undefined, "expected a value");
  return value;
}

const HEAD = "a".repeat(40);
const blob = (path: string, sha = "1".repeat(40)): TreeEntry => ({ path, type: "blob", sha });
const CHANGE = [
  blob("openspec/changes/add-thing/proposal.md"),
  blob("openspec/changes/add-thing/specs/skill/spec.md", "2".repeat(40)),
];
const ARCHIVE = [blob("openspec/changes/archive/2026-10-01-old/proposal.md", "3".repeat(40))];

interface Fixture {
  pull?: Partial<Pull>;
  files?: ChangedFile[];
  entries?: TreeEntry[];
  truncated?: boolean;
  events?: LabelEvent[];
  comments?: Comment[];
  permission?: string;
  blobs?: Record<string, string>;
}
function fake(f: Fixture): Api {
  return {
    pull: () => Promise.resolve({ state: "open", head: HEAD, labels: [], ...f.pull }),
    files: () =>
      Promise.resolve(
        f.files ?? [{ filename: "openspec/changes/add-thing/proposal.md", status: "added" }],
      ),
    tree: () =>
      Promise.resolve({
        entries: f.entries ?? [...ARCHIVE, ...CHANGE],
        truncated: f.truncated ?? false,
      }),
    labelEvents: () => Promise.resolve(f.events ?? []),
    comments: () => Promise.resolve(f.comments ?? []),
    permission: () => Promise.resolve(f.permission ?? "write"),
    blob: (sha) => Promise.resolve(f.blobs?.[sha] ?? ""),
  };
}
const approveEvent: Event = {
  action: "labeled",
  label: APPROVED,
  sender: "maintainer",
  head: HEAD,
};
const approvedBy = (actor: string, id = 10): LabelEvent => ({
  id,
  event: "labeled",
  label: APPROVED,
  actor,
});

test("skipped when no file under openspec/changes/ is touched", async () => {
  const d = await decide(fake({ files: [{ filename: "README.md", status: "modified" }] }), null);
  assert.deepEqual(d.state, SKIPPED);
});

test("pending while an unarchived change has no approval", async () => {
  const d = await decide(fake({}), null);
  assert.deepEqual(d.state, PENDING);
  assertIncludes(d.reason, "add-thing");
  assert.deepEqual(d.record, undefined);
});

test("archived when no unarchived change remains and an archive is added", async () => {
  const api = fake({
    entries: ARCHIVE,
    files: [{ filename: "openspec/changes/archive/2026-10-01-old/proposal.md", status: "added" }],
  });
  assert.deepEqual((await decide(api, null)).state, ARCHIVED);
  const removedOnly = fake({
    entries: ARCHIVE,
    files: [{ filename: "openspec/changes/add-thing/proposal.md", status: "removed" }],
  });
  assert.deepEqual((await decide(removedOnly, null)).state, null);
});

test("a write-permission account adding spec:approved is recorded", async () => {
  const api = fake({ events: [approvedBy("maintainer")] });
  const d = await decide(api, approveEvent);
  assert.deepEqual(d.state, APPROVED);
  assert.deepEqual(d.record?.id, undefined);
  const record = present(
    parseRecord({ id: 1, body: present(d.record).body, author: RECORD_AUTHOR }),
  );
  assert.deepEqual(record.status, "approved");
  assert.deepEqual(record.commit, HEAD);
  assert.deepEqual(record.by, "maintainer");
  assert.deepEqual(record.hash, await packageHash([...ARCHIVE, ...CHANGE], ["add-thing"]));
});

test("the approval is refused below write permission, on a moved head, or for a bot", async () => {
  const read = await decide(
    fake({ events: [approvedBy("maintainer")], permission: "read" }),
    approveEvent,
  );
  assert.deepEqual(read.state, PENDING);
  assertIncludes(read.reason, "below write");
  const moved = await decide(fake({ events: [approvedBy("maintainer")] }), {
    ...approveEvent,
    head: "b".repeat(40),
  });
  assert.deepEqual(moved.state, PENDING);
  assertIncludes(moved.reason, "no longer the commit");
  const bot = await decide(fake({ events: [approvedBy("github-actions[bot]")] }), {
    ...approveEvent,
    sender: "github-actions[bot]",
  });
  assert.deepEqual(bot.state, PENDING);
});

test("a standing approval survives unrelated pushes and dies when the package changes", async () => {
  const hash = await packageHash([...ARCHIVE, ...CHANGE], ["add-thing"]);
  const record: Comment = {
    id: 7,
    body: recordBody("approved", HEAD, "maintainer", hash),
    author: RECORD_AUTHOR,
  };
  const same = await decide(
    fake({
      events: [approvedBy("maintainer")],
      comments: [record],
      pull: { head: "c".repeat(40) },
    }),
    null,
  );
  assert.deepEqual(same.state, APPROVED);
  assert.deepEqual(same.record, undefined);

  const edited = fake({
    events: [approvedBy("maintainer")],
    comments: [record],
    entries: [
      ...ARCHIVE,
      blob("openspec/changes/add-thing/proposal.md", "9".repeat(40)),
      present(CHANGE[1]),
    ],
  });
  const d = await decide(edited, null);
  assert.deepEqual(d.state, PENDING);
  assertIncludes(d.reason, "package changed");
  assert.deepEqual(d.record?.id, 7);
  assert.deepEqual(
    parseRecord({ id: 7, body: present(d.record).body, author: RECORD_AUTHOR })?.status,
    "withdrawn",
  );
});

test("a record approves only the person whose adding of the label stands", async () => {
  const hash = await packageHash([...ARCHIVE, ...CHANGE], ["add-thing"]);
  const record: Comment = {
    id: 7,
    body: recordBody("approved", HEAD, "maintainer", hash),
    author: RECORD_AUTHOR,
  };
  const events: LabelEvent[] = [
    approvedBy("maintainer", 10),
    { id: 11, event: "unlabeled", label: APPROVED, actor: "maintainer" },
    approvedBy("triager", 12),
  ];
  const d = await decide(fake({ events, comments: [record], pull: { labels: [APPROVED] } }), null);
  assert.deepEqual(d.state, PENDING);
  assertIncludes(d.reason, "record was made for maintainer");
  assert.deepEqual(
    parseRecord({ id: 7, body: present(d.record).body, author: RECORD_AUTHOR })?.status,
    "withdrawn",
  );
  // The same person removing and re-adding keeps their own record.
  const own = [
    approvedBy("maintainer", 10),
    {
      id: 11,
      event: "unlabeled" as const,
      label: APPROVED,
      actor: "maintainer",
    },
    approvedBy("maintainer", 12),
  ];
  assert.deepEqual((await decide(fake({ events: own, comments: [record] }), null)).state, APPROVED);
});

test("a person removing spec:approved, or a label without a record, means pending", async () => {
  const hash = await packageHash([...ARCHIVE, ...CHANGE], ["add-thing"]);
  const record: Comment = {
    id: 7,
    body: recordBody("approved", HEAD, "maintainer", hash),
    author: RECORD_AUTHOR,
  };
  const removed = await decide(
    fake({
      events: [
        approvedBy("maintainer"),
        {
          id: 11,
          event: "unlabeled",
          label: APPROVED,
          actor: "maintainer",
        },
      ],
      comments: [record],
    }),
    null,
  );
  assert.deepEqual(removed.state, PENDING);
  const noRecord = await decide(
    fake({ events: [approvedBy("maintainer")], pull: { labels: [APPROVED] } }),
    null,
  );
  assert.deepEqual(noRecord.state, PENDING);
  assert.deepEqual(labelPlan([APPROVED, "type:task"], noRecord), {
    add: [PENDING],
    remove: [APPROVED],
  });
});

test("a record comment from anyone but the workflow identity is ignored", async () => {
  const hash = await packageHash([...ARCHIVE, ...CHANGE], ["add-thing"]);
  const body = recordBody("approved", HEAD, "maintainer", hash);
  const forged: Comment = { id: 9, body, author: "contributor" };
  const otherBot: Comment = { id: 10, body, author: "dependabot[bot]" };
  for (const comments of [[forged], [otherBot], [forged, otherBot]]) {
    const api = fake({
      events: [approvedBy("maintainer")],
      comments,
      pull: { labels: [APPROVED] },
    });
    const d = await decide(api, null);
    assert.deepEqual(d.state, PENDING);
    assertIncludes(d.reason, "no approval record");
    assert.deepEqual(d.record, undefined, "a forged record is never edited");
  }
});

test("a change whose .openspec.yaml sets skip_specs: true is spec-less", async () => {
  const marker = blob("openspec/changes/add-thing/.openspec.yaml", "5".repeat(40));
  const skipped = fake({
    entries: [...ARCHIVE, ...CHANGE, marker],
    blobs: { ["5".repeat(40)]: "schema: spec-driven\nskip_specs: true\n" },
  });
  assert.deepEqual((await decide(skipped, null)).state, SKIPPED);
  const notSkipped = fake({
    entries: [...ARCHIVE, ...CHANGE, marker],
    blobs: { ["5".repeat(40)]: "skip_specs: false\n" },
  });
  assert.deepEqual((await decide(notSkipped, null)).state, PENDING);
  const second = blob("openspec/changes/other/proposal.md", "6".repeat(40));
  const mixed = fake({
    entries: [...ARCHIVE, ...CHANGE, marker, second],
    blobs: { ["5".repeat(40)]: "skip_specs: true\n" },
  });
  assert.deepEqual(
    (await decide(mixed, null)).state,
    PENDING,
    "one change without the marker keeps the gate",
  );
});

test("skip_specs is read as a YAML document, not as text", async () => {
  const { skipSpecs } = await import("./pr_labels.ts");
  assert.deepEqual(skipSpecs("schema: spec-driven\nskip_specs: true\n"), true);
  assert.deepEqual(
    skipSpecs("notes: |\n  skip_specs: true\nskip_specs: false\n"),
    false,
    "block scalar",
  );
  assert.deepEqual(skipSpecs("nested:\n  skip_specs: true\n"), false, "nested");
  assert.deepEqual(skipSpecs('skip_specs: "true"\n'), false, "string");
  assert.deepEqual(skipSpecs("skip_specs: [unclosed\n"), false, "invalid yaml");
  const marker = blob("openspec/changes/add-thing/.openspec.yaml", "5".repeat(40));
  const tricked = fake({
    entries: [...ARCHIVE, ...CHANGE, marker],
    blobs: { ["5".repeat(40)]: "notes: |\n  skip_specs: true\nskip_specs: false\n" },
  });
  assert.deepEqual((await decide(tricked, null)).state, PENDING);
});

test("an approval whose timeline entry has not appeared yet is still recorded", async () => {
  const d = await decide(fake({ events: [] }), approveEvent);
  assert.deepEqual(d.state, APPROVED);
  const other = await decide(fake({ events: [approvedBy("someone-else")] }), approveEvent);
  assert.deepEqual(other.state, PENDING);
});

test("archiving is recognised whatever status the archive files carry", async () => {
  for (const status of ["added", "renamed", "modified"]) {
    const files = [{ filename: "openspec/changes/archive/2026-10-01-old/proposal.md", status }];
    assert.deepEqual(
      (await decide(fake({ entries: ARCHIVE, files }), null)).state,
      ARCHIVED,
      status,
    );
  }
});

test("closed pull requests keep their labels; truncated trees are not decided", async () => {
  const closed = await decide(
    fake({ pull: { state: "closed", labels: [ARCHIVED, "type:task"] } }),
    null,
  );
  assert.deepEqual(closed.state, null);
  assert.deepEqual(closed.leave, true);
  assert.deepEqual(labelPlan([ARCHIVED, "type:task"], closed), { add: [], remove: [] });
  await assert.rejects(() => decide(fake({ truncated: true }), null), /truncated/);
});
