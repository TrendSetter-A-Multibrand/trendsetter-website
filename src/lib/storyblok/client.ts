/**
 * Everything the site needs to reach Storyblok: which host answers, which token
 * to send, and how long an answer may be kept.
 *
 * Read at call time rather than at import, so a missing token is an error from
 * the request that wanted it instead of a crash while the server boots.
 */

/** Every region but the first is the same name with its code in it. */
const HOSTS: Record<string, string> = {
  eu: "api.storyblok.com",
  us: "api-us.storyblok.com",
  ap: "api-ap.storyblok.com",
  ca: "api-ca.storyblok.com",
};

/**
 * The webhook is what actually refreshes a story, so this is only the floor
 * under it: an hour after the last read, a page checks for itself whether it is
 * still current. Without it a webhook that never arrived would leave the page
 * stale until the next deploy.
 */
const MAX_AGE = 3600;

/** Everything read from Storyblok wears this, so one call can clear the lot. */
export const ALL = "storyblok";

/** And its own, so publishing one story leaves the rest of the cache alone. */
export const storyTag = (slug: string) => `storyblok:${slug}`;

export class StoryblokError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
    body: string
  ) {
    super(`Storyblok ${status} on ${path}: ${body.slice(0, 200)}`);
  }
}

type Query = Record<string, string | number | undefined>;

/**
 * `draft` asks for what the editor is looking at rather than what visitors see,
 * and such an answer is never cached - it would be one editor's unsaved view
 * served to everybody.
 */
export async function storyblokFetch<T>(
  path: string,
  { query = {}, tags = [], draft = false }: {
    query?: Query;
    tags?: string[];
    draft?: boolean;
  } = {}
): Promise<T> {
  const token = process.env.STORYBLOK_TOKEN;
  if (!token) throw new Error("STORYBLOK_TOKEN не задан");

  const region = process.env.STORYBLOK_REGION ?? "eu";
  const host = HOSTS[region];
  if (!host) throw new Error(`STORYBLOK_REGION=${region} - такого региона нет`);

  const url = new URL(`https://${host}/v2/cdn/${path}`);
  url.searchParams.set("token", token);
  url.searchParams.set("version", draft ? "draft" : "published");
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    ...(draft
      ? { cache: "no-store" as const }
      : {
          cache: "force-cache" as const,
          next: { revalidate: MAX_AGE, tags: [ALL, ...tags] },
        }),
  });

  if (!response.ok) {
    throw new StoryblokError(response.status, path, await response.text());
  }

  return response.json() as Promise<T>;
}
