"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import type { ProblemSummary } from "@/lib/content";
import { filterProblems, type ProblemFilters } from "@/lib/filters";
import { useSolves } from "@/lib/use-solves";

// `math` is the integral pre-rendered on the server, so KaTeX stays out of this bundle.
export type ProblemItem = ProblemSummary & { math: ReactNode };

type Props = { items: ProblemItem[]; tags?: string[] };

// With `tags`, shows difficulty/technique filters kept in the URL (?difficulty=3&tag=Symmetry).
export function ProblemList(props: Props) {
  if (!props.tags) return <ProblemTable items={props.items} />;
  // useSearchParams isn't known at build time; prerender the unfiltered list meanwhile.
  return (
    <Suspense fallback={<FilteredList {...props} filters={{}} onChange={() => {}} />}>
      <UrlFilteredList {...props} />
    </Suspense>
  );
}

function UrlFilteredList(props: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters: ProblemFilters = {
    difficulty: Number(searchParams.get("difficulty")) || undefined,
    tag: searchParams.get("tag") ?? undefined,
  };

  function onChange(next: ProblemFilters) {
    const params = new URLSearchParams();
    if (next.difficulty) params.set("difficulty", String(next.difficulty));
    if (next.tag) params.set("tag", next.tag);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return <FilteredList {...props} filters={filters} onChange={onChange} />;
}

function FilteredList({
  items,
  tags = [],
  filters,
  onChange,
}: Props & { filters: ProblemFilters; onChange: (f: ProblemFilters) => void }) {
  const difficulties = [...new Set(items.map((p) => p.difficulty))].sort((a, b) => a - b);
  const shown = filterProblems(items, filters);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 font-sans text-sm">
        <label className="flex items-center gap-2">
          <span className="text-muted">Difficulty</span>
          <select
            className="field"
            value={filters.difficulty ?? ""}
            onChange={(e) => onChange({ ...filters, difficulty: Number(e.target.value) || undefined })}
          >
            <option value="">Any</option>
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-muted">Technique</span>
          <select
            className="field"
            value={filters.tag ?? ""}
            onChange={(e) => onChange({ ...filters, tag: e.target.value || undefined })}
          >
            <option value="">Any</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <span className="ml-auto text-muted tabular-nums">
          {shown.length} {shown.length === 1 ? "problem" : "problems"}
        </span>
      </div>
      <ProblemTable items={shown} />
    </>
  );
}

function ProblemTable({ items }: { items: ProblemItem[] }) {
  const solves = useSolves();
  const solved = new Set(solves?.map((s) => s.problemId));

  if (items.length === 0) {
    return <p className="border-t border-border pt-6 font-sans text-sm text-muted">No problems match these filters.</p>;
  }

  return (
    <ol className="border-t border-border">
      <li className="eyebrow grid grid-cols-[2.75rem_1fr_auto] gap-3 border-b border-border py-2" aria-hidden>
        <span>No.</span>
        <span>Integral</span>
        <span>Difficulty</span>
      </li>
      {items.map((p) => (
        <li key={p.id} className="border-b border-border">
          <Link
            href={`/problems/${p.id}`}
            className="-mx-3 grid grid-cols-[2.75rem_1fr_auto] items-center gap-3 px-3 py-3 transition-colors hover:bg-subtle"
          >
            <span className="font-sans text-sm text-muted tabular-nums">
              {p.id}
              {solved.has(p.id) && (
                <span className="ml-1 text-accent" title="Solved" aria-label="solved">
                  ✓
                </span>
              )}
            </span>
            <span className="min-w-0">
              <span className="block overflow-x-auto overflow-y-hidden">{p.math}</span>
              {p.tags.length > 0 && (
                <span className="mt-0.5 block font-sans text-xs text-muted">{p.tags.join(", ")}</span>
              )}
            </span>
            <span className="font-sans text-sm text-muted tabular-nums" title={`Difficulty ${p.difficulty} of 5`}>
              {p.difficulty}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
