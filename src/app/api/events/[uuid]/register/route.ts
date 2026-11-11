import { newCancelToken } from "@/lib/cancelToken";
import { DbNotConfigured } from "@/lib/db/client";
import { countRegistrations, register } from "@/lib/db/queries/registrations";
import { recipientFor } from "@/lib/contact";
import {
  demoCapacity,
  isEventUuid,
  isSignupDemo,
  parseSignup,
  seatsLeft,
  signupShut,
  type Signup,
} from "@/lib/eventSignup";
import { defaultLocale } from "@/lib/i18n/locales";
import { guestConfirmation, mapLink, whenText } from "@/lib/eventMail";
import { sendMail } from "@/lib/mail";
import { createLimiter } from "@/lib/rateLimit";
import { pageUrl, siteName } from "@/lib/site";
import { fetchEventCapacity, type EventCapacity } from "@/lib/storyblok/eventCapacity";
import { fetchStoreRefs } from "@/lib/storyblok/storeRefs";
import { storeOfEvent } from "@/lib/storeMatch";

const limited = createLimiter(10 * 60 * 1000, 5);

/** Organiser's note; fire and forget - a mail failure never undoes a sign-up. */
function notifyOrganiser(title: string, guest: Signup, left: number | null) {
  const to = process.env.EVENTS_TO || recipientFor();
  if (!to) return;
  const rest = left === null ? "без ограничения" : String(left);
  sendMail({
    to,
    replyTo: guest.email,
    subject: `[Сайт] Запись на событие: ${title}`,
    text: [
      `${guest.name} записался(лась) на «${title}».`,
      `Телефон: ${guest.phone}`,
      `E-mail: ${guest.email}`,
      `Осталось мест: ${rest}`,
    ].join("\n"),
  }).catch(() => {});
}

/**
 * The guest's own confirmation, with the place, the map and a link to cancel.
 * The sender and the address of the links come from the settings (MAIL_FROM and
 * the site address), so a change of domain needs no change here.
 */
async function notifyGuest(event: EventCapacity, guest: Signup, token: string) {
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

export async function POST(
  request: Request,
  ctx: { params: Promise<{ uuid: string }> },
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
  if (limited(ip)) return Response.json({ error: "too many" }, { status: 429 });

  const { uuid } = await ctx.params;
  const body = await request.json().catch(() => null);

  // Hidden field a person never fills; a bot that does gets a quiet "ok".
  if (body && typeof body === "object" && (body as { website?: string }).website) {
    return Response.json({ ok: true });
  }

  const parsed = parseSignup(body);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  if (!isEventUuid(uuid)) return Response.json({ error: "not found" }, { status: 404 });
  const demo = isSignupDemo();
  const found = await fetchEventCapacity(uuid).catch(() => undefined);
  if (found === undefined && !demo) {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
  if (!found && !demo) return Response.json({ error: "not found" }, { status: 404 });
  const event = demo ? demoCapacity(found ?? null) : found!;

  const shut = signupShut(event);
  if (shut) return Response.json({ error: shut }, { status: 410 });

  // Demo: the form is checked as usual, but nothing is stored or mailed
  if (demo) return Response.json({ ok: true, left: event.seats });

  try {
    const cancel = newCancelToken();
    const result = await register(
      uuid,
      { ...parsed.value, cancelHash: cancel.hash },
      event.seats,
    );
    if (result === "full") return Response.json({ error: "full" }, { status: 409 });
    const left = seatsLeft(event.seats, await countRegistrations(uuid));
    if (result === "duplicate") {
      return Response.json({ ok: true, already: true, left });
    }
    notifyOrganiser(event.title, parsed.value, left);
    notifyGuest(event, parsed.value, cancel.token).catch(() => {});
    return Response.json({ ok: true, left });
  } catch (e) {
    const status = e instanceof DbNotConfigured ? 503 : 500;
    return Response.json({ error: "unavailable" }, { status });
  }
}
