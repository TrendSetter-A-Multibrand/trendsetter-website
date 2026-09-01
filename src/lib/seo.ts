import type { Metadata } from "next";
import { languages, siteName, siteUrl } from "@/lib/site";

/** Shown where a page has nothing of its own to say about itself. */
export const DEFAULT_DESCRIPTION =
  "TRENDSETTER — мультибрендовый магазин одежды, обуви и аксессуаров: мировые бренды, магазины в городе, журнал и события.";

/**
 * The photo a link to us carries when it is shared. A real one, drawn for the
 * purpose, is a job for the designer; until then the cover of the home page,
 * which is at least ours and at least a photograph.
 */
const DEFAULT_IMAGE = "/images/home/hero.jpg";

/**
 * What every page says about itself. `path` is everything after the locale - its
 * leading slash, or empty for the root - and it is what the canonical address and
 * the two markets' alternates are built from, so a page never names itself as
 * living somewhere else.
 */
export function seo({
  title,
  description,
  image,
  path = "",
  locale,
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  locale: string;
}): Metadata {
  const written = description?.trim() || DEFAULT_DESCRIPTION;
  const picture = image || DEFAULT_IMAGE;
  const url = `/${locale}${path}`;

  return {
    // Left out rather than set empty where a page has no title of its own: an
    // explicit undefined here overrides the default in the root layout, and the
    // home page would end up with no title at all.
    ...(title ? { title } : {}),
    description: written,
    alternates: { canonical: url, languages: languages(path) },
    openGraph: {
      title: title ? `${title} — ${siteName}` : siteName,
      description: written,
      url: `${siteUrl}${url}`,
      siteName,
      type: "website",
      locale: locale === "ru_am" ? "ru_AM" : "ru_RU",
      images: [{ url: picture }],
    },
  };
}
