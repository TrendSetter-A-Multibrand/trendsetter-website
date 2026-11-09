import { describe, expect, it } from "vitest";
import { bindShortWords } from "@/lib/typography";

const N = " ";

describe("висячие предлоги и союзы", () => {
  it("короткое слово склеивается со следующим", () => {
    expect(bindShortWords("Доверьте поиск нам, а выбор — себе")).toBe(`Доверьте поиск нам,${" "}а${N}выбор${N}— себе`);
    expect(bindShortWords("Отбираем вещи для дома и косметику")).toBe(`Отбираем вещи для${N}дома и${N}косметику`);
  });

  it("цепочка коротких слов подряд тоже склеивается", () => {
    expect(bindShortWords("в и на дом")).toBe(`в${N}и${N}на${N}дом`);
  });

  it("длинные слова не трогает", () => {
    expect(bindShortWords("Магазины рядом с домом")).toBe(`Магазины рядом с${N}домом`);
    expect(bindShortWords("Журнал новости события")).toBe("Журнал новости события");
  });

  it("число держится за единицу, тире не начинает строку", () => {
    expect(bindShortWords("Есть в 2 магазинах")).toBe(`Есть в${N}2${N}магазинах`);
    expect(bindShortWords("Открытие — скоро")).toBe(`Открытие${N}— скоро`);
  });

  it("слово в конце узла тоже связывается со следующим элементом", () => {
    expect(bindShortWords("Читать в ")).toBe(`Читать в${N}`);
  });

  it("повторный проход ничего не меняет", () => {
    const once = bindShortWords("а выбор — себе и в магазинах");
    expect(bindShortWords(once)).toBe(once);
  });

  it("латиница и адреса не затронуты", () => {
    expect(bindShortWords("TRENDSETTER is at the shop")).toBe("TRENDSETTER is at the shop");
  });
});
