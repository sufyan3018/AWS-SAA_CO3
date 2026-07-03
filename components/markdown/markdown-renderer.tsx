"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { splitIntoSections } from "@/lib/markdown-sections";
import { baseMarkdownComponents } from "@/components/markdown/base-components";
import { Callout } from "@/components/markdown/callout";
import { RevisionChecklist } from "@/components/markdown/revision-checklist";

const rehypePlugins = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      properties: { className: ["heading-anchor"], ariaLabel: "Anchor" },
      content: { type: "text", value: " #" },
    },
  ],
] as const;

function Section({ raw }: { raw: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rehypePlugins={rehypePlugins as any}
      components={baseMarkdownComponents}
    >
      {raw}
    </ReactMarkdown>
  );
}

export function MarkdownRenderer({ slug, content }: { slug: string; content: string }) {
  const sections = React.useMemo(() => splitIntoSections(content), [content]);

  return (
    <div className="mdx-content">
      {sections.map((section) => {
        switch (section.type) {
          case "tip":
            return (
              <Callout key={section.index} tone="tip">
                <Section raw={section.raw} />
              </Callout>
            );
          case "trap":
            return (
              <Callout key={section.index} tone="trap">
                <Section raw={section.raw} />
              </Callout>
            );
          case "checklist":
            return (
              <RevisionChecklist key={section.index} slug={slug} raw={section.raw} />
            );
          default:
            return <Section key={section.index} raw={section.raw} />;
        }
      })}
    </div>
  );
}
