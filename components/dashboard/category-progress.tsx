import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getIcon } from "@/lib/icons";
import { getCategoryConfig } from "@/config/categories";
import type { CategoryGroup } from "@/types";

export function CategoryProgress({
  groups,
  completedSlugs,
}: {
  groups: CategoryGroup[];
  completedSlugs: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {groups.map((group) => {
          const config = getCategoryConfig(group.category);
          const Icon = getIcon(config?.icon ?? "");
          const done = group.services.filter((s) => completedSlugs.includes(s.slug)).length;
          const pct = group.services.length
            ? Math.round((done / group.services.length) * 100)
            : 0;
          return (
            <div key={group.category}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  {group.category}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {done}/{group.services.length}
                </span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
