import { describe, expect, it } from "vitest";
import {
  hashPassword,
  verifyAgainstNobody,
  verifyPassword,
} from "@/lib/staff/password";

describe("password", () => {
  it("accepts the right password and refuses another", async () => {
    const hash = await hashPassword("correct horse battery");
    expect(await verifyPassword("correct horse battery", hash)).toBe(true);
    expect(await verifyPassword("correct horse batter", hash)).toBe(false);
  });

  it("does not keep the password in the hash, and salts every one", async () => {
    const a = await hashPassword("same password 1");
    const b = await hashPassword("same password 1");
    expect(a).not.toContain("same password 1");
    expect(a).not.toBe(b);
  });

  it("refuses a hash it does not know", async () => {
    expect(await verifyPassword("x", "")).toBe(false);
    expect(await verifyPassword("x", "md5$aa$bb")).toBe(false);
  });

  it("never lets an unknown login in", async () => {
    expect(await verifyAgainstNobody("nobody")).toBe(false);
  });
});
