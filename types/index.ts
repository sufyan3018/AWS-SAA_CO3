export type Priority = "High" | "Medium" | "Low";

/**
 * The category names a service's frontmatter is allowed to declare.
 * These map 1:1 to the sidebar section groupings.
 */
export type CategoryName =
  | "Identity & Security"
  | "Compute"
  | "Storage"
  | "Databases"
  | "Networking"
  | "Monitoring & Governance"
  | "Messaging & Integration"
  | "Medium Priority"
  | "Low Priority";

/** Raw frontmatter shape as authored at the top of each markdown file. */
export interface ServiceFrontmatter {
  title: string;
  slug: string;
  category: CategoryName;
  priority: Priority;
  order: number;
  description?: string;
}

/** A single heading extracted from a service's markdown content. */
export interface TocHeading {
  id: string;
  text: string;
  depth: number;
}

/** Fully parsed service, ready for rendering. */
export interface Service extends ServiceFrontmatter {
  content: string;
  readingTimeMinutes: number;
  readingTimeText: string;
  headings: TocHeading[];
}

/** Lightweight service reference used in lists, cards, and nav. */
export interface ServiceSummary extends ServiceFrontmatter {
  readingTimeMinutes: number;
}

/** Configuration describing a sidebar category group. */
export interface CategoryConfig {
  name: CategoryName;
  description: string;
  icon: string;
}

/** A category paired with its services, in display order. */
export interface CategoryGroup {
  category: CategoryName;
  services: ServiceSummary[];
}
/** Shape of data persisted to LocalStorage. */
export interface ProgressState {
  completed: string[];
  bookmarks: string[];
  recent: string[];
  lastVisited?: string;
}
