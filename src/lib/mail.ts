import nodemailer, { type Transporter } from "nodemailer";

/**
 * The one place a message actually leaves the site: plain SMTP, so the provider
 * is whatever the MAIL_* values point at (a Russian mail host for the business,
 * or the company's own mailbox). Until MAIL_HOST is set this only logs in
 * development, and in production the route says "not configured" instead of
 * pretending the message went out.
 *
 *   MAIL_HOST      the SMTP server, e.g. smtp.yandex.ru
 *   MAIL_PORT      465 (TLS from the start, the default) or 587 (STARTTLS)
 *   MAIL_USER      the login
 *   MAIL_PASSWORD  its password - for Gmail and most hosts an app password
 *   MAIL_FROM      the sender shown to the reader; the login when empty
 */

export type Mail = {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

export class MailNotConfigured extends Error {}

let shared: Transporter | undefined;

/** The connection to the SMTP host, made on first use and kept. */
function transport(env: Record<string, string | undefined> = process.env): Transporter {
  const port = Number(env.MAIL_PORT) || 465;
  shared ??= nodemailer.createTransport({
    host: env.MAIL_HOST,
    port,
    secure: port === 465,
    auth: env.MAIL_USER ? { user: env.MAIL_USER, pass: env.MAIL_PASSWORD } : undefined,
    // A host that does not answer must not hold a visitor's request open
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return shared;
}

/**
 * `via` is for tests: any nodemailer transport, so nothing leaves the machine.
 */
export async function sendMail(mail: Mail, via?: Transporter): Promise<void> {
  if (!via && !process.env.MAIL_HOST) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[mail:dev] would send", mail);
      return;
    }
    throw new MailNotConfigured();
  }

  await (via ?? transport()).sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to: mail.to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    text: mail.text,
  });
}
