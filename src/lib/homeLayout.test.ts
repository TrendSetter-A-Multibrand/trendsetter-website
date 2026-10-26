import { describe, expect, it } from "vitest";
import { homeLayout } from "@/lib/homeLayout";
import type { Block } from "@/lib/storyblok/fetchStory";

const b = (component: string): Block => ({ _uid: component, component });
const names = (body: Block[]) => body.map((block) => block.component);

describe("порядок главной", () => {
  it("старая история ставится в порядок макета и получает стену сезона и плитки", () => {
    const old = ["hero", "news_row", "events_row", "journal_row", "stores_row", "newsletter"].map(b);

    expect(names(homeLayout(old))).toEqual([
      "hero",
      "journal_row",
      "news_row",
      "season_wall",
      "categories_row",
      "events_row",
      "stores_row",
      "newsletter",
    ]);
  });

  it("история, где уже есть стена сезона, остаётся как написал редактор", () => {
    const edited = ["hero", "season_wall", "news_row", "journal_row"].map(b);

    expect(homeLayout(edited)).toBe(edited);
  });

  it("плитки не дублируются, если редактор уже добавил их", () => {
    const body = ["hero", "categories_row", "news_row"].map(b);
    const result = names(homeLayout(body));

    expect(result.filter((name) => name === "categories_row")).toHaveLength(1);
    expect(result).toContain("season_wall");
  });

  it("незнакомый блок остаётся среди средних секций", () => {
    const body = ["hero", "text_section", "news_row", "stores_row"].map(b);
    const result = names(homeLayout(body));

    expect(result.indexOf("text_section")).toBeGreaterThan(result.indexOf("categories_row"));
    expect(result.indexOf("text_section")).toBeLessThan(result.indexOf("stores_row"));
  });
});
