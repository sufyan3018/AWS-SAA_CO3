import matter from "gray-matter";
import { CATEGORY_NAMES } from "@/config/categories";
import { normalizeNotes } from "@/lib/normalize-notes";
import type { CategoryName, Priority } from "@/types";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

export interface ServiceFormFields {
  title: string;
  slug: string;
  category: string;
  priority: string;
  order: number | string;
  description?: string;
}

/** Validate the Add Service form's metadata fields (everything but the pasted notes). */
export function validateServiceFields(fields: ServiceFormFields): string[] {
  const errors: string[] = [];
  const orderNum = typeof fields.order === "number" ? fields.order : Number(fields.order);

  if (!fields.title.trim()) errors.push("Title is required.");
  if (!fields.slug.trim()) {
    errors.push("Slug is required.");
  } else if (!SLUG_PATTERN.test(fields.slug.trim())) {
    errors.push("Slug must be lowercase letters, numbers, and hyphens only (e.g. `ec2`).");
  }
  if (!fields.category) {
    errors.push("Category is required.");
  } else if (!CATEGORY_NAMES.includes(fields.category as CategoryName)) {
    errors.push("Category must be one of the predefined categories.");
  }
  if (!fields.priority) {
    errors.push("Priority is required.");
  } else if (!PRIORITIES.includes(fields.priority as Priority)) {
    errors.push("Priority must be High, Medium, or Low.");
  }
  if (fields.order === "" || fields.order === undefined || Number.isNaN(orderNum)) {
    errors.push("Order must be a number.");
  }

  return errors;
}

/** YAML-safe double-quoted scalar (handles colons, quotes, etc. in pasted titles). */
function yamlQuote(value: string): string {
  return JSON.stringify(value);
}

/**
 * Build the final, complete markdown file (frontmatter + normalized body)
 * from the form fields and the raw pasted notes.
 */
export function assembleServiceFile(
  fields: ServiceFormFields,
  notesRaw: string
): { fileContent: string; detected: string[]; missing: string[] } {
  const { markdown, detected, missing } = normalizeNotes(notesRaw);

  const frontmatterLines = [
    "---",
    `title: ${yamlQuote(fields.title.trim())}`,
    `slug: ${fields.slug.trim()}`,
    `category: ${fields.category}`,
    `priority: ${fields.priority}`,
    `order: ${typeof fields.order === "number" ? fields.order : Number(fields.order)}`,
  ];
  if (fields.description?.trim()) {
    frontmatterLines.push(`description: ${yamlQuote(fields.description.trim())}`);
  }
  frontmatterLines.push("---", "");

  return {
    fileContent: frontmatterLines.join("\n") + "\n" + markdown,
    detected,
    missing,
  };
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  parsed: {
    slug: string;
    title: string;
    category: CategoryName;
    priority: Priority;
    order: number;
    description?: string;
    content: string;
  } | null;
}

/**
 * Final, authoritative check on a fully-assembled markdown file (frontmatter
 * + body). Used server-side by the API route as defense-in-depth — the
 * content it receives should always already be well-formed since it's
 * produced by assembleServiceFile(), but this guards against direct API
 * calls that bypass the form.
 */
export function validateServiceMarkdown(raw: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!raw.trim()) {
    return { ok: false, errors: ["No content provided."], warnings, parsed: null };
  }

  let data: Record<string, unknown>;
  let content: string;
  try {
    const result = matter(raw);
    data = result.data;
    content = result.content;
  } catch {
    return {
      ok: false,
      errors: ["Couldn't parse the frontmatter block."],
      warnings,
      parsed: null,
    };
  }

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const slug = typeof data.slug === "string" ? data.slug.trim() : "";
  const category = typeof data.category === "string" ? data.category.trim() : "";
  const priority = typeof data.priority === "string" ? data.priority.trim() : "";
  const order = typeof data.order === "number" ? data.order : Number(data.order);
  const description = typeof data.description === "string" ? data.description.trim() : undefined;

  if (!title) errors.push("Frontmatter is missing `title`.");
  if (!slug || !SLUG_PATTERN.test(slug)) errors.push("Frontmatter is missing a valid `slug`.");
  if (!category || !CATEGORY_NAMES.includes(category as CategoryName)) {
    errors.push(`\`category\` must be one of: ${CATEGORY_NAMES.join(", ")}.`);
  }
  if (!priority || !PRIORITIES.includes(priority as Priority)) {
    errors.push("`priority` must be High, Medium, or Low.");
  }
  if (data.order === undefined || Number.isNaN(order)) {
    errors.push("Frontmatter is missing a numeric `order`.");
  }
  if (!content.trim()) errors.push("The document has no content below the frontmatter.");

  const { missing } = normalizeNotes(content);
  for (const missingTitle of missing) {
    warnings.push(`Missing expected section: "${missingTitle}"`);
  }

  if (errors.length > 0) {
    return { ok: false, errors, warnings, parsed: null };
  }

  return {
    ok: true,
    errors,
    warnings,
    parsed: {
      slug,
      title,
      category: category as CategoryName,
      priority: priority as Priority,
      order,
      description,
      content,
    },
  };
}
