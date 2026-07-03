import { getAllServiceSummaries, getCategoryGroups } from "@/lib/content";
import { AppShell } from "@/components/layout/app-shell";

// Content lives on disk and can change at any time via the "Add Service"
// page — render this whole segment per-request instead of caching it at
// build time, so new/edited services show up without a rebuild.
export const dynamic = "force-dynamic";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const groups = getCategoryGroups();
  const services = getAllServiceSummaries();

  return (
    <AppShell groups={groups} services={services}>
      {children}
    </AppShell>
  );
}
