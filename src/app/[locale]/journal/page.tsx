import { PageCover } from "@/components/blocks/PageCover";
import { ArticleFilters } from "@/components/blocks/ArticleFilters";
import { ArticleGrid } from "@/components/blocks/ArticleGrid";
import { Pagination } from "@/components/ui/Pagination";
import { JOURNAL_FILTERS, PLACEHOLDER_ARTICLES } from "@/lib/articles";

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const articles = PLACEHOLDER_ARTICLES.map((article, i) => ({
    ...article,
    href: `/${locale}/journal/article-${i + 1}`,
  }));

  return (
    <>
      <PageCover title="Журнал" imageSrc="/images/covers/articles.jpg" />
      <ArticleFilters filters={JOURNAL_FILTERS} />
      <ArticleGrid articles={articles} />
      <Pagination page={1} pageCount={222} hrefFor={(p) => `?page=${p}`} />
    </>
  );
}
