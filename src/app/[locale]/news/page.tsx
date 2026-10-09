import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { ArticleFilters } from "@/components/blocks/ArticleFilters";
import { ArticleGrid } from "@/components/blocks/ArticleGrid";
import { Pagination } from "@/components/ui/Pagination";
import { byTags, inSection, noTagMatches, tagsFromParam, tagsOf } from "@/lib/articles";
import { fetchArticles } from "@/lib/storyblok/articles";
import { seo } from "@/lib/seo";
import { getSiteSettings } from "@/lib/siteSettings";

// Same layout as the journal page - only the cover, the filters and where a
// tag leads differ. Articles still open under /journal: there is no separate
// news article route in the file yet.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return seo({
    title: "Новости",
    description:
      "Главное в новостном потоке TRENDSETTER: открытия магазинов, новые бренды и коллекции.",
    path: "/news",
    locale,
  });
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  const { locale } = await params;
  const tags = tagsFromParam((await searchParams).tag);
  const { covers } = await getSiteSettings();

  const all = inSection(await fetchArticles(locale), "news");
  // The chips are the tags the cards on this page carry, not a list of their own
  const filters = tagsOf(all);
  const articles = byTags(all, tags);

  return (
    <>
      <div className="lg:py-5">
        <Breadcrumbs
          items={[{ label: "Главная", href: `/${locale}` }, { label: covers.news.title }]}
        />
      </div>
      <PageCover
        title={covers.news.title}
        subtitle={covers.news.subtitle}
        imageSrc={covers.news.image}
        flush={false}
      />
      <ArticleFilters
        filters={filters}
        locale={locale}
        section="news"
        activeTags={tags}
      />
      {articles.length > 0 ? (
        <>
          <ArticleGrid articles={articles} locale={locale} />
          {/* 222 is the mockup's number and stands for the whole section; a tag
              narrows this to one screen, so the pager has nothing to say */}
          {tags.length === 0 && (
            <Pagination page={1} pageCount={222} hrefFor={(p) => `?page=${p}`} />
          )}
        </>
      ) : (
        <p className="px-4 pb-16 text-lg lg:px-10 lg:text-2xl/[29px]">
          {noTagMatches(tags)}
        </p>
      )}
    </>
  );
}
