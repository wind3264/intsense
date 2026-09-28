export type ProblemFilters = { difficulty?: number; tag?: string };

// Same semantics as GET /api/problems: exact difficulty, and the problem carries the tag.
export function filterProblems<T extends { difficulty: number; tags: string[] }>(
  problems: T[],
  { difficulty, tag }: ProblemFilters,
): T[] {
  return problems.filter(
    (p) => (!difficulty || p.difficulty === difficulty) && (!tag || p.tags.includes(tag)),
  );
}
