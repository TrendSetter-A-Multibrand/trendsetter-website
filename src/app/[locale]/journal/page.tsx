import { PageCover } from "@/components/blocks/PageCover";
import { ArticleFilters } from "@/components/blocks/ArticleFilters";
import { ArticleGrid } from "@/components/blocks/ArticleGrid";
import { Pagination } from "@/components/ui/Pagination";
import { byTag, tagsOf, PLACEHOLDER_ARTICLES } from "@/lib/articles";

export default async function JournalPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { locale } = await params;
  const { tag } = await searchParams;

  const all = PLACEHOLDER_ARTICLES.map((article, i) => ({
    ...article,
    href: `/${locale}/journal/article-${i + 1}`,
  }));
  // The chips are the tags the cards on this page carry, not a list of their own
  const filters = tagsOf(all);
  const articles = byTag(all, tag);

  return (
    <>
      <PageCover
        title="Журнал"
        subtitle="Разбираемся, сравниваем, считаем"
        imageSrc="/images/covers/journal.jpg"
      />
      <ArticleFilters
        filters={filters}
        locale={locale}
        section="journal"
        activeTag={tag}
      />
      {articles.length > 0 ? (
        <>
          <ArticleGrid articles={articles} locale={locale} />
          {/* 222 is the mockup's number and stands for the whole section; a tag
              narrows this to one screen, so the pager has nothing to say */}
          {!tag && (
            <Pagination page={1} pageCount={222} hrefFor={(p) => `?page=${p}`} />
          )}
        </>
      ) : (
        <p className="px-6 pb-16 text-lg lg:px-10 lg:text-2xl/[29px]">
          По тегу «{tag}» пока ничего нет.
        </p>
      )}
    </>
  );
}
