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
    month: "июля",
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
    month: "августа",
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
    month: "августа",
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
    month: "августа",
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
      <p className="text-xl font-semibold uppercase leading-[27px]">{item.title}</p>
      <p className="text-xl leading-[27px]">{item.location}</p>
    </>
  );
}

/**
 * 56x56, white at 40% with white content. The two badges are built differently
 * in the mockup: the date is a big day over a small month, the time is two
 * equal rows split by a 32px rule.
 */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center bg-white/40 font-mono leading-none text-white">
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
    <section className="px-6 py-16 lg:px-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="whitespace-nowrap font-mono text-xl uppercase tracking-[5px] lg:text-[30px]">
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
        className="flex gap-6 overflow-x-auto scroll-smooth lg:gap-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          // 430x312, four across with 40px gaps
          <div
            key={i}
            className="group relative aspect-[430/312] w-[85%] shrink-0 overflow-hidden bg-neutral-800 sm:w-[calc(50%-20px)] lg:w-[calc(25%-30px)]"
          >
            {item.image ? (
              <Image src={item.image} alt="" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
            )}

            {/* Only 93px tall at the bottom, and gone on hover */}
            <div className="absolute inset-x-0 bottom-0 h-[93px] bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-200 group-hover:opacity-0" />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-6">
              <Badge>
                <span className="text-xl">{item.day}</span>
                <span className="mt-1 text-[10px] uppercase">{item.month}</span>
              </Badge>

              <div className="flex-1 text-center text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <EventTitle item={item} />
              </div>

              <Badge>
                <span className="text-xl">{item.time.split(":")[0]}</span>
                <span className="my-1 h-px w-8 bg-white" />
                <span className="text-xl">{item.time.split(":")[1]}</span>
              </Badge>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 text-center text-white transition-opacity duration-200 group-hover:opacity-0">
              <EventTitle item={item} />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {item.description && (
                <p className="text-center text-xl leading-[27px]">{item.description}</p>
              )}
              {item.ctaLabel && (
                <a
                  href={item.ctaHref ?? "#"}
                  className="flex h-[49px] items-center justify-center bg-brand text-sm font-medium uppercase tracking-[0.15em]"
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
