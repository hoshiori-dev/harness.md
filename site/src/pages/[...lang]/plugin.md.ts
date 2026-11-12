import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { parseDocId } from "../../lib/docs";
import { docMarkdown, markdownResponse } from "../../lib/pagemd";
import { type Lang, langPaths } from "../../lib/paths";

// The Markdown version of the plugin docs' first page: `/plugin.md`,
// `/zh/plugin.md`. The other pages are served by `plugin/[page].md.ts`.
export const getStaticPaths = langPaths;

export const GET: APIRoute = async ({ props }) => {
  const lang = props.lang as Lang;
  const docs = await getCollection("docs");
  const doc = docs.find((candidate) => {
    const id = parseDocId(candidate.id);
    return id.lang === lang && id.page === "index";
  });
  if (!doc) throw new Error(`plugin docs for "${lang}" have no index.md`);
  return markdownResponse(docMarkdown(lang, "index", doc.data.title, doc.body ?? ""));
};
