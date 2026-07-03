import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/types";

const PRIORITY_VARIANT: Record<Priority, "danger" | "accent" | "default"> = {
  High: "danger",
  Medium: "accent",
  Low: "default",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge variant={PRIORITY_VARIANT[priority]}>{priority} Priority</Badge>;
}

export function CategoryBadge({ category }: { category: string }) {
  return <Badge variant="outline">{category}</Badge>;
}
