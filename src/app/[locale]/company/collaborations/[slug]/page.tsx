import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { ArticleHeader } from "@/components/blocks/ArticleHeader";
import { ArticleBody } from "@/components/blocks/ArticleBody";
import { ArticleReactions } from "@/components/blocks/ArticleReactions";
import { RelatedArticles } from "@/components/blocks/RelatedArticles";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { articleFor } from "@/lib/article";
import { PLACEHOLDER_ARTICLES } from "@/lib/articles";

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

  const { meta, blocks } = articleFor(slug);
  const own = {
    ...meta,
    section: "Коллаборации",
    sectionHref: "company/collaborations",
  };

  return (
    <>
      <ArticleHeader locale={locale} meta={own} />

      <div className="relative mt-10 h-[940px] w-full overflow-hidden">
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
      <RelatedArticles articles={PLACEHOLDER_ARTICLES} locale={locale} />
    </>
  );
}
