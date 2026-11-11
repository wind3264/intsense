export type ProblemFilters = { min?: number; max?: number; tags?: string[]; query?: string };

// Makes LaTeX searchable the way people type it: case, spacing, backslashes and braces
// don't matter, so "ln x" finds "\ln x" and "e^x" finds "e^{x}".
function normalize(latex: string) {
  return latex
    .toLowerCase()
    .replace(/\\(left|right|,)/g, "")
    .replace(/[\s\\{}]/g, "");
}

// Difficulty within [min, max] (either bound optional); with tags selected, the problem carries
// at least one of them. `query` matches the problem number exactly or any part of the LaTeX;
// a problem whose number is the query is listed first.
export function filterProblems<T extends { id: number; latex: string; difficulty: number; tags: string[] }>(
  problems: T[],
  { min, max, tags, query }: ProblemFilters,
): T[] {
  const text = query?.trim().replace(/^#/, "") ?? "";
  const needle = normalize(text);
  const number = /^\d+$/.test(text) ? Number(text) : null;

  const shown = problems.filter(
    (p) =>
      (!min || p.difficulty >= min) &&
      (!max || p.difficulty <= max) &&
      (!tags?.length || tags.some((t) => p.tags.includes(t))) &&
      (!needle || p.id === number || normalize(p.latex).includes(needle)),
  );
  return number === null ? shown : [...shown.filter((p) => p.id === number), ...shown.filter((p) => p.id !== number)];
}
