import { eventDate, type Event } from "@/lib/events";

/**
 * The old event stories (content type `event`) and how they meet the articles.
 * Until the placements are migrated an article points at its event through the
 * `event` field, and some events have no article at all - a card for those must
 * not lead to a page that is not there.
 */
export type LegacyEvent = {
  title?: string;
  location?: string;
  date?: string;
  description?: string;
  cta_label?: string;
  image?: { filename?: string };
};

type Stored<T> = { uuid: string; slug: string; content: T };

/** An event story in the shape the cards and the sign-up sheet want. */
export function eventFromLegacy(
  story: Stored<LegacyEvent>,
  href: string,
  signupEnabled: boolean,
): Event {
  const { content } = story;
  const { day, month, time } = eventDate(content.date ?? "");
  return {
    uuid: story.uuid,
    slug: story.slug,
    href,
    date: content.date ?? "",
    signupEnabled,
    spaceSections: [],
    day,
    month,
    time,
    title: content.title ?? "",
    location: content.location ?? "",
    description: content.description || undefined,
    ctaLabel: content.cta_label ?? "",
    image: content.image?.filename || undefined,
  };
}

/**
 * Where a legacy event's card leads: the article of the same slug, else the
 * article whose `event` field holds the event's uuid, else nowhere ("") - the
 * card then has no button rather than a link to a 404.
 */
export function legacyHref(
  event: { uuid: string; slug: string },
  articles: { slug: string; content: { event?: string } }[],
  locale: string,
): string {
  const article =
    articles.find((a) => a.slug === event.slug) ??
    articles.find((a) => a.content.event === event.uuid);
  return article ? `/${locale}/journal/${article.slug}` : "";
}
