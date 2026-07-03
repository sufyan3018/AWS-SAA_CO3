import * as React from "react";
import type { Components } from "react-markdown";
import { CodeBlock } from "@/components/markdown/code-block";
import { cn } from "@/lib/utils";

function Heading({
  as: Tag,
  className,
  children,
  ...props
}: {
  as: "h1" | "h2" | "h3" | "h4";
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <Tag className={cn("group scroll-mt-24 font-display font-semibold", className)} {...props}>
      {children}
    </Tag>
  );
}

export const baseMarkdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <Heading as="h1" className="mb-6 mt-0 text-xl text-muted-foreground" {...props}>
      {children}
    </Heading>
  ),
  h2: ({ children, ...props }) => (
    <Heading as="h2" className="mb-3 mt-8 text-xl text-foreground sm:text-2xl" {...props}>
      {children}
    </Heading>
  ),
  h3: ({ children, ...props }) => (
    <Heading as="h3" className="mb-2 mt-6 text-lg text-foreground" {...props}>
      {children}
    </Heading>
  ),
  h4: ({ children, ...props }) => (
    <Heading as="h4" className="mb-2 mt-4 text-base text-foreground" {...props}>
      {children}
    </Heading>
  ),
  a: ({ className, children, ...props }) => {
    if (className?.includes("heading-anchor")) {
      return (
        <a
          className="ml-2 text-muted-foreground/50 no-underline opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Link to this section"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <a
        className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
        target={props.href?.startsWith("http") ? "_blank" : undefined}
        rel={props.href?.startsWith("http") ? "noreferrer noopener" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  p: ({ children, ...props }) => (
    <p className="mb-4 leading-relaxed text-foreground/90" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-4 ml-5 list-disc space-y-1.5 text-foreground/90" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-foreground/90" {...props}>
      {children}
    </ol>
  ),
  li: ({ className, children, ...props }) => (
    <li className={cn("leading-relaxed", className)} {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>
      {children}
    </strong>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-4 border-l-2 border-accent/50 pl-4 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props) => <hr className="my-8 border-border" {...props} />,
  table: ({ children, ...props }) => (
    <div className="scrollbar-thin my-5 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[480px] border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted/60" {...props}>
      {children}
    </thead>
  ),
  tr: ({ children, ...props }) => (
    <tr className="border-b border-border last:border-0" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th className="px-4 py-2.5 text-left font-semibold text-foreground" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-2.5 align-top text-foreground/85" {...props}>
      {children}
    </td>
  ),
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt ?? ""} className="my-4 rounded-lg border border-border" {...props} />
  ),
  pre: ({ children }) => {
    const child = React.isValidElement<{ className?: string; children?: React.ReactNode }>(
      children
    )
      ? children
      : null;
    return (
      <CodeBlock className={child?.props.className}>{child?.props.children}</CodeBlock>
    );
  },
  code: ({ className, children, ...props }) => (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </code>
  ),
};
