import { db, type Sql } from "@/lib/db/client";

export type Registration = { email: string; createdAt: Date };
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
 * `capacity` null means no limit. `email` must already be lower-cased and trimmed.
 */
export async function register(
  uuid: string,
  email: string,
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
      INSERT INTO event_registrations (event_uuid, email, consent_at)
      VALUES (${uuid}, ${email}, now())`;
    return "ok" as const;
  });
}

export async function listRegistrations(
  uuid: string,
  sql: Sql = db(),
): Promise<Registration[]> {
  const rows = await sql`
    SELECT email, created_at FROM event_registrations
    WHERE event_uuid = ${uuid} ORDER BY created_at, id`;
  return rows.map((r) => ({ email: r.email, createdAt: r.created_at }));
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
