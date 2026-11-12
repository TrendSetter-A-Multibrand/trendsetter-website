import { createLimiter } from "@/lib/rateLimit";
import { NewsletterNotConfigured, subscribe } from "@/lib/unisender";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const perIp = createLimiter(10 * 60 * 1000, 8);

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
  if (perIp(ip)) return Response.json({ error: "too many" }, { status: 429 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  // The hidden field a person never fills: a bot that does gets a quiet "ok"
  if (body?.website) return Response.json({ ok: true });

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!EMAIL.test(email) || email.length > 254) return Response.json({ error: "email" }, { status: 400 });
  // The consent is the visitor's explicit act; the server does not take its absence as a yes
  if (body?.consent !== true) return Response.json({ error: "consent" }, { status: 400 });

  try {
    await subscribe(email);
  } catch (e) {
    return Response.json({ error: "send failed" }, { status: e instanceof NewsletterNotConfigured ? 503 : 502 });
  }
  return Response.json({ ok: true });
}
