import * as React from "react";
import { Lightbulb, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutTone = "tip" | "trap";

const TONE_STYLES: Record<
  CalloutTone,
  { border: string; bg: string; icon: string; label: string; Icon: typeof Lightbulb }
> = {
  tip: {
    border: "border-info/30",
    bg: "bg-info-subtle",
    icon: "text-info",
    label: "Exam Tip",
    Icon: Lightbulb,
  },
  trap: {
    border: "border-danger/30",
    bg: "bg-danger-subtle",
    icon: "text-danger",
    label: "Common Exam Trap",
    Icon: TriangleAlert,
  },
};

export function Callout({
  tone,
  children,
}: {
  tone: CalloutTone;
  children: React.ReactNode;
}) {
  const styles = TONE_STYLES[tone];
  const Icon = styles.Icon;

  return (
    <div
      className={cn(
        "my-4 rounded-lg border px-5 py-4",
        styles.border,
        styles.bg
      )}
    >
      <div className={cn("mb-2 flex items-center gap-2 text-sm font-semibold", styles.icon)}>
        <Icon className="h-4 w-4" />
        {styles.label}
      </div>
      <div className="callout-body text-sm leading-relaxed text-foreground/90 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
