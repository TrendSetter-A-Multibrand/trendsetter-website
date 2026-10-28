import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { ArticleFilters } from "@/components/blocks/ArticleFilters";
import { Pagination } from "@/components/ui/Pagination";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { DEFAULT_SETTINGS } from "@/lib/siteDefaults";

/** The pager of the file's skeleton is the real one - ‹ 1 2 3 … 12 › - and comes in with the plates. */
function PagerSkeleton() {
  return (
    <div aria-hidden="true" className="pointer-events-none mt-14 animate-skeleton-in pb-22 opacity-0">
      <Pagination page={1} pageCount={12} hrefFor={() => "#"} />
    </div>
  );
}

/** The journal's: the editorial grid - a lead and three rows packed to its side - then six cards, three across. */
function JournalBody() {
  return (
    <>
      <section className="px-4 pt-6 md:px-10 md:pt-12">
        <div className="grid gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-12 lg:items-start">
          <div className="md:col-span-3 lg:col-span-8">
            <SkeletonCard layout="lead" />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-4 lg:gap-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className={i > 0 ? "border-t border-line pt-6 lg:py-6" : "lg:pb-6"}>
                <SkeletonCard layout="row" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-12 grid gap-x-6 px-4 md:mt-24 md:grid-cols-2 md:gap-y-12 md:px-10 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </>
  );
}

/** The news': a lead and two mid items, "[Коротко]" - six rows, and the pair. */
function NewsBody() {
  return (
    <div className="flex flex-col gap-12 px-4 pt-6 md:gap-24 md:px-10 md:pt-12">
      <div className="grid gap-x-6 gap-y-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SkeletonCard layout="lead" />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-4">
          {[0, 1].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>

      <section className="flex flex-col gap-6 md:gap-8">
        <SectionTitle heading="Коротко" />
        <div className="grid gap-x-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <SkeletonCard key={i} layout="note" />
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-4 md:gap-16">
        {[0, 1].map((i) => (
          <SkeletonCard key={i} layout="wide" />
        ))}
      </div>
    </div>
  );
}

/**
 * What the journal and the news show while their list is on its way, past 300 ms:
 * the crumbs, the section's head and the filter bar stay, and everything under
 * them - the shape of that section's own page, the journal's grid or the news
 * board - turns into plates of Paper of the same shape, with the pager, so the
 * height does not jump when the articles arrive. The cover's words are the
 * defaults; the filter bar has only "Все" until the tags are known.
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

      {section === "news" ? <NewsBody /> : <JournalBody />}
      <PagerSkeleton />
    </>
  );
}
