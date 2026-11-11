import { parseSignup } from "@/lib/eventSignup";

/** What the seats endpoint says: how the sheet's form should stand. */
export type SeatsPhase = "open" | "full" | "closed";

/** The loyalty service's documents a guest accepts by signing up; "" where there is none. */
export type Agreements = { userAgreement: string; offer: string };

/** `left` null = no limit, or not known; the counter is then not drawn. `loyalty` set = signing up goes through the loyalty programme. */
export type SeatsState = { phase: SeatsPhase; left: number | null; loyalty?: Agreements };

/** The GET answer as the sheet reads it; anything odd leaves the form open. */
export function readSeats(raw: unknown): SeatsState {
  const r = (raw && typeof raw === "object" ? raw : {}) as {
    open?: unknown;
    left?: unknown;
    reason?: unknown;
    loyalty?: { userAgreement?: unknown; offer?: unknown } | null;
  };
  const left = typeof r.left === "number" ? r.left : null;
  if (r.open === false) {
    if (r.reason === "full") return { phase: "full", left: 0 };
    return { phase: "closed", left };
  }
  const loyalty = r.loyalty
    ? {
        userAgreement: typeof r.loyalty.userAgreement === "string" ? r.loyalty.userAgreement : "",
        offer: typeof r.loyalty.offer === "string" ? r.loyalty.offer : "",
      }
    : undefined;
  return { phase: "open", left, ...(loyalty ? { loyalty } : {}) };
}

export type SignupOutcome =
  | { kind: "code"; channel: string; codeLength: number }
  | { kind: "expired" }
  | { kind: "done"; left: number | null }
  | { kind: "already"; left: number | null }
  | { kind: "full" }
  | { kind: "closed" }
  | { kind: "invalid" }
  | { kind: "error" };

/** The POST answer: the status and the body the register route sent. */
export function readSignup(status: number, raw: unknown): SignupOutcome {
  const r = (raw && typeof raw === "object" ? raw : {}) as {
    ok?: unknown;
    already?: unknown;
    left?: unknown;
    step?: unknown;
    channel?: unknown;
    codeLength?: unknown;
    error?: unknown;
  };
  const left = typeof r.left === "number" ? r.left : null;
  if (status === 200 && r.ok === true && r.step === "code") {
    return {
      kind: "code",
      channel: typeof r.channel === "string" ? r.channel : "phone",
      codeLength: typeof r.codeLength === "number" ? r.codeLength : 6,
    };
  }
  if (status === 400 && r.error === "expired") return { kind: "expired" };
  if (status === 200 && r.ok === true) {
    return r.already === true ? { kind: "already", left } : { kind: "done", left };
  }
  if (status === 409) return { kind: "full" };
  if (status === 410) return { kind: "closed" };
  if (status === 400) return { kind: "invalid" };
  return { kind: "error" };
}

/** The same rules the server applies, so nothing leaves the page that would bounce. */
export function checkSignup(
  fields: { email: string; name: string; phone: string },
  consent: boolean,
) {
  const parsed = parseSignup({ ...fields, consent });
  return parsed.ok ? null : parsed.error;
}

/**
 * The address the sheet may put in a frame: only a Яндекс Формы page on its own
 * host, whatever else an editor pastes. Null for anything else, and for an empty
 * field - then the sheet keeps its own form.
 */
export function yandexFormEmbed(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname !== "forms.yandex.ru") return null;
  if (!/^\/(cloud|u)\/[0-9a-z]+\/?$/i.test(url.pathname)) return null;
  return `${url.origin}${url.pathname}?iframe=1`;
}

/** «Осталось мест: {n}» with the number put in. */
export const fillSeats = (template: string, n: number) =>
  template.replace("{n}", String(n));

/** A line with one {braced} phrase, cut into what comes before, the phrase, after. */
export function splitBraces(text: string) {
  const from = text.indexOf("{");
  const to = text.indexOf("}", from);
  if (from < 0 || to <= from) return null;
  return {
    before: text.slice(0, from),
    link: text.slice(from + 1, to),
    after: text.slice(to + 1),
  };
}
