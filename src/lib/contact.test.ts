import { describe, expect, it } from "vitest";
import { MESSAGE_MAX, parseContact } from "@/lib/contact";

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

  it("names the first field that failed", () => {
    expect(parseContact({ ...valid, email: "not-an-email" })).toMatchObject({
      ok: false,
      error: "email",
    });
    expect(parseContact({ ...valid, message: "  " })).toMatchObject({
      ok: false,
      error: "message",
    });
  });

  it("refuses an empty name", () => {
    expect(parseContact({ ...valid, name: "   " })).toMatchObject({
      ok: false,
      error: "name",
      errors: { name: expect.any(String) },
    });
  });

  it("takes a message of 2000 and refuses 2001", () => {
    expect(MESSAGE_MAX).toBe(2000);
    expect(
      parseContact({ ...valid, message: "я".repeat(2000) }).ok,
    ).toBe(true);
    expect(parseContact({ ...valid, message: "я".repeat(2001) })).toMatchObject({
      ok: false,
      error: "message",
    });
  });

  it("refuses an email without a domain", () => {
    expect(parseContact({ ...valid, email: "anna@example" })).toMatchObject({
      ok: false,
      error: "email",
    });
    expect(parseContact({ ...valid, email: "anna@" }).ok).toBe(false);
  });

  it("refuses an email over 254 characters", () => {
    const long = `${"a".repeat(250)}@example.com`;
    expect(parseContact({ ...valid, email: long }).ok).toBe(false);
  });

  it("refuses an empty subject", () => {
    expect(parseContact({ ...valid, subject: "  " })).toMatchObject({
      ok: false,
      error: "subject",
      errors: { subject: expect.any(String) },
    });
  });

  it("reports every failing field at once", () => {
    const result = parseContact({ name: "", email: "x", subject: "", message: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual([
        "email",
        "message",
        "name",
        "subject",
      ]);
    }
  });

  it("refuses a body that is not an object", () => {
    expect(parseContact(null)).toEqual({
      ok: false,
      error: "bad body",
      errors: {},
    });
  });
});
