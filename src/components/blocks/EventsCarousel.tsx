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
      <p className="text-sm font-semibold uppercase tracking-wide">{item.title}</p>
      <p className="text-xs uppercase tracking-wide text-white/80">{item.location}</p>
    </>
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
        <h2 className="whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em]">
          [{heading}]
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Назад"
            onClick={() => scroll(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Вперёд"
            onClick={() => scroll(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/20"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="group relative aspect-[4/3] w-80 shrink-0 overflow-hidden bg-neutral-800"
          >
            {item.image ? (
              <Image src={item.image} alt="" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
              <div className="w-14 shrink-0 bg-white/80 px-2 py-1 text-center font-mono text-xs leading-tight text-ink">
                <div className="text-base font-semibold">{item.day}</div>
                <div className="uppercase">{item.month}</div>
              </div>

              <div className="flex-1 pt-1 text-center text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <EventTitle item={item} />
              </div>

              <div className="w-14 shrink-0 bg-white/80 px-2 py-1 text-center font-mono text-xs leading-tight text-ink">
                <div className="text-base font-semibold">{item.time.split(":")[0]}</div>
                <div className="border-t border-neutral-900/20 pt-0.5">
                  {item.time.split(":")[1]}
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 text-center text-white transition-opacity duration-200 group-hover:opacity-0">
              <EventTitle item={item} />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {item.description && (
                <p className="text-center text-xs leading-snug">{item.description}</p>
              )}
              {item.ctaLabel && (
                <a
                  href={item.ctaHref ?? "#"}
                  className="bg-brand px-4 py-2 text-center text-xs font-medium uppercase tracking-wide"
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
