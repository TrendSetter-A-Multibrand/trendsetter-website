import { db, type Sql } from "@/lib/db/client";
import type { Staff, StaffRole } from "@/lib/staff/access";

type Row = {
  id: string | number;
  login: string;
  name: string;
  role: StaffRole;
  store_uuids: string[];
};

const toStaff = (r: Row): Staff => ({
  id: Number(r.id),
  login: r.login,
  name: r.name,
  role: r.role,
  storeUuids: r.store_uuids,
});

/** The account for a sign-in, with its hash; a disabled account is not found. */
export async function findStaffForLogin(
  login: string,
  sql: Sql = db(),
): Promise<(Staff & { passwordHash: string }) | null> {
  const [row] = await sql`
    SELECT id, login, name, role, store_uuids, password_hash
    FROM staff WHERE login = ${login} AND NOT disabled`;
  if (!row) return null;
  return { ...toStaff(row as unknown as Row), passwordHash: row.password_hash };
}

export async function createSession(
  staffId: number,
  tokenHash: string,
  ttlMs: number,
  sql: Sql = db(),
): Promise<void> {
  await sql`DELETE FROM staff_sessions WHERE expires_at < now()`;
  await sql`
    INSERT INTO staff_sessions (token_hash, staff_id, expires_at)
    VALUES (${tokenHash}, ${staffId}, now() + ${ttlMs} * interval '1 millisecond')`;
}

/** Who a live session belongs to; null once it has expired or the account is off. */
export async function findSession(
  tokenHash: string,
  sql: Sql = db(),
): Promise<Staff | null> {
  const [row] = await sql`
    SELECT s.id, s.login, s.name, s.role, s.store_uuids
    FROM staff_sessions x JOIN staff s ON s.id = x.staff_id
    WHERE x.token_hash = ${tokenHash} AND x.expires_at > now() AND NOT s.disabled`;
  return row ? toStaff(row as unknown as Row) : null;
}

export async function deleteSession(tokenHash: string, sql: Sql = db()): Promise<void> {
  await sql`DELETE FROM staff_sessions WHERE token_hash = ${tokenHash}`;
}

/**
 * Creates the account or, for a login that exists, replaces its password and
 * rights - and signs it out everywhere.
 */
export async function upsertStaff(
  s: {
    login: string;
    name: string;
    passwordHash: string;
    role: StaffRole;
    storeUuids: string[];
  },
  sql: Sql = db(),
): Promise<void> {
  await sql`
    INSERT INTO staff (login, name, password_hash, role, store_uuids)
    VALUES (${s.login}, ${s.name}, ${s.passwordHash}, ${s.role}, ${s.storeUuids})
    ON CONFLICT (login) DO UPDATE SET
      name = EXCLUDED.name, password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role, store_uuids = EXCLUDED.store_uuids, disabled = false`;
  await sql`
    DELETE FROM staff_sessions
    WHERE staff_id = (SELECT id FROM staff WHERE login = ${s.login})`;
}
