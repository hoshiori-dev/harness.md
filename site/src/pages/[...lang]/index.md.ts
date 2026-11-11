import type { APIRoute } from "astro";
import { hubEntries } from "../../lib/hub";
import { homeMarkdown, markdownResponse } from "../../lib/pagemd";
import { type Lang, langPaths } from "../../lib/paths";

// The Markdown version of the home page: `/index.md`, `/zh/index.md`.
export const getStaticPaths = langPaths;

export const GET: APIRoute = async ({ props }) =>
  markdownResponse(homeMarkdown(props.lang as Lang, await hubEntries()));
