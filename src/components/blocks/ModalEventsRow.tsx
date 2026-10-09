"use client";

import { useRef } from "react";
import { EventCard } from "@/components/blocks/EventCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useCarousel } from "@/lib/useCarousel";
import type { Event } from "@/lib/events";

/**
 * «Предстоящие мероприятия» inside a sheet: the library's Title with the red
 * block riding its rule, and the event cards in one row under it - 544x402 with
 * 38 between on lg (two show, the rest scroll sideways), nearly the full width
 * at 375 where the title is shortened to «Мероприятия» and the row swipes with
 * a snap. The scrolling and the bar are the home rows' own (useCarousel,
 * SectionTitle), only the cards' size, the thin bar (1px, 52) and the
 * snap on lg too (by a card's left edge) are this sheet's. Nothing is drawn for an
 * empty list.
 */
export function ModalEventsRow({ events }: { events: Event[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  useCarousel(trackRef);

  if (!events.length) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="px-6 lg:px-10">
        <div className="max-lg:hidden">
          <SectionTitle heading="Предстоящие мероприятия" trackRef={trackRef} controls="bar" thin />
        </div>
        <div className="lg:hidden">
          <SectionTitle heading="Мероприятия" />
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 lg:scroll-px-10 lg:gap-[38px] lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {events.map((event) => (
          <EventCard
            key={event.uuid}
            item={event}
            href={event.href}
            sizes="(min-width: 1024px) 544px, 85vw"
            className="h-[300px] w-[85%] shrink-0 snap-center lg:snap-start lg:h-[402px] lg:w-[544px]"
          />
        ))}
      </div>
    </section>
  );
}
