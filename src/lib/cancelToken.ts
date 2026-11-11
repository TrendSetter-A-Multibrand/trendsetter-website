import { createHash, randomBytes } from "node:crypto";

/** What is kept for a cancel link: the link itself goes only to the guest. */
export const hashCancelToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export function newCancelToken(): { token: string; hash: string } {
  const token = randomBytes(24).toString("base64url");
  return { token, hash: hashCancelToken(token) };
}
