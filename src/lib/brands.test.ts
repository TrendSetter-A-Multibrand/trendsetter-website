import { describe, expect, it } from "vitest";
import {
  alphabetLetters,
  brandStores,
  filledLetters,
  filterBrands,
  indexKey,
  parseShowLogo,
  type Brand,
} from "@/lib/brands";

const brand = (name: string, categories: string[] = []): Brand => ({
  name,
  categories,
  logo: "",
  image: "",
  description: "",
  stores: [],
  showLogo: true,
});

describe("indexKey", () => {
  it("кладёт латиницу под её букву", () => {
    expect(indexKey("Balenciaga")).toBe("B");
    expect(indexKey("zara")).toBe("Z");
  });

  it("кладёт цифру и символ в «#»", () => {
    expect(indexKey("7 for all mankind")).toBe("#");
    expect(indexKey("&Other")).toBe("#");
    expect(indexKey("")).toBe("#");
  });

  it("в EN кириллица уходит в «#», в RU — под свою букву", () => {
    expect(indexKey("Бренд", "en")).toBe("#");
    expect(indexKey("Бренд", "ru")).toBe("Б");
    expect(indexKey("Zara", "ru")).toBe("#");
  });

  it("в RU группирует Ё с Е", () => {
    expect(indexKey("Ёлки", "ru")).toBe("Е");
    expect(indexKey("ёжик", "ru")).toBe("Е");
  });
});

describe("alphabetLetters", () => {
  it("EN — A-Z и «#», RU — полные А-Я и «#»", () => {
    expect(alphabetLetters("en")).toHaveLength(27);
    const ru = alphabetLetters("ru");
    expect(ru).toHaveLength(33);
    expect(ru).toEqual(expect.arrayContaining(["Ъ", "Ь", "Ы", "Я", "#"]));
    expect(ru).not.toContain("Ё");
  });
});

describe("filterBrands", () => {
  const all = [
    brand("Adidas", ["Обувь"]),
    brand("Armani", ["Одежда"]),
    brand("Zara", ["Одежда"]),
    brand("7 Seven", ["Одежда"]),
    brand("&Co", ["Одежда"]),
    brand("Ёлка", ["Дом"]),
  ];
  const names = (list: Brand[]) => list.map((b) => b.name);

  it("без фильтра показывает всех", () => {
    expect(filterBrands(all, {})).toHaveLength(6);
  });

  it("буква оставляет свою группу", () => {
    expect(names(filterBrands(all, { letter: "A" }))).toEqual(["Adidas", "Armani"]);
  });

  it("«#» оставляет только цифры, не символы", () => {
    expect(names(filterBrands(all, { letter: "#" }))).toEqual(["7 Seven"]);
  });

  it("буква, поиск и категории складываются через И", () => {
    expect(
      names(filterBrands(all, { letter: "A", query: "ar", categories: ["Одежда"] }))
    ).toEqual(["Armani"]);
    expect(filterBrands(all, { letter: "A", categories: ["Дом"] })).toEqual([]);
  });

  it("в RU Ё находится по букве Е", () => {
    expect(names(filterBrands(all, { letter: "Е", alphabet: "ru" }))).toEqual(["Ёлка"]);
  });
});

describe("filledLetters", () => {
  it("отмечает только буквы с брендами; «#» — только при цифре", () => {
    const set = filledLetters([brand("Adidas"), brand("&Co")], "en");
    expect([...set]).toEqual(["A"]);
    expect(filledLetters([brand("7 Seven")], "en").has("#")).toBe(true);
  });
});

describe("parseShowLogo", () => {
  it("скрывает только явное false", () => {
    expect(parseShowLogo(undefined)).toBe(true);
    expect(parseShowLogo(true)).toBe(true);
    expect(parseShowLogo("true")).toBe(true);
    expect(parseShowLogo(false)).toBe(false);
    expect(parseShowLogo("false")).toBe(false);
  });
});

describe("brandStores", () => {
  const shops = [
    { uuid: "a", name: "Vegas" },
    { uuid: "b", name: "Мозаика" },
    { uuid: "c", name: "Avenue Sever" },
  ];

  it("всегда даёт все магазины в порядке списка", () => {
    expect(brandStores(shops, []).map((s) => s.name)).toEqual([
      "Vegas",
      "Мозаика",
      "Avenue Sever",
    ]);
  });

  it("без строки магазин в наличии, красный только при явном false", () => {
    const stores = brandStores(shops, [
      { store: "a", available: false },
      { store: "b", available: true },
      { store: "zzz", available: false },
    ]);
    expect(stores.map((s) => s.available)).toEqual([false, true, true]);
  });
});
