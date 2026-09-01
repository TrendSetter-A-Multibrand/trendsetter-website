import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { Blocks } from "@/components/blocks";
import { StoryblokBridge } from "@/components/layout/StoryblokBridge";
import { storyblokFetch } from "@/lib/storyblok/client";
import { fetchStory, type Block } from "@/lib/storyblok/fetchStory";
import { seo } from "@/lib/seo";

/** The home story answers at the root, not at /home. */
const HOME = "home";

/** The one kind of story this route draws. */
const PAGE = "page";

type Content = {
  component: string;
  body: Block[];
  meta_title?: string;
  meta_description?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const path = slug.join("/");
  const story = await fetchStory<Content>(path);
  if (!story || story.content.component !== PAGE) return {};

  // The story's own name where nothing was written for the search results: it is
  // what the editor called the page, which is usually what a reader wants to see.
  return seo({
    title: story.content.meta_title || story.name,
    description: story.content.meta_description,
    path: `/${path}`,
    locale,
  });
}

/**
 * Any path under a locale that no file of its own answers. It is a story if the
 * space has one at that path, and the designed 404 otherwise - which is what
 * this segment was here for before it could read stories.
 *
 * So a page added in Storyblok is a page on the site with nothing written for it
 * here: the legal documents came through this route, and the next ones will too.
 */
export async function generateStaticParams() {
  // Pages only. The space also holds shops, brands, events and articles, and
  // those are not pages: each is drawn by the block or the route that knows how,
  // and prerendering them here would claim their addresses with empty pages.
  //
  // Asked fresh: the build must not learn which pages exist from a cache that
  // predates the newest of them.
  const { stories } = await storyblokFetch<{
    stories: { full_slug: string }[];
  }>("stories", { query: { content_type: PAGE, per_page: 100 }, fresh: true });

  return stories
    .filter((story) => story.full_slug !== HOME)
    .map((story) => ({ slug: story.full_slug.split("/") }));
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  // The home story has an address of its own, so /home is not a second one
  const path = slug.join("/");
  if (path === HOME) notFound();

  const story = await fetchStory<Content>(path);
  // A shop or an article sits at a path of its own too, and is not a page: it is
  // drawn where it belongs, not here.
  if (!story || story.content.component !== PAGE) notFound();

  const { isEnabled: draft } = await draftMode();

  return (
    <>
      <Blocks body={story.content.body ?? []} locale={locale} />
      {draft && <StoryblokBridge />}
    </>
  );
}
