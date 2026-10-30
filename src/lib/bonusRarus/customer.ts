import { BonusRarusError } from "@/lib/bonusRarus/client";
import type { RegistrationBody } from "@/lib/bonusRarus/registrationForm";

/**
 * The vendor's `customer-flow` - the API their own client cabinet
 * (pXX.cl.bonus-rarus.ru) runs on, and the one place the service registers a
 * client with a confirmation code, signs one in by phone and issues a wallet
 * card. `web-flow`, the flow meant for sites, has none of the three. Whether a
 * site of ours may call it in production is a question to the vendor; until it
 * is answered this backs a demo only (see `accountEnabled`).
 *
 * Nothing here needs our integration token: sign-up and sign-in are open, and
 * everything after them runs on the client's own token, sent as "Bearer ...".
 */
const BASE =
  process.env.BONUS_RARUS_CUSTOMER_BASE || "https://backend-pro.bonus-rarus.ru/p84/customer-flow";

/**
 * The client cabinet on the site is a demo against the vendor's test space.
 * The web integration token they issued for us is what marks an environment
 * that has been set up for it: `.env.local` has it, Vercel does not - so the
 * live site keeps the pages and the routes switched off.
 */
export function accountEnabled(): boolean {
  return Boolean(process.env.BONUS_RARUS_REGISTRATION_TOKEN_WEB);
}

type Envelope<T> = {
  success: boolean;
  message?: string;
  customer_message?: string;
  error?: { reason?: string; type?: string };
  data: T;
};

/**
 * Signing in with a phone nobody has registered answers this, and it means "go
 * and register", not a failure. The live demo puts it in `message` with
 * `error.reason: "unknown"` and `error.type: "apierror.ErrorNotFound"`, while
 * the vendor's own cabinet looks for it in `reason` - so both are read.
 */
export const NOT_FOUND = "Клиент не найден";

const FALLBACK = "Не удалось выполнить операцию. Попробуйте ещё раз.";

/** Token expired or revoked: the page drops the session and asks to sign in again. */
export class SessionExpired extends Error {}

async function call<T>(
  path: string,
  init: { method?: string; body?: unknown; token?: string } = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: init.method ?? "GET",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const body = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok || !body?.success) {
    if (init.token && /токен доступа/i.test(body?.message ?? "")) throw new SessionExpired();
    const reason = body?.error?.reason;
    throw new BonusRarusError(
      res.status >= 500 ? res.status : body?.error?.type?.endsWith("ErrorNotFound") ? 404 : 400,
      body?.customer_message || FALLBACK,
      (reason && reason !== "unknown" ? reason : body?.message) || `${res.status} on ${path}`,
    );
  }
  return body.data;
}

/** What the service answers when it has sent a code: what to keep and what to tell the person. */
export type CodeSent = { secret: string; clientId?: number; channel: string; codeLength: number; duration: number };

type TOTPKey = {
  secret: string;
  client_id?: number;
  channel?: string;
  code_length?: number;
  duration?: number;
};

const toCodeSent = (key: TOTPKey): CodeSent => ({
  secret: key.secret,
  ...(key.client_id ? { clientId: key.client_id } : {}),
  channel: key.channel ?? "phone",
  codeLength: key.code_length ?? 6,
  duration: key.duration ?? 120,
});

export type Session = { token: string; expireAt: number };

type AuthResult = { access_token: string; expire_at: number };

/** Sends a sign-in code to a phone - or says there is nobody with that phone yet. */
export async function startLogin(phone: string): Promise<CodeSent | "not_found"> {
  try {
    return toCodeSent(await call<TOTPKey>("/login", { method: "POST", body: { identity: phone } }));
  } catch (e) {
    if (e instanceof BonusRarusError && (e.message === NOT_FOUND || e.customerMessage === NOT_FOUND)) return "not_found";
    throw e;
  }
}

export async function confirmLogin(phone: string, pending: CodeSent, code: string): Promise<Session> {
  const data = await call<AuthResult>("/confirm", {
    method: "POST",
    body: { client_id: pending.clientId, identity: phone, secret: pending.secret, code },
  });
  return { token: data.access_token, expireAt: data.expire_at };
}

/** The registration the service expects; `channel` names where the client came from. */
export type NewClient = RegistrationBody & {
  phone: string;
  personal_data_accepted: true;
  receive_newsletters_accepted: boolean;
};

