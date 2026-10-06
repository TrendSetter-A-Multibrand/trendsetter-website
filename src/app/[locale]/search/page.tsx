import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { ArticleCard } from "@/components/blocks/ArticleCard";
import { RecommendedRow } from "@/components/blocks/RecommendedRow";
import { NewsletterSignup } from "@/components/blocks/NewsletterSignup";
import { FilterChip } from "@/components/ui/FilterChip";
import { SearchField } from "@/components/ui/SearchField";
import { Pagination } from "@/components/ui/Pagination";
import { parseQuery, search } from "@/lib/articles";
import { fetchArticles } from "@/lib/storyblok/articles";
import { getSiteSettings } from "@/lib/siteSettings";

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
  const { search: copy } = await getSiteSettings();

  const { q = "", type = "all", page: rawPage } = await searchParams;
  const query = q.trim();

  // Words look through titles, #hashtags through tags, and the chips above
  // narrow whatever comes back to one section
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
      <section className="flex flex-col px-6 pt-6 lg:block lg:px-10 lg:pt-10">
        {/* 42 tall, 8 apart; the search itself stays up in the header. At 375
            the file puts the heading first, centred, and the chips under it. */}
        <div className="order-2 mt-6 flex flex-wrap gap-2 lg:mt-0">
          {SECTIONS.map((section) => (
            <FilterChip
              key={section.value}
              label={section.label}
              active={section.value === type}
              href={hrefFor(section.value)}
            />
          ))}
        </div>

        {/* Header has no room for the field at 375, so the file draws it on the
            page, under the chips; from lg it is back up in the header. */}
        <form
          action={`/${locale}/search`}
          method="get"
          className="order-3 mt-4 lg:hidden"
        >
          <SearchField name="q" defaultValue={query} placeholder={copy.placeholder} />
        </form>

        <div className="order-1 text-center lg:text-left">
          <h1 className="font-mono text-2xl/[31px] uppercase tracking-[1px] lg:mt-10 lg:text-[36px]/[44px] lg:tracking-[2px]">
            [{copy.heading}]
          </h1>

          {/* 60 on an 80 line - the one place on the site type gets this big. The
              file leaves nothing between it and the heading above, or between it
              and the apology below: the three read as one block. */}
          <p
            className={`font-mono uppercase text-brand max-lg:text-[36px]/[47px] max-lg:tracking-[3px] lg:text-[60px]/[80px] lg:tracking-[3px] ${
              matches.length === 0 ? "max-lg:hidden" : ""
            }`}
          >
            {query}
          </p>
        </div>

        {matches.length === 0 && (
          <div className="order-4 max-lg:-mx-6 max-lg:mt-6 max-lg:border-t max-lg:border-ink/15 max-lg:px-6 max-lg:pt-2">
            {/* At 375 the file moves the query down here, under a rule that
                runs the full width, and sets the apology in mono 16. */}
            <p className="text-center font-mono text-[36px]/[47px] uppercase tracking-[3px] text-brand lg:hidden">
              {query}
            </p>
            <p className="mt-4 font-mono text-base/5 lg:mt-0 lg:font-sans lg:text-2xl/[29px] lg:font-medium lg:tracking-[1px]">
              {copy.empty}
            </p>
          </div>
        )}

        {found.length > 0 && (
          <div className="order-4 mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {found.map((article, i) => (
              <ArticleCard
                key={i}
                article={article}
                locale={locale}
                highlight={words}
                sizes="(min-width: 1024px) 23vw, (min-width: 640px) 47vw, 92vw"
              />
            ))}
          </div>
        )}
      </section>

      {matches.length > 0 ? (
        // One page of results has no pager, and the air under the cards was
        // going with it - the red band was landing on the last line of a title
        pageCount > 1 ? (
          <Pagination
            page={page}
            pageCount={pageCount}
            hrefFor={(target) => hrefFor(type, target)}
          />
        ) : (
          <div className="pb-10" />
        )
      ) : (
        <div className="mt-10 pb-10">
          <RecommendedRow
            articles={all}
            locale={locale}
            heading={copy.recommended}
          />
        </div>
      )}

      <NewsletterSignup locale={locale} />
    </>
  );
}
