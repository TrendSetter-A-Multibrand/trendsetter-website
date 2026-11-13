import { describe, expect, it } from "vitest";
import { formatPhone, nextPhone } from "@/lib/phoneMask";

describe("formatPhone", () => {
  it("делает +7 (999) 987 87 13 из любой записи", () => {
    for (const raw of ["+79999878713", "89999878713", "79999878713", "9999878713", "+7 999 987-87-13", "8 (999) 987 87 13"]) {
      expect(formatPhone(raw)).toBe("+7 (999) 987 87 13");
    }
  });

  it("растёт по мере набора", () => {
    expect(formatPhone("")).toBe("");
    expect(formatPhone("9")).toBe("+7 (9");
    expect(formatPhone("999")).toBe("+7 (999)");
    expect(formatPhone("9998")).toBe("+7 (999) 8");
    expect(formatPhone("999987")).toBe("+7 (999) 987");
    expect(formatPhone("99998787")).toBe("+7 (999) 987 87");
  });

  it("первая 8 или 7 стирается: дальше идёт код с 9", () => {
    expect(formatPhone("8")).toBe("");
    expect(formatPhone("+7")).toBe("");
    expect(formatPhone("89")).toBe("+7 (9");
  });

  it("лишние цифры отбрасываются", () => {
    expect(formatPhone("+7 999 987 87 13 55")).toBe("+7 (999) 987 87 13");
  });
});

describe("nextPhone", () => {
  it("стирание разделителя убирает последнюю цифру", () => {
    expect(nextPhone("+7 (999) 987 8", "+7 (999) 987 ")).toBe("+7 (999) 987");
    expect(nextPhone("+7 (999) 987", "+7 (999)987")).toBe("+7 (999) 98");
    expect(nextPhone("+7 (999)", "+7 (999")).toBe("+7 (99");
  });

  it("обычный набор и вставка работают как formatPhone", () => {
    expect(nextPhone("+7 (999) 98", "+7 (999) 987")).toBe("+7 (999) 987");
    expect(nextPhone("", "89999878713")).toBe("+7 (999) 987 87 13");
  });

  it("можно стереть всё", () => {
    expect(nextPhone("+7 (9", "+7 (")).toBe("");
  });
});
