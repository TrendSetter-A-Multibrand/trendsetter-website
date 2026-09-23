"use client";

import { useRef } from "react";
import { ArticleCard } from "@/components/blocks/ArticleCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { Article } from "@/lib/articles";
import { useCarousel } from "@/lib/useCarousel";

/**
 * 430 cards closing an article, on the file's slider bar. There is no fixed
 * number of them - the section carries everything related to the piece - so the
 * row scrolls instead of showing the first four.
 *
 * Below `sm` the row snaps a card at a time; the bar lifts that snap for the
 * length of a drag, since writing the scroll position directly would
 * otherwise judder against it.
 */
export function RelatedArticles({
  heading = "Похожие материалы",
  articles,
  locale,
}: {
  heading?: string;
  articles: Article[];
  locale: string;
}) {
  const row = useRef<HTMLDivElement>(null);
  useCarousel(row, { autoplay: true });

  // No records, no row: a heading over a blank strip is worse than nothing.
  // The shops section already answers this way.
  if (articles.length === 0) return null;

  return (
    <section className="px-4 py-4 lg:px-10 lg:py-16">
      <SectionTitle
        heading={heading}
        trackRef={row}
        controls="bar"
        className="mb-4 lg:mb-8"
      />

      <div
        ref={row}
        className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:mx-0 sm:snap-none sm:gap-10 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((article, i) => (
          <div
            key={i}
            className="w-full shrink-0 snap-center sm:w-[360px] sm:snap-align-none lg:w-[430px]"
          >
            <ArticleCard
              article={article}
              locale={locale}
              sizes="(min-width: 1024px) 430px, (min-width: 640px) 360px, 320px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
