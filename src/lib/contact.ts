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
  if (subject.length < 1 || subject.length > 200) {
    return { ok: false, error: "subject" };
  }
  return {
    ok: true,
    value: { name, email, subject, message },
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
