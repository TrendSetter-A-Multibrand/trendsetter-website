import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { Blocks } from "@/components/blocks";
import { StoryblokBridge } from "@/components/layout/StoryblokBridge";
import { storyblokFetch } from "@/lib/storyblok/client";
import { fetchStory, type Block } from "@/lib/storyblok/fetchStory";

/** The home story answers at the root, not at /home. */
const HOME = "home";

type Content = { component: string; body: Block[] };

/**
 * Any path under a locale that no file of its own answers. It is a story if the
 * space has one at that path, and the designed 404 otherwise - which is what
 * this segment was here for before it could read stories.
 *
 * So a page added in Storyblok is a page on the site with nothing written for it
 * here: the legal documents came through this route, and the next ones will too.
 */
export async function generateStaticParams() {
  // Asked fresh: the build must not learn which pages exist from a cache that
  // predates the newest of them.
  const { links } = await storyblokFetch<{
    links: Record<string, { slug: string; is_folder: boolean }>;
  }>("links", { fresh: true });

  return Object.values(links)
    .filter((link) => !link.is_folder && link.slug !== HOME)
    .map((link) => ({ slug: link.slug.split("/") }));
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
  if (!story) notFound();

  const { isEnabled: draft } = await draftMode();

  return (
    <>
      <Blocks body={story.content.body ?? []} locale={locale} />
      {draft && <StoryblokBridge />}
    </>
  );
}
