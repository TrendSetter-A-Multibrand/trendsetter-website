import { describe, expect, it } from "vitest";
import { normalizePhone } from "@/lib/bonusRarus/loyalty";

describe("normalizePhone", () => {
  it("приводит российский номер к 11 цифрам с 7 в начале", () => {
    expect(normalizePhone("+7 (999) 000-00-01")).toBe("79990000001");
    expect(normalizePhone("8 999 000 00 01")).toBe("79990000001");
    expect(normalizePhone("9990000001")).toBe("79990000001");
  });

  it("отклоняет то, что не похоже на российский номер", () => {
    expect(normalizePhone("123")).toBeNull();
    expect(normalizePhone("+1 212 555 0100")).toBeNull();
    expect(normalizePhone("")).toBeNull();
  });
});
