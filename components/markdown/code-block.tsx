"use client";

import * as React from "react";
import { Check, Copy, Network } from "lucide-react";
import { cn } from "@/lib/utils";

const DIAGRAM_LANGUAGES = new Set(["", "text", "plaintext", "ascii", "diagram"]);

interface CodeBlockProps {
  className?: string;
  children: React.ReactNode;
}

export function CodeBlock({ className, children }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const raw = String(children).replace(/\n$/, "");
  const languageMatch = /language-(\w+)/.exec(className ?? "");
  const language = (languageMatch?.[1] ?? "").toLowerCase();
  const isDiagram = DIAGRAM_LANGUAGES.has(language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API may be unavailable — fail silently.
    }
  };

  return (
    <div
      className={cn(
        "group relative my-5 overflow-hidden rounded-lg border",
        isDiagram
          ? "border-border bg-muted/40 bg-grid"
          : "border-border bg-[hsl(222,25%,9%)] dark:bg-[hsl(222,28%,5%)]"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b px-4 py-2 text-[11px] font-medium",
          isDiagram
            ? "border-border text-muted-foreground"
            : "border-white/10 text-white/50"
        )}
      >
        <span className="flex items-center gap-1.5 font-mono uppercase tracking-wide">
          {isDiagram && <Network className="h-3 w-3" />}
          {isDiagram ? "Architecture" : language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1 rounded px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100",
            isDiagram ? "hover:bg-muted" : "hover:bg-white/10"
          )}
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className={cn(
          "scrollbar-thin overflow-x-auto p-4 font-mono text-[13px] leading-relaxed",
          isDiagram ? "text-foreground/80" : "text-white/90"
        )}
      >
        <code>{raw}</code>
      </pre>
    </div>
  );
}
