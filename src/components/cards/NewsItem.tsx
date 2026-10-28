import Link from "next/link";
import { CardImage } from "@/components/ui/CardImage";
import { tagHref, type Article } from "@/lib/articles";

type Variant = "lead" | "mid" | "note" | "wide";

/**
 * The file's News item, the module of the news board. Every one carries its date,
 * then one rubric, in the meta line - 12 apart, on the baseline.
 *
 * lead - a 16:10 photo, the meta, the title in H2 and the lead in Body L (640),
 * Text-2. mid - a 4:3 photo, the meta and the title in H4. note - the "Коротко"
 * row: a 112 square beside the meta, the title in H4 and a line in Body S, 24 of
 * air above and below. wide - the photo over four columns and the text over
 * seven, centred on each other, the title in H2 (640) and the line in Body (600);
 * `mirrored` puts the photo at the right. Below 768 everything but the lead is a
 * row with the photo at 40%. Hovering turns the title Red.
 */
export function NewsItem({
  article,
  locale,
  variant,
  mirrored = false,
  sizes,
}: {
  article: Article;
  locale: string;
  variant: Variant;
  mirrored?: boolean;
  sizes?: string;
}) {
  const href = article.href ?? "#";
  const tag = article.tags[0];

  const meta = (
    <div className="type-caption flex items-baseline gap-3 text-ink">
      {article.publishedAt && <span>{article.publishedAt}</span>}
      {tag && (
        <Link href={tagHref(locale, "news", tag)} className="hover:underline">
          [{tag}]
        </Link>
      )}
    </div>
  );

  const title = (className: string) => (
    <Link
      href={href}
      className={`${className} text-ink transition-colors duration-150 hover:text-brand active:text-brand`}
    >
      {article.title}
    </Link>
  );

  const photo = (className: string) => (
    <Link
      href={href}
      tabIndex={-1}
      aria-hidden="true"
      className={`relative overflow-hidden bg-surface ${className}`}
    >
      <CardImage src={article.image} sizes={sizes} />
    </Link>
  );

  if (variant === "lead") {
    return (
      <article className="flex flex-col gap-4">
        {photo("aspect-[4/3] w-full md:aspect-[16/10]")}
        {meta}
        {title("type-h2")}
        {article.excerpt && (
          <p className="type-body-l max-w-[640px] text-text-2">{article.excerpt}</p>
        )}
      </article>
    );
  }

  if (variant === "mid") {
    return (
      <article className="flex gap-4 max-md:py-4 md:flex-col">
        {photo("aspect-[4/3] w-[40%] min-w-[120px] shrink-0 md:w-full")}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {meta}
          {title("type-h4")}
        </div>
      </article>
    );
  }

  if (variant === "note") {
    return (
      <article className="flex gap-4 py-6">
        {photo("size-[88px] shrink-0 md:size-[112px]")}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {meta}
          {title("type-h4")}
          {article.excerpt && <p className="type-body-s text-text-2">{article.excerpt}</p>}
        </div>
      </article>
    );
  }

  return (
    <article
      className={`flex gap-4 max-md:py-4 md:items-center md:gap-6 ${mirrored ? "md:flex-row-reverse" : ""}`}
    >
      {photo("aspect-[4/3] w-[40%] min-w-[120px] shrink-0 md:aspect-auto md:h-[273px] md:w-[437px]")}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {meta}
        {title("type-body leading-[1.35] md:type-h2 md:max-w-[640px]")}
        {article.excerpt && (
          <p className="type-body hidden max-w-[600px] text-text-2 md:block">{article.excerpt}</p>
        )}
      </div>
    </article>
  );
}
