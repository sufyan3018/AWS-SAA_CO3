import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ServiceSummary } from "@/types";

export function PrevNextNav({
  prev,
  next,
}: {
  prev: ServiceSummary | null;
  next: ServiceSummary | null;
}) {
  if (!prev && !next) return null;

  return (
    <div className="mt-10 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2">
      {prev ? (
        <Link
          href={`/services/${prev.slug}`}
          className="group flex flex-col rounded-lg border border-border p-4 transition-colors hover:border-accent/40 hover:bg-muted/40"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Previous
          </span>
          <span className="mt-1 font-medium text-foreground group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/services/${next.slug}`}
          className="group flex flex-col rounded-lg border border-border p-4 text-right transition-colors hover:border-accent/40 hover:bg-muted/40 sm:items-end"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Next
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="mt-1 font-medium text-foreground group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
