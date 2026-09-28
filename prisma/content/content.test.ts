import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import katex from "katex";
import { describe, expect, it } from "vitest";
import problems from "./problems.json";

// Guards the seed content: every formula must be valid LaTeX, since the site renders
// with throwOnError off and a typo would otherwise show up as red text in production.

const render = (latex: string) => katex.renderToString(latex, { throwOnError: true, strict: "error" });

describe("problems.json", () => {
  it.each(problems.map((p, i) => [i + 1, p] as const))("problem %i is well-formed", (_, p) => {
    expect(() => render(p.latex)).not.toThrow();
    expect(() => render(p.answerKey)).not.toThrow();
    expect(p.latex.startsWith("\\int")).toBe(true);
    expect(Number.isInteger(p.difficulty) && p.difficulty >= 1 && p.difficulty <= 5).toBe(true);
  });
});

describe("editorial solutions", () => {
  const dir = path.join(__dirname, "solutions");
  it.each(readdirSync(dir))("%s belongs to an existing problem", (file) => {
    const id = Number(path.basename(file, ".md"));
    expect(id >= 1 && id <= problems.length).toBe(true);
    expect(readFileSync(path.join(dir, file), "utf8").trim()).not.toBe("");
  });
});
