"use client";

import { useRef } from "react";
import Image from "next/image";

type EventItem = {
  day: string;
  month: string;
  time: string;
  title: string;
  location: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
};

type EventsCarouselProps = {
  heading?: string;
  items?: EventItem[];
};

const BASE_ITEMS: EventItem[] = [
  {
    day: "27",
    month: "июл",
    time: "18:00",
    title: "Мастер-класс",
    location: 'ТЦ "Атриум"',
    description: "Мастер-класс по лепке от известного керамиста Юрия Базанова.",
    ctaLabel: "Подробнее",
    ctaHref: "#",
    image: "/images/home/events/1.jpg",
  },
  {
    day: "3",
    month: "авг",
    time: "19:00",
    title: "Встреча книжного клуба",
    location: "Дубровка",
    description: "Обсуждаем новинки нон-фикшна вместе с гостями магазина.",
    ctaLabel: "Подробнее",
    ctaHref: "#",
    image: "/images/home/events/2.jpg",
  },
  {
    day: "10",
    month: "авг",
    time: "17:30",
    title: "Показ капсульной коллекции",
    location: 'ТЦ "Атриум"',
    description: "Первыми увидите новую капсулу до старта продаж.",
    ctaLabel: "Подробнее",
    ctaHref: "#",
    image: "/images/home/events/3.jpg",
  },
  {
    day: "16",
    month: "авг",
    time: "12:00",
    title: "Воркшоп по стайлингу",
    location: "Хлебозавод №9",
    description: "Разбираем базовый гардероб с личным стилистом.",
    ctaLabel: "Подробнее",
    ctaHref: "#",
    image: "/images/home/events/4.jpg",
  },
];

const DEFAULT_ITEMS: EventItem[] = Array.from(
  { length: 16 },
  (_, i) => BASE_ITEMS[i % BASE_ITEMS.length]
);

/** Rendered twice: at the bottom at rest, at the top between the badges on hover. */
function EventTitle({ item }: { item: EventItem }) {
  return (
    <>
      <p className="font-mono text-xl/[30px] uppercase tracking-[1px]">{item.title}</p>
      <p className="font-mono text-xl/[30px] uppercase tracking-[1px]">
        {item.location}
      </p>
    </>
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
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <section className="px-6 pt-10 lg:px-10">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="whitespace-nowrap font-mono text-2xl/[29px] uppercase tracking-[3px]">
          [{heading}]
        </h2>
        {/* Bare 22px glyphs 44px apart in the mockup - no round border */}
        <div className="flex gap-[44px]">
          <button
            type="button"
            aria-label="Назад"
            onClick={() => scroll(-1)}
            className="flex h-[22px] w-[22px] items-center justify-center text-[22px] leading-none"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Вперёд"
            onClick={() => scroll(1)}
            className="flex h-[22px] w-[22px] items-center justify-center text-[22px] leading-none"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-10 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          // 586.7x312, three across with 40px gaps
          <div
            key={i}
            className="group relative aspect-[220/117] w-[85%] shrink-0 overflow-hidden bg-neutral-800 sm:w-[calc(50%-20px)] lg:w-[calc(33.333%-26.667px)]"
          >
            {item.image ? (
              <Image src={item.image} alt="" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
            )}

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
                <p className="text-center text-sm/[17px]">{item.description}</p>
              )}
              {item.ctaLabel && (
                <a
                  href={item.ctaHref ?? "#"}
                  className="flex h-[49px] items-center justify-center bg-brand font-mono text-sm uppercase tracking-[3px]"
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
