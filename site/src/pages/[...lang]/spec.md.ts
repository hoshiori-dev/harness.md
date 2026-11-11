import type { APIRoute } from "astro";
import { markdownResponse } from "../../lib/pagemd";
import { type Lang, langPaths } from "../../lib/paths";
import { specBytes } from "../../lib/spec";

// The Markdown version of the specification page is the specification file
// itself, byte for byte: `/spec.md`, `/zh/spec.md`.
export const getStaticPaths = langPaths;

export const GET: APIRoute = async ({ props }) => markdownResponse(await specBytes(props.lang as Lang));
