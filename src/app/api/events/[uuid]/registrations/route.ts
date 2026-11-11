import { DbNotConfigured } from "@/lib/db/client";
import { listRegistrations } from "@/lib/db/queries/registrations";
import { isEventUuid } from "@/lib/eventSignup";
import { registrationsCsv } from "@/lib/registrationsAdmin";
import { guestByBarcode } from "@/lib/bonusRarus/loyalty";
import { withGuests } from "@/lib/guestDirectory";
import { canSeeEvent } from "@/lib/staff/access";
import { currentStaff } from "@/lib/staff/session";
import { fetchEventCapacity } from "@/lib/storyblok/eventCapacity";
import { fetchStoreRefs } from "@/lib/storyblok/storeRefs";
import { storeOfEvent } from "@/lib/storeMatch";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ uuid: string }> },
) {
  const { uuid } = await ctx.params;
  if (!isEventUuid(uuid)) return Response.json({ error: "not found" }, { status: 404 });

  try {
    const staff = await currentStaff();
    if (!staff) return Response.json({ error: "unauthorized" }, { status: 401 });

    const event = await fetchEventCapacity(uuid);
    if (!event || !canSeeEvent(staff, storeOfEvent(event, await fetchStoreRefs())?.uuid ?? "")) {
      return Response.json({ error: "not found" }, { status: 404 });
    }

    const csv = registrationsCsv(await withGuests(await listRegistrations(uuid), guestByBarcode));
    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="registrations-${uuid}.csv"`,
        "cache-control": "no-store",
        "x-robots-tag": "noindex",
      },
    });
  } catch (e) {
    const status = e instanceof DbNotConfigured ? 503 : 500;
    return Response.json({ error: "unavailable" }, { status });
  }
}
