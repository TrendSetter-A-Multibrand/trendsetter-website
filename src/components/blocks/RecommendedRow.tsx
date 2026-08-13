"use client";

import { useRef } from "react";
import { ArticleCard } from "@/components/blocks/ArticleCard";
import type { Article } from "@/lib/articles";

/**
 * Four 430 cards under a heading, with the arrows the mockup puts at the right
 * of it. There are more cards than fit, so the arrows walk the row along by one
 * card at a time rather than sitting there for decoration.
 */
export function RecommendedRow({
  heading = "Рекомендованные материалы",
  articles,
}: {
  heading?: string;
  articles: Article[];
}) {
  const row = useRef<HTMLDivElement>(null);

  const step = (direction: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    // One card plus the gap between them
    const card = el.firstElementChild?.getBoundingClientRect().width ?? 430;
    el.scrollBy({ left: direction * (card + 40), behavior: "smooth" });
  };

  return (
    <section className="px-6 py-5 lg:px-10">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xl uppercase tracking-[3px] lg:text-2xl">
          [{heading}]
        </h2>

        <div className="flex gap-10">
          <button type="button" aria-label="Назад" onClick={() => step(-1)}>
            <Arrow className="rotate-180" />
          </button>
          <button type="button" aria-label="Вперёд" onClick={() => step(1)}>
            <Arrow />
          </button>
        </div>
      </div>

      <div
        ref={row}
        className="mt-10 flex snap-x gap-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((article, i) => (
          <div
            key={i}
            className="w-[280px] shrink-0 snap-start sm:w-[360px] lg:w-[430px]"
          >
            <ArticleCard article={article} sizes="430px" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M0 12h22M13 3l9 9-9 9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
