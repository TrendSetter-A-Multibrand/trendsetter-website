import { BonusRarusError } from "@/lib/bonusRarus/client";
import { accountEnabled } from "@/lib/bonusRarus/customer";

/** Shared by the account routes: the switch, the caller's address, and how a failure is told. */

/** Off wherever the demo is not set up - the live site among them - as if the route were not there. */
export function disabled(): Response | null {
  return accountEnabled() ? null : new Response("Not found", { status: 404 });
}

export function callerIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
}

export function failure(e: unknown): Response {
  if (e instanceof BonusRarusError) {
    return Response.json({ error: e.customerMessage }, { status: e.status >= 500 ? 502 : 400 });
  }
  return Response.json({ error: "Не удалось выполнить операцию. Попробуйте ещё раз." }, { status: 502 });
}
