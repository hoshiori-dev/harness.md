import { REPO_URL } from "./paths";

/**
 * Rewrites relative links in rendered Markdown that came from a file outside
 * the site. `known` maps a relative target to a site URL; any other relative
 * target points at the file on GitHub, next to its source.
 */
export function rewriteLinks(html: string, sourceDir: string, known: Record<string, string> = {}): string {
  return html.replace(/(<a\b[^>]*?\shref=")([^"]+)(")/g, (match, before, target, after) => {
    if (/^([a-z][a-z0-9+.-]*:|#|\/)/i.test(target)) return match;
    const [path = "", hash] = target.split("#");
    const mapped = known[path];
    const url = mapped ?? `${REPO_URL}/blob/main/${sourceDir}/${path}`;
    return `${before}${url}${hash ? `#${hash}` : ""}${after}`;
  });
}

/** True when rendered Markdown carries its own first-level heading. */
export function hasTopHeading(html: string): boolean {
  return /<h1[\s>]/.test(html);
}

/**
 * Puts every table in a container that scrolls sideways, so a wide table
 * never widens the page. The container is focusable so it can be scrolled
 * from the keyboard.
 */
export function wrapTables(html: string): string {
  return html
    .replace(/<table(?=[\s>])/g, '<div class="table-scroll" tabindex="0"><table')
    .replace(/<\/table>/g, "</table></div>");
}

/** Everything the site does to Markdown rendered from a repository file. */
export function prepare(html: string, sourceDir: string, known: Record<string, string> = {}): string {
  return wrapTables(rewriteLinks(html, sourceDir, known));
}
