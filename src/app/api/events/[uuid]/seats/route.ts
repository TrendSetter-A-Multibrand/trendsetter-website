import { DbNotConfigured } from "@/lib/db/client";
import { countRegistrations } from "@/lib/db/queries/registrations";
import { demoCapacity, isEventUuid, isSignupDemo, seatsLeft, signupShut } from "@/lib/eventSignup";
import { fetchEventCapacity } from "@/lib/storyblok/eventCapacity";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await ctx.params;
  if (!isEventUuid(uuid)) return Response.json({ error: "not found" }, { status: 404 });

  const demo = isSignupDemo();
  const found = await fetchEventCapacity(uuid).catch(() => undefined);
  if (found === undefined && !demo) {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
  if (!found && !demo) return Response.json({ error: "not found" }, { status: 404 });
  const event = demo ? demoCapacity(found ?? null) : found!;

  const shut = signupShut(event);
  if (shut) return Response.json({ open: false, left: null, reason: shut });

  if (demo) return Response.json({ open: true, left: event.seats });

  try {
    const left = seatsLeft(event.seats, await countRegistrations(uuid));
    if (left === 0) return Response.json({ open: false, left, reason: "full" });
    return Response.json({ open: true, left });
  } catch (e) {
    const status = e instanceof DbNotConfigured ? 503 : 500;
    return Response.json({ error: "unavailable" }, { status });
  }
}
