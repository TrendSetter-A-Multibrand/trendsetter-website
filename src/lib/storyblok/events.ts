import { eventFromPlacement, type Event } from "@/lib/events";
import { fetchStories, type Block } from "@/lib/storyblok/fetchStory";
import type { ArticleFields } from "@/lib/storyblok/articles";
import { parsePlacements } from "@/lib/storyblok/placements";

/** A news_event story's root: the article's fields and the event's own. */
export type NewsEventFields = Omit<ArticleFields, "section" | "placements" | "event"> & {
  date?: string;
  location?: string;
  card_title?: string;
  card_image?: { filename?: string };
  card_description?: string;
  cta_label?: string;
  signup_enabled?: boolean;
  seats?: number | string;
  space_sections?: string[];
};

/**
 * The event a news_event story is, in the shape the cards and the page want.
 * The event's fields sit in the root of the story; an empty card field takes
 * the story's own title, cover and lead. Null without a date: there is nothing
 * to put on a card.
 */
export function eventFromStory(
  story: { uuid: string; slug: string; name?: string; content: NewsEventFields },
  locale: string,
): Event | null {
  const { content } = story;
  const placements = parsePlacements(
    [
      { ...content, _uid: "", component: "placement_event" } as Block,
      { _uid: "", component: "placement_space", space_sections: content.space_sections } as Block,
    ],
    {
      title: content.title ?? story.name ?? "",
      image: content.hero?.filename || undefined,
      excerpt: content.excerpt || undefined,
    },
  );
  if (!placements?.event) return null;
  return eventFromPlacement(
    story,
    { ...placements.event, spaceSections: placements.space?.spaceSections },
    locale,
  );
}

/**
 * The events the space holds, in the shape the cards want, soonest first: the
 * news_event stories. The card and the page it opens are one record, so the two
 * cannot disagree about the date. Read in one place because two of them ask -
 * the row on the home page and the foot of a brand's sheet.
 */
export async function fetchEvents(locale: string): Promise<Event[]> {
  const [events, articles] = await Promise.all([
    fetchStories<NewsEventFields>("news_event"),
    // TRANSITION: remove after convert
    fetchStories<ArticleFields>("article"),
  ]);

  const fromStories = events.flatMap((story) => {
    const event = eventFromStory(story, locale);
    return event ? [event] : [];
  });

  // TRANSITION: remove after convert
  const fromArticles = articles.flatMap((story) => {
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
  });

  return [...fromStories, ...fromArticles].sort((a, b) => a.date.localeCompare(b.date));
}

