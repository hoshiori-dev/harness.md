# Knowledge Decisions

Read when running step 2 (decide mode) or auditing without an anchor document:
this file holds the layer's thickness table and all seven decisions.

## Thickness

What this layer is at each thickness:

| Thickness | The layer |
|---|---|
| omitted | no entrypoint and no knowledge files; agents work from the code and the human docs |
| light | a single-file harness: `AGENTS.md` alone, about 200 lines, no knowledge folder |
| medium | an `AGENTS.md` of about 100 lines, never over 120, knowledge files behind routing rows, a skills folder |
| thick | medium, and a check fails when a row's path is missing, a knowledge file is unrouted, a named recipe does not exist, or the entrypoint is over budget; this layer states what has to hold, the layers that own Entropy and Gates build the check |

Thicker: the project is maintained for long; several people or agents
rely on its conventions; agents work unattended, so nobody corrects
a missed convention; a wrong change is costly; step 1 found many
non-standard practices or procedures.
Thinner: one person maintains it for a short time;
agents work with a person watching; little passes the rule
"Only what an agent cannot infer".
Omitted only when nothing passes that rule and every other layer is omitted:
any other layer's always-on rules and routes need an entrypoint to be seen.
Thick depends on the Entropy and Gates layers not being omitted.
Return one recommended thickness with the conditions that selected it.
When the handover carries a settled thickness, use it
and return only the decisions that exist at that thickness.

## The seven decisions

1. **Entrypoint.** Recommend `AGENTS.md` as the only rule-bearing file,
   for every project: each client reads it or can be pointed at it.
   No subdirectory entry files: clients disagree on when they load one.
2. **`CLAUDE.md`.** Recommend none, when every supported Claude Code
   is v2.1.277 or newer: from that version Claude Code reads `AGENTS.md`
   by itself when no `CLAUDE.md` exists, and a second file is a second copy.
   An existing `CLAUDE.md` holding only rules for all agents:
   move each rule to `AGENTS.md` and name the removal of the file.
   Keep or add a `CLAUDE.md` whose first line
   is `@AGENTS.md` only when the project must support an older Claude Code,
   or already has content meant for Claude Code alone;
   that content stays below the import,
   and every rule for all agents moves to `AGENTS.md`.
3. **Shape and budget.** Depends on the thickness.
   A project one person maintains for a short time: a single-file harness,
   `AGENTS.md` alone, about 200 lines, no knowledge folder,
   because nobody else needs to find anything.
   Every other project: an entrypoint of about 100 lines, never over 120,
   with knowledge files behind routing rows.
   The longer the project lives and the more people rely on its conventions,
   the more situations justify a file; none is created without a current need.
4. **Folders.** Depends on decision 3.
   A knowledge or skills folder that exists is reused.
   Otherwise `.agents/knowledge/` and `.agents/skills/`,
   with `.claude/skills` a relative link to `.agents/skills`
   when Claude Code shares the repository with another client,
   so no skill exists twice;
   a real `.claude/skills` directory when Claude Code is the only client.
5. **A carrier for every piece of content**:
   each existing entrypoint line, knowledge file, and project skill,
   each invariant and style convention assigned to this layer,
   each rule or procedure the user named,
   each inherited part of a reference. Exactly one carrier each:
   - **Always block**: breaking the rule harms whatever the task is (secrets,
     commit and publish limits, language,
     the check to run before handing work back).
   - **Routing row and knowledge file**: one kind of task needs it.
     The decision names the file, its "Read this when" situation,
     what it holds, and its answers to the four questions.
   - **Nothing**: the code states it (leaf directories, the recipe list,
     signatures).
   - **Type, signature, or code comment**:
     read [inline-vs-document.md](inline-vs-document.md) when a candidate is a constraint,
     an invariant of one function, or a workaround.
   - **Project skill**:
     read [project-skill-warrant.md](project-skill-warrant.md) when a candidate is a procedure,
     when the user asks for a skill,
     or when an existing skill needs a routing row.
   - **Script**: read [scripts.md](scripts.md) when an operation takes more than two lines,
     assembles arguments, or filters output.
   - **Outside documentation**: a routing row naming the URL and the situation,
     only when the maintained truth lives there;
     tell the layer that owns Environment the host has to be reachable.
6. **Existing files that fail.** Per file, by its classification in step 1:
   route an invisible one that passes the four questions,
   merge a duplicate into the current copy,
   drop what restates or contradicts the code.
   Name each move and each removal;
   a removal is a decision of its own, with the file's rules moved first.
7. **`HARNESS.md` line.** Settled from the handover or step 1:
   when the project adopted the file as its anchor document,
   one Always line names it as the design to open when the harness
   is checked or changed; otherwise no mention.
   A root `HARNESS.md` that no entrypoint and no handover names
   is returned as open,
   "no mention" first: nothing shows the project treats it as its design.

Read [entrypoint.md](entrypoint.md) when sorting rules between Always and routing rows,
when the entrypoint would exceed its budget,
or when a `CLAUDE.md` or a subdirectory entry file is involved.

Read [knowledge-files.md](knowledge-files.md) when the project already has agent docs anywhere,
or when deciding what a knowledge file may hold.
