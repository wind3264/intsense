import type { Metadata } from "next";
import Link from "next/link";
import { getWikiPages } from "@/lib/content";

export const metadata: Metadata = { title: "Wiki" };

export default async function WikiIndex() {
  const pages = await getWikiPages();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Techniques</h1>
      <p className="mt-2 mb-8 text-muted">
        The standard toolkit for integration bees, each with a worked example and practice problems.
      </p>
      <ul className="border-t border-border">
        {pages.map((p) => (
          <li key={p.slug} className="border-b border-border">
            <Link
              href={`/wiki/${p.slug}`}
              className="-mx-3 flex items-baseline justify-between gap-4 px-3 py-3 transition-colors hover:bg-subtle"
            >
              <span>{p.title}</span>
              <span className="font-sans text-sm text-muted tabular-nums">
                {p.problemCount} {p.problemCount === 1 ? "problem" : "problems"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
