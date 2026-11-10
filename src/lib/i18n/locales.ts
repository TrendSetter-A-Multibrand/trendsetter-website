export const locales = ["ru_ru", "ru_am"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru_ru";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Whether the default market's address leaves its prefix off: `/brands` rather
 * than `/ru_ru/brands`. The site is one market in one language for now. When a
 * second language comes, set this to false and every address carries its locale
 * again - nothing else needs to change.
 */
export const hideDefaultLocale = true;

/**
 * The address a visitor sees for a page, given its internal one (`/ru_ru/brands`
 * -> `/brands`). Only the default locale loses its prefix; a query or a hash
 * after it stays, and any other address is returned as it came.
 */
export function publicPath(path: string): string {
  if (!hideDefaultLocale) return path;
  const prefix = `/${defaultLocale}`;
  if (path === prefix) return "/";
  if (!path.startsWith(prefix)) return path;
  const rest = path.slice(prefix.length);
  if (rest.startsWith("/")) return rest;
  if (rest.startsWith("?") || rest.startsWith("#")) return `/${rest}`;
  return path;
}
