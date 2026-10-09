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


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return seo({
    title: "Журнал",
    description:
      "Разбираемся, сравниваем, считаем: тексты о моде, красоте, доме и людях от редакции TRENDSETTER.",
    path: "/journal",
    locale,
  });
}

export default async function JournalPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  const { locale } = await params;
  const tags = tagsFromParam((await searchParams).tag);

  const { covers } = await getSiteSettings();
  const all = inSection(await fetchArticles(locale), "journal");
  // The chips are the tags the cards on this page carry, not a list of their own
  const filters = tagsOf(all);
  const articles = byTags(all, tags);

  return (
    <>
      <div className="lg:py-5">
        <Breadcrumbs
          items={[{ label: "Главная", href: `/${locale}` }, { label: covers.journal.title }]}
        />
      </div>
      <PageCover
        title={covers.journal.title}
        subtitle={covers.journal.subtitle}
        imageSrc={covers.journal.image}
        flush={false}
      />
      <ArticleFilters
        filters={filters}
        locale={locale}
        section="journal"
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
