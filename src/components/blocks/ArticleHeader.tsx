import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { ArticleMeta } from "@/lib/article";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { tagHref } from "@/lib/articles";
import { ArticleSignupButton } from "@/components/blocks/ArticleSignupButton";

/**
 * The file's article head: the crumbs, which end at the rubric and link it to
 * the section filtered by it - then a 1000 column centred on the page: the rubric in brackets,
 * the title in H1, the lead in Body L (Text-2) held to 640, and under a Line rule
 * one line of meta in Caption: the date and the reading time - "22 сентября 2026
 * · 5 мин чтения" - with the author before them and the views after, when the
 * editor has set them. An event's article carries the sign-up button under the
 * line.
 */
export function ArticleHeader({
  locale,
  meta,
}: {
  locale: Locale;
  meta: ArticleMeta;
}) {
  const section = meta.sectionHref === "journal" ? "journal" : "news";
  const info = [
    meta.author,
    meta.publishedAt,
    meta.readingMinutes > 0 ? `${meta.readingMinutes} мин чтения` : "",
    meta.showViews && meta.views > 0 ? `${meta.views} просмотров` : "",
  ].filter(Boolean);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: `/${locale}` },
          { label: meta.section, href: `/${locale}/${meta.sectionHref}` },
          // The trail stops at the rubric, which leads to the section filtered by
          // it; the title is right below in H1 and was cut off up here anyway
          ...(meta.tags[0] ? [{ label: meta.tags[0], href: tagHref(locale, section, meta.tags[0]) }] : []),
        ]}
      />

      <header className="mx-auto flex w-full max-w-[1000px] flex-col gap-4 px-4 pb-6 pt-6 md:gap-6 md:px-0 md:pb-[72px] md:pt-16">
        {meta.tags.length > 0 && (
          <p className="type-caption text-ink">
            {meta.tags.slice(0, 1).map((tag) => (
              <Link key={tag} href={tagHref(locale, section, tag)} className="hover:underline">
                [{tag}]
              </Link>
            ))}
          </p>
        )}

        <h1 className="type-h1 text-ink">{meta.title}</h1>

        {meta.excerpt && <p className="type-body-l max-w-[640px] text-text-2">{meta.excerpt}</p>}

        <div className="flex flex-col gap-4 border-t border-line pt-4">
          <p className="type-caption text-ink">{info.join(" · ")}</p>
          <ArticleSignupButton event={meta.event} locale={locale} />
        </div>
      </header>
    </>
  );
}
