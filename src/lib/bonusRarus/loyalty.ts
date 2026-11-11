import { bonusRarus, BonusRarusError } from "@/lib/bonusRarus/client";

/** "+7 999 000-00-01" or "89990000001" -> "79990000001", what the API wants. */
export function normalizePhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) digits = "7" + digits.slice(1);
  if (digits.length === 10) digits = "7" + digits;
  return /^7\d{10}$/.test(digits) ? digits : null;
}

export type CardLookup = { balance: number; level: string; status: string };

/** Only what a visitor needs to see of their own card - never the fuller record a lookup can return. */
export async function cardByBarcode(barcode: string): Promise<CardLookup> {
  const data = await bonusRarus<{ balance?: number; state?: string; card_level?: { name?: string } }>(
    `/card/by-barcode/${encodeURIComponent(barcode)}`,
  );
  return { balance: data.balance ?? 0, level: data.card_level?.name ?? "", status: data.state ?? "" };
}

export type Guest = { name: string; phone: string; email: string };

/**
 * Who has a card, for the cabinet of the staff who let guests in: the service
 * is where a guest's name, phone and e-mail live, so they are read from it
 * whenever the list is opened and kept nowhere. Never shown to a visitor.
 */
export async function guestByBarcode(barcode: string): Promise<Guest | null> {
  const data = await bonusRarus<{ client?: { name?: string; phone?: string; email?: string } | null }>(
    `/card/by-barcode/${encodeURIComponent(barcode)}`,
  );
  const client = data.client;
  if (!client) return null;
  const digits = (client.phone ?? "").replace(/\D/g, "");
  return { name: client.name ?? "", phone: digits ? `+${digits}` : "", email: client.email ?? "" };
}

export type CertificateLookup = { balance: number; holded: number; status: string };

export async function certificateByCode(code: string): Promise<CertificateLookup> {
  const data = await bonusRarus<{ status?: { balance?: number; holded?: number; status?: string } }>(
    `/certificate/${encodeURIComponent(code)}`,
  );
  return { balance: data.status?.balance ?? 0, holded: data.status?.holded ?? 0, status: data.status?.status ?? "" };
}

export { BonusRarusError };
