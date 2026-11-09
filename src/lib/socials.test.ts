import { describe, expect, it } from "vitest";
import { socials } from "@/lib/siteSettings";
import { DEFAULT_SETTINGS } from "@/lib/siteDefaults";

const link = (label: string, extra: Record<string, unknown> = {}) => ({ label, href: "#", icon: "telegram", ...extra });

describe("соцсети из настроек", () => {
  it("скрытые не попадают на сайт, остальные остаются по порядку", () => {
    const found = socials({
      socials: [link("Telegram"), link("VK", { hidden: true }), link("MAX", { hidden: "true" }), link("Wildberries")],
    });
    expect(found.map((s) => s.label)).toEqual(["Telegram", "Wildberries"]);
  });

  it("если скрыты все — пусто, а не запасные значения", () => {
    expect(socials({ socials: [link("Telegram", { hidden: true })] })).toEqual([]);
  });

  it("если редактор ничего не писал — запасные значения", () => {
    expect(socials({})).toEqual(DEFAULT_SETTINGS.socials);
  });
});
