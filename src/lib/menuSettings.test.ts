import { describe, expect, it } from "vitest";
import { columns, nav, visibleColumns, visibleNav } from "@/lib/menuSettings";
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

  it("оставляет видимые подпункты", () => {
    const [item] = nav({
      nav: [
        {
          ...link("Компания", "company"),
          children: [link("О нас", "about"), link("Вакансии", "careers", true)],
        },
      ],
    });
    expect(item.children).toEqual([{ label: "О нас", slug: "about" }]);
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
            { label: "Вакансии", path: "company/careers", hidden: true },
          ],
        },
      ],
    });
    expect(found).toEqual([
      { title: "Компания", links: [{ label: "О нас", path: "company/about" }] },
    ]);
  });

  it("запасная колонка Компания без трёх скрытых ссылок", () => {
    const company = columns({}).find((c) => c.title === "Компания");
    expect(company?.links.map((l) => l.path)).toEqual([
      "company/about",
      "company/space",
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
