import { describe, expect, it } from "vitest";
import { PAGE_SIZE, newestFirst, spreadOf, type Article } from "@/lib/articles";

const make = (n: number): Article[] =>
  Array.from({ length: n }, (_, i) => ({ tags: [], title: `A${i}`, date: `2026-10-${String(10 + i).padStart(2, "0")}` }));

describe("разворот журнала", () => {
  it("двенадцать статей ложатся в обложку, четыре карточки, три плашки и две пары", () => {
    const s = spreadOf(make(PAGE_SIZE));
    expect(s.cover.title).toBe("A0");
    expect(s.stagger.map((a) => a.title)).toEqual(["A1", "A2", "A3", "A4"]);
    expect(s.plates).toHaveLength(3);
    expect(s.duo).toHaveLength(2);
    expect(s.duoMirrored).toHaveLength(2);
  });

  it("короткая страница просто обрывается", () => {
    const s = spreadOf(make(3));
    expect(s.stagger).toHaveLength(2);
    expect(s.plates).toEqual([]);
    expect(s.duoMirrored).toEqual([]);
  });

  it("новости идут от свежих к старым, без даты — в конце", () => {
    const list = [...make(2), { tags: [], title: "без даты" }];
    expect(newestFirst(list).map((a) => a.title)).toEqual(["A1", "A0", "без даты"]);
  });
});
