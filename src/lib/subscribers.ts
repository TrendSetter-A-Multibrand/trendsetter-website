/**
 * Who has already signed up for the newsletter.
 *
 * There is no server yet, so this only knows about the browser it is running
 * in: clear the site data, or open the page on a phone, and the same address
 * will look new. The check has to move behind an endpoint when one exists -
 * this is the seam it will move through, so nothing above here changes.
 */
const KEY = "trendsetter.subscribed";

const plain = (email: string) => email.trim().toLowerCase();

function stored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    // Private mode, a full quota, or something else wrote nonsense under the key
    return [];
  }
}

export function isSubscribed(email: string) {
  return stored().includes(plain(email));
}

export function remember(email: string) {
  if (typeof window === "undefined") return;
  const next = [...new Set([...stored(), plain(email)])];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Not being able to remember is not worth breaking the sign-up over
  }
}
