import { describe, expect, it } from "vitest";
import { suggestEmail } from "@/lib/emailTypo";

describe("suggestEmail", () => {
  it.each([
    ["anna.chichirina@gmail.con", "anna.chichirina@gmail.com"],
    ["a@gmial.com", "a@gmail.com"],
    ["a@gmail.ru", "a@gmail.com"],
    ["a@mail.ry", "a@mail.ru"],
    ["a@yandex.ry", "a@yandex.ru"],
    ["a@yandx.ru", "a@yandex.ru"],
    ["a@outlok.com", "a@outlook.com"],
  ])("%s -> %s", (typo, fixed) => {
    expect(suggestEmail(typo)).toBe(fixed);
  });

  it("leaves right and unrelated addresses alone", () => {
    for (const ok of [
      "a@gmail.com", "a@mail.ru", "a@ya.ru", "a@bk.ru", "karen@trendsettercrew.ru",
      "a@company.example", "a@b.co", "nope", "@gmail.com",
    ]) {
      expect(suggestEmail(ok)).toBeNull();
    }
  });
});
