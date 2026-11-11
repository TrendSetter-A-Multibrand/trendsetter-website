import { recipientFor } from "@/lib/contact";
import type { Signup } from "@/lib/eventSignup";
import { guestConfirmation, mapLink, whenText } from "@/lib/eventMail";
import { defaultLocale } from "@/lib/i18n/locales";
import { sendMail } from "@/lib/mail";
import { pageUrl, siteName } from "@/lib/site";
import type { EventCapacity } from "@/lib/storyblok/eventCapacity";
import { fetchStoreRefs } from "@/lib/storyblok/storeRefs";
import { storeOfEvent } from "@/lib/storeMatch";

/**
 * Organiser's note; fire and forget - a mail failure never undoes a sign-up.
 * A guest of the loyalty programme is not named in it: their details are the
 * loyalty service's, and the cabinet shows them there (`guest` is left out).
 */
export function notifyOrganiser(title: string, guest: Signup | null, left: number | null) {
  const to = process.env.EVENTS_TO || recipientFor();
  if (!to) return;
  const rest = left === null ? "без ограничения" : String(left);
  sendMail({
    to,
    replyTo: guest?.email,
    subject: `[Сайт] Запись на событие: ${title}`,
    text: guest
      ? [
          `${guest.name} записался(лась) на «${title}».`,
          `Телефон: ${guest.phone}`,
          `E-mail: ${guest.email}`,
          `Осталось мест: ${rest}`,
        ].join("\n")
      : [`Новая запись на «${title}».`, `Осталось мест: ${rest}`, "Список гостей: в кабинете записей на сайте."].join("\n"),
  }).catch(() => {});
}

/**
 * The guest's own confirmation, with the place, the map and a link to cancel.
 * The sender and the address of the links come from the settings (MAIL_FROM and
 * the site address), so a change of domain needs no change here.
 */
export async function notifyGuest(
  event: EventCapacity,
  guest: { email: string; name: string },
  token: string,
) {
  const store = storeOfEvent(event, await fetchStoreRefs());
  const { subject, text, html } = guestConfirmation({
    title: event.title,
    when: whenText(event.date),
    place: store?.name || event.location,
    address: store?.address ?? "",
    mapUrl: mapLink(store),
    guestName: guest.name,
    cancelUrl: `${pageUrl(defaultLocale, "/events/cancel")}?t=${token}`,
    signature: process.env.MAIL_SIGNATURE || `Команда ${siteName}`,
  });
  await sendMail({ to: guest.email, subject, text, html });
}
