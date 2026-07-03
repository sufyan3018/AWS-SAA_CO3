"use client";

import { useEffect } from "react";
import { useProgress } from "@/components/providers/progress-provider";

export function RecordVisit({ slug }: { slug: string }) {
  const { visitService, isReady } = useProgress();

  useEffect(() => {
    if (isReady) visitService(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, isReady]);

  return null;
}
