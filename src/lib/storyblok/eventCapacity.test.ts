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
});
