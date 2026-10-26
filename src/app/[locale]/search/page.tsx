import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { ArticleCard } from "@/components/blocks/ArticleCard";
import { RecommendedRow } from "@/components/blocks/RecommendedRow";
import { NewsletterSignup } from "@/components/blocks/NewsletterSignup";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buttonClass } from "@/components/ui/Button";
import { FilterChip } from "@/components/ui/FilterChip";
import { Pagination } from "@/components/ui/Pagination";
import { SearchIcon } from "@/components/ui/Icons";
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
const SECTIONS = [
  { key: "all", value: "all" },
  { key: "news", value: "news" },
  { key: "journal", value: "journal" },
] as const;

const PER_PAGE = 8;

// The file's own word for the page; the settings' older "Результаты поиска" is not used
const HEADING = "Поиск";

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
      <div className="md:pt-0">
        <Breadcrumbs
          items={[{ label: "Главная", href: `/${locale}` }, { label: HEADING }]}
        />
      </div>

      <section className="flex flex-col gap-6 px-4 pb-8 md:px-10 md:pt-12">
        {/* The field and its button: 56 tall, the field flexing */}
        <form
          action={`/${locale}/search`}
          method="get"
          className="flex gap-2 md:max-w-[898px]"
        >
          <input type="hidden" name="type" value={type} />
          <label className="flex h-14 min-w-0 flex-1 items-center gap-3 border border-ink bg-white pl-4 pr-3 focus-within:border-2 focus-within:border-brand focus-within:pl-[15px] focus-within:pr-[11px]">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={copy.placeholder}
              className="type-body min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-text-2 [&::-webkit-search-cancel-button]:appearance-none"
            />
            <SearchIcon className="max-md:hidden" />
          </label>
          <button type="submit" className={buttonClass("primary", "L")}>
            Найти
          </button>
        </form>

        <h1 className="type-h1 text-ink">{HEADING}</h1>

        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] max-md:-mx-4 max-md:px-4 [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((section) => (
            <FilterChip
              key={section.value}
              label={copy.filters[section.key]}
              active={section.value === type}
              href={hrefFor(section.value)}
            />
          ))}
        </div>

        <p className="type-caption uppercase text-text-2">[Найдено: {matches.length}]</p>
      </section>

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
