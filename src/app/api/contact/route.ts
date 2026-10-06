import { parseContact, recipientFor } from "@/lib/contact";
import { MailNotConfigured, sendMail } from "@/lib/mail";

// Per-instance memory: enough to stop a script hammering one server, not a
// substitute for a real limiter once the site runs on several.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
  if (limited(ip)) {
    return Response.json({ error: "too many" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);

  // Hidden field a person never fills; a bot that does gets a quiet "ok".
  if (
    body &&
    typeof body === "object" &&
    (body as { website?: string }).website
  ) {
    return Response.json({ ok: true });
  }

  const parsed = parseContact(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }
  const { name, email, subject, message } = parsed.value;

  const to = recipientFor(subject);
  if (!to) {
    return Response.json({ error: "not configured" }, { status: 503 });
  }

  try {
    await sendMail({
      to,
      replyTo: email,
      subject: `[Сайт] ${subject}`,
      text: `От: ${name || "—"} <${email}>\nТема: ${subject}\n\n${message}`,
    });
  } catch (e) {
    const status = e instanceof MailNotConfigured ? 503 : 502;
    return Response.json({ error: "send failed" }, { status });
  }
  return Response.json({ ok: true });
}
