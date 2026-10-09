import { describe, expect, it } from "vitest";
import {
  byTag,
  byTags,
  inSection,
  noTagMatches,
  tagsFromParam,
  toggleTagHref,
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

describe("byTags", () => {
  const all = [
    article({ title: "a", tags: ["Мода", "Тренды"] }),
    article({ title: "b", tags: ["Красота"] }),
    article({ title: "c", tags: ["Дом"] }),
  ];

  it("пустой набор — все статьи", () => {
    expect(byTags(all, [])).toHaveLength(3);
  });

  it("берёт статьи с любым из тегов (OR)", () => {
    expect(byTags(all, ["красота", "тренды"]).map((a) => a.title)).toEqual([
      "a",
      "b",
    ]);
  });

  it("не показывает статью дважды, если совпали оба тега", () => {
    expect(byTags(all, ["Мода", "Тренды"])).toHaveLength(1);
  });

  it("неизвестный тег — пусто", () => {
    expect(byTags(all, ["Нет"])).toEqual([]);
  });
});

describe("tagsFromParam", () => {
  it("приводит строку, массив и пустоту к массиву", () => {
    expect(tagsFromParam(undefined)).toEqual([]);
    expect(tagsFromParam("")).toEqual([]);
    expect(tagsFromParam("a")).toEqual(["a"]);
    expect(tagsFromParam(["a", " ", "b"])).toEqual(["a", "b"]);
  });
});

describe("noTagMatches", () => {
  it("склоняет под один и несколько тегов", () => {
    expect(noTagMatches(["А"])).toBe("По тегу «А» пока ничего нет.");
    expect(noTagMatches(["А", "Б"])).toBe("По тегам «А», «Б» пока ничего нет.");
  });
});

describe("toggleTagHref", () => {
  it("добавляет тег к набору", () => {
    expect(toggleTagHref("ru_ru", "journal", ["Мода"], "Дом")).toBe(
      "/ru_ru/journal?tag=%D0%9C%D0%BE%D0%B4%D0%B0&tag=%D0%94%D0%BE%D0%BC",
    );
  });

  it("убирает уже выбранный тег, не различая регистр", () => {
    expect(toggleTagHref("ru_ru", "news", ["Мода", "Дом"], "мода")).toBe(
      "/ru_ru/news?tag=%D0%94%D0%BE%D0%BC",
    );
  });

  it("последний снятый тег ведёт на раздел без запроса", () => {
    expect(toggleTagHref("ru_ru", "news", ["Мода"], "Мода")).toBe("/ru_ru/news");
  });

  it("из пустого набора выбирает один тег", () => {
    expect(toggleTagHref("ru_ru", "journal", [], "Мода")).toBe(
      "/ru_ru/journal?tag=%D0%9C%D0%BE%D0%B4%D0%B0",
    );
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

describe("inSection: размещения", () => {
  const event = {
    date: "2026-09-08 18:00",
    location: "",
    cardTitle: "Мастер-класс",
    ctaLabel: "Подробнее",
    signupEnabled: true,
  };
  const all = [
    article({ title: "Журнальная", section: "journal" }),
    article({ title: "Новость", section: "news" }),
    article({ title: "Событие", section: "journal", placements: { event } }),
    article({
      title: "С карточкой",
      section: "journal",
      image: "/hero.jpg",
      placements: { news: { cardTitle: "Короткий", cardImage: "/card.jpg", cardExcerpt: "Лид" } },
    }),
  ];

  it("новости включают события и статьи с размещением в новостях", () => {
    expect(inSection(all, "news").map((a) => a.title)).toEqual([
      "Новость",
      "Событие",
      "Короткий",
    ]);
  });

  it("в новостях карточка берётся из размещения, в журнале остаётся своя", () => {
    expect(inSection(all, "news")[2]).toMatchObject({ image: "/card.jpg", excerpt: "Лид" });
    expect(inSection(all, "journal").map((a) => a.title)).toEqual([
      "Журнальная",
      "Событие",
      "С карточкой",
    ]);
  });
});
