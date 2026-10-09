import { isUpcoming } from "@/lib/events";
/**
 * The event sign-up's rules, apart from the route so they can be tested: what a
 * valid request looks like, and how many seats are left.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type Signup = { email: string };

export function parseSignup(
  raw: unknown,
):
  | { ok: true; value: Signup }
  | { ok: false; error: "bad body" | "email" | "consent" } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "bad body" };
  }
  const r = raw as Record<string, unknown>;
  const email = typeof r.email === "string" ? r.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return { ok: false, error: "email" };
  }
  if (r.consent !== true) return { ok: false, error: "consent" };
  return { ok: true, value: { email } };
}

/** `total` null = the editor set no limit; the answer is then null too. */
export function seatsLeft(total: number | null, taken: number): number | null {
  if (total === null) return null;
  return Math.max(0, total - taken);
}

/**
 * Why sign-up is shut regardless of seats: the editor switched it off, or the
 * event has passed. An unreadable or missing date never closes it.
 */
export function signupShut(
  event: { signupEnabled: boolean; date: string },
  now: Date = new Date(),
): "disabled" | "closed" | null {
  if (!event.signupEnabled) return "disabled";
  const readable = /^\d{4}-\d{2}-\d{2}/.test(event.date.trim());
  if (readable && !isUpcoming({ date: event.date.trim() }, now)) return "closed";
  return null;
}

/** Storyblok story uuids; anything else is not an event and never reaches the API. */
export const isEventUuid = (v: string) => /^[0-9a-f-]{36}$/i.test(v);

/** Seats shown in the demo when Storyblok gives no limit. */
export const DEMO_SEATS = 20;

/**
 * Demo mode: EVENTS_SIGNUP_DEMO=1 with no DATABASE_URL. Only for showing the
 * form - nothing is stored. With a database configured the switch is ignored,
 * so it can never hide real sign-ups.
 */
export function isSignupDemo(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return env.EVENTS_SIGNUP_DEMO === "1" && !env.DATABASE_URL;
}

/**
 * What the demo knows of an event: Storyblok's capacity when the story has a
 * placement, else a stand-in (an old event story has none) with DEMO_SEATS.
 */
export function demoCapacity<T extends { seats: number | null }>(
  capacity: T | null,
): (T & { seats: number }) | { seats: number; signupEnabled: true; date: ""; title: "" } {
  if (!capacity) return { seats: DEMO_SEATS, signupEnabled: true, date: "", title: "" };
  return { ...capacity, seats: capacity.seats ?? DEMO_SEATS };
}
