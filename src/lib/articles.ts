import type { EventPlacement } from "@/lib/events";

/** The card an article wears in Новости, over its own title, photo and lead. */
export type NewsPlacement = {
  cardTitle: string;
  cardImage?: string;
  cardExcerpt?: string;
};

/**
 * Where an article shows besides its main section. Each is the first block of
 * its kind the editor added, with the empty fields already taken from the
 * article - see parsePlacements.
 */
export type Placements = {
  news?: NewsPlacement;
  event?: EventPlacement;
  /** Only ever set together with `event`. */
  space?: { spaceSections: string[] };
};

export type Article = {
  /** The story's uuid - what an event or a Пространство card points at. */
  uuid?: string;
  placements?: Placements;
  tags: string[];
  title: string;
  /** Under the title on a journal card; not every piece carries one. */
  excerpt?: string;
  href?: string;
  image?: string;
  /** Which of the two sections it belongs to - what the search chips filter on. */
  section?: "journal" | "news";
  /** An event is its own kind of story and is never listed as an article. */
  kind?: "event";
};

/**
 * Tags arrive as free text and are written by hand, so compare them the way a
 * reader would rather than by exact bytes.
 */
export function sameTag(a: string, b: string) {
  const plain = (s: string) => s.trim().toLowerCase().replace(/ё/g, "е");
  return plain(a) === plain(b);
}

/** Where a tag under a card leads: its own section, narrowed to that tag. */
export function tagHref(
  locale: string,
  section: Article["section"],
  tag: string,
) {
  const path = section === "journal" ? "journal" : "news";
  return `/${locale}/${path}?tag=${encodeURIComponent(tag)}`;
}

/** Everything carrying the tag, or everything at all when none is asked for. */
export function byTag(articles: Article[], tag?: string) {
  if (!tag) return articles;
  return articles.filter((article) =>
    article.tags.some((own) => sameTag(own, tag)),
  );
}

/** `?tag=a&tag=b` arrives as a string, an array or nothing; make it a list. */
export function tagsFromParam(value: string | string[] | undefined) {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list.map((t) => t.trim()).filter(Boolean);
}

/** Articles carrying ANY of the tags; an empty set is everything. */
export function byTags(articles: Article[], tags: string[]) {
  if (!tags.length) return articles;
  return articles.filter((article) =>
    article.tags.some((own) => tags.some((tag) => sameTag(own, tag))),
  );
}

/** The empty-state line for a set of tags that matched nothing. */
export function noTagMatches(tags: string[]) {
  const quoted = tags.map((t) => `«${t}»`).join(", ");
  return `По ${tags.length > 1 ? "тегам" : "тегу"} ${quoted} пока ничего нет.`;
}

/**
 * Where a filter chip leads: the section with `tag` switched in or out of the
 * current set. Switching the last tag off lands on the bare section.
 */
export function toggleTagHref(
  locale: string,
  section: Article["section"],
  current: string[],
  tag: string,
) {
  const path = section === "journal" ? "journal" : "news";
  const next = current.some((own) => sameTag(own, tag))
    ? current.filter((own) => !sameTag(own, tag))
    : [...current, tag];
  if (!next.length) return `/${locale}/${path}`;
  const query = next.map((t) => `tag=${encodeURIComponent(t)}`).join("&");
  return `/${locale}/${path}?${query}`;
}

/**
 * A query is read as words unless a word is written as a hashtag. `дом` looks
 * for the word in titles, `#дом` for the tag, and the two can be mixed - every
 * part has to hold, so adding a word narrows rather than widens.
 */
export function parseQuery(query: string) {
  const tokens = query.trim().split(/\s+/).filter(Boolean);
  return {
    tags: tokens.filter((t) => t.startsWith("#")).map((t) => t.slice(1)),
    words: tokens.filter((t) => !t.startsWith("#")),
  };
}

export function search(articles: Article[], query: string) {
  const { tags, words } = parseQuery(query);
  if (!tags.length && !words.length) return [];
  return articles.filter(
    (article) =>
      tags.every((tag) => article.tags.some((own) => sameTag(own, tag))) &&
      words.every((word) =>
        article.title.toLowerCase().includes(word.toLowerCase()),
      ),
  );
}

/**
 * The chips over a section are the tags its cards actually carry - nothing
 * invented, nothing left over. First appearance wins the spelling, so whichever
 * way an editor cased the tag first is the way it is shown.
 */
export function tagsOf(articles: Article[]) {
  const seen: string[] = [];
  for (const article of articles) {
    for (const tag of article.tags) {
      if (!seen.some((own) => sameTag(own, tag))) seen.push(tag);
    }
  }
  return seen;
}

/**
 * The articles of one section, in the order they were written. Новости also
 * takes whatever is placed there, and shows each under the
 * card the editor drew for it, where there is one.
 */
export function inSection(
  articles: Article[],
  section: NonNullable<Article["section"]>,
) {
  // Events live in their own row and on their own page, not in the lists
  // (TRANSITION: remove the placements.event half after convert)
  const plain = articles.filter(
    (article) => article.kind !== "event" && !article.placements?.event,
  );
  if (section !== "news") {
    return plain.filter((article) => article.section === section);
  }
  return plain
    .filter((article) => article.section === "news" || article.placements?.news)
    .map((article) => {
      const card = article.placements?.news;
      if (!card) return article;
      return {
        ...article,
        title: card.cardTitle || article.title,
        image: card.cardImage || article.image,
        excerpt: card.cardExcerpt || article.excerpt,
      };
    });
}
