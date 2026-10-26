import { NotFoundHero } from "@/components/blocks/NotFoundHero";
import { ArticleCard } from "@/components/blocks/ArticleCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { defaultLocale } from "@/lib/i18n/locales";
import { inSection } from "@/lib/articles";
import { fetchArticles } from "@/lib/storyblok/articles";

/**
 * Renders inside the locale layout, so it keeps the header and footer. Next hands
 * a not-found page no params, so the links in the row are built for the default
 * market - which is where a reader who mistyped a path ends up anyway.
 *
 * The file's 404 is the Empty state and under it "[Последние новости]" with a
 * link to all of them: four Card S, in a row on a desktop and as list rows on a
 * phone, 32 under the heading (24 at 375) and 128 above the footer.
 */
export default async function NotFound() {
  const locale = defaultLocale;
  const latest = inSection(await fetchArticles(locale), "news").slice(0, 4);

  return (
    <>
      <NotFoundHero />

      {latest.length > 0 && (
        <section className="px-4 pb-32 md:px-10">
          <SectionTitle heading="Последние новости" href={`/${locale}/news`} linkLabel="Все новости" />
          <div className="mt-6 grid gap-x-6 md:mt-8 md:grid-cols-2 md:gap-y-10 xl:grid-cols-4">
            {latest.map((article, i) => (
              <div key={i} className="max-md:border-b max-md:border-line max-md:last:border-b-0">
                <ArticleCard
                  article={article}
                  locale={locale}
                  layout="list"
                  sizes="(min-width: 1280px) 322px, (min-width: 768px) 47vw, 137px"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
