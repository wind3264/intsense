"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DeleteSolution } from "@/components/DeleteSolution";
import type { ProblemItem } from "@/components/ProblemList";
import { SignInPrompt } from "@/components/SignInPrompt";
import { Stars } from "@/components/Stars";
import type { ProfileView } from "@/lib/solutions";
import { useUser } from "@/lib/use-user";
import { fetchProfile } from "@/lib/user-data";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

// The signed-in user's own profile (the Profile tab).
export function OwnProfile({ items }: { items: ProblemItem[] }) {
  const user = useUser();

  if (user.status === "signed-in") return <Profile userId={user.id} items={items} />;
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Profile</h1>
      {user.status === "signed-out" && (
        <SignInPrompt>Sign in to keep track of the problems you&apos;ve solved.</SignInPrompt>
      )}
    </>
  );
}

// Anyone's profile: progress, solve history and posted solutions. Solutions can be
// deleted when the profile is the viewer's own.
export function Profile({ userId, items }: { userId: string; items: ProblemItem[] }) {
  const user = useUser();
  const own = user.status === "signed-in" && user.id === userId;
  const [profile, setProfile] = useState<ProfileView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProfile(userId)
      .then((p) => !cancelled && setProfile(p))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Something went wrong"));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!profile) {
    return (
      <>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="font-sans text-sm text-muted">{error ?? "Loading…"}</p>
      </>
    );
  }

  const byId = new Map(items.map((p) => [p.id, p]));
  const history = profile.solves.filter((s) => byId.has(s.problemId));
  const solutions = profile.solutions.filter((s) => byId.has(s.problemId));
  const solvedIds = new Set(history.map((s) => s.problemId));
  const difficulties = [...new Set(items.map((p) => p.difficulty))].sort((a, b) => a - b);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">{profile.name ?? "Anonymous"}</h1>
      <p className="mt-4 text-muted">
        {history.length} of {items.length} problems solved
      </p>
      <div className="mt-2 mb-10 h-3 rounded-full bg-subtle">
        <div
          className="h-3 rounded-full bg-accent"
          style={{ width: `${(history.length / items.length) * 100}%` }}
        />
      </div>

      <h2 className="eyebrow mb-2">By difficulty</h2>
      <table className="w-full font-sans text-sm tabular-nums">
        <tbody>
          {difficulties.map((d) => {
            const total = items.filter((p) => p.difficulty === d).length;
            const done = items.filter((p) => p.difficulty === d && solvedIds.has(p.id)).length;
            return (
              <tr key={d} className="border-b border-border first:border-t">
                <td className="w-28 py-2 text-muted">
                  <Stars difficulty={d} />
                </td>
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
          Nothing solved yet.{" "}
          {own && (
            <Link href="/" className="link">
              Start with a problem.
            </Link>
          )}
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
                  <span className="text-right font-sans text-xs text-muted">
                    <Stars difficulty={p.difficulty} className="block text-sm" />
                    {dateFormat.format(new Date(s.solvedAt))}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}

      <h2 className="eyebrow mt-12 mb-2">Solutions</h2>
      {solutions.length === 0 ? (
        <p className="border-t border-border pt-4 font-sans text-sm text-muted">No solutions posted yet.</p>
      ) : (
        <ol className="border-t border-border">
          {solutions.map((s) => {
            const p = byId.get(s.problemId)!;
            return (
              <li key={s.id} className="border-b border-border">
                <Link
                  href={`/problems/${p.id}`}
                  className="-mx-3 grid grid-cols-[2.75rem_1fr_auto] items-center gap-3 px-3 py-3 transition-colors hover:bg-subtle"
                >
                  <span className="font-sans text-sm text-muted tabular-nums">{p.id}</span>
                  <span className="min-w-0 overflow-x-auto overflow-y-hidden">{p.math}</span>
                  <span className="text-right font-sans text-xs text-muted">
                    <span className="block text-sm tabular-nums">▲ {s.votes}</span>
                    {dateFormat.format(new Date(s.createdAt))}
                  </span>
                </Link>
                {own && (
                  <div className="pb-3 text-right font-sans text-xs text-muted">
                    <DeleteSolution
                      solutionId={s.id}
                      onDeleted={() =>
                        setProfile({ ...profile, solutions: profile.solutions.filter((x) => x.id !== s.id) })
                      }
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}
