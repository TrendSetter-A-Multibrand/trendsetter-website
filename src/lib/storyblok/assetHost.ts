/**
 * Storyblok serves its files from a.storyblok.com, and that host is not reachable
 * from every network the site is built and read in - from Russia it does not
 * answer at all. The very same bucket answers on Amazon's own address, so every
 * file address coming out of Storyblok is turned into that one: the picture is
 * fetched through next/image by our server and handed on from our own domain, and
 * a visitor never has to reach the CDN host.
 */
const CDN = "https://a.storyblok.com/";
const BUCKET = "https://s3.amazonaws.com/a.storyblok.com/";

/** Walks an answer of any shape and rewrites each file address in it. */
export function reachableAssets<T>(value: T): T {
  if (typeof value === "string") {
    return (value.startsWith(CDN) ? BUCKET + value.slice(CDN.length) : value) as T;
  }
  if (Array.isArray(value)) return value.map(reachableAssets) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, reachableAssets(item)]),
    ) as T;
  }
  return value;
}
