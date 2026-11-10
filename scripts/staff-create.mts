/**
 * Creates (or resets) an account for the event check-in cabinet.
 *
 *   npm run staff:create -- --list
 *   npm run staff:create -- --login ivan --name "Иван Петров" --role store --stores atrium,mozaika
 *   npm run staff:create -- --login karen --name "Карен" --role owner
 *
 * A store admin sees only the events of the stores given in --stores (the slugs
 * --list prints); an owner sees every event. The password is generated and
 * printed once - it is not kept anywhere else. Run again with the same login to
 * give a new password or change the stores; that signs the account out
 * everywhere.
 *
 * DATABASE_URL points at the database the site uses (the server's, through an
 * SSH tunnel); the Storyblok keys come from .env.local.
 */
import { randomBytes } from "node:crypto";
import { parseArgs } from "node:util";
import postgres from "postgres";
import { hashPassword } from "../src/lib/staff/password.ts";
import { api } from "./mapi.mjs";

const { values } = parseArgs({
  options: {
    list: { type: "boolean" },
    login: { type: "string" },
    name: { type: "string" },
    role: { type: "string" },
    stores: { type: "string" },
    password: { type: "string" },
  },
});

const { stories } = await api("/stories?starts_with=stores/&content_type=store&per_page=100");
const stores: { slug: string; name: string; uuid: string }[] = stories
  .filter((s: { is_folder: boolean }) => !s.is_folder)
  .map((s: { slug: string; name: string; uuid: string }) => ({
    slug: s.slug,
    name: s.name,
    uuid: s.uuid,
  }));

if (values.list) {
  for (const s of stores) console.log(`${s.slug.padEnd(30)} ${s.name}`);
  process.exit(0);
}

const login = values.login?.trim().toLowerCase();
const role = values.role;
if (!login || !values.name || (role !== "owner" && role !== "store")) {
  console.error("Нужны --login, --name и --role owner|store (магазины: --stores slug,slug)");
  process.exit(1);
}

const wanted = (values.stores ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const storeUuids = wanted.map((slug) => {
  const hit = stores.find((s) => s.slug === slug);
  if (!hit) {
    console.error(`Нет магазина «${slug}». Список: npm run staff:create -- --list`);
    process.exit(1);
  }
  return hit.uuid;
});
if (role === "store" && storeUuids.length === 0) {
  console.error("Админу магазина нужен хотя бы один магазин: --stores slug");
  process.exit(1);
}

const password = values.password ?? randomBytes(9).toString("base64url");
if (password.length < 10) {
  console.error("Пароль короче десяти символов");
  process.exit(1);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL не задан");
  process.exit(1);
}
const sql = postgres(url, { max: 1 });
// The same statement as upsertStaff in src/lib/db/queries/staff.ts: that file
// imports through the "@/" alias, which a plain node script cannot resolve.
await sql`
  INSERT INTO staff (login, name, password_hash, role, store_uuids)
  VALUES (${login}, ${values.name}, ${await hashPassword(password)}, ${role}, ${storeUuids})
  ON CONFLICT (login) DO UPDATE SET
    name = EXCLUDED.name, password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role, store_uuids = EXCLUDED.store_uuids, disabled = false`;
await sql`
  DELETE FROM staff_sessions
  WHERE staff_id = (SELECT id FROM staff WHERE login = ${login})`;
await sql.end();

console.log(`готово: ${login} (${role}${wanted.length ? `, ${wanted.join(", ")}` : ""})`);
if (!values.password) console.log(`пароль: ${password}`);
