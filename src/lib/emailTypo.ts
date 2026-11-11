/** The mail hosts most guests use; a domain one slip away from one of these is probably a typo. */
const POPULAR = [
  "gmail.com", "mail.ru", "yandex.ru", "ya.ru", "bk.ru", "inbox.ru", "list.ru",
  "internet.ru", "rambler.ru", "outlook.com", "hotmail.com", "icloud.com",
  "yahoo.com", "me.com", "proton.me", "protonmail.com",
];

/** Slips that are more than one step from the right domain, or common enough to name. */
const KNOWN_WRONG: Record<string, string> = {
  "gmail.ru": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.con": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "yandex.com.ru": "yandex.ru",
  "yadex.ru": "yandex.ru",
  "yandx.ru": "yandex.ru",
  "mial.ru": "mail.ru",
  "mail.ry": "mail.ru",
  "mail.rus": "mail.ru",
};

/** One edit apart: a letter changed, dropped, added, or two neighbours swapped. */
function oneApart(a: string, b: string): boolean {
  if (a === b) return false;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length === b.length) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true; // one letter changed
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2); // swapped
  }
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  return short.slice(i) === long.slice(i + 1); // one letter dropped or added
}

/**
 * A corrected address when the domain looks like a slip («anna@gmail.con»), else
 * null. Only a hint: a real but unusual domain (mail.ua) is let through when the
 * guest confirms, so this never refuses anybody.
 */
export function suggestEmail(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (POPULAR.includes(domain)) return null;
  const fixed =
    KNOWN_WRONG[domain] ?? (domain.length >= 6 ? POPULAR.find((p) => oneApart(domain, p)) : undefined);
  return fixed ? `${local}@${fixed}` : null;
}
