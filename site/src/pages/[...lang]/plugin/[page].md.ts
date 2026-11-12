import { getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { parseDocId } from "../../../lib/docs";
import { docMarkdown, markdownResponse } from "../../../lib/pagemd";
import { type Lang, langParam } from "../../../lib/paths";

// The Markdown version of a plugin docs page: `/plugin/<page>.md`,
// `/zh/plugin/<page>.md`.
export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await getCollection("docs");
  return docs
    .map((doc) => ({ doc, ...parseDocId(doc.id) }))
    .filter(({ page }) => page !== "index")
    .map(({ doc, lang, page }) => ({
      params: { lang: langParam(lang), page },
      props: { lang, page, title: doc.data.title, body: doc.body ?? "" },
    }));
};

export const GET: APIRoute = ({ props }) =>
  markdownResponse(docMarkdown(props.lang as Lang, props.page as string, props.title as string, props.body as string));
