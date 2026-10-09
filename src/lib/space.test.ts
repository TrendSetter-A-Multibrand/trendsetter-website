import { describe, expect, it } from "vitest";
import { buildSpaceCards, eventsForSection, isLinksOnlyPage } from "@/lib/space";
import type { Event } from "@/lib/events";

const ev = (slug: string, date: string, spaceSections: string[]) =>
  ({ slug, date, spaceSections }) as Event;

const events = [
  ev("late", "2026-12-01 18:00", ["market"]),
  ev("past", "2026-01-01 18:00", ["market"]),
  ev("soon", "2026-11-01 18:00", ["market", "cafe"]),
  ev("other", "2026-11-02 18:00", ["cafe"]),
];

describe("eventsForSection", () => {
  it("keeps the events of the section, soonest first, past ones too", () => {
    expect(eventsForSection(events, "market").map((e) => e.slug)).toEqual([
      "past",
      "soon",
      "late",
    ]);
  });
  it("a card with no section shows every event", () => {
    expect(eventsForSection(events, undefined)).toHaveLength(4);
  });
});

describe("buildSpaceCards", () => {
  const shops = [{ uuid: "a", name: "Атриум" }, { uuid: "b", name: "Дубровка" }];
  it("a card with no rows says the goods are in every shop", () => {
    const [card] = buildSpaceCards([{ title: "T", availability: [] }], shops, events);
    expect(card.stores).toEqual([
      { name: "Атриум", available: true },
      { name: "Дубровка", available: true },
    ]);
    expect(card.events).toHaveLength(4);
  });
  it("lists every shop where the card has rows", () => {
    const input = [
      { title: "T", sectionKey: "cafe", availability: [{ store: "b", available: false }] },
    ];
    const [card] = buildSpaceCards(input, shops, events);
    expect(card.stores).toEqual([
      { name: "Атриум", available: true },
      { name: "Дубровка", available: false },
    ]);
    expect(card.events?.map((e) => e.slug)).toEqual(["soon", "other"]);
  });
});

describe("buildSpaceCards links", () => {
  it("passes a card's address through, and leaves a sheet card without one", () => {
    const [linked, sheet] = buildSpaceCards(
      [
        { title: "A", href: "/ru_ru/journal/x", availability: [] },
        { title: "B", availability: [] },
      ],
      [],
      [],
    );
    expect(linked.href).toBe("/ru_ru/journal/x");
    expect(sheet.href).toBeUndefined();
  });
});

describe("isLinksOnlyPage", () => {
  it("is the Collaborations page only", () => {
    expect(isLinksOnlyPage("company/collaborations")).toBe(true);
    expect(isLinksOnlyPage("/company/collaborations/")).toBe(true);
    expect(isLinksOnlyPage("company/space")).toBe(false);
    expect(isLinksOnlyPage(undefined)).toBe(false);
  });
});
