import { describe, expect, it } from "vitest";
import {
  cookieMatches,
  cookieValue,
  registrationsCsv,
  secretMatches,
} from "@/lib/registrationsAdmin";

describe("secret", () => {
  it("matches only the right one, and never when unset", () => {
    expect(secretMatches("s3", "s3")).toBe(true);
    expect(secretMatches("x", "s3")).toBe(false);
    expect(secretMatches("", "")).toBe(false);
    expect(secretMatches("s3", undefined)).toBe(false);
  });
  it("cookie holds a hash that still matches", () => {
    expect(cookieValue("s3")).not.toContain("s3");
    expect(cookieMatches(cookieValue("s3"), "s3")).toBe(true);
    expect(cookieMatches("s3", "s3")).toBe(false);
  });
});

describe("registrationsCsv", () => {
  it("quotes cells and defuses formulas", () => {
    const csv = registrationsCsv([
      { email: "=a@b.co", createdAt: new Date("2026-01-01T00:00:00Z") },
    ]);
    expect(csv).toContain("\"'=a@b.co\",\"2026-01-01T00:00:00.000Z\"");
    expect(csv.startsWith("﻿email,created_at")).toBe(true);
  });
});
