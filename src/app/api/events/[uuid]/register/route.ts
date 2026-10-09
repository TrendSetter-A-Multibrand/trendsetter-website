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
} from "@/lib/eventSignup";
import { sendMail } from "@/lib/mail";
import { createLimiter } from "@/lib/rateLimit";
import { fetchEventCapacity } from "@/lib/storyblok/eventCapacity";

const limited = createLimiter(10 * 60 * 1000, 5);

/** Organiser's note; fire and forget - a mail failure never undoes a sign-up. */
function notifyOrganiser(title: string, email: string, left: number | null) {
  const to = process.env.EVENTS_TO || recipientFor();
  if (!to) return;
  const rest = left === null ? "без ограничения" : String(left);
  sendMail({
    to,
    replyTo: email,
    subject: `[Сайт] Запись на событие: ${title}`,
    text: `${email} записался(лась) на «${title}».\nОсталось мест: ${rest}`,
  }).catch(() => {});
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
    const { email } = parsed.value;
    const result = await register(uuid, email, event.seats);
    if (result === "full") return Response.json({ error: "full" }, { status: 409 });
    const left = seatsLeft(event.seats, await countRegistrations(uuid));
    if (result === "duplicate") {
      return Response.json({ ok: true, already: true, left });
    }
    notifyOrganiser(event.title, email, left);
    return Response.json({ ok: true, left });
  } catch (e) {
    const status = e instanceof DbNotConfigured ? 503 : 500;
    return Response.json({ error: "unavailable" }, { status });
  }
}
