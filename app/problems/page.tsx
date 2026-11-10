import type { Metadata } from "next";
import { ProblemList } from "@/components/ProblemList";
import { TeX } from "@/components/TeX";
import { getProblems, getTagNames } from "@/lib/content";

export const metadata: Metadata = { title: "All Problems" };

export default async function AllProblems() {
  const [problems, tags] = await Promise.all([getProblems(), getTagNames()]);

  return (
    <>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">All Problems</h1>
      <ProblemList
        items={problems.map((p) => ({ ...p, math: <TeX math={`\\displaystyle ${p.latex}`} /> }))}
        tags={tags}
      />
    </>
  );
}
