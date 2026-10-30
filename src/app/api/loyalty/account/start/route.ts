import { normalizePhone } from "@/lib/bonusRarus/loyalty";
import { registrationForm, toRegistrationBody } from "@/lib/bonusRarus/registrationForm";
import { startLogin, startRegistration } from "@/lib/bonusRarus/customer";
import { clearSession, writePending } from "@/lib/bonusRarus/session";
import { callerIp, disabled, failure } from "@/lib/bonusRarus/routeKit";
import { createLimiter } from "@/lib/rateLimit";

// Every call here makes the service send a code, and in a real space every
// code is a paid SMS: few per address, fewer per phone.
const perIp = createLimiter(10 * 60 * 1000, 10);
const perPhone = createLimiter(10 * 60 * 1000, 3);

type Body = {
  phone?: string;
  /** Present when the person is registering: the cabinet's fields, as the form drew them. */
  values?: Record<string, unknown>;
  personalDataAccepted?: boolean;
  newslettersAccepted?: boolean;
};

/**
 * Step one of the cabinet: a phone alone signs in - the service sends a code,
 * or says there is nobody with that phone, and the page then shows the
 * registration form; a phone with the form registers - the service sends a
 * code and creates nobody until it comes back. The secret that goes with the
 * code stays in an httpOnly cookie for /confirm.
 */
export async function POST(request: Request) {
  const off = disabled();
  if (off) return off;
  if (perIp(callerIp(request))) return Response.json({ error: "Слишком много попыток, попробуйте позже" }, { status: 429 });

  const body = (await request.json().catch(() => null)) as Body | null;
  const phone = normalizePhone(typeof body?.phone === "string" ? body.phone : "");
  if (!body || !phone) return Response.json({ error: "Проверьте номер телефона" }, { status: 400 });
  if (perPhone(phone)) return Response.json({ error: "Слишком много попыток, попробуйте позже" }, { status: 429 });

  try {
    if (!body.values) {
      const sent = await startLogin(phone);
      if (sent === "not_found") return Response.json({ status: "register", fields: await registrationForm() });
      await clearSession();
      await writePending({ ...sent, mode: "login", phone });
      return Response.json({ status: "code", channel: sent.channel, codeLength: sent.codeLength });
    }

    if (!body.personalDataAccepted) {
      return Response.json({ error: "Нужно согласие на обработку персональных данных" }, { status: 400 });
    }
    const checked = toRegistrationBody(await registrationForm(), { ...body.values, phone });
    if (!checked.ok) return Response.json({ error: checked.error }, { status: 400 });

    const sent = await startRegistration({
      ...checked.body,
      phone,
      personal_data_accepted: true,
      receive_newsletters_accepted: Boolean(body.newslettersAccepted),
    });
    await clearSession();
    await writePending({ ...sent, mode: "register", phone });
    return Response.json({ status: "code", channel: sent.channel, codeLength: sent.codeLength });
  } catch (e) {
    return failure(e);
  }
}
