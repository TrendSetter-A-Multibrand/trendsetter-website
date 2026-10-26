import { Fragment } from "react";
import { LeadCard } from "@/components/cards/LeadCard";
import { SideItem } from "@/components/cards/SideItem";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { tagHref, type Article } from "@/lib/articles";

const tagsOf = (article: Article, locale: string) =>
  article.tags.map((tag) => ({
    label: tag,
    href: tagHref(locale, article.section, tag),
  }));

/**
 * The file's Editorial grid, which every journal and news page opens on: one lead
 * and its side items. Desktop (1024 and up) - the lead takes eight of the twelve
 * columns and the side items stand in a column of four beside it, a thin rule in
 * the middle of the gap between them. From 768 the lead has the row to itself and
 * the side items go three across under it. On a phone it is the lead and then the
 * side items as rows.
 *
 * The first article leads; the next three are side items.
 */
export function EditorialGrid({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  const [lead, ...rest] = articles;
  if (!lead) return null;
  const side = rest.slice(0, 3);

  return (
    <div className="grid gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-12">
      <div className="md:col-span-3 lg:col-span-8 lg:row-span-3">
        <LeadCard
          href={lead.href ?? "#"}
          title={lead.title}
          excerpt={lead.excerpt}
          image={lead.image}
          tags={tagsOf(lead, locale)}
          minutes={lead.readingMinutes}
          sizes="(min-width: 1024px) 898px, 100vw"
        />
      </div>

      {side.map((article, i) => (
        <Fragment key={i}>
          {/* Phone and the wide desktop: rows with a rule between them */}
          <div
            className={`md:hidden lg:col-span-4 lg:col-start-9 lg:block ${
              i > 0 ? "border-t border-line pt-6" : ""
            }`}
          >
            <SideItem
              href={article.href ?? "#"}
              title={article.title}
              image={article.image}
              tags={tagsOf(article, locale)}
              minutes={article.readingMinutes}
              sizes="175px"
            />
          </div>
          {/* 768 to 1023: three across, as stacks */}
          <div className="hidden md:block lg:hidden">
            <SideItem
              layout="stack"
              href={article.href ?? "#"}
              title={article.title}
              image={article.image}
              tags={tagsOf(article, locale)}
              minutes={article.readingMinutes}
              sizes="33vw"
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

/** A section of the journal on a page: its head, then the grid. */
export function JournalSection({
  heading = "Журнал",
  articles,
  locale,
}: {
  heading?: string;
  articles: Article[];
  locale: string;
}) {
  // No records, no section: a heading over nothing is worse than nothing
  if (articles.length === 0) return null;
  return (
    <section className="px-4 pt-16 md:px-10 md:pt-32">
      <SectionTitle
        heading={heading}
        href={`/${locale}/journal`}
        linkLabel="Все материалы"
        className="mb-6 md:mb-8"
      />
      <EditorialGrid articles={articles} locale={locale} />
    </section>
  );
}
