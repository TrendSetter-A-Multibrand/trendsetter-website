import type { Metadata } from "next";
import Image from "next/image";
import { isLocale } from "@/lib/i18n/locales";
import { notFound, permanentRedirect } from "next/navigation";
import { ArticleHeader } from "@/components/blocks/ArticleHeader";
import { ArticleBody } from "@/components/blocks/ArticleBody";
import { ArticleReactions } from "@/components/blocks/ArticleReactions";
import { NextMaterial } from "@/components/blocks/NextMaterial";
import { ReadingProgress } from "@/components/blocks/ReadingProgress";
import { RelatedArticles } from "@/components/blocks/RelatedArticles";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { fetchArticlePage, fetchArticles } from "@/lib/storyblok/articles";
import { seo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchArticlePage(slug, locale);
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
    fetchArticlePage(slug, locale),
    fetchArticles(locale),
  ]);
  if (!article) notFound();
  // An event has its own page; the old address keeps working
  if (article.meta.event) permanentRedirect(`/${locale}/events/${slug}`);
  const { meta, blocks } = article;

  // The piece that follows: the next one in the same section, if there is one
  const others = articles.filter((other) => other.title !== meta.title);
  const next = others.find((other) => other.section === (meta.sectionHref === "journal" ? "journal" : "news")) ?? others[0];

  return (
    <>
      <ReadingProgress targetId="article" />
      <article id="article">
        <ArticleHeader locale={locale} meta={meta} />

        {/* 1000 wide and 16:9 on a desktop, edge to edge and 4:3 on a phone */}
        <div className="mx-auto w-full max-w-[1000px] md:px-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface md:aspect-video">
            <ImagePlaceholder />
            <Image
              src={meta.heroImage}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 1000px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="pt-6 md:pt-16">
          <ArticleBody blocks={blocks} locale={locale} />
        </div>

        {next && (
          <div className="mt-6 px-4 md:mt-12 md:px-0">
            <NextMaterial href={next.href ?? "#"} title={next.title} image={next.image} />
          </div>
        )}
      </article>

      <ArticleReactions articleId={slug} likes={12} dislikes={0} />
      <RelatedArticles articles={others} locale={locale} />
    </>
  );
}
