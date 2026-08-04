import { PageCover } from "@/components/blocks/PageCover";
import { ArticleFilters } from "@/components/blocks/ArticleFilters";
import { ArticleGrid } from "@/components/blocks/ArticleGrid";
import { Pagination } from "@/components/ui/Pagination";
import { ARTICLE_FILTERS, PLACEHOLDER_ARTICLES } from "@/lib/articles";

// Same layout as the journal page - the designer confirmed both sections use it.
export default function NewsPage() {
  return (
    <>
      <PageCover title="Новости" imageSrc="/images/journal/cover.jpg" />
      <ArticleFilters filters={ARTICLE_FILTERS} />
      <ArticleGrid articles={PLACEHOLDER_ARTICLES} />
      <Pagination page={1} pageCount={222} hrefFor={(p) => `?page=${p}`} />
    </>
  );
}
