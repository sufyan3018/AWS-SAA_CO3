import { Clock } from "lucide-react";
import { PriorityBadge, CategoryBadge } from "@/components/service/badges";
import { BookmarkButton } from "@/components/service/bookmark-button";
import { MarkCompleteButton } from "@/components/service/mark-complete-button";
import { formatReadingTime } from "@/lib/utils";
import type { Service } from "@/types";

export function ServiceHeader({ service }: { service: Service }) {
  return (
    <header className="mb-8 border-b border-border pb-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CategoryBadge category={service.category} />
        <PriorityBadge priority={service.priority} />
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {formatReadingTime(service.readingTimeMinutes)}
        </span>
      </div>
      <h1 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {service.title}
      </h1>
      {service.description && (
        <p className="mt-2 max-w-2xl text-muted-foreground">{service.description}</p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        <MarkCompleteButton slug={service.slug} />
        <BookmarkButton slug={service.slug} />
      </div>
    </header>
  );
}
