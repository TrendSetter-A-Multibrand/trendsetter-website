import { describe, expect, it } from "vitest";
import { columns, nav, visibleColumns, visibleNav, withEvents } from "@/lib/menuSettings";
import { DEFAULT_SETTINGS } from "@/lib/siteDefaults";

const link = (label: string, slug: string, hidden?: unknown) => ({
  label,
  slug,
  ...(hidden === undefined ? {} : { hidden }),
});

describe("меню из settings", () => {
  it("показывает пункты старой сторис без поля hidden", () => {
    const items = nav({ nav: [link("Новости", "news")] });
    expect(items).toEqual([{ label: "Новости", slug: "news" }]);
  });

  it("прячет пункт с hidden true и true строкой", () => {
    const items = nav({
      nav: [link("A", "a", true), link("B", "b", "true"), link("C", "c", false)],
    });
    expect(items.map((i) => i.slug)).toEqual(["c"]);
  });

  it("не выставляет children, если скрыты все подпункты", () => {
    const [item] = nav({
      nav: [{ ...link("Журнал", "journal"), children: [link("Люди", "people", true)] }],
    });
    expect(item).toEqual({ label: "Журнал", slug: "journal" });
  });

  it("оставляет видимые подпункты, а вакансии показывает, даже если они отмечены скрытыми", () => {
    const [item] = nav({
      nav: [
        {
          ...link("Компания", "company"),
          children: [
            link("О нас", "about"),
            link("Вакансии", "careers", true),
            link("Обратная связь", "feedback", true),
          ],
        },
      ],
    });
    expect(item.children).toEqual([
      { label: "О нас", slug: "about" },
      { label: "Вакансии", slug: "careers" },
    ]);
  });

  it("не подставляет запасное меню, если все пункты скрыты", () => {
    expect(nav({ nav: [link("A", "a", true)] })).toEqual([]);
  });

  it("подставляет запасное меню без скрытого, если записей нет", () => {
    const items = nav({});
    const slugs = items.map((i) => i.slug);
    expect(slugs).toContain("journal");
    expect(slugs).not.toContain("loyalty");
    expect(slugs).not.toContain("gift-cards");
    expect(items.find((i) => i.slug === "journal")?.children).toBeUndefined();
    const company = items.find((i) => i.slug === "company");
    expect(company?.children?.map((c) => c.slug)).toEqual([
      "about",
      "space",
      "collaborations",
      "careers",
      "contacts",
    ]);
  });
});

describe("колонки футера из settings", () => {
  it("прячет скрытые ссылки и не трогает остальные", () => {
    const found = columns({
      footer_columns: [
        {
          title: "Компания",
          links: [
            { label: "О нас", path: "company/about" },
            { label: "Обратная связь", path: "company/feedback", hidden: true },
          ],
        },
      ],
    });
    expect(found).toEqual([
      { title: "Компания", links: [{ label: "О нас", path: "company/about" }] },
    ]);
  });

  it("вакансии, лояльность и подарочные карты в подвале показываются, даже если отмечены скрытыми", () => {
    const [column] = columns({
      footer_columns: [
        {
          title: "Покупателям",
          links: [
            { label: "Система лояльности", path: "loyalty", hidden: true },
            { label: "Подарочные карты", path: "gift-cards", hidden: true },
            { label: "Вакансии", path: "company/careers", hidden: true },
          ],
        },
      ],
    });
    expect(column.links.map((l) => l.path)).toEqual(["loyalty", "gift-cards", "company/careers"]);
  });

  it("подвал старого дизайна («Меню», «Сотрудничество») заменяется четырьмя группами макета", () => {
    const found = columns({
      footer_columns: [{ title: "Меню", links: [{ label: "Журнал", path: "journal" }] }],
    });
    expect(found.map((c) => c.title)).toEqual(["Медиа", "Покупателям", "Компания", "Документы"]);
  });

  it("запасная колонка Компания: пять ссылок, как в макете", () => {
    const company = columns({}).find((c) => c.title === "Компания");
    expect(company?.links.map((l) => l.path)).toEqual([
      "company/about",
      "company/space",
      "company/collaborations",
      "company/careers",
      "company/contacts",
    ]);
  });

  it("не подставляет запасные колонки, если все ссылки скрыты", () => {
    const found = columns({
      footer_columns: [{ title: "X", links: [{ label: "a", path: "a", hidden: true }] }],
    });
    expect(found).toEqual([{ title: "X", links: [] }]);
  });
});

describe("запасные значения", () => {
  it("visibleNav и visibleColumns не меняют исходные данные", () => {
    const before = JSON.stringify(DEFAULT_SETTINGS);
    visibleNav(DEFAULT_SETTINGS.nav);
    visibleColumns(DEFAULT_SETTINGS.footer.columns);
    expect(JSON.stringify(DEFAULT_SETTINGS)).toBe(before);
  });
});

describe("withEvents", () => {
  it("ставит События после Новостей, если редактор их не ставил", () => {
    const items = [
      { label: "Журнал", slug: "journal" },
      { label: "Новости", slug: "news" },
      { label: "Магазины", slug: "stores" },
    ];
    expect(withEvents(items).map((i) => i.slug)).toEqual(["journal", "news", "events", "stores"]);
  });

  it("не трогает меню, где События уже есть, и пустое меню", () => {
    const placed = [{ label: "События", slug: "events" }];
    expect(withEvents(placed)).toBe(placed);
    expect(withEvents([])).toEqual([]);
  });
});
