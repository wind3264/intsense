import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { ProblemList } from "@/components/ProblemList";
import { TeX } from "@/components/TeX";
import { getWikiPage, getWikiPages } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getWikiPages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getWikiPage((await params).slug);
  return { title: page?.title };
}

export default async function WikiPage({ params }: Props) {
  const page = await getWikiPage((await params).slug);
  if (!page) notFound();

  return (
    <article>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{page.title}</h1>
      <Markdown>{page.body}</Markdown>
      {page.problems.length > 0 && (
        <section className="mt-16">
          <h2 className="eyebrow mb-3">Practice</h2>
          <ProblemList items={page.problems.map((p) => ({ ...p, math: <TeX math={`\\displaystyle ${p.latex}`} /> }))} />
        </section>
      )}
    </article>
  );
}
