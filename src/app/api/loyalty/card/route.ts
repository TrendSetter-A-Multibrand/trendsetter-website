import { BonusRarusError, cardByBarcode } from "@/lib/bonusRarus/loyalty";
import { createLimiter } from "@/lib/rateLimit";

// Tighter than registration: this is the one route a stranger could poll to
// fish for valid card numbers, so it only ever answers balance and level -
// never the name, phone or email the vendor's own lookup includes.
const limited = createLimiter(60 * 1000, 10);

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "?";
  if (limited(ip)) return Response.json({ error: "too many" }, { status: 429 });

  const barcode = new URL(request.url).searchParams.get("barcode")?.trim() ?? "";
  if (!/^\d{4,20}$/.test(barcode)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  try {
    return Response.json(await cardByBarcode(barcode));
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
