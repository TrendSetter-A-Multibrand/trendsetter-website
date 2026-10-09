import { describe, expect, it } from "vitest";
import { readCapacity } from "@/lib/storyblok/eventCapacity";

const story = (block: object) => ({
  name: "Мастер-класс",
  content: { component: "article", body: [{ component: "x" }, block] },
});

describe("readCapacity", () => {
  it("is null without a placement_event", () => {
    expect(readCapacity({ content: { body: [] } })).toBeNull();
  });
  it("reads seats as a number, even from a string", () => {
    const c = readCapacity(story({ component: "placement_event", seats: "12" }));
    expect(c).toMatchObject({ seats: 12, signupEnabled: true });
  });
  it("treats an empty seats field as no limit", () => {
    const c = readCapacity(story({ component: "placement_event", seats: "" }));
    expect(c?.seats).toBeNull();
  });
  it("closes sign-up only on an explicit off", () => {
    const c = readCapacity(
      story({ component: "placement_event", signup_enabled: false }),
    );
    expect(c?.signupEnabled).toBe(false);
  });
  it("falls back to the story name for the title", () => {
    const c = readCapacity(story({ component: "placement_event", date: "2026-11-01 18:00" }));
    expect(c).toMatchObject({ title: "Мастер-класс", date: "2026-11-01 18:00" });
  });

  it("news_event даёт вместимость из полей корня", () => {
    const c = readCapacity({
      name: "Событие",
      content: {
        component: "news_event",
        title: "Заголовок",
        date: "2026-11-01 18:00",
        seats: 8,
        signup_enabled: false,
      },
    });
    expect(c).toEqual({
      seats: 8,
      signupEnabled: false,
      date: "2026-11-01 18:00",
      title: "Заголовок",
    });
  });

  it("обычная статья без placement_event - null, запись даёт 404", () => {
    expect(
      readCapacity({
        content: { component: "article", date: "2026-11-01 18:00", seats: 8, event: "x" },
      }),
    ).toBeNull();
  });

  it("у news_event placement_event в теле не читается", () => {
    expect(
      readCapacity({
        content: { component: "news_event", body: [{ component: "placement_event", seats: 3 }] },
      })?.seats,
    ).toBeNull();
  });
});
