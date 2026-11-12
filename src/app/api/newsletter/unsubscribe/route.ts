import { createLimiter } from "@/lib/rateLimit";
import { NewsletterNotConfigured, unsubscribe } from "@/lib/unisender";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const perIp = createLimiter(10 * 60 * 1000, 8);

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
  if (perIp(ip)) return Response.json({ error: "too many" }, { status: 429 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!EMAIL.test(email) || email.length > 254) return Response.json({ error: "email" }, { status: 400 });

  try {
    await unsubscribe(email);
  } catch (e) {
    return Response.json({ error: "send failed" }, { status: e instanceof NewsletterNotConfigured ? 503 : 502 });
  }
  // The same answer whether the address was on the list or not: it tells a stranger nothing
  return Response.json({ ok: true });
}
