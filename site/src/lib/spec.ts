import { getEntry } from "astro:content";
import { readFile } from "node:fs/promises";
import { specFile } from "./pagemd";
import type { Lang } from "./paths";

/** The specification file for `lang`, exactly as it is in the repository. */
export async function specBytes(lang: Lang): Promise<Uint8Array<ArrayBuffer>> {
  const entry = await getEntry("spec", lang);
  if (!entry?.filePath) throw new Error(`${specFile(lang)} is missing; the site reads it at build time`);
  return new Uint8Array(await readFile(entry.filePath));
}
