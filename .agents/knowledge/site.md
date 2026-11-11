# Site

Read when editing anything under `site/`, the `site-*` recipes, or the site
workflow.

The website is built from `site/` with Astro and Pagefind and served by
GitHub Pages at `https://hoshiori-dev.github.io/harness.md/`. Its contract
is `openspec/specs/site/spec.md`.

## Layout and rules

- `site/` is its own pnpm workspace package with its own Biome
  configuration; the root Biome configuration ignores it. Install with
  `just site-install`.
- The specification pages render `spec/spec.md` and `spec/spec.zh.md`, and
  the hub pages render every `hub/<name>/HARNESS.md`, at build time. The
  site holds no copy of either: to change that text, edit the source.
- English is served at the root and Chinese under `/zh/`; every page exists
  in both and the language switch leads to the same page. Hub entries are
  English and shown unchanged in both.
- The base path is `/harness.md/`: every internal link and asset goes
  through the base, never an absolute `/…` path.
- No request to another origin at runtime: fonts are system or self-hosted,
  and there is no analytics.
- The home page opens with the search box over hub entries; the
  introduction comes after it.
- Copy (home page, plugin documentation, interface text) is for people:
  draft and review it with the `human-writing` skill, in both languages,
  and write the Chinese as Chinese, not as translated English. The Chinese
  page changes in the same change as its English source.
- The plugin documentation pages describe what ships; when a skill is
  added, renamed, or removed, update them in both languages
  (`.agents/knowledge/plugin-architecture.md` is the source).

## Checks

`just site-check` (Astro and Biome checks for the site) and
`just site-build` (the static output plus the Pagefind index) both run in
`just check`. `just site-dev` serves the site locally. An agent without a
browser tool cannot see the result: say so instead of claiming the page
looks right.

## What needs a spec

A change to behaviour the site spec states (where content comes from, the
two languages, the search-first home page, copy and download of an entry,
no outside requests) is an OpenSpec change under `site/`. Styling, layout,
and copy are spec-less.

## Deployment

A pull request builds the site inside the `checks` workflow. The site
workflow builds and deploys on a push to `main` that touches `site/`,
`spec/`, `hub/`, or the build inputs. Enabling Pages (source: GitHub
Actions) is a remote setting
(`.agents/knowledge/github/platform-settings.md`); nothing is ever deployed
from a session.
