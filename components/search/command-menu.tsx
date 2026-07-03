"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getIcon } from "@/lib/icons";
import { getCategoryConfig } from "@/config/categories";
import type { ServiceSummary } from "@/types";

export const OPEN_COMMAND_MENU_EVENT = "open-command-menu";

interface CommandMenuProps {
  services: ServiceSummary[];
}

export function CommandMenu({ services }: CommandMenuProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onOpenRequest() {
      setOpen(true);
    }
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, onOpenRequest);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, onOpenRequest);
    };
  }, []);

  const goTo = (slug: string) => {
    setOpen(false);
    router.push(`/services/${slug}`);
  };

  const groupedByCategory = React.useMemo(() => {
    const map = new Map<string, ServiceSummary[]>();
    for (const service of services) {
      const list = map.get(service.category) ?? [];
      list.push(service);
      map.set(service.category, list);
    }
    return Array.from(map.entries());
  }, [services]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0">
        <Command
          className="flex flex-col"
          filter={(value, search) => {
            const needle = search.toLowerCase();
            return value.toLowerCase().includes(needle) ? 1 : 0;
          }}
        >
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              autoFocus
              placeholder="Search by service, slug, or category…"
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="scrollbar-thin max-h-80 overflow-y-auto p-2">
            <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
              No services match your search.
            </Command.Empty>
            {groupedByCategory.map(([category, items]) => {
              const config = getCategoryConfig(category);
              const Icon = getIcon(config?.icon ?? "");
              return (
                <Command.Group
                  key={category}
                  heading={category}
                  className="px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {items.map((service) => (
                    <Command.Item
                      key={service.slug}
                      value={`${service.title} ${service.slug} ${service.category}`}
                      onSelect={() => goTo(service.slug)}
                      className="group flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground data-[selected=true]:bg-accent-subtle data-[selected=true]:text-accent"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-data-[selected=true]:text-accent" />
                      <span className="flex-1 truncate">{service.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-data-[selected=true]:opacity-100" />
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
