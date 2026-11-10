import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { connect, type Sql } from "@/lib/db/client";
import { register, listRegistrations, setAttended } from "@/lib/db/queries/registrations";
import {
  createSession,
  deleteSession,
  findSession,
  findStaffForLogin,
  upsertStaff,
} from "@/lib/db/queries/staff";

const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("staff (needs TEST_DATABASE_URL)", () => {
  let sql: Sql;
  const login = `t${Date.now()}`;
  const event = `staff-test-${Date.now()}`;

  beforeAll(async () => {
    sql = connect(url!);
    // Other test files build the same tables in the same database at the same
    // time; the lock makes them take turns instead of colliding on CREATE TABLE.
    await sql.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(7001)`;
      for (const f of ["001_event_registrations.sql", "002_staff.sql"]) {
        await tx.unsafe(readFileSync(`db/migrations/${f}`, "utf8"));
      }
    });
  });
  afterAll(async () => {
    await sql`DELETE FROM staff WHERE login = ${login}`;
    await sql`DELETE FROM event_registrations WHERE event_uuid = ${event}`;
    await sql.end();
  });

  const account = (over: Partial<Parameters<typeof upsertStaff>[0]> = {}) => ({
    login,
    name: "Тест",
    passwordHash: "scrypt$aa$bb",
    role: "store" as const,
    storeUuids: ["store-a"],
    ...over,
  });

  it("finds an account by login and returns its stores", async () => {
    await upsertStaff(account(), sql);
    const found = await findStaffForLogin(login, sql);
    expect(found?.role).toBe("store");
    expect(found?.storeUuids).toEqual(["store-a"]);
    expect(await findStaffForLogin("nobody-here", sql)).toBeNull();
  });

  it("opens a session that works until it is deleted", async () => {
    const staff = (await findStaffForLogin(login, sql))!;
    await createSession(staff.id, "hash-live", 60_000, sql);
    expect((await findSession("hash-live", sql))?.login).toBe(login);
    await deleteSession("hash-live", sql);
    expect(await findSession("hash-live", sql)).toBeNull();
  });

  it("does not honour an expired session", async () => {
    const staff = (await findStaffForLogin(login, sql))!;
    await createSession(staff.id, "hash-old", -1000, sql);
    expect(await findSession("hash-old", sql)).toBeNull();
  });

  it("signs the account out everywhere when it is changed", async () => {
    const staff = (await findStaffForLogin(login, sql))!;
    await createSession(staff.id, "hash-before", 60_000, sql);
    await upsertStaff(account({ storeUuids: ["store-b"] }), sql);
    expect(await findSession("hash-before", sql)).toBeNull();
    expect((await findStaffForLogin(login, sql))?.storeUuids).toEqual(["store-b"]);
  });

  it("stops a disabled account from signing in or keeping a session", async () => {
    const staff = (await findStaffForLogin(login, sql))!;
    await createSession(staff.id, "hash-off", 60_000, sql);
    await sql`UPDATE staff SET disabled = true WHERE login = ${login}`;
    expect(await findStaffForLogin(login, sql)).toBeNull();
    expect(await findSession("hash-off", sql)).toBeNull();
  });

  it("marks a guest let in, and only within the right event", async () => {
    await register(event, "guest@x.ru", null, sql);
    const [row] = await listRegistrations(event, sql);
    expect(row.attendedAt).toBeNull();

    await setAttended(row.id, "another-event", true, sql);
    expect((await listRegistrations(event, sql))[0].attendedAt).toBeNull();

    await setAttended(row.id, event, true, sql);
    expect((await listRegistrations(event, sql))[0].attendedAt).toBeInstanceOf(Date);

    await setAttended(row.id, event, false, sql);
    expect((await listRegistrations(event, sql))[0].attendedAt).toBeNull();
  });
});
