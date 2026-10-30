import { applePass, googleWalletLink, SessionExpired } from "@/lib/bonusRarus/customer";
import { readSession } from "@/lib/bonusRarus/session";
import { disabled } from "@/lib/bonusRarus/routeKit";

/**
 * "Добавить в Apple Wallet" hands over the .pkpass the service builds - Safari
 * opens that type straight into Wallet; "Добавить в Google Кошелёк" goes on to
 * the save link the service makes. Neither is set up in the vendor's demo, so
 * the page only shows a button once the cabinet's settings say it is.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ kind: string }> },
) {
  const off = disabled();
  if (off) return off;
  const token = await readSession();
  if (!token) return new Response("Unauthorized", { status: 401 });

  const { kind } = await params;
  const card = Number(new URL(request.url).searchParams.get("card"));
  if (!Number.isInteger(card) || card <= 0) return new Response("Bad request", { status: 400 });

  try {
    if (kind === "apple") {
      return new Response(await applePass(token, card), {
        headers: {
          "Content-Type": "application/vnd.apple.pkpass",
          "Content-Disposition": 'attachment; filename="Card.pkpass"',
          "Cache-Control": "no-store",
        },
      });
    }
    if (kind === "google") return Response.redirect(await googleWalletLink(token, card), 302);
    return new Response("Not found", { status: 404 });
  } catch (e) {
    if (e instanceof SessionExpired) return new Response("Unauthorized", { status: 401 });
    // The service's own reason, for the logs only - it names no client and no token
    console.error(`wallet ${kind}:`, e instanceof Error ? e.message : e);
    return new Response("Карту не удалось выпустить. Попробуйте позже.", {
      status: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
