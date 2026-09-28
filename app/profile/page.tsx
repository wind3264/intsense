import type { Metadata } from "next";
import { Profile } from "@/components/Profile";
import { TeX } from "@/components/TeX";
import { getProblems } from "@/lib/content";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const problems = await getProblems();
  return <Profile items={problems.map((p) => ({ ...p, math: <TeX math={`\\displaystyle ${p.latex}`} /> }))} />;
}
