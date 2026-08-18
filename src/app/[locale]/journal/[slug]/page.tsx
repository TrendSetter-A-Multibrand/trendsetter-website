import Image from "next/image";
import { isLocale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";
import { ArticleHeader } from "@/components/blocks/ArticleHeader";
import { ArticleBody } from "@/components/blocks/ArticleBody";
import { ArticleReactions } from "@/components/blocks/ArticleReactions";
import { RelatedArticles } from "@/components/blocks/RelatedArticles";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PLACEHOLDER_ARTICLE } from "@/lib/article";
import { PLACEHOLDER_ARTICLES } from "@/lib/articles";
import { ArticleEventCta } from "@/components/blocks/ArticleEventCta";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const { meta, blocks } = PLACEHOLDER_ARTICLE;

  return (
    <>
      <ArticleHeader locale={locale} meta={meta} />

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
        {meta.event && <ArticleEventCta event={meta.event} />}
      </div>

      {/* The file stacks the blocks 40 apart, and the hero at the same distance */}
      <div className="mt-10">
        <ArticleBody blocks={blocks} />
      </div>

      <ArticleReactions articleId={slug} likes={12} dislikes={0} />
      <RelatedArticles articles={PLACEHOLDER_ARTICLES} locale={locale} />
    </>
  );
}
