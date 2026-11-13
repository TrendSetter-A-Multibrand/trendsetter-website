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
  // What the service said goes to the server log, never to the visitor. It may quote the
  // SMS provider's request, so keys, phones and codes are blanked first.
  const said = e instanceof Error ? e.message : String(e);
  console.error("bonus-rarus:", said.replace(/api_id=[^&\s"]+/g, "api_id=…").replace(/(?:%[0-9A-F]{2}|\d)+/gi, "#").slice(0, 300));
  if (e instanceof BonusRarusError) {
    // "Обратитесь к сотруднику" is the till's wording; on the site the person can only try again
    const error = /отправить код/i.test(e.customerMessage)
      ? "Не удалось отправить код. Попробуйте ещё раз через минуту"
      : e.customerMessage;
    return Response.json({ error }, { status: e.status >= 500 ? 502 : 400 });
  }
  return Response.json({ error: "Не удалось выполнить операцию. Попробуйте ещё раз." }, { status: 502 });
}
