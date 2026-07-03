"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { baseMarkdownComponents } from "@/components/markdown/base-components";

const STORAGE_PREFIX = "aws-saa-hub:checklist:";

function useChecklistState(slug: string) {
  const key = STORAGE_PREFIX + slug;
  const [checked, setChecked] = React.useState<boolean[]>([]);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // ignore malformed/unavailable storage
    }
  }, [key]);

  const toggle = React.useCallback(
    (index: number) => {
      setChecked((prev) => {
        const next = [...prev];
        next[index] = !next[index];
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore quota/availability errors
        }
        return next;
      });
    },
    [key]
  );

  return { checked, toggle };
}

export function RevisionChecklist({ slug, raw }: { slug: string; raw: string }) {
  const { checked, toggle } = useChecklistState(slug);
  const indexRef = React.useRef(0);
  indexRef.current = 0;

  return (
    <div className="my-5 rounded-lg border border-border bg-muted/30 px-5 py-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: { className: ["heading-anchor"], ariaLabel: "Anchor" },
              content: { type: "text", value: " #" },
            },
          ],
        ]}
        components={{
          ...baseMarkdownComponents,
          ul: ({ children }) => (
            <ul className="mb-0 ml-0 list-none space-y-1 pl-0">{children}</ul>
          ),
          li: ({ children, ...props }) => (
            <li
              className="flex items-start gap-2.5 rounded-md px-2 py-1.5 text-sm leading-relaxed text-foreground/90 hover:bg-muted/60"
              {...props}
            >
              {children}
            </li>
          ),
          input: (props) => {
            if (props.type !== "checkbox") return <input {...props} />;
            const index = indexRef.current++;
            const isChecked = checked[index] ?? false;
            return (
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(index)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-[#FF9900]"
              />
            );
          },
        }}
      >
        {raw}
      </ReactMarkdown>
    </div>
  );
}
