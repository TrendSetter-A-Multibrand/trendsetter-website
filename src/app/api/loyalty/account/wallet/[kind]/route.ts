import { applePass, googleWalletLink, SessionExpired } from "@/lib/bonusRarus/customer";
import { readSession } from "@/lib/bonusRarus/session";
import { disabled } from "@/lib/bonusRarus/routeKit";

// The service takes seconds to build a pass, and Safari on an iPhone leaves the page hung
// while a navigation to a file waits that long. So the button first asks for the pass with
// ?warm=1 (an ordinary request, with a spinner on the page), the pass is kept here for a
// minute, and the navigation that follows is answered at once.
const KEEP_MS = 60_000;
const built = new Map<string, { at: number; pass: Promise<ArrayBuffer> }>();

function passFor(token: string, card: number) {
  const now = Date.now();
  for (const [key, entry] of built) if (now - entry.at > KEEP_MS) built.delete(key);
  const key = `${token}:${card}`;
  let entry = built.get(key);
  if (!entry) {
    const pass = applePass(token, card);
    entry = { at: now, pass };
    built.set(key, entry);
    // A failed build is not worth keeping: the next tap tries again
    pass.catch(() => built.delete(key));
  }
  return entry.pass;
}

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
      const pass = await passFor(token, card);
      if (new URL(request.url).searchParams.has("warm")) return new Response(null, { status: 204 });
      return new Response(pass, {
        headers: {
          "Content-Length": String(pass.byteLength),
          // The type alone is what makes Safari on an iPhone open Wallet's "Add" sheet; with
          // "Content-Disposition: attachment" it only offers the file as a download
          "Content-Type": "application/vnd.apple.pkpass",
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
    // A tap on a phone should land back on the cabinet with a word of explanation,
    // not on a bare error page. The address is relative on purpose: behind the proxy
    // this request's own URL is the container's (0.0.0.0:3000), not the site's.
    const from = request.headers.get("referer");
    let path = "/ru_ru/card";
    try {
      if (from) path = new URL(from).pathname;
    } catch {}
    return new Response(null, { status: 303, headers: { Location: `${path}?wallet=failed` } });
  }
}
