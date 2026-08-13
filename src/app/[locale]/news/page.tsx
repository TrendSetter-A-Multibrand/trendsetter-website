import { PageCover } from "@/components/blocks/PageCover";
import { ArticleFilters } from "@/components/blocks/ArticleFilters";
import { ArticleGrid } from "@/components/blocks/ArticleGrid";
import { Pagination } from "@/components/ui/Pagination";
import { NEWS_FILTERS, PLACEHOLDER_ARTICLES } from "@/lib/articles";

// Same layout as the journal page - only the cover title and filters differ.
export default async function NewsPage({
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
      {/* Its own cover photo has not been handed over yet - borrowing the
          journal's until it is */}
      <PageCover
        title="Новости"
        subtitle="Главное в новостном потоке"
        imageSrc="/images/covers/journal.jpg"
      />
      <ArticleFilters filters={NEWS_FILTERS} />
      <ArticleGrid articles={articles} />
      <Pagination page={1} pageCount={222} hrefFor={(p) => `?page=${p}`} />
    </>
  );
}
