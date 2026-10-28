import { describe, expect, it } from "vitest";
import { withFallbackBlocks } from "@/lib/fallbackPages";
import type { Block } from "@/lib/storyblok/fetchStory";

const block = (component: string): Block => ({ _uid: component, component });

describe("заготовки страниц", () => {
  it("вакансии без списка открытых вакансий — старая страница, её заменяет макет с аккордеоном", () => {
    const body = withFallbackBlocks("company/careers", [block("page_cover"), block("text_with_photo")]);

    expect(body.map((b) => b.component)).toEqual([
      "page_cover",
      "text_section",
      "photo_cards",
      "mission_band",
      "accordion_list",
      "informer",
    ]);
  });

  it("вакансии, где список уже есть, остаются как написал редактор", () => {
    const own = [block("page_cover"), block("accordion_list")];
    expect(withFallbackBlocks("company/careers", own)).toBe(own);
  });

  it("другие страницы без плана магазина и вакансий не трогает", () => {
    const own = [block("page_cover")];
    expect(withFallbackBlocks("company/about", own)).toBe(own);
  });

  it("план магазина встаёт после плиток, если его нет", () => {
    const body = withFallbackBlocks("company/space", [block("page_cover"), block("space_cards"), block("x")]);
    expect(body.map((b) => b.component)).toEqual(["page_cover", "space_cards", "store_plan", "x"]);
  });
});
