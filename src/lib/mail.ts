/**
 * The one place a message actually leaves the site. The provider is not chosen
 * yet (waiting on the mail manager - Gmail may be blocked for us), so until
 * MAIL_* is set this only logs, and the route says "not configured" instead of
 * pretending the message went out. Swap the body of `deliver` for the chosen
 * SMTP/API call; nothing else changes.
 */

export type Mail = {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

export class MailNotConfigured extends Error {}

export async function sendMail(mail: Mail): Promise<void> {
  if (!process.env.MAIL_HOST && !process.env.MAIL_API_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[mail:dev] would send", mail);
      return;
    }
    throw new MailNotConfigured();
  }
  await deliver();
}

async function deliver(): Promise<void> {
  // The provider's answer is pending; see the Weeek task.
  throw new MailNotConfigured();
}
