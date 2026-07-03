import GithubSlugger from "github-slugger";
import type { TocHeading } from "@/types";
import { splitIntoSections } from "@/lib/markdown-sections";

const HEADING_PATTERN = /^(#{2,3})\s+(.*)$/;

/**
 * Build the sticky table-of-contents list for a service's markdown body.
 *
 * The renderer (components/markdown/markdown-renderer.tsx) processes each
 * H2-bounded section through its own react-markdown + rehype-slug pipeline,
 * which means each section gets a *fresh* slugger instance. To guarantee the
 * ids we generate here exactly match the ids that end up in the DOM, we
 * replicate that boundary: a new GithubSlugger per section, applied in
 * document order to every H2/H3 inside it.
 */
export function extractToc(markdown: string): TocHeading[] {
  const sections = splitIntoSections(markdown);
  const headings: TocHeading[] = [];

  for (const section of sections) {
    if (section.type === "intro") continue;

    const slugger = new GithubSlugger();
    const lines = section.raw.split("\n");

    for (const line of lines) {
      const match = line.match(HEADING_PATTERN);
      if (!match) continue;
      const depth = match[1].length;
      const text = match[2].trim();
      const id = slugger.slug(text);
      headings.push({ id, text, depth });
    }
  }

  return headings;
}
