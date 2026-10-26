import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { ArticleFilters } from "@/components/blocks/ArticleFilters";
import { EditorialGrid } from "@/components/blocks/EditorialGrid";
import { ArticleGrid } from "@/components/blocks/ArticleGrid";
import { MagazineSpread } from "@/components/blocks/MagazineSpread";
import { Pagination } from "@/components/ui/Pagination";
import {
  PAGE_SIZE,
  byTags,
  inSection,
  newestFirst,
  noTagMatches,
  tagsOf,
} from "@/lib/articles";
import { fetchArticles } from "@/lib/storyblok/articles";
import { getSiteSettings } from "@/lib/siteSettings";

/**
 * The body of the journal and of the news, which are one layout. The first page
 * of the whole section opens on the editorial grid - a lead and three side items
 * - with the rest of its twelve under it; every other page, and any page of a
 * rubric (a tag), is the magazine spread. The pager counts real pages of twelve.
 * A tag turns the editorial grid off - a narrowed list has no "main" piece - and
 * the pager keeps the tags when it turns the page.
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

  const pageCount = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const page = Math.min(Math.max(Number(rawPage) || 1, 1), pageCount);
  const onPage = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
          {editorial ? (
            <>
              <section className="px-4 md:px-10">
                <EditorialGrid articles={onPage} locale={locale} />
              </section>
              {onPage.length > 4 && (
                <div className="mt-12 md:mt-16">
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
          <Pagination page={page} pageCount={pageCount} hrefFor={hrefFor} />
        </>
      ) : (
        <p className="type-body-l px-4 pb-16 md:px-10">{noTagMatches(tags)}</p>
      )}
    </>
  );
}
