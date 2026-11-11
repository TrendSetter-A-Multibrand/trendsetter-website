import { eventDate } from "@/lib/events";
import type { StoreRef } from "@/lib/storeMatch";

/** A map link for the place: the pin when the store has coordinates, else a search by address. */
export function mapLink(store: Pick<StoreRef, "address" | "lat" | "lon"> | null): string {
  if (!store) return "";
  if (store.lat !== undefined && store.lon !== undefined) {
    return `https://yandex.ru/maps/?pt=${store.lon},${store.lat},pm2rdm&z=17&l=map`;
  }
  return store.address
    ? `https://yandex.ru/maps/?text=${encodeURIComponent(store.address)}`
    : "";
}

/** "12 ноября, 15:00" for the editor's "2026-11-12 15:00"; empty when there is no date. */
export function whenText(date: string): string {
  const { day, monthFull, time } = eventDate(date);
  if (!day) return "";
  return [`${day} ${monthFull}`, time].filter(Boolean).join(", ");
}

export type GuestMail = {
  title: string;
  /** Read aloud, "12 ноября, 15:00"; empty when the event has no date. */
  when: string;
  /** The store's name, or the «Место» line when the event is not at one of ours. */
  place: string;
  address: string;
  mapUrl: string;
  guestName: string;
  cancelUrl: string;
  signature: string;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * The note a guest gets when they sign up. A service message about their own
 * sign-up: it carries no promotion, so it needs no consent to mailings.
 */
export function guestConfirmation(m: GuestMail): { subject: string; text: string; html: string } {
  const where = [m.place, m.address].filter(Boolean).join(", ");
  const rows: [string, string, string?][] = [];
  if (m.when) rows.push(["Когда", m.when]);
  if (where) rows.push(["Где", where]);
  if (m.mapUrl) rows.push(["Карта", m.mapUrl, m.mapUrl]);

  const text = [
    "Здравствуйте!",
    "",
    `Вы записаны на «${m.title}».`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    `Запись оформлена на: ${m.guestName}`,
    "",
    `Планы изменились? Отмените запись по ссылке: ${m.cancelUrl}`,
    "",
    "Это письмо отправлено автоматически; если есть вопросы, просто ответьте на него.",
    "",
    m.signature,
  ].join("\n");

  const cell = (v: string, link?: string) =>
    link ? `<a href="${esc(link)}" style="color:#000">Открыть на карте</a>` : esc(v);
  const html = `<!doctype html><html lang="ru"><body style="margin:0;padding:24px;background:#fff;color:#000;font:16px/1.5 Arial,Helvetica,sans-serif">
<p style="margin:0 0 16px">Здравствуйте!</p>
<p style="margin:0 0 16px">Вы записаны на <b>«${esc(m.title)}»</b>.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px">
${rows
  .map(
    ([k, v, link]) =>
      `<tr><td style="padding:2px 16px 2px 0;color:#666">${esc(k)}</td><td style="padding:2px 0">${cell(v, link)}</td></tr>`,
  )
  .join("\n")}
<tr><td style="padding:2px 16px 2px 0;color:#666">Запись на</td><td style="padding:2px 0">${esc(m.guestName)}</td></tr>
</table>
<p style="margin:0 0 16px">Планы изменились? <a href="${esc(m.cancelUrl)}" style="color:#000">Отменить запись</a></p>
<p style="margin:0 0 16px;color:#666;font-size:14px">Это письмо отправлено автоматически; если есть вопросы, просто ответьте на него.</p>
<p style="margin:0">${esc(m.signature)}</p>
</body></html>`;

  return { subject: `Вы записаны: «${m.title}»`, text, html };
}
