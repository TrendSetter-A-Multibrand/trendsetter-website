"use client";

import { useRef } from "react";
import { EventCard } from "@/components/blocks/EventCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useCarousel } from "@/lib/useCarousel";
import { EVENTS, type Event } from "@/lib/events";
import { useLocale } from "@/lib/i18n/useLocale";

type EventsCarouselProps = {
  heading?: string;
  items?: Event[];
};

const DEFAULT_ITEMS: Event[] = Array.from(
  { length: 16 },
  (_, i) => EVENTS[i % EVENTS.length]
);

export function EventsCarousel({
  heading = "Ближайшие события",
  items = DEFAULT_ITEMS,
}: EventsCarouselProps) {
  const locale = useLocale();
  const trackRef = useRef<HTMLDivElement>(null);
  useCarousel(trackRef, { autoplay: true });

  return (
    <section className="px-6 pt-10 lg:px-10">
      <SectionTitle
        heading={heading}
        trackRef={trackRef}
        controls="arrows"
        className="mb-10"
      />

      <div
        ref={trackRef}
        className="flex gap-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          // 586.7 across at 1920, three of them with 40 between
          <EventCard
            key={i}
            item={item}
            href={`/${locale}/journal/${item.slug}`}
            sizes="(min-width: 1024px) 587px, (min-width: 640px) 50vw, 85vw"
            className="h-[430px] w-[85%] sm:w-[calc(50%-20px)] lg:w-[calc(33.333%-26.667px)]"
          />
        ))}
      </div>
    </section>
  );
}
