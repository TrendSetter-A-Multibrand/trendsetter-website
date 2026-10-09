import { describe, expect, it } from "vitest";
import { eventFromLegacy, legacyHref } from "@/lib/legacyEvents";

const ev = { uuid: "u-1", slug: "book-club" };

describe("legacyHref", () => {
  it("ведёт на статью с тем же slug", () => {
    expect(legacyHref(ev, [{ slug: "book-club", content: {} }], "ru")).toBe(
      "/ru/journal/book-club",
    );
  });

  it("ищет статью по полю event, если slug другой", () => {
    const articles = [
      { slug: "other", content: { event: "zzz" } },
      { slug: "club-article", content: { event: "u-1" } },
    ];
    expect(legacyHref(ev, articles, "en")).toBe("/en/journal/club-article");
  });

  it("без статьи - пусто, а не ссылка в 404", () => {
    expect(legacyHref(ev, [{ slug: "x", content: {} }], "ru")).toBe("");
  });
});

describe("eventFromLegacy", () => {
  it("собирает событие из истории event", () => {
    const e = eventFromLegacy(
      {
        ...ev,
        content: { title: "T", date: "2026-08-03 19:00", image: { filename: "a.jpg" } },
      },
      "/ru/journal/book-club",
      true,
    );
    expect(e).toMatchObject({ uuid: "u-1", day: "3", month: "авг", time: "19:00", image: "a.jpg", signupEnabled: true });
  });
});
