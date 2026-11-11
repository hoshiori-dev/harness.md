import { defineConfig } from "astro/config";
import { DEFAULT_LANG, LANGS } from "./src/lib/languages";

// Deployed to GitHub Pages as a project site, so every internal URL carries
// the `/harness.md` base. Build internal links with `href()` from
// `src/lib/paths.ts`, never by hand.
export default defineConfig({
  site: "https://hoshiori-dev.github.io",
  base: "/harness.md",
  trailingSlash: "always",
  // The project is developed in a dev container: listen on every interface
  // so the forwarded port reaches the dev and preview servers from the host.
  server: { host: true, port: 4321 },
  build: { format: "directory" },
  i18n: {
    defaultLocale: DEFAULT_LANG,
    locales: [...LANGS],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    shikiConfig: { theme: "github-light", wrap: false },
  },
  devToolbar: { enabled: false },
});
