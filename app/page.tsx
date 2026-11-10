import { Practice } from "@/components/Practice";
import { TeX } from "@/components/TeX";
import { getProblems, getTagNames } from "@/lib/content";

export default async function Home() {
  const [problems, tags] = await Promise.all([getProblems(), getTagNames()]);

  return (
    <>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Practice</h1>
      <Practice items={problems.map((p) => ({ ...p, math: <TeX math={p.latex} display /> }))} tags={tags} />
    </>
  );
}
