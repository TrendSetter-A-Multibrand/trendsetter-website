import { describe, expect, it } from "vitest";
import {
  buildNewsEventContent,
  hasEventPlacement,
  stripEventContent,
} from "@/lib/storyblok/convertEvent";

const article = () => ({
  _uid: "root-uid",
  component: "article",
  section: "journal",
  title: "Мастер-класс",
  tags: ["Мода"],
  hero: { filename: "/hero.jpg" },
  body: [{ _uid: "b1", component: "article_text" }],
  event: "some-uuid",
  placements: [
    { _uid: "p0", component: "placement_news", card_title: "Новость" },
    {
      _uid: "p1",
      component: "placement_event",
      date: "2026-11-01 18:00",
      location: "Атриум",
      card_title: "Короткое",
      card_image: { filename: "/card.jpg" },
      card_description: "Описание",
      cta_label: "",
      signup_enabled: false,
      seats: "20",
    },
    { _uid: "p2", component: "placement_space", space_sections: ["a", "b"] },
  ] as Record<string, unknown>[],
});

describe("buildNewsEventContent", () => {
  it("переносит поля статьи и поля события в корень, без section/placements/event", () => {
    const c = buildNewsEventContent(article())!;
    expect(c).toMatchObject({
      _uid: "root-uid",
      component: "news_event",
      title: "Мастер-класс",
      tags: ["Мода"],
      hero: { filename: "/hero.jpg" },
      body: [{ _uid: "b1", component: "article_text" }],
      date: "2026-11-01 18:00",
      location: "Атриум",
      card_title: "Короткое",
      card_image: { filename: "/card.jpg" },
      card_description: "Описание",
      cta_label: "Подробнее",
      signup_enabled: false,
      seats: "20",
      space_sections: ["a", "b"],
    });
    expect(c).not.toHaveProperty("section");
    expect(c).not.toHaveProperty("placements");
    expect(c).not.toHaveProperty("event");
  });

  it("без placement_space нет space_sections, без мест нет seats, запись по умолчанию открыта", () => {
    const a = article();
    a.placements = [{ _uid: "p1", component: "placement_event", date: "2026-11-01 18:00" }];
    const c = buildNewsEventContent(a)!;
    expect(c).not.toHaveProperty("space_sections");
    expect(c).not.toHaveProperty("seats");
    expect(c.signup_enabled).toBe(true);
  });

  it("без placement_event - null", () => {
    const a = article();
    a.placements = [a.placements[0]];
    expect(buildNewsEventContent(a)).toBeNull();
    expect(hasEventPlacement(a)).toBe(false);
  });
});

describe("stripEventContent", () => {
  it("убирает placement_event и placement_space, обнуляет event, тип не трогает", () => {
    const c = stripEventContent(article());
    expect(c.component).toBe("article");
    expect(c.event).toBe("");
    expect((c.placements as { component: string }[]).map((p) => p.component)).toEqual([
      "placement_news",
    ]);
  });
});
