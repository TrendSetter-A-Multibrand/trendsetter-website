/**
 * The contact form's rules, kept apart from the route so they can be tested
 * without a server: what a valid message looks like, and who each subject goes to.
 */

export const CONTACT_SUBJECTS = [
  "О нас",
  "Пространство",
  "Сотрудничество",
  "Вакансии",
  "Контакты",
  "Обратная связь",
  "Генеральному директору",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export type ContactMessage = {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns the cleaned message, or the reason it was refused. */
export function parseContact(
  raw: unknown,
): { ok: true; value: ContactMessage } | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "bad body" };
  }
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const name = str(r.name);
  const email = str(r.email);
  const subject = str(r.subject);
  const message = str(r.message);

  if (message.length < 5 || message.length > 5000) {
    return { ok: false, error: "message" };
  }
  if (name.length > 200) return { ok: false, error: "name" };
  if (!EMAIL.test(email) || email.length > 254) {
    return { ok: false, error: "email" };
  }
  if (!(CONTACT_SUBJECTS as readonly string[]).includes(subject)) {
    return { ok: false, error: "subject" };
  }
  return {
    ok: true,
    value: { name, email, subject: subject as ContactSubject, message },
  };
}

/**
 * Recipient for a subject. CONTACT_TO_CEO catches the director's subject,
 * CONTACT_TO the rest; both are addresses from the mail manager, so they live
 * in the environment and not here.
 */
export function recipientFor(subject: ContactSubject): string | undefined {
  if (subject === "Генеральному директору") {
    return process.env.CONTACT_TO_CEO || process.env.CONTACT_TO;
  }
  return process.env.CONTACT_TO;
}
