import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { StoryblokBridge } from "@/components/layout/StoryblokBridge";
import { Blocks } from "@/components/blocks";
import { fetchStory, type Block } from "@/lib/storyblok/fetchStory";
import { seo } from "@/lib/seo";

type Seo = { meta_title?: string; meta_description?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const story = await fetchStory<Seo>("home");

  // No title of its own: the home page is the name of the site, and the template
  // would otherwise write it out twice.
  return seo({
    title: story?.content.meta_title || undefined,
    description: story?.content.meta_description,
    locale,
  });
}

/**
 * The page is whatever the home story says it is: the editor's own list of
 * sections, in the editor's own order. Nothing about the page is written here,
 * which is the point - the next section is added in Storyblok, not in this file.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const story = await fetchStory<{ component: string; body: Block[] }>("home");
  if (!story) notFound();

  // Nothing of the editor reaches a visitor: the bridge is only mounted for a
  // request that carries the draft cookie.
  const { isEnabled: draft } = await draftMode();

  return (
    <>
      <Blocks body={story.content.body ?? []} locale={locale} />
      {draft && <StoryblokBridge />}
    </>
  );
}
