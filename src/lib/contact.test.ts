import { describe, expect, it } from "vitest";
import { parseContact } from "@/lib/contact";

const valid = {
  name: " Анна ",
  email: "anna@example.com",
  subject: "Связаться с генеральным директором",
  message: "Здравствуйте, у меня вопрос про магазин.",
};

describe("parseContact", () => {
  it("trims and accepts a subject the editor invented", () => {
    const result = parseContact({ ...valid, subject: "Новая тема из CMS" });
    expect(result).toEqual({
      ok: true,
      value: { ...valid, name: "Анна", subject: "Новая тема из CMS" },
    });
  });

  it("names the field that failed", () => {
    expect(parseContact({ ...valid, email: "not-an-email" })).toEqual({
      ok: false,
      error: "email",
    });
    expect(parseContact({ ...valid, message: "hi" })).toEqual({
      ok: false,
      error: "message",
    });
    expect(parseContact({ ...valid, subject: "  " })).toEqual({
      ok: false,
      error: "subject",
    });
  });

  it("refuses a body that is not an object", () => {
    expect(parseContact(null)).toEqual({ ok: false, error: "bad body" });
  });
});
