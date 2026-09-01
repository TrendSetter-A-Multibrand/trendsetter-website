import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { ArticleHeader } from "@/components/blocks/ArticleHeader";
import { ArticleBody } from "@/components/blocks/ArticleBody";
import { ArticleReactions } from "@/components/blocks/ArticleReactions";
import { RelatedArticles } from "@/components/blocks/RelatedArticles";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { articleFor } from "@/lib/article";
import { fetchArticles } from "@/lib/storyblok/articles";

/**
 * A collaboration reads exactly like a journal piece in the file - same header,
 * same hero, same blocks - so it is the same page with its own section written
 * into the crumbs.
 */
export default async function CollaborationArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  // The page itself is still the placeholder template - collaborations are not
  // a kind of story yet - but the row under it shows real articles.
  const { meta, blocks } = articleFor(slug);
  const articles = await fetchArticles(locale);
  const own = {
    ...meta,
    section: "Коллаборации",
    sectionHref: "company/collaborations",
  };

  return (
    <>
      <ArticleHeader locale={locale} meta={own} />

      {/* 1920x940 in the file. Kept as a ratio rather than a fixed 940, which
          would be two thirds of a phone screen and most of a laptop's */}
      <div className="relative mt-10 aspect-[1920/940] w-full overflow-hidden">
        <ImagePlaceholder />
        <Image
          src={meta.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="mt-10">
        <ArticleBody blocks={blocks} />
      </div>

      <ArticleReactions articleId={slug} likes={12} dislikes={0} />
      <RelatedArticles articles={articles} locale={locale} />
    </>
  );
}
