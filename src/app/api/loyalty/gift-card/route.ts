import { BonusRarusError, certificateByCode } from "@/lib/bonusRarus/loyalty";
import { createLimiter } from "@/lib/rateLimit";

const limited = createLimiter(60 * 1000, 10);

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
  if (limited(ip)) return Response.json({ error: "too many" }, { status: 429 });

  const code = new URL(request.url).searchParams.get("code")?.trim() ?? "";
  if (!/^[\w-]{4,30}$/.test(code)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  try {
    return Response.json(await certificateByCode(code));
  } catch (e) {
    if (e instanceof BonusRarusError && e.status === 404) {
      return Response.json({ error: "not found" }, { status: 404 });
    }
    if (e instanceof BonusRarusError) {
      return Response.json({ error: e.customerMessage }, { status: e.status >= 500 ? 502 : 400 });
    }
    return Response.json({ error: "Не удалось выполнить операцию. Попробуйте ещё раз." }, { status: 502 });
  }
}
