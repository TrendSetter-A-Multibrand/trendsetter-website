import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { ArticleCard } from "@/components/blocks/ArticleCard";
import { RecommendedRow } from "@/components/blocks/RecommendedRow";
import { NewsletterSignup } from "@/components/blocks/NewsletterSignup";
import { SearchHead } from "@/components/blocks/SearchHead";
import { Pagination } from "@/components/ui/Pagination";
import { parseQuery, search } from "@/lib/articles";
import { fetchArticles } from "@/lib/storyblok/articles";
import { getSiteSettings } from "@/lib/siteSettings";

/**
 * The file's Search head and what comes under it: the crumbs, then a field 56
 * tall with a Red "Найти" beside it (898 across on a desktop), the page's H1,
 * the chips «Все / Новости / Журнал» and "[Найдено: N]" in Caption - the count
 * is wanted here - and the results as Card S: rows on a phone, two across from
 * 768, four from 1280, and a row of three when there are three or fewer. The
 * pager under them, 48 below. With nothing found the head says so and a row of
 * recommendations follows.
 *
 * Matching is a plain substring over the articles; words look through titles,
 * #hashtags through tags, and the chips narrow what comes back to one section.
 */
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
  const { search: copy } = await getSiteSettings();

  const { q = "", type = "all", page: rawPage } = await searchParams;
  const query = q.trim();

  const { words } = parseQuery(query);
  const all = await fetchArticles(locale);
  const matches = search(all, query).filter(
    (article) => type === "all" || article.section === type,
  );

  const pageCount = Math.max(1, Math.ceil(matches.length / PER_PAGE));
  const page = Math.min(Math.max(Number(rawPage) || 1, 1), pageCount);
  const found = matches.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const hrefFor = (section: string, target?: number) =>
    `/${locale}/search?q=${encodeURIComponent(query)}&type=${section}` +
    (target && target > 1 ? `&page=${target}` : "");

  return (
    <>
      <SearchHead
        locale={locale}
        query={query}
        type={type}
        copy={copy}
        count={matches.length}
      />

      {found.length > 0 && (
        <div className="px-4 md:px-10">
          <div
            className={`grid gap-x-6 md:gap-y-12 ${
              matches.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4"
            }`}
          >
            {found.map((article, i) => (
              <div key={i} className="max-md:border-b max-md:border-line max-md:last:border-b-0">
                <ArticleCard
                  article={article}
                  locale={locale}
                  layout="list"
                  highlight={words}
                  sizes="(min-width: 1280px) 23vw, (min-width: 768px) 47vw, 137px"
                />
              </div>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="mt-2 md:mt-0">
              <Pagination
                page={page}
                pageCount={pageCount}
                hrefFor={(target) => hrefFor(type, target)}
              />
            </div>
          )}
        </div>
      )}

      {matches.length === 0 && (
        <>
          <p className="type-body-l max-w-[640px] px-4 text-ink md:px-10">{copy.empty}</p>
          <div className="mt-12 md:mt-16">
            <RecommendedRow articles={all} locale={locale} heading={copy.recommended} />
          </div>
        </>
      )}

      <div className="mt-16 md:mt-32">
        <NewsletterSignup locale={locale} />
      </div>
    </>
  );
}
