import { ArticleCard } from "@/components/blocks/ArticleCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { Article } from "@/lib/articles";

/**
 * "Читайте также" closing an article: the section head and Card S, four across on
 * a desktop (two from 768) and one under another as rows on a phone, a thin rule
 * between them. More than four are not drawn - this is a nudge to the next
 * piece, not the section again.
 */
export function RelatedArticles({
  heading = "Читайте также",
  articles,
  locale,
}: {
  heading?: string;
  articles: Article[];
  locale: string;
}) {
  // No records, no section: a heading over nothing is worse than nothing
  if (articles.length === 0) return null;

  return (
    <section className="px-4 pt-16 md:px-10 md:pt-32">
      <SectionTitle heading={heading} className="mb-6 md:mb-8" />
      <div className="grid gap-x-6 gap-y-0 max-md:divide-y max-md:divide-line md:grid-cols-2 md:gap-y-10 lg:grid-cols-4">
        {articles.slice(0, 4).map((article, i) => (
          <ArticleCard
            key={i}
            article={article}
            locale={locale}
            layout="list"
            sizes="(min-width: 1024px) 322px, (min-width: 768px) 47vw, 137px"
          />
        ))}
      </div>
    </section>
  );
}
