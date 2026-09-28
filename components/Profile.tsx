"use client";

import Link from "next/link";
import type { ProblemItem } from "@/components/ProblemList";
import { SignInPrompt } from "@/components/SignInPrompt";
import { useSolves } from "@/lib/use-solves";
import { useUser } from "@/lib/use-user";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export function Profile({ items }: { items: ProblemItem[] }) {
  const user = useUser();
  const solves = useSolves();

  if (user.status === "signed-out") {
    return (
      <>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Profile</h1>
        <SignInPrompt>Sign in to keep track of the problems you&apos;ve solved.</SignInPrompt>
      </>
    );
  }

  const byId = new Map(items.map((p) => [p.id, p]));
  const history = (solves ?? []).filter((s) => byId.has(s.problemId));
  const solvedIds = new Set(history.map((s) => s.problemId));
  const difficulties = [...new Set(items.map((p) => p.difficulty))].sort((a, b) => a - b);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">
        {user.status === "signed-in" && user.name ? user.name : "Your progress"}
      </h1>
      <p className="mt-2 mb-10 text-muted">
        {solves === null ? (
          "Loading…"
        ) : (
          <>
            {history.length} of {items.length} problems solved.
            {user.status === "local" && " Progress is saved in this browser."}
          </>
        )}
      </p>

      <h2 className="eyebrow mb-2">By difficulty</h2>
      <table className="w-full font-sans text-sm tabular-nums">
        <tbody>
          {difficulties.map((d) => {
            const total = items.filter((p) => p.difficulty === d).length;
            const done = items.filter((p) => p.difficulty === d && solvedIds.has(p.id)).length;
            return (
              <tr key={d} className="border-b border-border first:border-t">
                <td className="w-28 py-2 text-muted">Difficulty {d}</td>
                <td className="py-2 pr-4">
                  <div className="h-1 rounded-full bg-subtle">
                    <div className="h-1 rounded-full bg-accent" style={{ width: `${(done / total) * 100}%` }} />
                  </div>
                </td>
                <td className="w-16 py-2 text-right text-muted">
                  {done}/{total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 className="eyebrow mt-12 mb-2">History</h2>
      {history.length === 0 ? (
        <p className="border-t border-border pt-4 font-sans text-sm text-muted">
          Nothing solved yet. <Link href="/" className="link">Start with a problem.</Link>
        </p>
      ) : (
        <ol className="border-t border-border">
          {history.map((s) => {
            const p = byId.get(s.problemId)!;
            return (
              <li key={s.problemId} className="border-b border-border">
                <Link
                  href={`/problems/${p.id}`}
                  className="-mx-3 grid grid-cols-[2.75rem_1fr_auto] items-center gap-3 px-3 py-3 transition-colors hover:bg-subtle"
                >
                  <span className="font-sans text-sm text-muted tabular-nums">{p.id}</span>
                  <span className="min-w-0 overflow-x-auto overflow-y-hidden">{p.math}</span>
                  <span className="font-sans text-xs text-muted">{dateFormat.format(new Date(s.solvedAt))}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}
