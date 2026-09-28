import { describe, expect, it } from "vitest";
import { filterProblems } from "@/lib/filters";

const problems = [
  { id: 1, difficulty: 1, tags: [] },
  { id: 2, difficulty: 3, tags: ["Symmetry"] },
  { id: 3, difficulty: 3, tags: ["Symmetry", "Trigonometric Identities"] },
  { id: 4, difficulty: 5, tags: ["Feynman's Rule"] },
];

const ids = (list: { id: number }[]) => list.map((p) => p.id);

describe("filterProblems", () => {
  it("returns everything without filters", () => {
    expect(ids(filterProblems(problems, {}))).toEqual([1, 2, 3, 4]);
  });

  it("filters by exact difficulty", () => {
    expect(ids(filterProblems(problems, { difficulty: 3 }))).toEqual([2, 3]);
  });

  it("filters by tag, matching problems with several tags", () => {
    expect(ids(filterProblems(problems, { tag: "Symmetry" }))).toEqual([2, 3]);
    expect(ids(filterProblems(problems, { tag: "Trigonometric Identities" }))).toEqual([3]);
  });

  it("combines difficulty and tag", () => {
    expect(ids(filterProblems(problems, { difficulty: 5, tag: "Symmetry" }))).toEqual([]);
    expect(ids(filterProblems(problems, { difficulty: 5, tag: "Feynman's Rule" }))).toEqual([4]);
  });
});
