// The languages the site is published in. Adding one takes an entry here, its
// strings in `src/i18n/ui.ts`, its plugin docs under `src/content/docs/<code>/`,
// and `spec/spec.<code>.md`. The first entry is the default language, served
// without a URL prefix.
export const LANGUAGES = [
  { code: "en", name: "English", htmlLang: "en" },
  { code: "zh", name: "中文", htmlLang: "zh-CN" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANG: Lang = LANGUAGES[0].code;

export const LANGS: readonly Lang[] = LANGUAGES.map((language) => language.code);
