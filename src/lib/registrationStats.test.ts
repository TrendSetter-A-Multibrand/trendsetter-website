import { describe, expect, it } from "vitest";
import type { Registration } from "@/lib/db/queries/registrations";
import {
  dayKey,
  groupByStore,
  NO_STORE,
  perDay,
  perStore,
  totals,
  type CabinetEvent,
} from "@/lib/registrationStats";

const reg = (iso: string, attended = false): Registration => ({
  id: 1,
  email: "a@b.co",
  name: "Иван Петров",
  phone: "+79991234567",
  createdAt: new Date(iso),
  attendedAt: attended ? new Date(iso) : null,
});

const event = (over: Partial<CabinetEvent>): CabinetEvent => ({
  uuid: "e",
  title: "Событие",
  date: "2026-11-12 15:00",
  storeUuid: "s1",
  storeName: "Мозаика",
  seats: null,
  rows: [],
  ...over,
});

describe("dayKey", () => {
  it("reads the day on the Moscow clock", () => {
    // 21:30 UTC is already the next day in Moscow
    expect(dayKey(new Date("2026-11-09T21:30:00Z"))).toBe("2026-11-10");
    expect(dayKey(new Date("2026-11-09T20:30:00Z"))).toBe("2026-11-09");
  });
});

describe("totals", () => {
  it("counts sign-ups and arrivals, and the seats of the events that have a limit", () => {
    const t = totals([
      event({ seats: 20, rows: [reg("2026-11-01T10:00:00Z", true), reg("2026-11-01T11:00:00Z")] }),
      event({ seats: null, rows: [reg("2026-11-02T10:00:00Z")] }),
    ]);
    expect(t).toEqual({ events: 2, registered: 3, attended: 1, seats: 20, taken: 2 });
  });

  it("is all zeros with no events", () => {
    expect(totals([])).toEqual({ events: 0, registered: 0, attended: 0, seats: 0, taken: 0 });
  });
});

describe("perDay", () => {
  const now = new Date("2026-11-10T12:00:00Z");

  it("gives one entry per day, today last, empty days as 0", () => {
    const days = perDay(
      [event({ rows: [reg("2026-11-10T08:00:00Z"), reg("2026-11-10T09:00:00Z"), reg("2026-11-08T08:00:00Z")] })],
      5,
      now,
    );
    expect(days.map((d) => d.day)).toEqual([
      "2026-11-06",
      "2026-11-07",
      "2026-11-08",
      "2026-11-09",
      "2026-11-10",
    ]);
    expect(days.map((d) => d.count)).toEqual([0, 0, 1, 0, 2]);
  });

  it("leaves out what is older than the window", () => {
    const days = perDay([event({ rows: [reg("2026-01-01T08:00:00Z")] })], 5, now);
    expect(days.every((d) => d.count === 0)).toBe(true);
  });
});

describe("perStore", () => {
  it("adds up the events of a store and puts the busiest first", () => {
    const rows = perStore([
      event({ storeUuid: "a", storeName: "Вегас", rows: [reg("2026-11-01T10:00:00Z")] }),
      event({
        storeUuid: "b",
        storeName: "Мозаика",
        rows: [reg("2026-11-01T10:00:00Z", true), reg("2026-11-01T11:00:00Z")],
      }),
      event({ storeUuid: "b", storeName: "Мозаика", rows: [reg("2026-11-02T10:00:00Z")] }),
    ]);
    expect(rows).toEqual([
      { name: "Мозаика", registered: 3, attended: 1 },
      { name: "Вегас", registered: 1, attended: 0 },
    ]);
  });

  it("names an event with no store", () => {
    expect(perStore([event({ storeUuid: "", storeName: "" })])[0].name).toBe(NO_STORE);
  });
});

describe("groupByStore", () => {
  it("orders stores by name and events by date, with no-store last", () => {
    const groups = groupByStore([
      event({ uuid: "1", storeUuid: "", storeName: "", date: "2026-11-01 10:00" }),
      event({ uuid: "2", storeUuid: "m", storeName: "Мозаика", date: "2026-11-20 10:00" }),
      event({ uuid: "3", storeUuid: "v", storeName: "Вегас", date: "2026-11-05 10:00" }),
      event({ uuid: "4", storeUuid: "m", storeName: "Мозаика", date: "2026-11-10 10:00" }),
    ]);
    expect(groups.map((g) => g.name)).toEqual(["Вегас", "Мозаика", NO_STORE]);
    expect(groups[1].events.map((e) => e.uuid)).toEqual(["4", "2"]);
  });
});
