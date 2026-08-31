"use client";

import { useRef } from "react";
import { ArticleCard } from "@/components/blocks/ArticleCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { Article } from "@/lib/articles";
import { useCarousel } from "@/lib/useCarousel";

/**
 * 430 cards under a heading with the file's slider bar over them. There are more
 * cards than fit, so the row scrolls: by drag, by the bar, or on its own.
 *
 * No scroll snapping. The bar writes the scroll position directly, and snapping
 * would pull it to the nearest card after every write - which reads as the bar
 * juddering under the hand.
 */
export function RecommendedRow({
  heading = "Рекомендованные материалы",
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
    <section className="px-6 py-5 lg:px-10">
      <SectionTitle heading={heading} trackRef={row} controls="bar" />

      <div
        ref={row}
        className="mt-10 flex gap-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((article, i) => (
          <div
            key={i}
            className="w-[280px] shrink-0 sm:w-[360px] lg:w-[430px]"
          >
            <ArticleCard article={article} locale={locale} sizes="430px" />
          </div>
        ))}
      </div>
    </section>
  );
}
