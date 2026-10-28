import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { ArticleMeta } from "@/lib/article";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { tagHref } from "@/lib/articles";
import { ArticleSignupButton } from "@/components/blocks/ArticleSignupButton";

/**
 * The file's article head: the crumbs, then a 1000 column centred on the page -
 * the rubrics in brackets, the title in H1, the lead in Body L held to 640, and
 * one line of meta in Caption: the author, the date, the reading time and, if the
 * editor leaves it on, the views. An event's article carries the sign-up button
 * under the line.
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
    meta.readingMinutes > 0 ? `${meta.readingMinutes} мин` : "",
    meta.showViews && meta.views > 0 ? `${meta.views} просмотров` : "",
  ].filter(Boolean);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: `/${locale}` },
          { label: meta.section, href: `/${locale}/${meta.sectionHref}` },
          { label: meta.title },
        ]}
      />

      <header className="mx-auto flex w-full max-w-[1000px] flex-col gap-4 px-4 pb-6 pt-6 md:gap-6 md:px-0 md:pb-6 md:pt-16">
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

        {meta.excerpt && <p className="type-body-l max-w-[640px] text-ink">{meta.excerpt}</p>}

        <div className="mt-2 flex flex-col gap-4 md:mt-4">
          <p className="type-caption text-ink">{info.join(" · ")}</p>
          <ArticleSignupButton event={meta.event} locale={locale} />
        </div>
      </header>
    </>
  );
}
