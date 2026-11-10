"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { setAttended } from "@/lib/db/queries/registrations";
import { findStaffForLogin } from "@/lib/db/queries/staff";
import { isLocale } from "@/lib/i18n/locales";
import { createLimiter } from "@/lib/rateLimit";
import { isEventUuid } from "@/lib/eventSignup";
import { canSeeEvent } from "@/lib/staff/access";
import { verifyAgainstNobody, verifyPassword } from "@/lib/staff/password";
import { currentStaff, endSession, startSession } from "@/lib/staff/session";
import { fetchEventCapacity } from "@/lib/storyblok/eventCapacity";

const limited = createLimiter(10 * 60 * 1000, 8);

const text = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");

/** The page the form came from, taken only from the known locales. */
function pageFor(form: FormData, query = "") {
  const locale = text(form.get("locale"));
  return `/${isLocale(locale) ? locale : "ru_ru"}/admin/registrations${query}`;
}

export async function login(form: FormData) {
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
  const name = text(form.get("login")).trim().toLowerCase();
  if (limited(ip)) redirect(pageFor(form, "?e=wait"));

  const staff = name ? await findStaffForLogin(name) : null;
  const ok = staff
    ? await verifyPassword(text(form.get("password")), staff.passwordHash)
    : await verifyAgainstNobody(text(form.get("password")));
  if (!staff || !ok) redirect(pageFor(form, "?e=bad"));

  await startSession(staff.id);
  redirect(pageFor(form));
}

export async function logout(form: FormData) {
  await endSession();
  redirect(pageFor(form));
}

/**
 * Lets a guest in at the door, or takes the mark back. It ends in a redirect to
 * the page, like the sign-in: the browser then loads the page afresh instead of
 * waiting for a streamed re-render, which some networks cut off with a 504.
 */
export async function toggleAttended(form: FormData) {
  const staff = await currentStaff();
  const uuid = text(form.get("event"));
  const id = Number(text(form.get("id")));

  if (staff && isEventUuid(uuid) && Number.isInteger(id)) {
    const event = await fetchEventCapacity(uuid);
    if (event && canSeeEvent(staff, event.store)) {
      await setAttended(id, uuid, text(form.get("attended")) === "1");
    }
  }
  redirect(pageFor(form));
}
