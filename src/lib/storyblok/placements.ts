import type { Placements } from "@/lib/articles";
import type { Block } from "@/lib/storyblok/fetchStory";

/** What an empty placement field takes from the article it belongs to. */
export type PlacementFallback = {
  title: string;
  image?: string;
  excerpt?: string;
};

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const image = (value: unknown) =>
  (value as { filename?: string } | undefined)?.filename || undefined;

/** A number box arrives as text; empty or not a number is no number. */
function count(value: unknown) {
  if (typeof value !== "number" && str(value) === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

/** The checkbox is on unless the editor switched it off. */
const isOn = (value: unknown) => value !== false && value !== "false";

/**
 * The placements an editor added to an article, read the way the schema says:
 * the first block of each kind counts and a second is ignored, and a field left
 * empty takes the article's own value. An event with no date is no event -
 * there is nothing to put on a card - and a Пространство placement only means
 * anything beside an event.
 */
export function parsePlacements(
  blocks: Block[] | undefined,
  article: PlacementFallback,
): Placements | undefined {
  const first = (component: string) =>
    (blocks ?? []).find((blok) => blok.component === component);

  const placements: Placements = {};

  const news = first("placement_news");
  if (news) {
    placements.news = {
      cardTitle: str(news.card_title) || article.title,
      cardImage: image(news.card_image) || article.image,
      cardExcerpt: str(news.card_excerpt) || article.excerpt,
    };
  }

  const event = first("placement_event");
  const date = str(event?.date);
  if (event && date) {
    placements.event = {
      date,
      location: str(event.location),
      cardTitle: str(event.card_title) || article.title,
      cardImage: image(event.card_image) || article.image,
      cardDescription: str(event.card_description) || article.excerpt,
      ctaLabel: str(event.cta_label) || "Подробнее",
      signupEnabled: isOn(event.signup_enabled),
      seats: count(event.seats),
    };

    const space = first("placement_space");
    if (space) {
      const sections = Array.isArray(space.space_sections)
        ? (space.space_sections as unknown[]).map(str).filter(Boolean)
        : [];
      placements.space = { spaceSections: sections };
    }
  }

  return Object.keys(placements).length ? placements : undefined;
}
