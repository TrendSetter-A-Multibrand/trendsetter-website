import { createHash, timingSafeEqual } from "node:crypto";

/** Name of the cookie that holds the hash of the admin secret. */
export const ADMIN_COOKIE = "reg_admin";

const hash = (s: string) => createHash("sha256").update(s).digest();

/** The secret from the environment; undefined means the feature is off. */
export const adminSecret = () => process.env.REGISTRATIONS_ADMIN_SECRET || undefined;

/** Constant-time comparison of a typed secret with the real one. */
export function secretMatches(given: unknown, expected: string | undefined) {
  if (!expected || typeof given !== "string" || !given) return false;
  return timingSafeEqual(hash(given), hash(expected));
}

/** What the cookie stores - never the secret itself. */
export const cookieValue = (secret: string) => hash(secret).toString("hex");

export function cookieMatches(given: unknown, expected: string | undefined) {
  return !!expected && secretMatches(given, cookieValue(expected));
}

/** Quote a cell; a leading = + - @ would be run as a formula by spreadsheets. */
function cell(v: string): string {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function registrationsCsv(
  rows: { email: string; createdAt: Date }[],
): string {
  const lines = rows.map((r) =>
    [cell(r.email), cell(r.createdAt.toISOString())].join(","),
  );
  return "﻿" + ["email,created_at", ...lines].join("\r\n") + "\r\n";
}
