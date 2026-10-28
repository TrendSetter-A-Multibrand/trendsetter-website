import { bonusRarus, BonusRarusError } from "@/lib/bonusRarus/client";
import type { RegistrationBody } from "@/lib/bonusRarus/registrationForm";

/**
 * The demo's own shop, read off a card in the cabinet ("ТехноМир Москва.",
 * internal id 1) - good enough to register a card against while testing. A real
 * launch wants the site's own shop set up in the cabinet and its id here.
 */
const SHOP_ID = process.env.BONUS_RARUS_SHOP_ID || "1";

/** "+7 999 000-00-01" or "89990000001" -> "79990000001", what the API wants. */
export function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (digits.length === 10) digits = "7" + digits;
  return /^7\d{10}$/.test(digits) ? digits : null;
}

export type RegisterInput = RegistrationBody & {
  personalDataAccepted: boolean;
  newslettersAccepted: boolean;
};

export type RegisterResult =
  | { status: "registered"; card: { barcode: string; balance: number; level: string } }
  | { status: "code_required"; sessionId: string; channel: string; receiver: string };

type TOTPResponse = {
  session: { id: string };
  instruction: { channel: string; reciever: string; duration: number };
};
type Client = { cards?: { barcode: string; balance?: number; card_level?: { name?: string } }[] };

const isTOTP = (data: unknown): data is TOTPResponse =>
  !!data && typeof data === "object" && "session" in data && "instruction" in data;

function fromClient(data: Client): RegisterResult {
  const card = data.cards?.[0];
  return {
    status: "registered",
    card: { barcode: card?.barcode ?? "", balance: card?.balance ?? 0, level: card?.card_level?.name ?? "" },
  };
}

/**
 * Starts (or, with a code, finishes) registering a client. The vendor's own
 * spec marks `POST /client` with a 2FA badge but never names the header a code
 * goes back in - the one documented 2FA header anywhere in the spec is
 * `x-totp-expire`, for a different purpose. `X-Totp-Session` / `X-Totp-Code`
 * below are this site's best guess at the matching convention, sent back
 * exactly once with whatever the person actually typed - never guessed or
 * retried here. The TOTP answer also carries a `secret` "для отправки при
 * проверке введенного кода" - where it goes is just as undocumented, and the
 * site flow's `POST /client` shows no 2FA step at all. Confirming both with the
 * vendor is on the question list this feature shipped with.
 */
export async function registerClient(
  input: RegisterInput,
  code?: { sessionId: string; value: string },
): Promise<RegisterResult> {
  const { personalDataAccepted, newslettersAccepted, ...fields } = input;
  const body = {
    ...fields,
    shop_id: SHOP_ID,
    channel: "webform",
    personal_data_accepted: personalDataAccepted,
    receive_newsletters_accepted: newslettersAccepted,
  };

  const data = await bonusRarus<TOTPResponse | Client>("/client", {
    method: "POST",
    body: JSON.stringify(body),
    headers: code ? { "X-Totp-Session": code.sessionId, "X-Totp-Code": code.value } : undefined,
  });

  if (isTOTP(data)) {
    return { status: "code_required", sessionId: data.session.id, channel: data.instruction.channel, receiver: data.instruction.reciever };
  }
  return fromClient(data);
}

export type CardLookup = { balance: number; level: string; status: string };

/** Only what a visitor needs to see of their own card - never the fuller record a lookup can return. */
export async function cardByBarcode(barcode: string): Promise<CardLookup> {
  const data = await bonusRarus<{ balance?: number; state?: string; card_level?: { name?: string } }>(
    `/card/by-barcode/${encodeURIComponent(barcode)}`,
  );
  return { balance: data.balance ?? 0, level: data.card_level?.name ?? "", status: data.state ?? "" };
}

export type CertificateLookup = { balance: number; holded: number; status: string };

export async function certificateByCode(code: string): Promise<CertificateLookup> {
  const data = await bonusRarus<{ status?: { balance?: number; holded?: number; status?: string } }>(
    `/certificate/${encodeURIComponent(code)}`,
  );
  return { balance: data.status?.balance ?? 0, holded: data.status?.holded ?? 0, status: data.status?.status ?? "" };
}

export { BonusRarusError };
