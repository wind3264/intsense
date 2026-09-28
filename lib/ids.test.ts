import { expect, it } from "vitest";
import { parseId } from "@/lib/ids";

it("accepts positive integers only", () => {
  expect(parseId("42")).toBe(42);
  for (const bad of ["0", "-1", "1.5", "abc", "", "1e3x"]) {
    expect(parseId(bad)).toBeNull();
  }
});
