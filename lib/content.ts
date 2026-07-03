import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { siteConfig } from "@/config/site";
import { CATEGORY_NAMES } from "@/config/categories";
import { extractToc } from "@/lib/toc";
import { formatReadingTime } from "@/lib/utils";
import type { CategoryGroup, Service, ServiceFrontmatter, ServiceSummary } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), siteConfig.contentDir);

function readServiceFile(fileName: string): Service {
  const fullPath = path.join(CONTENT_DIR, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const frontmatter = data as ServiceFrontmatter;
  const stats = readingTime(content);

  return {
    ...frontmatter,
    content,
    readingTimeMinutes: stats.minutes,
    readingTimeText: formatReadingTime(stats.minutes),
    headings: extractToc(content),
  };
}

/** Every markdown filename in the content directory, unsorted. */
function getServiceFileNames(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
}

/** Fully parsed list of every service, sorted by category then order. */
export function getAllServices(): Service[] {
  const services = getServiceFileNames().map(readServiceFile);
  return sortServices(services);
}

/** Lightweight summaries (no content/headings) for lists, cards, nav, search. */
export function getAllServiceSummaries(): ServiceSummary[] {
  return getAllServices().map(toSummary);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return getAllServices().find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return getAllServices().map((s) => s.slug);
}

export function getServicesByCategory(category: string): ServiceSummary[] {
  return getAllServiceSummaries().filter((s) => s.category === category);
}

/** Flattened category → services map, in canonical category order. */
export function getServicesGroupedByCategory(): Map<string, ServiceSummary[]> {
  const all = getAllServiceSummaries();
  const grouped = new Map<string, ServiceSummary[]>();
  for (const name of CATEGORY_NAMES) {
    const services = all.filter((s) => s.category === name);
    if (services.length > 0) grouped.set(name, services);
  }
  return grouped;
}

/**
 * Previous/next service in the flattened reading order (category order,
 * then per-service `order` within that category).
 */
export function getAdjacentServices(slug: string): {
  prev: ServiceSummary | null;
  next: ServiceSummary | null;
} {
  const flat = getAllServiceSummaries();
  const currentIndex = flat.findIndex((s) => s.slug === slug);
  if (currentIndex === -1) return { prev: null, next: null };

  return {
    prev: currentIndex > 0 ? flat[currentIndex - 1] : null,
    next: currentIndex < flat.length - 1 ? flat[currentIndex + 1] : null,
  };
}

/** Category groups (as a plain array, ready for client-component props). */
export function getCategoryGroups(): CategoryGroup[] {
  const grouped = getServicesGroupedByCategory();
  return Array.from(grouped.entries()).map(([category, services]) => ({
    category: category as CategoryGroup["category"],
    services,
  }));
}

function toSummary(service: Service): ServiceSummary {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content: _content, headings: _headings, ...summary } = service;
  return summary;
}

function sortServices(services: Service[]): Service[] {
  const categoryIndex = new Map(CATEGORY_NAMES.map((name, i) => [name, i]));
  return [...services].sort((a, b) => {
    const catA = categoryIndex.get(a.category) ?? 999;
    const catB = categoryIndex.get(b.category) ?? 999;
    if (catA !== catB) return catA - catB;
    return a.order - b.order;
  });
}
