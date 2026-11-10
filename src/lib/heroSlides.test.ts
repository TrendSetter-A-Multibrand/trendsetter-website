import { describe, expect, it } from "vitest";
import type { Article } from "@/lib/articles";
import type { Event } from "@/lib/events";
import { slidesFromContent } from "@/lib/heroSlides";

const article = (over: Partial<Article>): Article => ({
  tags: [],
  title: "Заголовок",
  href: "/ru_ru/journal/zagolovok",
  ...over,
});

const event = {
  href: "/ru_ru/events/master-class",
  day: "24",
  month: "окт",
  time: "18:00",
  location: "ТЦ «Атриум»",
  title: "Мастер-класс",
  description: "Лепим пиалы",
  ctaLabel: "Записаться",
} as Event;

describe("slidesFromContent", () => {
  it("leads each screen to the page of its own material, not to a list", () => {
    const slides = slidesFromContent({
      news: article({ title: "Новость", href: "/ru_ru/journal/novost", section: "news" }),
      journal: article({ title: "Статья", href: "/ru_ru/journal/statya" }),
      event,
    });
    expect(slides.map((s) => s.primary.href)).toEqual([
      "/ru_ru/journal/novost",
      "/ru_ru/journal/statya",
      "/ru_ru/events/master-class",
    ]);
    expect(slides.map((s) => s.primary.label)).toEqual([
      "Читать новость",
      "Читать статью",
      "Записаться",
    ]);
  });

  it("leaves out a screen that has nothing behind it", () => {
    expect(slidesFromContent({ journal: article({}) })).toHaveLength(1);
    expect(slidesFromContent({})).toEqual([]);
    expect(slidesFromContent({ news: article({ href: undefined }) })).toEqual([]);
  });

  it("puts the time and place of the event in its lead", () => {
    const [slide] = slidesFromContent({ event });
    expect(slide.lead).toBe("24 окт · 18:00 · ТЦ «Атриум». Лепим пиалы");
    expect(slide.tag).toBe("Ближайшее событие");
  });

  it("keeps a picture on a screen whose material has none", () => {
    const [slide] = slidesFromContent({ journal: article({ image: undefined }) });
    expect(slide.image).toMatch(/^\/images\/home\/hero-\d\.jpg$/);
  });
});
