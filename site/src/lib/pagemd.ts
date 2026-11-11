// The Markdown version of each page. A page at `/x/y/` has it at `/x/y.md`
// (`markdownPath()`); the endpoints under `src/pages` serve what these
// functions return, and the page-actions menu copies the same text. Links
// between Markdown versions are absolute, so an agent that fetched one file
// can follow them.
import { SECTIONS, ui } from "../i18n/ui";
import { docPath } from "./docs";
import type { HubEntry } from "./hub";
import { absolute, DEFAULT_LANG, href, hubFile, LANGS, type Lang, markdownPath } from "./paths";

/** The absolute URL of the Markdown version of the page at `path`. */
export function markdownUrl(path: string, lang: Lang): string {
  return absolute(href(markdownPath(path), lang));
}

/** The repository file a specification page is rendered from. */
export function specFile(lang: Lang): string {
  return lang === DEFAULT_LANG ? "spec/spec.md" : `spec/spec.${lang}.md`;
}

/** UI strings carry `<code>` for the page; in Markdown that is a code span. */
function inline(html: string): string {
  return html.replace(/<\/?code>/g, "`");
}

export function homeMarkdown(lang: Lang, entries: HubEntry[]): string {
  const t = ui(lang);
  const lines = [
    "# HARNESS.md",
    "",
    ...t.home.what.flatMap((paragraph) => [inline(paragraph), ""]),
    `## ${t.home.skeletonHeading}`,
    "",
    t.home.skeletonLead,
    "",
    ...SECTIONS.map(
      (section, index) =>
        `${index + 1}. **${section.name}**${t.parens(section.required ? t.home.required : t.home.optional)}${t.colon}${t.home.questions[index]}`,
    ),
    "",
    `## ${t.home.nextHeading}`,
    "",
    ...t.home.next.map((item) => `- [${item.label}](${markdownUrl(item.path, lang)})${t.colon}${item.note}`),
    "",
  ];
  if (entries.length > 0) {
    lines.push(`## ${t.hub.title}`, "");
    for (const entry of entries)
      lines.push(`- [${entry.name}](${absolute(hubFile(entry.id))})${t.colon}${entry.description}`);
    lines.push("");
  }
  return lines.join("\n");
}

export function hubIndexMarkdown(lang: Lang, entries: HubEntry[]): string {
  const t = ui(lang);
  const lines = [`# ${t.hub.title}`, "", t.hub.lead, ""];
  if (entries.length === 0) lines.push(t.search.empty, "");
  for (const entry of entries) {
    lines.push(`## ${entry.name}`, "", entry.description, "");
    if (entry.tags.length > 0) lines.push(`- ${t.hub.tags}${t.colon}${entry.tags.join(", ")}`);
    lines.push(`- HARNESS.md${t.colon}<${absolute(hubFile(entry.id))}>`, "");
  }
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
