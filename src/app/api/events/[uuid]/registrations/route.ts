import { cookies } from "next/headers";
import { DbNotConfigured } from "@/lib/db/client";
import { listRegistrations } from "@/lib/db/queries/registrations";
import { isEventUuid } from "@/lib/eventSignup";
import {
  ADMIN_COOKIE,
  adminSecret,
  cookieMatches,
  registrationsCsv,
  secretMatches,
} from "@/lib/registrationsAdmin";

export async function GET(
  request: Request,
  ctx: { params: Promise<{ uuid: string }> },
) {
  const expected = adminSecret();
  if (!expected) return Response.json({ error: "not found" }, { status: 404 });

  const given = new URL(request.url).searchParams.get("secret");
  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!secretMatches(given, expected) && !cookieMatches(cookie, expected)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { uuid } = await ctx.params;
  if (!isEventUuid(uuid)) return Response.json({ error: "not found" }, { status: 404 });

  try {
    const csv = registrationsCsv(await listRegistrations(uuid));
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
