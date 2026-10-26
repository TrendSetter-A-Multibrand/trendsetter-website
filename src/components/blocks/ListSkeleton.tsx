import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { ArticleFilters } from "@/components/blocks/ArticleFilters";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { DEFAULT_SETTINGS } from "@/lib/siteDefaults";

/**
 * What the journal and the news show while their list is on its way, past 300 ms:
 * the crumbs, the section's head and the filter bar stay, and the editorial grid
 * under them - the lead and three side items - and a row of cards turn into
 * plates of Paper of the same shape, so the height does not jump when the
 * articles arrive. The cover's words are the defaults; the filter bar has only
 * "Все" until the tags are known.
 */
export function ListSkeleton({
  section,
  locale,
}: {
  section: "journal" | "news";
  locale: string;
}) {
  const cover = DEFAULT_SETTINGS.covers[section];

  return (
    <>
      <Breadcrumbs items={[{ label: "Главная", href: `/${locale}` }, { label: cover.title }]} />
      <PageCover title={cover.title} subtitle={cover.subtitle} />
      <ArticleFilters filters={[]} locale={locale} section={section} />

      <section className="px-4 md:px-10">
        <div className="grid gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-12">
          <div className="md:col-span-3 lg:col-span-8 lg:row-span-3">
            <SkeletonCard layout="lead" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="lg:col-span-4 lg:col-start-9">
              <SkeletonCard layout="row" />
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 grid gap-x-6 px-4 pb-10 md:mt-16 md:grid-cols-2 md:gap-y-10 md:px-10 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </>
  );
}
