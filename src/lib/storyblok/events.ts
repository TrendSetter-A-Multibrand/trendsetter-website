import { eventDate, type Event } from "@/lib/events";
import { fetchStories } from "@/lib/storyblok/fetchStory";

type EventFields = {
  title?: string;
  location?: string;
  date?: string;
  description?: string;
  cta_label?: string;
  image?: { filename?: string };
};

/**
 * The events the space holds, in the shape the cards want. Read in one place
 * because two of them ask - the row on the home page and the foot of a brand's
 * sheet - and neither should have to know how a date is spelled.
 *
 * Where a card leads is still worked out from the slug, the way it was: an event
 * and the article about it share one. When articles become stories the event will
 * point at one, the way a brand points at a shop, and this goes.
 */
export async function fetchEvents(): Promise<Event[]> {
  const stories = await fetchStories<EventFields>("event");

  return stories.map(({ content, slug }) => {
    const { day, month, time } = eventDate(content.date ?? "");

    return {
      slug,
      day,
      month,
      time,
      title: content.title ?? "",
      location: content.location ?? "",
      description: content.description || undefined,
      ctaLabel: content.cta_label ?? "",
      image: content.image?.filename || undefined,
    };
  });
}