function registrationPayload(client: NewClient) {
  const shop = process.env.BONUS_RARUS_SHOP_ID;
  return { ...client, channel: "webform", ...(shop ? { shop_id: shop } : {}) };
}

/** Sends the confirmation code for a new client; nothing is created until the code comes back. */
export async function startRegistration(client: NewClient): Promise<CodeSent> {
  return toCodeSent(
    await call<TOTPKey>("/client/register", { method: "POST", body: registrationPayload(client) }),
  );
}

/** The whole form goes again with the code: the service keeps nothing of it between the two steps. */
export async function commitRegistration(client: NewClient, pending: CodeSent, code: string): Promise<Session> {
  const data = await call<AuthResult>("/client/commit-registration", {
    method: "POST",
    body: { client: registrationPayload(client), secret: pending.secret, code },
  });
  return { token: data.access_token, expireAt: data.expire_at };
}

/* The cabinet: what the service answers, cut down to what the page shows. */

type RawClient = { id: number; name?: string; phone?: string; email?: string; default_card_id?: number };
type RawCard = {
  id: number;
  barcode: string;
  balance?: number;
  state?: string;
  blocked?: boolean;
  card_level?: { name?: string };
};
type RawProfit = {
  card_id: number;
  sale_sum?: number;
  sale_count?: number;
  bonus_added_sum?: number;
  bonus_removed_sum?: number;
  bonus_erased_sum?: number;
};
type RawExpires = { card_id: number; bonus_expires?: { amount: number; date: number }[] | null };
type RawRecord = {
  type: "document" | "transaction";
  document?: {
    id: string;
    event_date: number;
    operation?: string;
    shop_name?: string;
    total_with_discounts?: number;
    bonus_added?: number;
    bonus_removed?: number;
  };
  transaction?: { id: string; event_date: number; amount: number; description?: string };
};
type RawSettings = { apple_wallet_configured?: boolean; google_wallet_configured?: boolean };

/** The cabinet's public settings - the registration fields among them. No token, nothing about anyone. */
export function cabinetSettings<T>(): Promise<T> {
  return call<T>("/settings");
}

export type HistoryRow = {
  id: string;
  date: number;
  title: string;
  /** Spent in roubles, for a purchase or a refund. */
  sum?: number;
  /** Points that came in (positive) or went (negative). */
  points: number;
};

export type Cabinet = {
  name: string;
  phone: string;
  email: string;
  card: { id: number; barcode: string; balance: number; level: string; active: boolean } | null;
  nextExpiry: { amount: number; date: number } | null;
  year: { spent: number; purchases: number; earned: number; used: number };
  history: HistoryRow[];
  wallets: { apple: boolean; google: boolean };
};

/** "79992979324" -> "+7 (999) ***-**-24": enough to recognise one's own number on a shared screen. */
export function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length !== 11) return "";
  return `+7 (${d.slice(1, 4)}) ***-**-${d.slice(9)}`;
}

function historyRow(record: RawRecord): HistoryRow | null {
  if (record.type === "document" && record.document) {
    const doc = record.document;
    const refund = doc.operation === "refund";
    return {
      id: `d-${doc.id}`,
      date: doc.event_date,
      title: `${refund ? "Возврат" : "Покупка"}${doc.shop_name ? ` · ${doc.shop_name}` : ""}`,
      sum: doc.total_with_discounts ?? 0,
      points: (doc.bonus_added ?? 0) - (doc.bonus_removed ?? 0),
    };
  }
  if (record.type === "transaction" && record.transaction) {
    const tx = record.transaction;
    return {
      id: `t-${tx.id}`,
      date: tx.event_date,
      title: tx.description || (tx.amount >= 0 ? "Начисление баллов" : "Списание баллов"),
      points: tx.amount,
    };
  }
  return null;
}

