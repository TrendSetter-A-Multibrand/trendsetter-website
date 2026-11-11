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

  // The look of the company's own mails (the welcome book's): a grey page, a
  // white card, red wordmark, mono labels in brackets, a yellow mark on a word.
  // Tables and inline styles only - mail clients take nothing else.
  const mono = "font-family:'Courier New',Courier,monospace;font-weight:400;font-style:normal";
  const sans = "font-family:Arial,Helvetica,sans-serif;font-weight:400;font-style:normal";
  const label = (t: string, color = "#A22325") =>
    `<p style="margin:0 0 17px;${mono};font-size:10px;line-height:16px;letter-spacing:.5px;color:${color}">${t}</p>`;

  const detail = (k: string, v: string) =>
    `<tr><td width="96" valign="top" style="padding:13px 0;border-bottom:1px solid #D9D9D9;${mono};font-size:11px;line-height:22px;color:#A22325">${esc(k)}</td><td style="padding:13px 0;border-bottom:1px solid #D9D9D9;${sans};font-size:15px;line-height:22px;color:#252120">${v}</td></tr>`;
  const details = [
    m.when && detail("КОГДА", esc(m.when)),
    where && detail("ГДЕ", esc(where)),
    detail("ЗАПИСЬ НА", esc(m.guestName)),
  ]
    .filter(Boolean)
    .join("");

  const mapButton = m.mapUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px"><tr><td bgcolor="#ffffff" style="border:1px solid #fff"><a href="${esc(m.mapUrl)}" target="_blank" style="display:inline-block;padding:15px 19px;${mono};font-size:11px;line-height:18px;letter-spacing:.3px;text-decoration:none;color:#252120">ОТКРЫТЬ НА КАРТЕ &nbsp; ↗</a></td></tr></table>`
    : "";

  const html = `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(m.title)}</title></head>
<body style="${sans};-webkit-text-size-adjust:100%;margin:0;padding:0;background:#F3F3F3">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">Вы записаны на «${esc(m.title)}»${m.when ? `, ${esc(m.when)}` : ""}. Адрес, карта и отмена записи внутри.</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#F3F3F3"><tr><td align="center" style="padding:24px 10px">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#fff">
<tr><td style="padding:25px 26px 22px;border-bottom:1px solid #D9D9D9">
<span style="display:block;${sans};font-size:25px;line-height:30px;font-weight:700;color:#A22325">TRENDSETTER</span>
<p style="margin:13px 0 0;${mono};font-size:9px;line-height:15px;letter-spacing:1px;color:#4A4644">СОБЫТИЯ / ЗАПИСЬ</p></td></tr>
<tr><td style="padding:35px 26px 30px">
${label('[ЗАПИСЬ ПОДТВЕРЖДЕНА] <span style="color:#4A4644">ЗДРАВСТВУЙТЕ!</span>')}
<h1 style="margin:0 0 21px;${sans};font-size:38px;line-height:43px;letter-spacing:-1.3px;color:#252120">Вы <span style="background-color:#F3D03E;color:#252120">записаны</span><br>на событие.</h1>
<p style="margin:0;${sans};font-size:15px;line-height:24px;color:#4A4644">Будем рады видеть вас на <strong style="font-weight:700;color:#252120">«${esc(m.title)}»</strong>.</p>
</td></tr>
<tr><td style="padding:0 26px 30px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td width="152" style="${mono};font-size:10px;line-height:16px;color:#4A4644">[ДЕТАЛИ]</td><td style="border-top:1px solid #D9D9D9;font-size:1px">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:9px">${details}</table>
</td></tr>
<tr><td bgcolor="#A22325" style="padding:29px 26px 31px">
<p style="margin:0 0 18px;${mono};font-size:10px;line-height:16px;color:#fff">[ЖДЁМ ВАС]</p>
<h2 style="margin:0;${sans};font-size:34px;line-height:37px;letter-spacing:-1px;color:#fff">Увидимся<br>в TRENDSETTER.</h2>
${mapButton}
</td></tr>
<tr><td style="padding:26px 26px 8px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #D9D9D9"><tr><td style="padding:22px">
<p style="margin:0 0 10px;${mono};font-size:10px;line-height:16px;letter-spacing:.5px;color:#A22325">[ИЗМЕНИЛИСЬ ПЛАНЫ?]</p>
<p style="margin:0;${sans};font-size:14px;line-height:23px;color:#4A4644">Освободите место для других гостей: <a href="${esc(m.cancelUrl)}" style="color:#A22325;text-decoration:underline">отменить запись</a>.</p>
</td></tr></table>
</td></tr>
<tr><td style="padding:18px 26px 26px">
<p style="margin:0 0 20px;${sans};font-size:14px;line-height:23px;color:#4A4644">Это письмо отправлено автоматически. Если есть вопросы, просто ответьте на него.</p>
<p style="margin:0;${sans};font-size:14px;line-height:23px;color:#252120"><strong style="font-weight:700">${esc(m.signature)}</strong></p>
</td></tr>
</table></td></tr></table></body></html>`;

  return { subject: `Вы записаны: «${m.title}»`, text, html };
}
