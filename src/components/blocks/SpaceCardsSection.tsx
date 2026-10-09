import { SpaceCards } from "@/components/blocks/SpaceCards";
import { fetchEvents } from "@/lib/storyblok/events";
import { fetchStories } from "@/lib/storyblok/fetchStory";
import { buildSpaceCards, type SpaceCardInput } from "@/lib/space";

type StoreFields = { name?: string };

/**
 * Reads the shops and the events once for the page and hands each card its own
 * share: the shops through the card's availability rows (all of them when it
 * has none), the events whose «Раздел Пространства» is the card's (all when it
 * has none).
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
