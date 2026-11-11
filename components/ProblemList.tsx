"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { DifficultyRange, MAX_DIFFICULTY, MIN_DIFFICULTY } from "@/components/DifficultyRange";
import { Stars } from "@/components/Stars";
import { TagPicker } from "@/components/TagPicker";
import type { ProblemSummary } from "@/lib/content";
import { filterProblems, type ProblemFilters } from "@/lib/filters";
import { useSolves } from "@/lib/use-solves";

// `math` is the integral pre-rendered on the server, so KaTeX stays out of this bundle.
export type ProblemItem = ProblemSummary & { math: ReactNode };

type Props = { items: ProblemItem[]; tags?: string[] };

// With `tags`, shows difficulty/tag filters and a search box, all kept in the URL
// (?min=2&max=4&tag=Symmetry&tag=Partial+Fractions&q=ln).
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
    min: Number(searchParams.get("min")) || undefined,
    max: Number(searchParams.get("max")) || undefined,
    tags: searchParams.getAll("tag"),
    query: searchParams.get("q") ?? undefined,
  };

  function onChange(next: ProblemFilters) {
    const params = new URLSearchParams();
    if (next.min && next.min > MIN_DIFFICULTY) params.set("min", String(next.min));
    if (next.max && next.max < MAX_DIFFICULTY) params.set("max", String(next.max));
    for (const tag of next.tags ?? []) params.append("tag", tag);
    if (next.query) params.set("q", next.query);
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
  // The box keeps its own text so typing stays responsive while the URL catches up.
  const [query, setQuery] = useState(filters.query ?? "");
  const shown = filterProblems(items, { ...filters, query });

  return (
    <>
      <div className="mb-3 flex flex-wrap items-start gap-x-5 gap-y-3 font-sans text-sm">
        <div className="flex items-start gap-2">
          <span className="py-1.5 text-muted">Difficulty</span>
          <div className="w-36 py-1.5">
            <DifficultyRange
              min={filters.min ?? MIN_DIFFICULTY}
              max={filters.max ?? MAX_DIFFICULTY}
              onChange={(min, max) => onChange({ ...filters, query, min, max })}
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="py-1.5 text-muted">Tags</span>
          <div className="w-64">
            <TagPicker
              tags={tags}
              selected={filters.tags ?? []}
              onChange={(selected) => onChange({ ...filters, query, tags: selected })}
            />
          </div>
        </div>
        <span className="ml-auto py-1.5 text-muted tabular-nums">
          {shown.length} {shown.length === 1 ? "problem" : "problems"}
        </span>
      </div>
      <input
        type="search"
        className="field mb-6 w-full"
        aria-label="Search problems"
        placeholder="Search by LaTeX or problem number"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange({ ...filters, query: e.target.value });
        }}
      />
      <ProblemTable items={shown} />
    </>
  );
}

type Sort = "asc" | "desc" | null;

function ProblemTable({ items }: { items: ProblemItem[] }) {
  const solves = useSolves();
  const solved = new Set(solves?.map((s) => s.problemId));
  // Clicking the Difficulty heading cycles ascending, descending, then back to the list's own order.
  const [sort, setSort] = useState<Sort>(null);

  if (items.length === 0) {
    return <p className="border-t border-border pt-6 font-sans text-sm text-muted">No problems match these filters.</p>;
  }

  // Array sort is stable, so problems of equal difficulty keep their order.
  const rows = sort
    ? [...items].sort((a, b) => (sort === "asc" ? a.difficulty - b.difficulty : b.difficulty - a.difficulty))
    : items;

  return (
    <ol className="border-t border-border">
      <li className="eyebrow grid grid-cols-[2.75rem_1fr_auto] gap-3 border-b border-border py-2">
        <span aria-hidden>No.</span>
        <span aria-hidden>Integral</span>
        <button
          className="tracking-wide uppercase transition-colors hover:text-foreground"
          title="Sort by difficulty"
          aria-label={`Sort by difficulty${sort === "asc" ? " (ascending)" : sort === "desc" ? " (descending)" : ""}`}
          onClick={() => setSort(sort === null ? "asc" : sort === "asc" ? "desc" : null)}
        >
          Difficulty{sort && <span aria-hidden> {sort === "asc" ? "↑" : "↓"}</span>}
        </button>
      </li>
      {rows.map((p) => (
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
                <span className="mt-[7px] -mb-[5px] block font-sans text-xs text-muted">{p.tags.join(", ")}</span>
              )}
            </span>
            <Stars difficulty={p.difficulty} className="font-sans text-sm text-muted" />
          </Link>
        </li>
      ))}
    </ol>
  );
}
