import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { ArticleCard } from "@/components/blocks/ArticleCard";
import { RecommendedRow } from "@/components/blocks/RecommendedRow";
import { NewsletterSignup } from "@/components/blocks/NewsletterSignup";
import { FilterChip } from "@/components/ui/FilterChip";
import { Pagination } from "@/components/ui/Pagination";
import { PLACEHOLDER_ARTICLES } from "@/lib/articles";

/**
 * Both halves of the mockup live here: the same head - chips, [РЕЗУЛЬТАТЫ
 * ПОИСКА] and the query set 60px in red - and then either the grid of matches,
 * eight to a page with the pager under it, or the apology followed by a row of
 * recommendations.
 *
 * Matching is a plain substring over the placeholder articles until Storyblok
 * is wired up and can answer a real query.
 */
const SECTIONS = [
  { label: "Все", value: "all" },
  { label: "Новости", value: "news" },
  { label: "Журнал", value: "journal" },
];

const PER_PAGE = 8;

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { q = "", type = "all", page: rawPage } = await searchParams;
  const query = q.trim();

  const matches = query
    ? PLACEHOLDER_ARTICLES.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) &&
          (type === "all" || article.section === type),
      )
    : [];

  const pageCount = Math.max(1, Math.ceil(matches.length / PER_PAGE));
  const page = Math.min(Math.max(Number(rawPage) || 1, 1), pageCount);
  const found = matches.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const hrefFor = (section: string, target?: number) =>
    `/${locale}/search?q=${encodeURIComponent(query)}&type=${section}` +
    (target && target > 1 ? `&page=${target}` : "");

  return (
    <>
      <section className="px-6 pt-10 lg:px-10">
        {/* 42 tall, 16 apart; the search itself stays up in the header */}
        <div className="flex flex-wrap gap-4">
          {SECTIONS.map((section) => (
            <FilterChip
              key={section.value}
              label={section.label}
              active={section.value === type}
              href={hrefFor(section.value)}
            />
          ))}
        </div>

        <h1 className="mt-10 font-mono text-xl uppercase tracking-[3px] lg:text-2xl/[31.2px]">
          [Результаты поиска]
        </h1>

        {/* 60 on an 80 line - the one place on the site type gets this big */}
        <p className="mt-6 font-mono uppercase text-brand max-lg:text-4xl lg:text-[60px]/[80px] lg:tracking-[3px]">
          {query}
        </p>

        {matches.length === 0 && (
          <p className="text-lg tracking-[1px] lg:text-2xl/[29px]">
            Результатов не найдено. Попробуйте использовать другое слово.
          </p>
        )}

        {found.length > 0 && (
          <div className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {found.map((article, i) => (
              <ArticleCard
                key={i}
                article={article}
                locale={locale}
                highlight={query}
                sizes="(min-width: 1024px) 23vw, (min-width: 640px) 47vw, 92vw"
              />
            ))}
          </div>
        )}
      </section>

      {matches.length > 0 ? (
        <Pagination
          page={page}
          pageCount={pageCount}
          hrefFor={(target) => hrefFor(type, target)}
        />
      ) : (
        <div className="mt-10 pb-10">
          <RecommendedRow articles={PLACEHOLDER_ARTICLES} locale={locale} />
        </div>
      )}

      <NewsletterSignup locale={locale} />
    </>
  );
}
