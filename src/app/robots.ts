import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Everything is open except the two routes that are ours rather than a reader's:
 * the door the editor comes in through and the one Storyblok knocks on. Neither
 * has anything to index and both are behind a secret anyway.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
