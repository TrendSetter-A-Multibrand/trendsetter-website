import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { ArticleCard } from "@/components/blocks/ArticleCard";
import { RecommendedRow } from "@/components/blocks/RecommendedRow";
import { NewsletterSignup } from "@/components/blocks/NewsletterSignup";
import { FilterChip } from "@/components/ui/FilterChip";
import { PLACEHOLDER_ARTICLES } from "@/lib/articles";

/**
 * Both halves of the mockup live here: the same head - chips, [РЕЗУЛЬТАТЫ
 * ПОИСКА] and the query set 60px in red - and then either the grid of matches or
 * the apology followed by a row of recommendations.
 *
 * Matching is a plain substring over the placeholder articles until Storyblok
 * is wired up and can answer a real query.
 */
const SECTIONS = [
  { label: "Журнал", value: "journal" },
  { label: "Новости", value: "news" },
];

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { q = "", type = SECTIONS[0].value } = await searchParams;
  const query = q.trim();
  const found = query
    ? PLACEHOLDER_ARTICLES.filter((article) =>
        article.title.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <>
      <section className="px-6 pt-10 lg:px-10">
        <div className="flex flex-wrap gap-4">
          {SECTIONS.map((section) => (
            <FilterChip
              key={section.value}
              label={section.label}
              active={section.value === type}
              href={`/${locale}/search?q=${encodeURIComponent(query)}&type=${section.value}`}
            />
          ))}
        </div>

        <h1 className="mt-10 font-mono text-xl uppercase tracking-[3px] lg:text-2xl/[29px]">
          [Результаты поиска]
        </h1>

        <p className="mt-7 font-mono uppercase text-brand max-lg:text-4xl lg:text-[60px]/[73px] lg:tracking-[3px]">
          {query}
        </p>

        {found.length === 0 && (
          <p className="mt-1 text-lg lg:text-2xl/[29px]">
            Результатов не найдено. Попробуйте использовать другое слово.
          </p>
        )}
      </section>

      {found.length > 0 ? (
        <section className="mt-11 px-6 lg:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {found.map((article, i) => (
              <ArticleCard
                key={i}
                article={article}
                highlight={query}
                sizes="(min-width: 1024px) 23vw, (min-width: 640px) 47vw, 92vw"
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-5">
          <RecommendedRow articles={PLACEHOLDER_ARTICLES} />
        </div>
      )}

      <div className="mt-5">
        <NewsletterSignup locale={locale} />
      </div>
    </>
  );
}
