/** The kinds of building a place name starts with, which say nothing about which one it is. */
const KINDS = new Set(["трц", "трк", "тц", "тк", "торговый", "центр", "комплекс"]);

export type StoreRef ={ uuid: string; name: string };

/**
 * What a place is called, boiled down for comparing: the word in the quotes when
 * there is one («Мозаика» out of «ТРЦ «Мозаика»» and out of ТЦ "Мозаика"), else
 * the whole line without the kind of building in front of it.
 */
export function placeKey(text: string): string {
  const lower = text.toLowerCase().replace(/ё/g, "е");
  const quoted = lower.match(/[«"“„']([^«»"“”„']+)[»"”“']/);
  const words = (quoted ? quoted[1] : lower).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  return (quoted ? words : words.filter((w) => !KINDS.has(w))).join(" ");
}

/**
 * The store an event is held at. The editor's choice in the «Магазин» field
 * wins; without one, the «Место» line is matched against the stores' names
 * ("ТЦ \"Мозаика\"" is the ТРЦ «Мозаика»). A place that is not one of our stores
 * - an atrium of someone else's - matches nothing and the event has no store.
 */
export function storeOfEvent(
  event: { store: string; location: string },
  stores: StoreRef[],
): StoreRef | null {
  if (event.store) {
    return stores.find((s) => s.uuid === event.store) ?? { uuid: event.store, name: "" };
  }
  const place = placeKey(event.location);
  if (!place) return null;
  return (
    stores.find((s) => {
      const name = placeKey(s.name);
      return name !== "" && (name === place || name.includes(place) || place.includes(name));
    }) ?? null
  );
}
