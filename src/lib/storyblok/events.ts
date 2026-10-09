import { eventFromPlacement, type Event } from "@/lib/events";
import { DEMO_SEATS, isSignupDemo } from "@/lib/eventSignup";
import { eventFromLegacy, legacyHref, type LegacyEvent } from "@/lib/legacyEvents";
import { fetchStories } from "@/lib/storyblok/fetchStory";
import type { ArticleFields } from "@/lib/storyblok/articles";
import { parsePlacements } from "@/lib/storyblok/placements";

/**
 * The events the space holds, in the shape the cards want: the articles that
 * carry a «Ближайшие события» placement, soonest first. The card and the article
 * it opens are one record, so the card leads to the article's own page and the
 * two cannot disagree about the date. Read in one place because two of them ask
 * - the row on the home page and the foot of a brand's sheet.
 *
 * Until the placements are migrated the space holds only the old event stories;
 * with no article carrying a placement the row falls back to them, a card
 * leading to the article of the same slug as before, so the home page never
 * goes empty between the code and the content.
 */
async function fetchLegacyEvents(locale: string): Promise<Event[]> {
  const [stories, articles] = await Promise.all([
    fetchStories<LegacyEvent>("event"),
    fetchStories<ArticleFields>("article"),
  ]);
  // Only to show the sheet with no database yet: the stand-in count the demo
  // sign-up answers with. Never set on a real site.
  const demo = isSignupDemo();
  return stories.map((story) => ({
    ...eventFromLegacy(story, legacyHref(story, articles, locale), demo),
    ...(demo ? { seats: DEMO_SEATS } : {}),
  }));
}

export async function fetchEvents(locale: string): Promise<Event[]> {
  const stories = await fetchStories<ArticleFields>("article");

  const fromArticles = stories
    .flatMap((story) => {
      const { content } = story;
      const placement = parsePlacements(content.placements, {
        title: content.title ?? "",
        image: content.hero?.filename || undefined,
        excerpt: content.excerpt || undefined,
      });
      if (!placement?.event) return [];
      return [
        eventFromPlacement(
          story,
          { ...placement.event, spaceSections: placement.space?.spaceSections },
          locale,
        ),
      ];
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return fromArticles.length > 0 ? fromArticles : fetchLegacyEvents(locale);
}
