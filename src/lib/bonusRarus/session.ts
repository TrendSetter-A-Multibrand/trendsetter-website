import { cookies } from "next/headers";
import type { CodeSent, Session } from "@/lib/bonusRarus/customer";

/**
 * Two cookies, both httpOnly, so nothing in the page's script ever holds them:
 * the client's own access token once they are in, and - between "получить код"
 * and "подтвердить" - the secret the service handed out with the code. The form
 * itself is not kept: the browser sends it again with the code and the server
 * checks it again, so no personal data sits in a cookie.
 */
const SESSION = "loyalty_session";
const PENDING = "loyalty_pending";

const base = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export type Pending = CodeSent & { mode: "login" | "register"; phone: string };

export async function readSession(): Promise<string | null> {
  return (await cookies()).get(SESSION)?.value || null;
}

export async function writeSession(session: Session) {
  const seconds = Math.floor((session.expireAt - Date.now()) / 1000);
  (await cookies()).set(SESSION, session.token, { ...base, maxAge: Math.max(60, seconds) });
}

export async function clearSession() {
  (await cookies()).delete(SESSION);
}

export async function readPending(): Promise<Pending | null> {
  const raw = (await cookies()).get(PENDING)?.value;
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Pending;
    return value && typeof value.secret === "string" && typeof value.phone === "string" ? value : null;
  } catch {
    return null;
  }
}

/** Lives as long as the code does, with a minute to spare for typing it in. */
export async function writePending(pending: Pending) {
  (await cookies()).set(PENDING, JSON.stringify(pending), { ...base, maxAge: pending.duration + 60 });
}

export async function clearPending() {
  (await cookies()).delete(PENDING);
}
