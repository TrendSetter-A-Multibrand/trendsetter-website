import { newCancelToken } from "@/lib/cancelToken";
import { DbNotConfigured } from "@/lib/db/client";
import { countRegistrations, registerCard } from "@/lib/db/queries/registrations";
import {
  cardBarcodeOf,
  commitRegistration,
  confirmLogin,
  startLogin,
  startRegistration,
  type Session,
} from "@/lib/bonusRarus/customer";
import { BonusRarusError } from "@/lib/bonusRarus/client";
import { registrationForm, throwawayPassword, toRegistrationBody } from "@/lib/bonusRarus/registrationForm";
import { clearPending, readPending, writePending, writeSession } from "@/lib/bonusRarus/session";
import { notifyGuest, notifyOrganiser } from "@/lib/eventNotify";
import { seatsLeft, type Signup } from "@/lib/eventSignup";
import { createLimiter } from "@/lib/rateLimit";
import type { EventCapacity } from "@/lib/storyblok/eventCapacity";

/**
 * Signing up for an event as a guest of the loyalty programme. The phone is
 * confirmed with the code the loyalty service sends - to register the guest if
 * they have no card yet, to sign them in if they have - and only then is the
 * sign-up written, with nothing about the person but their card number. The
 * name, phone and e-mail they typed go to the service and, once, to the
 * confirmation letter; this site keeps none of them.
 */

// Every code is a paid SMS: few per phone, a little more per address
const perPhone = createLimiter(10 * 60 * 1000, 3);
const perIp = createLimiter(10 * 60 * 1000, 10);

export type StepResult =
  | { status: 200; body: { ok: true; step: "code"; channel: string; codeLength: number } }
  | { status: 200; body: { ok: true; left: number | null; already?: true } }
  | { status: number; body: { error: string } };

const error = (status: number, message: string): StepResult => ({ status, body: { error: message } });

/** A loyalty-service failure told as the service tells it. */
function told(e: unknown): StepResult {
  if (e instanceof BonusRarusError) return error(e.status >= 500 ? 502 : 400, e.customerMessage);
  if (e instanceof DbNotConfigured) return error(503, "unavailable");
  return error(502, "Не удалось выполнить операцию. Попробуйте ещё раз.");
}

/** Writes the sign-up once the phone is proved, then sends the letters. */
async function finish(uuid: string, event: EventCapacity, guest: Signup, session: Session): Promise<StepResult> {
  const barcode = await cardBarcodeOf(session.token);
  if (!barcode) return error(502, "Не удалось выполнить операцию. Попробуйте ещё раз.");

  const cancel = newCancelToken();
  const result = await registerCard(uuid, { cardBarcode: barcode, cancelHash: cancel.hash }, event.seats);
  if (result === "full") return error(409, "full");

  await clearPending();
  // The guest is now a member: the cabinet at /card opens for them without another code
  await writeSession(session);

  const left = seatsLeft(event.seats, await countRegistrations(uuid));
  if (result === "duplicate") return { status: 200, body: { ok: true, left, already: true } };

  notifyOrganiser(event.title, null, left);
  notifyGuest(event, guest, cancel.token).catch(() => {});
  return { status: 200, body: { ok: true, left } };
}

/** Step one: asks the service to send the code (or to register on the spot, where it asks for none). */
export async function startEventSignup(
  uuid: string,
  event: EventCapacity,
  guest: Signup,
  ip: string,
): Promise<StepResult> {
  if (perIp(ip) || perPhone(guest.phone)) return error(429, "too many");
  const phone = guest.phone.replace(/\D/g, "");

  try {
    const left = seatsLeft(event.seats, await countRegistrations(uuid));
    if (left === 0) return error(409, "full");

    const sent = await startLogin(phone);
    if (sent !== "not_found") {
      await writePending({ ...sent, mode: "login", phone, event: uuid });
      return { status: 200, body: { ok: true, step: "code", channel: sent.channel, codeLength: sent.codeLength } };
    }

    const checked = toRegistrationBody(await registrationForm(), {
      name: guest.name,
      phone,
      email: guest.email,
      password: throwawayPassword(),
    });
    if (!checked.ok) return error(400, checked.error);
    const started = await startRegistration({
      ...checked.body,
      phone,
      personal_data_accepted: true,
      receive_newsletters_accepted: false,
    });
    if (started.kind === "registered") return finish(uuid, event, guest, started.session);
    await writePending({ ...started.sent, mode: "register", phone, event: uuid });
    return { status: 200, body: { ok: true, step: "code", channel: started.sent.channel, codeLength: started.sent.codeLength } };
  } catch (e) {
    return told(e);
  }
}

/** Step two: the code the guest typed, sent on once with the secret kept from step one. */
export async function confirmEventSignup(
  uuid: string,
  event: EventCapacity,
  guest: Signup,
  code: string,
  ip: string,
): Promise<StepResult> {
  if (perIp(ip)) return error(429, "too many");
  const pending = await readPending();
  if (!pending || pending.event !== uuid) return { status: 400, body: { error: "expired" } };
  if (!/^\d{4,8}$/.test(code)) return error(400, "code");

  try {
    let session: Session;
    if (pending.mode === "login") {
      session = await confirmLogin(pending.phone, pending, code);
    } else {
      const checked = toRegistrationBody(await registrationForm(), {
        name: guest.name,
        phone: pending.phone,
        email: guest.email,
        password: throwawayPassword(),
      });
      if (!checked.ok) return error(400, checked.error);
      session = await commitRegistration(
        { ...checked.body, phone: pending.phone, personal_data_accepted: true, receive_newsletters_accepted: false },
        pending,
        code,
      );
    }
    return finish(uuid, event, guest, session);
  } catch (e) {
    return told(e);
  }
}
