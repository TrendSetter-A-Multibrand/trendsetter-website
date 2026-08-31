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
 * No scroll snapping, for the same reason the recommended row has none: the bar
 * writes the scroll position directly and snapping would judder under the hand.
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

  return (
    <section className="px-6 py-16 lg:px-10">
      <SectionTitle
        heading={heading}
        trackRef={row}
        controls="bar"
        className="mb-8"
      />

      <div
        ref={row}
        className="flex gap-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((article, i) => (
          <div key={i} className="w-[280px] shrink-0 sm:w-[360px] lg:w-[430px]">
            <ArticleCard
              article={article}
              locale={locale}
              sizes="(min-width: 1024px) 430px, (min-width: 640px) 360px, 280px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
