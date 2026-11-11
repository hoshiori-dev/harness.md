import type { APIRoute } from "astro";
import { hubEntries } from "../../lib/hub";
import { hubIndexMarkdown, markdownResponse } from "../../lib/pagemd";
import { type Lang, langPaths } from "../../lib/paths";

// The Markdown version of the hub index: `/hub.md`, `/zh/hub.md`. Each entry's
// own Markdown version is its raw file, `/hub/<name>/HARNESS.md`.
export const getStaticPaths = langPaths;

export const GET: APIRoute = async ({ props }) =>
  markdownResponse(hubIndexMarkdown(props.lang as Lang, await hubEntries()));
