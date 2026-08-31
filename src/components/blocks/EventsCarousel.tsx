"use client";

import { useRef } from "react";
import { buttonClass } from "@/components/ui/Button";
import { CardImage } from "@/components/ui/CardImage";
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

/**
 * Rendered twice: at the bottom at rest, at the top between the badges on hover.
 * Geist Mono 500 on a 26 line with 4 between the two of them.
 */
function EventTitle({ item }: { item: Event }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-xl/[26px] font-medium uppercase tracking-[1px]">
        {item.title}
      </p>
      <p className="font-mono text-xl/[26px] font-medium uppercase tracking-[1px]">
        {item.location}
      </p>
    </div>
  );
}

/**
 * 56x56, white at 40% over a 2px backdrop blur, with white content. The 12px
 * side padding is what makes the time rule 32px wide. The two badges are built
 * differently in the mockup: the date is a big day over a small month, the time
 * is two equal rows split by that rule.
 */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center bg-white/40 px-3 font-mono leading-none text-white backdrop-blur-[2px]">
      {children}
    </div>
  );
}

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
        className="mb-6 pb-5"
      />

      <div
        ref={trackRef}
        className="flex gap-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          // 586.7x312, three across with 40px gaps
          <div
            key={i}
            className="on-dark group relative aspect-[220/117] w-[85%] shrink-0 overflow-hidden sm:w-[calc(50%-20px)] lg:w-[calc(33.333%-26.667px)]"
          >
            <CardImage src={item.image} sizes="(min-width: 1024px) 587px, (min-width: 640px) 50vw, 85vw" />

            {/* At rest the bottom half fades to #252120 at 60%. On hover that
                gives way to the same 49% black the header photos carry - the
                mockup ships the hovered card as a separately darkened copy of
                the photo, and it measures at half the exposure. */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent transition-opacity duration-200 group-hover:opacity-0" />
            <div className="absolute inset-0 bg-black/[0.49] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-6">
              <Badge>
                {/* leading-none has to sit here, not on the Badge: text-xl sets
                    its own 28px line-height, which would overflow the 56px plate */}
                <span className="text-xl leading-none tracking-[3px]">
                  {item.day}
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[3px]">
                  {item.month}
                </span>
              </Badge>

              <div className="flex-1 text-center text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <EventTitle item={item} />
              </div>

              <Badge>
                <span className="text-xl leading-none tracking-[3px]">
                  {item.time.split(":")[0]}
                </span>
                <span className="my-1 h-px w-full bg-white" />
                <span className="text-xl leading-none tracking-[3px]">
                  {item.time.split(":")[1]}
                </span>
              </Badge>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 text-center text-white transition-opacity duration-200 group-hover:opacity-0">
              <EventTitle item={item} />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-7 p-6 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {item.description && (
                <p className="text-center text-sm/[17px] font-medium">
                  {item.description}
                </p>
              )}
              {item.ctaLabel && (
                <a
                  href={`/${locale}/journal/${item.slug}`}
                  className={buttonClass("primary")}
                >
                  {item.ctaLabel}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
