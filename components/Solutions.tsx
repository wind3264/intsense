"use client";

import { useCallback, useEffect, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { SignInPrompt } from "@/components/SignInPrompt";
import { STATIC_EXPORT } from "@/lib/mode";
import type { SolutionView } from "@/lib/solutions";
import { useUser } from "@/lib/use-user";
import { fetchSolutions, postSolution, setVote } from "@/lib/user-data";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

// `initial` is rendered at build time; the server build refreshes it (with the
// viewer's votes) on mount. The static build has no server, so it is read-only.
export function Solutions({ problemId, initial }: { problemId: number; initial: SolutionView[] }) {
  const user = useUser();
  const [solutions, setSolutions] = useState(initial);
  // Collapsed by default: solutions give the answer away.
  const [open, setOpen] = useState(false);

  const refresh = useCallback(() => fetchSolutions(problemId).then(setSolutions), [problemId]);

  useEffect(() => {
    if (STATIC_EXPORT || user.status === "loading") return;
    refresh().catch(() => {});
  }, [refresh, user.status]);

  async function toggleVote(s: SolutionView) {
    const result = await setVote(s.id, !s.voted);
    setSolutions((list) => list.map((x) => (x.id === s.id ? { ...x, ...result } : x)));
  }

  return (
    <section className="mt-16">
      <div className="flex items-baseline justify-between border-b border-border pb-2">
        <h2 className="eyebrow">
          Solutions{solutions.length > 0 && <span className="tabular-nums"> ({solutions.length})</span>}
        </h2>
        <button
          className="font-sans text-xs text-muted underline underline-offset-4 hover:text-foreground"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>
      {open && (
        <>
          {solutions.length === 0 && <p className="py-4 font-sans text-sm text-muted">No solutions yet.</p>}
          <ul>
            {solutions.map((s) => (
              <li key={s.id} className="border-b border-border py-6">
                <Markdown>{s.body}</Markdown>
                <div className="mt-4 flex items-center justify-between font-sans text-xs text-muted">
                  <span>
                    {s.author} · {dateFormat.format(new Date(s.createdAt))}
                  </span>
                  {!STATIC_EXPORT && (
                    <button
                      className={`btn px-2 py-1 text-xs ${s.voted ? "border-accent text-accent" : ""}`}
                      disabled={user.status !== "signed-in"}
                      title={user.status === "signed-in" ? (s.voted ? "Remove upvote" : "Upvote") : "Sign in to upvote"}
                      aria-pressed={s.voted}
                      onClick={() => toggleVote(s)}
                    >
                      ▲ <span className="tabular-nums">{s.votes}</span>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            {STATIC_EXPORT ? (
              <p className="font-sans text-sm text-muted">Posting solutions isn&apos;t available on this static copy of the site.</p>
            ) : user.status === "signed-out" ? (
              <SignInPrompt>Sign in to post a solution.</SignInPrompt>
            ) : user.status === "signed-in" ? (
              <SolutionForm onSubmit={async (body) => (await postSolution(problemId, body), await refresh())} />
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}

function SolutionForm({ onSubmit }: { onSubmit: (body: string) => Promise<void> }) {
  const [body, setBody] = useState("");
  const [preview, setPreview] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await onSubmit(body);
      setBody("");
      setPreview(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="eyebrow">Your solution</h3>
        <button
          type="button"
          className="font-sans text-xs text-muted underline underline-offset-4 hover:text-foreground disabled:opacity-50"
          disabled={!body.trim()}
          onClick={() => setPreview(!preview)}
        >
          {preview ? "Edit" : "Preview"}
        </button>
      </div>
      {preview ? (
        <div className="min-h-40 rounded border border-border px-3 py-2">
          <Markdown>{body}</Markdown>
        </div>
      ) : (
        <textarea
          className="field block min-h-40 w-full resize-y leading-relaxed"
          placeholder="Explain your approach. Markdown and LaTeX ($inline$, $$display$$) are supported."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      )}
      {error && <p className="mt-2 font-sans text-sm text-red-700 dark:text-red-400">{error}</p>}
      <button className="btn mt-3" type="submit" disabled={pending || !body.trim()}>
        {pending ? "Posting…" : "Post solution"}
      </button>
    </form>
  );
}
