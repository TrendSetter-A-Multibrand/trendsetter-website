import { describe, expect, it } from "vitest";
import { eventFromStory } from "@/lib/storyblok/events";

const story = (content: object) => ({
  uuid: "u1",
  slug: "workshop",
  name: "Воркшоп",
  content: { title: "Заголовок", ...content },
});

describe("eventFromStory", () => {
  it("читает поля события из корня и берёт пустое у самой статьи", () => {
    const event = eventFromStory(
      story({
        date: "2026-11-01 18:00",
        location: "Атриум",
        hero: { filename: "/hero.jpg" },
        excerpt: "Лид",
      }),
      "ru_ru",
    );
    expect(event).toMatchObject({
      uuid: "u1",
      slug: "workshop",
      href: "/ru_ru/journal/workshop",
      date: "2026-11-01 18:00",
      title: "Заголовок",
      image: "/hero.jpg",
      description: "Лид",
      ctaLabel: "Подробнее",
      signupEnabled: true,
      spaceSections: [],
    });
    expect(event?.seats).toBeUndefined();
  });

  it("свои поля карточки главнее, места и разделы читаются", () => {
    const event = eventFromStory(
      story({
        date: "2026-11-01 18:00",
        card_title: "Короткое",
        card_image: { filename: "/card.jpg" },
        card_description: "Описание",
        signup_enabled: false,
        seats: 12,
        space_sections: ["a"],
      }),
      "en",
    );
    expect(event).toMatchObject({
      title: "Короткое",
      image: "/card.jpg",
      description: "Описание",
      signupEnabled: false,
      seats: 12,
      spaceSections: ["a"],
    });
  });

  it("без даты события нет", () => {
    expect(eventFromStory(story({}), "ru_ru")).toBeNull();
  });
});
