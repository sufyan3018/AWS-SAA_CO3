import type { Metadata } from "next";
import { getAllServiceSummaries, getCategoryGroups } from "@/lib/content";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  const groups = getCategoryGroups();
  const allServices = getAllServiceSummaries();

  return <DashboardContent groups={groups} allServices={allServices} />;
}
