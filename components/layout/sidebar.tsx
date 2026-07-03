"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, LayoutDashboard, Boxes, FilePlus2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { getCategoryConfig } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { useProgress } from "@/components/providers/progress-provider";
import { useMounted } from "@/hooks/use-mounted";
import type { CategoryGroup } from "@/types";

interface SidebarProps {
  groups: CategoryGroup[];
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ groups, className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const mounted = useMounted();
  const { isCompleted } = useProgress();

  const activeCategory = React.useMemo(() => {
    if (!pathname.startsWith("/services/")) return null;
    const slug = pathname.split("/services/")[1];
    for (const group of groups) {
      if (group.services.some((s) => s.slug === slug)) return group.category;
    }
    return null;
  }, [pathname, groups]);

  const [openCategories, setOpenCategories] = React.useState<Set<string>>(
    () => new Set(groups.map((g) => g.category))
  );

  React.useEffect(() => {
    if (activeCategory) {
      setOpenCategories((prev) => new Set(prev).add(activeCategory));
    }
  }, [activeCategory]);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <nav
      className={cn(
        "flex h-full w-full flex-col bg-card lg:border-r lg:border-border",
        className
      )}
      aria-label="Service categories"
    >
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Boxes className="h-4.5 w-4.5" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold leading-tight">
            {siteConfig.shortName}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">SAA-C03</p>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={cn(
            "mb-1 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/dashboard"
              ? "bg-accent-subtle text-accent"
              : "text-foreground hover:bg-muted"
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <Link
          href="/add-service"
          onClick={onNavigate}
          className={cn(
            "mb-4 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/add-service"
              ? "bg-accent-subtle text-accent"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <FilePlus2 className="h-4 w-4" />
          Add Service
        </Link>

        <div className="flex flex-col gap-1">
          {groups.map((group) => {
            const config = getCategoryConfig(group.category);
            const Icon = getIcon(config?.icon ?? "");
            const isOpen = openCategories.has(group.category);
            const completedInCategory = mounted
              ? group.services.filter((s) => isCompleted(s.slug)).length
              : 0;

            return (
              <div key={group.category}>
                <button
                  type="button"
                  onClick={() => toggleCategory(group.category)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-expanded={isOpen}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 truncate">{group.category}</span>
                  <span className="text-[10px] font-normal tabular-nums text-muted-foreground/70">
                    {mounted ? `${completedInCategory}/${group.services.length}` : ""}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                      isOpen ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <ul className="ml-2 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3">
                        {group.services.map((service) => {
                          const isActive = pathname === `/services/${service.slug}`;
                          const done = mounted && isCompleted(service.slug);
                          return (
                            <li key={service.slug}>
                              <Link
                                href={`/services/${service.slug}`}
                                onClick={onNavigate}
                                className={cn(
                                  "group flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                                  isActive
                                    ? "bg-accent-subtle font-medium text-accent"
                                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                                )}
                              >
                                <span className="min-w-0 flex-1 truncate">
                                  {service.title}
                                </span>
                                {done && (
                                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
