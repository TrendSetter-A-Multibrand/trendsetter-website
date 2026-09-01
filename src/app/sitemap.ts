import type { MetadataRoute } from "next";
import { absoluteLanguages, everyLocale } from "@/lib/site";
import { storyblokFetch } from "@/lib/storyblok/client";
import { JOURNAL } from "@/lib/storyblok/articles";

/**
 * The pages that answer from a file of their own rather than from a story. The
 * two section pages and the shops and brands lists; the search results and the
 * 404 are left out, having nothing anybody should arrive at from a search.
 */
const OWN_ROUTES = [
  "",
  "/journal",
  "/news",
  "/brands",
  "/stores",
  "/company/careers",
];

type Listed = { full_slug: string; published_at: string | null };

/**
 * Asked fresh, like the list the build prerenders from: a sitemap naming
 * yesterday's pages is worse than none.
 */
async function published(contentType: string) {
  const { stories } = await storyblokFetch<{ stories: Listed[] }>("stories", {
    query: { content_type: contentType, per_page: 100 },
    fresh: true,
  });
  return stories;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, articles] = await Promise.all([
    published("page"),
    published("article"),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  const add = (path: string, lastModified?: string | null) => {
    for (const url of everyLocale(path)) {
      entries.push({
        url,
        lastModified: lastModified ? new Date(lastModified) : undefined,
        alternates: { languages: absoluteLanguages(path) },
      });
    }
  };

  for (const route of OWN_ROUTES) add(route);

  // The home story answers at the root, which OWN_ROUTES already names
  for (const page of pages) {
    if (page.full_slug === "home") continue;
    add(`/${page.full_slug}`, page.published_at);
  }

  for (const article of articles) {
    add(`/${JOURNAL}/${article.full_slug.split("/").pop()}`, article.published_at);
  }

  return entries;
}
