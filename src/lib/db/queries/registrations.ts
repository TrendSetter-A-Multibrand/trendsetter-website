import { db, type Sql } from "@/lib/db/client";
import { hashCancelToken } from "@/lib/cancelToken";
import type { Signup } from "@/lib/eventSignup";

export type Registration = {
  id: number;
  email: string;
  /** Empty for a sign-up made before the form asked for it. */
  name: string;
  phone: string;
  createdAt: Date;
  /** When the guest was let in; null until then. */
  attendedAt: Date | null;
};
export type RegisterResult = "ok" | "full" | "duplicate";

export async function countRegistrations(
  uuid: string,
  sql: Sql = db(),
): Promise<number> {
  const [row] = await sql`
    SELECT count(*)::int AS n FROM event_registrations WHERE event_uuid = ${uuid}`;
  return row.n;
}

/**
 * Signs one e-mail up. The advisory lock is per event, so two people racing for
 * the last seat are taken one after the other: duplicate, then count, then insert.
 * `capacity` null means no limit. The fields must already be cleaned (see
 * `parseSignup`): the e-mail lower-cased, the phone as "+" and digits.
 * `cancelHash` is the hash of the token in the guest's cancel link.
 */
export async function register(
  uuid: string,
  { email, name, phone, cancelHash }: Signup & { cancelHash?: string },
  capacity: number | null,
  sql: Sql = db(),
): Promise<RegisterResult> {
  return sql.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtext(${uuid}))`;
    const dup = await tx`
      SELECT 1 FROM event_registrations
      WHERE event_uuid = ${uuid} AND email = ${email}`;
    if (dup.length > 0) return "duplicate" as const;
    if (capacity !== null) {
      const [row] = await tx`
        SELECT count(*)::int AS n FROM event_registrations WHERE event_uuid = ${uuid}`;
      if (row.n >= capacity) return "full" as const;
    }
    await tx`
      INSERT INTO event_registrations
        (event_uuid, email, full_name, phone, cancel_hash, consent_at)
      VALUES (${uuid}, ${email}, ${name}, ${phone}, ${cancelHash ?? null}, now())`;
    return "ok" as const;
  });
}

export async function listRegistrations(
  uuid: string,
  sql: Sql = db(),
): Promise<Registration[]> {
  const rows = await sql`
    SELECT id, email, full_name, phone, created_at, attended_at FROM event_registrations
    WHERE event_uuid = ${uuid} ORDER BY created_at, id`;
  return rows.map((r) => ({
    id: Number(r.id),
    email: r.email,
    name: r.full_name ?? "",
    phone: r.phone ?? "",
    createdAt: r.created_at,
    attendedAt: r.attended_at,
  }));
}

/**
 * Marks a guest let in (or takes the mark back). The event is part of the match,
 * so a registration of another event cannot be reached by guessing its id.
 */
export async function setAttended(
  id: number,
  uuid: string,
  attended: boolean,
  sql: Sql = db(),
): Promise<void> {
  await sql`
    UPDATE event_registrations
    SET attended_at = ${attended ? sql`now()` : null}
    WHERE id = ${id} AND event_uuid = ${uuid}`;
}

export type CancelTarget = { eventUuid: string; name: string; email: string };

/** Whose sign-up a cancel link belongs to; null when it is unknown or already used. */
export async function findByCancelToken(
  token: string,
  sql: Sql = db(),
): Promise<CancelTarget | null> {
  const [row] = await sql`
    SELECT event_uuid, full_name, email FROM event_registrations
    WHERE cancel_hash = ${hashCancelToken(token)}`;
  return row ? { eventUuid: row.event_uuid, name: row.full_name ?? "", email: row.email } : null;
}

/**
 * Takes the guest off the list: the row goes, so the seat is free again and the
 * guest's data is not kept past their asking. Null when the link was used up.
 */
export async function cancelByToken(
  token: string,
  sql: Sql = db(),
): Promise<CancelTarget | null> {
  const [row] = await sql`
    DELETE FROM event_registrations WHERE cancel_hash = ${hashCancelToken(token)}
    RETURNING event_uuid, full_name, email`;
  return row ? { eventUuid: row.event_uuid, name: row.full_name ?? "", email: row.email } : null;
}

/** Every event that has sign-ups, with how many - for the admin page. */
export async function listEventCounts(
  sql: Sql = db(),
): Promise<{ uuid: string; count: number }[]> {
  const rows = await sql`
    SELECT event_uuid, count(*)::int AS n, max(created_at) AS last
    FROM event_registrations GROUP BY event_uuid ORDER BY last DESC`;
  return rows.map((r) => ({ uuid: r.event_uuid, count: r.n }));
}
