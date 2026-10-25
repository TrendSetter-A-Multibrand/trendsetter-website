import { ArticleCard } from "@/components/blocks/ArticleCard";
import type { Article } from "@/lib/articles";

/**
 * A list of articles as Card S: one row each on a phone, two across from 768 and
 * three from 1024, 24 between them. (The editorial grid with a lead and its side
 * items is the page's own layout; this is the plain listing under it.)
 */
export function ArticleGrid({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  return (
    <section className="px-4 md:px-10">
      <div className="grid gap-x-6 gap-y-0 md:grid-cols-2 md:gap-y-10 lg:grid-cols-3">
        {articles.map((article, i) => (
          <div key={i} className="max-md:border-b max-md:border-line max-md:last:border-b-0">
            <ArticleCard
              article={article}
              locale={locale}
              layout="list"
              sizes="(min-width: 1024px) 437px, (min-width: 768px) 47vw, 137px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
