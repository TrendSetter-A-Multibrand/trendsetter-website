import { ArticleCard } from "@/components/blocks/ArticleCard";
import type { Article } from "@/lib/articles";

/**
 * The mockup does not use one uniform grid: it alternates a row of three square
 * cards with a row of two larger ones, and drops one of the three-card rows onto
 * a full-bleed red band. This repeats down the page.
 */
const ROW_PATTERN = [3, 2, 3, 2] as const;
const BRAND_ROW = 2;

type Row = { cols: number; onBrand: boolean; items: Article[] };

function toRows(articles: Article[]): Row[] {
  const rows: Row[] = [];
  let i = 0;
  let r = 0;
  while (i < articles.length) {
    const cols = ROW_PATTERN[r % ROW_PATTERN.length];
    rows.push({
      cols,
      onBrand: r % ROW_PATTERN.length === BRAND_ROW,
      items: articles.slice(i, i + cols),
    });
    i += cols;
    r += 1;
  }
  return rows;
}

export function ArticleGrid({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  return (
    <section className="flex flex-col gap-10">
      {toRows(articles).map((row, i) => (
        <div key={i} className={row.onBrand ? "on-dark bg-brand py-10" : undefined}>
          <div
            className={`grid gap-10 px-6 lg:px-10 ${
              row.cols === 3
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "sm:grid-cols-2"
            }`}
          >
            {row.items.map((article, j) => (
              <ArticleCard
                key={`${i}-${j}`}
                article={article}
                locale={locale}
                onBrand={row.onBrand}
                sizes={
                  row.cols === 3
                    ? "(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 92vw"
                    : "(min-width: 640px) 47vw, 92vw"
                }
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
