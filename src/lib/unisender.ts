/**
 * The newsletter lives in Unisender: the site hands over the address and keeps
 * nothing of its own (we may not store visitors' personal data). Calls go from
 * the server only, so the key never reaches a browser.
 *
 *   UNISENDER_API_KEY   the key from the account's "Интеграция и API" page
 *   UNISENDER_LIST_ID   the number of the list the site fills (getLists shows it)
 *   UNISENDER_DOUBLE_OPTIN  "0" (default): Unisender sends a confirmation letter
 *                           and the address joins the list once it is confirmed;
 *                           "3": the address joins at once, no letter
 */

const ENDPOINT = "https://api.unisender.com/ru/api";

export class NewsletterNotConfigured extends Error {}
export class NewsletterFailed extends Error {}

type Env = Record<string, string | undefined>;

function settings(env: Env) {
  const key = env.UNISENDER_API_KEY;
  const list = env.UNISENDER_LIST_ID;
  if (!key || !list) throw new NewsletterNotConfigured();
  return { key, list, doubleOptin: env.UNISENDER_DOUBLE_OPTIN === "3" ? "3" : "0" };
}

export function newsletterConfigured(env: Env = process.env): boolean {
  return Boolean(env.UNISENDER_API_KEY && env.UNISENDER_LIST_ID);
}

/** One call; the answer is Unisender's JSON, an `error` field when it refused. */
async function call(
  method: string,
  params: Record<string, string>,
  key: string,
  doFetch: typeof fetch,
): Promise<unknown> {
  const res = await doFetch(`${ENDPOINT}/${method}?format=json`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ api_key: key, ...params }),
    // A service that does not answer must not hold a visitor's request open
    signal: AbortSignal.timeout(10_000),
  });
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok || !body || body.error) {
    throw new NewsletterFailed(body?.error ?? `HTTP ${res.status}`);
  }
  return body;
}

/**
 * Puts the address on the list. The consent day goes in as a tag, so the proof
 * of it stays with the contact in Unisender and not with us.
 */
export async function subscribe(
  email: string,
  opts: { env?: Env; doFetch?: typeof fetch; today?: Date } = {},
): Promise<void> {
  const { key, list, doubleOptin } = settings(opts.env ?? process.env);
  const day = (opts.today ?? new Date()).toISOString().slice(0, 10);
  await call(
    "subscribe",
    {
      list_ids: list,
      "fields[email]": email,
      tags: `сайт,согласие ${day}`,
      double_optin: doubleOptin,
    },
    key,
    opts.doFetch ?? fetch,
  );
}

/** Marks the address unsubscribed (what a visitor asking to stop is owed). */
export async function unsubscribe(
  email: string,
  opts: { env?: Env; doFetch?: typeof fetch } = {},
): Promise<void> {
  const { key, list } = settings(opts.env ?? process.env);
  try {
    await call("unsubscribe", { contact_type: "email", contact: email, list_ids: list }, key, opts.doFetch ?? fetch);
  } catch (e) {
    // An address that is not on the list is already as unsubscribed as it can be
    if (e instanceof NewsletterFailed && /not found/i.test(e.message)) return;
    throw e;
  }
}
