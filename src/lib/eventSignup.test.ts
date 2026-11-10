import { describe, expect, it } from "vitest";
import {
  DEMO_SEATS,
  demoCapacity,
  isSignupDemo,
  parseSignup,
  seatsLeft,
  signupShut,
} from "@/lib/eventSignup";

const guest = { name: "Иван Петров", phone: "+7 999 123-45-67", email: "a@b.co" };

describe("parseSignup", () => {
  it("lower-cases and trims the e-mail, tidies the name, writes the phone as +digits", () => {
    expect(
      parseSignup({
        name: "  Иван   Петров ",
        phone: "8 (999) 123-45-67",
        email: "  Ann@Mail.RU ",
        consent: true,
      }),
    ).toEqual({
      ok: true,
      value: { email: "ann@mail.ru", name: "Иван Петров", phone: "+79991234567" },
    });
  });
  it("rejects a bad e-mail", () => {
    expect(parseSignup({ ...guest, email: "nope", consent: true })).toMatchObject({
      ok: false,
      error: "email",
    });
  });
  it("rejects a missing or odd name", () => {
    for (const name of [undefined, "", "И", "12345", "Иван <b>", "a@b.co", "а".repeat(121)]) {
      expect(parseSignup({ ...guest, name, consent: true })).toMatchObject({
        ok: false,
        error: "name",
      });
    }
  });
  it("accepts names with a hyphen, an apostrophe or Latin letters", () => {
    for (const name of ["Анна-Мария Ли", "О'Нил Шон", "John Smith"]) {
      expect(parseSignup({ ...guest, name, consent: true }).ok).toBe(true);
    }
  });
  it("rejects a phone that is not one", () => {
    for (const phone of [undefined, "", "123", "abc", "1234567890123456"]) {
      expect(parseSignup({ ...guest, phone, consent: true })).toMatchObject({
        ok: false,
        error: "phone",
      });
    }
  });
  it("makes a Russian number +7 however it is written", () => {
    for (const phone of ["9991234567", "89991234567", "79991234567", "+7 999 123 45 67"]) {
      expect(parseSignup({ ...guest, phone, consent: true })).toMatchObject({
        ok: true,
        value: { phone: "+79991234567" },
      });
    }
  });
  it("keeps a foreign number with its country code", () => {
    expect(parseSignup({ ...guest, phone: "+374 91 123456", consent: true })).toMatchObject({
      ok: true,
      value: { phone: "+37491123456" },
    });
  });
  it("needs consent to be exactly true", () => {
    for (const consent of [false, "true", 1, undefined]) {
      expect(parseSignup({ ...guest, consent })).toMatchObject({
        ok: false,
        error: "consent",
      });
    }
  });
  it("rejects a non-object", () => {
    expect(parseSignup(null)).toMatchObject({ ok: false, error: "bad body" });
    expect(parseSignup("x")).toMatchObject({ ok: false, error: "bad body" });
  });
});

describe("seatsLeft", () => {
  it("subtracts, never below zero", () => {
    expect(seatsLeft(10, 3)).toBe(7);
    expect(seatsLeft(3, 5)).toBe(0);
    expect(seatsLeft(0, 0)).toBe(0);
  });
  it("is null with no limit", () => {
    expect(seatsLeft(null, 4)).toBeNull();
  });
});

describe("signupShut", () => {
  const now = new Date("2026-11-01T12:00:00Z");
  it("is off when the editor turned it off", () => {
    expect(signupShut({ signupEnabled: false, date: "" }, now)).toBe("disabled");
  });
  it("is closed once the event has passed", () => {
    expect(signupShut({ signupEnabled: true, date: "2026-10-01 18:00" }, now)).toBe("closed");
  });
  it("stays open for a future, empty or unreadable date", () => {
    expect(signupShut({ signupEnabled: true, date: "2026-12-01 18:00" }, now)).toBeNull();
    expect(signupShut({ signupEnabled: true, date: "" }, now)).toBeNull();
    expect(signupShut({ signupEnabled: true, date: "soon" }, now)).toBeNull();
  });
});

describe("demo mode", () => {
  it("включается только флагом и без БД", () => {
    expect(isSignupDemo({ EVENTS_SIGNUP_DEMO: "1" })).toBe(true);
    expect(isSignupDemo({})).toBe(false);
    expect(isSignupDemo({ EVENTS_SIGNUP_DEMO: "1", DATABASE_URL: "postgres://x" })).toBe(false);
  });

  it("берёт места из Storyblok, иначе 20", () => {
    expect(demoCapacity({ seats: 7 }).seats).toBe(7);
    expect(demoCapacity({ seats: null }).seats).toBe(DEMO_SEATS);
    expect(demoCapacity(null)).toMatchObject({ seats: 20, signupEnabled: true });
  });
});
