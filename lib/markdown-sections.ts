export type SectionType = "intro" | "tip" | "trap" | "checklist" | "default";

export interface MarkdownSection {
  /** Index of this section within the document (0 = intro). */
  index: number;
  /** Section type, used to pick the rendering wrapper. */
  type: SectionType;
  /** The raw text of the H2 heading, e.g. "10. SAA-C03 Exam Tips". Empty for intro. */
  headingText: string;
  /** Full markdown source for this section, heading line included. */
  raw: string;
}

const H2_PATTERN = /^##\s+(.*)$/;

/**
 * Split a service's markdown body into an intro chunk (everything before the
 * first H2) followed by one chunk per "## " heading. Each chunk's raw text
 * includes its own heading line plus everything up to (not including) the
 * next H2, so H3+ subheadings stay nested inside their parent chunk.
 */
export function splitIntoSections(markdown: string): MarkdownSection[] {
  const lines = markdown.split("\n");
  const sections: MarkdownSection[] = [];

  let currentType: SectionType = "intro";
  let currentHeading = "";
  let currentLines: string[] = [];
  let index = 0;

  const flush = () => {
    const raw = currentLines.join("\n").trim();
    if (raw.length > 0) {
      sections.push({
        index,
        type: currentType,
        headingText: currentHeading,
        raw,
      });
      index += 1;
    }
  };

  for (const line of lines) {
    const match = line.match(H2_PATTERN);
    if (match) {
      flush();
      currentHeading = match[1].trim();
      currentType = classifyHeading(currentHeading);
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }
  flush();

  return sections;
}

function classifyHeading(headingText: string): SectionType {
  if (headingText.includes("Revision Checklist")) return "checklist";
  if (headingText.includes("Common Exam Trap")) return "trap";
  if (headingText.includes("Exam Tip")) return "tip";
  return "default";
}
