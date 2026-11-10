import { describe, expect, it } from "vitest";
import { filterProblems } from "@/lib/filters";

const problems = [
  { id: 1, difficulty: 1, tags: [], latex: "\\int_0^{12} x \\, dx" },
  { id: 2, difficulty: 3, tags: ["Symmetry"], latex: "\\int \\frac{\\ln x}{x} \\, dx" },
  { id: 3, difficulty: 3, tags: ["Symmetry", "Trigonometric Identities"], latex: "\\int e^{x} \\sin x \\, dx" },
  { id: 4, difficulty: 5, tags: ["Feynman's Rule"], latex: "\\int_0^1 \\left( \\frac{x-1}{\\ln x} \\right) dx" },
  { id: 12, difficulty: 2, tags: [], latex: "\\int \\sec^2 x \\, dx" },
];

const ids = (list: { id: number }[]) => list.map((p) => p.id);

describe("filterProblems", () => {
  it("returns everything without filters", () => {
    expect(ids(filterProblems(problems, {}))).toEqual([1, 2, 3, 4, 12]);
    expect(ids(filterProblems(problems, { query: "  " }))).toEqual([1, 2, 3, 4, 12]);
  });

  it("filters by exact difficulty", () => {
    expect(ids(filterProblems(problems, { difficulty: 3 }))).toEqual([2, 3]);
  });

  it("filters by tag, matching problems with several tags", () => {
    expect(ids(filterProblems(problems, { tags: ["Symmetry"] }))).toEqual([2, 3]);
    expect(ids(filterProblems(problems, { tags: ["Trigonometric Identities"] }))).toEqual([3]);
  });

  it("with several tags selected, keeps problems carrying any of them", () => {
    expect(ids(filterProblems(problems, { tags: ["Trigonometric Identities", "Feynman's Rule"] }))).toEqual([3, 4]);
    expect(ids(filterProblems(problems, { tags: [] }))).toEqual([1, 2, 3, 4, 12]);
  });

  it("combines difficulty and tag", () => {
    expect(ids(filterProblems(problems, { difficulty: 5, tags: ["Symmetry"] }))).toEqual([]);
    expect(ids(filterProblems(problems, { difficulty: 5, tags: ["Feynman's Rule"] }))).toEqual([4]);
  });

  it("searches LaTeX ignoring case, spacing, backslashes and braces", () => {
    expect(ids(filterProblems(problems, { query: "ln x" }))).toEqual([2, 4]);
    expect(ids(filterProblems(problems, { query: "\\LN X" }))).toEqual([2, 4]);
    expect(ids(filterProblems(problems, { query: "e^x sin" }))).toEqual([3]);
    expect(ids(filterProblems(problems, { query: "(x-1)/" }))).toEqual([]);
    expect(ids(filterProblems(problems, { query: "frac{x-1}{ln x}" }))).toEqual([4]);
  });

  it("finds a problem by number and lists it before LaTeX matches", () => {
    expect(ids(filterProblems(problems, { query: "12" }))).toEqual([12, 1]);
    expect(ids(filterProblems(problems, { query: "#4" }))).toEqual([4]);
  });

  it("combines search with the other filters", () => {
    expect(ids(filterProblems(problems, { query: "ln x", difficulty: 5 }))).toEqual([4]);
  });
});
