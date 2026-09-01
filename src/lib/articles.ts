export type Article = {
  tags: string[];
  title: string;
  /** Under the title on a journal card; not every piece carries one. */
  excerpt?: string;
  href?: string;
  image?: string;
  /** Which of the two sections it belongs to - what the search chips filter on. */
  section?: "journal" | "news";
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

/** The articles of one section, in the order they were written. */
export function inSection(
  articles: Article[],
  section: NonNullable<Article["section"]>,
) {
  return articles.filter((article) => article.section === section);
}
