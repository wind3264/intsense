import { ProblemList } from "@/components/ProblemList";
import { TeX } from "@/components/TeX";
import { getProblems, getTagNames } from "@/lib/content";

export default async function Home() {
  const [problems, tags] = await Promise.all([getProblems(), getTagNames()]);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Problems</h1>
      <p className="mt-2 mb-8 text-muted">
        Practice for integration bees. Work each integral on paper, then reveal the answer and mark it solved.
      </p>
      <ProblemList
        items={problems.map((p) => ({ ...p, math: <TeX math={`\\displaystyle ${p.latex}`} /> }))}
        tags={tags}
      />
    </>
  );
}
