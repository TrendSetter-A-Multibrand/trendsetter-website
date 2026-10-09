// Applies db/migrations/*.sql in name order, once each. Usage: npm run db:migrate
import { readdirSync, readFileSync } from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL не задан");
  process.exit(1);
}
const sql = postgres(url, { max: 1, onnotice: () => {} });

await sql`CREATE TABLE IF NOT EXISTS schema_migrations (
  name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
const done = new Set(
  (await sql`SELECT name FROM schema_migrations`).map((r) => r.name),
);

const dir = new URL("../db/migrations/", import.meta.url);
for (const name of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  if (done.has(name)) continue;
  await sql.begin(async (tx) => {
    await tx.unsafe(readFileSync(new URL(name, dir), "utf8"));
    await tx`INSERT INTO schema_migrations (name) VALUES (${name})`;
  });
  console.log("applied", name);
}
await sql.end();
