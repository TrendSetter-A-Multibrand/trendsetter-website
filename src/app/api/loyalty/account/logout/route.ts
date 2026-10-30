import { clearPending, clearSession } from "@/lib/bonusRarus/session";
import { disabled } from "@/lib/bonusRarus/routeKit";

/** Forgets the client's token on this browser. The service has no call to revoke it. */
export async function POST() {
  const off = disabled();
  if (off) return off;
  await clearSession();
  await clearPending();
  return Response.json({ ok: true });
}
