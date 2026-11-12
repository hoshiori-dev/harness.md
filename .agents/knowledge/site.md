# Site

Read when editing anything under `site/`, the `site-*` recipes,
or the site workflow.

The website is built from `site/` with Astro and Pagefind and served
by GitHub Pages at `https://hoshiori-dev.github.io/harness.md/`.
Its contract is `openspec/specs/site/spec.md`.

## Layout and rules

- `site/` is its own pnpm workspace package with its own Biome configuration;
  the root Biome configuration ignores it. Install with `just site-install`.
- The specification pages render `spec/spec.md` and `spec/spec.zh.md`,
  and the hub pages render every `hub/<name>/HARNESS.md`, at build time.
  The site holds no copy of either: to change that text, edit the source.
- `DESIGN.md` at the repository root is the site's visual design
  (DESIGN.md format: tokens in the frontmatter, guidance in prose).
  Read it before changing a colour, a type size, spacing, a corner,
  or a component, and before adding a component. Intent comes from `DESIGN.md`;
  the values in force are the custom properties in `site/src/styles/global.css`.
  A visual change updates both in the same change.
  No new colour, shadow, or card without changing `DESIGN.md` first.
- Every document page has a Markdown version generated at build time:
  the specification at `/spec.md`, a plugin docs page at `/plugin/<page>.md`,
  a hub entry at its raw `HARNESS.md`.
  It is reached from the page-actions menu and from a `rel="alternate"` link.
  The home page and the hub index are navigation and have none;
  `/llms.txt` (`llmsText()` in `site/src/lib/pagemd.ts`)
  is the index an agent starts from and lists every Markdown document.
  A new document type needs its `.md` endpoint, the menu,
  and a section in `llms.txt`.
- On a hub entry's page the file's menu (copy, view, download,
  GitHub) sits beside the button that copies the agent prompt.
  The hub index shows buttons for the five most used tags only;
  other tags are found through the search box,
  and a `?tag=` address for one of them fills the box.
- `just site-dev` serves the site with live reload
  and `just site-preview` serves a fresh build (search works only there);
  both are at `http://localhost:4321/harness.md/`, and the bare root is a 404.
  Astro leaves its server running in the background,
  and a server that outlived a rename or removal
  under `site/src/` serves errors: both recipes stop leftovers first,
  and `just site-stop` does only that.
- Languages are listed once in `site/src/lib/languages.ts`;
  the header's language menu and the routes are built from that list.
- English is served at the root and Chinese under `/zh/`;
  every page exists in both and the language switch leads to the same page.
  Hub entries are English and shown unchanged in both.
- The base path is `/harness.md/`:
  every internal link and asset goes through the base,
  never an absolute `/…` path.
- No request to another origin at runtime:
  fonts are system or self-hosted, and there is no analytics.
- The home page opens with the search box over hub entries;
  the introduction comes after it.
- Copy (home page, plugin documentation, interface text) is for people:
  draft and review it with the `human-writing` skill, in both languages,
  and write the Chinese as Chinese, not as translated English.
  The Chinese page changes in the same change as its English source.
- The plugin documentation pages describe what ships;
  when a skill is added, renamed, or removed,
  update them in both languages
  (`.agents/knowledge/plugin-architecture.md` is the source).

## Checks

`just site-check` (Astro and Biome checks for the site) and `just site-build`
(the static output plus the Pagefind index) both run in `just check`.
`just site-dev` serves the site locally.
An agent without a browser tool cannot see the result:
say so instead of claiming the page looks right.

## What needs a spec

A change to behaviour the site spec states (where content comes from,
the two languages, the search-first home page, copy and download of an entry,
no outside requests) is an OpenSpec change under `site/`.
Styling, layout, and copy are spec-less.

## Deployment

A pull request builds the site inside the `checks` workflow.
The site workflow builds and deploys on a push to `main` that touches `site/`,
`spec/`, `hub/`, or the build inputs. Enabling Pages (source:
GitHub Actions) is a remote setting
(`.agents/knowledge/github/platform-settings.md`);
nothing is ever deployed from a session.
