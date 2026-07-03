"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { OPEN_COMMAND_MENU_EVENT } from "@/components/search/command-menu";
import { formatReadingTime } from "@/lib/utils";
import type { ServiceSummary } from "@/types";

interface HeaderProps {
  services: ServiceSummary[];
  onMenuClick: () => void;
}

export function Header({ services, onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const currentService = React.useMemo(() => {
    if (!pathname.startsWith("/services/")) return null;
    const slug = pathname.split("/services/")[1];
    return services.find((s) => s.slug === slug) ?? null;
  }, [pathname, services]);

  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform ?? "");

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <nav aria-label="Breadcrumb" className="hidden min-w-0 flex-1 items-center text-sm md:flex">
        <Link
          href="/dashboard"
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        {currentService && (
          <>
            <ChevronRight className="mx-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            <span className="shrink-0 text-muted-foreground">{currentService.category}</span>
            <ChevronRight className="mx-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            <span className="truncate font-medium text-foreground">
              {currentService.title}
            </span>
          </>
        )}
      </nav>

      <div className="flex-1 md:hidden" />

      {currentService && (
        <div className="hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground lg:flex">
          <Clock className="h-3.5 w-3.5" />
          {formatReadingTime(currentService.readingTimeMinutes)}
        </div>
      )}

      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT))}
        className="flex shrink-0 items-center gap-2 rounded-md border border-border bg-muted/60 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search services…</span>
        <kbd className="ml-1 hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          {isMac ? "⌘" : "Ctrl"}K
        </kbd>
      </button>

      <ThemeToggle />
    </header>
  );
}
