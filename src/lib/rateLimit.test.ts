import { expect, it } from "vitest";
import { createLimiter } from "@/lib/rateLimit";

it("lets max hits through, then limits, per key", () => {
  const limited = createLimiter(60_000, 2);
  expect([limited("a"), limited("a"), limited("a")]).toEqual([false, false, true]);
  expect(limited("b")).toBe(false);
});
