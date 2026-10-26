import { SpaceCards } from "@/components/blocks/SpaceCards";
import { fetchEvents } from "@/lib/storyblok/events";
import { fetchStories } from "@/lib/storyblok/fetchStory";
import { buildSpaceCards, type SpaceCardInput } from "@/lib/space";

type StoreFields = { name?: string };

/**
 * Hands each card to the tiles. Where a card has availability rows its sheet
 * lists the shops through them, and where it has a «Раздел Пространства» the
 * events of that section - read once for the page, and only when some card asks;
 * a card with neither is a photo and a write-up, as the file draws it.
 */
export async function SpaceCardsSection({
  cards,
  locale,
  linksOnly = false,
}: {
  cards: SpaceCardInput[];
  locale: string;
  /** Collaborations: articles only, no sheets - so no shops or events to fetch. */
  linksOnly?: boolean;
}) {
  if (linksOnly) {
    return <SpaceCards linksOnly cards={buildSpaceCards(cards, [], [])} />;
  }

  // Shops and events are read only when some card asks for them
  const wantsMore = cards.some((card) => card.availability.length > 0 || card.sectionKey);
  if (!wantsMore) {
    return <SpaceCards cards={buildSpaceCards(cards, [], [])} />;
  }

  const [shops, events] = await Promise.all([
    fetchStories<StoreFields>("store"),
    fetchEvents(locale),
  ]);

  const allShops = shops.map((shop) => ({
    uuid: shop.uuid,
    name: shop.content.name ?? shop.name,
  }));

  return <SpaceCards cards={buildSpaceCards(cards, allShops, events)} />;
}
