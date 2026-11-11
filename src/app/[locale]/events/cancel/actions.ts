"use server";

import { redirect } from "next/navigation";
import { cancelByToken } from "@/lib/db/queries/registrations";
import { isLocale, publicPath } from "@/lib/i18n/locales";
import { recipientFor } from "@/lib/contact";
import { sendMail } from "@/lib/mail";
import { createLimiter } from "@/lib/rateLimit";
import { fetchEventCapacity } from "@/lib/storyblok/eventCapacity";
import { headers } from "next/headers";

const limited = createLimiter(10 * 60 * 1000, 10);

const text = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");

/**
 * The guest's own cancellation: the link in their e-mail is the proof it is
 * them. The sign-up is deleted, and the organiser is told so a seat freed is
 * not a surprise. It ends in a redirect, like the cabinet's actions.
 */
export async function cancelSignup(form: FormData) {
  const locale = text(form.get("locale"));
  const back = (query: string) =>
    redirect(publicPath(`/${isLocale(locale) ? locale : "ru_ru"}/events/cancel${query}`));

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
  if (limited(ip)) back("?e=wait");

  const token = text(form.get("t")).slice(0, 100);
  const gone = token ? await cancelByToken(token).catch(() => null) : null;
  if (!gone) back("?e=used");

  const to = process.env.EVENTS_TO || recipientFor();
  if (to && gone) {
    const event = await fetchEventCapacity(gone.eventUuid).catch(() => null);
    sendMail({
      to,
      subject: `[Сайт] Отмена записи: ${event?.title ?? gone.eventUuid}`,
      text: `${gone.name || "Гость"} (${gone.email}) отменил(а) запись на «${event?.title ?? gone.eventUuid}».`,
    }).catch(() => {});
  }
  back("?done=1");
}
