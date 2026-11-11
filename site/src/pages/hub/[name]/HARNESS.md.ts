import type { APIRoute, GetStaticPaths } from "astro";
import { hubEntries } from "../../../lib/hub";

// The raw file, byte for byte, for the Download button and for anyone who
// wants to fetch an entry with curl.
export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await hubEntries();
  return entries.map((entry) => ({ params: { name: entry.id }, props: { raw: entry.raw } }));
};

export const GET: APIRoute = ({ props }) =>
  new Response(props.raw as string, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
