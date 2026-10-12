import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { ArticleMeta } from "@/lib/article";
import { FilterChip } from "@/components/ui/FilterChip";
import { tagHref } from "@/lib/articles";
import { ArticleSignupButton } from "@/components/blocks/ArticleSignupButton";

const META_LABEL =
  "text-xs tracking-[1px] text-muted lg:font-mono lg:text-sm/[18px] lg:font-medium lg:uppercase lg:text-ink lg:tracking-normal";
const META_VALUE = "text-xs/[15px] tracking-[1px] text-muted lg:mt-1 lg:text-sm/[18px] lg:tracking-normal";

type ArticleHeaderProps = {
  locale: Locale;
  meta: ArticleMeta;
};

/** Title on the left, one row of meta pinned to the right content edge. */
export function ArticleHeader({ locale, meta }: ArticleHeaderProps) {
  return (
    <section className="px-4 pt-4 pb-5 lg:px-10 lg:pt-6 lg:pb-0">
      <nav className="flex gap-2 font-mono text-sm tracking-[1px] text-ink">
        <Link href={`/${locale}`}>Главная</Link>
        <span>/</span>
        <Link href={`/${locale}/${meta.sectionHref}`} className="text-brand">
          {meta.section}
        </Link>
      </nav>

      <div className="mt-4 flex flex-col gap-4 lg:mt-5 lg:flex-row lg:items-end lg:gap-10">
        <div className="flex flex-1 flex-col gap-4 lg:gap-10">
          {/* The article's own tags, not a list of its own - and each one leads
              where the same tag under a card leads. 8 apart here, not the 16
              the section pages use. */}
          <div className="flex flex-wrap gap-2 max-lg:hidden">
            {meta.tags.map((tag) => (
              <FilterChip
                key={tag}
                label={tag}
                href={tagHref(locale, meta.sectionHref === "journal" ? "journal" : "news", tag)}
              />
            ))}
          </div>

          {/* At 375 the file drops the chips for the card's red tag line */}
          <p className="flex flex-wrap gap-x-2 font-mono text-xs/[16px] font-medium uppercase tracking-[1px] text-brand lg:hidden">
            {meta.tags.map((tag) => (
              <Link
                key={tag}
                href={tagHref(
                  locale,
                  meta.sectionHref === "journal" ? "journal" : "news",
                  tag,
                )}
              >
                [{tag}]
              </Link>
            ))}
          </p>

          <h1 className="font-mono text-2xl normal-case tracking-[1px] text-ink lg:text-[40px]/[48px]">
            {meta.title}
          </h1>
        </div>

        {/* One row at the title's baseline edge, gap 16, the values Inter Tight 14
            in grey under mono labels; the sign-up button hangs under it, so the
            row and the button stack in a column. On mobile the row collapses to two stacked rows with the label and
            value inline, wrapping onto a second line for a long author name. */}
        <div className="flex shrink-0 flex-col lg:items-end">
          <dl className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 lg:flex lg:items-end lg:gap-4">
            <div className="flex items-baseline gap-1 lg:block">
              <dt className={META_LABEL}>
                Автор<span className="lg:hidden">:</span>
              </dt>
              <dd className={META_VALUE}>{meta.author}</dd>
            </div>

            <div>
              <dt className={`${META_LABEL} max-lg:hidden`}>Дата публикации</dt>
              <dd className={META_VALUE}>{meta.publishedAt}</dd>
            </div>

            {/* Reading time and views: the icon rides the label row, its figure under it */}
            <div className="hidden items-start gap-4 lg:flex">
              <div className="flex flex-col items-center">
                <dt className="flex h-[18px] items-center text-ink">
                  <BookIcon />
                  <span className="sr-only">Время чтения</span>
                </dt>
                <dd className={META_VALUE}>{meta.readingMinutes} мин</dd>
              </div>
              <div className="flex flex-col items-center">
                <dt className="flex h-[18px] items-center text-ink">
                  <EyeIcon />
                  <span className="sr-only">Просмотры</span>
                </dt>
                <dd className={META_VALUE}>{meta.views}</dd>
              </div>
            </div>
          </dl>

          <ArticleSignupButton event={meta.event} locale={locale} />
        </div>
      </div>
    </section>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
      <path
        d="M1 7s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="10" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2 3h5a2 2 0 0 1 2 2v10a2 2 0 0 0-2-2H2V3Zm14 0h-5a2 2 0 0 0-2 2v10a2 2 0 0 1 2-2h5V3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
