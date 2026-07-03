import Link from "next/link";
import { History, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBadge } from "@/components/service/badges";
import type { ServiceSummary } from "@/types";

export function RecentList({ services }: { services: ServiceSummary[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          Recently Opened
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {services.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            Services you open will show up here.
          </p>
        ) : (
          services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {service.title}
                </p>
                <div className="mt-0.5">
                  <CategoryBadge category={service.category} />
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
