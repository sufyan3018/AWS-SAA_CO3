export interface CanonicalSection {
  key: string;
  /** null for Revision Checklist, which has no number. */
  number: number | null;
  title: string;
  /** Lowercase strings a cleaned heading line is matched against. */
  aliases: string[];
}

export const CANONICAL_SECTIONS: CanonicalSection[] = [
  { key: "purpose", number: 1, title: "Purpose", aliases: ["purpose"] },
  { key: "how-it-works", number: 2, title: "How It Works", aliases: ["how it works"] },
  { key: "architecture", number: 3, title: "Architecture", aliases: ["architecture"] },
  { key: "key-features", number: 4, title: "Key Features", aliases: ["key features"] },
  { key: "when-to-use", number: 5, title: "When to Use It", aliases: ["when to use it"] },
  {
    key: "when-not-to-use",
    number: 6,
    title: "When NOT to Use It",
    aliases: ["when not to use it"],
  },
  {
    key: "comparison",
    number: 7,
    title: "Comparison with Similar Services",
    aliases: ["comparison with similar services", "comparison"],
  },
  {
    key: "real-world-example",
    number: 8,
    title: "Real World Example",
    aliases: ["real-world example", "real world example"],
  },
  { key: "pricing", number: 9, title: "Pricing Basics", aliases: ["pricing basics", "pricing"] },
  {
    key: "exam-tips",
    number: 10,
    title: "SAA-C03 Exam Tips",
    aliases: ["saa-c03 exam tips", "exam tips"],
  },
  {
    key: "exam-traps",
    number: 11,
    title: "Common Exam Traps",
    aliases: ["common exam traps", "exam traps"],
  },
  {
    key: "exam-scenarios",
    number: 12,
    title: "Frequently Asked Exam Scenarios",
    aliases: ["frequently asked exam scenarios", "exam scenarios", "faq"],
  },
  { key: "summary", number: 13, title: "Summary", aliases: ["summary"] },
  {
    key: "checklist",
    number: null,
    title: "Revision Checklist",
    aliases: ["revision checklist", "checklist"],
  },
];

const MAX_HEADING_LENGTH = 60;
const DECORATIVE_CHARS = /[⭐✅❌📌🔑🎯💡🧠🔥]/g;

function cleanCandidate(line: string): string {
  let s = line.trim();
  s = s.replace(/^#{1,6}\s*/, "");
  s = s.replace(/^[-*•▪◦]\s+/, "");
  s = s.replace(/^\d+[.)]\s*/, "");
  s = s.replace(DECORATIVE_CHARS, "");
  return s.trim();
}

function matchCanonical(cleaned: string): CanonicalSection | null {
  if (!cleaned || cleaned.length > MAX_HEADING_LENGTH) return null;
  const lower = cleaned.toLowerCase();
  for (const section of CANONICAL_SECTIONS) {
    for (const alias of section.aliases) {
      if (lower === alias || lower.startsWith(alias)) return section;
    }
  }
  return null;
}

function isExplicitHeadingLine(line: string): boolean {
  return /^#{1,6}\s+\S/.test(line.trim());
}

function isTaskListLine(line: string): boolean {
  return /^[-*+]\s*\[[ xX]\]\s+/.test(line.trim());
}

function stripBulletGlyphs(line: string): string {
  return line.trim().replace(/^[-*•▪◦\u2610\u2611\u25A1\u2022]+\s*/, "");
}

export interface NormalizeResult {
  /** Clean markdown body, ready to be appended below frontmatter. */
  markdown: string;
  /** Canonical section titles that had content detected. */
  detected: string[];
  /** Canonical section titles with no detected content. */
  missing: string[];
}

/**
 * Turn loosely-formatted pasted notes — no YAML frontmatter, headings that
 * may or may not use "#"/"##", any numbering scheme, decorative emoji — into
 * the canonical "## N. Title" markdown structure the renderer expects.
 *
 * Content before the first recognized section is dropped (title/description
 * come from the Add Service form fields instead). Lines under "Revision
 * Checklist" are normalized into GFM task-list syntax (`- [ ] ...`).
 */
export function normalizeNotes(raw: string): NormalizeResult {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const buffers = new Map<string, string[]>();
  let current: CanonicalSection | null = null;

  for (const rawLine of lines) {
    const cleaned = cleanCandidate(rawLine);
    const match = matchCanonical(cleaned);

    if (match) {
      current = match;
      if (!buffers.has(match.key)) buffers.set(match.key, []);
      continue;
    }

    if (!current) continue;

    if (isExplicitHeadingLine(rawLine)) {
      buffers.get(current.key)!.push(`### ${cleaned}`, "");
      continue;
    }

    const buf = buffers.get(current.key)!;
    if (current.key === "checklist" && rawLine.trim().length > 0) {
      if (isTaskListLine(rawLine)) {
        buf.push(rawLine.trim().replace(/^[-*+]/, "-"));
      } else {
        buf.push(`- [ ] ${stripBulletGlyphs(rawLine)}`);
      }
    } else {
      buf.push(rawLine);
    }
  }

  const detected: string[] = [];
  const missing: string[] = [];
  const parts: string[] = ["# AWS SAA Notes", ""];

  for (const section of CANONICAL_SECTIONS) {
    const heading = section.number
      ? `## ${section.number}. ${section.title}`
      : `## ${section.title}`;
    const buf = buffers.get(section.key);
    const hasContent = Boolean(buf && buf.some((l) => l.trim().length > 0));

    if (hasContent) {
      detected.push(section.title);
      parts.push(heading, "", buf!.join("\n").trim(), "");
    } else {
      missing.push(section.title);
    }
  }

  return { markdown: parts.join("\n").trim() + "\n", detected, missing };
}
