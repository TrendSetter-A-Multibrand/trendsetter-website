import { parseSignup } from "@/lib/eventSignup";

/** What the seats endpoint says: how the sheet's form should stand. */
export type SeatsPhase = "open" | "full" | "closed";

/** `left` null = no limit, or not known; the counter is then not drawn. */
export type SeatsState = { phase: SeatsPhase; left: number | null };

/** The GET answer as the sheet reads it; anything odd leaves the form open. */
export function readSeats(raw: unknown): SeatsState {
  const r = (raw && typeof raw === "object" ? raw : {}) as {
    open?: unknown;
    left?: unknown;
    reason?: unknown;
  };
  const left = typeof r.left === "number" ? r.left : null;
  if (r.open === false) {
    if (r.reason === "full") return { phase: "full", left: 0 };
    return { phase: "closed", left };
  }
  return { phase: "open", left };
}

export type SignupOutcome =
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
  };
  const left = typeof r.left === "number" ? r.left : null;
  if (status === 200 && r.ok === true) {
    return r.already === true ? { kind: "already", left } : { kind: "done", left };
  }
  if (status === 409) return { kind: "full" };
  if (status === 410) return { kind: "closed" };
  if (status === 400) return { kind: "invalid" };
  return { kind: "error" };
}

/** The same rules the server applies, so nothing leaves the page that would bounce. */
export function checkSignup(email: string, consent: boolean) {
  const parsed = parseSignup({ email, consent });
  return parsed.ok ? null : parsed.error;
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
