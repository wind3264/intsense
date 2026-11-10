"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ProblemActions } from "@/components/ProblemActions";
import { Solutions } from "@/components/Solutions";
import { TagPicker } from "@/components/TagPicker";
import { TeX } from "@/components/TeX";
import type { ProblemSummary } from "@/lib/content";
import { matchesPractice, pickProblem, type PracticeFilters } from "@/lib/practice";
import { useSolves } from "@/lib/use-solves";
import { fetchAnswer } from "@/lib/user-data";

// `math` is the integral pre-rendered on the server.
export type PracticeItem = ProblemSummary & { math: ReactNode };

const MIN = 1;
const MAX = 5;

// Serves one random problem at a time from the ones matching the filters.
export function Practice({ items, tags }: { items: PracticeItem[]; tags: string[] }) {
  const solves = useSolves();
  const [filters, setFilters] = useState<PracticeFilters>({ min: MIN, max: MAX, tags: [] });
  // Problems already served this visit; together with the user's solves they are not served again.
  const [seen, setSeen] = useState<number[]>([]);
  const [current, setCurrent] = useState<{ id: number; repeat: boolean } | null>(null);

  const candidates = items.filter((p) => matchesPractice(p, filters));
  const problem = current && items.find((p) => p.id === current.id);

  function go() {
    const exclude = new Set([...seen, ...(solves ?? []).map((s) => s.problemId)]);
    const pick = pickProblem(
      candidates.map((p) => p.id),
      exclude,
      current?.id ?? null,
    );
    setCurrent(pick);
    // Once everything has been served, start the cycle over.
    if (pick) setSeen(pick.repeat ? [pick.id] : [...seen, pick.id]);
  }

  return (
    <>
      <div className="font-sans text-sm">
        <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          <div>
            <div className="eyebrow mb-2">Difficulty</div>
            <DifficultyRange
              min={filters.min}
              max={filters.max}
              onChange={(min, max) => setFilters({ ...filters, min, max })}
            />
          </div>
          <div>
            <div className="eyebrow mb-2">Tags</div>
            <TagPicker tags={tags} selected={filters.tags} onChange={(selected) => setFilters({ ...filters, tags: selected })} />
          </div>
        </div>
        <button
          className="mt-6 w-full cursor-pointer rounded bg-accent py-2.5 font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
          disabled={candidates.length === 0}
          onClick={go}
        >
          Go!
        </button>
        <p className="mt-2 text-center text-xs text-muted tabular-nums">
          {candidates.length === 0
            ? "No problems match these filters."
            : `${candidates.length} matching ${candidates.length === 1 ? "problem" : "problems"}`}
        </p>
      </div>

      {problem && (
        // Keyed so the answer box closes and resets whenever a new problem is served.
        <article key={problem.id} className="mt-10 border-t border-border pt-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">
              <Link href={`/problems/${problem.id}`} className="link">
                Problem {problem.id}
              </Link>
            </h2>
            <span className="font-sans text-sm text-muted">Difficulty {problem.difficulty} of 5</span>
          </div>
          {problem.tags.length > 0 && <p className="mt-1 font-sans text-sm text-muted">{problem.tags.join(", ")}</p>}
          {current.repeat && (
            <p className="mt-3 font-sans text-sm text-muted">
              You&apos;ve been through every matching problem, so they are coming around again.
            </p>
          )}

          <div className="my-10 text-xl">{problem.math}</div>

          <ProblemActions problemId={problem.id} reveal={false} />
          <AnswerBox problemId={problem.id} />
        </article>
      )}
    </>
  );
}

// Two overlaid native sliders make one two-thumb range; dragging a thumb past the other pushes it along.
function DifficultyRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const percent = (value: number) => `${((value - MIN) / (MAX - MIN)) * 100}%`;

  return (
    <>
      <div className="range relative h-5">
        {/* Inset by half a thumb so the track's ends line up with the thumbs' centers. */}
        <div className="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border">
          <div
            className="absolute inset-y-0 rounded-full bg-accent"
            style={{ left: percent(min), right: `calc(100% - ${percent(max)})` }}
          />
        </div>
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={min}
          aria-label="Minimum difficulty"
          onChange={(e) => onChange(Number(e.target.value), Math.max(max, Number(e.target.value)))}
        />
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={max}
          aria-label="Maximum difficulty"
          onChange={(e) => onChange(Math.min(min, Number(e.target.value)), Number(e.target.value))}
        />
      </div>
      <div className="mt-1 text-center text-muted tabular-nums">{min === max ? min : `${min} - ${max}`}</div>
    </>
  );
}

// Closed until clicked: holds the answer and the solutions people have posted.
function AnswerBox({ problemId }: { problemId: number }) {
  const [open, setOpen] = useState(false);
  // The contents load on first open and stay mounted after that.
  const [opened, setOpened] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!opened || answer !== null) return;
    fetchAnswer(problemId)
      .then(setAnswer)
      .catch((e) => setError(e instanceof Error ? e.message : "Something went wrong"));
  }, [opened, answer, problemId]);

  return (
    <section className="mt-8 rounded border border-border">
      <button
        className="flex w-full items-center justify-between px-4 py-3 font-sans text-sm font-semibold transition-colors hover:bg-subtle"
        aria-expanded={open}
        onClick={() => {
          setOpen(!open);
          setOpened(true);
        }}
      >
        Reveal answer
        <svg
          className={`size-4 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M3.5 6l4.5 4.5L12.5 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {/* Animating grid rows from 0fr to 1fr slides the contents down from under the button. */}
      <div className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden" inert={!open}>
          {opened && (
            <div className="border-t border-border px-4 pt-5 pb-6">
              <div className="eyebrow">Answer</div>
              <div className="answer-math mt-1 mb-8 text-lg">
                {answer !== null ? (
                  <TeX math={answer} display />
                ) : (
                  <p className="font-sans text-sm text-muted">{error ?? "Loading…"}</p>
                )}
              </div>
              <Solutions problemId={problemId} collapsible={false} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
