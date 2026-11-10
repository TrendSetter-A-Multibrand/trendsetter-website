import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import {
  createSession,
  deleteSession,
  findSession,
} from "@/lib/db/queries/staff";
import type { Staff } from "@/lib/staff/access";

export const SESSION_COOKIE = "staff_session";
const TTL_MS = 8 * 60 * 60 * 1000;

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

/** Opens a session for a staff member and hands the browser its token. */
export async function startSession(staffId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");
  await createSession(staffId, hashToken(token), TTL_MS);
  // Secure when the request came in over https (nginx says so); a direct http
  // test stand would otherwise never keep the cookie.
  const secure = (await headers()).get("x-forwarded-proto") === "https";
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

/** Who is signed in, or null. Reads the database on every call: a signed-out or switched-off account loses access at once. */
export async function currentStaff(): Promise<Staff | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? findSession(hashToken(token)) : null;
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(hashToken(token));
  jar.delete(SESSION_COOKIE);
}
