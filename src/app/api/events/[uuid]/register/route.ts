import { accountEnabled } from "@/lib/bonusRarus/customer";
import { newCancelToken } from "@/lib/cancelToken";
import { DbNotConfigured } from "@/lib/db/client";
import { countRegistrations, register } from "@/lib/db/queries/registrations";
import {
  demoCapacity,
  isEventUuid,
  isSignupDemo,
  parseSignup,
  seatsLeft,
  signupShut,
} from "@/lib/eventSignup";
import { createLimiter } from "@/lib/rateLimit";
import { startEventSignup } from "@/lib/eventLoyalty";
import { notifyGuest, notifyOrganiser } from "@/lib/eventNotify";
import { fetchEventCapacity } from "@/lib/storyblok/eventCapacity";

const limited = createLimiter(10 * 60 * 1000, 5);

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

  // Through the loyalty programme the sign-up is a code away and keeps nothing of the person
  if (accountEnabled()) {
    const step = await startEventSignup(uuid, event, parsed.value, ip);
    return Response.json(step.body, { status: step.status });
  }

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
