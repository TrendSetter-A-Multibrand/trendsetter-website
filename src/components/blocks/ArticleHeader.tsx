import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { ArticleMeta } from "@/lib/article";
import { FilterChip } from "@/components/ui/FilterChip";
import { tagHref } from "@/lib/articles";

const META_LABEL = "font-mono text-sm/[18px] font-medium uppercase text-ink";
const META_VALUE = "mt-1 text-xs/[15px] tracking-[1px] text-muted";

type ArticleHeaderProps = {
  locale: Locale;
  meta: ArticleMeta;
};

/** Title on the left, a 160px meta column pinned to the right content edge. */
export function ArticleHeader({ locale, meta }: ArticleHeaderProps) {
  return (
    <section className="px-6 pt-6 lg:px-10">
      <nav className="flex gap-2 font-mono text-sm tracking-[1px] text-ink">
        <Link href={`/${locale}`}>Главная</Link>
        <span>/</span>
        <Link href={`/${locale}/${meta.sectionHref}`} className="text-brand">
          {meta.section}
        </Link>
      </nav>

      <div className="mt-5 flex flex-col gap-10 lg:flex-row lg:gap-40">
        <div className="flex flex-1 flex-col gap-10">
          {/* The article's own tags, not a list of its own - and each one leads
              where the same tag under a card leads. 8 apart here, not the 16
              the section pages use. */}
          <div className="flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <FilterChip
                key={tag}
                label={tag}
                href={tagHref(locale, meta.sectionHref === "journal" ? "journal" : "news", tag)}
              />
            ))}
          </div>

          <h1 className="font-mono text-3xl uppercase tracking-[3px] text-ink lg:text-[60px]/[80px]">
            {meta.title}
          </h1>
        </div>

        {/* 160 wide, and the values are Inter Tight 12 in grey under mono labels */}
        <dl className="shrink-0 lg:w-40">
          <dt className={META_LABEL}>Автор</dt>
          <dd className={META_VALUE}>{meta.author}</dd>

          <dt className={`mt-4 ${META_LABEL}`}>Дата публикации</dt>
          <dd className={META_VALUE}>{meta.publishedAt}</dd>

          <dd className="mt-4 flex items-center gap-4 text-sm/[17px] tracking-[1px] text-muted">
            <span className="flex items-center gap-1">
              <EyeIcon />
              {meta.views}
            </span>
            <span className="flex items-center gap-1">
              <BookIcon />
              {meta.readingMinutes} мин
            </span>
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
