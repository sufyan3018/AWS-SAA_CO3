"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/providers/progress-provider";
import { useMounted } from "@/hooks/use-mounted";

export function MarkCompleteButton({ slug }: { slug: string }) {
  const { isCompleted, toggleCompleted } = useProgress();
  const mounted = useMounted();
  const active = mounted && isCompleted(slug);

  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={() => toggleCompleted(slug)}
      aria-pressed={active}
      className={active ? "bg-success text-white hover:bg-success/90" : undefined}
    >
      {active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
      {active ? "Completed" : "Mark as complete"}
    </Button>
  );
}
