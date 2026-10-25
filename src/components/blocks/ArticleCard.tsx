import { CardS } from "@/components/cards/CardS";
import { tagHref, type Article } from "@/lib/articles";

type ArticleCardProps = {
  article: Article;
  /** Needed for the tag links; every page that shows a card knows it. */
  locale: string;
  sizes?: string;
  /** In a list it is a row on a phone; in a strip that swipes it stays a stack. */
  layout?: "stack" | "list";
  /** Search results pick the matched words out of the title in red. */
  highlight?: string[];
};

/** Splits the title on the words searched for; the mockup sets them red and up. */
function mark(title: string, words: string[]) {
  const needles = words.map((w) => w.trim()).filter(Boolean);
  if (!needles.length) return title;
  const hit = new RegExp(`(${needles.map(escape).join("|")})`, "gi");
  return title.split(hit).map((part, i) =>
    needles.some((n) => n.toLowerCase() === part.toLowerCase()) ? (
      <span key={i} className="uppercase text-brand">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * An article as the file's Card S: the photo, the rubrics, the reading time and
 * the title. Search results pick the matched words out of the title in red.
 */
export function ArticleCard({
  article,
  locale,
  sizes,
  layout = "stack",
  highlight,
}: ArticleCardProps) {
  return (
    <CardS
      href={article.href ?? "#"}
      title={highlight?.length ? mark(article.title, highlight) : article.title}
      image={article.image}
      tags={article.tags.map((tag) => ({
        label: tag,
        href: tagHref(locale, article.section, tag),
      }))}
      minutes={article.readingMinutes}
      layout={layout}
      sizes={sizes}
    />
  );
}
