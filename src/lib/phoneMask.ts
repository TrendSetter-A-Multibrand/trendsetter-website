/**
 * The phone field's mask, Russian numbers only: "+7 (999) 987 87 13". The
 * country code is always there, so a leading 7 or 8 the visitor types (or pastes
 * with the number) is the code and not part of it: no Russian mobile number
 * starts with either.
 */
export function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (/^[78]/.test(digits)) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return "";

  const [a, b, c, d] = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)];
  let out = `+7 (${a}`;
  if (a.length === 3) out += ")";
  if (b) out += ` ${b}`;
  if (c) out += ` ${c}`;
  if (d) out += ` ${d}`;
  return out;
}

/**
 * For an input's onChange: the mask of what was typed. Deleting a separator
 * (the space, the bracket) would leave the same digits and so the same text and
 * the cursor stuck behind it, so a shorter text with the same digits loses its
 * last digit instead.
 */
export function nextPhone(previous: string, typed: string): string {
  const next = formatPhone(typed);
  const digitsOf = (s: string) => s.replace(/\D/g, "").replace(/^[78]/, "");
  if (typed.length < previous.length && digitsOf(next) === digitsOf(previous)) {
    return formatPhone(digitsOf(previous).slice(0, -1));
  }
  return next;
}
