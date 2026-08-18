import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { ArticleMeta } from "@/lib/article";

type ArticleHeaderProps = {
  locale: Locale;
  meta: ArticleMeta;
  filters: string[];
};

/** Title on the left, a 180px meta column pinned to the right content edge. */
export function ArticleHeader({ locale, meta, filters }: ArticleHeaderProps) {
  return (
    <section className="px-6 pt-6 lg:px-10">
      <nav className="flex gap-2 font-mono text-sm tracking-[1px] text-ink">
        <Link href={`/${locale}`}>Главная</Link>
        <span>/</span>
        <Link href={`/${locale}/${meta.sectionHref}`} className="text-brand">
          {meta.section}
        </Link>
      </nav>

      <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:justify-between">
        <div className="lg:max-w-[1620px]">
          <div className="flex flex-wrap gap-[18px]">
            {/* Same destination a tag under a card has: the section, cut to
                that tag */}
            {filters.map((filter) => (
              <Link
                key={filter}
                href={`/${locale}/${meta.sectionHref}?tag=${encodeURIComponent(filter)}`}
                className="flex h-10 items-center rounded-full border-2 border-black px-4 font-mono text-sm uppercase text-brand"
              >
                {filter}
              </Link>
            ))}
          </div>

          <h1 className="mt-10 font-mono text-3xl uppercase tracking-[3px] text-ink lg:text-[60px] lg:leading-[84px]">
            {meta.title}
          </h1>
        </div>

        <dl className="shrink-0 font-mono text-sm text-ink lg:w-[180px]">
          <dt className="tracking-[1px]">АВТОР</dt>
          <dd className="mt-1 text-ink/70">{meta.author}</dd>

          <dt className="mt-6 tracking-[1px]">ДАТА ПУБЛИКАЦИИ</dt>
          <dd className="mt-1 text-ink/70">{meta.publishedAt}</dd>

          <dd className="mt-6 flex items-center gap-3 text-ink/70">
            <EyeIcon />
            {meta.views}
            <BookIcon />
            {meta.readingMinutes} мин
          </dd>
        </dl>
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
