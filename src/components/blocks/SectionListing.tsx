import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { ArticleFilters } from "@/components/blocks/ArticleFilters";
import { EditorialGrid } from "@/components/blocks/EditorialGrid";
import { ArticleGrid } from "@/components/blocks/ArticleGrid";
import { MagazineSpread } from "@/components/blocks/MagazineSpread";
import { NewsBoard } from "@/components/blocks/NewsBoard";
import { Pagination } from "@/components/ui/Pagination";
import {
  byTags,
  inSection,
  newestFirst,
  noTagMatches,
  pageSizeOf,
  tagsOf,
} from "@/lib/articles";
import { fetchArticles } from "@/lib/storyblok/articles";
import { getSiteSettings } from "@/lib/siteSettings";

/**
 * The body of the journal and of the news. The journal's first page opens on the
 * editorial grid - a lead and three side items - with the rest of its twelve
 * under it; every other page of it, and any page of a rubric (a tag), is the
 * magazine spread. The news have their own board whatever the page - see
 * `NewsBoard` - and carry eleven to a page. The pager counts real pages. A tag
 * turns the editorial grid off - a narrowed list has no "main" piece - and the
 * pager keeps the tags when it turns the page.
 */
export async function SectionListing({
  section,
  locale,
  tags,
  page: rawPage,
}: {
  section: "journal" | "news";
  locale: string;
  tags: string[];
  page?: string;
}) {
  const { covers } = await getSiteSettings();
  const cover = covers[section];

  const everything = await fetchArticles(locale);
  const all = inSection(everything, section);
  // The chips are the tags the cards on this page carry, not a list of their own
  const filters = tagsOf(all);
  const articles = byTags(all, tags);

  const size = pageSizeOf(section);
  const pageCount = Math.max(1, Math.ceil(articles.length / size));
  const page = Math.min(Math.max(Number(rawPage) || 1, 1), pageCount);
  const onPage = articles.slice((page - 1) * size, page * size);

  const hrefFor = (target: number) => {
    const query = [
      ...tags.map((tag) => `tag=${encodeURIComponent(tag)}`),
      ...(target > 1 ? [`page=${target}`] : []),
    ].join("&");
    return `/${locale}/${section}${query ? `?${query}` : ""}`;
  };

  const editorial = page === 1 && tags.length === 0;

  return (
    <>
      <Breadcrumbs items={[{ label: "Главная", href: `/${locale}` }, { label: cover.title }]} />
      <PageCover title={cover.title} subtitle={cover.subtitle} imageSrc={cover.image} flush={false} />
      <ArticleFilters filters={filters} locale={locale} section={section} activeTags={tags} />

      {onPage.length > 0 ? (
        <>
          {section === "news" ? (
            <NewsBoard articles={onPage} locale={locale} />
          ) : editorial ? (
            <>
              <section className="px-4 pt-6 md:px-10 md:pt-12">
                <EditorialGrid articles={onPage} locale={locale} />
              </section>
              {onPage.length > 4 && (
                <div className="mt-12 md:mt-24">
                  <ArticleGrid articles={onPage.slice(4)} locale={locale} />
                </div>
              )}
            </>
          ) : (
            <MagazineSpread
              articles={onPage}
              news={newestFirst(inSection(everything, "news")).slice(0, 4)}
              locale={locale}
            />
          )}
          {/* 96 over the pager and 128 under it, the pager's own 40 either side counted */}
          {pageCount > 1 ? (
            <div className="mt-14 pb-22">
              <Pagination page={page} pageCount={pageCount} hrefFor={hrefFor} />
            </div>
          ) : (
            <div className="pb-32" />
          )}
        </>
      ) : (
        <p className="type-body-l px-4 pb-16 md:px-10">{noTagMatches(tags)}</p>
      )}
    </>
  );
}
