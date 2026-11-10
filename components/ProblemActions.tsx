"use client";

import { useState } from "react";
import { TeX } from "@/components/TeX";
import { SignInPrompt } from "@/components/SignInPrompt";
import { useUser } from "@/lib/use-user";
import { useSolves } from "@/lib/use-solves";
import { fetchAnswer, setSolved } from "@/lib/user-data";

// Reveal and mark-solved are deliberately independent: the user checks their own
// work against the answer and reports the result themselves. Anyone can reveal;
// marking solved needs an account. The practice page reveals answers in its own
// drop-down, so it passes `reveal={false}`.
export function ProblemActions({ problemId, reveal = true }: { problemId: number; reveal?: boolean }) {
  const user = useUser();
  const solves = useSolves();
  const [answer, setAnswer] = useState<string | null>(null);
  const [solvedOverride, setSolvedOverride] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const solved = solvedOverride ?? solves?.some((s) => s.problemId === problemId) ?? null;
  const ready = user.status === "signed-in" && solved !== null && !pending;

  async function run(action: () => Promise<void>) {
    setPending(true);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="font-sans text-sm">
      <div className="flex flex-wrap items-center gap-3">
        {reveal && (
          <button
            className="btn"
            disabled={pending || answer !== null}
            onClick={() => run(async () => setAnswer(await fetchAnswer(problemId)))}
          >
            Reveal answer
          </button>
        )}
        {user.status === "signed-out" ? (
          <SignInPrompt>Sign in to keep track of what you&apos;ve solved.</SignInPrompt>
        ) : solved ? (
          <span className="flex items-center gap-3">
            <span className="text-accent">✓ Solved</span>
            <button
              className="text-muted underline underline-offset-4 hover:text-foreground disabled:opacity-50"
              disabled={!ready}
              onClick={() => run(async () => (await setSolved(problemId, false), setSolvedOverride(false)))}
            >
              Undo
            </button>
          </span>
        ) : (
          <button
            className="btn"
            disabled={!ready}
            onClick={() => run(async () => (await setSolved(problemId, true), setSolvedOverride(true)))}
          >
            Mark solved
          </button>
        )}
      </div>
      {error && <p className="mt-3 text-red-700 dark:text-red-400">{error}</p>}
      {answer !== null && (
        <div className="mt-5 border-l-2 border-border py-1 pl-4">
          <div className="eyebrow">Answer</div>
          <div className="mt-1 font-serif text-lg answer-math">
            <TeX math={answer} display />
          </div>
        </div>
      )}
    </div>
  );
}
