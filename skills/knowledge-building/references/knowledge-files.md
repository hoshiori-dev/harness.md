# Knowledge Files and Layout

Read when the project already has agent docs anywhere in the repository,
when deciding what a knowledge file may hold,
or when the user asks why the folders are laid out as they are.

## Why the layout

A client-neutral folder keeps one real copy of each skill:
Codex reads `.agents/skills/`, Claude Code reads `.claude/skills/`,
and the relative link makes them the same directory.

Keep knowledge in the repository. Bridge an outside source (a wiki, a tracker,
vendor documentation) only when the maintained truth already lives there;
the routing row then says it is the source of truth and what agents
may read or write. Never invent an outside source or assume access to one.

## Writing a knowledge file

- **First line**: "Read this when …",
  naming the situation exactly as its routing row does.
  Nothing (title, front matter) comes before it.
- **One concern** per file. Two situations with disjoint readers are two files,
  or one file with sections the routing rows name.
- **Facts first**: the constraint, value, or decision in the first lines;
  the reason after it; no narrative, history, or greeting.
- **Only what code cannot state**: why, and when to read what.
  A request to list every directory or recipe is declined:
  point at the task runner for recipes and record only the why and when.
- **Source of truth**: when the file summarises something maintained elsewhere,
  name that source and say it wins on conflict.
- **No placeholder files**:
  create only what a current need passed the four questions for.

Procedures with ordered or branching steps are skill candidates;
facts and architecture are knowledge.

## What earns a file

Measured against real tasks,
context files that describe the repository (its layout, its stack,
how to run the tests the README already explains) do not make agents succeed
more often and make every task cost more.
Content earns a file when all three hold:

- an agent would get it wrong from the code alone (a non-standard command,
  a convention the linter cannot enforce, a decision that looks like a mistake);
- getting it wrong costs more than the read;
- some recognisable situation selects it, so a row can route to it.

## Agent docs that already exist

1. **Inventory** every agent-facing doc:
   path, topic, first line, which entrypoint line reaches it.
2. **Classify** each: current, invisible, duplicated, contradicting the code,
   stale, restating the code.
3. **Decide per file in the section**:
   route an invisible file that earns its place
   (a routing row and a "Read this when" first line);
   merge a duplicate into the current copy;
   drop content that contradicts the code, session notes with no durable fact,
   and restatements of what code shows.
   Never route every unreached file silently.
   A removal needs the section to name the file and the user's go-ahead
   when the build reaches it.
4. **Converge in place**: move content into the chosen folder,
   converting it to the rules above as it moves,
   and update the routing table in the same change as each move.
5. **Leave public files alone**: README, CONTRIBUTING,
   and SECURITY are not knowledge files;
   route to one when agents need it, never absorb or restyle it.
