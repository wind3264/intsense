export type PracticeFilters = { min: number; max: number; tags: string[] };

// Difficulty within [min, max]; with tags selected, the problem carries at least one of them.
export function matchesPractice(p: { difficulty: number; tags: string[] }, { min, max, tags }: PracticeFilters) {
  return p.difficulty >= min && p.difficulty <= max && (tags.length === 0 || tags.some((t) => p.tags.includes(t)));
}

// Picks the next practice problem from the ids matching the filters. Solved and
// already-seen problems only come back once every other candidate is used up, and
// even then never the one currently on screen (unless it is the only match).
export function pickProblem(
  candidates: number[],
  exclude: Set<number>,
  current: number | null,
  random: () => number = Math.random,
): { id: number; repeat: boolean } | null {
  const fresh = candidates.filter((id) => !exclude.has(id));
  const others = candidates.filter((id) => id !== current);
  const pool = fresh.length > 0 ? fresh : others.length > 0 ? others : candidates;
  if (pool.length === 0) return null;
  return { id: pool[Math.floor(random() * pool.length)], repeat: fresh.length === 0 };
}
