"use client";

import { useRef } from "react";
import Image from "next/image";

type JournalItem = {
  tags: string[];
  title: string;
  excerpt?: string;
  href?: string;
  image?: string;
};

type JournalCarouselProps = {
  heading?: string;
  items?: JournalItem[];
};

const BASE_ITEMS: JournalItem[] = [
  {
    tags: ["Мода", "Тренды"],
    title:
      "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона",
    excerpt:
      "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона",
  },
  {
    tags: ["Впечатления", "Дом"],
    title:
      "Не только Dolce&Gabbana: home-коллекции модных брендов, о которых мы могли не знать",
  },
  {
    tags: ["Красота", "Косметика"],
    title: "Что положить в косметичку: 8 уходовых средств на все случаи жизни",
  },
  {
    tags: ["Комьюнити", "Общество"],
    title:
      "Карабин, плёнка и Тарковский: как «нишевость» и стремление быть «не как все» превратились в мем",
  },
];

const DEFAULT_ITEMS: JournalItem[] = Array.from(
  { length: 16 },
  (_, i) => BASE_ITEMS[i % BASE_ITEMS.length]
);

export function JournalCarousel({
  heading = "Журнал",
  items = DEFAULT_ITEMS,
}: JournalCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <section className="px-6 py-16 lg:px-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em]">
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
          <a
            key={i}
            href={item.href ?? "#"}
            className="group relative aspect-[4/3] w-[85%] shrink-0 overflow-hidden bg-neutral-800 sm:aspect-[2/1] sm:w-[calc(50%-12px)]"
          >
            {item.image ? (
              <Image src={item.image} alt="" fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <p className="absolute left-4 top-4 text-xs font-semibold uppercase tracking-wide text-white">
              {item.tags.map((tag) => `[${tag}]`).join(" ")}
            </p>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 text-white">
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold leading-snug sm:text-lg">
                  {item.title}
                </p>
                {item.excerpt && (
                  <p className="hidden text-sm text-white/80 sm:block">{item.excerpt}</p>
                )}
              </div>
              <span className="w-fit -translate-y-2 rounded-full bg-white/20 px-4 py-2 text-xs font-medium uppercase tracking-wide text-white opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                Читать
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
