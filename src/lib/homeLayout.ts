import type { Block } from "@/lib/storyblok/fetchStory";

/**
 * The home page's sections in the order the file draws them: the cover, the
 * journal, the news, the season wall, what is in the shops, the events, the
 * shops and the subscription.
 */
const ORDER = [
  "hero",
  "journal_row",
  "news_row",
  "season_wall",
  "categories_row",
  "events_row",
  "stores_row",
  "newsletter",
];

/** Anything the file does not know sits among the middle sections, in its own order. */
const UNKNOWN_RANK = ORDER.indexOf("events_row") + 0.5;

const link = (url: string) => ({ id: "", url, linktype: "url", fieldtype: "multilink", cached_url: url });

/**
 * What the two sections the old home story never had say until an editor writes
 * them in Storyblok. The guide's words are the file's own sample, not copy that
 * has been agreed: the card leads to the journal rather than to a guide that
 * does not exist yet, and the tiles to the brands page.
 */
const SEASON_WALL: Block = {
  _uid: "fallback-season-wall",
  component: "season_wall",
  dark: "осень",
  red: "в магазинах",
  label: "Сезон",
  title: "Гид по осени",
  text: "Тренч, вязаное и лён для дома — вещи, которые служат дольше одного сезона.",
  link_label: "Читать гид",
  link: link("journal"),
};

const CATEGORIES_ROW: Block = {
  _uid: "fallback-categories-row",
  component: "categories_row",
  heading: "Что есть в магазинах",
  tiles: ["Одежда", "Дом", "Косметика", "Детское", "Еда", "Ателье"].map((label, i) => ({
    _uid: `fallback-category-${i}`,
    component: "category_tile",
    label,
    link: link("brands"),
  })),
};

/**
 * A home story written for the old design lists its sections in the old order
 * and has no season wall or category tiles. Until the editor has moved it to
 * the new one - which they have done once a season wall is in the story - the
 * page puts what is there in the file's order and fills the two gaps, so the
 * site reads as the file does. A story that already has a season wall is the
 * editor's own and is left exactly as written.
 */
export function homeLayout(body: Block[]): Block[] {
  if (body.some((block) => block.component === "season_wall")) return body;

  const have = new Set(body.map((block) => block.component));
  const all = [
    ...body,
    ...(have.has("season_wall") ? [] : [SEASON_WALL]),
    ...(have.has("categories_row") ? [] : [CATEGORIES_ROW]),
  ];

  const rank = (block: Block) => {
    const at = ORDER.indexOf(block.component);
    return at === -1 ? UNKNOWN_RANK : at;
  };

  // Array.prototype.sort is stable, so blocks of one kind keep the editor's order
  return [...all].sort((a, b) => rank(a) - rank(b));
}
