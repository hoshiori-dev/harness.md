// The Markdown version of a document page. The specification at `/spec/` has
// it at `/spec.md` and a plugin docs page at `/plugin/<page>.md`
// (`markdownPath()`); a hub entry's is its raw `HARNESS.md`. The home page and
// the hub index are navigation, not documents, and have none: `llms.txt`
// (`llmsText()`) is the index an agent starts from. Links between Markdown
// versions are absolute, so an agent that fetched one file can follow them.
import { ui } from "../i18n/ui";
import { docPath, parseDocId } from "./docs";
import type { HubEntry } from "./hub";
import { absolute, DEFAULT_LANG, href, hubFile, LANGS, type Lang, markdownPath } from "./paths";

/** Pages that are navigation and have no Markdown version. */
const NO_MARKDOWN = new Set(["/", "/hub/"]);

/**
 * The absolute URL of the Markdown version of the page at `path`, or of the
 * page itself when it has none.
 */
export function markdownUrl(path: string, lang: Lang): string {
  return absolute(href(NO_MARKDOWN.has(path) ? path : markdownPath(path), lang));
}

/** The repository file a specification page is rendered from. */
export function specFile(lang: Lang): string {
  return lang === DEFAULT_LANG ? "spec/spec.md" : `spec/spec.${lang}.md`;
}

/** One docs page as `llms.txt` needs it. */
export interface DocSummary {
  /** The collection id, `<lang>` or `<lang>/<page>`. */
  id: string;
  title: string;
  description: string;
  order: number;
}

/**
 * `llms.txt`: the index of everything on the site an agent can read as
 * Markdown, in the llmstxt.org layout (a title, a summary, then sections of
 * links). English first; the translations go under "Optional", the section
 * that format reserves for what may be skipped.
 */
export function llmsText(entries: HubEntry[], docs: DocSummary[]): string {
  const pages = (lang: Lang) =>
    docs
      .map((doc) => ({ ...doc, ...parseDocId(doc.id) }))
      .filter((doc) => doc.lang === lang)
      .sort((a, b) => a.order - b.order);
  const lines = [
    "# HARNESS.md",
    "",
    "> HARNESS.md is one file that records the design of a project's agent harness: where a coding agent runs, what it reads, how it checks its own work, what stops a bad change, and what it may do without asking. This site holds the format specification, a hub of ready-to-use designs, and the documentation of the harness-md plugin.",
    "",
    'To build a harness from a hub entry: read the entry\'s HARNESS.md, follow its "How to use this file" section, check its Context section against the project, show the user a plan, and build only after they approve.',
    "",
    "## Specification",
    "",
    `- [HARNESS.md format specification](${markdownUrl("/spec/", DEFAULT_LANG)}): the frontmatter keys, the fourteen sections, and what a validator reports`,
    "",
  ];
  if (entries.length > 0) {
    lines.push("## Hub", "");
    for (const entry of entries) lines.push(`- [${entry.name}](${absolute(hubFile(entry.id))}): ${entry.description}`);
    lines.push("");
  }
  lines.push("## Plugin", "");
  for (const doc of pages(DEFAULT_LANG))
    lines.push(`- [${doc.title}](${markdownUrl(docPath(doc.page), DEFAULT_LANG)}): ${doc.description}`);
  lines.push("", "## Optional", "");
  for (const lang of LANGS.filter((code) => code !== DEFAULT_LANG)) {
    lines.push(`- [${ui(lang).spec.title} (${lang})](${markdownUrl("/spec/", lang)}): ${ui(lang).spec.description}`);
    for (const doc of pages(lang))
      lines.push(`- [${doc.title} (${lang})](${markdownUrl(docPath(doc.page), lang)}): ${doc.description}`);
  }
  lines.push("");
  return lines.join("\n");
}

/**
 * Turns a link written relative to a plugin docs page into the absolute URL
 * of the target's Markdown version. Links that leave the site stay as they
 * are.
 */
function resolveDocLink(target: string, page: string, lang: Lang): string {
  if (/^([a-z][a-z0-9+.-]*:|#)/i.test(target)) return target;
  const pageUrl = absolute(href(docPath(page), lang));
  const url = new URL(target, pageUrl);
  const root = absolute(href("/", DEFAULT_LANG));
  if (!url.href.startsWith(root) || !url.pathname.endsWith("/")) return url.href;
  // `rest` is the path below the site root, e.g. `zh/plugin/skills/`.
  const rest = url.pathname.slice(new URL(root).pathname.length);
  const [first = "", ...others] = rest.split("/");
  const targetLang = LANGS.find((code) => code === first && code !== DEFAULT_LANG);
  const path = `/${(targetLang ? others : [first, ...others]).join("/")}`;
  const entry = /^\/hub\/([^/]+)\/$/.exec(path);
  if (entry?.[1]) return absolute(hubFile(entry[1]));
  return `${markdownUrl(path, targetLang ?? DEFAULT_LANG)}${url.hash}`;
}

/** A plugin docs page: its title as a first-level heading, then its source. */
export function docMarkdown(lang: Lang, page: string, title: string, body: string): string {
  const text = body
    .trim()
    .replace(/\]\(([^)\s]+)\)/g, (_match, target: string) => `](${resolveDocLink(target, page, lang)})`);
  return `# ${title}\n\n${text}\n`;
}

/** The response every Markdown endpoint returns. */
export function markdownResponse(body: string | Uint8Array<ArrayBuffer>): Response {
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
