import { describe, expect, it } from "vitest";
import { parsePlacements } from "@/lib/storyblok/placements";

const blok = (component: string, fields: Record<string, unknown> = {}) => ({
  _uid: component,
  component,
  ...fields,
});

const article = { title: "Заголовок статьи", image: "/hero.jpg", excerpt: "Лид статьи" };

describe("parsePlacements", () => {
  it("is nothing when no placement was added", () => {
    expect(parsePlacements(undefined, article)).toBeUndefined();
    expect(parsePlacements([], article)).toBeUndefined();
  });

  it("takes the first block of a kind and ignores a second", () => {
    const placements = parsePlacements(
      [
        blok("placement_event", { date: "2026-09-08 18:00", card_title: "Первое" }),
        blok("placement_event", { date: "2027-01-01 10:00", card_title: "Второе" }),
      ],
      article,
    );
    expect(placements?.event).toMatchObject({ date: "2026-09-08 18:00", cardTitle: "Первое" });
  });

  it("fills empty fields from the article", () => {
    const placements = parsePlacements(
      [
        blok("placement_news", { card_title: " ", card_image: { filename: "" } }),
        blok("placement_event", { date: "2026-09-08 18:00" }),
      ],
      article,
    );
    expect(placements?.news).toEqual({
      cardTitle: "Заголовок статьи",
      cardImage: "/hero.jpg",
      cardExcerpt: "Лид статьи",
    });
    expect(placements?.event).toMatchObject({
      cardTitle: "Заголовок статьи",
      cardImage: "/hero.jpg",
      cardDescription: "Лид статьи",
      ctaLabel: "Подробнее",
      signupEnabled: true,
      seats: undefined,
    });
  });

  it("keeps what the editor wrote over the article's values", () => {
    const placements = parsePlacements(
      [
        blok("placement_event", {
          date: "2026-09-08 18:00",
          card_title: "Мастер-класс",
          card_image: { filename: "/card.jpg" },
          signup_enabled: false,
          seats: "30",
        }),
      ],
      article,
    );
    expect(placements?.event).toMatchObject({
      cardTitle: "Мастер-класс",
      cardImage: "/card.jpg",
      signupEnabled: false,
      seats: 30,
    });
  });

  it("drops an event with no date, and a space placement without an event", () => {
    expect(parsePlacements([blok("placement_event", { date: "" })], article)).toBeUndefined();
    expect(
      parsePlacements([blok("placement_space", { space_sections: ["Уникальные сервисы"] })], article),
    ).toBeUndefined();
  });

  it("reads the Пространство sections beside an event", () => {
    const placements = parsePlacements(
      [
        blok("placement_event", { date: "2026-09-08 18:00" }),
        blok("placement_space", { space_sections: ["Уникальные сервисы"] }),
      ],
      article,
    );
    expect(placements?.space).toEqual({ spaceSections: ["Уникальные сервисы"] });
  });
});
