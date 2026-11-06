import { describe, expect, it } from "vitest";
import { childHref, NAV_ITEMS } from "@/lib/navigation";

describe("меню шапки", () => {
  it("порядок макета: Бренды, Новости, Журнал, События, Компания, Магазины, Контакты", () => {
    expect(NAV_ITEMS.filter((item) => !item.hidden).map((item) => item.label)).toEqual([
      "Бренды",
      "Новости",
      "Журнал",
      "События",
      "Компания",
      "Магазины",
      "Контакты",
    ]);
  });

  it("ссылка выпадающего меню идёт под родителем, а со слэшем — от корня", () => {
    expect(childHref("ru", "company", "about")).toBe("/ru/company/about");
    expect(childHref("ru", "company", "/faq")).toBe("/ru/faq");
  });
});
