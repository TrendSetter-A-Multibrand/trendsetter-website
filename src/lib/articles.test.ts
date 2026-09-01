import { describe, expect, it } from "vitest";
import {
  byTag,
  inSection,
  parseQuery,
  sameTag,
  search,
  tagHref,
  tagsOf,
  type Article,
} from "@/lib/articles";

const article = (over: Partial<Article> = {}): Article => ({
  tags: ["Мода"],
  title: "Заголовок",
  ...over,
});

describe("sameTag", () => {
  it("не различает регистр и лишние пробелы", () => {
    expect(sameTag("Мода", "мода")).toBe(true);
    expect(sameTag(" Тренды ", "тренды")).toBe(true);
  });

  it("считает разные слова разными", () => {
    expect(sameTag("Мода", "Модаа")).toBe(false);
  });
});

describe("parseQuery", () => {
  it("отделяет хештеги от слов", () => {
    const { words, tags } = parseQuery("неделя #мода моды #тренды");
    expect(words).toEqual(["неделя", "моды"]);
    expect(tags).toEqual(["мода", "тренды"]);
  });

  it("на пустой строке отдаёт пустое", () => {
    expect(parseQuery("   ")).toEqual({ words: [], tags: [] });
  });
});

describe("search", () => {
  const all = [
    article({ title: "Неделя моды весна-лето", tags: ["Мода", "Тренды"] }),
    article({ title: "Что положить в косметичку", tags: ["Красота"] }),
  ];

  it("ищет слово в заголовке", () => {
    expect(search(all, "косметичк")).toHaveLength(1);
  });

  it("хештегом ищет по тегам, а не по заголовку", () => {
    expect(search(all, "#красота")).toHaveLength(1);
    expect(search(all, "#косметичка")).toHaveLength(0);
  });

  it("на пустой запрос не отдаёт ничего", () => {
    // Не «всё»: на странице поиска до первого слова показывать весь сайт незачем
    expect(search(all, "   ")).toEqual([]);
  });
});

describe("byTag и tagsOf", () => {
  const all = [
    article({ tags: ["Мода", "Тренды"] }),
    article({ tags: ["Красота"] }),
  ];

  it("собирает теги без повторов", () => {
    expect(tagsOf(all)).toEqual(["Мода", "Тренды", "Красота"]);
  });

  it("без тега не фильтрует", () => {
    expect(byTag(all)).toHaveLength(2);
  });

  it("фильтрует не различая регистр", () => {
    expect(byTag(all, "красота")).toHaveLength(1);
  });
});

describe("inSection", () => {
  it("делит статьи по разделу", () => {
    const all = [
      article({ section: "news" }),
      article({ section: "journal" }),
      article({ section: "news" }),
    ];
    expect(inSection(all, "news")).toHaveLength(2);
    expect(inSection(all, "journal")).toHaveLength(1);
  });
});

describe("tagHref", () => {
  it("ведёт в раздел с тегом в адресе", () => {
    expect(tagHref("ru_ru", "journal", "Мода")).toBe(
      "/ru_ru/journal?tag=%D0%9C%D0%BE%D0%B4%D0%B0"
    );
  });
});
