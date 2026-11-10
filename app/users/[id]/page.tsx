import type { Metadata } from "next";
import { Profile } from "@/components/Profile";
import { TeX } from "@/components/TeX";
import { getProblems } from "@/lib/content";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Profile" };

// No user pages are built ahead of time; each is rendered on its first visit and then
// cached. The page only holds the problem list - the user's data is fetched in the browser.
export async function generateStaticParams() {
  return [];
}

export default async function UserPage({ params }: Props) {
  const [{ id }, problems] = await Promise.all([params, getProblems()]);
  return (
    <Profile userId={id} items={problems.map((p) => ({ ...p, math: <TeX math={`\\displaystyle ${p.latex}`} /> }))} />
  );
}
