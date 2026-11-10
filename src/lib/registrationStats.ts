import type { Registration } from "@/lib/db/queries/registrations";

/** One event as the cabinet shows it: what Storyblok says of it and who signed up. */
export type CabinetEvent = {
  uuid: string;
  title: string;
  /** As the editor typed it, "2026-11-12 15:00"; "" when there is none. */
  date: string;
  storeUuid: string;
  storeName: string;
  /** Total seats; null when the editor set no limit. */
  seats: number | null;
  rows: Registration[];
};

export const NO_STORE = "Без магазина";

const ZONE = "Europe/Moscow";

/** "2026-11-10" for a moment, read on the Moscow clock the site keeps. */
export function dayKey(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONE }).format(d);
}

export function totals(events: CabinetEvent[]) {
  let registered = 0;
  let attended = 0;
  let seats = 0;
  let taken = 0;
  for (const event of events) {
    registered += event.rows.length;
    attended += event.rows.filter((r) => r.attendedAt).length;
    if (event.seats !== null) {
      seats += event.seats;
      taken += event.rows.length;
    }
  }
  return { events: events.length, registered, attended, seats, taken };
}

/**
 * Sign-ups per day for the last `days` days, today last, a day with none as 0 -
 * so the chart has no gaps to explain.
 */
export function perDay(
  events: CabinetEvent[],
  days = 30,
  now: Date = new Date(),
): { day: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const event of events) {
    for (const row of event.rows) {
      const key = dayKey(row.createdAt);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Array.from({ length: days }, (_, i) => {
    const day = dayKey(new Date(now.getTime() - (days - 1 - i) * 86_400_000));
    return { day, count: counts.get(day) ?? 0 };
  });
}

/** Sign-ups and arrivals per store, the busiest first. */
export function perStore(events: CabinetEvent[]) {
  const byStore = new Map<string, { name: string; registered: number; attended: number }>();
  for (const event of events) {
    const key = event.storeUuid || NO_STORE;
    const entry = byStore.get(key) ?? {
      name: event.storeName || NO_STORE,
      registered: 0,
      attended: 0,
    };
    entry.registered += event.rows.length;
    entry.attended += event.rows.filter((r) => r.attendedAt).length;
    byStore.set(key, entry);
  }
  return [...byStore.values()].sort((a, b) => b.registered - a.registered);
}

/**
 * The events under the store they are held at: stores by name, the events of a
 * store by their date, and the ones with no store last.
 */
export function groupByStore(events: CabinetEvent[]) {
  const groups = new Map<string, { uuid: string; name: string; events: CabinetEvent[] }>();
  for (const event of events) {
    const key = event.storeUuid || NO_STORE;
    const group = groups.get(key) ?? {
      uuid: event.storeUuid,
      name: event.storeName || NO_STORE,
      events: [],
    };
    group.events.push(event);
    groups.set(key, group);
  }
  return [...groups.values()]
    .map((g) => ({ ...g, events: [...g.events].sort((a, b) => a.date.localeCompare(b.date)) }))
    .sort((a, b) => {
      if (!a.uuid !== !b.uuid) return a.uuid ? -1 : 1;
      return a.name.localeCompare(b.name, "ru");
    });
}
