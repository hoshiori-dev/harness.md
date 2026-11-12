import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { hubEntries } from "../lib/hub";
import { llmsText } from "../lib/pagemd";

// `/llms.txt`: the index an agent starts from. It links every Markdown
// document on the site: the specification, each hub entry's HARNESS.md, and
// the plugin docs. The home page and the hub index have no Markdown version;
// this file is what stands in for them.
export const GET: APIRoute = async () => {
  const docs = await getCollection("docs");
  const summaries = docs.map((doc) => ({
    id: doc.id,
    title: doc.data.title,
    description: doc.data.description,
    order: doc.data.order,
  }));
  return new Response(llmsText(await hubEntries(), summaries), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
