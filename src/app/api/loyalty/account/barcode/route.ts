import { barcodeImage, SessionExpired } from "@/lib/bonusRarus/customer";
import { readSession } from "@/lib/bonusRarus/session";
import { disabled } from "@/lib/bonusRarus/routeKit";

/**
 * The signed-in client's card barcode as an image, drawn by the service in the
 * card template's format - the one its tills scan. It takes a signed-in
 * client's token to draw one at all; the picture says no more than the number
 * under it, so the number is not checked against their cards, and the image is
 * kept by the browser alone (private), never by a shared cache.
 */
export async function GET(request: Request) {
  const off = disabled();
  if (off) return off;
  const token = await readSession();
  if (!token) return new Response("Unauthorized", { status: 401 });

  const barcode = new URL(request.url).searchParams.get("code") ?? "";
  if (!/^\d{4,20}$/.test(barcode)) return new Response("Bad request", { status: 400 });

  try {
    const image = await barcodeImage(token, barcode);
    return new Response(image.body, {
      headers: { "Content-Type": image.type, "Cache-Control": "private, max-age=3600" },
    });
  } catch (e) {
    return new Response(e instanceof SessionExpired ? "Unauthorized" : "Bad gateway", {
      status: e instanceof SessionExpired ? 401 : 502,
    });
  }
}
