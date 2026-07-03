"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/providers/progress-provider";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

export function BookmarkButton({ slug }: { slug: string }) {
  const { isBookmarked, toggleBookmark } = useProgress();
  const mounted = useMounted();
  const active = mounted && isBookmarked(slug);

  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={() => toggleBookmark(slug)}
      aria-pressed={active}
    >
      <Bookmark className={cn("h-3.5 w-3.5", active && "fill-current")} />
      {active ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
