import { BonusRarusError, registerClient } from "@/lib/bonusRarus/loyalty";
import { registrationForm, toRegistrationBody } from "@/lib/bonusRarus/registrationForm";
import { createLimiter } from "@/lib/rateLimit";

const limited = createLimiter(10 * 60 * 1000, 10);

type Body = {
  values?: Record<string, unknown>;
  personalDataAccepted?: boolean;
  newslettersAccepted?: boolean;
  code?: { sessionId?: string; value?: string };
};

/**
 * A demo wire-up of "Система лояльности" to the vendor's test space (see the
 * project memory on Bonus-Rarus): proves the site can register a client and
 * carry a 2FA code back, not a production integration. `BONUS_RARUS_REGISTRATION_TOKEN`
 * is the "Розница 3.0" till token, not a site token - registerClient() explains why
 * that is as far as this can go until the vendor issues one. What the person
 * typed is checked against the cabinet's own field list, the one the form drew.
 */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
  if (limited(ip)) return Response.json({ error: "too many" }, { status: 429 });

  const body = (await request.json().catch(() => null)) as Body | null;
  if (!body || typeof body !== "object" || !body.values || typeof body.values !== "object") {
    return Response.json({ error: "bad body" }, { status: 400 });
  }
  if (!body.personalDataAccepted) {
    return Response.json({ error: "Нужно согласие на обработку персональных данных" }, { status: 400 });
  }

  const code =
    body.code?.sessionId && body.code?.value
      ? { sessionId: body.code.sessionId, value: body.code.value }
      : undefined;

  try {
    const checked = toRegistrationBody(await registrationForm(), body.values);
    if (!checked.ok) return Response.json({ error: checked.error }, { status: 400 });

    const result = await registerClient(
      {
        ...checked.body,
        personalDataAccepted: true,
        newslettersAccepted: Boolean(body.newslettersAccepted),
      },
      code,
    );
    return Response.json(result);
  } catch (e) {
    if (e instanceof BonusRarusError) {
      return Response.json({ error: e.customerMessage }, { status: e.status >= 500 ? 502 : 400 });
    }
    return Response.json({ error: "Не удалось выполнить операцию. Попробуйте ещё раз." }, { status: 502 });
  }
}
