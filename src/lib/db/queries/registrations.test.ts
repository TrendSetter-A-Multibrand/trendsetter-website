import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { connect, type Sql } from "@/lib/db/client";
import { countRegistrations, register } from "@/lib/db/queries/registrations";

const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("register (needs TEST_DATABASE_URL)", () => {
  let sql: Sql;
  const uuid = `race-${Date.now()}`;

  beforeAll(async () => {
    sql = connect(url!);
    await sql.unsafe(
      readFileSync("db/migrations/001_event_registrations.sql", "utf8"),
    );
  });
  afterAll(async () => {
    await sql`DELETE FROM event_registrations WHERE event_uuid = ${uuid}`;
    await sql.end();
  });

  it("gives exactly N seats to N+5 racers", async () => {
    const N = 8;
    const results = await Promise.all(
      Array.from({ length: N + 5 }, (_, i) =>
        register(uuid, `u${i}@x.ru`, N, sql),
      ),
    );
    expect(results.filter((r) => r === "ok")).toHaveLength(N);
    expect(results.filter((r) => r === "full")).toHaveLength(5);
    expect(await countRegistrations(uuid, sql)).toBe(N);
  });

  it("does not spend a seat on a duplicate", async () => {
    expect(await register(uuid, "u0@x.ru", 8, sql)).toBe("duplicate");
  });
});
