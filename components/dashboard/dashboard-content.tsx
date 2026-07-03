"use client";

import { motion } from "framer-motion";
import { ProgressOverview } from "@/components/dashboard/progress-overview";
import { CategoryProgress } from "@/components/dashboard/category-progress";
import { ContinueLearning } from "@/components/dashboard/continue-learning";
import { RecentList } from "@/components/dashboard/recent-list";
import { CategoryGrid } from "@/components/dashboard/category-grid";
import { useProgress } from "@/components/providers/progress-provider";
import { siteConfig } from "@/config/site";
import type { CategoryGroup, ServiceSummary } from "@/types";

export function DashboardContent({
  groups,
  allServices,
}: {
  groups: CategoryGroup[];
  allServices: ServiceSummary[];
}) {
  const { completed, recent, isReady } = useProgress();

  const bySlug = new Map(allServices.map((s) => [s.slug, s]));
  const recentServices = recent.map((slug) => bySlug.get(slug)).filter(
    (s): s is ServiceSummary => Boolean(s)
  );

  const continueService = isReady
    ? (recent[0] && bySlug.get(recent[0])) ||
      allServices.find((s) => !completed.includes(s.slug)) ||
      allServices[0] ||
      null
    : null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          {siteConfig.exam}
        </p>
        <h1 className="mt-1 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Welcome back, {siteConfig.author}
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Track your progress through every service, jump back into where you left off,
          and review exam-critical notes at a glance.
        </p>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ProgressOverview completed={completed.length} total={allServices.length} />
          {continueService && <ContinueLearning service={continueService} />}
          <div>
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
              Browse by Category
            </h2>
            <CategoryGrid groups={groups} completedSlugs={completed} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <CategoryProgress groups={groups} completedSlugs={completed} />
          <RecentList services={recentServices} />
        </div>
      </div>
    </div>
  );
}
