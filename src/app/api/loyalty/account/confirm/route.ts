import { registrationForm, toRegistrationBody } from "@/lib/bonusRarus/registrationForm";
import { commitRegistration, confirmLogin } from "@/lib/bonusRarus/customer";
import { clearPending, readPending, writeSession } from "@/lib/bonusRarus/session";
import { callerIp, disabled, failure } from "@/lib/bonusRarus/routeKit";
import { createLimiter } from "@/lib/rateLimit";

const perIp = createLimiter(10 * 60 * 1000, 10);

type Body = {
  code?: string;
  values?: Record<string, unknown>;
  newslettersAccepted?: boolean;
};

/**
 * Step two: the code the person typed goes to the service once, with the
 * secret kept from step one - never guessed or retried here. Registering, the
 * form comes along again (the service keeps nothing between the steps) and is
 * checked again; the phone is the one the code was sent to, whatever the
 * browser says. On success the client's own token becomes the session.
 */
export async function POST(request: Request) {
  const off = disabled();
  if (off) return off;
  if (perIp(callerIp(request))) return Response.json({ error: "Слишком много попыток, попробуйте позже" }, { status: 429 });

  const pending = await readPending();
  if (!pending) return Response.json({ error: "Код устарел, запросите новый", expired: true }, { status: 400 });

  const body = (await request.json().catch(() => null)) as Body | null;
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (!/^\d{4,8}$/.test(code)) return Response.json({ error: "Введите код из сообщения" }, { status: 400 });

  try {
    let session;
    if (pending.mode === "login") {
      session = await confirmLogin(pending.phone, pending, code);
    } else {
      const checked = toRegistrationBody(await registrationForm(), { ...(body?.values ?? {}), phone: pending.phone });
      if (!checked.ok) return Response.json({ error: checked.error }, { status: 400 });
      session = await commitRegistration(
        {
          ...checked.body,
          phone: pending.phone,
          personal_data_accepted: true,
          receive_newsletters_accepted: Boolean(body?.newslettersAccepted),
        },
        pending,
        code,
      );
    }
    await clearPending();
    await writeSession(session);
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