/** The answers of the five calls the cabinet is made of, put together. Pure, so it can be tested. */
export function toCabinet(raw: {
  client: RawClient;
  cards: RawCard[];
  profit: RawProfit[];
  expires: RawExpires[];
  records: RawRecord[] | null;
  settings: RawSettings;
  now: number;
}): Cabinet {
  const card =
    raw.cards.find((c) => c.id === raw.client.default_card_id) ??
    raw.cards.find((c) => c.state === "active" && !c.blocked) ??
    raw.cards[0];
  const profit = raw.profit.find((p) => p.card_id === card?.id);
  const next = (raw.expires.find((e) => e.card_id === card?.id)?.bonus_expires ?? [])
    .filter((e) => e.amount > 0 && e.date >= raw.now)
    .sort((a, b) => a.date - b.date)[0];

  return {
    name: raw.client.name ?? "",
    phone: maskPhone(raw.client.phone ?? ""),
    email: raw.client.email ?? "",
    card: card
      ? {
          id: card.id,
          barcode: card.barcode,
          balance: card.balance ?? 0,
          level: card.card_level?.name ?? "",
          active: card.state === "active" && !card.blocked,
        }
      : null,
    nextExpiry: next ? { amount: next.amount, date: next.date } : null,
    year: {
      spent: profit?.sale_sum ?? 0,
      purchases: profit?.sale_count ?? 0,
      earned: profit?.bonus_added_sum ?? 0,
      used: profit?.bonus_removed_sum ?? 0,
    },
    history: (raw.records ?? [])
      .map(historyRow)
      .filter((row): row is HistoryRow => row !== null)
      .sort((a, b) => b.date - a.date),
    wallets: {
      apple: Boolean(raw.settings.apple_wallet_configured),
      google: Boolean(raw.settings.google_wallet_configured),
    },
  };
}

const YEAR = 365 * 24 * 60 * 60 * 1000;

/** Everything the cabinet page shows, in one go. Throws SessionExpired when the token is no good. */
export async function loadCabinet(token: string): Promise<Cabinet> {
  const now = Date.now();
  const [client, cards, profit, expires, records, settings] = await Promise.all([
    call<RawClient>("/client", { token }),
    call<RawCard[]>("/cards", { token }),
    call<RawProfit[]>(`/profit?date_from=${now - YEAR}&date_to=${now}`, { token }),
    call<RawExpires[]>(`/bonus-expires?date_from=${now}&date_to=${now + YEAR}`, { token }),
    call<{ objects: RawRecord[] | null }>("/document-transaction?page=1&per_page=20", { token }),
    call<RawSettings>("/settings"),
  ]);
  return toCabinet({ client, cards, profit, expires, records: records.objects, settings, now });
}

/**
 * The card's barcode as the service draws it for its own cabinet and the
 * tills read it: the format is the card template's (Code128 in the demo).
 */
const FORMATS: Record<string, string> = {
  TGBarcodeFormatQR: "qr",
  TGBarcodeFormatCode128: "code128",
  TGBarcodeFormatPDF417: "pdf417",
  TGBarcodeFormatAztec: "aztec",
};

export async function barcodeImage(token: string, content: string): Promise<{ body: ArrayBuffer; type: string }> {
  const template = await call<{ barcode_format?: string }>("/telegram/template", { token });
  const format = FORMATS[template.barcode_format ?? ""] ?? "code128";
  const square = format === "qr" || format === "aztec";
  const res = await fetch(`${BASE}/qr`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content, format, height: square ? 400 : 200, width: square ? 400 : 600 }),
  });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.startsWith("image/")) throw new BonusRarusError(502, FALLBACK, `qr -> ${res.status}`);
  return { body: await res.arrayBuffer(), type };
}

/** The Apple Wallet pass - a .pkpass file the service builds from the card as it is now. */
export async function applePass(token: string, cardId: number): Promise<ArrayBuffer> {
  const res = await fetch(`${BASE}/applepass/create-card/${cardId}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || type.includes("json")) {
    const body = (await res.json().catch(() => null)) as Envelope<unknown> | null;
    throw new BonusRarusError(502, body?.customer_message || FALLBACK, body?.error?.reason || `applepass -> ${res.status}`);
  }
  return res.arrayBuffer();
}

/**
 * The Google Wallet "save" link. UNVERIFIED: the demo has no Google Wallet set
 * up, and the spec does not name the field the link comes in - the service's
 * own cabinet just uses the answer's `data`. A string anywhere at the top of
 * it that looks like a pay.google.com link is taken; anything else is refused.
 */
export async function googleWalletLink(token: string, cardId: number): Promise<string> {
  const data = await call<unknown>(`/googlewallet/create-card/${cardId}`, { token });
  const candidates =
    typeof data === "string" ? [data] : data && typeof data === "object" ? Object.values(data) : [];
  const link = candidates.find(
    (v): v is string => typeof v === "string" && /^https:\/\/pay\.google\.com\//.test(v),
  );
  if (!link) throw new BonusRarusError(502, FALLBACK, "googlewallet: no link in the answer");
  return link;
}

export { BonusRarusError };
