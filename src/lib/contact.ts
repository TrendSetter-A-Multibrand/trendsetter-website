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
  "Связаться с генеральным директором",
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
 * Every message goes to the one mailbox, CONTACT_TO (an address from the mail
 * manager, so it lives in the environment). The subject line - "[Сайт] <тема>" -
 * is what tells the readers, and later the summary, what kind of message it is
 * and whether it is meant for the director.
 */
export function recipientFor(): string | undefined {
  return process.env.CONTACT_TO;
}

/** The subject whose answer the director gives; the mobile list shortens it. */
export const DIRECTOR_SUBJECT: ContactSubject = "Связаться с генеральным директором";
export const DIRECTOR_SUBJECT_SHORT = "Связаться с ген. директором";
