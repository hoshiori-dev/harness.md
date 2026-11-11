export const LANGS = ["en", "zh"] as const;
export type Lang = (typeof LANGS)[number];

export const REPO_URL = "https://github.com/hoshiori-dev/harness.md";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** A site-internal URL for `path` (which starts and ends with `/`) in `lang`. */
export function href(path: string, lang: Lang = "en"): string {
  return `${base}${lang === "en" ? "" : `/${lang}`}${path}`;
}

/** A URL for a file that has no language variant (assets, raw hub files). */
export function asset(path: string): string {
  return `${base}${path}`;
}

/** `getStaticPaths` entries for a page that exists once per language. */
export function langPaths(): { params: { lang: string | undefined }; props: { lang: Lang } }[] {
  return LANGS.map((lang) => ({
    params: { lang: lang === "en" ? undefined : lang },
    props: { lang },
  }));
}

export function otherLang(lang: Lang): Lang {
  return lang === "en" ? "zh" : "en";
}
