import { DEFAULT_LANG, LANGS, LANGUAGES, type Lang } from "./languages";

export { DEFAULT_LANG, LANGS, LANGUAGES, type Lang };

export const REPO_URL = "https://github.com/hoshiori-dev/harness.md";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const origin = (import.meta.env.SITE ?? "").replace(/\/$/, "");

/** A site-internal URL for `path` (which starts with `/`) in `lang`. */
export function href(path: string, lang: Lang = DEFAULT_LANG): string {
  return `${base}${lang === DEFAULT_LANG ? "" : `/${lang}`}${path}`;
}

/** A URL for a file that has no language variant (assets, raw hub files). */
export function asset(path: string): string {
  return `${base}${path}`;
}

/** The full URL of something `href()` or `asset()` returned, as published. */
export function absolute(url: string): string {
  if (!origin) throw new Error("astro.config.ts must set `site`: absolute URLs are built from it");
  return `${origin}${url}`;
}

/** The attribute value for `<html lang>` and `hreflang`. */
export function htmlLang(lang: Lang): string {
  return LANGUAGES.find((language) => language.code === lang)?.htmlLang ?? lang;
}

/**
 * Where the Markdown version of a page lives: `/x/y/` is at `/x/y.md` and the
 * home page at `/index.md`. A hub entry is the exception: its Markdown version
 * is the repository file itself (`hubFile()`), the same in every language.
 */
export function markdownPath(path: string): string {
  return path === "/" ? "/index.md" : `${path.replace(/\/$/, "")}.md`;
}

/** The raw `HARNESS.md` of a hub entry, byte for byte, as a site URL. */
export function hubFile(id: string): string {
  return asset(`/hub/${id}/HARNESS.md`);
}

/** `getStaticPaths` entries for a page that exists once per language. */
export function langPaths(): { params: { lang: string | undefined }; props: { lang: Lang } }[] {
  return LANGS.map((lang) => ({
    params: { lang: lang === DEFAULT_LANG ? undefined : lang },
    props: { lang },
  }));
}

/** The `lang` route parameter for a language (the default one has no prefix). */
export function langParam(lang: Lang): string | undefined {
  return lang === DEFAULT_LANG ? undefined : lang;
}
