"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getIcon } from "@/lib/icons";
import { getCategoryConfig } from "@/config/categories";
import type { CategoryGroup } from "@/types";

export function CategoryGrid({
  groups,
  completedSlugs,
}: {
  groups: CategoryGroup[];
  completedSlugs: string[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group, i) => {
        const config = getCategoryConfig(group.category);
        const Icon = getIcon(config?.icon ?? "");
        const done = group.services.filter((s) => completedSlugs.includes(s.slug)).length;
        const pct = group.services.length
          ? Math.round((done / group.services.length) * 100)
          : 0;
        const firstSlug = group.services[0]?.slug;

        return (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.03, ease: "easeOut" }}
          >
            <Link href={firstSlug ? `/services/${firstSlug}` : "/dashboard"}>
              <Card className="group h-full transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-elevated">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-subtle text-accent">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {group.category}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground">
                    {config?.description}
                  </p>
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{group.services.length} services</span>
                      <span className="tabular-nums">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
