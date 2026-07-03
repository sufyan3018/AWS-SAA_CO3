import type { Metadata } from "next";
import { FilePlus2 } from "lucide-react";
import { AddServiceForm } from "@/components/add-service/add-service-form";

export const metadata: Metadata = {
  title: "Add Service",
};

export default function AddServicePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent">
          <FilePlus2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Add a Service</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Fill in the fields, then paste your notes below — plain text is fine, no{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">---</code>{" "}
            frontmatter and no <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">#</code>{" "}
            markdown symbols required. Sections are detected by their title (e.g. &quot;Purpose&quot;,
            &quot;Common Exam Traps&quot;, &quot;Revision Checklist&quot;) wherever they appear. Paste one
            clean set of notes at a time — the file is written straight to{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">content/services/</code>.
          </p>
        </div>
      </div>

      <AddServiceForm />
    </div>
  );
}
