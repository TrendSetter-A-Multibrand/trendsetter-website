import type { Metadata } from "next";
import Image from "next/image";
import { isLocale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";
import { ArticleHeader } from "@/components/blocks/ArticleHeader";
import { ArticleBody } from "@/components/blocks/ArticleBody";
import { ArticleReactions } from "@/components/blocks/ArticleReactions";
import { RelatedArticles } from "@/components/blocks/RelatedArticles";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { fetchArticlePage, fetchArticles } from "@/lib/storyblok/articles";
import { seo } from "@/lib/seo";
import { ArticleEventCta } from "@/components/blocks/ArticleEventCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchArticlePage(slug);
  if (!article) return {};

  // The piece's own photograph is what a link to it should carry, not the site's
  return seo({
    title: article.meta.title,
    description: article.meta.excerpt,
    image: article.meta.heroImage,
    path: `/journal/${slug}`,
    locale,
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [article, articles] = await Promise.all([
    fetchArticlePage(slug),
    fetchArticles(locale),
  ]);
  if (!article) notFound();
  const { meta, blocks } = article;

  return (
    <>
      <ArticleHeader locale={locale} meta={meta} />

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
        {meta.event && <ArticleEventCta event={meta.event} />}
      </div>

      {/* The file stacks the blocks 40 apart, and the hero at the same distance */}
      <div className="mt-10">
        <ArticleBody blocks={blocks} />
      </div>

      <ArticleReactions articleId={slug} likes={12} dislikes={0} />
      <RelatedArticles
        articles={articles.filter((other) => other.title !== meta.title)}
        locale={locale}
      />
    </>
  );
}
