/**
 * The contact form's rules, kept apart from the route so they can be tested
 * without a server: what a valid message looks like, and who each subject goes to.
 */

/** The subject list is the editor's now, so any reasonable line is accepted. */
export type ContactSubject = string;

export type ContactMessage = {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MESSAGE_MAX = 2000;

export type ContactField = keyof ContactMessage;

/** What the form says under the button, per field (Russian, as the site is). */
export const CONTACT_ERRORS: Record<ContactField, string> = {
  name: "Укажите имя",
  email: "Проверьте e-mail",
  subject: "Выберите тему обращения",
  message: "Напишите сообщение",
};

/** The order the fields are checked in, and so which error is "first". */
const ORDER: ContactField[] = ["message", "name", "email", "subject"];

/**
 * The one source of the form's rules, for the browser and the server alike.
 * Returns the cleaned message, or every field that failed. `error` is the first
 * failing field's name - the shape the API has always answered with.
 */
export function parseContact(
  raw: unknown,
):
  | { ok: true; value: ContactMessage }
  | {
      ok: false;
      error: string;
      errors: Partial<Record<ContactField, string>>;
    } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "bad body", errors: {} };
  }
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const value: ContactMessage = {
    name: str(r.name),
    email: str(r.email),
    subject: str(r.subject),
    message: str(r.message),
  };

  const bad: Record<ContactField, boolean> = {
    name: value.name.length < 1 || value.name.length > 200,
    email: !EMAIL.test(value.email) || value.email.length > 254,
    subject: value.subject.length < 1 || value.subject.length > 200,
    message: value.message.length < 1 || value.message.length > MESSAGE_MAX,
  };

  const failed = ORDER.filter((field) => bad[field]);
  if (failed.length === 0) return { ok: true, value };

  const errors: Partial<Record<ContactField, string>> = {};
  for (const field of failed) errors[field] = CONTACT_ERRORS[field];
  return { ok: false, error: failed[0], errors };
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
