import { describe, expect, it } from "vitest";
import { matchesPractice, pickProblem } from "@/lib/practice";

describe("matchesPractice", () => {
  const p = { difficulty: 3, tags: ["Symmetry", "MIT Integration Bee"] };

  it("keeps problems inside the difficulty range, inclusive", () => {
    expect(matchesPractice(p, { min: 3, max: 3, tags: [] })).toBe(true);
    expect(matchesPractice(p, { min: 1, max: 2, tags: [] })).toBe(false);
    expect(matchesPractice(p, { min: 4, max: 5, tags: [] })).toBe(false);
  });

  it("matches any selected tag, and everything when none are selected", () => {
    expect(matchesPractice(p, { min: 1, max: 5, tags: ["Symmetry", "Feynman's Rule"] })).toBe(true);
    expect(matchesPractice(p, { min: 1, max: 5, tags: ["Feynman's Rule"] })).toBe(false);
  });
});

describe("pickProblem", () => {
  it("returns null when nothing matches", () => {
    expect(pickProblem([], new Set(), null)).toBeNull();
  });

  it("never repeats or returns a solved problem while fresh ones remain", () => {
    const candidates = [1, 2, 3, 4, 5, 6];
    const exclude = new Set([2, 5]); // solved
    const seen: number[] = [];
    let current: number | null = null;
    for (let i = 0; i < 4; i++) {
      const pick: { id: number; repeat: boolean } = pickProblem(candidates, exclude, current)!;
      expect(pick.repeat).toBe(false);
      expect(exclude.has(pick.id)).toBe(false);
      exclude.add(pick.id);
      seen.push(pick.id);
      current = pick.id;
    }
    expect(seen.sort()).toEqual([1, 3, 4, 6]);
  });

  it("falls back to repeats once every candidate is used, avoiding the current problem", () => {
    for (let i = 0; i < 50; i++) {
      const pick = pickProblem([1, 2, 3], new Set([1, 2, 3]), 2)!;
      expect(pick.repeat).toBe(true);
      expect(pick.id).not.toBe(2);
    }
  });

  it("repeats the only candidate when there is no other option", () => {
    expect(pickProblem([7], new Set([7]), 7)).toEqual({ id: 7, repeat: true });
  });

  it("uses the supplied random source", () => {
    expect(pickProblem([10, 20, 30], new Set(), null, () => 0.99)!.id).toBe(30);
    expect(pickProblem([10, 20, 30], new Set(), null, () => 0)!.id).toBe(10);
  });
});
