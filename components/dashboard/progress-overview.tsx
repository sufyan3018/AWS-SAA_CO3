import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export function ProgressOverview({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Trophy className="h-3.5 w-3.5 text-accent" />
              Overall Progress
            </p>
            <p className="mt-2 font-display text-3xl font-bold text-foreground">
              {pct}%
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {completed} / {total} services
          </p>
        </div>
        <Progress value={pct} />
      </CardContent>
    </Card>
  );
}
