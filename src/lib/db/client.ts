import postgres from "postgres";

/**
 * The one connection to our own Postgres (Russian hosting: e-mails are personal
 * data, 152-FZ). Only src/lib/db/queries/* may import this - see ARCHITECTURE.md.
 * Created on first use, so a missing DATABASE_URL is an error from the request
 * that wanted the database, not a crash at boot.
 */
export class DbNotConfigured extends Error {
  constructor() {
    super("DATABASE_URL не задан");
  }
}

export type Sql = postgres.Sql;

let shared: Sql | undefined;

export function db(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) throw new DbNotConfigured();
  shared ??= postgres(url, { max: 5, idle_timeout: 20 });
  return shared;
}

/** For tests that point at their own database. */
export function connect(url: string): Sql {
  return postgres(url, { max: 20 });
}
