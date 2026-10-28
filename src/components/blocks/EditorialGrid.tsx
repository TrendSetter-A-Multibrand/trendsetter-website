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
 * The file's Editorial grid: one lead and its side items. Desktop (1024 and up) -
 * the lead takes eight of the twelve columns and the side items stand in a column
 * of four beside it, packed to the top: 24 above and below each row and a thin
 * rule between rows (none over the first). They are not spread over the height of
 * the lead - its text under the photo is not theirs to fill. From 768 the lead has
 * the row to itself and the side items go three across under it. On a phone it is
 * the lead and then the side items as rows.
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
    <div className="grid gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-12 lg:items-start">
      <div className="md:col-span-3 lg:col-span-8">
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

      {/* Phone and the wide desktop: rows, packed to the top on a desktop */}
      <div className="flex flex-col gap-6 md:hidden lg:col-span-4 lg:flex lg:gap-0">
        {side.map((article, i) => (
          <div
            key={i}
            className={i > 0 ? "border-t border-line pt-6 lg:py-6" : "lg:pb-6"}
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
        ))}
      </div>

      {/* 768 to 1023: three across, as stacks */}
      {side.map((article, i) => (
        <div key={i} className="hidden md:block lg:hidden">
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
