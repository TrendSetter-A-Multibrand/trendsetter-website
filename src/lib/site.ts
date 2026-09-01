import { locales, type Locale } from "@/lib/i18n/locales";

/**
 * Where the site answers. Search engines need absolute addresses - a canonical
 * link or an og:image with a path and no host is worthless - so this has to be
 * known at build time.
 *
 * Vercel hands us the production host of its own accord, which is enough for a
 * preview and for the deployment we have now. NEXT_PUBLIC_SITE_URL overrides it
 * and is what the real domain goes into, so that a preview deployment does not
 * start naming itself as the canonical address of the site.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/** The name that closes every title, and stands alone on the home page. */
export const siteName = "TRENDSETTER";

/**
 * Both markets are written in Russian; what differs is which country's shops and
 * prices they carry. So `ru` for the language and the country after it, which is
 * what a search engine matches a reader against.
 */
export const HREFLANG: Record<Locale, string> = {
  ru_ru: "ru-RU",
  ru_am: "ru-AM",
};

/**
 * The same page in the other market, for `alternates.languages`. A path here is
 * everything after the locale, with its leading slash or empty for the root.
 */
export function languages(path = "") {
  return Object.fromEntries(
    locales.map((locale) => [HREFLANG[locale], `/${locale}${path}`])
  );
}

/** Both markets' addresses for one page, for the sitemap. */
export function everyLocale(path = "") {
  return locales.map((locale) => `${siteUrl}/${locale}${path}`);
}

/**
 * The same, absolute, for the sitemap's own alternates. Keyed by the language
 * tag rather than by our name for the market: `ru_ru` means nothing to a search
 * engine and `ru-RU` is what it matches a reader against.
 */
export function absoluteLanguages(path = "") {
  return Object.fromEntries(
    locales.map((locale) => [HREFLANG[locale], `${siteUrl}/${locale}${path}`])
  );
}
