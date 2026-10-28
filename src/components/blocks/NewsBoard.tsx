import { NewsItem } from "@/components/cards/NewsItem";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { boardOf, type Article } from "@/lib/articles";

/**
 * The file's news board, which is the body of the news page (the journal has its
 * own grid): the lead over eight columns with two mid items sharing the four
 * beside it; "[Коротко]" - six rows, three across; and a wide pair, the second
 * mirrored. 96 between the parts (48 at 375). On a phone every part but the lead
 * is a list of rows.
 *
 * The page's eleven articles fill it in that order - see `boardOf`; a page that
 * is short of articles leaves the later parts out.
 */
export function NewsBoard({ articles, locale }: { articles: Article[]; locale: string }) {
  const { lead, side, brief, pair } = boardOf(articles);

  return (
    <div className="flex flex-col gap-12 px-4 pt-6 md:gap-24 md:px-10 md:pt-12">
      {lead && (
        <div className="grid gap-x-6 gap-y-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <NewsItem
              article={lead}
              locale={locale}
              variant="lead"
              sizes="(min-width: 1024px) 898px, 100vw"
            />
          </div>
          {side.length > 0 && (
            <div className="flex flex-col gap-4 max-md:divide-y max-md:divide-line lg:col-span-4">
              {side.map((article, i) => (
                <NewsItem
                  key={i}
                  article={article}
                  locale={locale}
                  variant="mid"
                  sizes="(min-width: 1024px) 438px, 40vw"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {brief.length > 0 && (
        <section className="flex flex-col gap-6 md:gap-8">
          <SectionTitle heading="Коротко" />
          <div className="grid gap-x-6 max-md:divide-y max-md:divide-line md:grid-cols-2 lg:grid-cols-3">
            {brief.map((article, i) => (
              <div
                key={i}
                // A rule between the rows of the grid, none over the first row
                className={
                  i >= 3
                    ? "md:border-t md:border-line"
                    : i >= 2
                      ? "md:max-lg:border-t md:max-lg:border-line"
                      : ""
                }
              >
                <NewsItem article={article} locale={locale} variant="note" sizes="112px" />
              </div>
            ))}
          </div>
        </section>
      )}

      {pair.length > 0 && (
        <div className="flex flex-col gap-4 max-md:divide-y max-md:divide-line md:gap-16">
          {pair.map((article, i) => (
            <NewsItem
              key={i}
              article={article}
              locale={locale}
              variant="wide"
              mirrored={i === 1}
              sizes="(min-width: 768px) 437px, 40vw"
            />
          ))}
        </div>
      )}
    </div>
  );
}
