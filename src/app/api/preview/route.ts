import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * The way in from Storyblok's editor: it opens the site through this address,
 * the browser is handed the cookie that turns draft mode on, and from then on
 * every story is read as it is being written rather than as it was published.
 *
 * Anyone holding the secret can read unpublished work, which is the whole point
 * and also the whole risk - it is a long random string in the environment, not
 * something to put in a link that leaves the editor.
 */
export async function GET(request: Request) {
  const secret = process.env.STORYBLOK_PREVIEW_SECRET;
  if (!secret) {
    return Response.json({ error: "no secret configured" }, { status: 500 });
  }

  const url = new URL(request.url);
  if (url.searchParams.get("secret") !== secret) {
    return Response.json({ error: "wrong secret" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  // Only a path of our own, never wherever the address happens to point: an open
  // redirect here would let the link be used to send people anywhere.
  const to = url.searchParams.get("to") ?? "/";
  redirect(to.startsWith("/") && !to.startsWith("//") ? to : "/");
}
