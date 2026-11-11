import { accountEnabled } from "@/lib/bonusRarus/customer";
import { confirmEventSignup } from "@/lib/eventLoyalty";
import { isEventUuid, parseSignup, signupShut } from "@/lib/eventSignup";
import { fetchEventCapacity } from "@/lib/storyblok/eventCapacity";

/**
 * Step two of signing up through the loyalty programme: the code from the SMS.
 * The form comes along again (nothing about the guest is kept between the two
 * steps) and is checked again; the phone is the one the code went to.
 */
export async function POST(
  request: Request,
  ctx: { params: Promise<{ uuid: string }> },
) {
  if (!accountEnabled()) return new Response("Not found", { status: 404 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
  const { uuid } = await ctx.params;
  if (!isEventUuid(uuid)) return Response.json({ error: "not found" }, { status: 404 });

  const body = (await request.json().catch(() => null)) as { code?: unknown } | null;
  const parsed = parseSignup(body);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const event = await fetchEventCapacity(uuid).catch(() => undefined);
  if (event === undefined) return Response.json({ error: "unavailable" }, { status: 502 });
  if (!event) return Response.json({ error: "not found" }, { status: 404 });
  const shut = signupShut(event);
  if (shut) return Response.json({ error: shut }, { status: 410 });

  const code = typeof body?.code === "string" ? body.code.trim() : "";
  const step = await confirmEventSignup(uuid, event, parsed.value, code, ip);
  return Response.json(step.body, { status: step.status });
}
