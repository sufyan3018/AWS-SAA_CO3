import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ServiceSummary } from "@/types";

export function ContinueLearning({ service }: { service: ServiceSummary | null }) {
  if (!service) return null;

  return (
    <Card className="overflow-hidden border-accent/30 bg-gradient-to-br from-accent-subtle to-transparent">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <PlayCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Continue Learning
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-foreground">
              {service.title}
            </p>
            <p className="text-sm text-muted-foreground">{service.category}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/services/${service.slug}`}>
            Resume
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
