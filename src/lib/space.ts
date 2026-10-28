import { brandStores } from "@/lib/brands";
import type { Event } from "@/lib/events";

/** One shop a Пространство card says the goods are (or are not) in. */
export type SpaceStore = { name: string; available: boolean };

export type SpaceCardData = {
  title: string;
  body?: string;
  image?: string;
  /** The rubric over the sheet's title, brackets left to the sheet: "Зона 03". */
  label?: string;
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
 * The shops and the events are only for a card whose editor asked for them: the
 * file's zone sheet is a photo and a write-up, so a card with no availability
 * rows has no shops and one with no section has no events.
 */
export function buildSpaceCards(
  cards: SpaceCardInput[],
  shops: { uuid: string; name: string }[],
  events: Event[],
): SpaceCardData[] {
  return cards.map((card, i) => ({
    title: card.title,
    body: card.body,
    image: card.image,
    // The file's sheet carries the zone's number over its title; a card that is a link has no sheet
    label: card.href ? undefined : `Зона ${String(i + 1).padStart(2, "0")}`,
    href: card.href,
    stores: card.availability.length ? brandStores(shops, card.availability) : [],
    events: card.sectionKey ? eventsForSection(events, card.sectionKey) : [],
  }));
}

/** The page whose cards are articles only: no sheet of shops and events opens there. */
export const LINKS_ONLY_PATH = "company/collaborations";

export const isLinksOnlyPage = (path: string | undefined) =>
  path?.replace(/^\/+|\/+$/g, "") === LINKS_ONLY_PATH;
