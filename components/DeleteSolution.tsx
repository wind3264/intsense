"use client";

import { useState } from "react";
import { deleteSolution } from "@/lib/user-data";

const linkClass = "underline underline-offset-4 hover:text-foreground disabled:opacity-50";

// Two-step delete for the author of a solution: "Delete", then confirm.
export function DeleteSolution({ solutionId, onDeleted }: { solutionId: number; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setPending(true);
    setError(null);
    try {
      await deleteSolution(solutionId);
      onDeleted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPending(false);
    }
  }

  if (!confirming) {
    return (
      <button className={linkClass} onClick={() => setConfirming(true)}>
        Delete
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <span className={error ? "text-red-700 dark:text-red-400" : undefined}>{error ?? "Delete this solution?"}</span>
      <button className={linkClass} disabled={pending} onClick={remove}>
        Yes
      </button>
      <button className={linkClass} disabled={pending} onClick={() => setConfirming(false)}>
        No
      </button>
    </span>
  );
}
