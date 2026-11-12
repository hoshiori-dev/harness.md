import type { Lang } from "./paths";

/**
 * Splits a plugin docs entry id into its language and page. A docs file
 * `<lang>/<page>.md` is served at `/plugin/<page>/`; the loader names
 * `<lang>/index.md` just `<lang>`, and that file is `/plugin/` itself.
 */
export function parseDocId(id: string): { lang: Lang; page: string } {
  const [lang, page = "index"] = id.split("/") as [Lang, string | undefined];
  return { lang, page };
}

export function docPath(page: string): string {
  return page === "index" ? "/plugin/" : `/plugin/${page}/`;
}
