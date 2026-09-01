import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { StoryblokBridge } from "@/components/layout/StoryblokBridge";
import { Blocks } from "@/components/blocks";
import { fetchStory, type Block } from "@/lib/storyblok/fetchStory";

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
