import { brandStores } from "@/lib/brands";
import type { Event } from "@/lib/events";

/** One shop a Пространство card says the goods are (or are not) in. */
export type SpaceStore = { name: string; available: boolean };

export type SpaceCardData = {
  title: string;
  body?: string;
  image?: string;
  /** A card with an address is a link to an article page, not a sheet. */
  href?: string;
  stores?: SpaceStore[];
  events?: Event[];
};

/** A card as the editor filled it, before the shops and events are looked up. */
export type SpaceCardInput = {
  title: string;
  body?: string;
  image?: string;
  /** Where the card leads, with the market on it; empty means it opens the sheet. */
  href?: string;
  /** The «Раздел Пространства» the card stands for; empty on a Collaboration card. */
  sectionKey?: string;
  availability: { store?: string; available?: boolean | string }[];
};

/**
 * Events shown under a section, soonest first. A card with no section chosen
 * shows them all, and the past ones are not hidden - the home row keeps them
 * too, until the old ones are archived.
 */
export function eventsForSection(events: Event[], sectionKey: string | undefined) {
  return events
    .filter((e) => !sectionKey || e.spaceSections.includes(sectionKey))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * A card with no availability rows says the goods are in every shop, the way a
 * brand with no row does: the sheet is never left without its «Наличие» block.
 */
export function buildSpaceCards(
  cards: SpaceCardInput[],
  shops: { uuid: string; name: string }[],
  events: Event[],
): SpaceCardData[] {
  return cards.map((card) => ({
    title: card.title,
    body: card.body,
    image: card.image,
    href: card.href,
    stores: card.availability.length
      ? brandStores(shops, card.availability)
      : shops.map((shop) => ({ name: shop.name, available: true })),
    events: eventsForSection(events, card.sectionKey),
  }));
}

/** The page whose cards are articles only: no sheet of shops and events opens there. */
export const LINKS_ONLY_PATH = "company/collaborations";

export const isLinksOnlyPage = (path: string | undefined) =>
  path?.replace(/^\/+|\/+$/g, "") === LINKS_ONLY_PATH;
