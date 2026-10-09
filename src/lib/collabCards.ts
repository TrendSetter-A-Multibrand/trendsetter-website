/** One card of the space_cards block on company/collaborations, as Storyblok holds it. */
export type CollabCard = {
  _uid?: string;
  component?: string;
  title?: string;
  image?: { filename?: string } | null;
  link?: { url?: string; cached_url?: string } | null;
  [field: string]: unknown;
};

export const COLLAB_COUNT = 6;
export const COLLAB_TITLE = "TRENDSETTER x Collaboration";
export const COLLAB_PATH = "company/collaborations";

/** The article a card number leads to: collab-1 ... collab-6. */
export const collabSlug = (n: number) => `collab-${n}`;

/** The address a card's link field holds; the site adds the locale in front. */
export const collabLink = (n: number) => ({
  fieldtype: "multilink",
  linktype: "url",
  url: `${COLLAB_PATH}/${collabSlug(n)}`,
  cached_url: `${COLLAB_PATH}/${collabSlug(n)}`,
});

const hasLink = (card: CollabCard) => Boolean(card.link?.url || card.link?.cached_url);

/**
 * The cards the page should have: the existing ones keep everything they have
 * (title, text, photo) and gain an address only where they have none; cards are
 * added up to six, each with the shared caption, the first photo found among the
 * existing cards and its own article. Nothing to change returns the same list.
 */
export function planCollabCards(
  cards: CollabCard[],
  newUid: () => string,
  count = COLLAB_COUNT,
): { cards: CollabCard[]; changed: boolean; noImage: boolean } {
  const photo = cards.find((card) => card.image?.filename)?.image;
  let changed = false;

  const out = cards.map((card, i) => {
    if (hasLink(card)) return card;
    changed = true;
    return { ...card, link: collabLink(i + 1) };
  });

  for (let n = out.length + 1; n <= count; n++) {
    changed = true;
    out.push({
      _uid: newUid(),
      component: "space_card",
      title: COLLAB_TITLE,
      body: "",
      ...(photo ? { image: photo } : {}),
      link: collabLink(n),
    });
  }

  return { cards: out, changed, noImage: !photo };
}
