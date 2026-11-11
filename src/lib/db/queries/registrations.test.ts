import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { connect, type Sql } from "@/lib/db/client";
import { cancelByToken, countRegistrations, findByCancelToken, register } from "@/lib/db/queries/registrations";
import { newCancelToken } from "@/lib/cancelToken";

const url = process.env.TEST_DATABASE_URL;
const person = (email: string) => ({ email, name: "Иван Петров", phone: "+79991234567" });

describe.skipIf(!url)("register (needs TEST_DATABASE_URL)", () => {
  let sql: Sql;
  const uuid = `race-${Date.now()}`;

  beforeAll(async () => {
    sql = connect(url!);
    await sql.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(7001)`;
      for (const f of ["001_event_registrations.sql", "003_registration_contacts.sql", "004_cancel_hash.sql"]) {
        await tx.unsafe(readFileSync(`db/migrations/${f}`, "utf8"));
      }
    });
  });
  afterAll(async () => {
    await sql`DELETE FROM event_registrations WHERE event_uuid = ${uuid}`;
    await sql.end();
  });

  it("gives exactly N seats to N+5 racers", async () => {
    const N = 8;
    const results = await Promise.all(
      Array.from({ length: N + 5 }, (_, i) =>
        register(uuid, person(`u${i}@x.ru`), N, sql),
      ),
    );
    expect(results.filter((r) => r === "ok")).toHaveLength(N);
    expect(results.filter((r) => r === "full")).toHaveLength(5);
    expect(await countRegistrations(uuid, sql)).toBe(N);
  });

  it("does not spend a seat on a duplicate", async () => {
    expect(await register(uuid, person("u0@x.ru"), 8, sql)).toBe("duplicate");
  });

  it("cancels once by the link's token and frees the seat", async () => {
    const { token, hash } = newCancelToken();
    const before = await countRegistrations(uuid, sql);
    expect(await register(uuid, { ...person("cancel@x.ru"), cancelHash: hash }, 100, sql)).toBe("ok");
    expect((await findByCancelToken(token, sql))?.email).toBe("cancel@x.ru");
    expect((await cancelByToken(token, sql))?.email).toBe("cancel@x.ru");
    expect(await cancelByToken(token, sql)).toBeNull();
    expect(await countRegistrations(uuid, sql)).toBe(before);
  });
});
