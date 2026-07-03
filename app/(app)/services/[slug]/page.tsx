import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdjacentServices, getServiceBySlug } from "@/lib/content";
import { ServiceHeader } from "@/components/service/service-header";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { TableOfContents } from "@/components/toc/table-of-contents";
import { PrevNextNav } from "@/components/service/prev-next-nav";
import { RecordVisit } from "@/components/service/record-visit";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description ?? `${service.title} — AWS SAA-C03 exam notes.`,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const { prev, next } = getAdjacentServices(slug);

  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-6 py-10 sm:px-8">
      <article className="min-w-0 flex-1 xl:max-w-3xl">
        <RecordVisit slug={service.slug} />
        <ServiceHeader service={service} />
        <MarkdownRenderer slug={service.slug} content={service.content} />
        <PrevNextNav prev={prev} next={next} />
      </article>

      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="sticky top-24">
          <TableOfContents headings={service.headings} />
        </div>
      </aside>
    </div>
  );
}
