import nodemailer from "nodemailer";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MailNotConfigured, sendMail } from "@/lib/mail";

const mail = {
  to: "events@example.ru",
  replyTo: "guest@example.com",
  subject: "[Сайт] Запись на событие: Мастер-класс",
  text: "guest@example.com записался(лась)",
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sendMail", () => {
  it("hands the message to the transport with the sender from MAIL_FROM", async () => {
    vi.stubEnv("MAIL_FROM", "Trendsetter <site@example.ru>");
    const via = nodemailer.createTransport({ jsonTransport: true });
    const spy = vi.spyOn(via, "sendMail");

    await sendMail(mail, via);

    expect(spy).toHaveBeenCalledWith({
      from: "Trendsetter <site@example.ru>",
      to: "events@example.ru",
      replyTo: "guest@example.com",
      subject: mail.subject,
      text: mail.text,
    });
  });

  it("falls back to the login for the sender", async () => {
    vi.stubEnv("MAIL_FROM", "");
    vi.stubEnv("MAIL_USER", "site@example.ru");
    const via = nodemailer.createTransport({ jsonTransport: true });
    const spy = vi.spyOn(via, "sendMail");

    await sendMail(mail, via);

    expect(spy.mock.calls[0][0]).toMatchObject({ from: "site@example.ru" });
  });

  it("says it is not configured in production rather than pretending", async () => {
    vi.stubEnv("MAIL_HOST", "");
    vi.stubEnv("NODE_ENV", "production");
    await expect(sendMail(mail)).rejects.toBeInstanceOf(MailNotConfigured);
  });

  it("only logs in development when nothing is configured", async () => {
    vi.stubEnv("MAIL_HOST", "");
    vi.stubEnv("NODE_ENV", "development");
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    await expect(sendMail(mail)).resolves.toBeUndefined();
    expect(log).toHaveBeenCalled();
    log.mockRestore();
  });
});
