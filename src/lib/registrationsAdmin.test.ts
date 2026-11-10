import { describe, expect, it } from "vitest";
import { registrationsCsv } from "@/lib/registrationsAdmin";

describe("registrationsCsv", () => {
  it("quotes cells and defuses formulas", () => {
    const csv = registrationsCsv([
      {
        name: "Иван Петров",
        phone: "+79991234567",
        email: "=a@b.co",
        createdAt: new Date("2026-01-01T00:00:00Z"),
        attendedAt: null,
      },
    ]);
    expect(csv).toContain("\"Иван Петров\",\"79991234567\",\"'=a@b.co\",\"2026-01-01T00:00:00.000Z\",\"\"");
    expect(csv.startsWith("﻿full_name,phone,email,created_at,attended_at")).toBe(true);
  });

  it("writes when the guest was let in", () => {
    const csv = registrationsCsv([
      {
        name: "Иван Петров",
        phone: "+79991234567",
        email: "a@b.co",
        createdAt: new Date("2026-01-01T00:00:00Z"),
        attendedAt: new Date("2026-01-02T10:00:00Z"),
      },
    ]);
    expect(csv).toContain("\"2026-01-02T10:00:00.000Z\"");
  });
});
