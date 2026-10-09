import { describe, expect, it } from "vitest";
import {
  checkSignup,
  fillSeats,
  readSeats,
  readSignup,
  splitBraces,
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
    expect(checkSignup("nope", true)).toBe("email");
    expect(checkSignup("a@b.co", false)).toBe("consent");
    expect(checkSignup(" A@B.co ", true)).toBeNull();
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
