import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/blocks/ArticleCard";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { spreadOf, type Article } from "@/lib/articles";

const PLATES = ["bg-ext-blue", "bg-ext-pink", "bg-ext-mint"];

const metaOf = (article: Article) => (
  <>
    <p>{article.tags.map((tag) => `[${tag}]`).join(" ")}</p>
    {article.readingMinutes ? <p className="shrink-0">{article.readingMinutes} мин чтения</p> : null}
  </>
);

/**
 * The file's Magazine module "Cover": the photo across the whole measure under a
 * Sage veil of 40%, the rubrics and the reading time in White at the top of the
 * text, the title in H2 (up to 790 wide) and the lead in Body L (560). 680 tall
 * on a desktop, 460 at 375, the text at the foot with 48 round it (16 and 24 at
 * 375).
 */
function Cover({ article }: { article: Article }) {
  return (
    <Link
      href={article.href ?? "#"}
      className="on-dark group relative flex h-[460px] flex-col justify-end overflow-hidden bg-ink text-white md:h-[680px]"
    >
      {article.image && (
        <Image
          src={article.image}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 1360px, 100vw"
          className="object-cover"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-ink/40" />
      <div className="relative flex flex-col gap-3 px-4 py-6 md:p-12">
        <div className="type-caption flex items-start justify-between gap-2 uppercase">
          {metaOf(article)}
        </div>
        <h2 className="type-h2 max-w-[790px] group-hover:underline">{article.title}</h2>
        {article.excerpt && <p className="type-body-l max-w-[560px]">{article.excerpt}</p>}
      </div>
    </Link>
  );
}

/**
 * The file's Magazine module "Rail": the news on a Paper plate - "[Новости]" and
 * four dates with their headlines under a rule, then a link to all of them. It
 * stands in the fourth column beside the staggered cards and stays put while they
 * scroll past.
 */
function Rail({ news, locale }: { news: Article[]; locale: string }) {
  if (news.length === 0) return null;
  return (
    <aside className="flex flex-col gap-4 bg-surface p-6 md:p-8 lg:sticky lg:top-[calc(var(--header-h,116px)+24px)] lg:self-start">
      <h2 className="type-label uppercase text-ink">[Новости]</h2>
      <ul>
        {news.map((item, i) => (
          <li key={i} className={`py-3 ${i > 0 ? "border-t border-line" : ""}`}>
            <Link href={item.href ?? "#"} className="group flex flex-col gap-1">
              {item.publishedAt && (
                <span className="type-caption uppercase text-ink">{item.publishedAt}</span>
              )}
              <span className="type-body text-ink transition-colors duration-150 group-hover:text-brand">
                {item.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <LinkArrow href={`/${locale}/news`}>Все новости</LinkArrow>
      </div>
    </aside>
  );
}

/** The file's Magazine module "Plate": a coloured plate round a square photo, the meta and the title in H3 (H4 on the 280 plate of a phone). */
function Plate({ article, tone }: { article: Article; tone: string }) {
  return (
    <Link
      href={article.href ?? "#"}
      className={`group flex w-[280px] shrink-0 snap-start flex-col gap-4 p-6 text-ink md:w-auto md:shrink ${tone}`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-white/40">
        {article.image && (
          <Image
            src={article.image}
            alt=""
            fill
            sizes="(min-width: 768px) 30vw, 232px"
            className="object-cover"
          />
        )}
      </div>
      <div className="type-caption flex items-start justify-between gap-2 uppercase">
        {metaOf(article)}
      </div>
      <h3 className="type-h4 md:type-h3 group-hover:underline">{article.title}</h3>
    </Link>
  );
}

/**
 * The magazine spread the file draws for the journal's second page onwards and
 * for a rubric: the cover; two columns of cards, the second 128 lower, with the
 * news rail beside them; three coloured plates; and two pairs of a wide card and
 * a narrow one, the second pair mirrored. 96 between the parts (48 at 375). On a
 * phone the cards go back to rows and the plates swipe.
 *
 * The page's twelve articles fill it in that order - see `spreadOf`; one that is
 * short of articles simply leaves the later parts out.
 */
export function MagazineSpread({
  articles,
  news,
  locale,
}: {
  articles: Article[];
  news: Article[];
  locale: string;
}) {
  const { cover, stagger, plates, duo, duoMirrored } = spreadOf(articles);
  const card = (article: Article, key: number, sizes: string) => (
    <ArticleCard key={key} article={article} locale={locale} layout="list" sizes={sizes} />
  );

  return (
    <div className="flex flex-col gap-12 px-4 pb-6 md:gap-24 md:px-10">
      {cover && <Cover article={cover} />}

      {stagger.length > 0 && (
        <div className="grid gap-x-6 gap-y-12 lg:grid-cols-12">
          {/* Rows on a phone ... */}
          <div className="md:hidden">
            {stagger.map((article, i) => (
              <div key={i} className="border-b border-line last:border-b-0">
                {card(article, i, "137px")}
              </div>
            ))}
          </div>
          {/* ... and from 768 two columns, the second 128 lower */}
          <div className="hidden gap-x-6 md:grid md:grid-cols-2 lg:col-span-8">
            <div className="flex flex-col gap-16">
              {[stagger[0], stagger[2]].filter(Boolean).map((article, i) => card(article, i, "437px"))}
            </div>
            <div className="flex flex-col gap-16 md:mt-32">
              {[stagger[1], stagger[3]].filter(Boolean).map((article, i) => card(article, i, "437px"))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <Rail news={news} locale={locale} />
          </div>
        </div>
      )}

      {plates.length > 0 && (
        <div className="-mx-4 flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:grid md:snap-none md:grid-cols-3 md:items-start md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {plates.map((article, i) => (
            <Plate key={i} article={article} tone={PLATES[i % PLATES.length]} />
          ))}
        </div>
      )}

      {duo.length > 0 && (
        <div className="grid items-start gap-x-6 max-md:divide-y max-md:divide-line md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-8">{card(duo[0], 0, "898px")}</div>
          {duo[1] && <div className="lg:col-span-4">{card(duo[1], 1, "437px")}</div>}
        </div>
      )}

      {duoMirrored.length > 0 && (
        <div className="grid items-start gap-x-6 max-md:divide-y max-md:divide-line md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">{card(duoMirrored[0], 0, "437px")}</div>
          {duoMirrored[1] && <div className="lg:col-span-8">{card(duoMirrored[1], 1, "898px")}</div>}
        </div>
      )}
    </div>
  );
}
