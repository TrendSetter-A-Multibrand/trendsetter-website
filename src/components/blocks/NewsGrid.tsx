"use client";

import { useRef } from "react";
import { CardS } from "@/components/cards/CardS";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useCarousel } from "@/lib/useCarousel";
import { tagHref } from "@/lib/articles";
import { useLocale } from "@/lib/i18n/useLocale";

type NewsItem = {
  tags: string[];
  title: string;
  href?: string;
  image?: string;
  readingMinutes?: number;
};

type NewsGridProps = {
  heading?: string;
  items: NewsItem[];
  /**
   * The 404 draws the row straight under the empty state: no air above the
   * heading, and at 375 a 320 card on a 16 gap so the next one peeks out.
   */
  underHero?: boolean;
};

export function NewsGrid({
  heading = "Последние новости",
  items,
  underHero,
}: NewsGridProps) {
  const locale = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);

  // Dragging the row and the row walking on by itself both move the same scroll
  // position the red block is already following, so it keeps up either way
  useCarousel(trackRef, { autoplay: true });

  // No records, no row: a heading over a blank strip is worse than nothing.
  // The shops section already answers this way.
  if (items.length === 0) return null;

  return (
    <section
      className={`px-4 md:px-10 ${underHero ? "pt-0" : "pt-8 md:pt-16"}`}
    >
      {/* The file leaves 40 from the heading to the row, and 120 above the block */}
      <SectionTitle
        heading={heading}
        trackRef={trackRef}
        controls="arrows"
        className={underHero ? "mb-6 md:mb-8" : "mb-6 md:mb-8"}
      />

      <div
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 max-sm:scroll-pl-4 sm:mx-0 sm:snap-none sm:gap-6 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          // Photo and title lead to the piece, each tag to the news page cut
          // down to that tag - the card draws all three
          <div
            key={i}
            className="w-[280px] shrink-0 snap-start sm:w-[calc(50%-12px)] sm:snap-align-none lg:w-[calc((100%-48px)/3)]"
          >
            <CardS
              href={item.href ?? "#"}
              title={item.title}
              image={item.image}
              tags={item.tags.map((tag) => ({
                label: tag,
                href: tagHref(locale, "news", tag),
              }))}
              minutes={item.readingMinutes}
              sizes="(min-width: 1024px) 437px, (min-width: 640px) 50vw, 280px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
