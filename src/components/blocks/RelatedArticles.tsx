import { ArticleCard } from "@/components/blocks/ArticleCard";
import type { Article } from "@/lib/articles";

/** Four 430px cards under a section heading, same rhythm as the home page. */
export function RelatedArticles({
  heading = "Похожие материалы",
  articles,
  locale,
}: {
  heading?: string;
  articles: Article[];
  locale: string;
}) {
  return (
    <section className="px-6 py-16 lg:px-10">
      <h2 className="mb-8 whitespace-nowrap font-mono text-xl uppercase tracking-[5px] lg:text-[30px]">
        [{heading}]
      </h2>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {articles.slice(0, 4).map((article, i) => (
          <ArticleCard
            key={i}
            article={article}
            locale={locale}
            sizes="(min-width: 1024px) 23vw, (min-width: 640px) 47vw, 92vw"
          />
        ))}
      </div>
    </section>
  );
}
