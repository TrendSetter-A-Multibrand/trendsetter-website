"use client";

import { useRef } from "react";
import { EventCard } from "@/components/blocks/EventCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useCarousel } from "@/lib/useCarousel";
import type { Event } from "@/lib/events";
import { useLocale } from "@/lib/i18n/useLocale";

type EventsCarouselProps = {
  heading?: string;
  items: Event[];
};

export function EventsCarousel({
  heading = "Ближайшие события",
  items,
}: EventsCarouselProps) {
  const locale = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);
  useCarousel(trackRef, { autoplay: true });

  // No records, no row: a heading over a blank strip is worse than nothing.
  // The shops section already answers this way.
  if (items.length === 0) return null;

  return (
    <section className="px-4 pt-10 lg:px-10">
      <SectionTitle
        heading={heading}
        trackRef={trackRef}
        controls="arrows"
        className="mb-6 lg:mb-10"
      />

      <div
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:mx-0 sm:snap-none sm:gap-10 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          // 586.7 across at 1920, three of them with 40 between
          <EventCard
            key={i}
            item={item}
            href={`/${locale}/journal/${item.slug}`}
            sizes="(min-width: 1024px) 587px, (min-width: 640px) 50vw, 320px"
            className="h-[300px] w-full snap-center sm:h-[430px] sm:w-[calc(50%-20px)] sm:snap-align-none lg:w-[calc(33.333%-26.667px)]"
          />
        ))}
      </div>
    </section>
  );
}
