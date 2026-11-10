import { describe, expect, it } from "vitest";
import { HREFLANG, absoluteLanguages, everyLocale, siteUrl } from "@/lib/site";
import { locales } from "@/lib/i18n/locales";

describe("адрес сайта", () => {
  it("не заканчивается косой чертой", () => {
    // Иначе каждый адрес ниже собрался бы с двойным слешем
    expect(siteUrl.endsWith("/")).toBe(false);
  });

  it("знает языковую метку для каждого рынка", () => {
    for (const locale of locales) {
      expect(HREFLANG[locale]).toMatch(/^ru-[A-Z]{2}$/);
    }
  });
});

describe("absoluteLanguages", () => {
  /**
   * Первая версия sitemap ставила сюда наши собственные имена рынков - ru_ru.
   * Поиску они не говорят ничего: это не языковые теги.
   */
  it("ключи — языковые метки, а не имена рынков", () => {
    const languages = absoluteLanguages("/journal");
    expect(Object.keys(languages)).toEqual(["ru-RU", "ru-AM"]);
    expect(Object.keys(languages)).not.toContain("ru_ru");
  });

  it("адреса абсолютные; у основного рынка без приставки, у остальных с ней", () => {
    const languages = absoluteLanguages("/cookies");
    expect(languages["ru-RU"]).toBe(`${siteUrl}/cookies`);
    expect(languages["ru-AM"]).toBe(`${siteUrl}/ru_am/cookies`);
  });

  it("на корне обходится без хвоста", () => {
    expect(absoluteLanguages()["ru-RU"]).toBe(siteUrl);
  });
});

describe("everyLocale", () => {
  it("отдаёт по адресу на каждый рынок", () => {
    expect(everyLocale("/stores")).toEqual([
      `${siteUrl}/stores`,
      `${siteUrl}/ru_am/stores`,
    ]);
  });
});
