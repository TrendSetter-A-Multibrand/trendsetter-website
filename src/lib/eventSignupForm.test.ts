import { describe, expect, it } from "vitest";
import {
  checkSignup,
  fillSeats,
  readSeats,
  readSignup,
  splitBraces,
  yandexFormEmbed,
} from "./eventSignupForm";

describe("readSeats", () => {
  it("open with a count", () => {
    expect(readSeats({ open: true, left: 3 })).toEqual({ phase: "open", left: 3 });
  });
  it("open without a limit has no count", () => {
    expect(readSeats({ open: true, left: null })).toEqual({ phase: "open", left: null });
  });
  it("full is closed with zero left", () => {
    expect(readSeats({ open: false, left: 0, reason: "full" })).toEqual({
      phase: "full",
      left: 0,
    });
  });
  it("closed and disabled are the same phase", () => {
    expect(readSeats({ open: false, left: null, reason: "closed" }).phase).toBe("closed");
    expect(readSeats({ open: false, left: null, reason: "disabled" }).phase).toBe("closed");
  });
  it("garbage leaves the form open", () => {
    expect(readSeats(null)).toEqual({ phase: "open", left: null });
  });
});

describe("readSignup", () => {
  it("maps the route's answers", () => {
    expect(readSignup(200, { ok: true, left: 2 })).toEqual({ kind: "done", left: 2 });
    expect(readSignup(200, { ok: true, already: true, left: null })).toEqual({
      kind: "already",
      left: null,
    });
    expect(readSignup(409, { error: "full" })).toEqual({ kind: "full" });
    expect(readSignup(410, {})).toEqual({ kind: "closed" });
    expect(readSignup(400, {})).toEqual({ kind: "invalid" });
    for (const s of [429, 500, 502, 503]) expect(readSignup(s, {})).toEqual({ kind: "error" });
  });
});

describe("checkSignup", () => {
  it("applies the server's rules", () => {
    const ok = { name: "Иван Петров", phone: "89991234567", email: "a@b.co" };
    expect(checkSignup({ ...ok, email: "nope" }, true)).toBe("email");
    expect(checkSignup({ ...ok, name: "И" }, true)).toBe("name");
    expect(checkSignup({ ...ok, phone: "123" }, true)).toBe("phone");
    expect(checkSignup(ok, false)).toBe("consent");
    expect(checkSignup({ ...ok, email: " A@B.co " }, true)).toBeNull();
  });
});

describe("text helpers", () => {
  it("fills the count", () => {
    expect(fillSeats("Осталось мест: {n}", 5)).toBe("Осталось мест: 5");
  });
  it("splits a braced phrase", () => {
    expect(splitBraces("a {b} c")).toEqual({ before: "a ", link: "b", after: " c" });
    expect(splitBraces("no braces")).toBeNull();
  });
});

describe("yandexFormEmbed", () => {
  it("адрес формы Яндекса получает режим фрейма", () => {
    expect(yandexFormEmbed("https://forms.yandex.ru/cloud/6ae82340902902782eb40606/")).toBe(
      "https://forms.yandex.ru/cloud/6ae82340902902782eb40606/?iframe=1",
    );
    expect(yandexFormEmbed(" https://forms.yandex.ru/u/abc123?x=1 ")).toBe(
      "https://forms.yandex.ru/u/abc123?iframe=1",
    );
  });
  it("чужие адреса, http и пустое поле не принимает", () => {
    expect(yandexFormEmbed("https://evil.example/cloud/abc123/")).toBeNull();
    expect(yandexFormEmbed("https://forms.yandex.ru.evil.example/cloud/abc123/")).toBeNull();
    expect(yandexFormEmbed("http://forms.yandex.ru/cloud/abc123/")).toBeNull();
    expect(yandexFormEmbed("https://forms.yandex.ru/admin")).toBeNull();
    expect(yandexFormEmbed("")).toBeNull();
    expect(yandexFormEmbed(undefined)).toBeNull();
  });
});
