import { Fragment } from "react";
import Link from "next/link";
import { CardImage } from "@/components/ui/CardImage";

import { tagHref, type Article } from "@/lib/articles";

type ArticleCardProps = {
  article: Article;
  /** Needed for the tag links; every page that shows a card knows it. */
  locale: string;
  /** Cards on the red band carry white text instead of red tags on dark type. */
  onBrand?: boolean;
  sizes?: string;
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
 * The photo and the title lead to the article, each tag to its own section
 * filtered down to that tag. Three links rather than one wrapping the lot,
 * because a link inside a link is not a thing a browser will render. The photo
 * is hidden from the keyboard so the card is one stop and not two.
 */
export function ArticleCard({
  article,
  locale,
  onBrand,
  sizes,
  highlight,
}: ArticleCardProps) {
  const href = article.href ?? "#";

  return (
    <div className="group flex flex-col">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative aspect-square overflow-hidden"
      >
        <CardImage src={article.image} sizes={sizes} label="Читать" />
      </Link>

      <p
        className={`mt-6 font-mono text-sm/[18px] font-medium uppercase tracking-[1px] ${
          onBrand ? "text-white" : "text-brand"
        }`}
      >
        {article.tags.map((tag, i) => (
          <Fragment key={tag}>
            {i > 0 && " "}
            <Link
              href={tagHref(locale, article.section, tag)}
              className="hover:underline"
            >
              [{tag}]
            </Link>
          </Fragment>
        ))}
      </p>

      <Link
        href={href}
        className={`mt-4 text-2xl/[29px] font-medium ${
          onBrand ? "text-white" : "text-ink"
        }`}
      >
        {highlight?.length ? mark(article.title, highlight) : article.title}
      </Link>
    </div>
  );
}
